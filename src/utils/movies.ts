const USERNAME = "iamrobin";
/** The profile the feed belongs to — linked from the page's opening line. */
export const PROFILE_URL = `https://letterboxd.com/${USERNAME}/`;
const FEED_URL = `${PROFILE_URL}rss/`;
const TIMEOUT_MS = 10_000;

/** What the feed gives out in one go. Quoted on the page, so it lives here. */
export const FEED_LIMIT = 50;

export interface Film {
    id: string;
    title: string;
    /** The film's own year — the dim chip after the title, as "S2" is on /series. */
    year: number | null;
    /** a.ltrbxd.com, out of the description's CDATA. Remote, like the series covers. */
    cover: string | null;
    /** Mine, out of 5. Letterboxd writes one on every diary entry it rates. */
    rating: number | null;
    /** Letterboxd's own like — the heart, straight from the source. */
    liked: boolean;
    /** ISO yyyy-mm-dd, the day I watched it. */
    watched: string;
}

export interface FilmYear {
    label: string;
    year: number;
    films: Film[];
}

function tagContent(item: string, name: string): string | null {
    const match = item.match(
        new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, "i"),
    );
    return match ? match[1].trim() : null;
}

/** The five XML entities. Titles like "Sun & Fire" arrive escaped. */
function decodeEntities(value: string): string {
    return value
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
}

function toNumber(value: string | null): number | null {
    if (!value) return null;
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
}

function parseFeed(xml: string): Film[] {
    const films: Film[] = [];

    // Splitting on <item> rather than matching them: the description holds a
    // CDATA block with markup of its own, which a greedy item regex trips on.
    for (const item of xml.split("<item>").slice(1)) {
        const title = tagContent(item, "letterboxd:filmTitle");
        const watched = tagContent(item, "letterboxd:watchedDate");

        // The feed carries more than diary entries — a new list, a review
        // without a date. Only a watch has both, and only a watch belongs here.
        if (!title || !watched) continue;

        const cover = item.match(
            /src="(https:\/\/a\.ltrbxd\.com\/[^"]+)"/,
        )?.[1];

        films.push({
            // Dated, so a rewatch is its own row rather than a duplicate key.
            id: `${watched}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            title: decodeEntities(title),
            year: toNumber(tagContent(item, "letterboxd:filmYear")),
            cover: cover ?? null,
            rating: toNumber(tagContent(item, "letterboxd:memberRating")),
            liked: tagContent(item, "letterboxd:memberLike") === "Yes",
            watched,
        });
    }

    return films;
}

/**
 * One fetch per build, not per page: /shelf asks for the count and /movies for
 * the films, and Astro renders them in the same process.
 */
let cached: Promise<Film[]> | null = null;

export function getFilms(): Promise<Film[]> {
    cached ??= fetchFilms();
    return cached;
}

async function fetchFilms(): Promise<Film[]> {
    try {
        const response = await fetch(FEED_URL, {
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return parseFeed(await response.text());
    } catch (error) {
        // Loud in the build log, harmless to the build itself.
        console.error(`[movies] Letterboxd feed unavailable: ${error}`);
        return [];
    }
}

/**
 * Newest first the whole way down, the same as /series: the years descend, and
 * inside a year December sits above January.
 */
export async function getFilmYears(): Promise<FilmYear[]> {
    const films = await getFilms();

    const byYear = new Map<number, Film[]>();
    for (const film of films) {
        const year = Number(film.watched.slice(0, 4));
        if (!Number.isFinite(year)) continue;
        if (!byYear.has(year)) byYear.set(year, []);
        byYear.get(year)!.push(film);
    }

    return [...byYear.keys()]
        .sort((a, b) => b - a)
        .map((year) => ({
            label: String(year),
            year,
            films: byYear
                .get(year)!
                .sort((a, b) => b.watched.localeCompare(a.watched)),
        }));
}
