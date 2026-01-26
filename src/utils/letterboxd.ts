export interface LetterboxdFilm {
    watched_on: string;
    title: string;
    rating: number;
    rewatched: boolean;
    permalink: string;
    liked: boolean;
    posterUrl?: string;
}

export interface LetterboxdData {
    updated_at: string;
    count: number;
    films: LetterboxdFilm[];
}

const LETTERBOXD_BASE_URL = "https://letterboxd.com";

function getTagContent(xml: string, tagName: string): string | null {
    const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i");
    const match = xml.match(regex);
    return match ? match[1].trim() : null;
}

export async function scrapeLetterboxdFilms(
    username: string,
): Promise<LetterboxdData> {
    console.log(`Fetching Letterboxd RSS feed for user: ${username}`);

    const url = `${LETTERBOXD_BASE_URL}/${username}/rss/`;
    const response = await fetch(url);
    const xml = await response.text();

    const films: LetterboxdFilm[] = [];

    // Split by <item> tags to get individual entries
    const items = xml.split("<item>").slice(1);
    console.log(`Found ${items.length} items in RSS feed`);

    for (const item of items) {
        // Get film title
        const title = getTagContent(item, "letterboxd:filmTitle") || "";

        // Get watched date (format: YYYY-MM-DD)
        const watchedDate = getTagContent(item, "letterboxd:watchedDate") || "";

        if (!title || !watchedDate) {
            console.log("Skipping item - missing title or date:", {
                hasTitle: !!title,
                hasDate: !!watchedDate,
                itemPreview: item.substring(0, 200),
            });
        }

        // Get rating (0-5 scale, can be decimal like 3.5)
        const ratingStr = getTagContent(item, "letterboxd:memberRating");
        const rating = ratingStr ? parseFloat(ratingStr) : 0;

        // Check if rewatch
        const rewatchStr = getTagContent(item, "letterboxd:rewatch");
        const rewatched = rewatchStr === "Yes";

        // Check if liked
        const likedStr = getTagContent(item, "letterboxd:memberLike");
        const liked = likedStr === "Yes";

        // Get permalink from link (e.g., "https://letterboxd.com/iamrobin/film/gone-girl/" -> "film/gone-girl/")
        const link = getTagContent(item, "link") || "";
        const permalinkMatch = link.match(
            /letterboxd\.com\/[^/]+\/(film\/[^/]+\/)/,
        );
        const permalink = permalinkMatch ? permalinkMatch[1] : "";

        // Get poster URL from description CDATA
        let posterUrl: string | undefined;
        const description = getTagContent(item, "description");
        if (description) {
            // Extract from CDATA: <![CDATA[ <p><img src="..."/></p> ... ]]>
            const posterMatch = description.match(
                /src="(https:\/\/a\.ltrbxd\.com\/[^"]+)"/,
            );
            if (posterMatch) {
                posterUrl = posterMatch[1];
            }
        }

        if (title && watchedDate) {
            films.push({
                title,
                watched_on: watchedDate,
                rating,
                rewatched,
                permalink,
                liked,
                posterUrl,
            });
        }
    }

    console.log(`Fetched ${films.length} films from RSS feed`);

    return {
        updated_at: new Date().toISOString(),
        count: films.length,
        films,
    };
}
