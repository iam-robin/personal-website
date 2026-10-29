import { getCollection, type CollectionEntry } from "astro:content";

type Series = CollectionEntry<"series">;

/** One entry is one season, not one show: that's how the export logs it. */

export interface Season {
    id: string;
    title: string;
    season: number | null;
    /** Remote URL, so astro:assets can't optimise it. */
    cover: string | null;
    /** ISO, or "" when undated. */
    finished: string;
    rating: number | null;
    favourite: boolean;
    watching: boolean;
}

export interface SeasonYear {
    label: string;
    year: number;
    seasons: Season[];
}

const UNDATED = -1;

function toNumber(value: unknown): number | null {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
}

function resolve(entry: Series, watching = false): Season {
    const rating = toNumber(entry.data.rating);

    return {
        id: entry.id,
        title: entry.data.title,
        season: toNumber(entry.data.season),
        cover: entry.data.cover ?? null,
        finished: entry.data.finished ?? "",
        rating,
        // The vault's star only exists from 2023 on; `favorite` covers older ones.
        favourite: entry.data.favorite === true || (rating ?? 0) >= 4,
        watching,
    };
}

/**
 * Newest first. Seasons in progress head the current year, undated ones sink
 * to the bottom.
 */
export async function getSeasonYears(): Promise<SeasonYear[]> {
    const [finished, watching] = await Promise.all([
        getCollection("series", ({ data }) => data.group === "abgeschlossen"),
        getCollection("series", ({ data }) => data.group === "aktiv"),
    ]);

    const byYear = new Map<number, Series[]>();
    for (const entry of finished) {
        const year = Number(entry.data.finishedYear);
        const key = Number.isFinite(year) ? year : UNDATED;
        if (!byYear.has(key)) byYear.set(key, []);
        byYear.get(key)!.push(entry);
    }

    const currentYear = new Date().getFullYear();
    if (watching.length > 0 && !byYear.has(currentYear)) {
        byYear.set(currentYear, []);
    }

    return [...byYear.keys()]
        .sort((a, b) => b - a)
        .map((year) => {
            const entries = byYear.get(year)!;

            entries.sort((a, b) =>
                year === UNDATED
                    ? a.data.title.localeCompare(b.data.title) ||
                      (toNumber(a.data.season) ?? 0) -
                          (toNumber(b.data.season) ?? 0)
                    : new Date(b.data.finished ?? 0).getTime() -
                      new Date(a.data.finished ?? 0).getTime(),
            );

            return {
                label: year === UNDATED ? "Undated" : String(year),
                year,
                seasons: [
                    ...(year === currentYear
                        ? watching.map((entry) => resolve(entry, true))
                        : []),
                    ...entries.map((entry) => resolve(entry)),
                ],
            };
        });
}

