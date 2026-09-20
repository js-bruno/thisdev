import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    mood: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

const photos = defineCollection({
  type: 'content',
  schema: z.object({
    src: z.string(),
    alt: z.string(),
    title: z.string().optional(),
    date: z.date().optional(),
    camera: z.string().optional(),
    lens: z.string().optional(),
    location: z.string().optional(),
    roll: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { blog, photos };
