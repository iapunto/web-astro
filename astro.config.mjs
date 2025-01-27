// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
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
      theme: "one-dark-pro",
    },
  },

  image: {
    service: passthroughImageService(),
    remotePatterns: [{ protocol: "https" }],
    domains: ["unsplash.com"],
  },
});
