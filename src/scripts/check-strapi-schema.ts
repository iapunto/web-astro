import dotenv from 'dotenv';
dotenv.config();

class StrapiService {
  private apiUrl: string;
  private apiToken: string;

  constructor() {
    this.apiUrl = process.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
    this.apiToken = process.env.STRAPI_API_TOKEN || '';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiUrl}/api${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiToken}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error en petición:', error);
      throw error;
    }
  }

  async getArticleSchema() {
    console.log('🔍 Verificando esquema de artículos...');
    return await this.makeRequest(
      '/content-type-builder/content-types/api::article.article'
    );
  }

  async getContentTypeSchema(contentType: string) {
    console.log(`🔍 Verificando esquema de ${contentType}...`);
    return await this.makeRequest(
      `/content-type-builder/content-types/api::${contentType}.${contentType}`
    );
  }
}

async function checkSchemas() {
  console.log('🔍 Verificando esquemas de Strapi...');
  const strapiService = new StrapiService();

  try {
    // Verificar esquema de artículos
    console.log('\n📋 Esquema de Artículos:');
    const articleSchema = await strapiService.getArticleSchema();
    console.log(JSON.stringify(articleSchema, null, 2));

    // Verificar esquema de autores
    console.log('\n👤 Esquema de Autores:');
    const authorSchema = await strapiService.getContentTypeSchema('author');
    console.log(JSON.stringify(authorSchema, null, 2));

    // Verificar esquema de categorías
    console.log('\n📂 Esquema de Categorías:');
    const categorySchema = await strapiService.getContentTypeSchema('category');
    console.log(JSON.stringify(categorySchema, null, 2));

    // Verificar esquema de tags
    console.log('\n🏷️ Esquema de Tags:');
    const tagSchema = await strapiService.getContentTypeSchema('tag');
    console.log(JSON.stringify(tagSchema, null, 2));
  } catch (error) {
    console.error('❌ Error verificando esquemas:', error);
  }
}

checkSchemas();
