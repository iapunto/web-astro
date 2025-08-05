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

    console.log(`🔍 Haciendo petición a: ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`📊 Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ Error response: ${errorText}`);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log(`✅ Success response:`, JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('❌ Error en petición:', error);
      throw error;
    }
  }

  async getArticleById(id: number) {
    return await this.makeRequest(`/articles/${id}`);
  }

  async getArticleBySlug(slug: string) {
    return await this.makeRequest(`/articles?filters[slug][$eq]=${slug}`);
  }

  async updateArticleContent(id: number, content: any) {
    return await this.makeRequest(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          content: content,
        },
      }),
    });
  }
}

async function testSingleArticle() {
  console.log('🔍 Probando un solo artículo...');
  const strapiService = new StrapiService();

  try {
    // Probar con el artículo de Vogue que sabemos que existe
    const slug = 'vogue-ia-adios-modelos';
    console.log(`\n📝 Probando artículo: ${slug}`);

    // Buscar por slug
    console.log('\n1️⃣ Buscando por slug...');
    const articleBySlug = await strapiService.getArticleBySlug(slug);

    if (articleBySlug.data && articleBySlug.data.length > 0) {
      const article = articleBySlug.data[0];
      console.log(`✅ Artículo encontrado con ID: ${article.id}`);

      // Intentar obtener por ID
      console.log('\n2️⃣ Buscando por ID...');
      const articleById = await strapiService.getArticleById(article.id);

      // Intentar actualizar contenido
      console.log('\n3️⃣ Intentando actualizar contenido...');
      const contentBlocks = [
        {
          __component: 'shared.rich-text',
          body: 'Este es un contenido de prueba para verificar que funciona.',
          title: null,
        },
      ];

      await strapiService.updateArticleContent(article.id, contentBlocks);
      console.log('✅ Contenido actualizado exitosamente');
    } else {
      console.log('❌ Artículo no encontrado por slug');
    }
  } catch (error) {
    console.error('❌ Error en prueba:', error);
  }
}

testSingleArticle();
