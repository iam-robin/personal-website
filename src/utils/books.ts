import { getCollection } from "astro:content";
import type { Book } from "./shelf";
import { hexToOklab, normaliseHex } from "./paper";
import { createSeededRandom } from "./seededRandom";

/**
 * Everything /books needs, resolved at build time. `shelf.ts` answers only
 * "what's on the shelves and how much" for the hub page; the real reading of
 * the collection lives here, the way `bookmarks.ts` serves /bookmarks.
 */

// Imported eagerly so each cover can be looked up by filename (the `cover`
// field is e.g. "book-covers/x.jpg"). Same pattern as bookmarks.ts.
const coverModules = import.meta.glob<{ default: ImageMetadata }>(
    "../../data/output/book-covers/*.{jpg,jpeg,png,webp}",
    { eager: true },
);
const coversByFile: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(coverModules)) {
    const file = path.split("/").pop();
    if (file) coversByFile[file] = mod.default;
}

/**
 * One book's `cover` field → a local image, or null. Splitting on "/" makes a
 * remote literal.club URL miss the map on its own, so books with no cover and
 * books with a remote one take the same path.
 */
export function getBookCover(
    cover: string | null | undefined,
): ImageMetadata | null {
    if (!cover) return null;
    const file = cover.split("/").pop();
    return (file && coversByFile[file]) || null;
}

export interface ShelfBook {
    id: string;
    title: string;
    /** Title with the subtitle after ":" cut — a spine holds ~40 characters. */
    spineTitle: string;
    authors: string;
    pages: number | null;
    rating: number | null;
    finished: string;
    cover: ImageMetadata | null;
    /* All three are fractions, not pixels, so the whole shelf resizes from the
       single `--shelf-h` on the row. */
    /** Of the row height — the book's thickness, and its width closed. */
    thicknessRatio: number;
    /** Of the row height — seeded, ≤ 1. Books are bottom-aligned. */
    heightRatio: number;
    /** Of the book's own height — the cover's width, and its width open. */
    coverRatio: number;
    spineColor: string;
    textColor: string;
    /** Rated 4 or better — earns a heart at the head of the spine. */
    favourite: boolean;
    /** 2 when the title overruns one line and the spine is thick enough. */
    titleLines: 1 | 2;
}

export interface ShelfYear {
    year: number;
    /** Finished, in the order they were read. */
    books: ShelfBook[];
    /** Still being read. Only ever populated on the current year. */
    reading: ShelfBook[];
}

/**
 * The nominal height every ratio above is cut against — only a reference for
 * the arithmetic. The rendered height is `--shelf-h` in ShelfRow.
 */
const SHELF_HEIGHT = 216;

/**
 * The median of the books that *do* report a page count. Eight finished books
 * export `pages: 0`; clamping those to the thinnest spine would line them all
 * up as the slimmest volumes on the shelf, stating something about the books
 * rather than admitting a gap in the data.
 */
const PAGES_FALLBACK = 250;

/*
  Title layout. RENDERED_SHELF_H is `--shelf-h` from ShelfRow in px, and is the
  one number here to keep in sync by hand: the spine's font-size is clamped at
  13px, so characters-per-line is not scale-invariant and can't be a ratio.
*/
const RENDERED_SHELF_H = 264; // 16.5rem
const TITLE_FONT = 13;
const TITLE_LINE = 1.35;
/** Fira Mono's advance width, in em. */
const MONO_ADVANCE = 0.6;
/** Breathing room at each end of the spine, and to either side of the text. */
const TITLE_PAD_BLOCK = 24;
const TITLE_PAD_INLINE = 8;

/** Characters that fit along a spine before it needs a second line. */
const CHARS_PER_LINE = Math.floor(
    (RENDERED_SHELF_H * 0.97 - TITLE_PAD_BLOCK) / (TITLE_FONT * MONO_ADVANCE),
);

/** Thickness (in reference units) that fits two lines clear of the edges. */
const TWO_LINE_THICKNESS =
    ((2 * TITLE_LINE * TITLE_FONT + TITLE_PAD_INLINE) * SHELF_HEIGHT) /
    RENDERED_SHELF_H;

/**
 * Below this the title and its spine read as the same lightness, which is what
 * legibility rides on — a mid-grey title on a mid-grey spine is unreadable
 * however far apart their hues are.
 */
const TEXT_DELTA_L = 0.14;

/** oklab lightness distance between two hexes, short forms included. */
function deltaL(a: string, b: string): number {
    return Math.abs(
        hexToOklab(normaliseHex(a))[0] - hexToOklab(normaliseHex(b))[0],
    );
}

