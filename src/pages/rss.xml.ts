import { getCollection } from 'astro:content';

// Función para escapar caracteres especiales en XML
function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Función para normalizar fechas
function normalizeDate(dateString: string): Date {
  return new Date(dateString);
}

export async function GET() {
  try {
    const posts = await getCollection('blog');
    const site = 'https://iapunto.com';

    // Limitar a los últimos 50 artículos para n8n
    const recentPosts = posts
      .sort((a, b) => {
        const dateA = normalizeDate(a.data.pubDate);
        const dateB = normalizeDate(b.data.pubDate);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 50); // Solo últimos 50 artículos

    const itemsPromises = recentPosts.map(async (post) => {
      try {
        // Validar y limpiar datos
        const title = post.data.title || 'Sin título';
        const slug = post.data.slug || post.id;
        const pubDate = normalizeDate(post.data.pubDate);
        const description = post.data.description || '';
        const cover = post.data.cover || '';
        const authorName = post.data.author?.name || 'IA Punto';
        const category = post.data.category || '';
        const tags = post.data.tags || [];

        // Construir tags como string (limitado a 5 tags)
        const tagsString = tags.slice(0, 5).join(', ');

        // Fecha en formato ISO para n8n
        const isoDate = pubDate.toISOString();

        return `
      <item>
        <title><![CDATA[${title}]]></title>
        <link>${escapeXml(site)}/blog/${escapeXml(slug)}</link>
        <guid>${escapeXml(site)}/blog/${escapeXml(slug)}</guid>
        <pubDate>${pubDate.toUTCString()}</pubDate>
        <description><![CDATA[${description}]]></description>
        <author>${escapeXml(authorName)}</author>
        <category>${escapeXml(category)}</category>
        <!-- Campos Strapi optimizados para n8n -->
        <strapi:title>${escapeXml(title)}</strapi:title>
        <strapi:slug>${escapeXml(slug)}</strapi:slug>
        <strapi:description>${escapeXml(description)}</strapi:description>
        <strapi:category>${escapeXml(category)}</strapi:category>
        <strapi:tags>${escapeXml(tagsString)}</strapi:tags>
        <strapi:cover>${escapeXml(cover)}</strapi:cover>
        <strapi:authorName>${escapeXml(authorName)}</strapi:authorName>
        <strapi:pubDate>${escapeXml(pubDate.toString())}</strapi:pubDate>
        <strapi:isoDate>${escapeXml(isoDate)}</strapi:isoDate>
      </item>
    `;
      } catch (error) {
        console.error(`Error procesando artículo ${post.id}:`, error);
        return ''; // Retornar string vacío si hay error
      }
    });

    const items = await Promise.all(itemsPromises);
    const validItems = items.filter((item) => item !== ''); // Filtrar items vacíos

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:strapi="https://strapi.io/rss/">
      <channel>
        <title>Blog de IA Punto</title>
        <link>${site}/blog</link>
        <description>Últimos artículos y novedades de IA Punto</description>
        <language>es</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${validItems.join('')}
      </channel>
    </rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error generando RSS:', error);
    return new Response('Error generando RSS', { status: 500 });
  }
}
