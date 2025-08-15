#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';
import { GemArticleService } from '../src/lib/services/gemArticleService';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema';

// Cargar variables de entorno
dotenv.config();

async function testGem1Only() {
  console.log('🧪 Probando solo GEM 1...');
  
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });
    
    await client.connect();
    const trackingService = new ArticleTrackingService(client);
    const gemService = new GemArticleService('demo-key', trackingService);
    
    // Crear tracking
    const tracking = await trackingService.createTracking('Test GEM 1 Solo');
    console.log('✅ Tracking creado:', tracking.id);
    
    // Probar GEM 1
    console.log('🚀 Ejecutando GEM 1...');
    const gem1Result = await gemService['executeGem1']('Test GEM 1 Solo');
    console.log('✅ GEM 1 completado');
    console.log('📊 Resultado:', {
      title: gem1Result.title,
      sections: gem1Result.sections.length,
      targetLength: gem1Result.targetLength
    });
    
    // Guardar resultado
    await trackingService.updateGem1Result(tracking.id, gem1Result);
    console.log('✅ Resultado guardado en BD');
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Error en GEM 1:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
  }
}

testGem1Only();
