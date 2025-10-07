/**
 * Script para redistribuir autores en Strapi
 *
 * Este script:
 * 1. Obtiene todos los artículos de Strapi
 * 2. Verifica los autores disponibles
 * 3. Redistribuye los artículos entre los 2 autores
 * 4. Actualiza las asignaciones en Strapi
 *
 * @author IA Punto
 * @version 1.0.0
 * @since 2025-01-27
 */

import { StrapiService } from '../lib/strapi.js';
import { AUTHORS } from '../lib/constants/authors.js';

interface AuthorDistribution {
  authorId: string;
  authorName: string;
  articleCount: number;
  articles: any[];
}

interface StrapiAuthor {
  id: number;
  documentId: string;
  name: string;
  email?: string;
  bio?: string;
  image?: any;
}

interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  author?: StrapiAuthor;
  [key: string]: any;
}

class StrapiAuthorRedistributor {
  private strapiService: typeof StrapiService;
  private authors: typeof AUTHORS;
  private strapiApiUrl: string;
  private strapiApiToken: string;

  constructor() {
    this.strapiService = StrapiService;
    this.authors = AUTHORS;
    this.strapiApiUrl =
      import.meta.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
    this.strapiApiToken = import.meta.env.STRAPI_API_TOKEN || '';
  }

  /**
   * Obtiene todos los autores de Strapi
   */
  private async getStrapiAuthors(): Promise<StrapiAuthor[]> {
    try {
      const response = await fetch(
        `${this.strapiApiUrl}/api/authors?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${this.strapiApiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error al obtener autores: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error al obtener autores de Strapi:', error);
      return [];
    }
  }

  /**
   * Actualiza el autor de un artículo en Strapi
   */
  private async updateArticleAuthor(
    articleId: number,
    authorId: number
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.strapiApiUrl}/api/articles/${articleId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.strapiApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              author: authorId,
            },
          }),
        }
      );

      if (!response.ok) {
        console.error(
          `Error al actualizar artículo ${articleId}: ${response.status} ${response.statusText}`
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error al actualizar artículo ${articleId}:`, error);
      return false;
    }
  }

