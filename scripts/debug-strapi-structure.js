#!/usr/bin/env node

/**
 * Script para debuggear la estructura de datos de Strapi
 */

// Configuración
const CONFIG = {
  STRAPI_URL: 'https://strapi.iapunto.com',
  STRAPI_TOKEN:
    'e901671364d5b2604b471991bda99a5db1d3d745bb51cd221f2380e53912416189ec085e8199968f6abd60885e5677027b36ba302e40ee5ac69878f0085c9e1cb5b185e13ac1e394a5bf2515725d1dd4e07af0e589546de51e3d16a5cf47afbb45cb943056598b2433e8af6b9c23795c031e14c06f193c568565de0e0ae5f629',
  ARTICLE_SLUG: 'google-gemini-ia-imagenes-mejora',
};

async function debugStrapiStructure() {
  console.log('🔍 Debuggeando estructura de Strapi...\n');

  try {
    // 1. Buscar artículo por slug
    console.log('1. Buscando artículo por slug...');
    const articleResponse = await fetch(
      `${CONFIG.STRAPI_URL}/api/articles?filters[slug][$eq]=${CONFIG.ARTICLE_SLUG}`,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
        },
      }
    );

    console.log(`Status: ${articleResponse.status}`);
    const articleData = await articleResponse.json();
    console.log('Estructura completa del artículo:');
    console.log(JSON.stringify(articleData, null, 2));

    if (articleData.data && articleData.data.length > 0) {
      const article = articleData.data[0];
      console.log('\n📋 Artículo encontrado:');
      console.log(`ID: ${article.id}`);
      console.log('Estructura del artículo:');
      console.log(JSON.stringify(article, null, 2));
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 2. Buscar todos los artículos para ver la estructura
    console.log('2. Buscando todos los artículos...');
    const allArticlesResponse = await fetch(
      `${CONFIG.STRAPI_URL}/api/articles?pagination[limit]=1`,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
        },
      }
    );

    console.log(`Status: ${allArticlesResponse.status}`);
    const allArticlesData = await allArticlesResponse.json();
    console.log('Estructura de un artículo (primer resultado):');
    if (allArticlesData.data && allArticlesData.data.length > 0) {
      console.log(JSON.stringify(allArticlesData.data[0], null, 2));
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 3. Verificar endpoint de upload
    console.log('3. Verificando endpoint de upload...');
    const uploadResponse = await fetch(
      `${CONFIG.STRAPI_URL}/api/upload/files?pagination[limit]=1`,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
        },
      }
    );

    console.log(`Status: ${uploadResponse.status}`);
    const uploadData = await uploadResponse.json();
    console.log('Estructura de archivo de upload:');
    if (uploadData && uploadData.length > 0) {
      console.log(JSON.stringify(uploadData[0], null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugStrapiStructure().catch(console.error);
