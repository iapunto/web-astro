import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// Configuración ultra simple para despliegue
export default defineConfig({
  site: process.env.SITE_URL || 'https://iapunto.com',
  integrations: [
    tailwind(),
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 4321,
  },
});
