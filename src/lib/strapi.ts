import type { StrapiResponse, StrapiArticle } from './types/strapi';

const STRAPI_API_URL = import.meta.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

export class StrapiService {
  private static async fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${STRAPI_API_URL}/api${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching from Strapi:', error);
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
          `/articles?populate=*&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=100`
        );
        
        if (response.data && response.data.length > 0) {
          allArticles = allArticles.concat(response.data);
          
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
      
      console.log(`📊 StrapiService: Obtenidos ${allArticles.length} artículos de ${page} páginas`);
      return allArticles;
    } catch (error) {
      console.error('Error fetching articles from Strapi:', error);
      return [];
    }
  }

  static async getArticle(slug: string): Promise<StrapiArticle | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(`/articles?filters[slug][$eq]=${slug}&populate=*`);
      return response.data?.[0] || null;
    } catch (error) {
      console.error('Error fetching article from Strapi:', error);
      return null;
    }
  }

  static async getCategories(): Promise<any[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<any[]>>('/categories?populate=*');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching categories from Strapi:', error);
      return [];
    }
  }

  static async getTags(): Promise<any[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<any[]>>('/tags?populate=*');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tags from Strapi:', error);
      return [];
    }
  }

  static async searchArticles(query: string): Promise<StrapiArticle[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(
        `/articles?filters[$or][0][title][$containsi]=${query}&filters[$or][1][content][$containsi]=${query}&populate=*&sort=publishedAt:desc`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error searching articles in Strapi:', error);
      return [];
    }
  }

  static async getArticlesByCategory(categorySlug: string): Promise<StrapiArticle[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(
        `/articles?filters[category][slug][$eq]=${categorySlug}&populate=*&sort=publishedAt:desc`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching articles by category from Strapi:', error);
      return [];
    }
  }

  static async getArticlesByTag(tagSlug: string): Promise<StrapiArticle[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(
        `/articles?filters[tags][slug][$eq]=${tagSlug}&populate=*&sort=publishedAt:desc`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching articles by tag from Strapi:', error);
      return [];
    }
  }
} 