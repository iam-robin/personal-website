#!/usr/bin/env node

import { basename } from "path";
import {
    findMarkdownFiles,
    parseMarkdownFile,
    translateKeys,
    writeOutput,
    getLastUpdated,
    cleanWikilinks,
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

// Book and series notes become garden notes too: whatever is written under a
// "## Garden" heading (to the end of the note) is published, everything above
// it stays private.
const GARDEN_HEADING = /^## Garden[ \t]*$/m;

function gardenSection(body) {
    const match = body.match(GARDEN_HEADING);
    if (!match) return null;
    return body.slice(match.index + match[0].length).trim() || null;
}

/**
 * Dates as the Linter writes them ("YYYY-MM-DD HH:mm"). YAML turns bare
 * dates like `finished: 2024-09-14` into Date objects.
 */
function formatDate(value) {
    if (!value) return null;
    if (value instanceof Date) return `${value.toISOString().slice(0, 10)} 00:00`;
    return String(value);
}

/**
 * "Title – Author" for books (subtitle after the colon dropped), "Show 2" for
 * series. The website matches its book and series logs to notes by these.
 */
function mediaTitle(kind, data) {
    if (kind === "books") {
        const title = String(data.title || "").split(":")[0].trim();
        const authors = [].concat(cleanWikilinks(data.author) || []).join(", ");
        return authors ? `${title} – ${authors}` : title;
    }
    return [cleanWikilinks(data.title), data.season].filter(Boolean).join(" ");
}

const MEDIA_SOURCES = [
    { kind: "books", pattern: "books/*.md", topic: "Books" },
    { kind: "series", pattern: "series/*.md", topic: "Series" },
];

async function collectMediaNotes() {
    const notes = [];
    for (const { kind, pattern, topic } of MEDIA_SOURCES) {
        for (const filePath of await findMarkdownFiles(pattern)) {
            try {
                const { data, body } = await parseMarkdownFile(filePath);
                const content = gardenSection(body);
                if (!content) continue;

                const title = mediaTitle(kind, data);
                const note = {
                    thema: topic,
                    title,
                    slug: slugify(title),
                    // Written once watched or read, so that's the note's date
                    created: formatDate(data.finished) || formatDate(data.added) || "",
                    edited: formatDate(data.updated),
                    content,
                };
                if (data.description) note.description = data.description;
                notes.push(note);
            } catch (err) {
                console.error(`  Error processing ${filePath}: ${err.message}`);
            }
        }
    }
    return notes;
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

    const slugs = new Set(notes.map((note) => note.slug));
    for (const note of await collectMediaNotes()) {
        if (slugs.has(note.slug)) {
            console.warn(`  Warning: Skipping "${note.title}", a garden note has the same slug`);
            continue;
        }
        slugs.add(note.slug);
        notes.push(note);
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
