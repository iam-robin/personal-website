import { getCollection } from "astro:content";
import type { Series } from "./shelf";

/**
 * Everything /series needs, resolved at build time. `shelf.ts` answers only
 * "what's on the shelves and how much" for the hub page; the real reading of
 * the collection lives here, the way `books.ts` serves /books.
 *
 * One entry is one *season*, not one show — that's how the Obsidian export
 * logs it, and folding the seasons back into shows would throw away the year
 * each one was actually watched in. Every count on the page says "seasons"
 * for that reason.
 */

export interface Season {
    id: string;
    title: string;
    /** As logged, 1–6. Null where the export carries no number. */
    season: number | null;
    /**
     * A remote URL — TMDB for most, a few one-off hosts for the rest. Unlike
     * book and bookmark covers these never made it into the export as files,
     * so there is nothing local for `astro:assets` to optimise (see the note
     * in SeriesRow).
     */
    cover: string | null;
    /** ISO, or "" for the seasons logged without a date. */
    finished: string;
    /** Robin's own, out of 5. Only logged from 2023 on. */
    rating: number | null;
    /** Rated 4 or better, or flagged in the vault — earns a heart, as on /books. */
    favourite: boolean;
    /** The season currently being watched: in the list, but not finished. */
    watching: boolean;
}

export interface SeasonYear {
    /** The heading: a year, or "Undated" for the ones logged without one. */
    label: string;
    /** Sort key only. UNDATED sinks the undated group below every real year. */
    year: number;
    seasons: Season[];
}

/** Below any year in the log, so `sort` puts that group last on its own. */
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
        // Both, because the two disagree: the vault's star is only filled in
        // from 2023 on, and the `favorite` flag is set on a handful that
        // predate it.
        favourite: entry.data.favorite === true || (rating ?? 0) >= 4,
        watching,
    };
}

/**
 * Newest first the whole way down: the years descend, and inside a year
 * December sits above January. Two groups sit outside that: whatever is
 * running right now heads the current year, being the most recent thing of
 * all, and the seasons logged without a date make a group of their own at
 * the bottom.
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

    // Build time, so a deploy in January opens a new year holding nothing but
    // the season in progress.
    const currentYear = new Date().getFullYear();
    if (watching.length > 0 && !byYear.has(currentYear)) {
        byYear.set(currentYear, []);
    }

    return [...byYear.keys()]
        .sort((a, b) => b - a)
        .map((year) => {
            const entries = byYear.get(year)!;

            // Undated by show, then by season, so the two Mr. Robots and the
            // two Better Call Sauls at least stand in order; everything else
            // newest first, by the day it was finished.
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

const LIST_LABELS: Record<string, string> = {
    pausiert: "Paused",
    merkliste: "Want to watch",
};
const LIST_ORDER = ["pausiert", "merkliste"];

/**
 * The seasons that aren't in the log yet. `aktiv` is absent on purpose: it's
 * already in the list, marked as in progress.
 */
export async function getWatchlist(): Promise<
    { id: string; label: string; title: string; season: number | null }[]
> {
    const entries = await getCollection("series", ({ data }) =>
        LIST_ORDER.includes(data.group),
    );

    return entries
        .sort(
            (a, b) =>
                LIST_ORDER.indexOf(a.data.group) -
                    LIST_ORDER.indexOf(b.data.group) ||
                a.data.title.localeCompare(b.data.title) ||
                (toNumber(a.data.season) ?? 0) - (toNumber(b.data.season) ?? 0),
        )
        .map((entry) => ({
            id: entry.id,
            label: LIST_LABELS[entry.data.group] ?? "",
            title: entry.data.title,
            season: toNumber(entry.data.season),
        }));
}
