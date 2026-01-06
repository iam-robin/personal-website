export interface Series {
    title: string;
    season: string;
    genre: string[];
    director: string[];
    rating: number | null;
    imdbScore: number;
    cast: string[];
    cover: string;
    released: string;
    finished: string | null;
    added: string;
    status: string;
}

export interface SeriesData {
    lastUpdated: string;
    count: number;
    aktiv: Series[];
    merkliste: Series[];
    pausiert: Series[];
    abgeschlossen: Record<string, Series[]>;
}

export async function fetchSeries(): Promise<SeriesData> {
    const response = await fetch(
        "https://raw.githubusercontent.com/iam-robin/obsidian-personal-website-data/main/output/series.json",
        {
            headers: {
                Authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3.raw",
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch series: ${response.statusText}`);
    }

    return response.json();
}
