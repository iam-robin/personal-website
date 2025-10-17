import { defineCollection, z } from 'astro:content';

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
            ogImageName: z.string().optional()
        })
});

export const collections = {
    blog: blogCollection
};
