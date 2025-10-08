export async function GET() {
  try {
    // Usar las mismas variables que usa StrapiService
    const STRAPI_API_URL = import.meta.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
    const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;
    
    console.log(`🔍 [DEBUG] STRAPI_API_URL: ${STRAPI_API_URL}`);
    console.log(`🔍 [DEBUG] STRAPI_API_TOKEN: ${STRAPI_API_TOKEN ? 'CONFIGURADO' : 'NO CONFIGURADO'}`);
    
    if (!STRAPI_API_TOKEN) {
      return new Response(JSON.stringify({
        success: false,
        error: 'STRAPI_API_TOKEN no configurado',
        envVars: {
          STRAPI_API_URL,
          STRAPI_API_TOKEN: 'NO CONFIGURADO',
        }
      }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Test 1: Obtener artículos con paginación
    console.log('🧪 [DEBUG] Test 1: Obteniendo artículos con paginación...');
    
    let allArticles = [];
    let page = 1;
    let hasMorePages = true;
    let totalPages = 0;
    
    while (hasMorePages && page <= 5) { // Limitar a 5 páginas para el test
      const url = `${STRAPI_API_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=25`;
      
      console.log(`📡 [DEBUG] Página ${page}: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        },
      });
      
      console.log(`📊 [DEBUG] Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ [DEBUG] Error response: ${errorText}`);
        break;
      }
      
      const data = await response.json();
      console.log(`📊 [DEBUG] Datos recibidos: ${data.data?.length || 0} artículos`);
      
      if (data.data && data.data.length > 0) {
        allArticles = allArticles.concat(data.data);
        
        const pagination = data.meta?.pagination;
        if (pagination) {
          totalPages = pagination.pageCount;
          console.log(`📈 [DEBUG] Paginación: página ${page}/${totalPages}, total: ${pagination.total}`);
          
          if (page < totalPages) {
            page++;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
      } else {
        hasMorePages = false;
      }
    }
    
    // Test 2: Verificar estructura de un artículo
    let articleStructure = null;
    if (allArticles.length > 0) {
      const firstArticle = allArticles[0];
      articleStructure = {
        id: firstArticle.id,
        title: firstArticle.title,
        slug: firstArticle.slug,
        hasAuthor: !!firstArticle.author,
        hasCategory: !!firstArticle.category,
        hasCover: !!firstArticle.cover,
        hasEpicQuote: !!firstArticle.epicQuote,
        authorName: firstArticle.author?.name || 'NO ENCONTRADO',
        categoryName: firstArticle.category?.name || 'NO ENCONTRADO',
      };
    }
    
    return new Response(JSON.stringify({
      success: true,
      summary: {
        totalArticles: allArticles.length,
        pagesFetched: page - 1,
        totalPages,
        hasMoreData: page <= totalPages,
      },
      envVars: {
        STRAPI_API_URL,
        STRAPI_API_TOKEN: 'CONFIGURADO',
      },
      articleStructure,
      sampleArticles: allArticles.slice(0, 3).map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        author: article.author?.name || 'NO ENCONTRADO',
        category: article.category?.name || 'NO ENCONTRADO',
      })),
      timestamp: new Date().toISOString(),
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('❌ [DEBUG] Error en test directo:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
