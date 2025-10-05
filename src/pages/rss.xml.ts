import { StrapiService } from '../lib/strapi';

// Función para escapar caracteres especiales en XML
function escapeXml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remover caracteres de control
}

// Función para normalizar fechas
function normalizeDate(dateString: string | Date): Date {
  if (dateString instanceof Date) {
    return dateString;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn(`Fecha inválida: ${dateString}, usando fecha actual`);
    return new Date();
  }
  return date;
}

export async function GET({ url }: { url: URL }) {
  try {
    const site = 'https://iapunto.com';
    const startTime = Date.now();

    // Parámetros de paginación optimizados
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20'); // Límite por defecto más alto
    const maxLimit = 100; // Aumentar límite para n8n
    const isN8n = url.searchParams.get('n8n') === 'true'; // Flag para n8n

    // Validar parámetros
    const safeLimit = Math.min(limit, maxLimit);
    const safePage = Math.max(1, page);

    // Calcular offset
    const offset = (safePage - 1) * safeLimit;

    // Obtener posts desde Strapi
    const allPosts = await StrapiService.getArticles();
    const totalPosts = allPosts.length;
    
    // Optimización para n8n: usar límite más alto por defecto
    const effectiveLimit = isN8n ? Math.min(safeLimit, 50) : safeLimit;
    
    // Ordenar solo los posts necesarios para mejorar rendimiento
    const sortedPosts = allPosts.sort((a, b) => {
      const dateA = normalizeDate(a.publishedAt);
      const dateB = normalizeDate(b.publishedAt);
      return dateB.getTime() - dateA.getTime();
    });

    const paginatedPosts = sortedPosts.slice(offset, offset + effectiveLimit);
    const totalPages = Math.ceil(totalPosts / effectiveLimit);

    // Generar items del RSS de forma optimizada
    const items = paginatedPosts.map((post) => {
      try {
        // Validar que el post tenga los datos necesarios
        if (!post) {
          return '';
        }

        // Procesar datos de forma más eficiente
        const title = post.title || 'Sin título';
        const slug = post.slug || post.id.toString();
        const pubDate = normalizeDate(post.publishedAt);
        const description = post.description || post.excerpt || '';
        const authorName = post.author?.name || 'IA Punto';
        const category = post.category?.name || '';
        const tags = post.tags ? post.tags.slice(0, 3).map(tag => tag.name) : [];

        // Generar item XML de forma más directa
        return `<item>
        <title><![CDATA[${title}]]></title>
        <link>${site}/blog/${slug}</link>
        <guid>${site}/blog/${slug}</guid>
        <pubDate>${pubDate.toUTCString()}</pubDate>
        <description><![CDATA[${description}]]></description>
        <author>${authorName}</author>
        <category>${category}</category>
        <custom:title>${escapeXml(title)}</custom:title>
        <custom:slug>${escapeXml(slug)}</custom:slug>
        <custom:description>${escapeXml(description)}</custom:description>
        <custom:category>${escapeXml(category)}</custom:category>
        <custom:tags>${escapeXml(tags.join(', '))}</custom:tags>
        <custom:authorName>${escapeXml(authorName)}</custom:authorName>
        <custom:pubDate>${escapeXml(pubDate.toString())}</custom:pubDate>
        <custom:isoDate>${escapeXml(pubDate.toISOString())}</custom:isoDate>
      </item>`;
      } catch (error) {
        console.error(`Error procesando artículo ${post.id}:`, error);
        return '';
      }
    });

    const validItems = items.filter((item) => item !== '');

    // Información de paginación
    const paginationInfo = `
    <!-- Información de paginación -->
    <custom:currentPage>${safePage}</custom:currentPage>
    <custom:totalPages>${totalPages}</custom:totalPages>
    <custom:totalPosts>${totalPosts}</custom:totalPosts>
    <custom:postsPerPage>${safeLimit}</custom:postsPerPage>
    <custom:hasNextPage>${safePage < totalPages}</custom:hasNextPage>
    <custom:hasPrevPage>${safePage > 1}</custom:hasPrevPage>
    ${safePage < totalPages ? `<custom:nextPageUrl>${escapeXml(site)}/rss.xml?page=${safePage + 1}&amp;limit=${safeLimit}</custom:nextPageUrl>` : ''}
    ${safePage > 1 ? `<custom:prevPageUrl>${escapeXml(site)}/rss.xml?page=${safePage - 1}&amp;limit=${safeLimit}</custom:prevPageUrl>` : ''}
    `;

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:custom="https://iapunto.com/rss/custom/">
      <channel>
        <title>Blog de IA Punto - Página ${safePage} de ${totalPages}</title>
        <link>${site}/blog</link>
        <description>Artículos ${offset + 1}-${Math.min(offset + safeLimit, totalPosts)} de ${totalPosts} del blog de IA Punto</description>
        <language>es</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${paginationInfo}
        ${validItems.join('')}
      </channel>
    </rss>`;

    const responseTime = Date.now() - startTime;
    
    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': isN8n ? 'public, max-age=180, s-maxage=300' : 'public, max-age=300, s-maxage=600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Total-Posts': totalPosts.toString(),
        'X-Total-Pages': totalPages.toString(),
        'X-Current-Page': safePage.toString(),
        'X-Posts-Per-Page': effectiveLimit.toString(),
        'X-Response-Time': responseTime.toString(),
        'X-Processing-Time': `${responseTime}ms`,
        'X-Optimized-For': isN8n ? 'n8n' : 'general',
      },
    });
  } catch (error) {
    console.error('Error generando RSS:', error);
    return new Response('Error generando RSS', { status: 500 });
  }
}
