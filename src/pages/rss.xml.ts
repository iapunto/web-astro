import { getCollection } from 'astro:content';

// Función para escapar caracteres especiales en XML
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getCollection('blog');
  const site = 'https://iapunto.com';

  const itemsPromises = posts
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    )
    .map(async (post) => {
      // Construir tags como string
      const tagsString = post.data.tags ? post.data.tags.join(', ') : '';

      // Construir categorías
      const categories = [post.data.category];
      if (post.data.subcategory) {
        categories.push(post.data.subcategory);
      }
      const categoriesString = categories.join(', ');

      // Obtener el contenido completo del artículo y escapar caracteres especiales
      const contentHtml = escapeXml(post.body || '');

      // Fecha en formato ISO para n8n
      const isoDate = new Date(post.data.pubDate).toISOString();

      return `
      <item>
        <title><![CDATA[${post.data.title}]]></title>
        <link>${site}/blog/${post.data.slug || post.id}</link>
        <guid>${site}/blog/${post.data.slug || post.id}</guid>
        <pubDate>${new Date(post.data.pubDate).toUTCString()}</pubDate>
        <isoDate>${isoDate}</isoDate>
        <description><![CDATA[${post.data.description}]]></description>
        <author>${escapeXml(post.data.author?.name || 'IA Punto')}</author>
        <category>${escapeXml(categoriesString)}</category>
        <categories>${escapeXml(categoriesString)}</categories>
        ${tagsString ? `<tags>${escapeXml(tagsString)}</tags>` : ''}
        <enclosure url="${post.data.cover}" type="image/jpeg" />
        <media:content url="${post.data.cover}" type="image/jpeg" />
        <media:thumbnail url="${post.data.cover}" />
        <coverAlt>${escapeXml(post.data.coverAlt || '')}</coverAlt>
        <authorDescription>${escapeXml(post.data.author?.description || '')}</authorDescription>
        <authorImage>${post.data.author?.image || ''}</authorImage>
        <quote>${escapeXml(post.data.quote || '')}</quote>
        <date>${post.data.pubDate}</date>
        <slug>${post.data.slug || post.id}</slug>
        <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
        <!-- Campos adicionales para migración a Strapi -->
        <strapi:title>${escapeXml(post.data.title)}</strapi:title>
        <strapi:slug>${post.data.slug || post.id}</strapi:slug>
        <strapi:description>${escapeXml(post.data.description)}</strapi:description>
        <strapi:category>${escapeXml(post.data.category)}</strapi:category>
        <strapi:subcategory>${escapeXml(post.data.subcategory || '')}</strapi:subcategory>
        <strapi:tags>${escapeXml(tagsString)}</strapi:tags>
        <strapi:quote>${escapeXml(post.data.quote || '')}</strapi:quote>
        <strapi:cover>${post.data.cover}</strapi:cover>
        <strapi:coverAlt>${escapeXml(post.data.coverAlt || '')}</strapi:coverAlt>
        <strapi:authorName>${escapeXml(post.data.author?.name || 'IA Punto')}</strapi:authorName>
        <strapi:authorDescription>${escapeXml(post.data.author?.description || '')}</strapi:authorDescription>
        <strapi:authorImage>${post.data.author?.image || ''}</strapi:authorImage>
        <strapi:pubDate>${post.data.pubDate}</strapi:pubDate>
        <strapi:isoDate>${isoDate}</strapi:isoDate>
        <strapi:content><![CDATA[${contentHtml}]]></strapi:content>
      </item>
    `;
    });

  const items = await Promise.all(itemsPromises);

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:strapi="https://strapi.io/rss/">
      <channel>
        <title>Blog de IA Punto</title>
        <link>${site}/blog</link>
        <description>Últimos artículos y novedades de IA Punto</description>
        <language>es</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items.join('')}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
