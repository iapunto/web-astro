#!/usr/bin/env node

/**
 * Script simple de migración directo a Strapi
 * Uso: node scripts/migrate-simple.js
 */

import { getCollection } from 'astro:content';
import fs from 'fs';

// Configuración - MODIFICA ESTOS VALORES
const STRAPI_URL = 'https://strapi.iapunto.com'; // URL de tu Strapi
const STRAPI_TOKEN = 'TU_TOKEN_AQUI'; // Token de API de Strapi

// Función para delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para normalizar fechas
function normalizeDate(dateString) {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
}

// Función para crear artículo en Strapi
async function createArticle(articleData) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify({ data: articleData })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error creando artículo: ${error.message}`);
  }
}

// Función principal
async function migrate() {
  console.log('🚀 Iniciando migración simple a Strapi...\n');

  // Verificar token
  if (STRAPI_TOKEN === 'TU_TOKEN_AQUI') {
    console.error('❌ Error: Debes configurar tu token de Strapi en el script');
    console.log('💡 Edita el archivo y cambia STRAPI_TOKEN por tu token real');
    process.exit(1);
  }

  try {
    // Obtener artículos
    console.log('📚 Obteniendo artículos...');
    const posts = await getCollection('blog');
    console.log(`📊 Encontrados ${posts.length} artículos\n`);

    const results = {
      successful: [],
      failed: [],
      total: posts.length
    };

    // Procesar cada artículo
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      if (!post.data) {
        console.log(`⚠️  Saltando ${post.id} (sin datos)`);
        continue;
      }

      const pubDate = normalizeDate(post.data.pubDate);
      
      const articleData = {
        title: post.data.title || 'Sin título',
        slug: post.data.slug || post.id,
        content: post.body || '',
        excerpt: post.data.description || '',
        publishedAt: pubDate.toISOString(),
        seo: {
          metaTitle: post.data.title || 'Sin título',
          metaDescription: post.data.description || '',
          keywords: Array.isArray(post.data.tags) ? post.data.tags.join(', ') : '',
        },
        featuredImage: {
          url: post.data.cover || '',
          alt: post.data.coverAlt || post.data.title || '',
        },
        author: {
          name: post.data.author?.name || 'IA Punto',
          bio: post.data.author?.description || '',
          avatar: post.data.author?.image || '',
        },
        category: post.data.category || 'General',
        subcategory: post.data.subcategory || '',
        tags: Array.isArray(post.data.tags) ? post.data.tags : [],
        quote: post.data.quote || '',
        migration: {
          source: 'astro-markdown',
          originalId: post.id,
          migratedAt: new Date().toISOString(),
        }
      };

      console.log(`📝 [${i + 1}/${posts.length}] Migrando: ${articleData.title}`);

      try {
        const result = await createArticle(articleData);
        console.log(`✅ Migrado: ${articleData.title}`);
        results.successful.push({
          title: articleData.title,
          slug: articleData.slug,
          strapiId: result.data?.id
        });
      } catch (error) {
        console.log(`❌ Error: ${articleData.title} - ${error.message}`);
        results.failed.push({
          title: articleData.title,
          slug: articleData.slug,
          error: error.message
        });
      }

      // Delay entre requests
      if (i < posts.length - 1) {
        await delay(1000); // 1 segundo entre requests
      }
    }

    // Guardar resultados
    fs.writeFileSync('migration-results.json', JSON.stringify(results, null, 2));

    // Mostrar resumen
    console.log('\n🎉 ¡Migración completada!');
    console.log('='.repeat(40));
    console.log(`📊 Total: ${results.total}`);
    console.log(`✅ Exitosos: ${results.successful.length}`);
    console.log(`❌ Fallidos: ${results.failed.length}`);
    console.log(`📁 Resultados guardados en: migration-results.json`);

    if (results.failed.length > 0) {
      console.log('\n❌ Artículos que fallaron:');
      results.failed.forEach(failed => {
        console.log(`   - ${failed.title}: ${failed.error}`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar
migrate().catch(console.error);
