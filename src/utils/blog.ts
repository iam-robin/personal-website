import { getCollection, type CollectionEntry } from "astro:content";
import type { MarkdownHeading } from "astro";

export type BlogPost = CollectionEntry<"blog">;

/** h2 + h3, minus the label GFM generates for the footnotes block. */
export function getTocHeadings(headings: MarkdownHeading[]): MarkdownHeading[] {
    return headings.filter(
        (h) => (h.depth === 2 || h.depth === 3) && h.slug !== "footnote-label",
    );
}


export async function getBlogPosts(): Promise<BlogPost[]> {
    return (await getCollection("blog")).sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime(),
    );
}

export function categorySlug(category: string): string {
    return category
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

export function categoryLabel(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

export function getCategories(posts: BlogPost[]): string[] {
    const set = new Set<string>();
    for (const post of posts) {
        if (post.data.category) set.add(post.data.category);
    }
    return [...set].sort();
}
