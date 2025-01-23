import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blogEntries = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    cover: z.string(),
    author: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }),
    category: z.string(),
  }),
});

export const collections = { blog: blogEntries };
