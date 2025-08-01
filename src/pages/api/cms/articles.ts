import type { APIRoute } from 'astro';
import { CMSAPI } from '../../../lib/cms-api';

// GET /api/cms/articles - Obtener todos los artículos
export const GET: APIRoute = async () => {
  try {
    const articles = await CMSAPI.getAllArticles();
    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener artículos' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// POST /api/cms/articles - Crear nuevo artículo
export const POST: APIRoute = async ({ request }) => {
  try {
    const articleData = await request.json();
    const newArticle = await CMSAPI.createArticle(articleData);
    
    return new Response(JSON.stringify(newArticle), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear artículo' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 