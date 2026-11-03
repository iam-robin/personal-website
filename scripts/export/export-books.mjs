#!/usr/bin/env node

import {
    findMarkdownFiles,
    parseMarkdownFile,
    translateKeys,
    normalizeStatus,
    writeOutput,
    getLastUpdated,
} from "./lib/utils.mjs";
import { ensureLocalCover, publishCover, dominantColor, writeCoverToNote } from "./lib/covers.mjs";

// Map vault frontmatter keys to the JSON keys the website consumes
const KEY_MAP = {
    title: "title",
    author: "author",
    pages: "pages",
    cover: "cover",
    finished: "finished",
    rating: "rating",
    added: "added",
    spine_color: "spineColor",
    text_color: "textColor",
};

async function exportBooks() {
    console.log("Exporting books...");

    const files = (await findMarkdownFiles("books/*.md")).filter(
        (f) => !f.endsWith("/README.md"),
    );
    const books = [];

    for (const filePath of files) {
        try {
            const { data } = await parseMarkdownFile(filePath);

            // Translate keys and clean wikilinks
            const book = translateKeys(data, KEY_MAP);

            // Handle status separately (normalize to array)
            book.status = normalizeStatus(data.status);

            // Ensure author is always an array
            if (book.author && !Array.isArray(book.author)) {
                book.author = [book.author];
            }

            // Parse pages as number if possible
            if (book.pages) {
                const parsed = parseInt(book.pages, 10);
                book.pages = isNaN(parsed) ? book.pages : parsed;
            }

            // Parse rating as number if possible
            if (book.rating) {
                const parsed = parseFloat(book.rating);
                book.rating = isNaN(parsed) ? book.rating : parsed;
            }

            // Cover: make sure it is a local file in the vault, then publish it
            let coverPath = null;
            try {
                const name = [data.title, ...[].concat(data.author || [])].join(" ");
                const result = await ensureLocalCover(data.cover, name);
                coverPath = result.path;
                if (result.changed) await writeCoverToNote(filePath, coverPath);
            } catch (err) {
                console.warn(`  Warning: No cover for ${book.title}: ${err.message}`);
            }
            book.cover = coverPath ? await publishCover(coverPath) : null;

            // Spine colour: hand-picked if set, otherwise taken from the cover
            if (!book.spineColor && coverPath) {
                book.spineColor = await dominantColor(coverPath);
            }

            books.push(book);
        } catch (err) {
            console.error(`  Error processing ${filePath}: ${err.message}`);
        }
    }

    // Group by status
    const aktiv = [];
    const merkliste = [];
    const pausiert = [];
    const abgeschlossen = {};

    for (const book of books) {
        const status = book.status?.[0] || "";

        if (status === "Aktiv") {
            aktiv.push(book);
        } else if (status === "Merkliste") {
            merkliste.push(book);
        } else if (status === "Pausiert") {
            pausiert.push(book);
        } else if (status === "Abgeschlossen") {
            // Extract year from finished date
            const finishedDate = book.finished ? new Date(book.finished) : null;
            const year = finishedDate
                ? String(finishedDate.getFullYear())
                : "unknown";

            if (!abgeschlossen[year]) {
                abgeschlossen[year] = [];
            }
            abgeschlossen[year].push(book);
        }
    }

    // Sort each array by finished date (most recent first)
    const sortByFinished = (a, b) => {
        const aDate = a.finished ? String(a.finished) : "";
        const bDate = b.finished ? String(b.finished) : "";
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return bDate.localeCompare(aDate);
    };

    aktiv.sort(sortByFinished);
    merkliste.sort(sortByFinished);
    pausiert.sort(sortByFinished);

    // Sort within each year
    for (const year of Object.keys(abgeschlossen)) {
        abgeschlossen[year].sort(sortByFinished);
    }

    // Sort years descending (most recent first)
    const sortedAbgeschlossen = {};
    Object.keys(abgeschlossen)
        .sort((a, b) => b.localeCompare(a))
        .forEach((year) => {
            sortedAbgeschlossen[year] = abgeschlossen[year];
        });

    const dataForComparison = {
        aktiv,
        merkliste,
        pausiert,
        abgeschlossen: sortedAbgeschlossen,
    };

    const output = {
        lastUpdated: await getLastUpdated("books.json", dataForComparison),
        count: books.length,
        ...dataForComparison,
    };

    const outputPath = await writeOutput("books.json", output);

    console.log(`  Exported ${books.length} books to ${outputPath}`);
    console.log(`    - Aktiv: ${aktiv.length}`);
    console.log(`    - Merkliste: ${merkliste.length}`);
    console.log(`    - Pausiert: ${pausiert.length}`);
    console.log(
        `    - Abgeschlossen: ${Object.keys(sortedAbgeschlossen).length} years`
    );
    return output;
}

// Run if called directly
const isMainModule =
    process.argv[1] &&
    import.meta.url.endsWith(process.argv[1].split("/").pop());
if (isMainModule || process.argv[1]?.endsWith("export-books.mjs")) {
    exportBooks().catch(console.error);
}

export { exportBooks };
