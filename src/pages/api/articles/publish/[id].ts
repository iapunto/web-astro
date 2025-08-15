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
      return new Response(
        JSON.stringify({ error: 'Artículo no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que el artículo esté listo para publicar
    if (tracking.status !== 'gem5_completed' && tracking.status !== 'gem4_completed') {
      return new Response(
        JSON.stringify({ 
          error: 'El artículo no está listo para publicar',
          status: tracking.status 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener resultado de GEM 4
    const gem4Result = tracking.gem4Result;

    if (!gem4Result) {
      return new Response(
        JSON.stringify({ error: 'No se encontró el resultado de GEM 4' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener resultado de GEM 5 si existe
    const gem5Result = await client.query(
      'SELECT * FROM gem5_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1',
      [id]
    );

    // Actualizar frontmatter con la imagen si existe
    if (gem5Result.rows[0]) {
      gem4Result.frontmatter.cover = gem5Result.rows[0].image_url;
      gem4Result.frontmatter.coverAlt = gem5Result.rows[0].image_alt;
    }

    // Publicar el artículo
    const publishedArticle = await publisherService.publishArticle(gem4Result);

    if (!publishedArticle.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Error al publicar el artículo',
          details: publishedArticle.error 
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
        filePath: publishedArticle.filePath
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error publicando artículo:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
