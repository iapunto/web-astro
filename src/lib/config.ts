// Configuración de Strapi CMS
export const STRAPI_CONFIG = {
  API_URL: import.meta.env.STRAPI_API_URL || 'https://strapi.iapunto.com',
  API_TOKEN: import.meta.env.STRAPI_API_TOKEN,
  API_ENDPOINTS: {
    ARTICLES: '/articles',
    CATEGORIES: '/categories',
    TAGS: '/tags',
    AUTHORS: '/authors',
    GLOBAL: '/global',
  },
  POPULATE_OPTIONS: {
    ARTICLES: 'populate=*',
    CATEGORIES: 'populate=*',
    TAGS: 'populate=*',
    AUTHORS: 'populate=*',
  },
  SORT_OPTIONS: {
    ARTICLES: 'sort=publishedAt:desc',
    CATEGORIES: 'sort=name:asc',
    TAGS: 'sort=name:asc',
  },
} as const;

// Configuración del sitio
export const SITE_CONFIG = {
  NAME: 'IA Punto',
  DESCRIPTION: 'Tu fuente de información sobre Inteligencia Artificial',
  URL: import.meta.env.SITE_URL || 'https://iapunto.com',
  AUTHOR: {
    NAME: 'Sergio Rondón',
    EMAIL: 'sergio@iapunto.com',
    BIO: 'CEO de IA Punto',
    AVATAR: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/sergio_gdcaeh.png',
  },
} as const;

// Configuración de SEO
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'IA Punto - Inteligencia Artificial',
  DEFAULT_DESCRIPTION: 'Tu fuente de información sobre Inteligencia Artificial, tendencias, noticias y análisis del mundo de la IA.',
  DEFAULT_KEYWORDS: 'inteligencia artificial, IA, machine learning, deep learning, tecnología, innovación',
  TWITTER_HANDLE: '@iapunto',
  FACEBOOK_PAGE: 'https://facebook.com/iapunto',
} as const; 