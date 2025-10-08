export async function GET() {
  try {
    const envVars = {
      STRAPI_API_URL: import.meta.env.STRAPI_API_URL,
      STRAPI_API_TOKEN: import.meta.env.STRAPI_API_TOKEN ? 'CONFIGURADO' : 'NO CONFIGURADO',
      NODE_ENV: import.meta.env.NODE_ENV,
      MODE: import.meta.env.MODE,
      PROD: import.meta.env.PROD,
      DEV: import.meta.env.DEV,
      BASE_URL: import.meta.env.BASE_URL,
      // Verificar si las variables están en process.env también
      PROCESS_STRAPI_API_URL: process.env.STRAPI_API_URL,
      PROCESS_STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN ? 'CONFIGURADO' : 'NO CONFIGURADO',
      PROCESS_NODE_ENV: process.env.NODE_ENV,
    };

    return new Response(JSON.stringify({
      success: true,
      envVars,
      timestamp: new Date().toISOString(),
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
