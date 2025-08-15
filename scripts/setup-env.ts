#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';

console.log('🔧 Configurando variables de entorno para automatización...');

async function setupEnvironment() {
  try {
    const envExamplePath = path.join(process.cwd(), 'env.automation.example');
    const envPath = path.join(process.cwd(), '.env');
    
    // Verificar si ya existe .env
    try {
      await fs.access(envPath);
      console.log('⚠️  El archivo .env ya existe. ¿Deseas sobrescribirlo? (y/N)');
      const answer = process.stdin.read();
      if (answer?.toString().toLowerCase() !== 'y') {
        console.log('❌ Configuración cancelada');
        return;
      }
    } catch {
      // El archivo no existe, continuar
    }

    // Leer el archivo de ejemplo
    console.log('📋 Leyendo archivo de ejemplo...');
    const envExample = await fs.readFile(envExamplePath, 'utf-8');
    
    // Crear el archivo .env
    console.log('📝 Creando archivo .env...');
    await fs.writeFile(envPath, envExample);
    
    console.log('✅ Archivo .env creado exitosamente');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('   1. Edita el archivo .env y configura tu API key de Gemini');
    console.log('   2. Ejecuta: pnpm railway:setup');
    console.log('   3. Ejecuta: pnpm dashboard:test');
    console.log('');
    console.log('🔑 Para obtener tu API key de Gemini:');
    console.log('   https://makersuite.google.com/app/apikey');
    
  } catch (error) {
    console.error('❌ Error configurando variables de entorno:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  setupEnvironment().catch(console.error);
}

export { setupEnvironment };
