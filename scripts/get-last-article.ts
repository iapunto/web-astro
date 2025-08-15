#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';

// Cargar variables de entorno
dotenv.config();

async function getLastArticle() {
  console.log('🔍 Obteniendo último artículo...');
  
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });
    
    await client.connect();
    
    // Obtener los últimos 5 artículos
    const result = await client.query(`
      SELECT id, topic, status, created_at, updated_at, error
      FROM articles_tracking 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('📊 Últimos 5 artículos:');
    result.rows.forEach((article, index) => {
      console.log(`\n${index + 1}. Artículo:`);
      console.log('   ID:', article.id);
      console.log('   Tema:', article.topic);
      console.log('   Estado:', article.status);
      console.log('   Creado:', article.created_at);
      console.log('   Actualizado:', article.updated_at);
      if (article.error) {
        console.log('   Error:', article.error);
      }
    });
    
    if (result.rows.length === 0) {
      console.log('❌ No se encontraron artículos');
    }
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Error obteniendo último artículo:', error);
  }
}

getLastArticle();
