import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  const site = 'https://iapunto.com';

  const articles = posts
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    )
    .map((post) => {
      // Construir tags como array
      const tags = post.data.tags || [];

      // Construir categorías
      const categories = [post.data.category];
      if (post.data.subcategory) {
        categories.push(post.data.subcategory);
      }

      // Fecha en formato ISO para n8n
      const isoDate = new Date(post.data.pubDate).toISOString();

      return {
        // Campos básicos
        id: post.id,
        slug: post.data.slug || post.id,
        title: post.data.title,
        description: post.data.description,
        content: post.body,
        pubDate: post.data.pubDate,
        isoDate: isoDate,
        
        // Categorías y tags
        category: post.data.category,
        subcategory: post.data.subcategory || null,
        categories: categories,
        tags: tags,
        
        // Imágenes
        cover: post.data.cover,
        coverAlt: post.data.coverAlt || '',
        
        // Autor
        author: {
          name: post.data.author?.name || 'IA Punto',
          description: post.data.author?.description || '',
          image: post.data.author?.image || ''
        },
        
        // Quote
        quote: post.data.quote || '',
        
        // URLs
        url: `${site}/blog/${post.data.slug || post.id}`,
        guid: `${site}/blog/${post.data.slug || post.id}`,
        
        // Metadatos adicionales
        createdAt: post.data.pubDate,
        updatedAt: post.data.pubDate,
        publishedAt: post.data.pubDate,
        
        // Campos para Strapi
        strapi: {
          title: post.data.title,
          slug: post.data.slug || post.id,
          description: post.data.description,
          content: post.body,
          category: post.data.category,
          subcategory: post.data.subcategory || '',
          tags: tags,
          quote: post.data.quote || '',
          cover: post.data.cover,
          coverAlt: post.data.coverAlt || '',
          authorName: post.data.author?.name || 'IA Punto',
          authorDescription: post.data.author?.description || '',
          authorImage: post.data.author?.image || '',
          pubDate: post.data.pubDate,
          isoDate: isoDate
        }
      };
    });

  return new Response(JSON.stringify({
    success: true,
    total: articles.length,
    articles: articles
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
  });
} 