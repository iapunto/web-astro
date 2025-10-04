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
    const posts = await getCollection('blog');
    const site = 'https://iapunto.com';

    // Parámetros de paginación
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10'); // Solo 10 artículos por página
    const maxLimit = 20; // Límite máximo por seguridad

    // Validar parámetros
    const safeLimit = Math.min(limit, maxLimit);
    const safePage = Math.max(1, page);

    // Calcular offset
    const offset = (safePage - 1) * safeLimit;

    // Ordenar por fecha y aplicar paginación
    const sortedPosts = posts.sort((a, b) => {
      const dateA = normalizeDate(a.data.pubDate);
      const dateB = normalizeDate(b.data.pubDate);
      return dateB.getTime() - dateA.getTime();
    });

    const paginatedPosts = sortedPosts.slice(offset, offset + safeLimit);
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / safeLimit);

    // Generar items del RSS
    const itemsPromises = paginatedPosts.map(async (post) => {
      try {
        // Validar que el post tenga los datos necesarios
        if (!post.data) {
          console.warn(`Post ${post.id} no tiene datos`);
          return '';
        }

        const title = escapeXml(post.data.title || 'Sin título');
        const slug = escapeXml(post.data.slug || post.id);
        const pubDate = normalizeDate(post.data.pubDate);
        const description = escapeXml(post.data.description || '');
        const cover = escapeXml(post.data.cover || '');
        const authorName = escapeXml(post.data.author?.name || 'IA Punto');
        const category = escapeXml(post.data.category || '');
        const tags = Array.isArray(post.data.tags) ? post.data.tags : [];

        const tagsString = tags.slice(0, 3).join(', '); // Solo 3 tags máximo
        const isoDate = pubDate.toISOString();

        return `
      <item>
        <title><![CDATA[${title}]]></title>
        <link>${site}/blog/${slug}</link>
        <guid>${site}/blog/${slug}</guid>
        <pubDate>${pubDate.toUTCString()}</pubDate>
        <description><![CDATA[${description}]]></description>
        <author>${authorName}</author>
        <category>${category}</category>
        <!-- Campos personalizados -->
        <custom:title>${title}</custom:title>
        <custom:slug>${slug}</custom:slug>
        <custom:description>${description}</custom:description>
        <custom:category>${category}</custom:category>
        <custom:tags>${escapeXml(tagsString)}</custom:tags>
        <custom:cover>${cover}</custom:cover>
        <custom:authorName>${authorName}</custom:authorName>
        <custom:pubDate>${escapeXml(pubDate.toString())}</custom:pubDate>
        <custom:isoDate>${escapeXml(isoDate)}</custom:isoDate>
      </item>
    `;
      } catch (error) {
        console.error(`Error procesando artículo ${post.id}:`, error);
        return '';
      }
    });

    const items = await Promise.all(itemsPromises);
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

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=600', // Cache de 10 minutos
        'Access-Control-Allow-Origin': '*',
        'X-Total-Posts': totalPosts.toString(),
        'X-Total-Pages': totalPages.toString(),
        'X-Current-Page': safePage.toString(),
        'X-Posts-Per-Page': safeLimit.toString(),
      },
    });
  } catch (error) {
    console.error('Error generando RSS:', error);
    return new Response('Error generando RSS', { status: 500 });
  }
}
