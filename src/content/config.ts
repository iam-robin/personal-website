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
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.date(),
        tags: z.array(z.string()),
        description: z.string().optional(),
        draft: z.boolean().optional().default(false)
    })
});

export const collections = {
    365: photo365Collection,
    blog: blogCollection
};
