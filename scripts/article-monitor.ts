#!/usr/bin/env tsx

import { ArticlePublisherService } from '../src/lib/services/articlePublisherService';
import { ArticleTrackingService } from '../src/lib/database/articleTrackingSchema';
import fs from 'fs/promises';
import path from 'path';

interface MonitorConfig {
  blogContentPath: string;
  baseUrl: string;
  checkInterval: number; // en minutos
  maxArticlesPerDay: number;
  alertThreshold: number; // porcentaje de artículos con problemas
}

interface ArticleHealth {
  filePath: string;
  slug: string;
  title: string;
  isValid: boolean;
  errors: string[];
  lastModified: Date;
  wordCount: number;
  seoScore: number;
}

interface MonitorReport {
  timestamp: Date;
  totalArticles: number;
  healthyArticles: number;
  problematicArticles: number;
  healthPercentage: number;
  recentArticles: ArticleHealth[];
  categoryDistribution: Record<string, number>;
  tagDistribution: Record<string, number>;
  recommendations: string[];
}

class ArticleMonitor {
  private config: MonitorConfig;
  private publisherService: ArticlePublisherService;
  private trackingService: ArticleTrackingService;
  private isRunning: boolean = false;

  constructor(config: MonitorConfig) {
    this.config = config;
    this.publisherService = new ArticlePublisherService(config.blogContentPath, config.baseUrl);
    this.trackingService = new ArticleTrackingService(null); // TODO: Conectar con DB real
  }

  async startMonitoring() {
    if (this.isRunning) {
      console.log('⚠️  El monitor ya está ejecutándose');
      return;
    }

    this.isRunning = true;
    console.log('🔍 Iniciando monitoreo de artículos...');
    console.log(`📁 Ruta del blog: ${this.config.blogContentPath}`);
    console.log(`⏰ Intervalo de verificación: ${this.config.checkInterval} minutos`);

    // Verificación inicial
    await this.performHealthCheck();

    // Configurar verificación periódica
    setInterval(async () => {
      if (this.isRunning) {
        await this.performHealthCheck();
      }
    }, this.config.checkInterval * 60 * 1000);
  }

  stopMonitoring() {
    this.isRunning = false;
    console.log('🛑 Monitoreo detenido');
  }

  async performHealthCheck(): Promise<MonitorReport> {
    console.log(`\n🔍 Verificación de salud de artículos - ${new Date().toISOString()}`);

    try {
      // Obtener todos los archivos MDX
      const files = await fs.readdir(this.config.blogContentPath);
      const mdxFiles = files.filter(file => file.endsWith('.mdx'));

      const articleHealth: ArticleHealth[] = [];
      let healthyCount = 0;
      let problematicCount = 0;

      // Analizar cada artículo
      for (const file of mdxFiles) {
        const filePath = path.join(this.config.blogContentPath, file);
        const health = await this.analyzeArticle(filePath);
        
        articleHealth.push(health);
        
        if (health.isValid) {
          healthyCount++;
        } else {
          problematicCount++;
        }
      }

      // Obtener estadísticas
      const stats = await this.publisherService.getArticleStats();

      // Generar reporte
      const report: MonitorReport = {
        timestamp: new Date(),
        totalArticles: mdxFiles.length,
        healthyArticles: healthyCount,
        problematicArticles: problematicCount,
        healthPercentage: mdxFiles.length > 0 ? (healthyCount / mdxFiles.length) * 100 : 0,
        recentArticles: articleHealth
          .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
          .slice(0, 10),
        categoryDistribution: stats.categories,
        tagDistribution: stats.tags,
        recommendations: this.generateRecommendations(articleHealth, stats)
      };

      // Mostrar reporte
      this.displayReport(report);

      // Alertas si es necesario
      if (report.healthPercentage < (100 - this.config.alertThreshold)) {
        await this.sendAlert(report);
      }

      return report;

    } catch (error) {
      console.error('❌ Error en la verificación de salud:', error);
      throw error;
    }
  }

