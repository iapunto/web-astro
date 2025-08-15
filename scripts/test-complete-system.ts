#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema.js';
import { GemArticleService } from '../src/lib/services/gemArticleService.js';
import { ArticlePublisherService } from '../src/lib/services/articlePublisherService.js';

dotenv.config();

async function testCompleteSystem() {
  console.log('🧪 Probando sistema completo...');
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    const trackingService = new ArticleTrackingService(client);
    const gemService = new GemArticleService(
      'demo-key',
      trackingService,
      'marilyn-cardozo'
    );
    const publisherService = new ArticlePublisherService();

    // Crear un artículo de prueba
    const topic = 'Automatización de Marketing Digital con IA - Test Completo';
    console.log(`📝 Creando artículo: ${topic}`);

    const tracking = await gemService.createArticle(topic);
    console.log(`✅ Artículo creado con ID: ${tracking.id}`);

    // Verificar que llegó hasta GEM 5
    const updatedTracking = await trackingService.getTracking(tracking.id);
    console.log(`📊 Estado final: ${updatedTracking?.status}`);

    if (updatedTracking?.status === 'gem5_completed') {
      console.log('🎉 ¡Sistema completo funcionando!');

      // Probar la publicación con fecha corregida
      console.log('📅 Probando publicación con fecha corregida...');

      if (updatedTracking.gem5Result) {
        const publishedArticle = await publisherService.publishArticle(
          updatedTracking.gem5Result
        );

        if (publishedArticle.success) {
          console.log('✅ Artículo publicado exitosamente');
          console.log(`   📁 Archivo: ${publishedArticle.filePath}`);
          console.log(`   🔗 URL: ${publishedArticle.url}`);

          // Verificar que la fecha se actualizó correctamente
          const fs = await import('fs/promises');
          const content = await fs.readFile(publishedArticle.filePath, 'utf-8');
          const dateMatch = content.match(/pubDate:\s*"([^"]+)"/);

          if (dateMatch) {
            const pubDate = dateMatch[1];
            const today = new Date().toISOString().split('T')[0];
            console.log(`📅 Fecha en frontmatter: ${pubDate}`);
            console.log(`📅 Fecha actual: ${today}`);

            if (pubDate === today) {
              console.log('✅ Fecha de publicación corregida correctamente');
            } else {
              console.log('⚠️  La fecha no se actualizó correctamente');
            }
          }
        } else {
          console.log('❌ Error al publicar artículo:', publishedArticle.error);
        }
      }
    } else {
      console.log('❌ El artículo no llegó hasta GEM 5');
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error en prueba del sistema:', error);
  }
}

testCompleteSystem();