/** The export has authors like "Alan             Moore". */
export function formatAuthors(authors: string[]): string {
    return authors
        .map((a) => a.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join(" & ");
}

function toNumber(value: unknown): number | null {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
}

function resolve(book: Book): ShelfBook {
    const pages = toNumber(book.data.pages);
    const cover = getBookCover(book.data.cover);

    // Seeded from the id so a rebuild stands every book back up at the same
    // height. The only draw, so anything added here must come after it.
    const rand = createSeededRandom(book.id);
    const heightRatio = 0.94 + rand() * 0.06;

    // In reference units (see SHELF_HEIGHT), so these read as millimetres.
    const thickness = Math.min(
        70,
        Math.max(22, 18 + (pages ?? PAGES_FALLBACK) / 10),
    );

    // From the real image rather than one uniform box — the covers run 0.56 to
    // 1.0, and a shared aspect would crop the squarest by a third. Clamped to
    // keep the row arithmetic bounded.
    const ratio = cover ? cover.width / cover.height : 0.66;

    const spineColor = book.data.spineColor ?? "#d2d1ca";
    let textColor = book.data.textColor ?? "#1a1919";

    // A text colour that has drifted as light as its own spine is unreadable
    // whatever the spine does; fall back by lightness.
    if (deltaL(textColor, spineColor) < TEXT_DELTA_L) {
        textColor =
            hexToOklab(normaliseHex(spineColor))[0] > 0.6
                ? "#1a1919"
                : "#eae8e3";
    }

    const spineTitle = book.data.title.split(":")[0].trim();
    const rating = toNumber(book.data.rating);
    const favourite = (rating ?? 0) >= 4;

    return {
        id: book.id,
        title: book.data.title,
        spineTitle,
        authors: formatAuthors(book.data.author),
        pages,
        rating,
        finished: book.data.finished ?? "",
        cover,
        thicknessRatio: thickness / SHELF_HEIGHT,
        heightRatio,
        coverRatio: Math.min(0.78, Math.max(0.58, ratio)),
        spineColor,
        textColor,
        favourite,
        // Decided here rather than left to CSS wrapping, so a title that
        // can't fit two lines stays on one and takes the ellipsis instead of
        // being clipped mid-line.
        titleLines:
            spineTitle.length > CHARS_PER_LINE &&
            thickness >= TWO_LINE_THICKNESS
                ? 2
                : 1,
    };
}

/**
 * Newest year first, but each year reads left to right in the order it
 * happened. Whatever's in progress comes back separately, to be laid flat at
 * the end of the current year rather than shelved among the finished books.
 */
export async function getShelfYears(): Promise<ShelfYear[]> {
    const [finished, reading] = await Promise.all([
        getCollection("books", ({ data }) => data.group === "abgeschlossen"),
        getCollection("books", ({ data }) => data.group === "aktiv"),
    ]);

    const byYear = new Map<number, Book[]>();
    for (const book of finished) {
        const year = Number(book.data.finishedYear);
        if (!Number.isFinite(year)) continue;
        if (!byYear.has(year)) byYear.set(year, []);
        byYear.get(year)!.push(book);
    }

    // Build time, so a deploy in January opens a new year's shelf holding
    // nothing but the book in progress.
    const currentYear = new Date().getFullYear();
    if (reading.length > 0 && !byYear.has(currentYear)) {
        byYear.set(currentYear, []);
    }

    return [...byYear.keys()]
        .sort((a, b) => b - a)
        .map((year) => ({
            year,
            books: byYear
                .get(year)!
                .sort(
                    (a, b) =>
                        new Date(a.data.finished ?? 0).getTime() -
                        new Date(b.data.finished ?? 0).getTime(),
                )
                .map(resolve),
            reading: year === currentYear ? reading.map(resolve) : [],
        }));
}

const PILE_LABELS: Record<string, string> = {
    pausiert: "Paused",
    merkliste: "Want to read",
};
const PILE_ORDER = ["pausiert", "merkliste"];

/**
 * The books that aren't on the shelf yet. `aktiv` is absent on purpose: it
 * already stands on the current year's shelf.
 */
export async function getPile(): Promise<
    { id: string; label: string; title: string; authors: string }[]
> {
    const books = await getCollection("books", ({ data }) =>
        PILE_ORDER.includes(data.group),
    );

    return books
        .sort(
            (a, b) =>
                PILE_ORDER.indexOf(a.data.group) -
                PILE_ORDER.indexOf(b.data.group),
        )
        .map((book) => ({
            id: book.id,
            label: PILE_LABELS[book.data.group] ?? "",
            title: book.data.title,
            authors: formatAuthors(book.data.author),
        }));
}
