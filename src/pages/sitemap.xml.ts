import { StrapiService } from '../lib/strapi';

export async function GET({ url }: { url: URL }) {
  try {
    const site = url.origin;
    const startTime = Date.now();

    // Obtener artículos desde Strapi
    const articles = await StrapiService.getArticles();

    // Páginas estáticas del sitio
    const staticPages = [
      '',
      '/acerca-de',
      '/contacto',
      '/servicios',
      '/blog',
      '/search',
      '/automation-dashboard',
      // Páginas legales (opcional, puedes excluirlas si quieres)
      '/legal/aviso-legal',
      '/legal/condiciones-de-contratacion',
      '/legal/declaracion-de-accesibilidad',
      '/legal/politica-anti-spam',
      '/legal/politica-de-devoluciones-y-reembolsos',
      '/legal/politica-de-privacidad',
      '/legal/politica-de-seguridad',
      '/legal/terminos-y-condiciones',
      '/legal/uso-de-cookies',
    ];

    // Generar URLs para páginas estáticas
    const staticUrls = staticPages.map((page) => {
      const url = `${site}${page === '' ? '' : page}/`;
      const priority =
        page === '' ? '1.0' : page.startsWith('/blog') ? '0.9' : '0.8';
      const changefreq =
        page === '' ? 'daily' : page.startsWith('/blog') ? 'daily' : 'monthly';

      return `<url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
      </url>`;
    });

    // Generar URLs para artículos del blog
    const articleUrls = articles.map((article) => {
      const articleUrl = `${site}/blog/${article.slug}/`;
      const pubDate = new Date(article.publishedAt);

      return `<url>
        <loc>${articleUrl}</loc>
        <lastmod>${pubDate.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>`;
    });

    // Combinar todas las URLs
    const allUrls = [...staticUrls, ...articleUrls];

    // Generar sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.join('\n  ')}
</urlset>`;

    const responseTime = Date.now() - startTime;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Total-URLs': allUrls.length.toString(),
        'X-Static-Pages': staticUrls.length.toString(),
        'X-Articles': articleUrls.length.toString(),
        'X-Response-Time': responseTime.toString(),
        'X-Processing-Time': `${responseTime}ms`,
      },
    });
  } catch (error) {
    console.error('Error generando sitemap:', error);
    return new Response('Error generando sitemap', { status: 500 });
  }
}
