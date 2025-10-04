#!/usr/bin/env node

/**
 * Script de configuración para migración
 * Ejecutar con: node scripts/setup-migration.js
 */

import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupMigration() {
  console.log('🔧 Configuración de migración a Strapi\n');
  
  try {
    // Solicitar configuración
    const strapiUrl = await question('🌐 URL de tu Strapi (ej: https://strapi.iapunto.com): ');
    const strapiToken = await question('🔑 Token de API de Strapi: ');
    
    // Crear archivo de configuración
    const config = {
      STRAPI_URL: strapiUrl,
      STRAPI_TOKEN: strapiToken,
      BATCH_SIZE: 5,
      DELAY_BETWEEN_REQUESTS: 1000,
      MAX_RETRIES: 3
    };
    
    fs.writeFileSync('migration-config.json', JSON.stringify(config, null, 2));
    
    // Crear archivo .env
    const envContent = `STRAPI_URL=${strapiUrl}
STRAPI_API_TOKEN=${strapiToken}`;
    
    fs.writeFileSync('.env.migration', envContent);
    
    console.log('\n✅ Configuración completada!');
    console.log('📁 Archivos creados:');
    console.log('   - migration-config.json');
    console.log('   - .env.migration');
    console.log('\n🚀 Ahora puedes ejecutar la migración:');
    console.log('   node scripts/migrate-astro.js');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
  } finally {
    rl.close();
  }
}

setupMigration();
