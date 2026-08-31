import {
    access,
    copyFile,
    mkdir,
    readdir,
    readFile,
    rm,
    writeFile,
} from "node:fs/promises";
import path from "node:path";
import type { Loader } from "astro/loaders";

/**
 * Bookmarks come from my self-hosted linkding (Coolify, Hetzner) rather than
 * from the Obsidian export the rest of the shelf uses — saving a link is a
 * browser-extension click, and routing that through the vault only to export
 * it again bought nothing.
 *
 * What's published is what linkding calls *shared*: the share checkbox on a
 * bookmark is the gate, the way `favorite: true` was in the vault. Archived
 * bookmarks never reach the API endpoint we ask, so they can't leak.
 *
 * When linkding can't be reached, the build falls back to a snapshot of the
 * last good response — committed, at src/data/bookmarks.snapshot.json. It
 * lives in git on purpose: the Dockerfile nixpacks generates runs the build
 * as a bare `RUN npm run build` with no cache mount, so anything written
 * under node_modules/.cache is gone by the next deploy. The fallback was
 * therefore empty every single time it was needed, and a transient DNS
 * failure on the build host took two deploys down with it (2026-08-29/30).
 * Any local dev run or build refreshes the file; commit it like any other
 * change.
 *
 * Covers stay out of git — 6.5 MB of binaries that would churn on every
 * deploy for a hover preview. They're cached under
 * node_modules/.cache/linkding/covers, which means a fallback build ships
 * bookmarks without preview images. A soft dependency, deliberately.
 *
 * Covers are then mirrored into src/generated/bookmark-covers, because
 * `import.meta.glob` in utils/bookmarks.ts has to see them inside src/ for
 * astro:assets to optimise them. The cache is the source of truth; the mirror
 * is derived and gitignored.
 */

const PAGE_SIZE = 100;
/** A stop for the pagination loop — 10k bookmarks is far past anything real. */
const MAX_PAGES = 100;
const TIMEOUT_MS = 15_000;
/**
 * One blip shouldn't cost a deploy. Containers on the build host resolve
 * through an external nameserver, and a lookup that goes unanswered costs
 * glibc 10s (timeout:5 × attempts:2) before it gives up.
 */
const ATTEMPTS = 3;
const RETRY_BACKOFF_MS = 1_000;

const CACHE_DIR = path.join("node_modules", ".cache", "linkding");
/** Tracked in git — see the note above on why the cache can't be trusted. */
const SNAPSHOT_FILE = path.join("src", "data", "bookmarks.snapshot.json");
const COVER_CACHE_DIR = path.join(CACHE_DIR, "covers");
/** Mirrored here so the glob in utils/bookmarks.ts can reach them. */
const COVER_OUT_DIR = path.join("src", "generated", "bookmark-covers");

/** What astro:assets can optimise, and what the cover glob matches. */
const COVER_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
    ".gif",
]);

/** The fields we read off `GET /api/bookmarks/`; linkding sends more. */
interface LinkdingBookmark {
    id: number;
    url: string;
    title: string;
    description: string;
    website_title?: string | null;
    website_description?: string | null;
    /** Absolute in newer linkding versions; older ones only send the file. */
    preview_image_url?: string | null;
    preview_image_file?: string | null;
    is_archived?: boolean;
    shared?: boolean;
    tag_names?: string[];
    date_added: string;
}

/**
 * The shape the site consumes — matches the `bookmarks` collection schema.
 * A type alias, not an interface: `parseData` wants a `Record<string,
 * unknown>`, and only an alias picks up the implicit index signature.
 */
export type BookmarkEntry = {
    id: string;
    title: string;
    url: string;
    added: string;
    description?: string;
    tags: string[];
    /** Filename inside src/generated/bookmark-covers, or null. */
    cover: string | null;
};

