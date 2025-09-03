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
  // Manejar diferentes formatos de fecha
  if (dateString.includes(' ')) {
    // Formato: 'Aug 26 2025'
    return new Date(dateString);
  } else {
    // Formato: '2025-07-29'
    return new Date(dateString);
  }
}

// Función para limpiar contenido HTML
function cleanHtmlContent(content: string): string {
  if (!content) return '';
  
  // Limpieza básica de HTML problemático para RSS
  return content
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
    .replace(/<object[^>]*>.*?<\/object>/gis, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/<form[^>]*>.*?<\/form>/gis, '')
    .replace(/<input[^>]*>/gi, '')
    .replace(/<button[^>]*>/gi, '')
    .replace(/<select[^>]*>.*?<\/select>/gis, '')
    .replace(/<textarea[^>]*>/gi, '')
    .replace(/<label[^>]*>/gi, '')
    .replace(/<fieldset[^>]*>/gi, '')
    .replace(/<legend[^>]*>/gi, '')
    .replace(/<optgroup[^>]*>/gi, '')
    .replace(/<option[^>]*>/gi, '')
    .replace(/<datalist[^>]*>.*?<\/datalist>/gis, '')
    .replace(/<output[^>]*>/gi, '')
    .replace(/<meter[^>]*>/gi, '')
    .replace(/<progress[^>]*>/gi, '')
    .replace(/<canvas[^>]*>/gi, '')
    .replace(/<svg[^>]*>.*?<\/svg>/gis, '')
    .replace(/<math[^>]*>.*?<\/math>/gis, '')
    .replace(/<video[^>]*>.*?<\/video>/gis, '')
    .replace(/<audio[^>]*>.*?<\/audio>/gis, '')
    .replace(/<source[^>]*>/gi, '')
    .replace(/<track[^>]*>/gi, '')
    .replace(/<map[^>]*>.*?<\/map>/gis, '')
    .replace(/<area[^>]*>/gi, '')
    .replace(/<picture[^>]*>.*?<\/picture>/gis, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<figure[^>]*>.*?<\/figure>/gis, '')
    .replace(/<figcaption[^>]*>/gi, '')
    .replace(/<details[^>]*>.*?<\/details>/gis, '')
    .replace(/<summary[^>]*>/gi, '')
    .replace(/<dialog[^>]*>.*?<\/dialog>/gis, '')
    .replace(/<menu[^>]*>.*?<\/menu>/gis, '')
    .replace(/<menuitem[^>]*>/gi, '')
    .replace(/<command[^>]*>/gi, '')
    .replace(/<keygen[^>]*>/gi, '')
    .replace(/<isindex[^>]*>/gi, '')
    .replace(/<listing[^>]*>/gi, '')
    .replace(/<plaintext[^>]*>/gi, '')
    .replace(/<xmp[^>]*>/gi, '')
    .replace(/<noembed[^>]*>.*?<\/noembed>/gis, '')
    .replace(/<noframes[^>]*>.*?<\/noframes>/gis, '')
    .replace(/<noscript[^>]*>.*?<\/noscript>/gis, '')
    .replace(/<applet[^>]*>.*?<\/applet>/gis, '')
    .replace(/<basefont[^>]*>/gi, '')
    .replace(/<bgsound[^>]*>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<title[^>]*>/gi, '')
    .replace(/<head[^>]*>.*?<\/head>/gis, '')
    .replace(/<body[^>]*>.*?<\/body>/gis, '')
    .replace(/<html[^>]*>.*?<\/html>/gis, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<!--.*?-->/gs, '')
    .replace(/<![CDATA\[/g, '')
    .replace(/\]>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const posts = await getCollection('blog');
    const site = 'https://iapunto.com';

    const itemsPromises = posts
      .sort((a, b) => {
        const dateA = normalizeDate(a.data.pubDate);
        const dateB = normalizeDate(b.data.pubDate);
        return dateB.getTime() - dateA.getTime();
      })
      .map(async (post) => {
        try {
          // Validar y limpiar datos
          const title = post.data.title || 'Sin título';
          const slug = post.data.slug || post.id;
          const pubDate = normalizeDate(post.data.pubDate);
          const description = post.data.description || '';
          const cover = post.data.cover || '';
          const coverAlt = post.data.coverAlt || '';
          const authorName = post.data.author?.name || 'IA Punto';
          const authorDescription = post.data.author?.description || '';
          const authorImage = post.data.author?.image || '';
          const category = post.data.category || '';
          const subcategory = post.data.subcategory || '';
          const tags = post.data.tags || [];
          const quote = post.data.quote || '';
          const content = post.body || '';

          // Construir tags como string
          const tagsString = tags.length > 0 ? tags.join(', ') : '';

          // Construir categorías
          const categories = [category];
          if (subcategory) {
            categories.push(subcategory);
          }
          const categoriesString = categories.join(', ');

          // Limpiar contenido HTML
          const cleanContent = cleanHtmlContent(content);

          // Fecha en formato ISO para n8n
          const isoDate = pubDate.toISOString();

          return `
      <item>
        <title><![CDATA[${title}]]></title>
        <link>${site}/blog/${slug}</link>
        <guid>${site}/blog/${slug}</guid>
        <pubDate>${pubDate.toUTCString()}</pubDate>
        <isoDate>${isoDate}</isoDate>
        <description><![CDATA[${description}]]></description>
        <author>${escapeXml(authorName)}</author>
        <category>${escapeXml(categoriesString)}</category>
        <categories>${escapeXml(categoriesString)}</categories>
        ${tagsString ? `<tags>${escapeXml(tagsString)}</tags>` : ''}
        ${cover ? `<enclosure url="${cover}" type="image/jpeg" />` : ''}
        ${cover ? `<media:content url="${cover}" type="image/jpeg" />` : ''}
        ${cover ? `<media:thumbnail url="${cover}" />` : ''}
        ${coverAlt ? `<coverAlt>${escapeXml(coverAlt)}</coverAlt>` : ''}
        ${authorDescription ? `<authorDescription>${escapeXml(authorDescription)}</authorDescription>` : ''}
        ${authorImage ? `<authorImage>${authorImage}</authorImage>` : ''}
        ${quote ? `<quote>${escapeXml(quote)}</quote>` : ''}
        <date>${pubDate.toString()}</date>
        <slug>${slug}</slug>
        <!-- Campos adicionales para migración a Strapi -->
        <strapi:title>${escapeXml(title)}</strapi:title>
        <strapi:slug>${slug}</strapi:slug>
        <strapi:description>${escapeXml(description)}</strapi:description>
        <strapi:category>${escapeXml(category)}</strapi:category>
        ${subcategory ? `<strapi:subcategory>${escapeXml(subcategory)}</strapi:subcategory>` : ''}
        ${tagsString ? `<strapi:tags>${escapeXml(tagsString)}</strapi:tags>` : ''}
        ${quote ? `<strapi:quote>${escapeXml(quote)}</strapi:quote>` : ''}
        ${cover ? `<strapi:cover>${cover}</strapi:cover>` : ''}
        ${coverAlt ? `<strapi:coverAlt>${escapeXml(coverAlt)}</strapi:coverAlt>` : ''}
        <strapi:authorName>${escapeXml(authorName)}</strapi:authorName>
        ${authorDescription ? `<strapi:authorDescription>${escapeXml(authorDescription)}</strapi:authorDescription>` : ''}
        ${authorImage ? `<strapi:authorImage>${authorImage}</strapi:authorImage>` : ''}
        <strapi:pubDate>${pubDate.toString()}</strapi:pubDate>
        <strapi:isoDate>${isoDate}</strapi:isoDate>
      </item>
    `;
        } catch (error) {
          console.error(`Error procesando artículo ${post.id}:`, error);
          return ''; // Retornar string vacío si hay error
        }
      });

    const items = await Promise.all(itemsPromises);
    const validItems = items.filter(item => item !== ''); // Filtrar items vacíos

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
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Error generando RSS:', error);
    return new Response('Error generando RSS', { status: 500 });
  }
}
