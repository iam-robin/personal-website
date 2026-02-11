interface LastfmArtist {
    url: string;
    name: string;
    mbid: string;
}

interface LastfmAlbumRaw {
    artist: LastfmArtist;
    image: Array<{ "#text": string; size: string }>;
    mbid: string;
    url: string;
    playcount: string;
    "@attr": Record<string, unknown>;
    name: string;
}

export interface AlbumDetails {
    title: string;
    artist: string;
    cover: string;
    playCount: number;
    url: string;
}

type Period = "1month" | "overall";

const TIMEOUT_MS = 5000;

export async function fetchTopAlbums(
    period: Period,
    limit: number = 12,
): Promise<AlbumDetails[]> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const params = new URLSearchParams({
            method: "user.gettopalbums",
            user: import.meta.env.LAST_FM_USER_NAME,
            api_key: import.meta.env.LAST_FM_API_KEY,
            limit: limit.toString(),
            period,
            format: "json",
        });

        const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?${params}`,
            { signal: controller.signal },
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`Last.fm API error: ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        const albums: LastfmAlbumRaw[] = data?.topalbums?.album || [];

        return albums.map((album) => ({
            title: album.name,
            artist: album.artist.name,
            cover: album.image[3]?.["#text"] || album.image[2]?.["#text"] || "",
            playCount: parseInt(album.playcount, 10),
            url: album.url,
        }));
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            console.warn("Last.fm API request timed out");
        } else {
            console.error("Failed to fetch Last.fm albums:", error);
        }
        return [];
    }
}
