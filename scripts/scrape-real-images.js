import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { realArticleUrls } from './real-urls-mapping.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para extraer la URL de la imagen de un artículo de TechCrunch
async function extractImageUrl(articleUrl) {
  try {
    console.log(`🔍 Extrayendo imagen de: ${articleUrl}`);

    const response = await fetch(articleUrl);
    const html = await response.text();

    // Buscar la imagen en el bloque figure con class wp-block-post-featured-image
    const figureMatch = html.match(
      /<figure[^>]*class="[^"]*wp-block-post-featured-image[^"]*"[^>]*>.*?<img[^>]*src="([^"]*)"[^>]*>/s
    );

    if (figureMatch) {
      const imageUrl = figureMatch[1];
      console.log(`✅ Imagen encontrada: ${imageUrl}`);
      return imageUrl;
    }

    // Buscar alternativa en el contenido de la imagen destacada
    const featuredImageMatch = html.match(
      /<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]*)"[^>]*>/
    );

    if (featuredImageMatch) {
      const imageUrl = featuredImageMatch[1];
      console.log(`✅ Imagen alternativa encontrada: ${imageUrl}`);
      return imageUrl;
    }

    // Buscar cualquier imagen de TechCrunch en el contenido
    const techcrunchImageMatch = html.match(
      /https:\/\/techcrunch\.com\/wp-content\/uploads\/[^"]*\.(jpg|jpeg|png|webp)/
    );

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

// Función para actualizar los covers de los artículos
async function updateArticleCovers() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir);

  let updatedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;

    const articleUrl = realArticleUrls[file];
    if (!articleUrl) {
      console.log(`⏭️  Sin URL de referencia: ${file}`);
      continue;
    }

    // Si la URL ya es una imagen, usarla directamente
    if (articleUrl.includes('/wp-content/uploads/')) {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      const newContent = content.replace(
        /cover: 'https:\/\/[^']*'/,
        `cover: '${articleUrl}'`
      );

      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Actualizado (imagen directa): ${file}`);
      updatedCount++;
      continue;
    }

    const imageUrl = await extractImageUrl(articleUrl);

    if (imageUrl) {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Reemplazar la URL del cover
      const newContent = content.replace(
        /cover: 'https:\/\/[^']*'/,
        `cover: '${imageUrl}'`
      );

      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Actualizado: ${file}`);
      updatedCount++;
    } else {
      console.log(`❌ Error al actualizar: ${file}`);
      errorCount++;
    }

    // Pausa para no sobrecargar el servidor
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Resumen:`);
  console.log(`- Actualizados: ${updatedCount}`);
  console.log(`- Errores: ${errorCount}`);
  console.log(`- Total procesados: ${updatedCount + errorCount}`);
}

// Ejecutar el script
updateArticleCovers();
