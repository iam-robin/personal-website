import { getCollection, type CollectionEntry } from "astro:content";

export type Bookmark = CollectionEntry<"bookmarks">;

// Covers are downloaded by loaders/linkding.ts and looked up by filename.
const coverModules = import.meta.glob<{ default: ImageMetadata }>(
    "../generated/bookmark-covers/*.{jpg,jpeg,png,webp,avif,gif}",
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

export async function getBookmarks(): Promise<Bookmark[]> {
    return (await getCollection("bookmarks")).sort(
        (a, b) =>
            new Date(b.data.added).getTime() - new Date(a.data.added).getTime(),
    );
}

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

export function tagSlug(tag: string): string {
    return tag
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}
