// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';

import astroIcon from 'astro-icon';
import jopSoftwarecookieconsent from '@jop-software/astro-cookieconsent';

// Configuración específica para Railway
export default defineConfig({
  site: process.env.SITE_URL || 'https://iapunto.com',
  integrations: [
    tailwind(),
    react({
      include: ['**/react/*'],
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.startsWith('/legal/'),
    }),
    astroIcon({
      publicDir: './public',
    }),
    jopSoftwarecookieconsent({
      // Configuración GDPR completa
      mode: 'opt-in',
      autoShow: true,
      hideFromBots: true,
      disablePageInteraction: false,
      revision: 1,

      cookie: {
        name: 'iapunto_cookie_consent',
        expiresAfterDays: 365,
        sameSite: 'Lax',
        secure: true,
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [
              {
                name: /^_ga/,
              },
              {
                name: '_gid',
              },
              {
                name: '_gat',
              },
            ],
          },
          services: {
            google_analytics: {
              label: 'Google Analytics',
              onAccept: () => {
                console.log('Google Analytics activado');
              },
              onReject: () => {
                console.log('Google Analytics desactivado');
              },
            },
            ahrefs_analytics: {
              label: 'Ahrefs Analytics',
              onAccept: () => {
                console.log('Ahrefs Analytics activado');
              },
              onReject: () => {
                console.log('Ahrefs Analytics desactivado');
              },
            },
          },
        },
        marketing: {
          services: {
            google_ads: {
              label: 'Google Ads',
              onAccept: () => {
                console.log('Google Ads activado');
              },
              onReject: () => {
                console.log('Google Ads desactivado');
              },
            },
          },
        },
      },

      onFirstConsent: ({ cookie }) => {
        console.log('Primer consentimiento:', cookie);
      },
      onConsent: ({ cookie }) => {
        console.log('Consentimiento actualizado:', cookie);
        console.log('Analytics activado');
      },
      onChange: ({ changedCategories, changedServices }) => {
        console.log('Cambios en consentimiento:', {
          changedCategories,
          changedServices,
        });
      },
    }),
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 4321,
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: ['res.cloudinary.com', 'strapi.iapunto.com'],
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
        default: process.env.STRAPI_API_URL || 'https://strapi.iapunto.com',
        optional: false,
      }),
      STRAPI_API_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        default: process.env.STRAPI_API_TOKEN,
        optional: false,
      }),
    },
  },
}); 