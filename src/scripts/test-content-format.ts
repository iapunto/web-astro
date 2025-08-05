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

  async createTestArticle(contentFormat: any) {
    return await this.makeRequest('/articles', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          title: `Test Content Format ${Date.now()}`,
          slug: `test-content-format-${Date.now()}`,
          excerpt: 'Testing different content formats',
          content: contentFormat,
          quote: 'Test quote',
          featured: false,
          article_status: 'draft',
          publishedAt: new Date().toISOString(),
          metaTitle: 'Test Content Format',
          metaDescription: 'Testing different content formats',
          keywords: 'test, content, format',
          canonicalURL: '',
        },
      }),
    });
  }
}

async function testContentFormats() {
  console.log('🔍 Probando diferentes formatos de contenido...');
  const strapiService = new StrapiService();

  const formats = [
    {
      name: 'Texto simple',
      content: 'Este es un texto simple sin formato especial.',
    },
    {
      name: 'HTML básico',
      content: '<p>Este es un párrafo con <strong>HTML básico</strong>.</p>',
    },
    {
      name: 'Markdown',
      content: '## Título\n\nEste es un **texto en markdown** con formato.',
    },
    {
      name: 'Bloque simple',
      content: [
        {
          __component: 'shared.rich-text',
          body: 'Este es un bloque de rich text simple.',
        },
      ],
    },
    {
      name: 'Bloque con HTML',
      content: [
        {
          __component: 'shared.rich-text',
          body: '<h2>Título</h2><p>Este es un <strong>párrafo</strong> con HTML.</p>',
        },
      ],
    },
    {
      name: 'Múltiples bloques',
      content: [
        {
          __component: 'shared.rich-text',
          body: '<h2>Primer bloque</h2><p>Contenido del primer bloque.</p>',
        },
        {
          __component: 'shared.rich-text',
          body: '<h3>Segundo bloque</h3><p>Contenido del segundo bloque.</p>',
        },
      ],
    },
    {
      name: 'Sin campo content',
      content: null,
    },
  ];

  for (const format of formats) {
    try {
      console.log(`\n📝 Probando: ${format.name}`);
      console.log(`📦 Contenido:`, format.content);

      const result = await strapiService.createTestArticle(format.content);
      console.log(`✅ Éxito: ${format.name}`);
      console.log(`🆔 ID del artículo: ${result.data.id}`);

      // Verificar si el contenido se guardó
      if (result.data.content) {
        console.log(`📄 Contenido guardado: ${typeof result.data.content}`);
        if (Array.isArray(result.data.content)) {
          console.log(`📊 Número de bloques: ${result.data.content.length}`);
        }
      } else {
        console.log(`⚠️ Contenido no se guardó (null)`);
      }
    } catch (error) {
      console.error(`❌ Error con ${format.name}:`, error);
    }
  }
}

testContentFormats();
