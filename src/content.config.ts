import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { linkdingLoader } from "./loaders/linkding";

/**
 * Exported dates mix ISO dates, plain years, empty strings and negative years,
 * so they stay strings. Parse at the point of use.
 */

const slugify = (value: string) =>
    value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const uniqueIdFactory = () => {
    const seen = new Map<string, number>();
    return (value: string) => {
        const base = slugify(value) || "entry";
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        return count === 0 ? base : `${base}-${count + 1}`;
    };
};

type Group = "aktiv" | "merkliste" | "pausiert" | "abgeschlossen";
const GROUPS: Group[] = ["aktiv", "merkliste", "pausiert"];

/** books.json / series.json: flat arrays per group, `abgeschlossen` keyed by year. */
const parseGroupedMedia = (text: string) => {
    const data = JSON.parse(text);
    const uniqueId = uniqueIdFactory();
    const entries: Record<string, unknown>[] = [];

    for (const group of GROUPS) {
        for (const item of data[group] ?? []) {
            entries.push({ ...item, id: uniqueId(item.title), group });
        }
    }
    for (const [year, items] of Object.entries(data.abgeschlossen ?? {})) {
        for (const item of items as Record<string, unknown>[]) {
            entries.push({
                ...item,
                id: uniqueId(String(item.title)),
                group: "abgeschlossen",
                finishedYear: year,
            });
        }
    }
    return entries;
};

const groupSchema = z.enum(["aktiv", "merkliste", "pausiert", "abgeschlossen"]);

/** The exports send null, bare strings and null entries for arrays. */
const nullableArray = z
    .union([z.array(z.string().nullable()), z.string()])
    .nullish()
    .transform((value) => {
        if (value == null) return [];
        const array = Array.isArray(value) ? value : [value];
        return array.filter(
            (entry): entry is string => typeof entry === "string",
        );
    });

const books = defineCollection({
    loader: file("data/output/books.json", { parser: parseGroupedMedia }),
    schema: z.object({
        title: z.string(),
        author: z.array(z.string()).default([]),
        pages: z.union([z.number(), z.string()]).optional(),
        published: z.union([z.number(), z.string()]).optional(),
        cover: z.string().nullable().optional(),
        isbn: z.union([z.string(), z.number()]).nullable().optional(),
        publisher: z.string().optional(),
        genre: nullableArray,
        finished: z.string().nullable().optional(),
        rating: z.union([z.number(), z.string()]).nullable().optional(),
        added: z.string().optional(),
        spineColor: z.string().optional(),
        textColor: z.string().optional(),
        status: z.array(z.string()).default([]),
        group: groupSchema,
        finishedYear: z.string().optional(),
    }),
});

const series = defineCollection({
    loader: file("data/output/series.json", { parser: parseGroupedMedia }),
    schema: z.object({
        title: z.string(),
        season: z.union([z.number(), z.string()]).optional(),
        genre: nullableArray,
        director: nullableArray,
        rating: z.union([z.number(), z.string()]).nullable().optional(),
        imdbScore: z.number().nullable().optional(),
        cast: nullableArray,
        cover: z.string().nullable().optional(),
        released: z.string().nullable().optional(),
        finished: z.string().nullable().optional(),
        added: z.string().nullable().optional(),
        favorite: z.boolean().optional(),
        status: z.array(z.string()).default([]),
        group: groupSchema,
        finishedYear: z.string().optional(),
    }),
});

/** Bare filename in src/generated/bookmark-covers, resolved in utils/bookmarks.ts. */
const bookmarks = defineCollection({
    loader: linkdingLoader(),
    schema: z.object({
        title: z.string(),
        url: z.string(),
        added: z.string(),
        cover: z.string().nullable().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).default([]),
    }),
});

const garden = defineCollection({
    loader: file("data/output/digital-garden.json", {
        parser: (text) => {
            const data = JSON.parse(text);
            const uniqueId = uniqueIdFactory();
            return Object.entries(data)
                .filter(([, value]) => Array.isArray(value))
                .flatMap(([category, notes]) =>
                    (notes as { slug: string }[]).map((note) => ({
                        ...note,
                        id: uniqueId(note.slug),
                        category,
                    })),
                );
        },
    }),
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        category: z.string(),
        thema: z.string(),
        description: z.string().optional(),
        created: z.string(),
        edited: z.string().nullable().optional(),
        content: z.string(),
    }),
});

const timeline = defineCollection({
    loader: file("data/output/timeline.json", {
        parser: (text) => {
            const uniqueId = uniqueIdFactory();
            return JSON.parse(text).entries.map((entry: { title: string }) => ({
                ...entry,
                id: uniqueId(entry.title),
            }));
        },
    }),
    schema: z.object({
        title: z.string(),
        type: z.string(),
        start: z.string().nullable().optional(),
        end: z.string().nullable().optional(),
        domain: z.string().optional(),
        tags: z.array(z.string()).default([]),
        added: z.string().optional(),
        content: z.string().optional(),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        year: z.string(),
        order: z.number().optional().default(0),
        tags: z.array(z.string()).optional(),
        externalUrl: z.string().optional(),
        draft: z.boolean().optional().default(false),
    }),
});

const blog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            image: image().optional(),
            description: z.string().optional(),
            date: z.date(),
            category: z.string().optional(),
            /** Status id or toot URL. Its replies are mirrored under the post. */
            mastodonId: z.string().optional(),
            /** Path under public/. Unset, the card is generated from the title. */
            ogImage: z.string().optional(),
            /** Opt-in authorship note for posts written with AI assistance. */
            aiDisclosure: z.boolean().optional(),
        }),
});

export const collections = {
    books,
    series,
    bookmarks,
    garden,
    timeline,
    projects,
    blog,
};
