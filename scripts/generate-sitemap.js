import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de artículos conocidos (se puede actualizar manualmente o desde una API)
const knownArticles = [
  'ia-marketing-berkeley-28m',
  'google-ia-ordenar-busquedas',
  'chatgpt-2-5-mil-millones-preguntas-diarias',
  'automatiza-tu-marketing-con-ia-guia-definitiva',
  'beneficios-ia-personalizar-experiencia-cliente-local',
  'capital-cliente-clv-valor-real-negocio',
  'que-es-evafs-estrategia-digital',
  'tu-marketing-digital-no-funciona-problema-embudo',
  'ia-revoluciona-marketing-contenidos-2025',
  'automatizacion-contenido-ia-estrategia-digital',
  'automatizacion-contenido-ia-flujo-completo',
  'chatgpt-chatbot-ia-guia',
  '5-estrategias-aumentar-ventas',
  '7-de-10-jovenes-eeuu-ia-companeros',
  'airbnb-agentes-ia-no-google',
  'alaan-fintech-ia-mena-48m',
  'alexa-ia-asistente-familia',
  'altman-chatgpt-terapia-sin-confidencialidad',
  'amazon-alexa-anuncios',
  'ambiq-debut-bursatil',
  'amor-ia-fin-o-comienzo',
  'anthropic-ia-empresarial-supera-openai',
  'anthropic-valor-170b',
  'apple-ia-chatgpt',
  'apple-ia-inversion',
];

// Páginas estáticas
const staticPages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/acerca-de', priority: '0.8', changefreq: 'monthly' },
  { url: '/contacto', priority: '0.8', changefreq: 'monthly' },
  { url: '/servicios', priority: '0.8', changefreq: 'monthly' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/search', priority: '0.7', changefreq: 'weekly' },
  { url: '/automation-dashboard', priority: '0.7', changefreq: 'weekly' },
];

function generateSitemap() {
  const site = 'https://iapunto.com';
  const now = new Date().toISOString();

  let urls = [];

  // Agregar páginas estáticas
  staticPages.forEach((page) => {
    const url = `${site}${page.url === '' ? '' : page.url}/`;
    urls.push(`  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  });

  // Agregar artículos del blog
  knownArticles.forEach((slug) => {
    const url = `${site}/blog/${slug}/`;
    urls.push(`  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return sitemap;
}

// Generar sitemap
const sitemap = generateSitemap();

// Escribir archivo
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf8');

console.log(`Sitemap generado en: ${outputPath}`);
console.log(`Total URLs: ${staticPages.length + knownArticles.length}`);
