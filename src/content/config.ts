import { defineCollection, z } from 'astro:content';

const photo365Collection = defineCollection({
    schema: ({ image }) =>
        z.object({
            image: image(),
            date: z.date(),
            day: z.string(),
            time: z.string(),
            cameraBrand: z.string(),
            cameraModel: z.string(),
            lensBrand: z.string(),
            lensModel: z.string(),
            description: z.string().optional(),
            tags: z.array(z.string()).optional()
        })
});

const blogCollection = defineCollection({
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            image: image().optional(),
            description: z.string().optional(),
            date: z.date(),
            category: z.string().optional()
        })
});

export const collections = {
    365: photo365Collection,
    blog: blogCollection
};
