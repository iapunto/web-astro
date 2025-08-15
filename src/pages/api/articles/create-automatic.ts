import type { APIRoute } from 'astro';
import { GemArticleService } from '../../../lib/services/gemArticleService';
import { ArticlePublisherService } from '../../../lib/services/articlePublisherService';
import { ArticleTrackingService } from '../../../lib/database/articleTrackingSchema';
import { Client } from 'pg';

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 POST /api/articles/create-automatic iniciado');

  try {
    console.log('📋 Parseando body de la petición...');
    const body = await request.json();
    const { topic, apiKey, authorId } = body;
    console.log('📋 Body parseado:', {
      topic,
      apiKey: apiKey ? 'presente' : 'ausente',
    });

    // Validar parámetros requeridos
    if (!topic) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'El parámetro "topic" es requerido',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validar API key (en producción usar una clave real)
    if (apiKey !== 'demo-key') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'API key inválida',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('🔌 Configurando conexión a la base de datos...');
    console.log(
      '🔌 DATABASE_PUBLIC_URL:',
      process.env.DATABASE_PUBLIC_URL ? 'configurada' : 'NO CONFIGURADA'
    );

    // Configurar conexión a la base de datos
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });

    console.log('🔌 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conexión a la base de datos exitosa');
    const trackingService = new ArticleTrackingService(client);
    const gemService = new GemArticleService(
      'demo-key',
      trackingService,
      authorId
    );
    const publisherService = new ArticlePublisherService();

    console.log(`🚀 Iniciando creación automática de artículo:`);
    console.log(`   📝 Tema: ${topic}`);
    console.log(`   ⏰ Inicio: ${new Date().toISOString()}`);

    // Crear tracking inicial
    const tracking = await trackingService.createTracking(topic);
    console.log(`Artículo creado con ID: ${tracking.id}`);

    // Ejecutar proceso de creación de forma síncrona
    try {
      console.log('🚀 Iniciando proceso de creación...');

      // Ejecutar proceso completo
      const result = await gemService.createArticle(topic);
      console.log('✅ Proceso de creación completado');

      // Obtener el resultado final de GEM 5
      const finalTracking = await trackingService.getTracking(result.id);
      if (!finalTracking?.gem5Result) {
        throw new Error('No se pudo obtener el resultado final de GEM 5');
      }

      // Publicar artículo usando el resultado de GEM 5
      const publishedArticle = await publisherService.publishArticle(
        finalTracking.gem5Result
      );
      console.log(`✅ Artículo publicado: ${publishedArticle.url}`);

      // Marcar como publicado
      await trackingService.markAsPublished(tracking.id, publishedArticle.url);
      console.log('✅ Artículo marcado como publicado');
    } catch (error) {
      console.error('❌ Error en proceso de creación:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('❌ Error message:', errorMessage);
      console.error(
        '❌ Error stack:',
        error instanceof Error ? error.stack : 'No stack available'
      );

      await trackingService.logError(
        tracking.id,
        `Error en proceso: ${errorMessage}`
      );
      await trackingService.updateStatus(tracking.id, 'error');
    } finally {
      await client.end();
    }

    return new Response(
      JSON.stringify({
        success: true,
        articleId: tracking.id,
        message:
          'Proceso de creación iniciado. Puedes seguir el progreso en tiempo real.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error en la creación automática de artículo:', error);
    console.error(
      '❌ Error stack:',
      error instanceof Error ? error.stack : 'No stack available'
    );

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error message:', errorMessage);

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const GET: APIRoute = async () => {
  try {
    const publisherService = new ArticlePublisherService();
    const stats = await publisherService.getArticleStats();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          stats,
          systemInfo: {
            version: '1.0.0',
            lastUpdate: new Date().toISOString(),
            endpoints: {
              createArticle: 'POST /api/articles/create-automatic',
              getStats: 'GET /api/articles/create-automatic',
            },
          },
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
