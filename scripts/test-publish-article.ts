#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { Client } from 'pg';
import { ArticlePublisherService } from '../src/lib/services/articlePublisherService';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema';

// Cargar variables de entorno
dotenv.config();

async function testPublishArticle() {
  console.log('🧪 Probando publicación de artículo...');

  try {
    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });

    await client.connect();
    const trackingService = new ArticleTrackingService(client);
    const publisherService = new ArticlePublisherService();

    // ID del artículo que está en gem4_completed
    const trackingId = 'f2caddcf-cd42-4532-928a-c35c67c8090f';

    console.log(
      `🔍 Obteniendo resultado de GEM 4 para tracking ID: ${trackingId}`
    );

    // Obtener resultado de GEM 4
    const gem4Result = await client.query(
      'SELECT * FROM gem4_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1',
      [trackingId]
    );

    if (gem4Result.rows.length === 0) {
      console.log('❌ No se encontró resultado de GEM 4');
      return;
    }

    const gem4Data = gem4Result.rows[0];
    console.log('✅ Resultado de GEM 4 encontrado');
    console.log('📊 Validación pasada:', gem4Data.validation_passed);
    console.log('📊 Errores de validación:', gem4Data.validation_errors);

    // Reconstruir objeto Gem4Result
    const gem4ResultObj = {
      frontmatter: gem4Data.frontmatter,
      mdxContent: gem4Data.mdx_content,
      validationPassed: gem4Data.validation_passed,
      validationErrors: gem4Data.validation_errors || [],
      createdAt: gem4Data.created_at,
    };

    console.log('🚀 Intentando publicar artículo...');
    const publishedArticle =
      await publisherService.publishArticle(gem4ResultObj);

    if (publishedArticle.success) {
      console.log('✅ Artículo publicado exitosamente');
      console.log(`📁 Archivo: ${publishedArticle.filePath}`);
      console.log(`🔗 URL: ${publishedArticle.url}`);

      // Marcar como publicado
      await trackingService.markAsPublished(trackingId, publishedArticle.url);
      console.log('✅ Artículo marcado como publicado');
    } else {
      console.log('❌ Error al publicar artículo:', publishedArticle.error);
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error en la publicación:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
  }
}

testPublishArticle();
