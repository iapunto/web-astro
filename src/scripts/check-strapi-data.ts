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
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error);
      throw error;
    }
  }

  async getArticles() {
    return this.makeRequest('/articles');
  }

  async getArticleBySlug(slug: string) {
    return this.makeRequest(`/articles?filters[slug][$eq]=${slug}`);
  }

  async getCategories() {
    return this.makeRequest('/categories');
  }

  async getTags() {
    return this.makeRequest('/tags');
  }

  async getAuthors() {
    return this.makeRequest('/authors');
  }
}

async function checkStrapiData() {
  console.log('🔍 Verificando estructura de datos en Strapi...');

  if (!process.env.STRAPI_API_TOKEN) {
    console.error('❌ Error: STRAPI_API_TOKEN no está configurado');
    return;
  }

  try {
    const strapiService = new StrapiService();

    // Verificar artículos
    console.log('\n📝 Verificando artículos...');
    const articlesResponse = await strapiService.getArticles();
    console.log('📊 Respuesta completa de artículos:');
    console.log(JSON.stringify(articlesResponse, null, 2));

    if (articlesResponse.data && articlesResponse.data.length > 0) {
      console.log('\n📋 Primer artículo:');
      console.log(JSON.stringify(articlesResponse.data[0], null, 2));
    }

    // Verificar un artículo específico por slug
    console.log('\n🔍 Verificando artículo específico...');
    const specificArticle = await strapiService.getArticleBySlug(
      'vogue-ia-adios-modelos'
    );
    console.log('📋 Artículo específico:');
    console.log(JSON.stringify(specificArticle, null, 2));

    // Verificar categorías
    console.log('\n📂 Verificando categorías...');
    const categoriesResponse = await strapiService.getCategories();
    console.log('📊 Categorías:');
    console.log(JSON.stringify(categoriesResponse, null, 2));

    // Verificar tags
    console.log('\n🏷️ Verificando tags...');
    const tagsResponse = await strapiService.getTags();
    console.log('📊 Tags:');
    console.log(JSON.stringify(tagsResponse, null, 2));

    // Verificar autores
    console.log('\n👤 Verificando autores...');
    const authorsResponse = await strapiService.getAuthors();
    console.log('📊 Autores:');
    console.log(JSON.stringify(authorsResponse, null, 2));
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

// Ejecutar verificación
checkStrapiData();
