// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import astroIcon from 'astro-icon';
import jopSoftwarecookieconsent from '@jop-software/astro-cookieconsent';

// https://astro.build/config
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
      mode: 'opt-in', // GDPR compliant
      autoShow: true,
      hideFromBots: true,
      disablePageInteraction: false,
      revision: 1,
      
      // Configuración de cookies
      cookie: {
        name: 'iapunto_cookie_consent',
        expiresAfterDays: 365,
        sameSite: 'Lax',
        secure: true,
      },

      // Categorías de cookies
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
                // Google Analytics se activará automáticamente
                console.log('Google Analytics activado');
              },
              onReject: () => {
                // Limpiar cookies de Google Analytics
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

      // Configuración de la interfaz
      guiOptions: {
        consentModal: {
          layout: 'cloud',
          position: 'bottom center',
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
          equalWeightButtons: true,
          flipButtons: false,
        },
      },

      // Traducciones en español
      language: {
        default: 'es',
        translations: {
          es: {
            consentModal: {
              title: 'Usamos cookies',
              description:
                'Utilizamos cookies esenciales para el funcionamiento del sitio web y cookies de seguimiento para entender cómo interactúas con él. Estas últimas solo se establecerán después de tu consentimiento.',
              acceptAllBtn: 'Aceptar todas',
              acceptNecessaryBtn: 'Rechazar todas',
              showPreferencesBtn: 'Gestionar preferencias',
              footer: `
                <a href="/legal/politica-de-privacidad/" target="_blank">Política de Privacidad</a>
                <a href="/legal/uso-de-cookies/" target="_blank">Política de Cookies</a>
              `,
            },
            preferencesModal: {
              title: 'Gestionar preferencias de cookies',
              acceptAllBtn: 'Aceptar todas',
              acceptNecessaryBtn: 'Rechazar todas',
              savePreferencesBtn: 'Aceptar selección actual',
              closeIconLabel: 'Cerrar modal',
              sections: [
                {
                  title: '¿Alguien dijo... cookies?',
                  description: '¡Queremos una!',
                },
                {
                  title: 'Cookies estrictamente necesarias',
                  description:
                    'Estas cookies son esenciales para el funcionamiento correcto del sitio web y no se pueden desactivar.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Rendimiento y Analytics',
                  description:
                    'Estas cookies recopilan información sobre cómo utilizas nuestro sitio web. Todos los datos están anonimizados y no se pueden utilizar para identificarte.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                    headers: {
                      name: 'Nombre',
                      domain: 'Servicio',
                      description: 'Descripción',
                      expiration: 'Expiración',
                    },
                    body: [
                      {
                        name: '_ga',
                        domain: 'Google Analytics',
                        description:
                          'Cookie establecida por <a href="https://business.safety.google/adscookies/" target="_blank">Google Analytics</a>',
                        expiration: 'Expira después de 2 años',
                      },
                      {
                        name: '_gid',
                        domain: 'Google Analytics',
                        description:
                          'Cookie establecida por <a href="https://business.safety.google/adscookies/" target="_blank">Google Analytics</a>',
                        expiration: 'Sesión',
                      },
                      {
                        name: 'analytics.ahrefs.com',
                        domain: 'Ahrefs Analytics',
                        description:
                          'Cookie establecida por <a href="https://ahrefs.com/analytics" target="_blank">Ahrefs Analytics</a>',
                        expiration: '1 año',
                      },
                    ],
                  },
                },
                {
                  title: 'Marketing',
                  description:
                    'Estas cookies se utilizan para rastrear visitantes en sitios web para mostrar anuncios relevantes.',
                  linkedCategory: 'marketing',
                },
                {
                  title: 'Más información',
                  description:
                    'Para cualquier consulta relacionada con nuestra política de cookies y tus elecciones, por favor <a href="/contacto/" target="_blank">contáctanos</a>.',
                },
              ],
            },
          },
        },
      },

      // Callbacks para gestión de consentimiento
      onFirstConsent: ({ cookie }) => {
        console.log('Primer consentimiento:', cookie);
        // Aquí puedes implementar lógica adicional
      },
      onConsent: ({ cookie }) => {
        console.log('Consentimiento actualizado:', cookie);
        // Gestionar scripts basado en el consentimiento
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
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
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
});