import DOMPurify from "isomorphic-dompurify";

/**
 * Replies to a post's Mastodon toot, mirrored at build time. Everything that
 * makes a reply safe happens here; components only get sanitized strings.
 */

const INSTANCE = "https://mastodon.social";
const HANDLE = "iamrobin";
const TIMEOUT_MS = 8_000;

const MAX_REPLIES = 12;

/**
 * Longer replies (plain-text chars) are dropped and counted, not truncated:
 * cutting sanitized HTML would mean re-balancing tags.
 */
const MAX_REPLY_CHARS = 700;

/**
 * Lowercased `acct`s hidden from every thread: my personal blocks, which an
 * unauthenticated fetch can't see. To take a reply down, add it here, push and
 * run the "Daily rebuild" workflow.
 */
const DENIED_ACCTS = new Set<string>([]);

const KEEP_VISIBILITY = new Set(["public", "unlisted"]);

export interface MastodonReply {
    id: string;
    url: string;
    date: Date;
    html: string;
    authorName: string;
    authorAcct: string;
    authorUrl: string;
    isAuthor: boolean;
    /** Only when it differs from the page's language. See replyLanguage. */
    language: string | null;
    /** Content warning. Non-null puts the body behind a <details>. */
    spoiler: string | null;
    children: MastodonReply[];
}

export interface MastodonThread {
    /** Built from the id, so usable even when `ok` is false. */
    url: string;
    ok: boolean;
    branches: MastodonReply[];
    hiddenCount: number;
    favourites: number | null;
    reblogs: number | null;
}

interface MastodonAccount {
    id: string;
    acct: string;
    display_name: string;
    url: string;
    bot: boolean;
    limited?: boolean;
}

interface MastodonStatus {
    id: string;
    url: string | null;
    created_at: string;
    content: string;
    visibility: string;
    spoiler_text: string;
    language: string | null;
    in_reply_to_id: string | null;
    in_reply_to_account_id: string | null;
    favourites_count: number;
    reblogs_count: number;
    media_attachments: unknown[];
    account: MastodonAccount;
}

