export async function GET({ url }: { url: URL }) {
  try {
    const site = url.origin;

    // Intentar obtener artículos desde la API local que sabemos que funciona
    let articles = [];
    try {
      const response = await fetch(`${site}/api/articles-for-strapi.json`);
      if (response.ok) {
        const data = await response.json();
        articles = data.articles || [];
      }
    } catch (apiError) {
      console.warn('Error obteniendo artículos desde API local:', apiError);
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
    const articleUrls = articles.map((article: any) => {
      const articleUrl = `${site}/blog/${article.slug}/`;
      const pubDate = new Date(article.publishedAt || article.pubDate);

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
      },
    });
  } catch (error) {
    console.error('Error generando sitemap alternativo:', error);

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
