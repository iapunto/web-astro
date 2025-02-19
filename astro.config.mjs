// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import { max } from "lodash-es";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321",
  integrations: [
    tailwind(),
    icon(),
    react({
      include: ["**/react/*"],
    }),
    mdx(),
    sitemap(),
  ],

  output: "server",
  adapter: vercel(),

  markdown: {
    shikiConfig: {
      sintaxHighlight: "prism",
      remarkPlugins: [
        remarkGfm,
        [remarkToc, { heading: "structure", ordered: true, maxDepth: 4 }],
      ],
      theme: "one-dark-pro",
    },
  },

  image: {
    service: passthroughImageService(),
    remotePatterns: [{ protocol: "https" }],
    domains: ["unsplash.com"],
  },
});
