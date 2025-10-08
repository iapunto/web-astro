// Endpoint para probar todas las variaciones de URL de Strapi
import { STRAPI_API_TOKEN } from '../../lib/env.js';

export async function GET() {
  const results: any[] = [];
  
  // Lista de URLs a probar
  const urlsToTest = [
    // Nombre del servicio (más común)
    'http://strapi:1337',
    
    // Nombre completo del contenedor
    'http://strapi-z444w048ssc0wks08c8ko8o8:1337',
    
    // UUID del servicio
    'http://z444w048ssc0wks08c8ko8o8:1337',
    
    // Localhost/Host
    'http://localhost:1337',
    'http://127.0.0.1:1337',
    'http://host.docker.internal:1337',
    'http://172.17.0.1:1337',
    
    // URL pública (para comparar)
    'https://strapi.iapunto.com',
  ];
  
  console.log('🧪 [TEST-URLS] Probando múltiples URLs de Strapi...');
  
  for (const url of urlsToTest) {
    console.log(`\n🔍 [TEST-URLS] Probando: ${url}`);
    
    const result: any = {
      url,
      success: false,
      status: 0,
      error: null,
      time: 0,
    };
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${url}/api/articles?pagination[pageSize]=1`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 segundos por prueba
      });
      
      result.status = response.status;
      result.time = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        result.success = true;
        result.articlesCount = data.data?.length || 0;
        console.log(`✅ [TEST-URLS] ¡FUNCIONA! Status: ${response.status}, Artículos: ${data.data?.length}, Tiempo: ${result.time}ms`);
      } else {
        result.error = `HTTP ${response.status}`;
        console.log(`❌ [TEST-URLS] Error HTTP: ${response.status}`);
      }
    } catch (error) {
      result.time = Date.now() - startTime;
      result.error = error instanceof Error ? error.message : String(error);
      console.log(`❌ [TEST-URLS] Error: ${result.error} (${result.time}ms)`);
    }
    
    results.push(result);
  }
  
  // Encontrar la mejor URL (más rápida que funciona)
  const workingUrls = results.filter(r => r.success);
  const bestUrl = workingUrls.sort((a, b) => a.time - b.time)[0];
  
  console.log('\n' + '═'.repeat(80));
  console.log('📊 [TEST-URLS] RESUMEN:');
  console.log(`📊 URLs probadas: ${results.length}`);
  console.log(`📊 URLs funcionales: ${workingUrls.length}`);
  if (bestUrl) {
    console.log(`📊 MEJOR URL: ${bestUrl.url} (${bestUrl.time}ms)`);
  } else {
    console.log(`📊 MEJOR URL: NINGUNA FUNCIONA`);
  }
  console.log('═'.repeat(80));
  
  return new Response(JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalTested: results.length,
      working: workingUrls.length,
      failed: results.length - workingUrls.length,
      bestUrl: bestUrl ? bestUrl.url : null,
      bestTime: bestUrl ? bestUrl.time : null,
    },
    results,
    recommendation: bestUrl 
      ? `Usa esta variable en Coolify:\nSTRAPI_INTERNAL_URL=${bestUrl.url}`
      : 'Ninguna URL funcionó. Verifica la conectividad de red.',
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}
