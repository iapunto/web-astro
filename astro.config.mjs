// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    icon(),
    react({
      include: ["**/react/*"],
    }),
    mdx(),
  ],

  adapter: node({
    mode: "standalone",
  }),

  markdown: {
    shikiConfig: {
      theme: "one-dark-pro",
    },
  },
});
