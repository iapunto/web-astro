import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const imageUrl = url.searchParams.get('url');
  
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
    const response = await fetch(imageUrl);
    
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