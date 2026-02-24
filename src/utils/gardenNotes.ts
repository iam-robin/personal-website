import { fetchNotes, type Note } from "@api/github-notes";

export interface GardenNoteMatch {
    slug: string;
    category: string;
}

export async function buildGardenNoteMap(
    category: string,
    titles: string[],
): Promise<Map<string, GardenNoteMatch>> {
    const notesData = await fetchNotes();
    const notes = (notesData[category] as Note[]) || [];
    const map = new Map<string, GardenNoteMatch>();
    for (const note of notes) {
        for (const title of titles) {
            if (note.title.includes(title)) {
                map.set(title, {
                    slug: note.slug,
                    category: category.toLowerCase(),
                });
            }
        }
    }
    return map;
}
