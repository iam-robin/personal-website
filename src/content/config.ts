import { defineCollection, z } from "astro:content";

const projects = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        thumbnail: z.string().optional(),
        tags: z.array(z.string()).optional(),
        year: z.number().optional(),
    }),
});

export const collections = { projects };
