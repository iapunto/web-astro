#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';

console.log('🔧 Actualizando URL de base de datos a URL pública...');

async function updateDatabaseUrl() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    
    // Leer el archivo .env
    console.log('📋 Leyendo archivo .env...');
    const envContent = await fs.readFile(envPath, 'utf-8');
    
    // Reemplazar la URL interna por la URL pública
    const updatedContent = envContent.replace(
      /DATABASE_URL="postgresql:\/\/postgres:[^@]+@postgres\.railway\.internal:\d+\/railway"/,
      'DATABASE_URL="postgresql://postgres:FmpxzJRFZxHhRqcNKUaoEPxqkUuoIBqM@yamabiko.proxy.rlwy.net:53944/railway"'
    );
    
    // Escribir el archivo actualizado
    console.log('📝 Actualizando archivo .env...');
    await fs.writeFile(envPath, updatedContent);
    
    console.log('✅ URL de base de datos actualizada a URL pública');
    console.log('   Nueva URL: postgresql://postgres:***@yamabiko.proxy.rlwy.net:53944/railway');
    
  } catch (error) {
    console.error('❌ Error actualizando URL de base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  updateDatabaseUrl().catch(console.error);
}

export { updateDatabaseUrl };
