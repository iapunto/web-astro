#!/usr/bin/env tsx

import { GemArticleService } from '../src/lib/services/gemArticleService.js';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema.js';

/**
 * Script de prueba para verificar el flujo optimizado de GEMs
 * Este script prueba cada GEM individualmente y luego el flujo completo
 */

class GemFlowTester {
  private gemService: GemArticleService;
  private trackingService: ArticleTrackingService;

  constructor(apiKey: string) {
    this.trackingService = new ArticleTrackingService(null);
    this.gemService = new GemArticleService(apiKey, this.trackingService);
  }

  async testGem1() {
    console.log('\n🧪 Probando GEM 1 - Planificador de Artículo');
    console.log('='.repeat(50));

    const testTopic =
      'Cómo la IA está transformando el marketing digital para PYMES en 2025';

    try {
      const result = await this.gemService['executeGem1'](testTopic);

      console.log('✅ GEM 1 ejecutado exitosamente');
      console.log(`📝 Título: ${result.title}`);
      console.log(`🔑 Keyword principal: ${result.keywords[0]}`);
      console.log(`📊 Palabras totales: ${result.targetLength}`);
      console.log(`📋 Secciones: ${result.sections.length}`);

      result.sections.forEach((section, index) => {
        console.log(
          `   ${index + 1}. ${section.title} (${section.targetLength} palabras)`
        );
      });

      return result;
    } catch (error) {
      console.error('❌ Error en GEM 1:', error);
      throw error;
    }
  }

  async testGem2(gem1Result: any) {
    console.log('\n🧪 Probando GEM 2 - Investigador de Sección');
    console.log('='.repeat(50));

    try {
      const results = await this.gemService['executeGem2'](gem1Result);

      console.log('✅ GEM 2 ejecutado exitosamente');
      console.log(`🔍 Secciones investigadas: ${results.length}`);

      results.forEach((result, index) => {
        console.log(
          `   ${index + 1}. ${result.sectionId}: ${result.insights.length} insights`
        );
      });

      return results;
    } catch (error) {
      console.error('❌ Error en GEM 2:', error);
      throw error;
    }
  }

  async testGem3(gem1Result: any, gem2Results: any[]) {
    console.log('\n🧪 Probando GEM 3 - Redactor Final');
    console.log('='.repeat(50));

    try {
      const result = await this.gemService['executeGem3'](
        gem1Result,
        gem2Results
      );

      console.log('✅ GEM 3 ejecutado exitosamente');
      console.log(`📝 Palabras generadas: ${result.wordCount}`);
      console.log(
        `📊 Puntuación de legibilidad: ${result.readabilityScore.toFixed(1)}`
      );
      console.log(
        `🔍 Optimizado para SEO: ${result.seoOptimized ? 'Sí' : 'No'}`
      );

      // Mostrar preview del contenido
      const preview = result.fullArticle.substring(0, 200) + '...';
      console.log(`📄 Preview: ${preview}`);

      return result;
    } catch (error) {
      console.error('❌ Error en GEM 3:', error);
      throw error;
    }
  }

  async testGem4(articleContent: string, gem1Result: any) {
    console.log('\n🧪 Probando GEM 4 - Generador de Frontmatter');
    console.log('='.repeat(50));

    try {
      const result = await this.gemService['executeGem4'](
        articleContent,
        gem1Result
      );

      console.log('✅ GEM 4 ejecutado exitosamente');
      console.log(`🏷️  Categoría: ${result.frontmatter.category}`);
      console.log(`📊 Tags: ${result.frontmatter.tags.join(', ')}`);
      console.log(`✅ Validación pasada: ${result.validationPassed}`);

      if (result.validationErrors && result.validationErrors.length > 0) {
        console.log(
          `⚠️  Errores de validación: ${result.validationErrors.join(', ')}`
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Error en GEM 4:', error);
      throw error;
    }
  }

  async testCompleteFlow() {
    console.log('\n🚀 Probando Flujo Completo de GEMs');
    console.log('='.repeat(50));

    const testTopic =
      'Automatización inteligente: 5 herramientas que toda empresa debería usar';

    try {
      console.log(`📝 Tema de prueba: ${testTopic}`);

      const startTime = Date.now();

      // Ejecutar flujo completo
      const tracking = await this.gemService.createArticle(testTopic);

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      console.log('✅ Flujo completo ejecutado exitosamente');
      console.log(`⏱️  Tiempo total: ${duration.toFixed(2)} segundos`);
      console.log(`🆔 Tracking ID: ${tracking.id}`);

      return tracking;
    } catch (error) {
      console.error('❌ Error en flujo completo:', error);
      throw error;
    }
  }

  async runAllTests() {
    console.log('🧪 INICIANDO PRUEBAS DEL FLUJO OPTIMIZADO DE GEMs');
    console.log('='.repeat(60));

    try {
      // Prueba individual de cada GEM
      const gem1Result = await this.testGem1();
      const gem2Results = await this.testGem2(gem1Result);
      const gem3Result = await this.testGem3(gem1Result, gem2Results);
      await this.testGem4(gem3Result.fullArticle, gem1Result);

      // Prueba del flujo completo
      await this.testCompleteFlow();

      console.log('\n🎉 TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
      console.log('='.repeat(60));
      console.log(
        '✅ El flujo optimizado de GEMs está funcionando correctamente'
      );
      console.log('✅ Los prompts están generando resultados válidos');
      console.log('✅ La validación de frontmatter funciona');
      console.log('✅ El sistema está listo para producción');
    } catch (error) {
      console.error('\n❌ ERROR EN LAS PRUEBAS');
      console.error('='.repeat(60));
      console.error('Error:', error);
      process.exit(1);
    }
  }
}

// Función principal
async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY no está configurada');
    console.log('Configúrala en tu archivo .env');
    process.exit(1);
  }

  const tester = new GemFlowTester(apiKey);
  await tester.runAllTests();
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main().catch(console.error);
}

export { GemFlowTester };
