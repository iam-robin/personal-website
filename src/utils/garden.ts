import { getCollection, type CollectionEntry } from "astro:content";

export type GardenNote = CollectionEntry<"garden">;

/** Category background colors, in the order v3 assigns them. */
export const gardenColors = [
    "#9EAAFA",
    "#FAE680",
    "#A2CBAF",
    "#E8ADB1",
    "#A6C2EB",
    "#F4E8C8",
    "#CCA7ED",
    "#F29874",
    "#6C95CF",
    "#F4DAA0",
];

/** All garden notes, newest first. */
export async function getGardenNotes(): Promise<GardenNote[]> {
    return (await getCollection("garden")).sort(
        (a, b) =>
            new Date(b.data.created).getTime() -
            new Date(a.data.created).getTime(),
    );
}

/** URL-safe slug for a category (garden categories are single words). */
export function categorySlug(category: string): string {
    return category.toLowerCase();
}

/** Categories with note counts, most notes first (drives color order). */
export function getCategories(
    notes: GardenNote[],
): { name: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const note of notes) {
        counts.set(note.data.thema, (counts.get(note.data.thema) ?? 0) + 1);
    }
    return [...counts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Map each category to a stable color index — sorted by count, exactly
 * like v3, so a category always gets the same color.
 */
export function getCategoryColorMap(
    notes: GardenNote[],
): Record<string, number> {
    const map: Record<string, number> = {};
    getCategories(notes).forEach((cat, index) => {
        map[cat.name] = index;
    });
    return map;
}
