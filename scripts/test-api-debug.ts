#!/usr/bin/env tsx

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function testAPIDebug() {
  console.log('🔍 Debug de API de creación de artículos...');
  console.log('📋 Variables de entorno:');
  console.log(
    '   DATABASE_PUBLIC_URL:',
    process.env.DATABASE_PUBLIC_URL ? '✅ Configurada' : '❌ NO CONFIGURADA'
  );
  console.log(
    '   GEMINI_API_KEY:',
    process.env.GEMINI_API_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA'
  );

  try {
    console.log('\n📡 Enviando petición a la API...');
    const response = await fetch(
      'http://localhost:4321/api/articles/create-automatic',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: 'Test de Debug API',
          apiKey: 'demo-key',
        }),
      }
    );

    console.log('📊 Respuesta recibida:');
    console.log('   Status:', response.status);
    console.log('   Status Text:', response.statusText);
    console.log('   Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('   Body:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('✅ API funcionando correctamente');
      console.log('   Article ID:', data.articleId);
    } else {
      console.log('❌ API retornó error:');
      console.log('   Error:', data.error);
      console.log('   Timestamp:', data.timestamp);
    }
  } catch (error) {
    console.error('❌ Error en la petición:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
  }
}

testAPIDebug();
