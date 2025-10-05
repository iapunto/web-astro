#!/usr/bin/env node

/**
 * Script de prueba para subir una sola imagen a Strapi
 * Ejecutar con: node scripts/test-single-upload.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const CONFIG = {
  STRAPI_URL: 'https://strapi.iapunto.com',
  STRAPI_TOKEN:
    'e901671364d5b2604b471991bda99a5db1d3d745bb51cd221f2380e53912416189ec085e8199968f6abd60885e5677027b36ba302e40ee5ac69878f0085c9e1cb5b185e13ac1e394a5bf2515725d1dd4e07af0e589546de51e3d16a5cf47afbb45cb943056598b2433e8af6b9c23795c031e14c06f193c568565de0e0ae5f629',
  TEST_IMAGE_PATH: path.join(
    __dirname,
    '..',
    'downloaded-images',
    'image_001.png'
  ),
};

// Función para verificar que el archivo existe
function verifyFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo no encontrado: ${filePath}`);
  }

  const stats = fs.statSync(filePath);
  console.log(`📁 Archivo encontrado: ${path.basename(filePath)}`);
  console.log(`📊 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`📅 Modificado: ${stats.mtime.toISOString()}`);

  return true;
}

// Función para obtener información del archivo
function getFileInfo(filePath) {
  const buffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const mimeType = getMimeType(filePath);

  return {
    buffer,
    fileName,
    mimeType,
    size: buffer.length,
  };
}

// Función para determinar MIME type
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

// Función para subir imagen usando FormData nativo
async function uploadWithFormData(fileInfo) {
  console.log('\n🔄 Método 1: FormData nativo');

  const formData = new FormData();

  // Crear Blob con el tipo MIME correcto
  const blob = new Blob([fileInfo.buffer], { type: fileInfo.mimeType });
  formData.append('files', blob, fileInfo.fileName);

  console.log(`📤 Subiendo: ${fileInfo.fileName} (${fileInfo.mimeType})`);

  const response = await fetch(`${CONFIG.STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
      // NO incluir Content-Type, FormData lo maneja automáticamente
    },
    body: formData,
  });

  console.log(`📊 Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  console.log(`✅ Respuesta:`, JSON.stringify(result, null, 2));

  return result;
}

// Función para subir imagen usando multipart/form-data manual
async function uploadWithMultipart(fileInfo) {
  console.log('\n🔄 Método 2: multipart/form-data manual');

  const boundary = '----formdata-boundary-' + Math.random().toString(36);
  const CRLF = '\r\n';

  let body = '';

  // Agregar archivo
  body += `--${boundary}${CRLF}`;
  body += `Content-Disposition: form-data; name="files"; filename="${fileInfo.fileName}"${CRLF}`;
  body += `Content-Type: ${fileInfo.mimeType}${CRLF}`;
  body += CRLF;

  // Convertir a Buffer para agregar el contenido del archivo
  const headerBuffer = Buffer.from(body, 'utf8');
  const footerBuffer = Buffer.from(`${CRLF}--${boundary}--${CRLF}`, 'utf8');

  const fullBody = Buffer.concat([headerBuffer, fileInfo.buffer, footerBuffer]);

  console.log(`📤 Subiendo: ${fileInfo.fileName} (${fileInfo.mimeType})`);
  console.log(`📊 Tamaño total: ${fullBody.length} bytes`);

  const response = await fetch(`${CONFIG.STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CONFIG.STRAPI_TOKEN}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': fullBody.length.toString(),
    },
    body: fullBody,
  });

  console.log(`📊 Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  console.log(`✅ Respuesta:`, JSON.stringify(result, null, 2));

  return result;
}

// Función para verificar la imagen subida
async function verifyUploadedImage(uploadResult) {
  if (!uploadResult || !uploadResult[0]) {
    throw new Error('No se recibió resultado válido del upload');
  }

  const image = uploadResult[0];
  console.log('\n🔍 Verificando imagen subida:');
  console.log(`📋 ID: ${image.id}`);
  console.log(`📁 Nombre: ${image.name}`);
  console.log(`🔗 URL: ${image.url}`);
  console.log(`📊 Tamaño: ${image.size} bytes`);
  console.log(`📅 Creado: ${image.createdAt}`);

  // Intentar acceder a la imagen
  const imageUrl = `${CONFIG.STRAPI_URL}${image.url}`;
  console.log(`\n🌐 URL completa: ${imageUrl}`);

  try {
    const imageResponse = await fetch(imageUrl);
    console.log(
      `📊 Status de imagen: ${imageResponse.status} ${imageResponse.statusText}`
    );

    if (imageResponse.ok) {
      console.log(`✅ Imagen accesible: ${imageUrl}`);
      return { success: true, url: imageUrl, image };
    } else {
      console.log(`❌ Imagen no accesible: ${imageResponse.status}`);
      return { success: false, error: `HTTP ${imageResponse.status}` };
    }
  } catch (error) {
    console.log(`❌ Error accediendo a imagen: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Función principal
async function testSingleUpload() {
  console.log('🧪 Probando upload de una sola imagen a Strapi...\n');

  try {
    // Verificar archivo
    verifyFileExists(CONFIG.TEST_IMAGE_PATH);

    // Obtener información del archivo
    const fileInfo = getFileInfo(CONFIG.TEST_IMAGE_PATH);
    console.log(`\n📋 Información del archivo:`);
    console.log(`   Nombre: ${fileInfo.fileName}`);
    console.log(`   MIME Type: ${fileInfo.mimeType}`);
    console.log(`   Tamaño: ${fileInfo.size} bytes`);

    // Probar ambos métodos
    let uploadResult;

    try {
      uploadResult = await uploadWithFormData(fileInfo);
    } catch (error) {
      console.log(`❌ FormData falló: ${error.message}`);
      console.log('\n🔄 Intentando con multipart manual...');
      uploadResult = await uploadWithMultipart(fileInfo);
    }

    // Verificar resultado
    const verification = await verifyUploadedImage(uploadResult);

    if (verification.success) {
      console.log('\n🎉 ¡Upload exitoso!');
      console.log(`🔗 URL de la imagen: ${verification.url}`);
      console.log('\n📋 Instrucciones para verificar:');
      console.log('1. Abre la URL en tu navegador');
      console.log('2. Verifica que la imagen se muestre correctamente');
      console.log('3. Confirma que puedes ver la imagen en Strapi admin');
    } else {
      console.log('\n❌ Upload falló');
      console.log(`Error: ${verification.error}`);
    }
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    process.exit(1);
  }
}

// Ejecutar prueba
testSingleUpload().catch(console.error);
