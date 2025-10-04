#!/usr/bin/env node

/**
 * Script de migración directo de artículos de Astro a Strapi
 * Ejecutar con: node scripts/migrate-to-strapi.js
 */

import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';

// Configuración
const CONFIG = {
  STRAPI_URL: process.env.STRAPI_URL || 'https://strapi.iapunto.com',
  STRAPI_TOKEN: process.env.STRAPI_API_TOKEN,
  BATCH_SIZE: 5, // Procesar de 5 en 5 para evitar timeouts
  DELAY_BETWEEN_BATCHES: 2000, // 2 segundos entre lotes
  DELAY_BETWEEN_REQUESTS: 500, // 500ms entre requests individuales
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo entre reintentos
  LOG_FILE: 'migration-log.json',
  RESULTS_FILE: 'migration-results.json'
};

// Función para normalizar fechas
function normalizeDate(dateString) {
  if (dateString instanceof Date) {
    return dateString;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn(`⚠️  Fecha inválida: ${dateString}, usando fecha actual`);
    return new Date();
  }
  return date;
}

// Función para hacer delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para hacer request a Strapi con retry
async function createStrapiArticle(articleData, retryCount = 0) {
  try {
    const response = await fetch(`${CONFIG.STRAPI_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.STRAPI_TOKEN}`
      },
      body: JSON.stringify({ data: articleData })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, data: result, error: null };
  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(`🔄 Reintentando (${retryCount + 1}/${CONFIG.MAX_RETRIES}) para: ${articleData.title}`);
      await delay(CONFIG.RETRY_DELAY);
      return createStrapiArticle(articleData, retryCount + 1);
    }
    return { success: false, data: null, error: error.message };
  }
}

// Función para procesar un artículo
function processArticle(post) {
  try {
    if (!post.data) {
      return null;
    }

    const pubDate = normalizeDate(post.data.pubDate);
    
    return {
      // Campos básicos
      title: post.data.title || 'Sin título',
      slug: post.data.slug || post.id,
      content: post.body || '',
      excerpt: post.data.description || '',
      publishedAt: pubDate.toISOString(),
      
      // SEO
      seo: {
        metaTitle: post.data.title || 'Sin título',
        metaDescription: post.data.description || '',
        keywords: Array.isArray(post.data.tags) ? post.data.tags.join(', ') : '',
      },
      
      // Imagen destacada
      featuredImage: {
        url: post.data.cover || '',
        alt: post.data.coverAlt || post.data.title || '',
      },
      
      // Autor
      author: {
        name: post.data.author?.name || 'IA Punto',
        bio: post.data.author?.description || '',
        avatar: post.data.author?.image || '',
      },
      
      // Categorización
      category: post.data.category || 'General',
      subcategory: post.data.subcategory || '',
      tags: Array.isArray(post.data.tags) ? post.data.tags : [],
      
      // Metadatos adicionales
      quote: post.data.quote || '',
      
      // Campos de migración
      migration: {
        source: 'astro-markdown',
        originalId: post.id,
        migratedAt: new Date().toISOString(),
      }
    };
  } catch (error) {
    console.error(`❌ Error procesando artículo ${post.id}:`, error);
    return null;
  }
}

// Función para cargar logs existentes
function loadLogs() {
  try {
    if (fs.existsSync(CONFIG.LOG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG.LOG_FILE, 'utf8'));
    }
  } catch (error) {
    console.warn('⚠️  No se pudo cargar el log existente:', error.message);
  }
  return {
    startTime: new Date().toISOString(),
    totalArticles: 0,
    processedArticles: 0,
    successfulArticles: 0,
    failedArticles: 0,
    batches: [],
    errors: []
  };
}

