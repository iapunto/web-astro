import type { APIRoute } from 'astro';
import { ArticleTrackingService } from '../../../../lib/database/articleTrackingSchema';
import { Client } from 'pg';

export const GET: APIRoute = async ({ params }) => {
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

    // Obtener el tracking completo
    const tracking = await trackingService.getTracking(id);

    if (!tracking) {
      return new Response(
        JSON.stringify({ error: 'Artículo no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que el artículo esté listo para preview (GEM 4 y GEM 5 completados)
    if (tracking.status !== 'gem5_completed' && tracking.status !== 'gem4_completed') {
      return new Response(
        JSON.stringify({ 
          error: 'El artículo no está listo para preview',
          status: tracking.status 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener resultados de GEM 4 y GEM 5
    const gem4Result = tracking.gem4Result;
    const gem5Result = await client.query(
      'SELECT * FROM gem5_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1',
      [id]
    );

    // Construir el preview
    const preview = {
      id: tracking.id,
      topic: tracking.topic,
      status: tracking.status,
      frontmatter: gem4Result?.frontmatter,
      mdxContent: gem4Result?.mdxContent,
      image: gem5Result.rows[0] ? {
        url: gem5Result.rows[0].image_url,
        alt: gem5Result.rows[0].image_alt
      } : null,
      createdAt: tracking.createdAt,
      updatedAt: tracking.updatedAt
    };

    await client.end();

    return new Response(
      JSON.stringify({ success: true, preview }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error obteniendo preview:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
