import { getCollection, type CollectionEntry } from "astro:content";

export type Bookmark = CollectionEntry<"bookmarks">;

// Cover images live in the data submodule; import them all so each can be
// looked up by filename (the `cover` field is e.g. "bookmark-covers/x.jpg").
const coverModules = import.meta.glob<{ default: ImageMetadata }>(
    "../../data/output/bookmark-covers/*.{jpg,jpeg,png,webp}",
    { eager: true },
);
const coversByFile: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(coverModules)) {
    const file = path.split("/").pop();
    if (file) coversByFile[file] = mod.default;
}

export function getCover(
    cover: string | null | undefined,
): ImageMetadata | null {
    if (!cover) return null;
    const file = cover.split("/").pop();
    return (file && coversByFile[file]) || null;
}

/** All bookmarks, newest first. */
export async function getBookmarks(): Promise<Bookmark[]> {
    return (await getCollection("bookmarks")).sort(
        (a, b) =>
            new Date(b.data.added).getTime() - new Date(a.data.added).getTime(),
    );
}

/** Tags with counts, most frequent first. */
export function getTags(
    bookmarks: Bookmark[],
): { name: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const bookmark of bookmarks) {
        for (const tag of bookmark.data.tags) {
            counts.set(tag, (counts.get(tag) ?? 0) + 1);
        }
    }
    return [...counts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Bookmark types, marked by shape rather than colour: the stocks
 * (utils/paper.ts) put a hue under them, and solid ink reads the same in
 * every room. Shapes are sized for equal optical weight — see
 * BookmarkTypeMark.astro — and only need to be distinct at 10px.
 */
export const bookmarkTypes = [
    { key: "article", label: "Article", shape: "circle" },
    { key: "website", label: "Website", shape: "square" },
    { key: "video", label: "Video", shape: "triangle" },
    { key: "misc", label: "Misc", shape: "diamond" },
] as const;

export type BookmarkShape = (typeof bookmarkTypes)[number]["shape"];

/** The type entry for a bookmark; anything unrecognised or missing is Misc. */
export function getBookmarkType(type: string | null | undefined) {
    return (
        bookmarkTypes.find((t) => t.key === type) ??
        bookmarkTypes[bookmarkTypes.length - 1]
    );
}

/** URL-safe slug for a tag. */
export function tagSlug(tag: string): string {
    return tag
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}
