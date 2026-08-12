import { getCollection, type CollectionEntry } from "astro:content";
import { getFilms } from "./movies";

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
