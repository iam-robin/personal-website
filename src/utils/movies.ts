const USERNAME = "iamrobin";
export const PROFILE_URL = `https://letterboxd.com/${USERNAME}/`;
const FEED_URL = `${PROFILE_URL}rss/`;
const TIMEOUT_MS = 10_000;

/** Entries per feed. Quoted on /movies. */
export const FEED_LIMIT = 50;

export interface Film {
    id: string;
    title: string;
    year: number | null;
    cover: string | null;
    rating: number | null;
    liked: boolean;
    /** ISO yyyy-mm-dd. */
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

    // Split, not matched: the description's CDATA trips a greedy item regex.
    for (const item of xml.split("<item>").slice(1)) {
        const title = tagContent(item, "letterboxd:filmTitle");
        const watched = tagContent(item, "letterboxd:watchedDate");

        // Only diary entries have both.
        if (!title || !watched) continue;

        const cover = item.match(
            /src="(https:\/\/a\.ltrbxd\.com\/[^"]+)"/,
        )?.[1];

        films.push({
            // Dated, so a rewatch gets its own id.
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

/** Cached: several pages ask during one build. */
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
        console.error(`[movies] Letterboxd feed unavailable: ${error}`);
        return [];
    }
}

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
