import type { APIRoute } from 'astro';
import { ArticleTrackingService } from '../../../../lib/database/articleTrackingSchema.js';
import { Client } from 'pg';

export const GET: APIRoute = async ({ params, request }) => {
  const articleId = params.id;

  if (!articleId) {
    return new Response('ID de artículo requerido', { status: 400 });
  }

  // Configurar conexión a la base de datos
  const client = new Client({
    connectionString: process.env.DATABASE_PUBLIC_URL,
  });

  try {
    await client.connect();
    const trackingService = new ArticleTrackingService(client);

    // Configurar SSE
    const headers = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    };

    const stream = new ReadableStream({
      start(controller) {
        let isConnected = true;
        let checkInterval: NodeJS.Timeout;

        // Función para enviar eventos SSE
        const sendEvent = (data: any) => {
          if (!isConnected) return;
          try {
            const event = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(new TextEncoder().encode(event));
          } catch (error) {
            console.error('Error enviando evento SSE:', error);
          }
        };

        // Función para verificar el estado del artículo
        const checkArticleStatus = async () => {
          try {
            const tracking = await trackingService.getTracking(articleId);

            if (!tracking) {
              sendEvent({
                type: 'error',
                message: 'Artículo no encontrado',
              });
              return;
            }

            // Enviar actualización de estado
            sendEvent({
              type: 'status_update',
              status: {
                gem: getCurrentGem(tracking.status),
                state: getGemState(tracking.status),
                message: getStatusMessage(tracking.status),
              },
              progress: getProgressPercentage(tracking.status),
              message: `Estado actual: ${tracking.status}`,
            });

            // Si hay resultados específicos de GEMs, enviarlos
            if (
              tracking.status === 'gem1_completed' ||
              tracking.status === 'gem2_completed' ||
              tracking.status === 'gem3_completed' ||
              tracking.status === 'gem4_completed'
            ) {
              const gemResults = await getGemResults(
                client,
                articleId,
                tracking.status
              );
              if (gemResults) {
                sendEvent({
                  type: `${tracking.status}`,
                  result: gemResults,
                });
              }
            }

            // Si el proceso está completado o en error, cerrar la conexión
            if (
              tracking.status === 'published' ||
              tracking.status === 'error'
            ) {
              if (tracking.status === 'published') {
                const finalResult = await getFinalArticle(client, articleId);
                sendEvent({
                  type: 'gem4_completed',
                  result: finalResult,
                });
              }

              sendEvent({
                type: 'completed',
                status: tracking.status,
                url: tracking.published_url,
              });

              isConnected = false;
              clearInterval(checkInterval);
              controller.close();
            }
          } catch (error) {
            console.error('Error verificando estado:', error);
            if (isConnected) {
              sendEvent({
                type: 'error',
                message: 'Error verificando estado del artículo',
              });
            }
          }
        };

        // Verificar estado inicial
        checkArticleStatus();

        // Configurar intervalo de verificación
        checkInterval = setInterval(checkArticleStatus, 2000); // Verificar cada 2 segundos

        // Manejar desconexión del cliente
        request.signal.addEventListener('abort', () => {
          isConnected = false;
          clearInterval(checkInterval);
          controller.close();
        });

        // Limpiar al cerrar
        return () => {
          isConnected = false;
          clearInterval(checkInterval);
        };
      },
    });

    return new Response(stream, { headers });
  } catch (error) {
    console.error('Error en SSE:', error);
    return new Response('Error interno del servidor', { status: 500 });
  } finally {
    // No cerrar la conexión aquí, se cerrará cuando el stream termine
    // await client.end();
  }
};

// Funciones auxiliares
function getCurrentGem(status: string): string {
  if (status.includes('gem1')) return 'gem1';
  if (status.includes('gem2')) return 'gem2';
  if (status.includes('gem3')) return 'gem3';
  if (status.includes('gem4')) return 'gem4';
  return 'gem1';
}

function getGemState(status: string): string {
  if (status === 'pending') return 'pending';
  if (status.includes('_completed')) return 'completed';
  if (status.includes('_in_progress')) return 'in_progress';
  if (status === 'error') return 'error';
  return 'pending';
}

function getStatusMessage(status: string): string {
  const messages = {
    pending: 'Esperando inicio',
    gem1_completed: 'Planificación completada',
    gem2_in_progress: 'Investigando secciones',
    gem2_completed: 'Investigación completada',
    gem3_in_progress: 'Redactando artículo',
    gem3_completed: 'Redacción completada',
    gem4_in_progress: 'Finalizando artículo',
    gem4_completed: 'Finalización completada',
    published: 'Artículo publicado',
    error: 'Error en el proceso',
  };
  return messages[status] || 'Procesando...';
}

function getProgressPercentage(status: string): number {
  const progress = {
    pending: 0,
    gem1_completed: 25,
    gem2_in_progress: 30,
    gem2_completed: 50,
    gem3_in_progress: 60,
    gem3_completed: 75,
    gem4_in_progress: 85,
    gem4_completed: 95,
    published: 100,
    error: 0,
  };
  return progress[status] || 0;
}

async function getGemResults(
  client: Client,
  articleId: string,
  status: string
) {
  try {
    let query = '';
    let table = '';

    switch (status) {
      case 'gem1_completed':
        table = 'gem1_results';
        break;
      case 'gem2_completed':
        table = 'gem2_results';
        break;
      case 'gem3_completed':
        table = 'gem3_results';
        break;
      case 'gem4_completed':
        table = 'gem4_results';
        break;
      default:
        return null;
    }

    query = `SELECT * FROM ${table} WHERE article_id = $1 ORDER BY created_at DESC LIMIT 1`;
    const result = await client.query(query, [articleId]);

    return result.rows[0] || null;
  } catch (error) {
    console.error(`Error obteniendo resultados de ${status}:`, error);
    return null;
  }
}

async function getFinalArticle(client: Client, articleId: string) {
  try {
    // Obtener información del artículo publicado
    const query = `
      SELECT 
        pa.*,
        gr4.frontmatter,
        gr4.content
      FROM published_articles pa
      LEFT JOIN gem4_results gr4 ON pa.article_id = gr4.article_id
      WHERE pa.article_id = $1
    `;

    const result = await client.query(query, [articleId]);

    if (result.rows.length > 0) {
      const article = result.rows[0];
      return {
        frontmatter: article.frontmatter,
        content: article.content,
        url: article.published_url,
        word_count: article.content?.length || 0,
      };
    }

    return null;
  } catch (error) {
    console.error('Error obteniendo artículo final:', error);
    return null;
  }
}
