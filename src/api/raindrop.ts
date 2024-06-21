import type { Bookmark } from '@components/bookmarks/BookmarkItem.astro';

const PER_PAGE = 10;
const RAINDROP_COLLECTION = 0;

export const fetchBookmarks = async (page: number = 0) => {
    const bookmarks: Bookmark[] = [];

    const req = await fetch(
        `https://api.raindrop.io/rest/v1/raindrops/${RAINDROP_COLLECTION}?perpage=${PER_PAGE}&page=${page}&search=❤️`,
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.RAINDROP_TOKEN}`
            }
        }
    );

    // Check if the request was successful
    if (!req.ok) {
        // Handle the error, e.g., by logging it or throwing an error
        console.error(`Failed to fetch bookmarks ${req.statusText} ${bookmarks}`);
        // Return an empty array to stop the recursion
        return bookmarks;
    }

    const data = await req.json();

    if (data.items) {
        bookmarks.push(
            ...data.items.map(({ cover, title, link, tags, created, type }: Bookmark) => ({
                link,
                title,
                cover,
                tags,
                created,
                type
            }))
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
};
