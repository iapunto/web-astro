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

  async getContentTypeSchema() {
    return await this.makeRequest(
      '/content-type-builder/content-types/api::article.article'
    );
  }

  async getComponentSchema(componentUid: string) {
    return await this.makeRequest(
      `/content-type-builder/components/${componentUid}`
    );
  }

  async getArticleSchema() {
    return await this.makeRequest(
      '/content-type-builder/content-types/api::article.article'
    );
  }
}

async function checkComponentConfig() {
  console.log('🔍 Verificando configuración de componentes...');
  const strapiService = new StrapiService();

  try {
    console.log('\n📋 Esquema del Content Type Article:');
    const articleSchema = await strapiService.getArticleSchema();
    console.log(JSON.stringify(articleSchema, null, 2));

    console.log('\n📋 Esquema del componente shared.rich-text:');
    const richTextSchema =
      await strapiService.getComponentSchema('shared.rich-text');
    console.log(JSON.stringify(richTextSchema, null, 2));
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkComponentConfig();
