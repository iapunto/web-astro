#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema.js';
import { GemArticleService } from '../src/lib/services/gemArticleService.js';

// Cargar variables de entorno
dotenv.config();

async function testGem5Only() {
  console.log('🧪 Probando solo GEM 5...');

  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });

    await client.connect();
    console.log('✅ Conectado a la base de datos');

    const trackingService = new ArticleTrackingService(client);
    const gemService = new GemArticleService('demo-key', trackingService);

    // Obtener el último artículo que esté en gem4_completed
    const result = await client.query(`
      SELECT id, topic, status 
      FROM articles_tracking 
      WHERE status = 'gem4_completed'
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      console.log('❌ No se encontraron artículos en gem4_completed');
      await client.end();
      return;
    }

    const tracking = result.rows[0];
    console.log(`✅ Tracking encontrado: ${tracking.id}`);
    console.log(`📝 Tema: ${tracking.topic}`);

    // Obtener datos de GEM 4
    const gem4Result = await client.query(
      `
      SELECT * FROM gem4_results 
      WHERE tracking_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `,
      [tracking.id]
    );

    if (gem4Result.rows.length === 0) {
      console.log('❌ No se encontraron datos de GEM 4');
      await client.end();
      return;
    }

    const gem4Data = gem4Result.rows[0];
    console.log('✅ Datos de GEM 4 encontrados');

    // Obtener datos de GEM 3 para el contenido del artículo
    const gem3Result = await client.query(
      `
      SELECT * FROM gem3_results 
      WHERE tracking_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `,
      [tracking.id]
    );

    if (gem3Result.rows.length === 0) {
      console.log('❌ No se encontraron datos de GEM 3');
      await client.end();
      return;
    }

    const gem3Data = gem3Result.rows[0];
    console.log('✅ Datos de GEM 3 encontrados');

    // Ejecutar GEM 5
    console.log('🖼️  Ejecutando GEM 5...');

    const gem5Result = await gemService['executeGem5'](
      gem3Data.full_article,
      gem4Data.frontmatter
    );

    console.log('✅ GEM 5 completado');
    console.log('🖼️  Imagen generada:', gem5Result.imageUrl);
    console.log('📝 Alt text:', gem5Result.imageAlt);

    // Guardar resultado en la base de datos
    await trackingService.updateGem5Result(tracking.id, gem5Result);
    console.log('✅ Resultado guardado en la base de datos');

    await client.end();
    console.log('🎉 ¡Prueba de GEM 5 completada exitosamente!');
  } catch (error) {
    console.error('❌ Error en GEM 5:', error);
    console.error(
      'Message:',
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      'Stack:',
      error instanceof Error ? error.stack : 'No stack available'
    );
  }
}

testGem5Only();