  /**
   * Crea un autor en Strapi si no existe
   */
  private async createAuthorInStrapi(
    author: (typeof AUTHORS)[0]
  ): Promise<StrapiAuthor | null> {
    try {
      const response = await fetch(`${this.strapiApiUrl}/api/authors`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.strapiApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: author.name,
            email: author.email,
            bio: author.bio,
            description: author.description,
            image: author.image,
          },
        }),
      });

      if (!response.ok) {
        console.error(
          `Error al crear autor ${author.name}: ${response.status} ${response.statusText}`
        );
        return null;
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error al crear autor ${author.name}:`, error);
      return null;
    }
  }

  /**
   * Analiza la distribución actual de autores
   */
  private analyzeCurrentDistribution(
    articles: StrapiArticle[]
  ): AuthorDistribution[] {
    const distribution: { [key: string]: AuthorDistribution } = {};

    // Inicializar distribución para cada autor
    this.authors.forEach((author) => {
      distribution[author.id] = {
        authorId: author.id,
        authorName: author.name,
        articleCount: 0,
        articles: [],
      };
    });

    // Contar artículos por autor
    articles.forEach((article) => {
      if (article.author) {
        const authorName = article.author.name;
        const matchingAuthor = this.authors.find((a) => a.name === authorName);

        if (matchingAuthor) {
          distribution[matchingAuthor.id].articleCount++;
          distribution[matchingAuthor.id].articles.push(article);
        }
      }
    });

    return Object.values(distribution);
  }

  /**
   * Redistribuye los artículos de manera equilibrada
   */
  private redistributeArticles(articles: StrapiArticle[]): Map<number, string> {
    const redistribution = new Map<number, string>();

    // Filtrar artículos que tienen autor asignado
    const articlesWithAuthor = articles.filter((article) => article.author);

    // Alternar entre los dos autores
    let authorIndex = 0;

    articlesWithAuthor.forEach((article, index) => {
      const selectedAuthor = this.authors[authorIndex];
      redistribution.set(article.id, selectedAuthor.id);

      // Alternar al siguiente autor
      authorIndex = (authorIndex + 1) % this.authors.length;
    });

    return redistribution;
  }

  /**
   * Ejecuta el proceso completo de redistribución
   */
  async redistributeAuthors(): Promise<void> {
    console.log('🚀 Iniciando redistribución de autores en Strapi...\n');

    try {
      // 1. Obtener artículos de Strapi
      console.log('📊 Obteniendo artículos de Strapi...');
      const articles = await this.strapiService.getArticles();
      console.log(`✅ Se obtuvieron ${articles.length} artículos\n`);

      // 2. Analizar distribución actual
      console.log('📈 Analizando distribución actual de autores...');
      const currentDistribution = this.analyzeCurrentDistribution(articles);

      console.log('Distribución actual:');
      currentDistribution.forEach((dist) => {
        console.log(`  - ${dist.authorName}: ${dist.articleCount} artículos`);
      });
      console.log('');

      // 3. Obtener autores de Strapi
      console.log('👥 Obteniendo autores de Strapi...');
      const strapiAuthors = await this.getStrapiAuthors();
      console.log(
        `✅ Se obtuvieron ${strapiAuthors.length} autores de Strapi\n`
      );

      // 4. Verificar que existen los autores necesarios
      console.log('🔍 Verificando autores disponibles...');
      for (const author of this.authors) {
        const existingAuthor = strapiAuthors.find(
          (sa) => sa.name === author.name
        );
        if (!existingAuthor) {
          console.log(
            `⚠️  Autor "${author.name}" no existe en Strapi. Creándolo...`
          );
          await this.createAuthorInStrapi(author);
        } else {
          console.log(
            `✅ Autor "${author.name}" existe en Strapi (ID: ${existingAuthor.id})`
          );
        }
      }
      console.log('');

      // 5. Redistribuir artículos
      console.log('🔄 Redistribuyendo artículos...');
      const redistribution = this.redistributeArticles(articles);

      // Crear mapeo de nombres a IDs de Strapi
      const authorNameToStrapiId = new Map<string, number>();
      strapiAuthors.forEach((author) => {
        authorNameToStrapiId.set(author.name, author.id);
      });

      // 6. Actualizar artículos en Strapi
      console.log('💾 Actualizando artículos en Strapi...');
      let successCount = 0;
      let errorCount = 0;

      for (const [articleId, authorId] of redistribution) {
        const author = this.authors.find((a) => a.id === authorId);
        if (!author) continue;

        const strapiAuthorId = authorNameToStrapiId.get(author.name);
        if (!strapiAuthorId) continue;

        const success = await this.updateArticleAuthor(
          articleId,
          strapiAuthorId
        );
        if (success) {
          successCount++;
          console.log(`✅ Artículo ${articleId} asignado a ${author.name}`);
        } else {
          errorCount++;
          console.log(
            `❌ Error al asignar artículo ${articleId} a ${author.name}`
          );
        }

        // Pequeña pausa para no sobrecargar la API
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(`\n📊 Resumen de actualizaciones:`);
      console.log(`  ✅ Exitosas: ${successCount}`);
      console.log(`  ❌ Errores: ${errorCount}`);

      // 7. Verificar distribución final
      console.log('\n🔍 Verificando distribución final...');
      const updatedArticles = await this.strapiService.getArticles();
      const finalDistribution =
        this.analyzeCurrentDistribution(updatedArticles);

      console.log('Distribución final:');
      finalDistribution.forEach((dist) => {
        console.log(`  - ${dist.authorName}: ${dist.articleCount} artículos`);
      });

      console.log('\n🎉 ¡Redistribución de autores completada exitosamente!');
    } catch (error) {
      console.error('❌ Error durante la redistribución:', error);
      throw error;
    }
  }

  /**
   * Solo muestra el análisis sin hacer cambios
   */
  async analyzeOnly(): Promise<void> {
    console.log('🔍 Analizando distribución de autores (solo lectura)...\n');

    try {
      const articles = await this.strapiService.getArticles();
      const currentDistribution = this.analyzeCurrentDistribution(articles);

      console.log('📊 Distribución actual de autores:');
      currentDistribution.forEach((dist) => {
        console.log(`  - ${dist.authorName}: ${dist.articleCount} artículos`);
        if (dist.articles.length > 0) {
          console.log(`    Artículos:`);
          dist.articles.slice(0, 5).forEach((article) => {
            console.log(`      • ${article.title}`);
          });
          if (dist.articles.length > 5) {
            console.log(`      ... y ${dist.articles.length - 5} más`);
          }
        }
      });

      const totalArticles = articles.filter((a) => a.author).length;
      const totalWithoutAuthor = articles.length - totalArticles;

      console.log(`\n📈 Estadísticas:`);
      console.log(`  - Total de artículos: ${articles.length}`);
      console.log(`  - Artículos con autor: ${totalArticles}`);
      console.log(`  - Artículos sin autor: ${totalWithoutAuthor}`);
    } catch (error) {
      console.error('❌ Error durante el análisis:', error);
      throw error;
    }
  }
}

// Función principal para ejecutar el script
export async function redistributeStrapiAuthors(
  analyzeOnly: boolean = false
): Promise<void> {
  const redistributor = new StrapiAuthorRedistributor();

  if (analyzeOnly) {
    await redistributor.analyzeOnly();
  } else {
    await redistributor.redistributeAuthors();
  }
}

// Ejecutar si se llama directamente
if (import.meta.main) {
  const args = process.argv.slice(2);
  const analyzeOnly = args.includes('--analyze-only');

  redistributeStrapiAuthors(analyzeOnly)
    .then(() => {
      console.log('Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script falló:', error);
      process.exit(1);
    });
}
