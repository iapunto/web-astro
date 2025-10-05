#!/usr/bin/env node

/**
 * Script para asociar una imagen a un artículo específico en Strapi
 * Ejecutar con: node scripts/associate-image-to-article.js
 */

// Configuración
const CONFIG = {
  STRAPI_URL: 'https://strapi.iapunto.com',
  STRAPI_TOKEN:
    'e901671364d5b2604b471991bda99a5db1d3d745bb51cd221f2380e53912416189ec085e8199968f6abd60885e5677027b36ba302e40ee5ac69878f0085c9e1cb5b185e13ac1e394a5bf2515725d1dd4e07af0e589546de51e3d16a5cf47afbb45cb943056598b2433e8af6b9c23795c031e14c06f193c568565de0e0ae5f629',
  // Datos de prueba
  ARTICLE_SLUG: 'google-gemini-ia-imagenes-mejora',
  IMAGE_ID: 14,
};

// Función para obtener artículo por slug
async function getArticleBySlug(slug) {
  console.log(`🔍 Buscando artículo con slug: ${slug}`);

  const response = await fetch(
    `${CONFIG.STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}`,
    {
      headers: {
        Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error obteniendo artículo: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (data.data.length === 0) {
    throw new Error(`Artículo no encontrado con slug: ${slug}`);
  }

  const article = data.data[0];
  console.log(`✅ Artículo encontrado:`);
  console.log(`   ID: ${article.id}`);
  console.log(`   Título: ${article.title || 'Sin título'}`);
  console.log(`   Slug: ${article.slug || 'Sin slug'}`);
  console.log(`   Cover actual: ${article.cover?.id || 'Ninguna'}`);

  return article;
}

// Función para verificar que la imagen existe
async function verifyImageExists(imageId) {
  console.log(`🔍 Verificando imagen con ID: ${imageId}`);

  const response = await fetch(
    `${CONFIG.STRAPI_URL}/api/upload/files/${imageId}`,
    {
      headers: {
        Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error obteniendo imagen: ${response.status} ${response.statusText}`
    );
  }

  const image = await response.json();
  console.log(`✅ Imagen encontrada:`);
  console.log(`   ID: ${image.id}`);
  console.log(`   Nombre: ${image.name}`);
  console.log(`   URL: ${image.url}`);
  console.log(`   Tamaño: ${image.size} bytes`);

  return image;
}

// Función para asociar imagen al artículo
async function associateImageToArticle(articleId, imageId) {
  console.log(`🔗 Asociando imagen ${imageId} al artículo ${articleId}`);

  const response = await fetch(
    `${CONFIG.STRAPI_URL}/api/articles/${articleId}`,
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
    throw new Error(
      `Error actualizando artículo: ${response.status} - ${errorText}`
    );
  }

  const result = await response.json();
  console.log(`✅ Artículo actualizado exitosamente`);

  return result;
}

// Función para verificar la asociación
async function verifyAssociation(articleSlug) {
  console.log(`🔍 Verificando asociación para: ${articleSlug}`);

  const article = await getArticleBySlug(articleSlug);

  if (article.cover?.id) {
    const coverImageId = article.cover.id;
    console.log(`✅ Artículo tiene cover image: ID ${coverImageId}`);

    if (coverImageId == CONFIG.IMAGE_ID) {
      console.log(
        `🎉 ¡Asociación correcta! La imagen ${CONFIG.IMAGE_ID} está asociada al artículo`
      );
      return true;
    } else {
      console.log(
        `⚠️  El artículo tiene una imagen diferente (ID: ${coverImageId})`
      );
      return false;
    }
  } else {
    console.log(`❌ El artículo no tiene cover image asociada`);
    return false;
  }
}

// Función principal
async function associateImageToArticleTest() {
  console.log('🧪 Probando asociación de imagen a artículo...\n');

  try {
    // 1. Verificar que la imagen existe
    await verifyImageExists(CONFIG.IMAGE_ID);
    console.log('');

    // 2. Obtener el artículo
    const article = await getArticleBySlug(CONFIG.ARTICLE_SLUG);
    console.log('');

    // 3. Verificar estado actual
    console.log('📋 Estado actual:');
    await verifyAssociation(CONFIG.ARTICLE_SLUG);
    console.log('');

    // 4. Asociar la imagen
    await associateImageToArticle(article.id, CONFIG.IMAGE_ID);
    console.log('');

    // 5. Verificar la asociación
    console.log('📋 Estado después de la asociación:');
    const isAssociated = await verifyAssociation(CONFIG.ARTICLE_SLUG);

    if (isAssociated) {
      console.log('\n🎉 ¡Asociación exitosa!');
      console.log(`📋 Resumen:`);
      console.log(`   Artículo: ${article.title || 'Sin título'}`);
      console.log(`   Slug: ${CONFIG.ARTICLE_SLUG}`);
      console.log(`   Imagen ID: ${CONFIG.IMAGE_ID}`);
      console.log(
        `   URL de imagen: https://strapi.iapunto.com/api/upload/files/${CONFIG.IMAGE_ID}`
      );

      console.log('\n📋 Instrucciones para verificar:');
      console.log('1. Ve a Strapi Admin → Content Manager → Articles');
      console.log(`2. Busca el artículo: "${article.title || 'Sin título'}"`);
      console.log(
        '3. Verifica que el campo "cover" muestre la imagen correcta'
      );
      console.log(
        '4. Haz clic en la imagen para verificar que se muestra correctamente'
      );
    } else {
      console.log('\n❌ La asociación no se completó correctamente');
    }
  } catch (error) {
    console.error('❌ Error durante la asociación:', error);
    process.exit(1);
  }
}

// Ejecutar prueba
associateImageToArticleTest().catch(console.error);
