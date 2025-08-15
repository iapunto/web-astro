import { Client } from 'pg';

// Enums y tipos
export enum ArticleStatus {
  PENDING = 'pending',
  GEM1_COMPLETED = 'gem1_completed',
  GEM2_IN_PROGRESS = 'gem2_in_progress',
  GEM2_COMPLETED = 'gem2_completed',
  GEM3_IN_PROGRESS = 'gem3_in_progress',
  GEM3_COMPLETED = 'gem3_completed',
  GEM4_IN_PROGRESS = 'gem4_in_progress',
  GEM4_COMPLETED = 'gem4_completed',
  GEM5_IN_PROGRESS = 'gem5_in_progress',
  GEM5_COMPLETED = 'gem5_completed',
  PUBLISHED = 'published',
  ERROR = 'error',
}

// Interfaces
export interface ArticleTracking {
  id: string;
  topic: string;
  status: ArticleStatus;
  gem1Result?: Gem1Result;
  gem2Results: Gem2Result[];
  gem3Result?: Gem3Result;
  gem4Result?: Gem4Result | null;
  gem5Result?: Gem5Result | null;
  publishedUrl?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gem1Result {
  id: string;
  title: string;
  keywords: string[];
  sections: ArticleSection[];
  targetLength: number;
  seoMeta: SEOMeta;
  createdAt: Date;
}

export interface ArticleSection {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  targetLength: number;
}

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
  focusKeyword: string;
}

export interface Gem2Result {
  id: string;
  sectionId: string;
  research: string;
  sources: string[];
  insights: string[];
  createdAt: Date;
}

export interface Gem3Result {
  id: string;
  fullArticle: string;
  wordCount: number;
  seoOptimized: boolean;
  readabilityScore: number;
  createdAt: Date;
}

export interface Gem4Result {
  id: string;
  imageUrl: string;
  imageAlt: string;
  cloudinaryPublicId: string;
  createdAt: Date;
}

export interface Gem5Result {
  id: string;
  frontmatter: ArticleFrontmatter;
  mdxContent: string;
  validationPassed: boolean;
  validationErrors: string[];
  createdAt: Date;
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  pubDate: string;
  description: string;
  cover: string;
  coverAlt: string;
  author: {
    name: string;
    description: string;
    image: string;
  };
  category: string;
  subcategory?: string;
  tags: string[];
  quote: string;
}

export interface FinalArticle {
  id: string;
  filePath: string;
  fileName: string;
  url: string;
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  tags: string[];
  authorName: string;
  wordCount: number;
  seoScore?: number;
  healthScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Clase de servicio para manejar la base de datos
export class ArticleTrackingService {
  private client: Client;

