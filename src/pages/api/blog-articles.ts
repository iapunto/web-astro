// Endpoint proxy para obtener artículos del blog
// Bypasea problemas de conectividad directa a Strapi

export async function GET() {
  try {
    console.log('🔄 [BLOG-API] Obteniendo artículos vía proxy...');

    // Usar variables de entorno del servidor con import.meta.env
    const STRAPI_API_URL = import.meta.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
    const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

    if (!STRAPI_API_TOKEN) {
      throw new Error('STRAPI_API_TOKEN no configurado en el servidor');
    }

    console.log(`🔗 [BLOG-API] URL: ${STRAPI_API_URL}`);
    console.log(
      `🔑 [BLOG-API] Token: ${STRAPI_API_TOKEN ? 'CONFIGURADO' : 'NO CONFIGURADO'}`
    );

    // Usar fetch con configuración específica para producción
    const response = await fetch(
      `${STRAPI_API_URL}/api/articles?populate=*&sort[0]=publishedAt:desc&pagination[pageSize]=100`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          'User-Agent': 'IA-Punto-Blog-Proxy/1.0',
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
        },
        // Configuraciones adicionales para producción
        signal: AbortSignal.timeout(30000), // 30 segundos timeout
      }
    );

    console.log(
      `📡 [BLOG-API] Response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`📊 [BLOG-API] Artículos obtenidos: ${data.data?.length || 0}`);

    // Mapear a la estructura esperada por el blog
    const articles =
      data.data?.map((article: any) => ({
        id: article.id,
        documentId: article.documentId,
        title: article.title,
        slug: article.slug,
        description: article.description,
        content: article.content,
        excerpt: article.excerpt,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        cover: article.cover,
        coverAlt: article.coverAlt,
        epicQuote: article.epicQuote,
        author: article.author,
        category: article.category,
        subcategory: article.subcategory,
        tags: article.tags || [],
        quote: article.quote,
      })) || [];

    return new Response(
      JSON.stringify({
        success: true,
        articles,
        meta: data.meta,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min cache
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('❌ [BLOG-API] Error obteniendo artículos:', error);

    // Fallback: devolver artículos estáticos conocidos
    const fallbackArticles = [
      {
        id: 538,
        title: 'Luma Runway Robotica Oro',
        slug: 'luma-runway-robotica-oro',
        description:
          'Descubre cómo la IA puede impulsar tu PYME: estrategias concretas de marketing, automatización y datos para aumentar ventas.',
        content:
          '<h2>Introducción</h2><p>Imaginen un futuro no muy lejano donde la inteligencia artificial no solo crea imágenes y videos asombrosos...</p>',
        excerpt:
          'Descubre cómo la IA puede impulsar tu PYME: estrategias concretas de marketing, automatización y datos para aumentar ventas.',
        publishedAt: '2025-10-07T17:38:02.986Z',
        epicQuote:
          'La inteligencia artificial no reemplaza la creatividad humana, la potencia.',
        author: {
          id: 2,
          name: 'Marilyn Cardozo',
          email: 'marilyn.cardozo@iapunto.com',
          description: 'Experta en Desarrollo Digital',
        },
        category: {
          id: 1,
          name: 'Inteligencia Artificial',
          slug: 'inteligencia-artificial',
        },
      },
    ];

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        articles: fallbackArticles,
        fallback: true,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200, // 200 para que el blog pueda usar el fallback
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}
