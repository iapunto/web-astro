#!/usr/bin/env node

/**
 * Script para descargar imágenes y subirlas a Strapi
 * Ejecutar con: node scripts/migrate-images.js
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
  BATCH_SIZE: 5,
  DELAY_BETWEEN_DOWNLOADS: 1000, // 1 segundo
  MAX_RETRIES: 3
};

// Función para delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
    return ext || '.jpg'; // Default a .jpg si no hay extensión
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
      console.log(`🔄 Reintentando descarga (${retryCount + 1}/${CONFIG.MAX_RETRIES}) para: ${url}`);
      await delay(2000);
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
    
    // Crear un Blob para FormData
    const blob = new Blob([fileBuffer]);
    formData.append('files', blob, fileName);
    
    const response = await fetch(`${CONFIG.STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.STRAPI_TOKEN}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result[0]; // Strapi devuelve un array
  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(`🔄 Reintentando subida (${retryCount + 1}/${CONFIG.MAX_RETRIES}) para: ${fileName}`);
      await delay(2000);
      return uploadImageToStrapi(filePath, originalUrl, retryCount + 1);
    }
    throw error;
  }
}

// Función para actualizar artículo con imagen en Strapi
async function updateArticleWithImage(articleSlug, imageId, retryCount = 0) {
  try {
    // Primero obtener el artículo actual
    const getResponse = await fetch(`${CONFIG.STRAPI_URL}/api/articles?filters[slug][$eq]=${articleSlug}`, {
      headers: {
        'Authorization': `Bearer ${CONFIG.STRAPI_TOKEN}`
      }
    });
    
    if (!getResponse.ok) {
      throw new Error(`Error obteniendo artículo: ${getResponse.status}`);
    }
    
    const getData = await getResponse.json();
    if (getData.data.length === 0) {
      throw new Error(`Artículo no encontrado: ${articleSlug}`);
    }
    
    const article = getData.data[0];
    
    // Actualizar con la imagen
    const updateResponse = await fetch(`${CONFIG.STRAPI_URL}/api/articles/${article.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.STRAPI_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          cover: imageId
        }
      })
    });
    
    if (!updateResponse.ok) {
      throw new Error(`Error actualizando artículo: ${updateResponse.status}`);
    }
    
    return await updateResponse.json();
  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(`🔄 Reintentando actualización (${retryCount + 1}/${CONFIG.MAX_RETRIES}) para: ${articleSlug}`);
      await delay(2000);
      return updateArticleWithImage(articleSlug, imageId, retryCount + 1);
    }
    throw error;
  }
}

// Función principal
async function migrateImages() {
  console.log('🖼️  Iniciando migración de imágenes a Strapi...\n');
  
  try {
    // Cargar datos de imágenes
    if (!fs.existsSync('images-data.json')) {
      throw new Error('Archivo images-data.json no encontrado. Ejecuta primero extract-images.js');
    }
    
    const imageData = JSON.parse(fs.readFileSync('images-data.json', 'utf8'));
    console.log(`📊 Total de imágenes a procesar: ${imageData.totalImages}`);
    
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
      const endIndex = Math.min(startIndex + CONFIG.BATCH_SIZE, imageData.images.length);
      const batch = imageData.images.slice(startIndex, endIndex);
      
      console.log(`\n📦 Procesando lote ${batchIndex + 1}/${totalBatches} (imágenes ${startIndex + 1}-${endIndex})`);
      
      for (let i = 0; i < batch.length; i++) {
        const imageInfo = batch[i];
        const fileName = generateFileName(imageInfo.url, startIndex + i + 1);
        const filePath = path.join(CONFIG.DOWNLOAD_DIR, fileName);
        
        console.log(`📥 [${i + 1}/${batch.length}] Descargando: ${imageInfo.url}`);
        
        try {
          // Descargar imagen
          await downloadImage(imageInfo.url, filePath);
          console.log(`✅ Descargada: ${fileName}`);
          
          // Subir a Strapi
          console.log(`📤 Subiendo a Strapi: ${fileName}`);
          const uploadResult = await uploadImageToStrapi(filePath, imageInfo.url);
          console.log(`✅ Subida a Strapi: ID ${uploadResult.id}`);
          
          results.successful.push({
            originalUrl: imageInfo.url,
            fileName: fileName,
            strapiId: uploadResult.id,
            strapiUrl: uploadResult.url,
            isFeatured: imageInfo.isFeatured
          });
          results.summary.successful++;
          
          // Si es featured image, actualizar artículo
          if (imageInfo.isFeatured) {
            const featuredImage = imageData.featuredImages.find(fi => fi.url === imageInfo.url);
            if (featuredImage) {
              console.log(`🔗 Asociando a artículo: ${featuredImage.articleTitle}`);
              await updateArticleWithImage(featuredImage.articleSlug, uploadResult.id);
              console.log(`✅ Artículo actualizado: ${featuredImage.articleSlug}`);
            }
          }
          
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
        console.log(`⏳ Esperando 2 segundos antes del siguiente lote...`);
        await delay(2000);
      }
    }
    
    // Finalizar
    results.summary.endTime = new Date().toISOString();
    
    // Guardar resultados
    fs.writeFileSync('images-migration-results.json', JSON.stringify(results, null, 2));
    
    // Mostrar resumen final
    console.log('\n🎉 ¡Migración de imágenes completada!');
    console.log('='.repeat(50));
    console.log(`📊 Total de imágenes: ${results.summary.total}`);
    console.log(`✅ Migradas exitosamente: ${results.summary.successful}`);
    console.log(`❌ Fallidas: ${results.summary.failed}`);
    console.log(`📁 Imágenes descargadas en: ${CONFIG.DOWNLOAD_DIR}`);
    console.log(`📁 Resultados guardados en: images-migration-results.json`);
    
    if (results.failed.length > 0) {
      console.log('\n❌ Imágenes que fallaron:');
      results.failed.forEach(failed => {
        console.log(`   - ${failed.originalUrl}: ${failed.error}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error durante la migración de imágenes:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateImages().catch(console.error);
