#!/usr/bin/env tsx

import { GemArticleService } from '../src/lib/services/gemArticleService.js';
import { ArticlePublisherService } from '../src/lib/services/articlePublisherService.js';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema.js';

interface TopicConfig {
  topic: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  targetKeywords: string[];
  schedule: 'daily' | 'weekly' | 'monthly' | 'manual';
}

interface AutomationConfig {
  apiKey: string;
  maxArticlesPerDay: number;
  topics: TopicConfig[];
  baseUrl: string;
  blogContentPath: string;
}

class AutomatedArticleCreator {
  private config: AutomationConfig;
  private gemService: GemArticleService;
  private publisherService: ArticlePublisherService;
  private trackingService: ArticleTrackingService;
  private dailyCount: number = 0;
  private lastResetDate: string = new Date().toDateString();

  constructor(config: AutomationConfig) {
    this.config = config;
    this.trackingService = new ArticleTrackingService(null); // TODO: Conectar con DB real
    this.gemService = new GemArticleService(
      config.apiKey,
      this.trackingService
    );
    this.publisherService = new ArticlePublisherService(
      config.blogContentPath,
      config.baseUrl
    );
  }

  async start() {
    console.log('🤖 Iniciando Sistema de Creación Automática de Artículos');
    console.log(`📅 Fecha: ${new Date().toISOString()}`);
    console.log(
      `🎯 Artículos máximos por día: ${this.config.maxArticlesPerDay}`
    );
    console.log(`📝 Temas configurados: ${this.config.topics.length}`);

    // Verificar límite diario
    this.checkDailyLimit();

    // Seleccionar tema para hoy
    const selectedTopic = this.selectTopicForToday();
    if (!selectedTopic) {
      console.log(
        '⚠️  No hay temas disponibles para hoy o se alcanzó el límite diario'
      );
      return;
    }

    console.log(`🎯 Tema seleccionado: ${selectedTopic.topic}`);
    console.log(`🏷️  Categoría: ${selectedTopic.category}`);
    console.log(
      `🔑 Palabras clave objetivo: ${selectedTopic.targetKeywords.join(', ')}`
    );

    try {
      // Crear artículo usando el flujo optimizado de GEMs
      const result = await this.createArticle(selectedTopic);

      if (result.success) {
        this.dailyCount++;
        console.log(`✅ Artículo creado exitosamente: ${result.articleUrl}`);
        console.log(
          `📊 Contador diario: ${this.dailyCount}/${this.config.maxArticlesPerDay}`
        );
      } else {
        console.error(`❌ Error al crear artículo: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error en la creación automática:', error);
    }
  }

  private checkDailyLimit() {
    const today = new Date().toDateString();

    if (today !== this.lastResetDate) {
      this.dailyCount = 0;
      this.lastResetDate = today;
      console.log('🔄 Contador diario reiniciado');
    }

    if (this.dailyCount >= this.config.maxArticlesPerDay) {
      throw new Error(
        `Límite diario alcanzado: ${this.dailyCount}/${this.config.maxArticlesPerDay}`
      );
    }
  }

  private selectTopicForToday(): TopicConfig | null {
    const availableTopics = this.config.topics.filter((topic) => {
      // Filtrar por prioridad y disponibilidad
      return (
        topic.priority !== 'low' ||
        this.dailyCount < this.config.maxArticlesPerDay * 0.7
      );
    });

    if (availableTopics.length === 0) {
      return null;
    }

    // Seleccionar tema basado en prioridad y rotación
    const highPriorityTopics = availableTopics.filter(
      (t) => t.priority === 'high'
    );
    const mediumPriorityTopics = availableTopics.filter(
      (t) => t.priority === 'medium'
    );
    const lowPriorityTopics = availableTopics.filter(
      (t) => t.priority === 'low'
    );

    // Priorizar temas de alta prioridad
    if (highPriorityTopics.length > 0) {
      return this.selectRandomTopic(highPriorityTopics);
    }

    // Rotar entre temas de prioridad media
    if (mediumPriorityTopics.length > 0) {
      return this.selectRandomTopic(mediumPriorityTopics);
    }

    // Usar temas de baja prioridad si hay espacio
    if (lowPriorityTopics.length > 0) {
      return this.selectRandomTopic(lowPriorityTopics);
    }

    return null;
  }

  private selectRandomTopic(topics: TopicConfig[]): TopicConfig {
    const randomIndex = Math.floor(Math.random() * topics.length);
    return topics[randomIndex];
  }

  private async createArticle(
    topicConfig: TopicConfig
  ): Promise<{ success: boolean; articleUrl?: string; error?: string }> {
    try {
      console.log(`🚀 Iniciando creación de artículo: ${topicConfig.topic}`);
      console.log(
        '📋 Flujo optimizado de GEMs: GEM 1 → Bucle GEM 2 → GEM 3 → GEM 4'
      );

      // Crear tracking
      const tracking = await this.trackingService.createTracking(
        topicConfig.topic
      );

      // Ejecutar el flujo completo de GEMs optimizado
      const finalTracking = await this.gemService.createArticle(
        topicConfig.topic
      );

      // Obtener el resultado final de GEM 4
      const trackingResult = await this.trackingService.getTracking(
        finalTracking.id
      );
      if (!trackingResult?.gem4Result) {
        throw new Error('No se pudo obtener el resultado final de GEM 4');
      }

      // Publicar artículo
      console.log('📤 Publicando artículo...');
      const publishResult = await this.publisherService.publishArticle(
        trackingResult.gem4Result
      );

      if (!publishResult.success) {
        throw new Error(`Error al publicar: ${publishResult.error}`);
      }

      // Marcar como publicado
      await this.trackingService.markAsPublished(
        finalTracking.id,
        publishResult.url
      );

      return {
        success: true,
        articleUrl: publishResult.url,
      };
    } catch (error) {
      console.error('Error en createArticle:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  async getStats() {
    const stats = await this.publisherService.getArticleStats();
    return {
      dailyCount: this.dailyCount,
      maxDaily: this.config.maxArticlesPerDay,
      totalArticles: stats.totalArticles,
      categories: stats.categories,
      tags: stats.tags,
    };
  }
}

// Configuración de ejemplo con temas optimizados
const config: AutomationConfig = {
  apiKey: process.env.GEMINI_API_KEY || '',
  maxArticlesPerDay: 2,
  baseUrl: 'https://iapunto.com',
  blogContentPath: 'src/content/blog',
  topics: [
    {
      topic:
        'Cómo la IA está transformando el marketing digital para PYMES en 2025',
      priority: 'high',
      category: 'Marketing Digital y SEO',
      targetKeywords: ['IA marketing', 'PYMES', 'transformación digital'],
      schedule: 'weekly',
    },
    {
      topic:
        'Automatización inteligente: 5 herramientas que toda empresa debería usar',
      priority: 'high',
      category: 'Automatización y Productividad',
      targetKeywords: ['automatización', 'herramientas', 'productividad'],
      schedule: 'weekly',
    },
    {
      topic: 'SEO local con IA: estrategias para dominar Google My Business',
      priority: 'medium',
      category: 'Marketing Digital y SEO',
      targetKeywords: ['SEO local', 'Google My Business', 'IA'],
      schedule: 'weekly',
    },
    {
      topic: 'Chatbots inteligentes: cómo aumentar las ventas 24/7',
      priority: 'medium',
      category: 'Inteligencia Artificial',
      targetKeywords: ['chatbots', 'ventas', 'atención al cliente'],
      schedule: 'weekly',
    },
    {
      topic: 'Tendencias de ecommerce que dominarán 2025',
      priority: 'low',
      category: 'Negocios y Tecnología',
      targetKeywords: ['ecommerce', 'tendencias', '2025'],
      schedule: 'monthly',
    },
  ],
};

// Función principal
async function main() {
  if (!config.apiKey) {
    console.error('❌ Error: GEMINI_API_KEY no está configurada');
    process.exit(1);
  }

  const creator = new AutomatedArticleCreator(config);

  try {
    await creator.start();

    // Mostrar estadísticas
    const stats = await creator.getStats();
    console.log('\n📊 Estadísticas del sistema:');
    console.log(`   📝 Artículos hoy: ${stats.dailyCount}/${stats.maxDaily}`);
    console.log(`   📚 Total artículos: ${stats.totalArticles}`);
    console.log(
      `   🏷️  Categorías más usadas:`,
      Object.entries(stats.categories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat, count]) => `${cat} (${count})`)
        .join(', ')
    );
  } catch (error) {
    console.error('❌ Error en la ejecución principal:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

export { AutomatedArticleCreator, type AutomationConfig, type TopicConfig };
