#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema';

// Cargar variables de entorno
dotenv.config();

async function checkArticleStatus(articleId: string) {
  console.log(`🔍 Verificando estado del artículo: ${articleId}`);
  
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });
    
    await client.connect();
    const trackingService = new ArticleTrackingService(client);
    
    const tracking = await trackingService.getTracking(articleId);
    
    if (tracking) {
      console.log('📊 Estado del artículo:');
      console.log('   ID:', tracking.id);
      console.log('   Tema:', tracking.topic);
      console.log('   Estado:', tracking.status);
      console.log('   Creado:', tracking.created_at);
      console.log('   Actualizado:', tracking.updated_at);
      
      if (tracking.error) {
        console.log('   Error:', tracking.error);
      }
      
      // Verificar resultados de GEMs
      console.log('\n🔍 Verificando resultados de GEMs...');
      
      try {
        const gem1Result = await client.query('SELECT * FROM gem1_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1', [articleId]);
        if (gem1Result.rows.length > 0) {
          console.log('   GEM 1: ✅ Completado');
        } else {
          console.log('   GEM 1: ❌ No completado');
        }
        
        const gem2Result = await client.query('SELECT * FROM gem2_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1', [articleId]);
        if (gem2Result.rows.length > 0) {
          console.log('   GEM 2: ✅ Completado');
        } else {
          console.log('   GEM 2: ❌ No completado');
        }
        
        const gem3Result = await client.query('SELECT * FROM gem3_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1', [articleId]);
        if (gem3Result.rows.length > 0) {
          console.log('   GEM 3: ✅ Completado');
        } else {
          console.log('   GEM 3: ❌ No completado');
        }
        
        const gem4Result = await client.query('SELECT * FROM gem4_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1', [articleId]);
        if (gem4Result.rows.length > 0) {
          console.log('   GEM 4: ✅ Completado');
        } else {
          console.log('   GEM 4: ❌ No completado');
        }
        
      } catch (error) {
        console.log('   Error verificando GEMs:', error.message);
      }
      
      if (tracking.published_url) {
        console.log('   URL publicada:', tracking.published_url);
      }
      
    } else {
      console.log('❌ Artículo no encontrado');
    }
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Error verificando estado:', error);
  }
}

// Usar el último articleId de las pruebas
const articleId = process.argv[2] || 'fc9ed838-c0d8-4381-b112-c4be2d5bc4c4';
checkArticleStatus(articleId);
