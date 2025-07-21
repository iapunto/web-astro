import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  const site = 'https://iapunto.com';

  const items = posts
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    )
    .map(
      (post) => `
      <item>
        <title><![CDATA[${post.data.title}]]></title>
        <link>${site}/blog/${post.slug || post.id}</link>
        <guid>${site}/blog/${post.slug || post.id}</guid>
        <pubDate>${new Date(post.data.pubDate).toUTCString()}</pubDate>
        <description><![CDATA[${post.data.description}]]></description>
      </item>
    `
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Blog de IA Punto</title>
        <link>${site}/blog</link>
        <description>Últimos artículos y novedades de IA Punto</description>
        ${items}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
