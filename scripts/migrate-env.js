#!/usr/bin/env node

/**
 * Script de migración con variables de entorno
 * Ejecutar con: node scripts/migrate-env.js
 */

import { config } from 'dotenv';
import fs from 'fs';

// Cargar variables de entorno desde .env si existe
config();

// Configuración
const CONFIG = {
  STRAPI_URL: process.env.STRAPI_URL || 'https://strapi.iapunto.com',
  STRAPI_TOKEN: process.env.STRAPI_API_TOKEN,
  BATCH_SIZE: 5,
  DELAY_BETWEEN_REQUESTS: 1000, // 1 segundo
  MAX_RETRIES: 3,
};

// Función para delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Función para hacer request a Strapi
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

    return await response.json();
  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.log(`🔄 Reintentando (${retryCount + 1}/${CONFIG.MAX_RETRIES}) para: ${articleData.title}`);
      await delay(2000);
      return createStrapiArticle(articleData, retryCount + 1);
    }
    throw error;
  }
}

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

// Función para mostrar ayuda de configuración
function showConfigHelp() {
  console.log('🔧 Configuración de variables de entorno:\n');
  console.log('Opción 1 - Variables de entorno del sistema:');
  console.log('  export STRAPI_URL="https://strapi.iapunto.com"');
  console.log('  export STRAPI_API_TOKEN="tu_token_aqui"');
  console.log('');
  console.log('Opción 2 - Archivo .env en la raíz del proyecto:');
  console.log('  Crear archivo .env con:');
  console.log('  STRAPI_URL=https://strapi.iapunto.com');
  console.log('  STRAPI_API_TOKEN=tu_token_aqui');
  console.log('');
  console.log('Opción 3 - Usar el script migrate-direct.js');
  console.log('  Editar directamente el archivo con tu token');
  console.log('');
}

// Función principal de migración
async function migrateArticles() {
  console.log('🚀 Iniciando migración con variables de entorno...\n');
  
  // Verificar configuración
  if (!CONFIG.STRAPI_TOKEN) {
    console.error('❌ Error: STRAPI_API_TOKEN no está configurado');
    console.log('');
    showConfigHelp();
    process.exit(1);
  }

  console.log(`🌐 Strapi URL: ${CONFIG.STRAPI_URL}`);
  console.log(`🔑 Token configurado: ${CONFIG.STRAPI_TOKEN.substring(0, 10)}...`);
  console.log('');

  try {
    // Obtener información del primer lote
    console.log('📚 Obteniendo información de artículos...');
    const firstBatch = await getArticlesFromLocalEndpoint(1, CONFIG.BATCH_SIZE);
    
    if (!firstBatch.success) {
      throw new Error('Error obteniendo datos del endpoint local');
    }

    const totalPages = firstBatch.data.pagination.totalPages;
    const totalPosts = firstBatch.data.pagination.totalPosts;
    
    console.log(`📊 Total de artículos: ${totalPosts}`);
    console.log(`📦 Total de lotes: ${totalPages}`);
    console.log(`📦 Tamaño de lote: ${CONFIG.BATCH_SIZE}\n`);

    const results = {
      successful: [],
      failed: [],
      summary: {
        total: totalPosts,
        successful: 0,
        failed: 0,
        startTime: new Date().toISOString(),
        endTime: null
      }
    };

    // Procesar cada lote
    for (let page = 1; page <= totalPages; page++) {
      console.log(`\n📦 Procesando lote ${page}/${totalPages}`);
      
      try {
        // Obtener artículos del lote actual
        const batchData = await getArticlesFromLocalEndpoint(page, CONFIG.BATCH_SIZE);
        
        if (!batchData.success) {
          throw new Error(`Error obteniendo lote ${page}`);
        }

        const articles = batchData.data.posts;
        console.log(`📝 Procesando ${articles.length} artículos...`);

        // Procesar cada artículo del lote
        for (let i = 0; i < articles.length; i++) {
          const article = articles[i];
          
          console.log(`📝 [${i + 1}/${articles.length}] Migrando: ${article.title}`);

          try {
            const result = await createStrapiArticle(article);
            console.log(`✅ Migrado: ${article.title}`);
            results.successful.push({
              title: article.title,
              slug: article.slug,
              strapiId: result.data?.id,
              migratedAt: new Date().toISOString()
            });
            results.summary.successful++;
          } catch (error) {
            console.log(`❌ Error: ${article.title} - ${error.message}`);
            results.failed.push({
              title: article.title,
              slug: article.slug,
              error: error.message,
              failedAt: new Date().toISOString()
            });
            results.summary.failed++;
          }

          // Delay entre requests
          if (i < articles.length - 1) {
            await delay(CONFIG.DELAY_BETWEEN_REQUESTS);
          }
        }

        console.log(`✅ Lote ${page} completado`);

        // Delay entre lotes
        if (page < totalPages) {
          console.log(`⏳ Esperando 2 segundos antes del siguiente lote...`);
          await delay(2000);
        }

      } catch (error) {
        console.error(`❌ Error procesando lote ${page}:`, error.message);
        results.failed.push({
          batch: page,
          error: error.message,
          failedAt: new Date().toISOString()
        });
        results.summary.failed++;
      }
    }

    // Finalizar
    results.summary.endTime = new Date().toISOString();
    
    // Guardar resultados
    fs.writeFileSync('migration-results.json', JSON.stringify(results, null, 2));

    // Mostrar resumen final
    console.log('\n🎉 ¡Migración completada!');
    console.log('='.repeat(50));
    console.log(`📊 Total de artículos: ${results.summary.total}`);
    console.log(`✅ Migrados exitosamente: ${results.summary.successful}`);
    console.log(`❌ Fallidos: ${results.summary.failed}`);
    console.log(`📁 Resultados guardados en: migration-results.json`);
    
    if (results.failed.length > 0) {
      console.log('\n❌ Artículos que fallaron:');
      results.failed.forEach(failed => {
        if (failed.title) {
          console.log(`   - ${failed.title}: ${failed.error}`);
        } else {
          console.log(`   - Lote ${failed.batch}: ${failed.error}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateArticles().catch(console.error);
