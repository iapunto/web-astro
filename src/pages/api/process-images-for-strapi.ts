import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const posts = await getCollection('blog');
    const site = 'https://iapunto.com';

    const imageProcessingResults = [];

    for (const post of posts) {
      const coverUrl = post.data.cover;
      
      if (!coverUrl) {
        imageProcessingResults.push({
          articleId: post.id,
          articleSlug: post.data.slug || post.id,
          success: false,
          error: 'No hay URL de imagen'
        });
        continue;
      }

      try {
        // Descargar la imagen
        const response = await fetch(coverUrl);
        
        if (!response.ok) {
          throw new Error(`Error al descargar imagen: ${response.status}`);
        }

        // Obtener el buffer de la imagen
        const imageBuffer = await response.arrayBuffer();
        
        // Convertir a base64
        const base64 = Buffer.from(imageBuffer).toString('base64');
        
        // Obtener el tipo de contenido
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        // Obtener el nombre del archivo de la URL
        const urlParts = coverUrl.split('/');
        const fileName = urlParts[urlParts.length - 1] || 'image.jpg';
        
        // Crear el data URL
        const dataUrl = `data:${contentType};base64,${base64}`;

        imageProcessingResults.push({
          articleId: post.id,
          articleSlug: post.data.slug || post.id,
          success: true,
          data: {
            originalUrl: coverUrl,
            fileName: fileName,
            contentType: contentType,
            base64: base64,
            dataUrl: dataUrl,
            size: imageBuffer.byteLength
          }
        });

      } catch (error) {
        console.error(`Error procesando imagen para ${post.id}:`, error);
        
        imageProcessingResults.push({
          articleId: post.id,
          articleSlug: post.data.slug || post.id,
          success: false,
          error: `Error procesando imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`
        });
      }
    }

    const successful = imageProcessingResults.filter(result => result.success);
    const failed = imageProcessingResults.filter(result => !result.success);

    return new Response(JSON.stringify({
      success: true,
      summary: {
        total: imageProcessingResults.length,
        successful: successful.length,
        failed: failed.length
      },
      results: imageProcessingResults
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Error general procesando imágenes:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: `Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}; 