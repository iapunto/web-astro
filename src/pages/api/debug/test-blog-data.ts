import { StrapiService } from '../../../lib/strapi.js';

export async function GET() {
  try {
    console.log('🔍 [DEBUG] Iniciando prueba de datos del blog...');
    
    // Obtener artículos usando el mismo método que usa el blog
    const articles = await StrapiService.getArticles();
    console.log(`📊 [DEBUG] Artículos obtenidos: ${articles.length}`);
    
    // Mostrar estructura del primer artículo
    if (articles.length > 0) {
      const firstArticle = articles[0];
      console.log('📄 [DEBUG] Primer artículo:');
      console.log(`- ID: ${firstArticle.id}`);
      console.log(`- Título: ${firstArticle.title}`);
      console.log(`- Slug: ${firstArticle.slug}`);
      console.log(`- Autor: ${firstArticle.author?.name || 'NO ENCONTRADO'}`);
      console.log(`- Categoría: ${firstArticle.category?.name || 'NO ENCONTRADO'}`);
      console.log(`- Contenido: ${firstArticle.content ? 'PRESENTE' : 'NO ENCONTRADO'}`);
    }
    
    // Simular el mapeo que hace el blog
    const blogEntries = articles.map((article) => ({
      data: {
        slug: article.slug,
        title: article.title,
        description: article.description || article.excerpt || '',
        category: article.category?.name || '',
        tags: article.tags?.map((tag: any) => tag.name) || [],
        pubDate: new Date(article.publishedAt),
        cover: article.cover
          ? `https://strapi.iapunto.com${article.cover.url}`
          : '',
        coverAlt: article.coverAlt || article.title,
        epicQuote: article.epicQuote || '',
        author: {
          name: article.author?.name || 'IA Punto',
          image: article.author?.avatar
            ? `https://strapi.iapunto.com${article.author.avatar.url}`
            : '/images/default-avatar.jpg',
        },
      },
      body: article.content,
    }));
    
    console.log(`📊 [DEBUG] Blog entries mapeados: ${blogEntries.length}`);
    
    if (blogEntries.length > 0) {
      const firstEntry = blogEntries[0];
      console.log('📄 [DEBUG] Primer blog entry mapeado:');
      console.log(`- Título: ${firstEntry.data.title}`);
      console.log(`- Slug: ${firstEntry.data.slug}`);
      console.log(`- Autor: ${firstEntry.data.author.name}`);
      console.log(`- Categoría: ${firstEntry.data.author.name}`);
      console.log(`- Imagen: ${firstEntry.data.cover}`);
    }
    
    return new Response(JSON.stringify({
      success: true,
      articlesCount: articles.length,
      blogEntriesCount: blogEntries.length,
      firstArticle: articles[0] || null,
      firstBlogEntry: blogEntries[0] || null,
      message: 'Prueba completada exitosamente'
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('❌ [DEBUG] Error en prueba de blog:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'Error en la prueba'
    }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
