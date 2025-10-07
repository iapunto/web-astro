import { StrapiService } from '../lib/strapi';

export async function GET({ url }: { url: URL }) {
  try {
    const site = url.origin;
    const startTime = Date.now();

    // Obtener artículos desde Strapi con manejo de errores
    let articles = [];
    try {
      articles = await StrapiService.getArticles();
    } catch (strapiError) {
      console.warn(
        'Error obteniendo artículos de Strapi, usando fallback:',
        strapiError
      );
      // Fallback: usar una lista estática de artículos conocidos
      articles = [
        {
          slug: 'ia-marketing-berkeley-28m',
          publishedAt: '2024-01-15T00:00:00Z',
        },
        {
          slug: 'google-ia-ordenar-busquedas',
          publishedAt: '2024-01-14T00:00:00Z',
        },
        {
          slug: 'chatgpt-2-5-mil-millones-preguntas-diarias',
          publishedAt: '2024-01-13T00:00:00Z',
        },
        {
          slug: 'automatiza-tu-marketing-con-ia-guia-definitiva',
          publishedAt: '2024-01-12T00:00:00Z',
        },
        {
          slug: 'beneficios-ia-personalizar-experiencia-cliente-local',
          publishedAt: '2024-01-11T00:00:00Z',
        },
        {
          slug: 'capital-cliente-clv-valor-real-negocio',
          publishedAt: '2024-01-10T00:00:00Z',
        },
        {
          slug: 'que-es-evafs-estrategia-digital',
          publishedAt: '2024-01-09T00:00:00Z',
        },
        {
          slug: 'tu-marketing-digital-no-funciona-problema-embudo',
          publishedAt: '2024-01-08T00:00:00Z',
        },
        {
          slug: 'ia-revoluciona-marketing-contenidos-2025',
          publishedAt: '2024-01-07T00:00:00Z',
        },
        {
          slug: 'automatizacion-contenido-ia-estrategia-digital',
          publishedAt: '2024-01-06T00:00:00Z',
        },
        {
          slug: 'automatizacion-contenido-ia-flujo-completo',
          publishedAt: '2024-01-05T00:00:00Z',
        },
        {
          slug: 'chatgpt-chatbot-ia-guia',
          publishedAt: '2024-01-04T00:00:00Z',
        },
      ];
    }

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

    // Fallback: sitemap básico con solo páginas estáticas
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://iapunto.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://iapunto.com/blog/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://iapunto.com/servicios/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://iapunto.com/contacto/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    return new Response(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    });
  }
}
