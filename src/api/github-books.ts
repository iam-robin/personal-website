export interface Book {
    title: string;
    author: string[];
    pages: number;
    cover: string;
    rating: number | null;
    finished: string | null;
    genre: string[] | null;
    published: string;
}

export interface BooksData {
    lastUpdated: string;
    count: number;
    aktiv: Book[];
    merkliste: Book[];
    abgeschlossen: Record<string, Book[]>;
}

export async function fetchBooks(): Promise<BooksData> {
    const response = await fetch(
        "https://raw.githubusercontent.com/iam-robin/obsidian-personal-website-data/main/output/books.json",
        {
            headers: {
                Authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3.raw",
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    return response.json();
}
