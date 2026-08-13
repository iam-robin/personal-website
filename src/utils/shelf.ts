import { getCollection, type CollectionEntry } from "astro:content";
import { getFilms } from "./movies";
import { getBookCover } from "./books";
import { getBookmarks, getCover as getBookmarkCover } from "./bookmarks";

export type Book = CollectionEntry<"books">;
export type Series = CollectionEntry<"series">;

/**
 * The shelf hub needs two things from the media collections: what's in
 * progress right now, and how much is on each shelf. The log pages themselves
 * do the real reading of the data.
 */

/** Plural — more than one book at a time is normal. */
export async function getCurrentBooks(): Promise<Book[]> {
    return getCollection("books", ({ data }) => data.group === "aktiv");
}

export async function getCurrentSeries(): Promise<Series[]> {
    return getCollection("series", ({ data }) => data.group === "aktiv");
}

/**
 * Counts for the shelf rows. Books and series count what's *finished*: the
 * collections also hold watchlist and paused entries. Films are the odd one
 * out — they come from Letterboxd's feed, which only reaches back 50 entries,
 * so that row counts what the feed reached (see utils/movies.ts).
 */
export async function getShelfCounts(): Promise<{
    books: number;
    series: number;
    movies: number;
    bookmarks: number;
}> {
    const [books, series, films, bookmarks] = await Promise.all([
        getCollection("books", ({ data }) => data.group === "abgeschlossen"),
        getCollection("series", ({ data }) => data.group === "abgeschlossen"),
        getFilms(),
        getCollection("bookmarks"),
    ]);

    return {
        books: books.length,
        series: series.length,
        movies: films.length,
        bookmarks: bookmarks.length,
    };
}

/**
 * A fan card: a local cover `astro:assets` can optimise (books, bookmarks) or
 * a remote poster URL (TMDB for series, Letterboxd for films) — the same split
 * the log pages already live with.
 */
export type ShelfCover = ImageMetadata | string;

export interface ShelfFan {
    covers: ShelfCover[];
    /** Books, seasons and films stand upright; a bookmark cover is an og image. */
    shape: "poster" | "wide";
}

/** As many as the fan has positioned slots. Wide cards get three — see ShelfFan. */
const POSTER_SLOTS = 5;
const WIDE_SLOTS = 3;

/** Newest first, by the day the thing was finished. */
function byFinishedDesc<T extends { data: { finished?: string | null } }>(
    a: T,
    b: T,
): number {
    return (
        new Date(b.data.finished ?? 0).getTime() -
        new Date(a.data.finished ?? 0).getTime()
    );
}

/**
 * The most recent covers on each shelf, keyed by the row's href. Newest first,
 * so a fan shows what has actually had my attention lately, and only entries
 * that carry a cover — a gap in the middle of a fan reads as a broken image.
 */
export async function getShelfFans(): Promise<Record<string, ShelfFan>> {
    const [books, series, films, bookmarks] = await Promise.all([
        getCollection("books", ({ data }) => data.group === "abgeschlossen"),
        getCollection("series", ({ data }) => data.group === "abgeschlossen"),
        getFilms(),
        getBookmarks(),
    ]);

    return {
        "/books": {
            shape: "poster",
            covers: books
                .sort(byFinishedDesc)
                .map((book) => getBookCover(book.data.cover))
                .filter((cover) => cover !== null)
                .slice(0, POSTER_SLOTS),
        },
        "/series": {
            shape: "poster",
            covers: series
                .sort(byFinishedDesc)
                .map((season) => season.data.cover)
                .filter((cover): cover is string => !!cover)
                .slice(0, POSTER_SLOTS),
        },
        "/movies": {
            shape: "poster",
            covers: [...films]
                .sort((a, b) => b.watched.localeCompare(a.watched))
                .map((film) => film.cover)
                .filter((cover): cover is string => !!cover)
                .slice(0, POSTER_SLOTS),
        },
        // Already newest first out of getBookmarks().
        "/bookmarks": {
            shape: "wide",
            covers: bookmarks
                .map((bookmark) => getBookmarkCover(bookmark.data.cover))
                .filter((cover) => cover !== null)
                .slice(0, WIDE_SLOTS),
        },
    };
}
