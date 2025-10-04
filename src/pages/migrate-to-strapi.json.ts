import { getCollection } from 'astro:content';

// Función para escapar caracteres especiales en JSON
function escapeJson(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

// Función para normalizar fechas
function normalizeDate(dateString: string | Date): Date {
  if (dateString instanceof Date) {
    return dateString;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn(`Fecha inválida: ${dateString}, usando fecha actual`);
    return new Date();
  }
  return date;
}

export async function GET({ url }: { url: URL }) {
  try {
    const startTime = Date.now();
    
    // Parámetros de paginación optimizados para migración
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10'); // Límite muy pequeño para n8n
    const maxLimit = 20; // Límite máximo reducido
    const format = url.searchParams.get('format') || 'json'; // json o rss
    const isN8n = url.searchParams.get('n8n') === 'true'; // Flag para n8n

    // Validar parámetros
    const safeLimit = Math.min(limit, maxLimit);
    const safePage = Math.max(1, page);
    
    // Optimización específica para n8n: lotes aún más pequeños
    const effectiveLimit = isN8n ? Math.min(safeLimit, 10) : safeLimit;

    // Calcular offset
    const offset = (safePage - 1) * effectiveLimit;

    // Obtener todos los posts
    const allPosts = await getCollection('blog');
    const totalPosts = allPosts.length;
    
    // Ordenar por fecha (más recientes primero)
    const sortedPosts = allPosts.sort((a, b) => {
      const dateA = normalizeDate(a.data.pubDate);
      const dateB = normalizeDate(b.data.pubDate);
      return dateB.getTime() - dateA.getTime();
    });

    // Aplicar paginación
    const paginatedPosts = sortedPosts.slice(offset, offset + effectiveLimit);
    const totalPages = Math.ceil(totalPosts / effectiveLimit);

    // Procesar posts para migración a Strapi
    const processedPosts = paginatedPosts.map((post) => {
      try {
        if (!post.data) {
          return null;
        }

        const pubDate = normalizeDate(post.data.pubDate);
        
        // Estructura optimizada para Strapi
        return {
          // Campos básicos
          title: post.data.title || 'Sin título',
          slug: post.data.slug || post.id,
          content: post.body || '', // Contenido MDX
          excerpt: post.data.description || '',
          publishedAt: pubDate.toISOString(),
          
          // Metadatos
          seo: {
            metaTitle: post.data.title || 'Sin título',
            metaDescription: post.data.description || '',
            keywords: Array.isArray(post.data.tags) ? post.data.tags.join(', ') : '',
          },
          
          // Imagen destacada
          featuredImage: {
            url: post.data.cover || '',
            alt: post.data.coverAlt || post.data.title || '',
          },
          
          // Autor
          author: {
            name: post.data.author?.name || 'IA Punto',
            bio: post.data.author?.description || '',
            avatar: post.data.author?.image || '',
          },
          
          // Categorización
          category: post.data.category || 'General',
          subcategory: post.data.subcategory || '',
          tags: Array.isArray(post.data.tags) ? post.data.tags : [],
          
          // Metadatos adicionales
          quote: post.data.quote || '',
          
          // Campos de migración
          migration: {
            source: 'astro-markdown',
            originalId: post.id,
            migratedAt: new Date().toISOString(),
            page: safePage,
            totalPages: totalPages,
          }
        };
      } catch (error) {
        console.error(`Error procesando artículo ${post.id}:`, error);
        return null;
      }
    }).filter(post => post !== null);

    const responseTime = Date.now() - startTime;

    // Respuesta en formato JSON optimizado para n8n
    const response = {
      success: true,
      data: {
        posts: processedPosts,
        pagination: {
          currentPage: safePage,
          totalPages: totalPages,
          totalPosts: totalPosts,
          postsPerPage: effectiveLimit,
          hasNextPage: safePage < totalPages,
          hasPrevPage: safePage > 1,
          nextPageUrl: safePage < totalPages ? 
            `${url.origin}/migrate-to-strapi.json?page=${safePage + 1}&limit=${effectiveLimit}${isN8n ? '&n8n=true' : ''}` : null,
          prevPageUrl: safePage > 1 ? 
            `${url.origin}/migrate-to-strapi.json?page=${safePage - 1}&limit=${effectiveLimit}${isN8n ? '&n8n=true' : ''}` : null,
        },
        performance: {
          responseTime: responseTime,
          processingTime: `${responseTime}ms`,
          postsProcessed: processedPosts.length,
        },
        migration: {
          status: 'ready',
          format: 'strapi-compatible',
          instructions: {
            endpoint: 'POST /api/articles',
            contentType: 'application/json',
            batchSize: effectiveLimit,
            totalBatches: totalPages,
          }
        }
      }
    };

    return new Response(JSON.stringify(response, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=120', // Cache corto para migración
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Total-Posts': totalPosts.toString(),
        'X-Total-Pages': totalPages.toString(),
        'X-Current-Page': safePage.toString(),
        'X-Posts-Per-Page': effectiveLimit.toString(),
        'X-Response-Time': responseTime.toString(),
        'X-Processing-Time': `${responseTime}ms`,
        'X-Migration-Format': 'strapi-compatible',
        'X-Batch-Number': safePage.toString(),
        'X-Total-Batches': totalPages.toString(),
      },
    });
  } catch (error) {
    console.error('Error generando datos de migración:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error generando datos de migración',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    });
  }
}
