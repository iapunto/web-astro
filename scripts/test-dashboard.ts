#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

console.log('🚀 Probando Dashboard de Automatización');
console.log('='.repeat(50));

// Verificar configuración
async function checkConfiguration() {
  console.log('🔧 Verificando configuración...');

  // Verificar archivo .env
  const envPath = path.join(process.cwd(), '.env');
  try {
    await fs.access(envPath);
    console.log('✅ Archivo .env encontrado');
  } catch {
    console.log('⚠️  Archivo .env no encontrado');
    console.log('   Ejecuta: pnpm env:setup');
    return false;
  }

  // Verificar variables de entorno
  const requiredVars = ['GEMINI_API_KEY', 'DATABASE_PUBLIC_URL'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.log('⚠️  Variables de entorno faltantes:', missingVars.join(', '));
    console.log(
      '   Asegúrate de que el archivo .env esté configurado correctamente'
    );
    return false;
  }

  console.log('✅ Configuración verificada');
  return true;
}

try {
  // Verificar configuración
  const configOk = await checkConfiguration();
  if (!configOk) {
    console.log(
      '\n❌ Configuración incompleta. Por favor, configura las variables de entorno.'
    );
    process.exit(1);
  }

  // Verificar que el servidor esté corriendo
  console.log('📋 Verificando servidor...');
  const response = await fetch(
    'http://localhost:4321/api/articles/create-automatic',
    {
      method: 'GET',
    }
  );

  if (response.ok) {
    console.log('✅ Servidor funcionando correctamente');
  } else {
    console.log('⚠️  Servidor respondió con estado:', response.status);
  }

  // Probar creación de artículo
  console.log('\n📝 Probando creación de artículo...');
  const createResponse = await fetch(
    'http://localhost:4321/api/articles/create-automatic',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'Estrategias de marketing digital para 2025',
        apiKey: 'demo-key',
      }),
    }
  );

  if (createResponse.ok) {
    const result = await createResponse.json();
    console.log('✅ Artículo creado exitosamente');
    console.log('   ID:', result.articleId);
    console.log('   Mensaje:', result.message);

    // Probar SSE
    if (result.articleId) {
      console.log('\n📡 Probando SSE...');
      console.log(
        '   URL:',
        `http://localhost:4321/api/articles/status/${result.articleId}`
      );
      console.log(
        '   Puedes abrir esta URL en el navegador para ver los eventos SSE'
      );
    }
  } else {
    const error = await createResponse.text();
    console.log('❌ Error creando artículo:', error);
  }

  // Verificar dashboard
  console.log('\n🌐 Verificando dashboard...');
  const dashboardResponse = await fetch(
    'http://localhost:4321/automation-dashboard'
  );

  if (dashboardResponse.ok) {
    console.log('✅ Dashboard accesible');
    console.log('   URL: http://localhost:4321/automation-dashboard');
  } else {
    console.log('❌ Error accediendo al dashboard:', dashboardResponse.status);
  }

  console.log('\n🎉 Pruebas completadas');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Abre http://localhost:4321/automation-dashboard');
  console.log('   2. Introduce un tema y observa el proceso en tiempo real');
  console.log('   3. Verifica los logs y el progreso de las GEMs');
} catch (error) {
  console.error('❌ Error en las pruebas:', error);
  console.log('\n💡 Asegúrate de que:');
  console.log('   - El servidor esté corriendo (pnpm dev)');
  console.log('   - La base de datos esté configurada (pnpm railway:setup)');
  console.log(
    '   - Las variables de entorno estén configuradas (pnpm env:setup)'
  );
}
