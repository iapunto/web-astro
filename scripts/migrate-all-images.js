#!/usr/bin/env node

/**
 * Script completo para migrar todas las imágenes a Strapi y asociarlas a artículos
 * Ejecutar con: node scripts/migrate-all-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const CONFIG = {
  STRAPI_URL: 'https://strapi.iapunto.com',
  STRAPI_TOKEN: 'e901671364d5b2604b471991bda99a5db1d3d745bb51cd221f2380e53912416189ec085e8199968f6abd60885e5677027b36ba302e40ee5ac69878f0085c9e1cb5b185e13ac1e394a5bf2515725d1dd4e07af0e589546de51e3d16a5cf47afbb45cb943056598b2433e8af6b9c23795c031e14c06f193c568565de0e0ae5f629',
  DOWNLOAD_DIR: path.join(__dirname, '..', 'downloaded-images'),
  BATCH_SIZE: 3, // Procesar 3 imágenes a la vez
  DELAY_BETWEEN_DOWNLOADS: 2000, // 2 segundos
  DELAY_BETWEEN_ASSOCIATIONS: 1000, // 1 segundo
  MAX_RETRIES: 3
};

// Función para delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Función para crear directorio si no existe
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Función para obtener extensión de archivo
function getFileExtension(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const ext = path.extname(pathname);
    return ext || '.jpg';
  } catch (error) {
    return '.jpg';
  }
}

// Función para generar nombre de archivo único
function generateFileName(url, index) {
  const ext = getFileExtension(url);
  const baseName = `image_${index.toString().padStart(3, '0')}`;
  return `${baseName}${ext}`;
}

// Función para obtener MIME type
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Función para descargar imagen
async function downloadImage(url, filePath, retryCount = 0) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filePath, buffer);
    return true;
  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(
        `🔄 Reintentando descarga (${retryCount + 1}/${CONFIG.MAX_RETRIES}) para: ${url}`
      );
      await delay(3000);
      return downloadImage(url, filePath, retryCount + 1);
    }
    throw error;
  }
}

// Función para subir imagen a Strapi
async function uploadImageToStrapi(filePath, originalUrl, retryCount = 0) {
  try {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const mimeType = getMimeType(filePath);

    // Crear un Blob para FormData
    const blob = new Blob([fileBuffer], { type: mimeType });
    formData.append('files', blob, fileName);

    const response = await fetch(`${CONFIG.STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result[0]; // Strapi devuelve un array
  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(
        `🔄 Reintentando subida (${retryCount + 1}/${CONFIG.MAX_RETRIES}) para: ${fileName}`
      );
      await delay(3000);
      return uploadImageToStrapi(filePath, originalUrl, retryCount + 1);
    }
    throw error;
  }
}

// Función para obtener artículo por slug
async function getArticleBySlug(slug) {
  const response = await fetch(
    `${CONFIG.STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}`,
    {
      headers: {
        Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error obteniendo artículo: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.data.length === 0) {
    throw new Error(`Artículo no encontrado con slug: ${slug}`);
  }

  return data.data[0];
}

// Función para asociar imagen al artículo
async function associateImageToArticle(articleDocumentId, imageId, retryCount = 0) {
  try {
    const response = await fetch(
      `${CONFIG.STRAPI_URL}/api/articles/${articleDocumentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            cover: imageId,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error actualizando artículo: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(
        `🔄 Reintentando asociación (${retryCount + 1}/${CONFIG.MAX_RETRIES}) para: ${articleDocumentId}`
      );
      await delay(2000);
      return associateImageToArticle(articleDocumentId, imageId, retryCount + 1);
    }
    throw error;
  }
}

// Función principal
async function migrateAllImages() {
  console.log('🖼️  Iniciando migración completa de imágenes a Strapi...\n');

  try {
    // Cargar datos de imágenes
    if (!fs.existsSync('images-data.json')) {
      throw new Error('Archivo images-data.json no encontrado. Ejecuta primero extract-images.js');
    }

    const imageData = JSON.parse(fs.readFileSync('images-data.json', 'utf8'));
    console.log(`📊 Total de imágenes a procesar: ${imageData.totalImages}`);
    console.log(`📊 Total de featured images: ${imageData.totalFeaturedImages}`);

    // Crear directorio de descargas
    ensureDir(CONFIG.DOWNLOAD_DIR);

    const results = {
      successful: [],
      failed: [],
      summary: {
        total: imageData.totalImages,
        successful: 0,
        failed: 0,
        startTime: new Date().toISOString(),
        endTime: null
      }
    };

    // Procesar imágenes en lotes
    const totalBatches = Math.ceil(imageData.images.length / CONFIG.BATCH_SIZE);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * CONFIG.BATCH_SIZE;
      const endIndex = Math.min(
        startIndex + CONFIG.BATCH_SIZE,
        imageData.images.length
      );
      const batch = imageData.images.slice(startIndex, endIndex);

      console.log(`\n📦 Procesando lote ${batchIndex + 1}/${totalBatches} (imágenes ${startIndex + 1}-${endIndex})`);

      for (let i = 0; i < batch.length; i++) {
        const imageInfo = batch[i];
        const fileName = generateFileName(imageInfo.url, startIndex + i + 1);
        const filePath = path.join(CONFIG.DOWNLOAD_DIR, fileName);

        console.log(`📥 [${i + 1}/${batch.length}] Procesando: ${imageInfo.url}`);

        try {
          // 1. Descargar imagen
          await downloadImage(imageInfo.url, filePath);
          console.log(`✅ Descargada: ${fileName}`);

          // 2. Subir a Strapi
          console.log(`📤 Subiendo a Strapi: ${fileName}`);
          const uploadResult = await uploadImageToStrapi(filePath, imageInfo.url);
          console.log(`✅ Subida a Strapi: ID ${uploadResult.id} - ${uploadResult.url}`);

          // 3. Si es featured image, asociar al artículo
          if (imageInfo.isFeatured) {
            const featuredImage = imageData.featuredImages.find(
              (fi) => fi.url === imageInfo.url
            );
            
            if (featuredImage) {
              console.log(`🔗 Asociando a artículo: ${featuredImage.articleTitle}`);
              
              try {
                // Obtener el artículo
                const article = await getArticleBySlug(featuredImage.articleSlug);
                
                // Asociar la imagen
                await associateImageToArticle(article.documentId, uploadResult.id);
                console.log(`✅ Artículo actualizado: ${featuredImage.articleSlug}`);
                
                await delay(CONFIG.DELAY_BETWEEN_ASSOCIATIONS);
              } catch (associationError) {
                console.log(`⚠️  Error asociando imagen: ${associationError.message}`);
                // Continuar con la siguiente imagen aunque falle la asociación
              }
            }
          }

          results.successful.push({
            originalUrl: imageInfo.url,
            fileName: fileName,
            strapiId: uploadResult.id,
            strapiUrl: uploadResult.url,
            isFeatured: imageInfo.isFeatured,
            associatedToArticle: imageInfo.isFeatured
          });
          results.summary.successful++;

        } catch (error) {
          console.log(`❌ Error: ${imageInfo.url} - ${error.message}`);
          results.failed.push({
            originalUrl: imageInfo.url,
            fileName: fileName,
            error: error.message,
            failedAt: new Date().toISOString()
          });
          results.summary.failed++;
        }

        // Delay entre descargas
        if (i < batch.length - 1) {
          await delay(CONFIG.DELAY_BETWEEN_DOWNLOADS);
        }
      }

      console.log(`✅ Lote ${batchIndex + 1} completado`);

      // Delay entre lotes
      if (batchIndex < totalBatches - 1) {
        console.log(`⏳ Esperando 3 segundos antes del siguiente lote...`);
        await delay(3000);
      }
    }

    // Finalizar
    results.summary.endTime = new Date().toISOString();

    // Guardar resultados
    fs.writeFileSync('complete-migration-results.json', JSON.stringify(results, null, 2));

    // Mostrar resumen final
    console.log('\n🎉 ¡Migración completa de imágenes finalizada!');
    console.log('='.repeat(60));
    console.log(`📊 Total de imágenes: ${results.summary.total}`);
    console.log(`✅ Procesadas exitosamente: ${results.summary.successful}`);
    console.log(`❌ Fallidas: ${results.summary.failed}`);
    console.log(`📁 Imágenes descargadas en: ${CONFIG.DOWNLOAD_DIR}`);
    console.log(`📁 Resultados guardados en: complete-migration-results.json`);

    // Mostrar estadísticas de asociaciones
    const associatedCount = results.successful.filter(r => r.associatedToArticle).length;
    console.log(`🔗 Imágenes asociadas a artículos: ${associatedCount}`);

    if (results.failed.length > 0) {
      console.log('\n❌ Imágenes que fallaron:');
      results.failed.forEach((failed) => {
        console.log(`   - ${failed.originalUrl}: ${failed.error}`);
      });
    }

    console.log('\n📋 Próximos pasos:');
    console.log('1. Verifica en Strapi Admin que las imágenes aparecen correctamente');
    console.log('2. Revisa que los artículos tienen sus cover images asociadas');
    console.log('3. Si hay errores, revisa complete-migration-results.json para detalles');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateAllImages().catch(console.error);
