#!/usr/bin/env node

const STRAPI_API_URL = 'https://strapi.iapunto.com';
const STRAPI_API_TOKEN = '5fac4193c9c1c74f70d42541071be45f0331b101ab66524a078aa27eb054ec80d6aa98c4650f8d03f48f9e272c64490acc60b3125f9999c3cb3f84b5e54b7e34b6dbc65c08967e0686ecf91a686516a04bc89788cf3d01580f3fc519b32ef21a47628ad4f5a10cc1e688e4af313c970a4239167a7d609b78215699987c2811fa';

async function debugAuthorStructure() {
  console.log('🔍 Analizando estructura del autor...');
  
  try {
    const response = await fetch(`${STRAPI_API_URL}/api/articles?populate=*&pagination[pageSize]=1`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`❌ Error: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const article = data.data[0];
      
      console.log('\n📄 Estructura completa del artículo:');
      console.log(`- id: ${article.id}`);
      console.log(`- title: ${article.title}`);
      console.log(`- slug: ${article.slug}`);
      
      console.log('\n👤 Estructura del autor:');
      console.log(`- article.author: ${JSON.stringify(article.author, null, 2)}`);
      
      if (article.author) {
        console.log(`- author.name: ${article.author.name || 'NO ENCONTRADO'}`);
        console.log(`- author.email: ${article.author.email || 'NO ENCONTRADO'}`);
        console.log(`- author.avatar: ${article.author.avatar || 'NO ENCONTRADO'}`);
        console.log(`- author.description: ${article.author.description || 'NO ENCONTRADO'}`);
      }
      
      console.log('\n📂 Estructura de la categoría:');
      console.log(`- article.category: ${JSON.stringify(article.category, null, 2)}`);
      
      if (article.category) {
        console.log(`- category.name: ${article.category.name || 'NO ENCONTRADO'}`);
        console.log(`- category.slug: ${article.category.slug || 'NO ENCONTRADO'}`);
      }
      
      console.log('\n🖼️ Estructura de la imagen:');
      console.log(`- article.cover: ${JSON.stringify(article.cover, null, 2)}`);
      
      if (article.cover) {
        console.log(`- cover.url: ${article.cover.url || 'NO ENCONTRADO'}`);
        console.log(`- cover.formats: ${article.cover.formats ? 'PRESENTE' : 'NO ENCONTRADO'}`);
      }
      
    } else {
      console.log('❌ No hay artículos en la respuesta');
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

debugAuthorStructure().catch(console.error);
