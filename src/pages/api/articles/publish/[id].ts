import type { APIRoute } from 'astro';
import { ArticleTrackingService } from '../../../../lib/database/articleTrackingSchema';
import { ArticlePublisherService } from '../../../../lib/services/articlePublisherService';
import { Client } from 'pg';

export const POST: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID del artículo es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });

    await client.connect();
    const trackingService = new ArticleTrackingService(client);
    const publisherService = new ArticlePublisherService();

    // Obtener el tracking completo
    const tracking = await trackingService.getTracking(id);

    if (!tracking) {
      return new Response(JSON.stringify({ error: 'Artículo no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verificar que el artículo esté listo para publicar
    if (
      tracking.status !== 'gem5_completed' &&
      tracking.status !== 'gem4_completed'
    ) {
      return new Response(
        JSON.stringify({
          error: 'El artículo no está listo para publicar',
          status: tracking.status,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener resultado de GEM 5
    const gem5Result = tracking.gem5Result;

    if (!gem5Result) {
      return new Response(
        JSON.stringify({ error: 'No se encontró el resultado de GEM 5' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Publicar el artículo usando GEM 5
    const publishedArticle = await publisherService.publishArticle(gem5Result);

    if (!publishedArticle.success) {
      return new Response(
        JSON.stringify({
          error: 'Error al publicar el artículo',
          details: publishedArticle.error,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Marcar como publicado
    await trackingService.markAsPublished(id, publishedArticle.url);

    await client.end();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Artículo publicado exitosamente',
        url: publishedArticle.url,
        filePath: publishedArticle.filePath,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error publicando artículo:', error);
    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
