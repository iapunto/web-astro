#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

async function checkAvailableArticles() {
  console.log('🔍 Verificando artículos disponibles...');
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Verificar artículos por estado
    const result = await client.query(`
      SELECT status, COUNT(*) as count
      FROM articles_tracking
      GROUP BY status
      ORDER BY count DESC
    `);

    console.log('\n📊 Distribución de artículos por estado:');
    result.rows.forEach(row => {
      console.log(`  ${row.status}: ${row.count} artículos`);
    });

    // Verificar artículos en gem4_completed
    const gem4Result = await client.query(`
      SELECT id, topic, status, created_at
      FROM articles_tracking
      WHERE status = 'gem4_completed'
      ORDER BY created_at DESC
      LIMIT 3
    `);

    if (gem4Result.rows.length > 0) {
      console.log('\n✅ Artículos listos para GEM 5:');
      gem4Result.rows.forEach(row => {
        console.log(`  ID: ${row.id}`);
        console.log(`  Tema: ${row.topic}`);
        console.log(`  Creado: ${row.created_at}`);
        console.log('');
      });
    } else {
      console.log('\n❌ No hay artículos en estado gem4_completed');
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAvailableArticles();
