#!/usr/bin/env node

import { mkdir, readFile, readdir, rm, writeFile } from "fs/promises";
import { basename, extname, join } from "path";
import { glob } from "glob";
import {
    VAULT_PATH,
    OUTPUT_PATH,
    findMarkdownFiles,
    parseMarkdownFile,
} from "./lib/utils.mjs";

// Published posts are written as markdown files to data/blog/ (read by the
// blog collection in content.config.ts), their images to data/blog/images/.
// Drafts go to data/blog-drafts/ the same way. That folder is gitignored, so
// drafts only ever show up in `astro dev`, never on the deployed site.
const BLOG_DIR = join(OUTPUT_PATH, "blog");
const DRAFTS_DIR = join(OUTPUT_PATH, "blog-drafts");

// Frontmatter the website's blog schema knows, in output order. Everything
// else (draft, added, updated, slug, ...) stays in the vault.
const FIELDS = [
    "title",
    "subtitle",
    "image",
    "date",
    "category",
    "description",
    "mastodonId",
    "ogImage",
    "aiDisclosure",
];

function slugify(value) {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/** Same rule as export-digital-garden.mjs, so the URLs match. */
function gardenSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/** "2025-04-10" for a YAML date, as gray-matter returns a Date. */
function formatDate(value) {
    return value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
}

/**
 * The post URL: `slug` from the frontmatter, otherwise date + title
 * ("2026_11_03-my-post"), the format the existing posts use.
 */
function postSlug(data, title) {
    if (data.slug) return String(data.slug);
    return `${formatDate(data.date).replaceAll("-", "_")}-${slugify(title)}`;
}

/** Wikilink target "Note#Heading" or "folder/Note" → "Note". */
function linkName(target) {
    return basename(target.split("#")[0].trim(), ".md");
}

/**
 * Where a wikilink to another note points on the website: published posts
 * and garden notes get a URL, anything else (private notes, drafts) is left
 * as text.
 */
async function buildLinkTargets(posts) {
    const targets = new Map();
    for (const post of posts) targets.set(post.name, `/blog/${post.slug}`);

    for (const file of await findMarkdownFiles("garden/*.md")) {
        const { data } = await parseMarkdownFile(file);
        const name = basename(file, ".md");
        if (data.topic && !targets.has(name)) {
            targets.set(name, `/notes/${String(data.topic).toLowerCase()}/${gardenSlug(name)}`);
        }
    }
    return targets;
}

/** Vault image name → absolute path, for every file under attachments/. */
async function buildImageIndex() {
    const files = await glob("attachments/**/*.{png,jpg,jpeg,gif,webp,svg,avif}", {
        cwd: VAULT_PATH,
        absolute: true,
        nocase: true,
    });
    return new Map(files.map((file) => [basename(file), file]));
}

/**
 * Rewrite Obsidian syntax to plain markdown, outside of code. Fenced blocks
 * and inline code pass through untouched.
 */
function transformBody(body, { post, linkTargets, useImage }) {
    const parts = body.split(/(```[\s\S]*?```|`[^`\n]+`)/);
    return parts
        .map((part, index) => {
            if (index % 2 === 1) return part;
            return part
                .replace(/%%[\s\S]*?%%/g, "")
                .replace(/!\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (match, target, alt = "") => {
                    const file = useImage(target.trim());
                    if (!file) {
                        console.warn(`    ${post}: embed not exported: ${match}`);
                        return "";
                    }
                    // `|300` is an Obsidian size, not alt text
                    const text = /^\d+(x\d+)?$/.test(alt.trim()) ? "" : alt.trim();
                    return `![${text}](./images/${file})`;
                })
                .replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (match, target, alias) => {
                    const text = alias?.trim() || linkName(target);
                    const href = linkTargets.get(linkName(target));
                    if (!href) {
                        console.warn(`    ${post}: link to unpublished note, kept as text: ${match}`);
                        return text;
                    }
                    return `[${text}](${href})`;
                });
        })
        .join("");
}

function toFrontmatter(data) {
    const lines = FIELDS.filter((key) => data[key] !== undefined && data[key] !== null && data[key] !== "").map(
        (key) => {
            const value = data[key];
            if (key === "date") return `date: ${formatDate(value)}`;
            if (typeof value === "boolean") return `${key}: ${value}`;
            return `${key}: ${JSON.stringify(String(value))}`;
        },
    );
    return `---\n${lines.join("\n")}\n---\n`;
}

/** Write only what changed, so a running dev server reloads just that post. */
async function writeIfChanged(path, content) {
    const current = await readFile(path).catch(() => null);
    if (current && Buffer.compare(current, Buffer.from(content)) === 0) return;
    await writeFile(path, content);
}

/**
 * Write posts into `dir` (markdown + images/) and remove whatever is left
 * over from posts and images that no longer exist.
 */
async function writePosts(dir, posts, linkTargets, imageIndex) {
    const imageDir = join(dir, "images");
    await mkdir(imageDir, { recursive: true });
    const keepPosts = new Set();
    const keepImages = new Map(); // output name → vault path

    for (const post of posts) {
        /** Copy a vault image next to the posts, return its output name. */
        const useImage = (target) => {
            const source = imageIndex.get(basename(target));
            if (!source) return null;
            const ext = extname(source).toLowerCase();
            const name = `${slugify(basename(source, extname(source)))}${ext}`;
            keepImages.set(name, source);
            return name;
        };

        const data = { ...post.data };
        if (data.image) {
            const name = useImage(linkName(String(data.image).replace(/^\[\[|\]\]$/g, "")));
            if (name) data.image = `./images/${name}`;
            else {
                console.warn(`    ${post.name}: image not found: ${data.image}`);
                delete data.image;
            }
        }

        const body = transformBody(post.body, { post: post.name, linkTargets, useImage });
        const file = `${post.slug}.md`;
        keepPosts.add(file);
        await writeIfChanged(join(dir, file), `${toFrontmatter(data)}${body}`);
    }

    for (const [name, source] of keepImages) {
        await writeIfChanged(join(imageDir, name), await readFile(source));
    }

    for (const file of await readdir(dir)) {
        if (file.endsWith(".md") && !keepPosts.has(file)) await rm(join(dir, file));
    }
    for (const file of await readdir(imageDir)) {
        if (!keepImages.has(file)) await rm(join(imageDir, file));
    }
}

async function exportBlog() {
    console.log("Exporting blog posts...");

    const files = (await findMarkdownFiles("blog/*.md")).filter((f) => !f.endsWith("/README.md"));

    const published = [];
    const drafts = [];
    for (const file of files) {
        try {
            const { data, body } = await parseMarkdownFile(file);
            const name = basename(file, ".md");
            // Only `draft: false` publishes, so a missing or mistyped value
            // keeps a post private rather than putting it online
            const isDraft = data.draft !== false;
            // A draft without a date still shows up locally, dated today
            if (!data.date && isDraft) data.date = new Date();
            if (!data.date) throw new Error("no `date`");
            const title = data.title ? String(data.title) : name;
            const post = { file, name, data: { ...data, title }, body, slug: postSlug(data, title) };
            (isDraft ? drafts : published).push(post);
        } catch (err) {
            console.error(`  Error processing ${file}: ${err.message}`);
        }
    }

    // Like writeOutput(): never blank the published posts because the vault
    // couldn't be read.
    const previous = (await readdir(BLOG_DIR).catch(() => [])).filter((f) => f.endsWith(".md"));
    if (published.length === 0 && previous.length > 0) {
        throw new Error(`Found 0 published blog posts, but data/blog has ${previous.length}. Not overwriting.`);
    }

    const imageIndex = await buildImageIndex();
    // Published posts must not link to drafts; drafts may link to anything
    await writePosts(BLOG_DIR, published, await buildLinkTargets(published), imageIndex);
    await writePosts(DRAFTS_DIR, drafts, await buildLinkTargets([...published, ...drafts]), imageIndex);

    console.log(`  Exported ${published.length} blog posts to ${BLOG_DIR}, ${drafts.length} drafts to ${DRAFTS_DIR}`);
    return { count: published.length };
}

// Run if called directly
if (process.argv[1]?.endsWith("export-blog.mjs")) {
    exportBlog().catch(console.error);
}

export { exportBlog };
