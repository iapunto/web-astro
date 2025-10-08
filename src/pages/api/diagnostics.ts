// Endpoint de diagnóstico para verificar variables de entorno en producción
import { STRAPI_API_URL, STRAPI_API_TOKEN } from '../../lib/env';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL || 'false',
      NETLIFY: process.env.NETLIFY || 'false',
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

  // Intentar conexión de prueba
  try {
    console.log('🔍 [DIAGNOSTICS] Probando conexión a Strapi...');
    console.log('🔍 [DIAGNOSTICS] URL:', STRAPI_API_URL);
    console.log('🔍 [DIAGNOSTICS] Token presente:', !!STRAPI_API_TOKEN);
    
    const testResponse = await fetch(`${STRAPI_API_URL}/api/articles?pagination[pageSize]=1`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    diagnostics.test.canFetch = true;
    diagnostics.test.status = testResponse.status;

    if (testResponse.ok) {
      const data = await testResponse.json();
      diagnostics.test.articlesCount = data.data?.length || 0;
      console.log('✅ [DIAGNOSTICS] Conexión exitosa, artículos:', data.data?.length);
    } else {
      const errorText = await testResponse.text();
      diagnostics.test.error = `HTTP ${testResponse.status}: ${errorText.substring(0, 200)}`;
      console.error('❌ [DIAGNOSTICS] Error en respuesta:', testResponse.status, errorText);
    }
  } catch (error) {
    diagnostics.test.error = error instanceof Error ? error.message : String(error);
    console.error('❌ [DIAGNOSTICS] Error en fetch:', error);
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
