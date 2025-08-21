import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const imageUrl = url.searchParams.get('url');
  const raw = url.searchParams.get('raw') === '1';
  
  if (!imageUrl) {
    return new Response(JSON.stringify({
      success: false,
      error: 'URL de imagen requerida'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  try {
    // Descargar la imagen
    const response = await fetch(imageUrl, {
      headers: {
        // Evitar bloqueos por referer/user-agent estrictos
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        'Referer': 'https://www.iapunto.com/'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error al descargar imagen: ${response.status}`);
    }

    // Obtener el buffer de la imagen
    const imageBuffer = await response.arrayBuffer();
    
    // Obtener el tipo de contenido
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Si se solicita binario crudo, devolver directamente la imagen
    if (raw) {
      return new Response(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
        }
      });
    }

    // Convertir a base64 para respuesta JSON
    const base64 = Buffer.from(imageBuffer).toString('base64');
    
    // Obtener el nombre del archivo de la URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1] || 'image.jpg';
    
    // Crear el data URL
    const dataUrl = `data:${contentType};base64,${base64}`;

    return new Response(JSON.stringify({
      success: true,
      data: {
        originalUrl: imageUrl,
        fileName: fileName,
        contentType: contentType,
        base64: base64,
        dataUrl: dataUrl,
        size: imageBuffer.byteLength
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Error procesando imagen:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: `Error procesando imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`
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