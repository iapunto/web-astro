/**
 * API endpoint para asignar autores a todos los artículos en Strapi
 *
 * Este endpoint asigna autores a artículos que no tienen autor asignado
 *
 * @author IA Punto
 * @version 1.0.0
 * @since 2025-01-27
 */

import type { APIRoute } from 'astro';
import { StrapiService } from '../../../lib/strapi.js';
import { AUTHORS } from '../../../lib/constants/authors.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, dryRun = false } = body;

    if (action !== 'assign-all') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Acción no válida. Use "assign-all"',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('🚀 Iniciando asignación de autores a todos los artículos...');
    console.log(`Modo: ${dryRun ? 'SIMULACIÓN (sin cambios)' : 'PRODUCCIÓN'}`);

    // Obtener artículos de Strapi
    const articles = await StrapiService.getArticles();
    console.log(`📊 Total de artículos: ${articles.length}`);

    if (dryRun) {
      // Solo simular la asignación
      const redistribution = new Map();
      let authorIndex = 0;

      articles.forEach((article, index) => {
        const selectedAuthor = AUTHORS[authorIndex];
        redistribution.set(article.id, selectedAuthor);
        authorIndex = (authorIndex + 1) % AUTHORS.length;
      });

      // Contar artículos por autor después de la asignación
      const newDistribution: { [key: string]: number } = {};
      AUTHORS.forEach((author) => {
        newDistribution[author.name] = 0;
      });

      redistribution.forEach((author) => {
        newDistribution[author.name]++;
      });

      return new Response(
        JSON.stringify({
          success: true,
          dryRun: true,
          data: {
            totalArticles: articles.length,
            newDistribution: Object.entries(newDistribution).map(
              ([name, count]) => ({
                authorName: name,
                articleCount: count,
              })
            ),
            redistribution: Array.from(redistribution.entries()).map(
              ([articleId, author]) => ({
                articleId,
                authorName: author.name,
                articleTitle:
                  articles.find((a) => a.id === articleId)?.title ||
                  'Sin título',
              })
            ),
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Ejecutar asignación real
    const strapiApiUrl =
      import.meta.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
    const strapiApiToken = import.meta.env.STRAPI_API_TOKEN || '';

    if (!strapiApiToken || strapiApiToken === 'tu_token_de_strapi_aqui') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token de Strapi no configurado o inválido',
          details: 'Configure STRAPI_API_TOKEN en las variables de entorno',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Obtener autores de Strapi
    const strapiAuthorsResponse = await fetch(
      `${strapiApiUrl}/api/authors?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${strapiApiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!strapiAuthorsResponse.ok) {
      throw new Error(
        `Error al obtener autores de Strapi: ${strapiAuthorsResponse.status}`
      );
    }

    const strapiAuthorsData = await strapiAuthorsResponse.json();
    const strapiAuthors: any[] = strapiAuthorsData.data || [];

    // Crear mapeo de nombres a IDs de Strapi
    const authorNameToStrapiId = new Map<string, number>();
    strapiAuthors.forEach((author) => {
      authorNameToStrapiId.set(author.name, author.id);
    });

    // Asignar autores a todos los artículos
    const redistribution = new Map();
    let authorIndex = 0;
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const article of articles) {
      const selectedAuthor = AUTHORS[authorIndex];
      const strapiAuthorId = authorNameToStrapiId.get(selectedAuthor.name);

      if (!strapiAuthorId) {
        errorCount++;
        errors.push(`Autor "${selectedAuthor.name}" no encontrado en Strapi`);
        continue;
      }

      // Actualizar artículo en Strapi
      const updateResponse = await fetch(
        `${strapiApiUrl}/api/articles/${article.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${strapiApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              author: strapiAuthorId,
            },
          }),
        }
      );

      if (updateResponse.ok) {
        successCount++;
        redistribution.set(article.id, selectedAuthor);
        console.log(
          `✅ Artículo "${article.title}" asignado a ${selectedAuthor.name}`
        );
      } else {
        errorCount++;
        const errorMsg = `Error al actualizar artículo "${article.title}": ${updateResponse.status}`;
        errors.push(errorMsg);
        console.log(`❌ ${errorMsg}`);
      }

      // Alternar al siguiente autor
      authorIndex = (authorIndex + 1) % AUTHORS.length;

      // Pequeña pausa para no sobrecargar la API
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Contar distribución final
    const finalDistribution: { [key: string]: number } = {};
    AUTHORS.forEach((author) => {
      finalDistribution[author.name] = 0;
    });

    redistribution.forEach((author) => {
      finalDistribution[author.name]++;
    });

    console.log(`📊 Asignación completada:`);
    console.log(`  ✅ Exitosas: ${successCount}`);
    console.log(`  ❌ Errores: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        dryRun: false,
        data: {
          totalArticles: articles.length,
          successCount,
          errorCount,
          errors: errors.slice(0, 10), // Solo mostrar primeros 10 errores
          finalDistribution: Object.entries(finalDistribution).map(
            ([name, count]) => ({
              authorName: name,
              articleCount: count,
            })
          ),
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error durante la asignación:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error durante la asignación',
        details: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
