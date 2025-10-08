export async function GET() {
  try {
    console.log('🔍 [DEBUG] Probando Node.js fetch en producción...');
    
    // Verificar variables de entorno
    const STRAPI_API_URL = import.meta.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
    const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;
    
    console.log(`🔧 [DEBUG] STRAPI_API_URL: ${STRAPI_API_URL}`);
    console.log(`🔧 [DEBUG] STRAPI_API_TOKEN: ${STRAPI_API_TOKEN ? 'CONFIGURADO' : 'NO CONFIGURADO'}`);
    
    // Probar diferentes configuraciones de fetch
    const tests = [];
    
    // Test 1: Fetch básico
    try {
      console.log('🧪 [DEBUG] Test 1: Fetch básico');
      const response = await fetch(`${STRAPI_API_URL}/api/articles?pagination[pageSize]=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`📡 [DEBUG] Response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        tests.push({
          name: 'Fetch básico (sin auth)',
          success: true,
          status: response.status,
          articlesCount: data.data?.length || 0,
        });
      } else {
        tests.push({
          name: 'Fetch básico (sin auth)',
          success: false,
          status: response.status,
          error: response.statusText,
        });
      }
    } catch (error) {
      tests.push({
        name: 'Fetch básico (sin auth)',
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
    
    // Test 2: Fetch con autenticación
    if (STRAPI_API_TOKEN) {
      try {
        console.log('🧪 [DEBUG] Test 2: Fetch con autenticación');
        const response = await fetch(`${STRAPI_API_URL}/api/articles?pagination[pageSize]=1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          },
        });
        
        console.log(`📡 [DEBUG] Response status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          tests.push({
            name: 'Fetch con autenticación',
            success: true,
            status: response.status,
            articlesCount: data.data?.length || 0,
            firstArticle: data.data?.[0] ? {
              id: data.data[0].id,
              title: data.data[0].title,
              slug: data.data[0].slug,
            } : null,
          });
        } else {
          const errorText = await response.text();
          tests.push({
            name: 'Fetch con autenticación',
            success: false,
            status: response.status,
            error: errorText,
          });
        }
      } catch (error) {
        tests.push({
          name: 'Fetch con autenticación',
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    
    // Test 3: Fetch con User-Agent
    if (STRAPI_API_TOKEN) {
      try {
        console.log('🧪 [DEBUG] Test 3: Fetch con User-Agent');
        const response = await fetch(`${STRAPI_API_URL}/api/articles?pagination[pageSize]=1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
            'User-Agent': 'IA-Punto-Blog-Production/1.0',
          },
        });
        
        console.log(`📡 [DEBUG] Response status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          tests.push({
            name: 'Fetch con User-Agent',
            success: true,
            status: response.status,
            articlesCount: data.data?.length || 0,
          });
        } else {
          tests.push({
            name: 'Fetch con User-Agent',
            success: false,
            status: response.status,
            error: response.statusText,
          });
        }
      } catch (error) {
        tests.push({
          name: 'Fetch con User-Agent',
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    
    // Test 4: Verificar versión de Node.js y fetch
    const nodeVersion = process.version;
    const fetchInfo = typeof fetch;
    
    console.log(`🔧 [DEBUG] Node.js version: ${nodeVersion}`);
    console.log(`🔧 [DEBUG] Fetch type: ${fetchInfo}`);
    
    const summary = {
      totalTests: tests.length,
      passedTests: tests.filter(t => t.success).length,
      failedTests: tests.filter(t => !t.success).length,
      overallSuccess: tests.every(t => t.success),
    };
    
    return new Response(JSON.stringify({
      timestamp: new Date().toISOString(),
      nodeVersion,
      fetchInfo,
      envVars: {
        STRAPI_API_URL,
        STRAPI_API_TOKEN: STRAPI_API_TOKEN ? 'CONFIGURADO' : 'NO CONFIGURADO',
      },
      tests,
      summary,
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('❌ [DEBUG] Error en prueba de Node.js fetch:', error);
    
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
