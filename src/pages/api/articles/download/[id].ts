import type { APIRoute } from 'astro';
import { ArticleTrackingService } from '../../../../lib/database/articleTrackingSchema.js';
import { Client } from 'pg';

export const GET: APIRoute = async ({ params }) => {
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

    // Obtener el artículo publicado
    const query = `
      SELECT 
        pa.*,
        gr4.frontmatter,
        gr4.content,
        gr4.mdx_content
      FROM published_articles pa
      LEFT JOIN gem4_results gr4 ON pa.article_id = gr4.article_id
      WHERE pa.article_id = $1
    `;

    const result = await client.query(query, [articleId]);

    if (result.rows.length === 0) {
      return new Response('Artículo no encontrado', { status: 404 });
    }

    const article = result.rows[0];

    // Si no hay contenido MDX, generarlo
    let mdxContent = article.mdx_content;

    if (!mdxContent && article.frontmatter && article.content) {
      mdxContent = generateMDXContent(article.frontmatter, article.content);
    }

    if (!mdxContent) {
      return new Response('Contenido del artículo no disponible', {
        status: 404,
      });
    }

    // Configurar headers para descarga
    const headers = {
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="articulo-${articleId}.mdx"`,
      'Cache-Control': 'no-cache',
    };

    return new Response(mdxContent, { headers });
  } catch (error) {
    console.error('Error descargando artículo:', error);
    return new Response('Error interno del servidor', { status: 500 });
  } finally {
    await client.end();
  }
};

function generateMDXContent(frontmatter: any, content: string): string {
  // Generar frontmatter en formato YAML
  const frontmatterYAML = `---
title: "${frontmatter.title || ''}"
slug: "${frontmatter.slug || ''}"
pubDate: "${frontmatter.pubDate || new Date().toISOString()}"
description: "${frontmatter.description || ''}"
cover: "${frontmatter.cover || ''}"
coverAlt: "${frontmatter.coverAlt || ''}"
author: "${frontmatter.author || 'IA Punto'}"
category: "${frontmatter.category || ''}"
subcategory: "${frontmatter.subcategory || ''}"
tags: [${(frontmatter.tags || []).map((tag: string) => `"${tag}"`).join(', ')}]
quote: "${frontmatter.quote || ''}"
---

`;

  // Combinar frontmatter con contenido
  return frontmatterYAML + content;
}
