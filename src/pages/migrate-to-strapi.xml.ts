import { getCollection } from 'astro:content';

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
    const startTime = Date.now();
    const site = 'https://iapunto.com';

    // Parámetros optimizados para migración
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '25');
    const maxLimit = 50;

    // Validar parámetros
    const safeLimit = Math.min(limit, maxLimit);
    const safePage = Math.max(1, page);

    // Calcular offset
    const offset = (safePage - 1) * safeLimit;

    // Obtener posts
    const allPosts = await getCollection('blog');
    const totalPosts = allPosts.length;
    
    // Ordenar por fecha
    const sortedPosts = allPosts.sort((a, b) => {
      const dateA = normalizeDate(a.data.pubDate);
      const dateB = normalizeDate(b.data.pubDate);
      return dateB.getTime() - dateA.getTime();
    });

    const paginatedPosts = sortedPosts.slice(offset, offset + safeLimit);
    const totalPages = Math.ceil(totalPosts / safeLimit);

    // Generar items optimizados para migración
    const items = paginatedPosts.map((post) => {
      try {
        if (!post.data) {
          return '';
        }

        const title = post.data.title || 'Sin título';
        const slug = post.data.slug || post.id;
        const pubDate = normalizeDate(post.data.pubDate);
        const description = post.data.description || '';
        const authorName = post.data.author?.name || 'IA Punto';
        const category = post.data.category || '';
        const tags = Array.isArray(post.data.tags) ? post.data.tags : [];

        return `<item>
        <title><![CDATA[${title}]]></title>
        <link>${site}/blog/${slug}</link>
        <guid>${site}/blog/${slug}</guid>
        <pubDate>${pubDate.toUTCString()}</pubDate>
        <description><![CDATA[${description}]]></description>
        <author>${authorName}</author>
        <category>${category}</category>
        
        <!-- Campos para migración a Strapi -->
        <migration:title>${escapeXml(title)}</migration:title>
        <migration:slug>${escapeXml(slug)}</migration:slug>
        <migration:content><![CDATA[${post.body || ''}]]></migration:content>
        <migration:excerpt>${escapeXml(description)}</migration:excerpt>
        <migration:publishedAt>${escapeXml(pubDate.toISOString())}</migration:publishedAt>
        <migration:cover>${escapeXml(post.data.cover || '')}</migration:cover>
        <migration:coverAlt>${escapeXml(post.data.coverAlt || '')}</migration:coverAlt>
        <migration:authorName>${escapeXml(authorName)}</migration:authorName>
        <migration:authorBio>${escapeXml(post.data.author?.description || '')}</migration:authorBio>
        <migration:authorImage>${escapeXml(post.data.author?.image || '')}</migration:authorImage>
        <migration:category>${escapeXml(category)}</migration:category>
        <migration:subcategory>${escapeXml(post.data.subcategory || '')}</migration:subcategory>
        <migration:tags>${escapeXml(tags.join(', '))}</migration:tags>
        <migration:quote>${escapeXml(post.data.quote || '')}</migration:quote>
        <migration:originalId>${escapeXml(post.id)}</migration:originalId>
        <migration:source>astro-markdown</migration:source>
        <migration:migratedAt>${escapeXml(new Date().toISOString())}</migration:migratedAt>
        <migration:batch>${safePage}</migration:batch>
        <migration:totalBatches>${totalPages}</migration:totalBatches>
      </item>`;
      } catch (error) {
        console.error(`Error procesando artículo ${post.id}:`, error);
        return '';
      }
    });

    const validItems = items.filter((item) => item !== '');

    // Información de paginación
    const paginationInfo = `
    <!-- Información de migración -->
    <migration:currentBatch>${safePage}</migration:currentBatch>
    <migration:totalBatches>${totalPages}</migration:totalBatches>
    <migration:totalPosts>${totalPosts}</migration:totalPosts>
    <migration:postsPerBatch>${safeLimit}</migration:postsPerBatch>
    <migration:hasNextBatch>${safePage < totalPages}</migration:hasNextBatch>
    <migration:hasPrevBatch>${safePage > 1}</migration:hasPrevBatch>
    ${safePage < totalPages ? `<migration:nextBatchUrl>${site}/migrate-to-strapi.xml?page=${safePage + 1}&amp;limit=${safeLimit}</migration:nextBatchUrl>` : ''}
    ${safePage > 1 ? `<migration:prevBatchUrl>${site}/migrate-to-strapi.xml?page=${safePage - 1}&amp;limit=${safeLimit}</migration:prevBatchUrl>` : ''}
    <migration:endpoint>POST /api/articles</migration:endpoint>
    <migration:contentType>application/json</migration:contentType>
    <migration:format>strapi-compatible</migration:format>
    `;

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:migration="https://iapunto.com/migration/">
      <channel>
        <title>Migración a Strapi - Lote ${safePage} de ${totalPages}</title>
        <link>${site}/migrate-to-strapi.xml</link>
        <description>Artículos ${offset + 1}-${Math.min(offset + safeLimit, totalPosts)} de ${totalPosts} para migración a Strapi</description>
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
        'Cache-Control': 'public, max-age=60, s-maxage=120', // Cache corto para migración
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Total-Posts': totalPosts.toString(),
        'X-Total-Pages': totalPages.toString(),
        'X-Current-Page': safePage.toString(),
        'X-Posts-Per-Page': safeLimit.toString(),
        'X-Response-Time': responseTime.toString(),
        'X-Processing-Time': `${responseTime}ms`,
        'X-Migration-Format': 'strapi-compatible',
        'X-Batch-Number': safePage.toString(),
        'X-Total-Batches': totalPages.toString(),
      },
    });
  } catch (error) {
    console.error('Error generando RSS de migración:', error);
    return new Response('Error generando RSS de migración', { status: 500 });
  }
}