  private async analyzeArticle(filePath: string): Promise<ArticleHealth> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);
      
      // Validar estructura
      const validation = await this.publisherService.validateArticleStructure(filePath);
      
      // Extraer información del frontmatter
      const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
      const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
      
      const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
      const slugMatch = frontmatter.match(/slug:\s*"([^"]+)"/);
      
      const title = titleMatch ? titleMatch[1] : 'Sin título';
      const slug = slugMatch ? slugMatch[1] : path.basename(filePath, '.mdx');
      
      // Calcular métricas
      const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/, '');
      const wordCount = this.countWords(contentWithoutFrontmatter);
      const seoScore = this.calculateSEOScore(content, frontmatter);

      return {
        filePath,
        slug,
        title,
        isValid: validation.isValid,
        errors: validation.errors,
        lastModified: stats.mtime,
        wordCount,
        seoScore
      };

    } catch (error) {
      return {
        filePath,
        slug: path.basename(filePath, '.mdx'),
        title: 'Error al analizar',
        isValid: false,
        errors: [`Error de lectura: ${error instanceof Error ? error.message : 'Error desconocido'}`],
        lastModified: new Date(),
        wordCount: 0,
        seoScore: 0
      };
    }
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private calculateSEOScore(content: string, frontmatter: string): number {
    let score = 0;
    
    // Verificar campos SEO básicos
    if (frontmatter.includes('title:')) score += 10;
    if (frontmatter.includes('description:')) score += 10;
    if (frontmatter.includes('tags:')) score += 10;
    if (frontmatter.includes('category:')) score += 10;
    if (frontmatter.includes('quote:')) score += 5;
    
    // Verificar estructura de contenido
    if (content.includes('<h2')) score += 10;
    if (content.includes('<h3')) score += 5;
    if (content.includes('<ul>') || content.includes('<ol>')) score += 5;
    if (content.includes('<strong>') || content.includes('<em>')) score += 5;
    
    // Verificar longitud
    const wordCount = this.countWords(content);
    if (wordCount >= 1500) score += 15;
    else if (wordCount >= 1000) score += 10;
    else if (wordCount >= 500) score += 5;
    
    return Math.min(score, 100);
  }

  private generateRecommendations(articles: ArticleHealth[], stats: any): string[] {
    const recommendations: string[] = [];
    
    // Análisis de categorías
    const categoryEntries = Object.entries(stats.categories);
    if (categoryEntries.length > 0) {
      const [mostUsedCategory] = categoryEntries.sort(([,a], [,b]) => b - a)[0];
      const [leastUsedCategory] = categoryEntries.sort(([,a], [,b]) => a - b)[0];
      
      if (stats.categories[mostUsedCategory] > stats.categories[leastUsedCategory] * 3) {
        recommendations.push(`Considera crear más artículos en la categoría "${leastUsedCategory}" para balancear el contenido`);
      }
    }
    
    // Análisis de artículos problemáticos
    const problematicArticles = articles.filter(a => !a.isValid);
    if (problematicArticles.length > 0) {
      recommendations.push(`${problematicArticles.length} artículos tienen problemas estructurales que requieren atención`);
    }
    
    // Análisis de SEO
    const lowSEOScore = articles.filter(a => a.seoScore < 70);
    if (lowSEOScore.length > 0) {
      recommendations.push(`${lowSEOScore.length} artículos tienen puntuación SEO baja (< 70) y podrían optimizarse`);
    }
    
    // Análisis de longitud
    const shortArticles = articles.filter(a => a.wordCount < 800);
    if (shortArticles.length > 0) {
      recommendations.push(`${shortArticles.length} artículos son muy cortos (< 800 palabras) y podrían expandirse`);
    }
    
    return recommendations;
  }

  private displayReport(report: MonitorReport) {
    console.log('\n📊 REPORTE DE SALUD DE ARTÍCULOS');
    console.log('=' .repeat(50));
    console.log(`📅 Fecha: ${report.timestamp.toLocaleString()}`);
    console.log(`📚 Total artículos: ${report.totalArticles}`);
    console.log(`✅ Artículos saludables: ${report.healthyArticles}`);
    console.log(`⚠️  Artículos problemáticos: ${report.problematicArticles}`);
    console.log(`📈 Porcentaje de salud: ${report.healthPercentage.toFixed(1)}%`);
    
    if (report.recentArticles.length > 0) {
      console.log('\n📝 ARTÍCULOS RECIENTES:');
      report.recentArticles.forEach(article => {
        const status = article.isValid ? '✅' : '❌';
        console.log(`   ${status} ${article.title} (${article.wordCount} palabras, SEO: ${article.seoScore})`);
        if (!article.isValid && article.errors.length > 0) {
          article.errors.forEach(error => console.log(`      ⚠️  ${error}`));
        }
      });
    }
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMENDACIONES:');
      report.recommendations.forEach(rec => console.log(`   • ${rec}`));
    }
    
    console.log('\n🏷️  DISTRIBUCIÓN POR CATEGORÍAS:');
    Object.entries(report.categoryDistribution)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} artículos`);
      });
    
    console.log('=' .repeat(50));
  }

  private async sendAlert(report: MonitorReport) {
    console.log('\n🚨 ALERTA: Porcentaje de salud bajo');
    console.log(`📊 Salud actual: ${report.healthPercentage.toFixed(1)}%`);
    console.log(`🎯 Umbral de alerta: ${100 - this.config.alertThreshold}%`);
    
    // Aquí se podría implementar envío de notificaciones
    // - Email
    // - Slack
    // - Discord
    // - Webhook personalizado
  }

  async getArticleDetails(slug: string): Promise<ArticleHealth | null> {
    try {
      const filePath = path.join(this.config.blogContentPath, `${slug}.mdx`);
      return await this.analyzeArticle(filePath);
    } catch (error) {
      console.error(`Error al obtener detalles del artículo ${slug}:`, error);
      return null;
    }
  }

  async fixArticle(slug: string): Promise<{ success: boolean; message: string }> {
    try {
      const filePath = path.join(this.config.blogContentPath, `${slug}.mdx`);
      
      // Crear backup antes de intentar arreglar
      await this.publisherService.backupArticle(filePath);
      
      // Aquí se implementarían las correcciones automáticas
      // Por ahora solo validamos
      const health = await this.analyzeArticle(filePath);
      
      if (health.isValid) {
        return {
          success: true,
          message: 'El artículo ya está en buen estado'
        };
      } else {
        return {
          success: false,
          message: `El artículo tiene ${health.errors.length} problemas que requieren corrección manual`
        };
      }
      
    } catch (error) {
      return {
        success: false,
        message: `Error al intentar arreglar el artículo: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
}

// Configuración de ejemplo
const config: MonitorConfig = {
  blogContentPath: 'src/content/blog',
  baseUrl: 'https://iapunto.com',
  checkInterval: 30, // 30 minutos
  maxArticlesPerDay: 2,
  alertThreshold: 20 // 20% de artículos problemáticos
};

// Función principal
async function main() {
  const monitor = new ArticleMonitor(config);
  
  try {
    // Verificación única
    await monitor.performHealthCheck();
    
    // Para monitoreo continuo, descomentar:
    // await monitor.startMonitoring();
    
  } catch (error) {
    console.error('❌ Error en el monitoreo:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

export { ArticleMonitor, type MonitorConfig, type MonitorReport, type ArticleHealth };
