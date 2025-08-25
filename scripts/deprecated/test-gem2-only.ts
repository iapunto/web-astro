#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';
import { GemArticleService } from '../src/lib/services/gemArticleService';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema';

// Cargar variables de entorno
dotenv.config();

async function testGem2Only() {
  console.log('🧪 Probando solo GEM 2...');
  
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
    
    // Obtener secciones de la tabla article_sections
    const sectionsResult = await client.query(
      'SELECT * FROM article_sections WHERE gem1_result_id = $1 ORDER BY created_at',
      [gem1Data.id]
    );
    
    console.log('📊 Secciones encontradas:', sectionsResult.rows.length);
    
    // Reconstruir objeto Gem1Result
    const gem1ResultObj = {
      title: gem1Data.title,
      keywords: gem1Data.keywords,
      sections: sectionsResult.rows.map(row => ({
        id: row.section_id,
        title: row.title,
        description: row.description,
        keywords: row.keywords,
        targetLength: row.target_length,
      })),
      targetLength: gem1Data.target_length,
      seoMeta: gem1Data.seo_meta,
      createdAt: gem1Data.created_at,
    };
    
    console.log('📊 Secciones a investigar:', gem1ResultObj.sections.length);
    
    // Probar GEM 2
    console.log('🚀 Ejecutando GEM 2...');
    const gem2Results = await gemService['executeGem2'](gem1ResultObj);
    console.log('✅ GEM 2 completado');
    console.log('📊 Resultados:', gem2Results.length);
    
    // Guardar resultados
    for (const result of gem2Results) {
      await trackingService.updateGem2Result(trackingId, result);
    }
    console.log('✅ Resultados guardados en BD');
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Error en GEM 2:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
  }
}

testGem2Only();
