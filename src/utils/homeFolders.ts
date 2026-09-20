import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";
import { getBookmarks } from "./bookmarks";
import { getBookCover } from "./books";
import { gardenColors, getCategoryColorMap, getGardenNotes } from "./garden";
import { getNewestPostcards } from "./postcards";

const PREVIEW_LIMIT = 3;

type FolderPreview = {
    title: string;
    detail?: string;
    image?: ImageMetadata | null;
    category?: string;
    color?: string;
};

export type HomeFolder = {
    label: string;
    href: string;
    kind: "notes" | "bookmarks" | "books" | "postcards";
    items: FolderPreview[];
};

function timestamp(value?: string | null): number {
    const time = Date.parse(value ?? "");
    return Number.isFinite(time) ? time : 0;
}

/** Build-time previews, using the same content sources as the destination pages. */
export async function getHomeFolders(): Promise<HomeFolder[]> {
    const [notes, bookmarks, books, postcards] = await Promise.all([
        getGardenNotes(),
        getBookmarks(),
        getCollection("books", ({ data }) =>
            data.group === "aktiv" || data.group === "abgeschlossen",
        ),
        getNewestPostcards(PREVIEW_LIMIT),
    ]);

    // Compute before reordering, so tied category counts match the garden page.
    const categoryColors = getCategoryColorMap(notes);

    return [
        {
            label: "Garden",
            href: "/garden",
            kind: "notes",
            items: notes
                .toSorted((a, b) =>
                    timestamp(b.data.edited || b.data.created) -
                    timestamp(a.data.edited || a.data.created) ||
                    a.id.localeCompare(b.id),
                )
                .slice(0, PREVIEW_LIMIT)
                .map(({ data }) => ({
                    title: data.title,
                    detail: data.description,
                    category: data.thema,
                    color: gardenColors[categoryColors[data.thema] % gardenColors.length],
                })),
        },
        {
            label: "Bookmarks",
            href: "/bookmarks",
            kind: "bookmarks",
            items: bookmarks.slice(0, PREVIEW_LIMIT).map(({ data }) => ({
                title: data.title,
            })),
        },
        {
            label: "Books",
            href: "/books",
            kind: "books",
            // Currently reading first, then most recently finished.
            items: books
                .toSorted((a, b) =>
                    Number(b.data.group === "aktiv") - Number(a.data.group === "aktiv") ||
                    timestamp(b.data.finished || b.data.added) -
                    timestamp(a.data.finished || a.data.added) ||
                    a.id.localeCompare(b.id),
                )
                .slice(0, PREVIEW_LIMIT)
                .map(({ data }) => ({
                    title: data.title,
                    image: getBookCover(data.cover),
                })),
        },
        {
            label: "Postcards",
            href: "/postcards",
            kind: "postcards",
            items: postcards.map((card) => ({
                title: card.author,
                detail: card.body,
            })),
        },
    ];
}