/** Accepts a bare id, an id with junk on it, or the whole toot URL. */
export function normalizeStatusId(raw?: string): string | null {
    // Last id-shaped segment: a copied URL can end in a #fragment.
    const segments = (raw ?? "").trim().split(/[/#?]/).filter(Boolean);
    for (const segment of segments.reverse()) {
        const digits = segment.replace(/\D/g, "");
        if (/^\d{8,}$/.test(digits)) return digits;
    }
    return null;
}

/** From the id alone, so the link works even when the API is down. */
export function threadUrl(id: string): string {
    return `${INSTANCE}/@${HANDLE}/${id}`;
}

const ALLOWED_TAGS = [
    "p",
    "br",
    "a",
    "em",
    "strong",
    "del",
    "code",
    "pre",
    "blockquote",
    "ul",
    "ol",
    "li",
];

function plainText(html: string): string {
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;|&gt;|&quot;|&#39;|&amp;/g, "x")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Made safe in three passes. `class` is stripped, not allowlisted: the site's
 * Tailwind utilities would apply to reply markup, and an allowlist hook would
 * attach to the DOMPurify singleton the RSS feed and stamps share.
 */
export function sanitizeReplyHtml(content: string): string {
    // 1. Unwrap the meaningful classes first. Regex is fine here: DOMPurify
    //    sanitizes the result next.
    const unwrapped = content
        .replace(/<span class="invisible">.*?<\/span>/gs, "")
        .replace(/<span class="ellipsis">(.*?)<\/span>/gs, "$1…");

    // 2. No `span`: DOMPurify keeps its text, so a mention collapses to a bare
    //    <a>, which step 3 matches.
    const clean = DOMPurify.sanitize(unwrapped, {
        ALLOWED_TAGS,
        ALLOWED_ATTR: ["href"],
        ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
    });

    // 3. DOMPurify's output, so `<a ` can only be a real anchor.
    return (
        clean
            // Every reply opens with the handles of everyone in the thread. A
            // Mastodon client collapses that row; here it would mean every
            // single comment starting "@iamrobin".
            .replace(/^<p>(?:<a href="[^"]*">@[^<]*<\/a>|\s|&nbsp;)+/, "<p>")
            .replace(/^<p>\s*<\/p>/, "")
            // DOMPurify strips a javascript: href but keeps the element. A
            // dead <a> would still pick up the underline style, so unwrap it.
            .replace(/<a>(.*?)<\/a>/gs, "$1")
            // ugc + nofollow: the only thing a link spammer would want here.
            .replace(
                /<a /g,
                '<a target="_blank" rel="nofollow ugc noopener noreferrer" ',
            )
    );
}

/**
 * Bidi and zero-width characters: a U+202E reverses text the commenter
 * doesn't own, and escaping doesn't stop it.
 */
const BIDI_AND_ZERO_WIDTH =
    /[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g;

/** Custom emoji are stripped: resolving them means third-party image requests. */
function displayName(account: MastodonAccount): string {
    const name = account.display_name
        .replace(/:[a-zA-Z0-9_]+:/g, "")
        .replace(BIDI_AND_ZERO_WIDTH, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 60);
    return name || `@${account.acct}`;
}

const PAGE_LANGUAGE = "en";

/**
 * Mastodon reports the poster's client language, not what they wrote (German
 * replies come back "en"). Only emit it when it differs from the page.
 */
function replyLanguage(language: string | null): string | null {
    if (!language) return null;
    return language.split("-")[0].toLowerCase() === PAGE_LANGUAGE
        ? null
        : language;
}

async function getJson<T>(path: string): Promise<T> {
    const response = await fetch(`${INSTANCE}/api/v1${path}`, {
        headers: {
            accept: "application/json",
            // Some instances block Node's default UA; a contact URL avoids that.
            "user-agent": "iamrob.in build (+https://iamrob.in)",
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    return (await response.json()) as T;
}

/** One fetch per toot per build. */
const inflight = new Map<string, Promise<MastodonThread>>();

/** Consecutive failures before the instance counts as down for the build. */
const CIRCUIT_LIMIT = 3;
let consecutiveFailures = 0;

/** `null` means the post has no toot; the component renders nothing. */
export function getMastodonThread(
    raw?: string,
): Promise<MastodonThread> | null {
    const id = normalizeStatusId(raw);
    if (!id) {
        if (raw) {
            console.warn(
                `[mastodon] unusable mastodonId: ${JSON.stringify(raw)}`,
            );
        }
        return null;
    }

    let thread = inflight.get(id);
    if (!thread) {
        thread = fetchThread(id);
        inflight.set(id, thread);
    }
    return thread;
}

function emptyThread(id: string): MastodonThread {
    return {
        url: threadUrl(id),
        ok: false,
        branches: [],
        hiddenCount: 0,
        favourites: null,
        reblogs: null,
    };
}

/** Never throws: an outage degrades to the invitation state. */
async function fetchThread(id: string): Promise<MastodonThread> {
    if (consecutiveFailures >= CIRCUIT_LIMIT) return emptyThread(id);

    // The root gives the author's account id; /context only has replies.
    const [contextResult, rootResult] = await Promise.allSettled([
        getJson<{ ancestors: MastodonStatus[]; descendants: MastodonStatus[] }>(
            `/statuses/${id}/context`,
        ),
        getJson<MastodonStatus>(`/statuses/${id}`),
    ]);

    if (contextResult.status === "rejected") {
        consecutiveFailures += 1;
        const reason = String(contextResult.reason);
        // A 404 is a wrong id in frontmatter, not an outage.
        if (reason.includes("404")) {
            console.error(
                `[mastodon] status ${id} not found — check the mastodonId in the post's frontmatter`,
            );
        } else {
            console.error(`[mastodon] thread ${id} unavailable: ${reason}`);
        }
        return emptyThread(id);
    }
    consecutiveFailures = 0;

    const root = rootResult.status === "fulfilled" ? rootResult.value : null;
    if (!root) {
        console.error(`[mastodon] status ${id} unavailable, replies only`);
    }

    const descendants = contextResult.value.descendants ?? [];

    // `ancestors` is ignored: only my own preamble could be in there.

    // Fallback: whoever direct replies answer is me, even if the root fetch failed.
    const authorId =
        root?.account.id ??
        descendants.find((s) => s.in_reply_to_id === id)
            ?.in_reply_to_account_id ??
        null;

    const kept = descendants.filter((status) => keep(status, authorId));
    const branches = buildBranches(kept, id, authorId);

    const placed = branches.reduce(
        (total, branch) => total + 1 + branch.children.length,
        0,
    );

    return {
        url: root?.url ?? threadUrl(id),
        ok: true,
        branches,
        hiddenCount: kept.length - placed,
        favourites: root?.favourites_count ?? null,
        reblogs: root?.reblogs_count ?? null,
    };
}

function keep(status: MastodonStatus, authorId: string | null): boolean {
    // Privacy guard. Redundant for unauthenticated fetches today, but it keeps a
    // future token from publishing private replies.
    if (!KEEP_VISIBILITY.has(status.visibility)) return false;

    if (status.account.bot) return false;
    if (status.account.limited) return false;
    if (DENIED_ACCTS.has(status.account.acct.toLowerCase())) return false;

    // A self-reply to my own reply just continues the announcement; drop it.
    if (
        authorId &&
        status.account.id === authorId &&
        status.in_reply_to_account_id === authorId
    ) {
        return false;
    }

    const text = plainText(sanitizeReplyHtml(status.content));

    if (!text) return false;
    if (text.length > MAX_REPLY_CHARS) return false;

    return true;
}

function toReply(status: MastodonStatus, authorId: string | null): MastodonReply {
    return {
        id: status.id,
        url: status.url ?? threadUrl(status.id),
        date: new Date(status.created_at),
        html: sanitizeReplyHtml(status.content),
        authorName: displayName(status.account),
        authorAcct: status.account.acct,
        authorUrl: status.account.url,
        isAuthor: Boolean(authorId) && status.account.id === authorId,
        language: replyLanguage(status.language),
        spoiler: status.spoiler_text.trim() || null,
        children: [],
    };
}

/**
 * Grouped, not nested: each direct reply opens a branch and everything below
 * it is flattened in time order. Branches are added whole until MAX_REPLIES.
 */
function buildBranches(
    statuses: MastodonStatus[],
    rootId: string,
    authorId: string | null,
): MastodonReply[] {
    const survivors = new Map(statuses.map((s) => [s.id, s]));

    /**
     * The nearest ancestor still on the page, so a branch survives a filtered
     * middle reply.
     */
    const branchRoot = (status: MastodonStatus): string => {
        let current = status;
        // Bounded by the chain length; survivors is finite and acyclic.
        for (let hops = 0; hops < 50; hops += 1) {
            const parentId = current.in_reply_to_id;
            if (!parentId || parentId === rootId) return current.id;
            const parent = survivors.get(parentId);
            if (!parent) return current.id;
            current = parent;
        }
        return current.id;
    };

    const byBranch = new Map<string, MastodonStatus[]>();
    for (const status of statuses) {
        const key = branchRoot(status);
        if (!byBranch.has(key)) byBranch.set(key, []);
        byBranch.get(key)!.push(status);
    }

    const oldestFirst = (a: MastodonStatus, b: MastodonStatus) =>
        a.created_at.localeCompare(b.created_at);

    const branches = [...byBranch.values()]
        .map((group) => [...group].sort(oldestFirst))
        .sort((a, b) => oldestFirst(a[0], b[0]));

    const result: MastodonReply[] = [];
    let count = 0;

    for (const group of branches) {
        if (count + group.length > MAX_REPLIES && result.length > 0) break;
        const [opener, ...rest] = group;
        result.push({
            ...toReply(opener, authorId),
            children: rest.map((status) => toReply(status, authorId)),
        });
        count += group.length;
        if (count >= MAX_REPLIES) break;
    }

    return result;
}
