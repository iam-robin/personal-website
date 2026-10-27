import { getCollection, type CollectionEntry } from "astro:content";

type Book = CollectionEntry<"books">;
import { hexToOklab, normaliseHex } from "./paper";
import { createSeededRandom } from "./seededRandom";
import { getMediaNoteLookup, type MediaNoteLookup } from "./garden";

const coverModules = import.meta.glob<{ default: ImageMetadata }>(
    "../../data/output/book-covers/*.{jpg,jpeg,png,webp}",
    { eager: true },
);
const coversByFile: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(coverModules)) {
    const file = path.split("/").pop();
    if (file) coversByFile[file] = mod.default;
}

/** Remote URLs miss the map, so they fall back like a missing cover. */
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
    /** Title without the subtitle after ":". */
    spineTitle: string;
    authors: string;
    pages: number | null;
    rating: number | null;
    finished: string;
    cover: ImageMetadata | null;
    /* Fractions, so the whole shelf scales from `--shelf-h`. */
    /** Of the row height. Also the closed width. */
    thicknessRatio: number;
    /** Of the row height, at most 1. */
    heightRatio: number;
    /** Of the book's height. Also the open width. */
    coverRatio: number;
    spineColor: string;
    textColor: string;
    favourite: boolean;
    titleLines: 1 | 2;
    note: string | null;
}

export interface ShelfYear {
    year: number;
    /** Finished, in the order they were read. */
    books: ShelfBook[];
    /** Still being read. Only ever populated on the current year. */
    reading: ShelfBook[];
}

/** Reference height the ratios are cut against. The rendered one is `--shelf-h`. */
const SHELF_HEIGHT = 216;

/** Median of the books that report pages. Some export `pages: 0`. */
const PAGES_FALLBACK = 250;

/* Keep in sync with `--shelf-h` in ShelfRow: the spine font is clamped, so
   characters per line can't be a ratio. */
const RENDERED_SHELF_H = 264; // 16.5rem
const TITLE_FONT = 13;
const TITLE_LINE = 1.35;
/** Fira Mono's advance width, in em. */
const MONO_ADVANCE = 0.6;
/** Breathing room at each end of the spine, and to either side of the text. */
const TITLE_PAD_BLOCK = 24;
const TITLE_PAD_INLINE = 8;

const CHARS_PER_LINE = Math.floor(
    (RENDERED_SHELF_H * 0.97 - TITLE_PAD_BLOCK) / (TITLE_FONT * MONO_ADVANCE),
);

const TWO_LINE_THICKNESS =
    ((2 * TITLE_LINE * TITLE_FONT + TITLE_PAD_INLINE) * SHELF_HEIGHT) /
    RENDERED_SHELF_H;

/** Minimum lightness gap between spine and title. */
const TEXT_DELTA_L = 0.14;

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

function resolve(book: Book, noteFor: MediaNoteLookup): ShelfBook {
    const pages = toNumber(book.data.pages);
    const cover = getBookCover(book.data.cover);

    // Seeded from the id so heights survive rebuilds. Keep this the first draw.
    const rand = createSeededRandom(book.id);
    const heightRatio = 0.94 + rand() * 0.06;

    // In reference units (see SHELF_HEIGHT), so these read as millimetres.
    const thickness = Math.min(
        70,
        Math.max(22, 18 + (pages ?? PAGES_FALLBACK) / 10),
    );

    const ratio = cover ? cover.width / cover.height : 0.66;

    const spineColor = book.data.spineColor ?? "#d2d1ca";
    let textColor = book.data.textColor ?? "#1a1919";

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
        titleLines:
            spineTitle.length > CHARS_PER_LINE &&
            thickness >= TWO_LINE_THICKNESS
                ? 2
                : 1,
        note: noteFor(book.data.title),
    };
}

/** Newest year first, books in reading order. Books in progress come back separately. */
export async function getShelfYears(): Promise<ShelfYear[]> {
    const [finished, reading, noteFor] = await Promise.all([
        getCollection("books", ({ data }) => data.group === "abgeschlossen"),
        getCollection("books", ({ data }) => data.group === "aktiv"),
        getMediaNoteLookup("books"),
    ]);
    const toShelf = (book: Book) => resolve(book, noteFor);

    const byYear = new Map<number, Book[]>();
    for (const book of finished) {
        const year = Number(book.data.finishedYear);
        if (!Number.isFinite(year)) continue;
        if (!byYear.has(year)) byYear.set(year, []);
        byYear.get(year)!.push(book);
    }

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
                .map(toShelf),
            reading: year === currentYear ? reading.map(toShelf) : [],
        }));
}

const PILE_LABELS: Record<string, string> = {
    pausiert: "Paused",
    merkliste: "Want to read",
};
const PILE_ORDER = ["pausiert", "merkliste"];

/** Books not on the shelf yet. `aktiv` already stands on the current year's shelf. */
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
