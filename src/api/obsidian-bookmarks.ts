import bookmarksData from "@data/bookmarks.json";

export interface Bookmark {
    link: string;
    title: string;
    cover: string | null;
    tags: string[];
    type: string;
    created: string;
}

interface RawBookmark {
    title: string;
    url: string;
    added: string;
    cover: string | null;
    tags: string[];
    type?: string;
    description?: string;
}

interface RawBookmarksData {
    lastUpdated: string;
    count: number;
    items: RawBookmark[];
}

export async function fetchBookmarks(): Promise<Bookmark[]> {
    const data = bookmarksData as RawBookmarksData;
    return data.items
        .map((b) => ({
            link: b.url,
            title: b.title,
            cover: b.cover ? `/${b.cover}` : null,
            tags: b.tags ?? [],
            type: b.type ?? "misc",
            created: b.added,
        }))
        .sort(
            (a, b) =>
                new Date(b.created).getTime() - new Date(a.created).getTime(),
        );
}
