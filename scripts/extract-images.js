#!/usr/bin/env node

/**
 * Script para extraer todas las URLs de imágenes de los artículos
 * Ejecutar con: node scripts/extract-images.js
 */

import fs from 'fs';

// Función para obtener datos del endpoint local
async function getArticlesFromLocalEndpoint(page = 1, limit = 50) {
  try {
    const response = await fetch(`http://localhost:4321/migrate-to-strapi.json?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error obteniendo artículos: ${error.message}`);
  }
}

// Función para extraer URLs de imágenes del contenido HTML
function extractImageUrls(htmlContent) {
  const imageUrls = [];
  const imgRegex = /<img[^>]+src="([^"]+)"/g;
  let match;
  
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const url = match[1];
    // Filtrar URLs válidas (no data: ni relativas)
    if (url.startsWith('http') && !url.includes('data:')) {
      imageUrls.push(url);
    }
  }
  
  return [...new Set(imageUrls)]; // Eliminar duplicados
}

// Función para extraer URLs de imágenes de featured images
function extractFeaturedImageUrls(articles) {
  const featuredImages = [];
  
  articles.forEach(article => {
    if (article.featuredImage && article.featuredImage.url) {
      const url = article.featuredImage.url;
      if (url.startsWith('http') && !url.includes('data:')) {
        featuredImages.push({
          url: url,
          alt: article.featuredImage.alt || '',
          articleTitle: article.title,
          articleSlug: article.slug
        });
      }
    }
  });
  
  return featuredImages;
}

// Función principal
async function extractAllImages() {
  console.log('🖼️  Extrayendo URLs de imágenes de todos los artículos...\n');
  
  try {
    // Obtener información del primer lote
    const firstBatch = await getArticlesFromLocalEndpoint(1, 5);
    const totalPages = firstBatch.data.pagination.totalPages;
    const totalPosts = firstBatch.data.pagination.totalPosts;
    
    console.log(`📊 Total de artículos: ${totalPosts}`);
    console.log(`📦 Total de lotes: ${totalPages}\n`);
    
    const allImageUrls = new Set();
    const allFeaturedImages = [];
    const articleImageMap = new Map(); // Mapear artículo -> imágenes
    
    // Procesar cada lote
    for (let page = 1; page <= totalPages; page++) {
      console.log(`📦 Procesando lote ${page}/${totalPages}`);
      
      const batchData = await getArticlesFromLocalEndpoint(page, 50);
      const articles = batchData.data.posts;
      
      articles.forEach(article => {
        // Extraer imágenes del contenido
        const contentImages = extractImageUrls(article.content || '');
        contentImages.forEach(url => {
          allImageUrls.add(url);
        });
        
        // Extraer featured image
        if (article.featuredImage && article.featuredImage.url) {
          const featuredUrl = article.featuredImage.url;
          if (featuredUrl.startsWith('http') && !featuredUrl.includes('data:')) {
            allImageUrls.add(featuredUrl);
            allFeaturedImages.push({
              url: featuredUrl,
              alt: article.featuredImage.alt || '',
              articleTitle: article.title,
              articleSlug: article.slug
            });
          }
        }
        
        // Mapear artículo -> todas sus imágenes
        const articleImages = [...contentImages];
        if (article.featuredImage && article.featuredImage.url) {
          articleImages.push(article.featuredImage.url);
        }
        
        if (articleImages.length > 0) {
          articleImageMap.set(article.slug, {
            title: article.title,
            images: articleImages
          });
        }
      });
      
      console.log(`✅ Lote ${page} procesado`);
    }
    
    // Convertir Set a Array
    const uniqueImageUrls = Array.from(allImageUrls);
    
    // Crear estructura de datos para el script de migración
    const imageData = {
      totalImages: uniqueImageUrls.length,
      totalFeaturedImages: allFeaturedImages.length,
      totalArticlesWithImages: articleImageMap.size,
      extractedAt: new Date().toISOString(),
      images: uniqueImageUrls.map((url, index) => ({
        id: index + 1,
        url: url,
        filename: url.split('/').pop() || `image_${index + 1}`,
        isFeatured: allFeaturedImages.some(fi => fi.url === url)
      })),
      featuredImages: allFeaturedImages,
      articleImageMap: Object.fromEntries(articleImageMap)
    };
    
    // Guardar datos
    fs.writeFileSync('images-data.json', JSON.stringify(imageData, null, 2));
    
    // Mostrar resumen
    console.log('\n🎉 ¡Extracción completada!');
    console.log('='.repeat(50));
    console.log(`📊 Total de imágenes únicas: ${uniqueImageUrls.length}`);
    console.log(`🖼️  Featured images: ${allFeaturedImages.length}`);
    console.log(`📝 Artículos con imágenes: ${articleImageMap.size}`);
    console.log(`📁 Datos guardados en: images-data.json`);
    
    // Mostrar algunas URLs de ejemplo
    console.log('\n🔍 Ejemplos de URLs encontradas:');
    uniqueImageUrls.slice(0, 5).forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    
    if (uniqueImageUrls.length > 5) {
      console.log(`   ... y ${uniqueImageUrls.length - 5} más`);
    }
    
  } catch (error) {
    console.error('❌ Error durante la extracción:', error);
    process.exit(1);
  }
}

// Ejecutar extracción
extractAllImages().catch(console.error);
