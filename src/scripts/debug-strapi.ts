import dotenv from 'dotenv';
dotenv.config();

interface StrapiResponse {
  data: any;
  meta?: any;
  error?: any;
}

class StrapiDebugService {
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
    console.log(`📋 Headers:`, headers);
    console.log(`📦 Body:`, options.body);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`📊 Status: ${response.status}`);
      console.log(
        `📋 Response Headers:`,
        Object.fromEntries(response.headers.entries())
      );

      const responseText = await response.text();
      console.log(`📄 Response Body:`, responseText);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${responseText}`
        );
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error(`❌ Error en petición a ${endpoint}:`, error);
      throw error;
    }
  }

  async testConnection() {
    console.log('🔍 Probando conexión con Strapi...');
    console.log(`🌐 URL: ${this.apiUrl}`);
    console.log(
      `🔑 Token: ${this.apiToken ? 'Configurado' : 'NO CONFIGURADO'}`
    );

    try {
      // Probar endpoint básico
      const response = await this.makeRequest('/');
      console.log('✅ Conexión exitosa');
      return response;
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return null;
    }
  }

  async testContentTypes() {
    console.log('\n📋 Probando Content Types...');

    const contentTypes = ['articles', 'categories', 'tags', 'authors'];

    for (const contentType of contentTypes) {
      try {
        console.log(`\n🔍 Probando /${contentType}...`);
        const response = await this.makeRequest(`/${contentType}`);
        console.log(`✅ ${contentType} disponible`);
      } catch (error) {
        console.log(`❌ ${contentType} no disponible o error:`, error);
      }
    }
  }

  async testCreateArticle() {
    console.log('\n📝 Probando creación de artículo...');

    const testArticle = {
      data: {
        title: 'Artículo de Prueba',
        slug: 'articulo-prueba',
        content:
          'Este es un artículo de prueba para verificar la configuración.',
        excerpt: 'Artículo de prueba',
        quote: '',
        featured: false,
        article_status: 'draft',
        publishedAt: new Date().toISOString(),
        metaTitle: 'Artículo de Prueba',
        metaDescription: 'Artículo de prueba para verificar configuración',
      },
    };

    try {
      const response = await this.makeRequest('/articles', {
        method: 'POST',
        body: JSON.stringify(testArticle),
      });
      console.log('✅ Artículo de prueba creado exitosamente');
      return response;
    } catch (error) {
      console.error('❌ Error creando artículo de prueba:', error);
      return null;
    }
  }

  async testCreateCategory() {
    console.log('\n📂 Probando creación de categoría...');

    const testCategory = {
      data: {
        name: 'Categoría de Prueba',
        slug: 'categoria-prueba',
        description: 'Categoría de prueba para verificar configuración',
      },
    };

    try {
      const response = await this.makeRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(testCategory),
      });
      console.log('✅ Categoría de prueba creada exitosamente');
      return response;
    } catch (error) {
      console.error('❌ Error creando categoría de prueba:', error);
      return null;
    }
  }

  async testCreateTag() {
    console.log('\n🏷️ Probando creación de tag...');

    const testTag = {
      data: {
        name: 'Tag de Prueba',
        slug: 'tag-prueba',
      },
    };

    try {
      const response = await this.makeRequest('/tags', {
        method: 'POST',
        body: JSON.stringify(testTag),
      });
      console.log('✅ Tag de prueba creado exitosamente');
      return response;
    } catch (error) {
      console.error('❌ Error creando tag de prueba:', error);
      return null;
    }
  }

  async testCreateAuthor() {
    console.log('\n👤 Probando creación de autor...');

    const testAuthor = {
      data: {
        name: 'Autor de Prueba',
        email: 'autor.prueba@iapunto.com',
        bio: 'Autor de prueba para verificar configuración',
      },
    };

    try {
      const response = await this.makeRequest('/authors', {
        method: 'POST',
        body: JSON.stringify(testAuthor),
      });
      console.log('✅ Autor de prueba creado exitosamente');
      return response;
    } catch (error) {
      console.error('❌ Error creando autor de prueba:', error);
      return null;
    }
  }

  async runFullDebug() {
    console.log('🚀 Iniciando debug completo de Strapi...\n');

    // Verificar variables de entorno
    if (!process.env.STRAPI_API_TOKEN) {
      console.error('❌ Error: STRAPI_API_TOKEN no está configurado');
      console.log('💡 Agrega STRAPI_API_TOKEN a tu archivo .env');
      return;
    }

    // Probar conexión básica
    await this.testConnection();

    // Probar content types
    await this.testContentTypes();

    // Probar creación de entidades
    await this.testCreateCategory();
    await this.testCreateTag();
    await this.testCreateAuthor();
    await this.testCreateArticle();

    console.log('\n🎯 Debug completado!');
    console.log('\n📋 Resumen de configuración necesaria:');
    console.log('1. Verificar que STRAPI_API_TOKEN esté configurado');
    console.log('2. Verificar que la URL de Strapi sea correcta');
    console.log('3. Verificar que los Content Types estén creados en Strapi');
    console.log('4. Verificar permisos de la API Token');
  }
}

// Ejecutar debug
const debugService = new StrapiDebugService();
debugService.runFullDebug();

export { StrapiDebugService };
