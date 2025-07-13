import { getCollection } from 'astro:content';
import { db, Postcard, eq } from 'astro:db';
import { getNewestObsidianGardenEntries } from '@api/github';
import { fetchBookmarks } from '@api/raindrop';
import { shelfQueryResponse } from '@api/literal';

export interface ContentCounts {
    blog: number;
    garden: number;
    postcards: number;
    bookmarks: number;
    photos365: number;
    books: number;
}

export async function getAllContentCounts(): Promise<ContentCounts> {
    const [blogCount, gardenCount, postcardsCount, bookmarksCount, photos365Count, booksCount] =
        await Promise.all([
            getBlogCount(),
            getGardenCount(),
            getPostcardsCount(),
            getBookmarksCount(),
            get365PhotosCount(),
            getBooksCount()
        ]);

    return {
        blog: blogCount,
        garden: gardenCount,
        postcards: postcardsCount,
        bookmarks: bookmarksCount,
        photos365: photos365Count,
        books: booksCount
    };
}

export async function getBlogCount(): Promise<number> {
    try {
        const blogPosts = await getCollection('blog');
        // Filter for published posts (assuming no draft field means published)
        return blogPosts.length;
    } catch (error) {
        console.error('Error fetching blog count:', error);
        return 0;
    }
}

export async function get365PhotosCount(): Promise<number> {
    try {
        const photos = await getCollection('365');
        return photos.length;
    } catch (error) {
        console.error('Error fetching 365 photos count:', error);
        return 0;
    }
}

export async function getPostcardsCount(): Promise<number> {
    try {
        const postcards = await db.select().from(Postcard).where(eq(Postcard.isPublished, true));
        return postcards.length;
    } catch (error) {
        console.error('Error fetching postcards count:', error);
        return 0;
    }
}

export async function getGardenCount(): Promise<number> {
    try {
        // Fetch all garden entries from GitHub API
        const gardenEntries = await getNewestObsidianGardenEntries(1000, 'created');
        return gardenEntries.length;
    } catch (error) {
        console.error('Error fetching garden count:', error);
        return 0;
    }
}

export async function getBookmarksCount(): Promise<number> {
    try {
        // Fetch bookmarks from Raindrop API
        const bookmarks = await fetchBookmarks();
        return bookmarks.length;
    } catch (error) {
        console.error('Error fetching bookmarks count:', error);
        return 0;
    }
}

export async function getBooksCount(): Promise<number> {
    try {
        // Fetch all books from shelves via Literal API
        const shelves = await shelfQueryResponse();
        let totalBooks = 0;

        if (shelves && Array.isArray(shelves)) {
            for (const shelf of shelves) {
                if (shelf.books && Array.isArray(shelf.books)) {
                    totalBooks += shelf.books.length;
                }
            }
        }

        return totalBooks;
    } catch (error) {
        console.error('Error fetching books count:', error);
        return 0;
    }
}
