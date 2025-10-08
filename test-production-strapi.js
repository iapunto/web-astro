#!/usr/bin/env node

const STRAPI_API_URL = 'https://strapi.iapunto.com';
const STRAPI_API_TOKEN = '5fac4193c9c1c74f70d42541071be45f0331b101ab66524a078aa27eb054ec80d6aa98c4650f8d03f48f9e272c64490acc60b3125f9999c3cb3f84b5e54b7e34b6dbc65c08967e0686ecf91a686516a04bc89788cf3d01580f3fc519b32ef21a47628ad4f5a10cc1e688e4af313c970a4239167a7d609b78215699987c2811fa';

async function testProductionStrapi() {
  console.log('🔍 Probando Strapi desde producción...');
  console.log(`URL: ${STRAPI_API_URL}`);
  console.log(`Token: ${STRAPI_API_TOKEN.substring(0, 20)}...`);
  console.log('');

  // Test 1: Verificar que Strapi responde
  console.log('1️⃣ Verificando que Strapi responde...');
  try {
    const response = await fetch(`${STRAPI_API_URL}/api/articles?pagination[pageSize]=1`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Strapi responde correctamente`);
      console.log(`   📊 Estructura de datos:`);
      console.log(`   - data: ${Array.isArray(data.data) ? 'array' : typeof data.data}`);
      console.log(`   - data.length: ${data.data?.length || 'undefined'}`);
      
      if (data.data && data.data.length > 0) {
        const article = data.data[0];
        console.log(`   - primer artículo:`);
        console.log(`     * id: ${article.id}`);
        console.log(`     * title: ${article.title || 'NO ENCONTRADO'}`);
        console.log(`     * slug: ${article.slug || 'NO ENCONTRADO'}`);
        console.log(`     * author: ${article.author?.name || 'NO ENCONTRADO'}`);
        console.log(`     * category: ${article.category?.name || 'NO ENCONTRADO'}`);
        
        // Verificar si los campos están en attributes (v4) o directamente (v5)
        if (article.attributes) {
          console.log(`   ⚠️  ESTRUCTURA V4 DETECTADA: campos en 'attributes'`);
        } else {
          console.log(`   ✅ ESTRUCTURA V5 DETECTADA: campos directamente`);
        }
      }
      
      // Verificar paginación
      if (data.meta?.pagination) {
        console.log(`   📈 Paginación:`);
        console.log(`     * total: ${data.meta.pagination.total}`);
        console.log(`     * pageCount: ${data.meta.pagination.pageCount}`);
      }
    } else {
      const errorText = await response.text();
      console.log(`   ❌ Error: ${response.status} ${response.statusText}`);
      console.log(`   Error details: ${errorText}`);
    }
  } catch (error) {
    console.log(`   ❌ Error de conexión: ${error.message}`);
  }

  console.log('');

  // Test 2: Probar endpoint completo con paginación
  console.log('2️⃣ Probando endpoint completo...');
  try {
    const response = await fetch(`${STRAPI_API_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[pageSize]=5`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Endpoint completo funciona`);
      console.log(`   📊 Artículos obtenidos: ${data.data?.length || 0}`);
      
      if (data.meta?.pagination) {
        console.log(`   📈 Total de artículos: ${data.meta.pagination.total}`);
      }
    } else {
      console.log(`   ❌ Error en endpoint completo: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('');

  // Test 3: Verificar categorías
  console.log('3️⃣ Verificando categorías...');
  try {
    const response = await fetch(`${STRAPI_API_URL}/api/categories?populate=*`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Categorías: ${data.data?.length || 0} encontradas`);
      
      if (data.data && data.data.length > 0) {
        data.data.forEach((cat, index) => {
          console.log(`     ${index + 1}. ${cat.name} (${cat.slug})`);
        });
      }
    } else {
      console.log(`   ❌ Error en categorías: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

testProductionStrapi().catch(console.error);
