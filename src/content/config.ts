import { defineCollection, z } from "astro:content";

const projects = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        year: z.string(),
        thumbnail: z.string().optional(),
        thumbnailWidth: z.string().optional(),
        tags: z.array(z.string()).optional(),
        bgColor: z.string().optional(),
        externalUrl: z.string().optional(),
    }),
});

export const collections = { projects };
