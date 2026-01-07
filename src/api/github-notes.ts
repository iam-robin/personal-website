export interface Note {
    thema: string;
    title: string;
    description: string;
    slug: string;
    created: string;
    edited: string;
    content: string;
}

export interface NotesData {
    lastUpdated: string;
    count: number;
    [category: string]: Note[] | string | number;
}

export async function fetchNotes(): Promise<NotesData> {
    const response = await fetch(
        "https://raw.githubusercontent.com/iam-robin/obsidian-personal-website-data/main/output/digital-garden.json",
        {
            headers: {
                Authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3.raw",
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.statusText}`);
    }

    return response.json();
}

export function getAllNotes(data: NotesData): Note[] {
    const notes: Note[] = [];
    const excludedKeys = ["lastUpdated", "count"];

    for (const key of Object.keys(data)) {
        if (!excludedKeys.includes(key) && Array.isArray(data[key])) {
            notes.push(...(data[key] as Note[]));
        }
    }

    return notes;
}

export function getCategories(data: NotesData): string[] {
    const excludedKeys = ["lastUpdated", "count"];
    return Object.keys(data).filter(
        (key) => !excludedKeys.includes(key) && Array.isArray(data[key])
    );
}
