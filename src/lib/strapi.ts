import type { StrapiResponse, StrapiArticle } from './types/strapi';

// Usar process.env para variables de entorno del servidor
const STRAPI_API_URL =
  process.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export class StrapiService {
  // Strapi v5: query para popular las relaciones de artículos explícitamente
  private static readonly ARTICLE_POPULATE_QUERY = [
    'populate[cover][fields][0]=url',
    'populate[cover][fields][1]=formats',
    'populate[cover][fields][2]=alternativeText',
    'populate[cover][fields][3]=name',
    'populate[author][fields][0]=name',
    'populate[author][fields][1]=email',
    'populate[author][populate][avatar][fields][0]=url',
    'populate[category][fields][0]=name',
    'populate[category][fields][1]=slug',
    'populate[category][fields][2]=description',
    'populate[subcategory][fields][0]=name',
    'populate[subcategory][fields][1]=slug',
    'populate[tags][fields][0]=name',
    'populate[tags][fields][1]=slug',
  ].join('&');

  private static async fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${STRAPI_API_URL}/api${endpoint}`;

    console.log(`🔗 [StrapiService] Fetching: ${url}`);
    console.log(
      `🔑 [StrapiService] Token configured: ${STRAPI_API_TOKEN ? 'YES' : 'NO'}`
    );

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      console.log(
        `📡 [StrapiService] Response: ${response.status} ${response.statusText}`
      );

      if (!response.ok) {
        throw new Error(
          `Strapi API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(
        `📊 [StrapiService] Data received: ${data.data?.length || 0} items`
      );

      return data;
    } catch (error) {
      console.error('❌ [StrapiService] Error fetching from Strapi:', error);
      throw error;
    }
  }

  static async getArticles(): Promise<StrapiArticle[]> {
    try {
      // Obtener todos los artículos usando múltiples páginas
      let allArticles: StrapiArticle[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(
          `/articles?${this.ARTICLE_POPULATE_QUERY}&sort[0]=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=100`
        );

        if (response.data && response.data.length > 0) {
          // Strapi v5: los datos están directamente en el array, no en attributes
          const articles = response.data.map((article: any) => ({
            id: article.id,
            documentId: article.documentId,
            title: article.title,
            slug: article.slug,
            description: article.description,
            content: article.content,
            excerpt: article.excerpt,
            publishedAt: article.publishedAt,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            cover: article.cover,
            coverAlt: article.coverAlt,
            epicQuote: article.epicQuote,
            author: article.author,
            category: article.category,
            subcategory: article.subcategory,
            tags: article.tags || [],
            quote: article.quote,
            article_status: article.article_status,
          }));

          allArticles = allArticles.concat(articles);

          // Verificar si hay más páginas
          const pagination = response.meta?.pagination;
          if (pagination && page < pagination.pageCount) {
            page++;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
      }

      console.log(
        `📊 StrapiService: Obtenidos ${allArticles.length} artículos de ${page} páginas - V5 CORREGIDO`
      );
      return allArticles;
    } catch (error) {
      console.error(
        'Error fetching articles from Strapi, intentando fallback:',
        error
      );

      // Fallback: usar endpoint especializado de Strapi
      try {
        console.log(
          '🔄 Intentando fallback via endpoint especializado de Strapi...'
        );
        const fallbackResponse = await fetch('/api/strapi-articles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (
            fallbackData.success &&
            fallbackData.articles &&
            fallbackData.articles.length > 0
          ) {
            console.log(
              `📊 Fallback exitoso: ${fallbackData.articles.length} artículos obtenidos via ${fallbackData.source}`
            );
            return fallbackData.articles;
          }
        } else {
          console.error(
            `❌ Fallback failed: ${fallbackResponse.status} ${fallbackResponse.statusText}`
          );
        }
      } catch (fallbackError) {
        console.error('❌ Error en fallback:', fallbackError);
      }

      return [];
    }
  }

  static async getArticle(slug: string): Promise<StrapiArticle | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(
        `/articles?filters[slug][$eq]=${slug}&${this.ARTICLE_POPULATE_QUERY}`
      );
      const article = response.data?.[0];

      if (article) {
        // Strapi v5: mapear la estructura correcta
        return {
          id: article.id,
          documentId: article.documentId,
          title: article.title,
          slug: article.slug,
          description: article.description,
          content: article.content,
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          cover: article.cover,
          coverAlt: article.coverAlt,
          epicQuote: article.epicQuote,
          author: article.author,
          category: article.category,
          subcategory: article.subcategory,
          tags: article.tags || [],
          quote: article.quote,
          article_status: article.article_status,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching article from Strapi:', error);
      return null;
    }
  }

  static async getCategories(): Promise<any[]> {
    try {
      // Strapi v5: las categorías no necesitan relaciones complejas
      const response = await this.fetchAPI<StrapiResponse<any[]>>(
        '/categories?fields[0]=name&fields[1]=slug&fields[2]=description'
      );
      // Strapi v5: mapear estructura correcta
      return (
        response.data?.map((category: any) => ({
          id: category.id,
          documentId: category.documentId,
          name: category.name,
          slug: category.slug,
          description: category.description,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          publishedAt: category.publishedAt,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching categories from Strapi:', error);
      return [];
    }
  }

  static async getTags(): Promise<any[]> {
    try {
      // Strapi v5: los tags no necesitan relaciones complejas
      const response = await this.fetchAPI<StrapiResponse<any[]>>(
        '/tags?fields[0]=name&fields[1]=slug&fields[2]=description'
      );
      // Strapi v5: mapear estructura correcta
      return (
        response.data?.map((tag: any) => ({
          id: tag.id,
          documentId: tag.documentId,
          name: tag.name,
          slug: tag.slug,
          description: tag.description,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
          publishedAt: tag.publishedAt,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching tags from Strapi:', error);
      return [];
    }
  }

  static async searchArticles(query: string): Promise<StrapiArticle[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(
        `/articles?filters[$or][0][title][$containsi]=${query}&filters[$or][1][content][$containsi]=${query}&${this.ARTICLE_POPULATE_QUERY}&sort[0]=publishedAt:desc`
      );
      // Strapi v5: mapear estructura correcta
      return (
        response.data?.map((article: any) => ({
          id: article.id,
          documentId: article.documentId,
          title: article.title,
          slug: article.slug,
          description: article.description,
          content: article.content,
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          cover: article.cover,
          coverAlt: article.coverAlt,
          epicQuote: article.epicQuote,
          author: article.author,
          category: article.category,
          subcategory: article.subcategory,
          tags: article.tags || [],
          quote: article.quote,
          article_status: article.article_status,
        })) || []
      );
    } catch (error) {
      console.error('Error searching articles in Strapi:', error);
      return [];
    }
  }

  static async getArticlesByCategory(
    categorySlug: string
  ): Promise<StrapiArticle[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(
        `/articles?filters[category][slug][$eq]=${categorySlug}&${this.ARTICLE_POPULATE_QUERY}&sort[0]=publishedAt:desc`
      );
      // Strapi v5: mapear estructura correcta
      return (
        response.data?.map((article: any) => ({
          id: article.id,
          documentId: article.documentId,
          title: article.title,
          slug: article.slug,
          description: article.description,
          content: article.content,
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          cover: article.cover,
          coverAlt: article.coverAlt,
          epicQuote: article.epicQuote,
          author: article.author,
          category: article.category,
          subcategory: article.subcategory,
          tags: article.tags || [],
          quote: article.quote,
          article_status: article.article_status,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching articles by category from Strapi:', error);
      return [];
    }
  }

  static async getArticlesByTag(tagSlug: string): Promise<StrapiArticle[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(
        `/articles?filters[tags][slug][$eq]=${tagSlug}&${this.ARTICLE_POPULATE_QUERY}&sort[0]=publishedAt:desc`
      );
      // Strapi v5: mapear estructura correcta
      return (
        response.data?.map((article: any) => ({
          id: article.id,
          documentId: article.documentId,
          title: article.title,
          slug: article.slug,
          description: article.description,
          content: article.content,
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          cover: article.cover,
          coverAlt: article.coverAlt,
          epicQuote: article.epicQuote,
          author: article.author,
          category: article.category,
          subcategory: article.subcategory,
          tags: article.tags || [],
          quote: article.quote,
          article_status: article.article_status,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching articles by tag from Strapi:', error);
      return [];
    }
  }
}