  constructor(client: Client | null) {
    if (!client) {
      // Crear cliente de base de datos desde variables de entorno
      this.client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'iapunto_articles',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        ssl: process.env.DB_SSL === 'true',
      });
    } else {
      this.client = client;
    }
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('✅ Conectado a la base de datos de tracking');
    } catch (error) {
      console.error('❌ Error conectando a la base de datos:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log('✅ Desconectado de la base de datos de tracking');
    } catch (error) {
      console.error('❌ Error desconectando de la base de datos:', error);
    }
  }

  async createTracking(topic: string): Promise<ArticleTracking> {
    try {
      const result = await this.client.query(
        'INSERT INTO articles_tracking (topic, status) VALUES ($1, $2) RETURNING *',
        [topic, ArticleStatus.PENDING]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        topic: row.topic,
        status: row.status as ArticleStatus,
        gem2Results: [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error creando tracking:', error);
      throw error;
    }
  }

  async getTracking(id: string): Promise<ArticleTracking | null> {
    try {
      const result = await this.client.query(
        'SELECT * FROM articles_tracking WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const gem1Result = await this.getGem1Result(id);
      const gem2Results = await this.getGem2Results(id);
      const gem3Result = await this.getGem3Result(id);
      const gem4Result = await this.getGem4Result(id);
      const gem5Result = await this.getGem5Result(id);

      return {
        id: row.id,
        topic: row.topic,
        status: row.status as ArticleStatus,
        gem1Result,
        gem2Results,
        gem3Result,
        gem4Result,
        gem5Result,
        publishedUrl: row.published_url,
        error: row.error,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error obteniendo tracking:', error);
      return null;
    }
  }

  async updateStatus(id: string, status: ArticleStatus): Promise<void> {
    try {
      await this.client.query(
        'UPDATE articles_tracking SET status = $1, updated_at = NOW() WHERE id = $2',
        [status, id]
      );
    } catch (error) {
      console.error('Error actualizando status:', error);
      throw error;
    }
  }

  async updateGem1Result(id: string, gem1Result: Gem1Result): Promise<void> {
    try {
      // Insertar resultado de GEM 1
      await this.client.query(
        `INSERT INTO gem1_results (tracking_id, title, keywords, target_length, seo_meta)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          gem1Result.title,
          gem1Result.keywords,
          gem1Result.targetLength,
          gem1Result.seoMeta,
        ]
      );

      // Insertar secciones
      for (const section of gem1Result.sections) {
        await this.client.query(
          `INSERT INTO article_sections (gem1_result_id, section_id, title, description, keywords, target_length)
           VALUES ((SELECT id FROM gem1_results WHERE tracking_id = $1), $2, $3, $4, $5, $6)`,
          [
            id,
            section.id,
            section.title,
            section.description,
            section.keywords,
            section.targetLength,
          ]
        );
      }

      // Actualizar status
      await this.updateStatus(id, ArticleStatus.GEM1_COMPLETED);
    } catch (error) {
      console.error('Error actualizando GEM 1 result:', error);
      throw error;
    }
  }

  async updateGem2Result(id: string, gem2Result: Gem2Result): Promise<void> {
    try {
      await this.client.query(
        `INSERT INTO gem2_results (tracking_id, section_id, research, sources, insights)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          gem2Result.sectionId,
          gem2Result.research,
          gem2Result.sources,
          gem2Result.insights,
        ]
      );
    } catch (error) {
      console.error('Error actualizando GEM 2 result:', error);
      throw error;
    }
  }

  async updateGem3Result(id: string, gem3Result: Gem3Result): Promise<void> {
    try {
      await this.client.query(
        `INSERT INTO gem3_results (tracking_id, full_article, word_count, seo_optimized, readability_score)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          gem3Result.fullArticle,
          gem3Result.wordCount,
          gem3Result.seoOptimized,
          gem3Result.readabilityScore,
        ]
      );

      await this.updateStatus(id, ArticleStatus.GEM3_COMPLETED);
    } catch (error) {
      console.error('Error actualizando GEM 3 result:', error);
      throw error;
    }
  }

  async updateGem4Result(id: string, gem4Result: Gem4Result): Promise<void> {
    try {
      await this.client.query(
        `INSERT INTO gem4_results (tracking_id, image_url, image_alt, cloudinary_public_id)
         VALUES ($1, $2, $3, $4)`,
        [
          id,
          gem4Result.imageUrl,
          gem4Result.imageAlt,
          gem4Result.cloudinaryPublicId,
        ]
      );

      await this.updateStatus(id, ArticleStatus.GEM4_COMPLETED);
    } catch (error) {
      console.error('Error actualizando GEM 4 result:', error);
      throw error;
    }
  }

  async updateGem5Result(id: string, gem5Result: Gem5Result): Promise<void> {
    try {
      await this.client.query(
        `INSERT INTO gem5_results (tracking_id, frontmatter, mdx_content, validation_passed, validation_errors)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          gem5Result.frontmatter,
          gem5Result.mdxContent,
          gem5Result.validationPassed,
          gem5Result.validationErrors,
        ]
      );

      await this.updateStatus(id, ArticleStatus.GEM5_COMPLETED);
    } catch (error) {
      console.error('Error actualizando GEM 5 result:', error);
      throw error;
    }
  }

  async markAsPublished(id: string, url: string): Promise<void> {
    try {
      await this.client.query(
        'UPDATE articles_tracking SET status = $1, published_at = NOW(), published_url = $2 WHERE id = $3',
        [ArticleStatus.PUBLISHED, url, id]
      );
    } catch (error) {
      console.error('Error marcando como publicado:', error);
      throw error;
    }
  }

  async logError(id: string, error: string): Promise<void> {
    try {
      await this.client.query(
        'UPDATE articles_tracking SET status = $1, error = $2 WHERE id = $3',
        [ArticleStatus.ERROR, error, id]
      );

      // También registrar en system_logs
      await this.client.query(
        'INSERT INTO system_logs (level, message, tracking_id, gem_stage, error_details) VALUES ($1, $2, $3, $4, $5)',
        ['error', error, id, 'system', { error }]
      );
    } catch (err) {
      console.error('Error registrando error:', err);
    }
  }

  // Métodos privados para obtener resultados específicos
  private async getGem1Result(
    trackingId: string
  ): Promise<Gem1Result | undefined> {
    try {
      const result = await this.client.query(
        'SELECT * FROM gem1_results WHERE tracking_id = $1',
        [trackingId]
      );

      if (result.rows.length === 0) return undefined;

      const row = result.rows[0];

      // Obtener secciones
      const sectionsResult = await this.client.query(
        'SELECT * FROM article_sections WHERE gem1_result_id = $1',
        [row.id]
      );

      const sections = sectionsResult.rows.map((s) => ({
        id: s.section_id,
        title: s.title,
        description: s.description,
        keywords: s.keywords,
        targetLength: s.target_length,
      }));

      return {
        id: row.id,
        title: row.title,
        keywords: row.keywords,
        sections,
        targetLength: row.target_length,
        seoMeta: row.seo_meta,
        createdAt: row.created_at,
      };
    } catch (error) {
      console.error('Error obteniendo GEM 1 result:', error);
      return undefined;
    }
  }

  private async getGem2Results(trackingId: string): Promise<Gem2Result[]> {
    try {
      const result = await this.client.query(
        'SELECT * FROM gem2_results WHERE tracking_id = $1 ORDER BY created_at',
        [trackingId]
      );

      return result.rows.map((row) => ({
        id: row.id,
        sectionId: row.section_id,
        research: row.research,
        sources: row.sources || [],
        insights: row.insights,
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error('Error obteniendo GEM 2 results:', error);
      return [];
    }
  }

  private async getGem3Result(
    trackingId: string
  ): Promise<Gem3Result | undefined> {
    try {
      const result = await this.client.query(
        'SELECT * FROM gem3_results WHERE tracking_id = $1',
        [trackingId]
      );

      if (result.rows.length === 0) return undefined;

      const row = result.rows[0];
      return {
        id: row.id,
        fullArticle: row.full_article,
        wordCount: row.word_count,
        seoOptimized: row.seo_optimized,
        readabilityScore: row.readability_score,
        createdAt: row.created_at,
      };
    } catch (error) {
      console.error('Error obteniendo GEM 3 result:', error);
      return undefined;
    }
  }

  private async getGem4Result(trackingId: string): Promise<Gem4Result | null> {
    try {
      const result = await this.client.query(
        `SELECT * FROM gem4_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [trackingId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        imageUrl: row.image_url,
        imageAlt: row.image_alt,
        cloudinaryPublicId: row.cloudinary_public_id,
        createdAt: row.created_at,
      };
    } catch (error) {
      console.error('Error obteniendo GEM 4 result:', error);
      return null;
    }
  }

  private async getFinalArticle(
    trackingId: string
  ): Promise<FinalArticle | undefined> {
    try {
      const result = await this.client.query(
        'SELECT * FROM published_articles WHERE tracking_id = $1',
        [trackingId]
      );

      if (result.rows.length === 0) return undefined;

      const row = result.rows[0];
      return {
        id: row.id,
        filePath: row.file_path,
        fileName: row.file_name,
        url: row.url,
        slug: row.slug,
        title: row.title,
        category: row.category,
        subcategory: row.subcategory,
        tags: row.tags,
        authorName: row.author_name,
        wordCount: row.word_count,
        seoScore: row.seo_score,
        healthScore: row.health_score,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error obteniendo artículo final:', error);
      return undefined;
    }
  }

  private async getGem5Result(trackingId: string): Promise<Gem5Result | null> {
    try {
      const result = await this.client.query(
        `SELECT * FROM gem5_results WHERE tracking_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [trackingId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        frontmatter: row.frontmatter,
        mdxContent: row.mdx_content,
        validationPassed: row.validation_passed,
        validationErrors: row.validation_errors || [],
        createdAt: row.created_at,
      };
    } catch (error) {
      console.error('Error obteniendo GEM 5 result:', error);
      return null;
    }
  }

  // Métodos de utilidad
  async getStats() {
    try {
      const result = await this.client.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
          COUNT(CASE WHEN status = 'error' THEN 1 END) as failed,
          AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_creation_time
        FROM articles_tracking
      `);

      return result.rows[0];
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  async getRecentArticles(limit: number = 10) {
    try {
      const result = await this.client.query(
        `
        SELECT at.*, pa.title, pa.category, pa.author_name
        FROM articles_tracking at
        LEFT JOIN published_articles pa ON at.id = pa.tracking_id
        ORDER BY at.created_at DESC
        LIMIT $1
      `,
        [limit]
      );

      return result.rows;
    } catch (error) {
      console.error('Error obteniendo artículos recientes:', error);
      throw error;
    }
  }
}