// Función para guardar logs
function saveLogs(logs) {
  try {
    fs.writeFileSync(CONFIG.LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('❌ Error guardando logs:', error);
  }
}

// Función para guardar resultados
function saveResults(results) {
  try {
    fs.writeFileSync(CONFIG.RESULTS_FILE, JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('❌ Error guardando resultados:', error);
  }
}

// Función principal de migración
async function migrateArticles() {
  console.log('🚀 Iniciando migración de artículos a Strapi...\n');
  
  // Verificar configuración
  if (!CONFIG.STRAPI_TOKEN) {
    console.error('❌ Error: STRAPI_API_TOKEN no está configurado');
    console.log('💡 Configura la variable de entorno: export STRAPI_API_TOKEN="tu_token"');
    process.exit(1);
  }

  // Cargar logs existentes
  const logs = loadLogs();
  logs.startTime = new Date().toISOString();
  
  try {
    // Obtener todos los posts
    console.log('📚 Obteniendo artículos de Astro...');
    const allPosts = await getCollection('blog');
    logs.totalArticles = allPosts.length;
    console.log(`📊 Total de artículos encontrados: ${allPosts.length}\n`);
    
    // Ordenar por fecha (más recientes primero)
    const sortedPosts = allPosts.sort((a, b) => {
      const dateA = normalizeDate(a.data.pubDate);
      const dateB = normalizeDate(b.data.pubDate);
      return dateB.getTime() - dateA.getTime();
    });

    // Procesar en lotes
    const totalBatches = Math.ceil(sortedPosts.length / CONFIG.BATCH_SIZE);
    console.log(`📦 Procesando en ${totalBatches} lotes de ${CONFIG.BATCH_SIZE} artículos cada uno\n`);

    const results = {
      successful: [],
      failed: [],
      summary: {
        total: allPosts.length,
        successful: 0,
        failed: 0,
        startTime: logs.startTime,
        endTime: null
      }
    };

    for (let i = 0; i < totalBatches; i++) {
      const startIndex = i * CONFIG.BATCH_SIZE;
      const endIndex = Math.min(startIndex + CONFIG.BATCH_SIZE, sortedPosts.length);
      const batch = sortedPosts.slice(startIndex, endIndex);
      
      console.log(`\n📦 Procesando lote ${i + 1}/${totalBatches} (artículos ${startIndex + 1}-${endIndex})`);
      
      const batchResults = {
        batchNumber: i + 1,
        startIndex,
        endIndex,
        articles: [],
        startTime: new Date().toISOString(),
        endTime: null
      };

      for (let j = 0; j < batch.length; j++) {
        const post = batch[j];
        const articleData = processArticle(post);
        
        if (!articleData) {
          console.log(`⚠️  Saltando artículo ${post.id} (datos inválidos)`);
          continue;
        }

        console.log(`📝 Migrando: ${articleData.title}`);
        
        const result = await createStrapiArticle(articleData);
        
        if (result.success) {
          console.log(`✅ Migrado exitosamente: ${articleData.title}`);
          results.successful.push({
            originalId: post.id,
            title: articleData.title,
            slug: articleData.slug,
            strapiId: result.data.data?.id,
            migratedAt: new Date().toISOString()
          });
          logs.successfulArticles++;
        } else {
          console.log(`❌ Error migrando: ${articleData.title} - ${result.error}`);
          results.failed.push({
            originalId: post.id,
            title: articleData.title,
            slug: articleData.slug,
            error: result.error,
            failedAt: new Date().toISOString()
          });
          logs.failedArticles++;
        }

        logs.processedArticles++;
        
        // Delay entre requests individuales
        if (j < batch.length - 1) {
          await delay(CONFIG.DELAY_BETWEEN_REQUESTS);
        }
      }

      batchResults.endTime = new Date().toISOString();
      logs.batches.push(batchResults);
      
      // Guardar progreso
      saveLogs(logs);
      saveResults(results);
      
      console.log(`✅ Lote ${i + 1} completado`);
      
      // Delay entre lotes
      if (i < totalBatches - 1) {
        console.log(`⏳ Esperando ${CONFIG.DELAY_BETWEEN_BATCHES}ms antes del siguiente lote...`);
        await delay(CONFIG.DELAY_BETWEEN_BATCHES);
      }
    }

    // Finalizar
    results.summary.endTime = new Date().toISOString();
    results.summary.successful = results.successful.length;
    results.summary.failed = results.failed.length;
    
    logs.endTime = new Date().toISOString();
    
    saveLogs(logs);
    saveResults(results);

    // Mostrar resumen final
    console.log('\n🎉 ¡Migración completada!');
    console.log('='.repeat(50));
    console.log(`📊 Total de artículos: ${results.summary.total}`);
    console.log(`✅ Migrados exitosamente: ${results.summary.successful}`);
    console.log(`❌ Fallidos: ${results.summary.failed}`);
    console.log(`📁 Logs guardados en: ${CONFIG.LOG_FILE}`);
    console.log(`📁 Resultados guardados en: ${CONFIG.RESULTS_FILE}`);
    
    if (results.failed.length > 0) {
      console.log('\n❌ Artículos que fallaron:');
      results.failed.forEach(failed => {
        console.log(`   - ${failed.title}: ${failed.error}`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    logs.errors.push({
      error: error.message,
      timestamp: new Date().toISOString()
    });
    saveLogs(logs);
    process.exit(1);
  }
}

// Ejecutar migración
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateArticles().catch(console.error);
}

export { migrateArticles, CONFIG };
