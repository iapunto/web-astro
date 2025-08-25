import fetch from 'node-fetch';

// Función para extraer la URL de la imagen de un artículo de TechCrunch
async function extractImageUrl(articleUrl) {
  try {
    console.log(`🔍 Extrayendo imagen de: ${articleUrl}`);
    
    const response = await fetch(articleUrl);
    const html = await response.text();
    
    console.log(`📄 HTML obtenido (primeros 500 caracteres):`);
    console.log(html.substring(0, 500));
    
    // Buscar la imagen en el bloque figure con class wp-block-post-featured-image
    const figureMatch = html.match(/<figure[^>]*class="[^"]*wp-block-post-featured-image[^"]*"[^>]*>.*?<img[^>]*src="([^"]*)"[^>]*>/s);
    
    if (figureMatch) {
      const imageUrl = figureMatch[1];
      console.log(`✅ Imagen encontrada: ${imageUrl}`);
      return imageUrl;
    }
    
    // Buscar alternativa en el contenido de la imagen destacada
    const featuredImageMatch = html.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]*)"[^>]*>/);
    
    if (featuredImageMatch) {
      const imageUrl = featuredImageMatch[1];
      console.log(`✅ Imagen alternativa encontrada: ${imageUrl}`);
      return imageUrl;
    }
    
    // Buscar cualquier imagen de TechCrunch en el contenido
    const techcrunchImageMatch = html.match(/https:\/\/techcrunch\.com\/wp-content\/uploads\/[^"]*\.(jpg|jpeg|png|webp)/);
    
    if (techcrunchImageMatch) {
      const imageUrl = techcrunchImageMatch[0];
      console.log(`✅ Imagen de TechCrunch encontrada: ${imageUrl}`);
      return imageUrl;
    }
    
    console.log(`❌ No se encontró imagen en: ${articleUrl}`);
    return null;
    
  } catch (error) {
    console.log(`❌ Error al extraer imagen de ${articleUrl}:`, error.message);
    return null;
  }
}

// Probar con el artículo específico
const testUrl = 'https://techcrunch.com/2025/07/15/techcrunch-all-stage-launches-in-boston-today-dont-miss-what-founders-are-learning/';

extractImageUrl(testUrl); 