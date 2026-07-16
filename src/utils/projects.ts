import { getCollection, type CollectionEntry } from "astro:content";

// Extract the last year from a year string (e.g., "2015-2017" → 2017).
// Ongoing projects sort first — they are the most current.
export const getLastYear = (year: string | undefined): number => {
    if (!year) return 0;
    if (year.toLowerCase().includes("ongoing")) return Infinity;
    const parts = year.split("-");
    return parseInt(parts[parts.length - 1], 10) || 0;
};

/** Every project, newest first (ongoing → most recent → oldest). */
export async function getAllProjects(): Promise<
    CollectionEntry<"projects">[]
> {
    return (await getCollection("projects")).sort(
        (a, b) =>
            getLastYear(b.data.year) - getLastYear(a.data.year) ||
            b.data.order - a.data.order,
    );
}

/**
 * The projects featured on the homepage, newest first.
 *
 * If any project opts in with `featured: true`, that curated set wins —
 * otherwise fall back to the newest `limit` projects. Curating lets an
 * older favourite (e.g. handcoded.art) hold a teaser slot without
 * pretending to be recent.
 */
export async function getFeaturedProjects(
    limit = 3,
): Promise<CollectionEntry<"projects">[]> {
    const all = await getAllProjects();
    const curated = all.filter((p) => p.data.featured);
    return (curated.length > 0 ? curated : all).slice(0, limit);
}
