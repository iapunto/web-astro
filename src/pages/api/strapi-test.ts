import type { APIRoute } from 'astro';
import { StrapiService } from '../../lib/strapi';

export const GET: APIRoute = async () => {
  try {
    console.log('🔍 Probando conexión con Strapi...');
    console.log('URL:', import.meta.env.STRAPI_API_URL);
    console.log('Token:', import.meta.env.STRAPI_API_TOKEN ? 'Presente' : 'No presente');

    // Intentar obtener artículos
    const articles = await StrapiService.getArticles();
    
    console.log('✅ Conexión exitosa con Strapi');
    console.log('📊 Artículos encontrados:', articles.length);

    return new Response(JSON.stringify({
      success: true,
      message: 'Conexión exitosa con Strapi',
      articlesCount: articles.length,
      articles: articles.slice(0, 3), // Solo los primeros 3 para la prueba
      strapiUrl: import.meta.env.STRAPI_API_URL,
      hasToken: !!import.meta.env.STRAPI_API_TOKEN
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('❌ Error conectando con Strapi:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Error conectando con Strapi',
      error: error instanceof Error ? error.message : 'Error desconocido',
      strapiUrl: import.meta.env.STRAPI_API_URL,
      hasToken: !!import.meta.env.STRAPI_API_TOKEN
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 