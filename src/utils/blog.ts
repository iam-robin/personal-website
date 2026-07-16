import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

/** All blog posts, newest first. */
export async function getBlogPosts(): Promise<BlogPost[]> {
    return (await getCollection("blog")).sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime(),
    );
}

/** URL-safe slug for a category, e.g. "Digital minimalism" → "digital-minimalism". */
export function categorySlug(category: string): string {
    return category
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

/** Display label for a category, e.g. "digital minimalism" → "Digital minimalism". */
export function categoryLabel(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

/** Unique categories present across the given posts, alphabetically. */
export function getCategories(posts: BlogPost[]): string[] {
    const set = new Set<string>();
    for (const post of posts) {
        if (post.data.category) set.add(post.data.category);
    }
    return [...set].sort();
}
