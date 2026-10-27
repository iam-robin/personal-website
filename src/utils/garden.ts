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

export function noteHref(note: GardenNote["data"]): string {
    return `/notes/${categorySlug(note.thema)}/${note.slug}`;
}

/*
  Media-log items are matched to garden notes by title, since neither side
  links to the other. Notes drop the author after the dash, books also drop
  the subtitle after the colon. Series and films keep theirs: "Star Wars:
  Andor" and "Star Wars: Ahsoka" are different shows.
*/

export type MediaKind = "books" | "series" | "movies";

const MEDIA_CATEGORIES: Record<MediaKind, string[]> = {
    books: ["Books"],
    series: ["Series"],
    movies: ["Movies", "Films"],
};

const mediaKey = (value: string) =>
    value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export type MediaNoteLookup = (title: string) => string | null;

const lookups = new Map<MediaKind, Promise<MediaNoteLookup>>();

/** Title to note URL for one log, built once per kind. */
export function getMediaNoteLookup(kind: MediaKind): Promise<MediaNoteLookup> {
    let lookup = lookups.get(kind);
    if (!lookup) {
        lookup = buildLookup(kind);
        lookups.set(kind, lookup);
    }
    return lookup;
}

async function buildLookup(kind: MediaKind): Promise<MediaNoteLookup> {
    const categories = MEDIA_CATEGORIES[kind];
    const notes = (await getGardenNotes()).filter((note) =>
        categories.includes(note.data.thema),
    );

    const byKey = new Map<string, string>();
    for (const { data } of notes) {
        // "Title – Author": en dash, em dash or a spaced hyphen.
        const [titlePart] = data.title.split(/\s+[–—-]\s+/);
        for (const key of [mediaKey(data.title), mediaKey(titlePart)]) {
            if (key && !byKey.has(key)) byKey.set(key, noteHref(data));
        }
    }

    return (title) => {
        const keys = [mediaKey(title)];
        if (kind === "books") keys.push(mediaKey(title.split(":")[0]));
        for (const key of keys) {
            const href = byKey.get(key);
            if (href) return href;
        }
        return null;
    };
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
