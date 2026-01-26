import { defineCollection, z } from "astro:content";

const projectCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        year: z.string(),
        thumbnail: z.string().optional(),
        thumbnailWidth: z.string().optional(),
        tags: z.array(z.string()).optional(),
        bgColor: z.string().optional(),
        bgColorDark: z.string().optional(),
        externalUrl: z.string().optional(),
        draft: z.boolean().optional().default(false),
    }),
});

const blogCollection = defineCollection({
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            image: image().optional(),
            description: z.string().optional(),
            date: z.date(),
            category: z.string().optional(),
            mastodonId: z.string().optional(),
            ogImageName: z.string().optional(),
        }),
});

export const collections = {
    projects: projectCollection,
    blog: blogCollection,
};
