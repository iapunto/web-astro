// Proxy endpoint que el cliente puede llamar para obtener artículos
// El servidor simplemente pasa las credenciales, el fetch lo hace desde aquí con node-fetch
import { STRAPI_API_URL, STRAPI_API_TOKEN } from '../../lib/env.js';

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const endpoint = url.searchParams.get('endpoint') || '/articles?populate=*&sort[0]=publishedAt:desc&pagination[pageSize]=100';
  
  console.log('🔄 [STRAPI-PROXY] Proxy request para:', endpoint);
  
  try {
    // Intentar con node-fetch usando agente HTTP personalizado
    const nodeFetch = (await import('node-fetch')).default;
    const https = await import('https');
    const http = await import('http');
    
    const strapiUrl = STRAPI_API_URL;
    const isHttps = strapiUrl.startsWith('https');
    
    const agent = isHttps 
      ? new https.Agent({
          keepAlive: true,
          timeout: 30000,
          rejectUnauthorized: false, // Para certificados auto-firmados
        })
      : new http.Agent({
          keepAlive: true,
          timeout: 30000,
        });
    
    const response = await nodeFetch(`${strapiUrl}/api${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      agent,
      timeout: 30000,
    } as any);
    
    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5 minutos
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('❌ [STRAPI-PROXY] Error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : String(error),
      endpoint,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