function env(name: string): string | undefined {
    const value = import.meta.env[name] ?? process.env[name];
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function exists(file: string): Promise<boolean> {
    try {
        await access(file);
        return true;
    } catch {
        return false;
    }
}

/** Fall back through linkding's title fields, then the bare hostname. */
function titleOf(item: LinkdingBookmark): string {
    const candidates = [item.title, item.website_title];
    for (const candidate of candidates) {
        if (candidate?.trim()) return candidate.trim();
    }
    try {
        return new URL(item.url).hostname.replace(/^www\./, "");
    } catch {
        return item.url;
    }
}

function descriptionOf(item: LinkdingBookmark): string | undefined {
    const candidates = [item.description, item.website_description];
    for (const candidate of candidates) {
        if (candidate?.trim()) return candidate.trim();
    }
    return undefined;
}

/**
 * Preview images live at /static/<file> on the instance. Newer linkding sends
 * the whole URL, older versions only the filename — take either.
 */
function previewUrl(base: string, item: LinkdingBookmark): string | null {
    if (item.preview_image_url?.trim()) {
        return new URL(item.preview_image_url, base).href;
    }
    if (item.preview_image_file?.trim()) {
        return new URL(`/static/${item.preview_image_file.trim()}`, base).href;
    }
    return null;
}

/**
 * linkding's own preview filenames are already unique and stable per bookmark,
 * so they double as the cache key. Sanitised anyway — it's a filename coming
 * off the network.
 */
function coverFilename(url: string): string | null {
    const name = path.basename(new URL(url).pathname);
    const safe = name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const extension = path.extname(safe).toLowerCase();
    if (!safe || !COVER_EXTENSIONS.has(extension)) return null;
    return safe;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** A 4xx means the token or the endpoint is wrong; retrying only burns time. */
class NonRetryableError extends Error {}

async function fetchJson(
    url: string,
    token: string,
    logger: { warn: (message: string) => void },
): Promise<any> {
    let last: Error = new Error(`No attempt made for ${url}`);

    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
        try {
            const response = await fetch(url, {
                headers: { Authorization: `Token ${token}` },
                signal: AbortSignal.timeout(TIMEOUT_MS),
            });
            if (!response.ok) {
                const message = `${response.status} ${response.statusText} for ${url}`;
                if (response.status >= 400 && response.status < 500) {
                    throw new NonRetryableError(message);
                }
                throw new Error(message);
            }
            return await response.json();
        } catch (error) {
            if (error instanceof NonRetryableError) throw error;
            last = error as Error;
            if (attempt < ATTEMPTS) {
                const wait = RETRY_BACKOFF_MS * 2 ** (attempt - 1);
                logger.warn(
                    `linkding attempt ${attempt}/${ATTEMPTS} failed (${last.message}) — retrying in ${wait}ms`,
                );
                await sleep(wait);
            }
        }
    }

    throw last;
}

/** Every page of the (unarchived) bookmarks endpoint. */
async function fetchAll(
    base: string,
    token: string,
    logger: { warn: (message: string) => void },
): Promise<LinkdingBookmark[]> {
    const items: LinkdingBookmark[] = [];
    let next: string | null = new URL(
        `/api/bookmarks/?limit=${PAGE_SIZE}&offset=0`,
        base,
    ).href;

    for (let page = 0; next && page < MAX_PAGES; page++) {
        const data = await fetchJson(next, token, logger);
        items.push(...(data.results ?? []));
        // linkding returns an absolute `next`; resolve against the base anyway
        // so an instance behind a proxy that rewrites the host still walks.
        next = data.next ? new URL(data.next, base).href : null;
    }

    return items;
}

/**
 * Download what isn't cached yet, mirror the cache into src/, and drop files
 * neither dir needs any more — stale covers would otherwise be picked up by
 * the eager glob and re-encoded on every build.
 *
 * A null url means "cache only": the snapshot knows the filename but we have
 * no instance to ask, so a cover is used if it survived and skipped if not.
 */
async function syncCovers(
    wanted: Map<string, string | null>,
    token: string,
    logger: { warn: (message: string) => void },
): Promise<Set<string>> {
    await mkdir(COVER_CACHE_DIR, { recursive: true });
    await mkdir(COVER_OUT_DIR, { recursive: true });

    const available = new Set<string>();

    for (const [file, url] of wanted) {
        const cached = path.join(COVER_CACHE_DIR, file);

        if (!(await exists(cached))) {
            if (!url) {
                // Cache-only mode. A mirror left from an earlier build is as
                // good as the cache here — the glob only ever looks there.
                if (await exists(path.join(COVER_OUT_DIR, file))) {
                    available.add(file);
                }
                continue;
            }
            try {
                const response = await fetch(url, {
                    headers: { Authorization: `Token ${token}` },
                    signal: AbortSignal.timeout(TIMEOUT_MS),
                });
                if (!response.ok) {
                    throw new Error(
                        `${response.status} ${response.statusText}`,
                    );
                }
                await writeFile(
                    cached,
                    Buffer.from(await response.arrayBuffer()),
                );
            } catch (error) {
                // A missing cover costs a hover preview, not the page.
                logger.warn(
                    `Cover ${file} failed: ${(error as Error).message}`,
                );
                continue;
            }
        }

        await copyFile(cached, path.join(COVER_OUT_DIR, file));
        available.add(file);
    }

    for (const dir of [COVER_CACHE_DIR, COVER_OUT_DIR]) {
        for (const file of await readdir(dir)) {
            if (!wanted.has(file))
                await rm(path.join(dir, file), { force: true });
        }
    }

    return available;
}

async function readSnapshot(): Promise<BookmarkEntry[] | null> {
    try {
        return JSON.parse(await readFile(SNAPSHOT_FILE, "utf-8"));
    } catch {
        return null;
    }
}

export function linkdingLoader(): Loader {
    return {
        name: "linkding-bookmarks",

        async load({ store, logger, parseData }) {
            const base = env("LINKDING_URL");
            const token = env("LINKDING_TOKEN");

            let entries: BookmarkEntry[] | null = null;

            if (!base || !token) {
                logger.warn(
                    "LINKDING_URL / LINKDING_TOKEN not set — falling back to the cached bookmarks.",
                );
            } else {
                try {
                    const shared = (await fetchAll(base, token, logger)).filter(
                        (item) => item.shared === true && !item.is_archived,
                    );

                    // Cover URLs first, so a bookmark whose download fails is
                    // still published — just without its preview image.
                    const wanted = new Map<string, string | null>();
                    const coverByBookmark = new Map<number, string>();
                    for (const item of shared) {
                        const url = previewUrl(base, item);
                        const file = url && coverFilename(url);
                        if (!url || !file) continue;
                        wanted.set(file, url);
                        coverByBookmark.set(item.id, file);
                    }
                    const covers = await syncCovers(wanted, token, logger);

                    entries = shared
                        .map((item) => {
                            const cover = coverByBookmark.get(item.id);
                            return {
                                id: String(item.id),
                                title: titleOf(item),
                                url: item.url,
                                added: item.date_added,
                                description: descriptionOf(item),
                                tags: [...(item.tag_names ?? [])].sort(),
                                cover:
                                    cover && covers.has(cover) ? cover : null,
                            };
                        })
                        .sort((a, b) => b.added.localeCompare(a.added));

                    await mkdir(path.dirname(SNAPSHOT_FILE), {
                        recursive: true,
                    });
                    await writeFile(
                        SNAPSHOT_FILE,
                        JSON.stringify(entries, null, 2),
                    );
                    logger.info(`Loaded ${entries.length} shared bookmarks`);
                } catch (error) {
                    logger.warn(
                        `linkding unreachable (${(error as Error).message}) — falling back to the cached bookmarks.`,
                    );
                }
            }

            if (!entries) {
                entries = await readSnapshot();
                if (!entries) {
                    // No API and no cache: an empty bookmarks page would ship
                    // silently, so stop here instead.
                    throw new Error(
                        `Could not reach linkding and ${SNAPSHOT_FILE} is missing. Set LINKDING_URL and LINKDING_TOKEN, or restore the snapshot.`,
                    );
                }
                logger.info(
                    `Using ${entries.length} bookmarks from ${SNAPSHOT_FILE}`,
                );
                // The mirror is gitignored, so a fresh checkout has no covers
                // even when the cache does — refill it from the cache.
                const covers = await syncCovers(
                    new Map(
                        entries
                            .filter((entry) => entry.cover)
                            .map((entry) => [entry.cover as string, null]),
                    ),
                    token ?? "",
                    logger,
                );
                // On the build host that cache is always cold, so most covers
                // won't be there. Drop the ones nothing can resolve instead of
                // pointing the page at files the glob will never find.
                entries = entries.map((entry) =>
                    entry.cover && !covers.has(entry.cover)
                        ? { ...entry, cover: null }
                        : entry,
                );
            }

            store.clear();
            for (const entry of entries) {
                store.set({
                    id: entry.id,
                    data: await parseData({ id: entry.id, data: entry }),
                });
            }
        },
    };
}
