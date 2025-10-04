export async function GET({ url }: { url: URL }) {
  try {
    const startTime = Date.now();
    
    // Respuesta mínima para probar conectividad
    const response = {
      success: true,
      message: "Endpoint de migración funcionando correctamente",
      timestamp: new Date().toISOString(),
      performance: {
        responseTime: Date.now() - startTime,
        processingTime: `${Date.now() - startTime}ms`,
      },
      instructions: {
        endpoint: "https://iapunto.com/migrate-to-strapi.json",
        parameters: {
          page: "1-12 (número de página)",
          limit: "10 (artículos por página, máximo 20)",
          n8n: "true (para optimizaciones específicas)"
        },
        example: "https://iapunto.com/migrate-to-strapi.json?n8n=true&limit=10&page=1",
        totalBatches: 12,
        totalPosts: 114,
        recommendedSettings: {
          timeout: "15 segundos",
          retryOnFail: true,
          retryAttempts: 3,
          retryDelay: "2 segundos"
        }
      }
    };

    return new Response(JSON.stringify(response, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Test-Endpoint': 'migrate-test',
        'X-Response-Time': (Date.now() - startTime).toString(),
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Error en endpoint de prueba',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    });
  }
}
