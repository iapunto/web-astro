import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blogEntries = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }), // ¡RUTA CRUCIAL!
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    cover: image().refine((img) => img.width >= 1080, {
      message:
        "¡La imagen de portada debe tener al menos 1080 píxeles de ancho!",
    }),
    author: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }),
    category: z.string(),
  }),
});

export const collections = {
  blog: blogEntries,
};
