import { getCollection } from 'astro:content';

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

      // Obtener el contenido completo del artículo
      const contentHtml = post.body || '';

      return `
      <item>
        <title><![CDATA[${post.data.title}]]></title>
        <link>${site}/blog/${post.data.slug || post.id}</link>
        <guid>${site}/blog/${post.data.slug || post.id}</guid>
        <pubDate>${new Date(post.data.pubDate).toUTCString()}</pubDate>
        <description><![CDATA[${post.data.description}]]></description>
        <author>${post.data.author?.name || 'IA Punto'}</author>
        <category>${categoriesString}</category>
        ${tagsString ? `<tags>${tagsString}</tags>` : ''}
        <enclosure url="${post.data.cover}" type="image/jpeg" />
        <media:content url="${post.data.cover}" type="image/jpeg" />
        <media:thumbnail url="${post.data.cover}" />
        <coverAlt>${post.data.coverAlt || ''}</coverAlt>
        <authorDescription>${post.data.author?.description || ''}</authorDescription>
        <authorImage>${post.data.author?.image || ''}</authorImage>
        <quote>${post.data.quote || ''}</quote>
        <date>${post.data.pubDate}</date>
        <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
      </item>
    `;
    });

  const items = await Promise.all(itemsPromises);

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
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
