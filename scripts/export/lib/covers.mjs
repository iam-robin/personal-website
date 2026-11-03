import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, basename, extname } from "path";
import sharp from "sharp";
import { VAULT_PATH, OUTPUT_PATH } from "./utils.mjs";

// Covers live in the vault; the export copies them to data/ for the website.
const KINDS = {
    books: { vaultDir: "attachments/book-cover", outputDir: "book-covers" },
    series: { vaultDir: "attachments/series-cover", outputDir: "series-covers" },
};

const MAX_SIZE = { width: 1000, height: 1500 };

export function slugify(value) {
    return value
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function download(url) {
    const res = await fetch(url, { headers: { Accept: "image/*" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return Buffer.from(await res.arrayBuffer());
}

async function toJpeg(buffer) {
    return sharp(buffer)
        .resize({ ...MAX_SIZE, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
}

/**
 * Google Books cover URLs (what the Book Search plugin puts into `cover`)
 * point to a 128px thumbnail. `fife=w1000` asks Google for the same image
 * at 1000px; the page-curl effect is dropped too.
 */
function largeGoogleCover(url) {
    if (!/books\.google(usercontent)?\.com/.test(url)) return null;
    const u = new URL(url);
    u.searchParams.delete("edge");
    u.searchParams.set("fife", "w1000");
    return u.toString();
}

/**
 * Make sure a cover is a local file in the vault and return its
 * vault-relative path, or null.
 *
 * A URL in `cover` is downloaded into the vault as `<name>.jpg` (Google
 * covers in large); `changed` tells the caller to write the new path back
 * into the note.
 */
export async function ensureLocalCover(cover, name, kind = "books") {
    cover = typeof cover === "string" ? cover.trim() : "";
    if (!cover) return { path: null, changed: false };

    if (/^https?:\/\//.test(cover)) {
        const { vaultDir } = KINDS[kind];
        const path = `${vaultDir}/${slugify(name) || "cover"}.jpg`;
        await mkdir(join(VAULT_PATH, vaultDir), { recursive: true });
        const large = largeGoogleCover(cover);
        let image;
        try {
            image = await download(large || cover);
        } catch (err) {
            if (!large) throw err;
            image = await download(cover);
        }
        await writeFile(join(VAULT_PATH, path), await toJpeg(image));
        console.log(`  Downloaded cover for ${name}`);
        return { path, changed: true };
    }

    const full = join(VAULT_PATH, cover);
    if (!existsSync(full)) {
        console.warn(`  Warning: Cover file not found: ${cover}`);
        return { path: null, changed: false };
    }

    return { path: cover, changed: false };
}

/**
 * Copy a vault cover into the website output (only when it changed) and
 * return the path the website expects.
 */
export async function publishCover(vaultPath, kind = "books") {
    const { outputDir } = KINDS[kind];
    const ext = extname(vaultPath).toLowerCase() || ".jpg";
    const file = slugify(basename(vaultPath, extname(vaultPath))) + ext;
    const dest = join(OUTPUT_PATH, outputDir, file);
    const source = await readFile(join(VAULT_PATH, vaultPath));

    await mkdir(join(OUTPUT_PATH, outputDir), { recursive: true });
    if (!existsSync(dest) || !source.equals(await readFile(dest))) {
        await writeFile(dest, source);
    }
    return `${outputDir}/${file}`;
}

/** Dominant colour of a cover as a hex string, used as the spine colour. */
export async function dominantColor(vaultPath) {
    const { dominant } = await sharp(join(VAULT_PATH, vaultPath)).stats();
    return "#" + [dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

/** Replace the `cover` value in a note's frontmatter, leaving everything else as is. */
export async function writeCoverToNote(filePath, coverPath) {
    const text = await readFile(filePath, "utf8");
    const updated = text.replace(/^(---\n[\s\S]*?)^cover:.*(?:\n[ \t]+.*)*$/m,`$1cover: ${coverPath}`);
    if (updated !== text) await writeFile(filePath, updated);
}
