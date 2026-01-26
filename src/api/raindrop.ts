import type { Bookmark } from "@components/bookmarks/BookmarkItem.astro";

const PER_PAGE = 10;
const RAINDROP_COLLECTION = 0;
const TIMEOUT_MS = 3000;

export const fetchBookmarks = async (page: number = 0): Promise<Bookmark[]> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const req = await fetch(
            `https://api.raindrop.io/rest/v1/raindrops/${RAINDROP_COLLECTION}?perpage=${PER_PAGE}&page=${page}&search=❤️`,
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.RAINDROP_TOKEN}`,
                },
                signal: controller.signal,
            }
        );

        clearTimeout(timeoutId);

        if (!req.ok) {
            console.error(`Failed to fetch bookmarks: ${req.statusText}`);
            return [];
        }

        const data = await req.json();
        const bookmarks: Bookmark[] = [];

        if (data.items) {
            bookmarks.push(
                ...data.items.map(
                    ({ cover, title, link, tags, created, type }: Bookmark) => ({
                        link,
                        title,
                        cover,
                        tags,
                        created,
                        type,
                    })
                )
            );
        }

        // Base case: Stop recursion if there are no more items to fetch
        if (data.items?.length < PER_PAGE) {
            bookmarks.sort((a, b) => {
                const dateA = new Date(a.created).getTime();
                const dateB = new Date(b.created).getTime();
                return dateB - dateA;
            });

            return bookmarks;
        }

        // Recursive case: Fetch the next page of items
        const nextPageBookmarks = await fetchBookmarks(page + 1);
        bookmarks.push(...nextPageBookmarks);

        bookmarks.sort((a, b) => {
            const dateA = new Date(a.created).getTime();
            const dateB = new Date(b.created).getTime();
            return dateB - dateA;
        });

        return bookmarks;
    } catch (error) {
        // Return empty array on timeout or network error
        if (error instanceof Error && error.name === "AbortError") {
            console.warn("Raindrop API request timed out");
        } else {
            console.error("Failed to fetch bookmarks:", error);
        }
        return [];
    }
};
