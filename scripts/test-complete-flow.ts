#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';
import { GemArticleService } from '../src/lib/services/gemArticleService';
import { ArticlePublisherService } from '../src/lib/services/articlePublisherService';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema';

// Cargar variables de entorno
dotenv.config();

async function testCompleteFlow() {
  console.log('🧪 Probando flujo completo de creación de artículos...');

  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });

    await client.connect();
    const trackingService = new ArticleTrackingService(client);
    const gemService = new GemArticleService('demo-key', trackingService);
    const publisherService = new ArticlePublisherService();

    const topic = 'Test Flujo Completo - Automatización de Contenido';

    console.log(`🚀 Iniciando creación de artículo:`);
    console.log(`   📝 Tema: ${topic}`);
    console.log(`   ⏰ Inicio: ${new Date().toISOString()}`);

    // Crear tracking inicial
    const tracking = await trackingService.createTracking(topic);
    console.log(`✅ Tracking creado con ID: ${tracking.id}`);

    try {
      // Ejecutar proceso completo
      console.log('🚀 Iniciando proceso de creación...');
      const result = await gemService.createArticle(topic);
      console.log('✅ Proceso de creación completado');

      // Publicar artículo
      const publishedArticle = await publisherService.publishArticle(result);
      console.log(`✅ Artículo publicado: ${publishedArticle.url}`);

      // Marcar como publicado
      await trackingService.markAsPublished(tracking.id, publishedArticle.url);
      console.log('✅ Artículo marcado como publicado');

      console.log('🎉 ¡Flujo completo exitoso!');
    } catch (error) {
      console.error('❌ Error en proceso de creación:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('❌ Error message:', errorMessage);
      console.error(
        '❌ Error stack:',
        error instanceof Error ? error.stack : 'No stack available'
      );

      await trackingService.logError(
        tracking.id,
        `Error en proceso: ${errorMessage}`
      );
      await trackingService.updateStatus(tracking.id, 'error');
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('❌ Error en el flujo completo:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
  }
}

testCompleteFlow();
