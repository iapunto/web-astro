#!/usr/bin/env node

/**
 * Script para probar diferentes endpoints de actualización en Strapi v5
 */

// Configuración
const CONFIG = {
  STRAPI_URL: 'https://strapi.iapunto.com',
  STRAPI_TOKEN:
    'e901671364d5b2604b471991bda99a5db1d3d745bb51cd221f2380e53912416189ec085e8199968f6abd60885e5677027b36ba302e40ee5ac69878f0085c9e1cb5b185e13ac1e394a5bf2515725d1dd4e07af0e589546de51e3d16a5cf47afbb45cb943056598b2433e8af6b9c23795c031e14c06f193c568565de0e0ae5f629',
  ARTICLE_ID: 2,
  IMAGE_ID: 14,
};

async function testUpdateEndpoints() {
  console.log('🧪 Probando diferentes endpoints de actualización...\n');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
  };

  const updateData = {
    data: {
      cover: CONFIG.IMAGE_ID,
    },
  };

  // Endpoint 1: /api/articles/{id}
  console.log('1. Probando /api/articles/{id}...');
  try {
    const response1 = await fetch(
      `${CONFIG.STRAPI_URL}/api/articles/${CONFIG.ARTICLE_ID}`,
      {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updateData),
      }
    );

    console.log(`   Status: ${response1.status} ${response1.statusText}`);
    if (!response1.ok) {
      const errorText = await response1.text();
      console.log(`   Error: ${errorText}`);
    } else {
      const result = await response1.json();
      console.log(`   ✅ Éxito:`, JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  // Endpoint 2: /api/articles/{id} con PATCH
  console.log('2. Probando /api/articles/{id} con PATCH...');
  try {
    const response2 = await fetch(
      `${CONFIG.STRAPI_URL}/api/articles/${CONFIG.ARTICLE_ID}`,
      {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(updateData),
      }
    );

    console.log(`   Status: ${response2.status} ${response2.statusText}`);
    if (!response2.ok) {
      const errorText = await response2.text();
      console.log(`   Error: ${errorText}`);
    } else {
      const result = await response2.json();
      console.log(`   ✅ Éxito:`, JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  // Endpoint 3: /api/articles/{id} con documentId
  console.log('3. Probando con documentId...');
  try {
    // Primero obtener el documentId
    const getResponse = await fetch(
      `${CONFIG.STRAPI_URL}/api/articles/${CONFIG.ARTICLE_ID}`,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
        },
      }
    );

    if (getResponse.ok) {
      const article = await getResponse.json();
      const documentId = article.data.documentId;
      console.log(`   DocumentId: ${documentId}`);

      const response3 = await fetch(
        `${CONFIG.STRAPI_URL}/api/articles/${documentId}`,
        {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(updateData),
        }
      );

      console.log(`   Status: ${response3.status} ${response3.statusText}`);
      if (!response3.ok) {
        const errorText = await response3.text();
        console.log(`   Error: ${errorText}`);
      } else {
        const result = await response3.json();
        console.log(`   ✅ Éxito:`, JSON.stringify(result, null, 2));
      }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  // Endpoint 4: Verificar estructura del campo cover
  console.log('4. Verificando estructura del campo cover...');
  try {
    const response4 = await fetch(
      `${CONFIG.STRAPI_URL}/api/articles/${CONFIG.ARTICLE_ID}`,
      {
        headers: {
          Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
        },
      }
    );

    if (response4.ok) {
      const article = await response4.json();
      console.log('   Estructura actual del artículo:');
      console.log('   Campos disponibles:', Object.keys(article.data));
      console.log('   ¿Tiene campo cover?', 'cover' in article.data);
      if (article.data.cover) {
        console.log(
          '   Cover actual:',
          JSON.stringify(article.data.cover, null, 2)
        );
      }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

testUpdateEndpoints().catch(console.error);
