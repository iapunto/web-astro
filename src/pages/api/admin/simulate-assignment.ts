/**
 * API endpoint para simular la asignación completa de autores
 * Genera un reporte detallado de la asignación que se realizaría
 *
 * @author IA Punto
 * @version 1.0.0
 * @since 2025-01-27
 */

import type { APIRoute } from 'astro';
import { StrapiService } from '../../../lib/strapi';
import { AUTHORS } from '../../../lib/constants/authors';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('🚀 Simulando asignación completa de autores...');

    // Obtener artículos de Strapi
    const articles = await StrapiService.getArticles();
    console.log(`📊 Total de artículos a procesar: ${articles.length}`);

    // Simular asignación de autores
    const assignment = new Map();
    let authorIndex = 0;
    const assignments = [];

    articles.forEach((article, index) => {
      const selectedAuthor = AUTHORS[authorIndex];
      assignment.set(article.id, selectedAuthor);

      assignments.push({
        articleId: article.id,
        articleTitle: article.title,
        articleSlug: article.slug,
        assignedAuthor: selectedAuthor.name,
        authorId: selectedAuthor.id,
        authorEmail: selectedAuthor.email,
      });

      // Alternar al siguiente autor
      authorIndex = (authorIndex + 1) % AUTHORS.length;
    });

    // Contar distribución final
    const finalDistribution: { [key: string]: number } = {};
    AUTHORS.forEach((author) => {
      finalDistribution[author.name] = 0;
    });

    assignment.forEach((author) => {
      finalDistribution[author.name]++;
    });

    // Generar reporte detallado
    const report = {
      success: true,
      simulation: true,
      summary: {
        totalArticles: articles.length,
        authors: AUTHORS.length,
        distribution: finalDistribution,
      },
      assignments: assignments,
      authorDetails: AUTHORS.map((author) => ({
        id: author.id,
        name: author.name,
        email: author.email,
        description: author.description,
        assignedArticles: finalDistribution[author.name],
        percentage:
          ((finalDistribution[author.name] / articles.length) * 100).toFixed(
            1
          ) + '%',
      })),
    };

    console.log(`📊 Simulación completada:`);
    console.log(`  📝 Total de artículos: ${articles.length}`);
    Object.entries(finalDistribution).forEach(([name, count]) => {
      console.log(
        `  👤 ${name}: ${count} artículos (${((count / articles.length) * 100).toFixed(1)}%)`
      );
    });

    return new Response(JSON.stringify(report, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error durante la simulación:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error durante la simulación',
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
