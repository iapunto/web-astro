// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import astroIcon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://iapunto.com',
  integrations: [
    tailwind(),
    react({
      include: ['**/react/*'],
    }),
    mdx(),
    sitemap(),
    astroIcon({
      publicDir: './public',
    }),
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  image: {
    domains: ['res.cloudinary.com'],
  },
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
        '@components': new URL('./src/components', import.meta.url).pathname,
        '@services': new URL('./src/services', import.meta.url).pathname,
      },
    },
  },
  security: {
    checkOrigin: true,
  },
  env: {
    schema: {
      STRAPI_API_URL: envField.string({
        context: 'client',
        access: 'public',
        default: process.env.STRAPI_API_URL || 'http://localhost:1337',
        optional: false,
      }),
      SITE_NAME: {
        type: 'string',
        context: 'client',
        access: 'public',
        default: process.env.SITE_NAME,
      },
    },
  },
});
