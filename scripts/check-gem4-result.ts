#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';

// Cargar variables de entorno
dotenv.config();

async function checkGem4Result() {
  console.log('🔍 Verificando resultado de GEM 4...');

  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });

    await client.connect();

    // Obtener el último artículo en gem4_completed
    const trackingResult = await client.query(`
      SELECT id, topic, status
      FROM articles_tracking 
      WHERE status = 'gem4_completed'
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    if (trackingResult.rows.length === 0) {
      console.log('❌ No se encontraron artículos');
      return;
    }

    const tracking = trackingResult.rows[0];
    console.log('📊 Artículo:', tracking.topic);
    console.log('📊 Estado:', tracking.status);

    // Obtener resultado de GEM 4
    const gem4Result = await client.query(
      'SELECT * FROM gem4_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1',
      [tracking.id]
    );

    if (gem4Result.rows.length === 0) {
      console.log('❌ No se encontró resultado de GEM 4');
      return;
    }

    const gem4Data = gem4Result.rows[0];
    console.log('✅ Resultado de GEM 4 encontrado');
    console.log('📊 Validación pasada:', gem4Data.validation_passed);
    console.log('📊 Errores de validación:', gem4Data.validation_errors);

    // Mostrar frontmatter
    if (gem4Data.frontmatter) {
      console.log('\n📋 Frontmatter:');
      console.log(JSON.stringify(gem4Data.frontmatter, null, 2));
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error verificando GEM 4:', error);
  }
}

checkGem4Result();
