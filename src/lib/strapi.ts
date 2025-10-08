import type { StrapiResponse, StrapiArticle } from './types/strapi.js';
import { STRAPI_API_URL, STRAPI_API_TOKEN } from './env.js';

export class StrapiService {
  // Strapi v5: usar populate=* que sí funciona (el problema era el token)
  private static readonly ARTICLE_POPULATE_QUERY = 'populate=*';

  private static async fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${STRAPI_API_URL}/api${endpoint}`;

    // Logging detallado para depuración
    console.log('═'.repeat(80));
    console.log('🔗 [StrapiService] === FETCH API DEBUG ===');
    console.log(`🔗 [StrapiService] URL Base: ${STRAPI_API_URL}`);
    console.log(`🔗 [StrapiService] Endpoint: ${endpoint}`);
    console.log(`🔗 [StrapiService] Full URL: ${url}`);
    console.log(
      `🔑 [StrapiService] Token configured: ${STRAPI_API_TOKEN ? 'YES' : 'NO'}`
    );
    console.log(
      `🔑 [StrapiService] Token length: ${STRAPI_API_TOKEN?.length || 0}`
    );
    console.log(
      `🔑 [StrapiService] Token preview: ${STRAPI_API_TOKEN ? STRAPI_API_TOKEN.substring(0, 20) + '...' : 'NONE'}`
    );
    console.log('═'.repeat(80));

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

    console.log(
      '📤 [StrapiService] Request headers:',
      JSON.stringify(Object.keys(defaultOptions.headers || {}))
    );

    let response: Response;
    let usedMethod = 'native-fetch';

    try {
      console.log(
        '🧪 [StrapiService] Intentando con fetch nativo (timeout: 30s)...'
      );
      response = await fetch(url, {
        ...defaultOptions,
        signal: AbortSignal.timeout(30000), // 30 segundos para Coolify
      });
      console.log('✅ [StrapiService] Fetch nativo exitoso');
    } catch (nativeFetchError) {
      console.error('❌ [StrapiService] Fetch nativo falló:', nativeFetchError);
      console.log(
        '🔄 [StrapiService] Intentando con node-fetch (timeout: 30s, keepalive)...'
      );

      try {
        const nodeFetch = (await import('node-fetch')).default;
        const https = await import('https');

        // Configurar agente con keepalive para conexiones lentas
        const agent = new https.Agent({
          keepAlive: true,
          keepAliveMsecs: 1000,
          maxSockets: 50,
          maxFreeSockets: 10,
          timeout: 30000,
        });

        response = (await nodeFetch(url, {
          ...defaultOptions,
          timeout: 30000,
          agent,
        } as any)) as any;
        usedMethod = 'node-fetch';
        console.log('✅ [StrapiService] node-fetch exitoso');
      } catch (nodeFetchError) {
        console.error(
          '❌ [StrapiService] node-fetch también falló:',
          nodeFetchError
        );
        throw new Error(
          `Ambos métodos de fetch fallaron. Native: ${nativeFetchError instanceof Error ? nativeFetchError.message : String(nativeFetchError)}, Node: ${nodeFetchError instanceof Error ? nodeFetchError.message : String(nodeFetchError)}`
        );
      }
    }

    console.log('═'.repeat(80));
    console.log(`📡 [StrapiService] Response status: ${response.status}`);
    console.log(
      `📡 [StrapiService] Response statusText: ${response.statusText}`
    );
    console.log(`📡 [StrapiService] Response ok: ${response.ok}`);
    console.log(`📡 [StrapiService] Method used: ${usedMethod}`);
    console.log('═'.repeat(80));

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        '❌ [StrapiService] Error response body:',
        errorBody.substring(0, 500)
      );
      throw new Error(
        `Strapi API error: ${response.status} ${response.statusText} - ${errorBody.substring(0, 100)}`
      );
    }

    const data = await response.json();
    console.log('═'.repeat(80));
    console.log(`📊 [StrapiService] Data received successfully`);
    console.log(`📊 [StrapiService] Items count: ${data.data?.length || 0}`);
    console.log(`📊 [StrapiService] Has meta: ${!!data.meta}`);
    console.log(
      `📊 [StrapiService] Pagination: ${JSON.stringify(data.meta?.pagination || {})}`
    );
    console.log('═'.repeat(80));

    return data;
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
