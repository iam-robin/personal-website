import { readFile } from "fs/promises";
import { glob } from "glob";
import matter from "gray-matter";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const VAULT_PATH = "/Users/robin/Documents/Obsidian/Notes";
// Written into the website repo's data/ folder, which content.config.ts reads
export const OUTPUT_PATH = join(__dirname, "../../../data");

/**
 * Get lastUpdated timestamp - preserves existing timestamp if data unchanged
 */
export async function getLastUpdated(filename, newData) {
    const outputPath = join(OUTPUT_PATH, filename);
    try {
        const existing = JSON.parse(await readFile(outputPath, "utf-8"));
        const { lastUpdated: _, count: __, ...existingData } = existing;
        const { lastUpdated: ___, count: ____, ...newDataOnly } = newData;

        if (JSON.stringify(existingData) === JSON.stringify(newDataOnly)) {
            return existing.lastUpdated; // Data unchanged, keep old timestamp
        }
    } catch (err) {
        // File doesn't exist or parse error - use new timestamp
    }
    return new Date().toISOString();
}

/**
 * Remove wikilink brackets from a value
 * "[[Some Text]]" → "Some Text"
 * Also handles arrays
 */
export function cleanWikilinks(value) {
    if (value === null || value === undefined) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(cleanWikilinks);
    }

    if (typeof value === "string") {
        return value.replace(/\[\[([^\]]+)\]\]/g, "$1");
    }

    return value;
}

/**
 * Clean all wikilinks in an object's values
 */
export function cleanAllWikilinks(obj) {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
        cleaned[key] = cleanWikilinks(value);
    }
    return cleaned;
}

/**
 * Parse a markdown file and extract frontmatter
 */
export async function parseMarkdownFile(filePath) {
    const content = await readFile(filePath, "utf-8");
    const { data, content: body } = matter(content);
    return { data, body, filePath };
}

/**
 * Find all markdown files matching a glob pattern
 */
export async function findMarkdownFiles(pattern) {
    return glob(pattern, { cwd: VAULT_PATH, absolute: true });
}

/**
 * Normalize a status value to array
 */
export function normalizeStatus(status) {
    if (!status) return [];
    if (Array.isArray(status)) return status.map((s) => cleanWikilinks(s));
    return [cleanWikilinks(status)];
}

/**
 * Map vault frontmatter keys to the JSON keys the website consumes.
 * Vault keys and JSON keys are both English now, but they still differ in
 * places (e.g. `source` -> `url`, `topic` -> `thema`), so the map stays.
 */
export function translateKeys(data, keyMap) {
    const result = {};
    for (const [vaultKey, jsonKey] of Object.entries(keyMap)) {
        if (data[vaultKey] !== undefined) {
            result[jsonKey] = cleanWikilinks(data[vaultKey]);
        }
    }
    return result;
}

/**
 * Create the standard JSON output structure
 */
export function createOutput(items) {
    return {
        lastUpdated: new Date().toISOString(),
        count: items.length,
        items,
    };
}

/**
 * Write JSON to output file.
 *
 * Refuses to write an empty result over a non-empty file. A frontmatter key
 * rename that misses one of the direct `data.x` reads makes every exporter
 * yield 0 items, which would otherwise silently blank the published JSON.
 * Pass { allowEmpty: true } if a genuinely empty export is ever expected.
 */
export async function writeOutput(filename, data, { allowEmpty = false } = {}) {
    const { writeFile, mkdir, readFile: rf } = await import("fs/promises");
    await mkdir(OUTPUT_PATH, { recursive: true });
    const outputPath = join(OUTPUT_PATH, filename);

    if (!allowEmpty && data?.count === 0) {
        let previousCount = 0;
        try {
            previousCount = JSON.parse(await rf(outputPath, "utf-8")).count ?? 0;
        } catch {
            previousCount = 0;
        }
        if (previousCount > 0) {
            throw new Error(
                `Refusing to write ${filename}: export produced 0 items but the ` +
                    `existing file has ${previousCount}. This usually means a ` +
                    `frontmatter key was renamed without updating the exporter. ` +
                    `Pass { allowEmpty: true } to override.`
            );
        }
    }

    await writeFile(outputPath, JSON.stringify(data, null, 2));
    return outputPath;
}
