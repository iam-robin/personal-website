import booksData from "@data/books.json";

export interface Book {
    title: string;
    author: string[];
    pages: number;
    cover: string;
    rating: number | null;
    finished: string | null;
    genre: string[] | null;
    published: string;
    spineColor?: string | null;
    textColor?: string | null;
}

export interface BooksData {
    lastUpdated: string;
    count: number;
    aktiv: Book[];
    merkliste: Book[];
    abgeschlossen: Record<string, Book[]>;
}

export async function fetchBooks(): Promise<BooksData> {
    return booksData as BooksData;
}
