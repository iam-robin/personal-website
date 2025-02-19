import { defineCollection, z } from 'astro:content';

const photo365Collection = defineCollection({
    schema: z.object({
        image: z.string(), // Path to image file
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

export const collections = {
    365: photo365Collection
};
