#!/usr/bin/env tsx

import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function testAPI() {
  console.log('🧪 Probando API de creación de artículos...');
  
  try {
    const response = await fetch('http://localhost:4321/api/articles/create-automatic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'Test de API Simple',
        apiKey: 'demo-key'
      })
    });

    const data = await response.json();
    
    console.log('📊 Respuesta de la API:');
    console.log('   Status:', response.status);
    console.log('   Success:', data.success);
    
    if (data.success) {
      console.log('   Article ID:', data.articleId);
      console.log('   Message:', data.message);
    } else {
      console.log('   Error:', data.error);
      console.log('   Timestamp:', data.timestamp);
    }
    
  } catch (error) {
    console.error('❌ Error en la petición:', error);
  }
}

testAPI();
