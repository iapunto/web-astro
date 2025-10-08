// Probar conexión directa a la IP de Strapi
import { STRAPI_API_TOKEN } from '../../lib/env.js';

export async function GET() {
  const results: any[] = [];
  
  // Lista de URLs/IPs a probar
  const tests = [
    { name: 'Dominio HTTPS', url: 'https://strapi.iapunto.com/api/articles?pagination[pageSize]=1' },
    { name: 'IP directa HTTPS', url: 'https://190.146.4.75/api/articles?pagination[pageSize]=1', headers: { 'Host': 'strapi.iapunto.com' } },
    { name: 'IP directa HTTP', url: 'http://190.146.4.75:1337/api/articles?pagination[pageSize]=1', headers: { 'Host': 'strapi.iapunto.com' } },
    { name: 'IP sin Host header', url: 'https://190.146.4.75/api/articles?pagination[pageSize]=1' },
  ];
  
  for (const test of tests) {
    console.log(`\n🧪 [TEST-IP] Probando: ${test.name} - ${test.url}`);
    
    const result: any = {
      name: test.name,
      url: test.url,
      success: false,
      status: 0,
      error: null,
      time: 0,
    };
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(test.url, {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
          ...(test.headers || {}),
        },
        signal: AbortSignal.timeout(10000),
      });
      
      result.status = response.status;
      result.time = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        result.success = true;
        result.articlesCount = data.data?.length || 0;
        console.log(`✅ [TEST-IP] ¡FUNCIONA! ${test.name} - Status: ${response.status}, Tiempo: ${result.time}ms`);
      } else {
        const errorText = await response.text();
        result.error = `HTTP ${response.status}: ${errorText.substring(0, 200)}`;
        console.log(`❌ [TEST-IP] Error HTTP: ${response.status}`);
      }
    } catch (error) {
      result.time = Date.now() - startTime;
      result.error = error instanceof Error ? error.message : String(error);
      console.log(`❌ [TEST-IP] Error: ${result.error}`);
    }
    
    results.push(result);
  }
  
  const workingTest = results.find(r => r.success);
  
  return new Response(JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      tested: results.length,
      working: results.filter(r => r.success).length,
      bestOption: workingTest?.name || 'Ninguna funciona',
    },
    results,
    recommendation: workingTest 
      ? `La conexión funciona con: ${workingTest.name}\nURL: ${workingTest.url}`
      : 'Ninguna opción funcionó. Posible bloqueo de firewall o IP whitelist en Strapi.',
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}
