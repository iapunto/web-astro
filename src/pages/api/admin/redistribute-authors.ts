/**
 * API endpoint para redistribuir autores en Strapi
 *
 * Este endpoint permite:
 * - Analizar la distribución actual de autores (GET)
 * - Redistribuir autores entre artículos (POST)
 *
 * @author IA Punto
 * @version 1.0.0
 * @since 2025-01-27
 */

import type { APIRoute } from 'astro';
import { StrapiService } from '../../../lib/strapi.js';
import { AUTHORS } from '../../../lib/constants/authors.js';

interface AuthorDistribution {
  authorId: string;
  authorName: string;
  articleCount: number;
  articles: any[];
}

interface StrapiAuthor {
  id: number;
  documentId: string;
  name: string;
  email?: string;
  bio?: string;
  image?: any;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log('🔍 Analizando distribución de autores en Strapi...');

    // Obtener artículos de Strapi
    const articles = await StrapiService.getArticles();

    // Analizar distribución actual
    const distribution: { [key: string]: AuthorDistribution } = {};

    // Inicializar distribución para cada autor
    AUTHORS.forEach((author) => {
      distribution[author.id] = {
        authorId: author.id,
        authorName: author.name,
        articleCount: 0,
        articles: [],
      };
    });

    // Contar artículos por autor
    articles.forEach((article) => {
      if (article.author) {
        const authorName = article.author.name;
        const matchingAuthor = AUTHORS.find((a) => a.name === authorName);

        if (matchingAuthor) {
          distribution[matchingAuthor.id].articleCount++;
          distribution[matchingAuthor.id].articles.push({
            id: article.id,
            title: article.title,
            slug: article.slug,
            publishedAt: article.publishedAt,
          });
        }
      }
    });

    const totalArticles = articles.filter((a) => a.author).length;
    const totalWithoutAuthor = articles.length - totalArticles;

    const analysis = {
      success: true,
      data: {
        totalArticles: articles.length,
        articlesWithAuthor: totalArticles,
        articlesWithoutAuthor: totalWithoutAuthor,
        distribution: Object.values(distribution),
        authors: AUTHORS.map((author) => ({
          id: author.id,
          name: author.name,
          email: author.email,
          description: author.description,
        })),
      },
    };

    return new Response(JSON.stringify(analysis, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al analizar distribución de autores:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error al analizar distribución de autores',
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, dryRun = false } = body;

    if (action !== 'redistribute') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Acción no válida. Use "redistribute"',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('🚀 Iniciando redistribución de autores en Strapi...');
    console.log(`Modo: ${dryRun ? 'SIMULACIÓN (sin cambios)' : 'PRODUCCIÓN'}`);

    // Obtener artículos de Strapi
    const articles = await StrapiService.getArticles();
    const articlesWithAuthor = articles.filter((article) => article.author);

    console.log(`📊 Total de artículos: ${articles.length}`);
    console.log(`📊 Artículos con autor: ${articlesWithAuthor.length}`);

    if (dryRun) {
      // Solo simular la redistribución
      const redistribution = new Map();
      let authorIndex = 0;

      articlesWithAuthor.forEach((article, index) => {
        const selectedAuthor = AUTHORS[authorIndex];
        redistribution.set(article.id, selectedAuthor);
        authorIndex = (authorIndex + 1) % AUTHORS.length;
      });

      // Contar artículos por autor después de la redistribución
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
            totalArticles: articlesWithAuthor.length,
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

    // Ejecutar redistribución real
    const strapiApiUrl =
      import.meta.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
    const strapiApiToken = import.meta.env.STRAPI_API_TOKEN || '';

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
    const strapiAuthors: StrapiAuthor[] = strapiAuthorsData.data || [];

    // Crear mapeo de nombres a IDs de Strapi
    const authorNameToStrapiId = new Map<string, number>();
    strapiAuthors.forEach((author) => {
      authorNameToStrapiId.set(author.name, author.id);
    });

    // Redistribuir artículos
    const redistribution = new Map();
    let authorIndex = 0;
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const article of articlesWithAuthor) {
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

    console.log(`📊 Redistribución completada:`);
    console.log(`  ✅ Exitosas: ${successCount}`);
    console.log(`  ❌ Errores: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        dryRun: false,
        data: {
          totalArticles: articlesWithAuthor.length,
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
    console.error('Error durante la redistribución:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error durante la redistribución',
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
