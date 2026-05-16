import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date().optional(),
    description: z.string().optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { blog };
