import { getCollection, type CollectionEntry } from "astro:content";

// Last year of a range; ongoing projects sort first.
export const getLastYear = (year: string | undefined): number => {
    if (!year) return 0;
    if (year.toLowerCase().includes("ongoing")) return Infinity;
    const parts = year.split("-");
    return parseInt(parts[parts.length - 1], 10) || 0;
};

export async function getAllProjects(): Promise<
    CollectionEntry<"projects">[]
> {
    return (await getCollection("projects")).sort(
        (a, b) =>
            getLastYear(b.data.year) - getLastYear(a.data.year) ||
            b.data.order - a.data.order,
    );
}
