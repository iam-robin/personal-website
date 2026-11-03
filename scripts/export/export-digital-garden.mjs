#!/usr/bin/env node

import { basename } from "path";
import {
    findMarkdownFiles,
    parseMarkdownFile,
    translateKeys,
    writeOutput,
    getLastUpdated,
} from "./lib/utils.mjs";

// Map vault frontmatter keys to the JSON keys the website consumes.
// The JSON side keeps `thema` so digital-garden.json stays byte-identical
// and the website needs no change; only the vault key was renamed to `topic`.
const KEY_MAP = {
    topic: "thema",
    description: "description",
    added: "created",
    updated: "edited",
};

/**
 * Generate a URL-friendly slug from a filename
 */
function slugify(filename) {
    return filename
        .replace(/\.md$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Extract title from filename (without .md extension)
 */
function getTitleFromPath(filePath) {
    return basename(filePath, ".md");
}

async function exportDigitalGarden() {
    console.log("Exporting Digital Garden notes...");

    const files = await findMarkdownFiles("garden/*.md");
    const notes = [];

    for (const filePath of files) {
        try {
            const { data, body } = await parseMarkdownFile(filePath);

            // Translate keys and clean wikilinks
            const note = translateKeys(data, KEY_MAP);

            // Add title from filename
            note.title = getTitleFromPath(filePath);

            // Add slug
            note.slug = slugify(basename(filePath));

            // Add content (the body of the markdown file)
            note.content = body.trim();

            notes.push(note);
        } catch (err) {
            console.error(`  Error processing ${filePath}: ${err.message}`);
        }
    }

    // Group by thema
    const byThema = {};

    for (const note of notes) {
        const thema = note.thema || "Uncategorized";

        if (!byThema[thema]) {
            byThema[thema] = [];
        }
        byThema[thema].push(note);
    }

    // Sort each thema array by edited date (most recent first)
    const sortByEdited = (a, b) => {
        const aDate = a.edited ? String(a.edited) : "";
        const bDate = b.edited ? String(b.edited) : "";
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return bDate.localeCompare(aDate);
    };

    for (const thema of Object.keys(byThema)) {
        byThema[thema].sort(sortByEdited);
    }

    // Sort thema keys alphabetically
    const sortedByThema = {};
    Object.keys(byThema)
        .sort((a, b) => a.localeCompare(b))
        .forEach((thema) => {
            sortedByThema[thema] = byThema[thema];
        });

    const output = {
        lastUpdated: await getLastUpdated("digital-garden.json", sortedByThema),
        count: notes.length,
        ...sortedByThema,
    };

    const outputPath = await writeOutput("digital-garden.json", output);

    console.log(
        `  Exported ${notes.length} Digital Garden notes to ${outputPath}`
    );
    for (const [thema, themeNotes] of Object.entries(sortedByThema)) {
        console.log(`    - ${thema}: ${themeNotes.length}`);
    }
    return output;
}

// Run if called directly
const isMainModule =
    process.argv[1] &&
    import.meta.url.endsWith(process.argv[1].split("/").pop());
if (isMainModule || process.argv[1]?.endsWith("export-digital-garden.mjs")) {
    exportDigitalGarden().catch(console.error);
}

export { exportDigitalGarden };
