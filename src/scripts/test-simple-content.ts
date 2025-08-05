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

  async createTestArticle() {
    return await this.makeRequest('/articles', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          title: 'Test Article with Simple Content',
          slug: 'test-simple-content',
          excerpt: 'This is a test article with simple content.',
          content: 'This is a simple test content without blocks.',
          quote: 'Test quote',
          featured: false,
          article_status: 'draft',
          publishedAt: new Date().toISOString(),
          metaTitle: 'Test Article with Simple Content',
          metaDescription: 'This is a test article with simple content.',
          keywords: 'test, content, simple',
          canonicalURL: '',
        },
      }),
    });
  }
}

async function testSimpleContent() {
  console.log('🔍 Probando contenido simple...');
  const strapiService = new StrapiService();

  try {
    const result = await strapiService.createTestArticle();
    console.log('✅ Artículo creado exitosamente:', result);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testSimpleContent();
