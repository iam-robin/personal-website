import { defineCollection, z } from 'astro:content';

const photo365Collection = defineCollection({
    schema: z.object({
        description: z.string().optional(),
        image: z.string(), // Path to image file
        date: z.date(),
        day: z.string(),
        time: z.string(),
        tags: z.array(z.string()).optional()
    })
});

export const collections = {
    365: photo365Collection
};
