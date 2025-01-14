import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./blog/" }), // ¡RUTA CRUCIAL!
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.object({
      name: z.string().optional(),
      image: z.string().optional(),
    }),
    category: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = {
  blog,
};
