// Endpoint de diagnóstico para verificar variables de entorno en producción
import { STRAPI_API_URL, STRAPI_API_TOKEN } from '../../lib/env.js';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL || 'false',
      NETLIFY: process.env.NETLIFY || 'false',
      CLOUDFLARE: process.env.CF_PAGES || 'false',
      RENDER: process.env.RENDER || 'false',
      RAILWAY: process.env.RAILWAY_ENVIRONMENT || 'false',
      FLY: process.env.FLY_APP_NAME || 'false',
      PLATFORM: process.env.PLATFORM || 'unknown',
      HOST: process.env.HOST || 'unknown',
      // Detectar plataforma por otras variables
      DETECTED_PLATFORM: 
        process.env.VERCEL ? 'Vercel' :
        process.env.NETLIFY ? 'Netlify' :
        process.env.CF_PAGES ? 'Cloudflare Pages' :
        process.env.RENDER ? 'Render' :
        process.env.RAILWAY_ENVIRONMENT ? 'Railway' :
        process.env.FLY_APP_NAME ? 'Fly.io' :
        'Unknown/Custom Server',
    },
    strapi: {
      url: STRAPI_API_URL || 'NOT_SET',
      token: STRAPI_API_TOKEN 
        ? `PRESENTE (${STRAPI_API_TOKEN.substring(0, 10)}...${STRAPI_API_TOKEN.substring(STRAPI_API_TOKEN.length - 10)})` 
        : 'NOT_SET',
      tokenLength: STRAPI_API_TOKEN?.length || 0,
    },
    test: {
      canFetch: false,
      status: 0,
      error: null as string | null,
      articlesCount: 0,
    }
  };

  // Intentar conexión de prueba con múltiples métodos
  console.log('🔍 [DIAGNOSTICS] Probando conexión a Strapi...');
  console.log('🔍 [DIAGNOSTICS] URL:', STRAPI_API_URL);
  console.log('🔍 [DIAGNOSTICS] Token presente:', !!STRAPI_API_TOKEN);
  
  // Método 1: Fetch nativo
  try {
    console.log('🔍 [DIAGNOSTICS] Método 1: Fetch nativo...');
    const testResponse = await fetch(`${STRAPI_API_URL}/api/articles?pagination[pageSize]=1`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'iapunto-diagnostics/1.0',
      },
      // Agregar timeout para evitar que cuelgue
      signal: AbortSignal.timeout(10000),
    });

    diagnostics.test.canFetch = true;
    diagnostics.test.status = testResponse.status;
    (diagnostics.test as any).method = 'native-fetch';

    if (testResponse.ok) {
      const data = await testResponse.json();
      diagnostics.test.articlesCount = data.data?.length || 0;
      (diagnostics.test as any).responseHeaders = Object.fromEntries(testResponse.headers.entries());
      console.log('✅ [DIAGNOSTICS] Conexión exitosa con fetch nativo, artículos:', data.data?.length);
    } else {
      const errorText = await testResponse.text();
      diagnostics.test.error = `HTTP ${testResponse.status}: ${errorText.substring(0, 200)}`;
      console.error('❌ [DIAGNOSTICS] Error en respuesta:', testResponse.status, errorText);
    }
  } catch (nativeFetchError) {
    console.error('❌ [DIAGNOSTICS] Fetch nativo falló:', nativeFetchError);
    diagnostics.test.error = nativeFetchError instanceof Error ? nativeFetchError.message : String(nativeFetchError);
    (diagnostics.test as any).nativeFetchError = {
      message: nativeFetchError instanceof Error ? nativeFetchError.message : String(nativeFetchError),
      name: nativeFetchError instanceof Error ? nativeFetchError.name : 'UnknownError',
      cause: nativeFetchError instanceof Error ? nativeFetchError.cause : null,
    };
    
    // Método 2: Intentar con node-fetch como fallback
    try {
      console.log('🔍 [DIAGNOSTICS] Método 2: node-fetch fallback...');
      const nodeFetch = (await import('node-fetch')).default;
      const testResponse2 = await nodeFetch(`${STRAPI_API_URL}/api/articles?pagination[pageSize]=1`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'iapunto-diagnostics/1.0',
        },
        timeout: 10000,
      } as any);

      diagnostics.test.canFetch = true;
      diagnostics.test.status = testResponse2.status;
      (diagnostics.test as any).method = 'node-fetch';

      if (testResponse2.ok) {
        const data = await testResponse2.json();
        diagnostics.test.articlesCount = data.data?.length || 0;
        diagnostics.test.error = null; // Limpiar error anterior
        console.log('✅ [DIAGNOSTICS] Conexión exitosa con node-fetch, artículos:', data.data?.length);
      } else {
        const errorText = await testResponse2.text();
        diagnostics.test.error = `HTTP ${testResponse2.status}: ${errorText.substring(0, 200)}`;
      }
    } catch (nodeFetchError) {
      console.error('❌ [DIAGNOSTICS] node-fetch también falló:', nodeFetchError);
      (diagnostics.test as any).nodeFetchError = {
        message: nodeFetchError instanceof Error ? nodeFetchError.message : String(nodeFetchError),
        name: nodeFetchError instanceof Error ? nodeFetchError.name : 'UnknownError',
      };
    }
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
