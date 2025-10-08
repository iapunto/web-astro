export async function GET() {
  try {
    console.log('🔍 [DEBUG] Probando StrapiService directamente...');
    
    // Verificar variables de entorno
    const envVars = {
      STRAPI_API_URL: import.meta.env.STRAPI_API_URL || 'No configurado',
      STRAPI_API_TOKEN: import.meta.env.STRAPI_API_TOKEN ? 
        `${import.meta.env.STRAPI_API_TOKEN.substring(0, 10)}...` : 'No configurado',
      NODE_ENV: import.meta.env.NODE_ENV || 'development',
    };
    
    console.log('🔧 [DEBUG] Variables de entorno:', envVars);
    
    // Probar fetch directo
    const STRAPI_API_URL = import.meta.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
    const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;
    
    console.log('🌐 [DEBUG] Probando fetch directo...');
    
    const response = await fetch(`${STRAPI_API_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[pageSize]=5`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📡 [DEBUG] Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ [DEBUG] Error response: ${errorText}`);
      
      return new Response(JSON.stringify({
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        errorDetails: errorText,
        envVars,
        message: 'Error en fetch directo'
      }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const data = await response.json();
    console.log(`📊 [DEBUG] Datos recibidos: ${data.data?.length || 0} artículos`);
    
    // Probar StrapiService
    console.log('🔧 [DEBUG] Probando StrapiService...');
    const { StrapiService } = await import('../../../lib/strapi.js');
    const serviceArticles = await StrapiService.getArticles();
    console.log(`📊 [DEBUG] StrapiService artículos: ${serviceArticles.length}`);
    
    return new Response(JSON.stringify({
      success: true,
      envVars,
      directFetch: {
        status: response.status,
        articlesCount: data.data?.length || 0,
        totalArticles: data.meta?.pagination?.total || 0,
        firstArticle: data.data?.[0] || null,
      },
      strapiService: {
        articlesCount: serviceArticles.length,
        firstArticle: serviceArticles[0] || null,
      },
      message: 'Prueba completada'
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('❌ [DEBUG] Error en prueba de StrapiService:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      message: 'Error en la prueba'
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
