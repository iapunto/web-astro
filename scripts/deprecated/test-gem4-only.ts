#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';
import { GemArticleService } from '../src/lib/services/gemArticleService';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema';

// Cargar variables de entorno
dotenv.config();

async function testGem4Only() {
  console.log('🧪 Probando solo GEM 4...');

  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });

    await client.connect();
    const trackingService = new ArticleTrackingService(client);
    const gemService = new GemArticleService('demo-key', trackingService);

    // Obtener el tracking existente
    const trackingId = '05569b9b-8142-4615-9d00-9cdc8a7e8d28';
    const tracking = await trackingService.getTracking(trackingId);

    if (!tracking) {
      throw new Error('Tracking no encontrado');
    }

    console.log('✅ Tracking encontrado:', tracking.id);

    // Obtener resultado de GEM 1
    const gem1Result = await client.query(
      'SELECT * FROM gem1_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1',
      [trackingId]
    );

    if (gem1Result.rows.length === 0) {
      throw new Error('No se encontró resultado de GEM 1');
    }

    const gem1Data = gem1Result.rows[0];
    console.log('✅ Datos de GEM 1 encontrados');

    // Obtener resultado de GEM 3
    const gem3Result = await client.query(
      'SELECT * FROM gem3_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1',
      [trackingId]
    );

    if (gem3Result.rows.length === 0) {
      throw new Error('No se encontró resultado de GEM 3');
    }

    const gem3Data = gem3Result.rows[0];
    console.log('✅ Datos de GEM 3 encontrados');
    console.log(
      '📊 Artículo generado:',
      gem3Data.full_article.substring(0, 200) + '...'
    );

    // Reconstruir objeto Gem1Result
    const gem1ResultObj = {
      title: gem1Data.title,
      keywords: gem1Data.keywords,
      sections: [],
      targetLength: gem1Data.target_length,
      seoMeta: gem1Data.seo_meta,
      createdAt: gem1Data.created_at,
    };

    // Probar GEM 4
    console.log('🚀 Ejecutando GEM 4...');
    const gem4Result = await gemService['executeGem4'](
      gem3Data.full_article,
      gem1ResultObj
    );
    console.log('✅ GEM 4 completado');
    console.log('📊 Validación pasada:', gem4Result.validationPassed);
    if (gem4Result.validationErrors && gem4Result.validationErrors.length > 0) {
      console.log('📊 Errores de validación:', gem4Result.validationErrors);
    }

    // Guardar resultado
    await trackingService.updateGem4Result(trackingId, gem4Result);
    console.log('✅ Resultado guardado en BD');

    await client.end();
  } catch (error) {
    console.error('❌ Error en GEM 4:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
  }
}

testGem4Only();
