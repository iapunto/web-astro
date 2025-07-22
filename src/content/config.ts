import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blogEntries = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    cover: z.string(),
    coverAlt: z.string().optional(),
    author: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }),
    category: z.string(),
    subcategory: z.string().optional(),
    quote: z.string().optional(),
  }),
});

export const collections = { blog: blogEntries };
