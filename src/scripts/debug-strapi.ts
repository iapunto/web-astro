import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
dotenv.config();

interface MDXArticle {
  frontmatter: {
    title: string;
    description?: string;
    date: string;
    author?: string;
    category?: string;
    tags?: string[];
    featured?: boolean;
    image?: string;
    quote?: string;
    [key: string]: any;
  };
  content: string;
  slug: string;
}

interface StrapiArticle {
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    quote: string;
    featured: boolean;
    status: 'draft' | 'published';
    publishedAt: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalURL?: string;
    cover?: number;
    author?: number;
    category?: number;
    tags?: number[];
  };
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
    if (options.body) {
      console.log(`📦 Body:`, JSON.parse(options.body as string));
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`📊 Status: ${response.status} ${response.statusText}`);

      const responseText = await response.text();
      console.log(`📄 Response:`, responseText);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${responseText}`
        );
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error(`❌ Error en ${endpoint}:`, error);
      throw error;
    }
  }

  async testConnection() {
    console.log('🔍 Probando conexión con Strapi...');
    try {
      const response = await this.makeRequest('/articles');
      console.log('✅ Conexión exitosa');
      return response;
    } catch (error) {
      console.log('❌ Error de conexión');
      return null;
    }
  }

  async getContentTypes() {
    console.log('\n🔍 Obteniendo Content Types...');
    try {
      const response = await this.makeRequest('/content-manager/content-types');
      console.log('✅ Content Types obtenidos');
      return response;
    } catch (error) {
      console.log('❌ Error obteniendo Content Types');
      return null;
    }
  }

  async testCreateArticle(articleData: StrapiArticle) {
    console.log('\n🔍 Probando crear artículo...');
    try {
      const response = await this.makeRequest('/articles', {
        method: 'POST',
        body: JSON.stringify(articleData),
      });
      console.log('✅ Artículo creado exitosamente');
      return response;
    } catch (error) {
      console.log('❌ Error creando artículo');
      return null;
    }
  }

  async getArticleSchema() {
    console.log('\n🔍 Obteniendo esquema del Content Type Article...');
    try {
      const response = await this.makeRequest(
        '/content-manager/content-types/api::article.article'
      );
      console.log('✅ Esquema obtenido');
      return response;
    } catch (error) {
      console.log('❌ Error obteniendo esquema');
      return null;
    }
  }
}

async function debugStrapi() {
  console.log('🔧 Iniciando debug de Strapi...');

  // Verificar variables de entorno
  console.log('\n📋 Variables de entorno:');
  console.log(
    `- STRAPI_API_URL: ${process.env.STRAPI_API_URL || 'No configurado'}`
  );
  console.log(
    `- STRAPI_API_TOKEN: ${process.env.STRAPI_API_TOKEN ? 'Configurado' : 'No configurado'}`
  );

  if (!process.env.STRAPI_API_TOKEN) {
    console.error('❌ Error: STRAPI_API_TOKEN no está configurado');
    console.log('💡 Agrega STRAPI_API_TOKEN a tu archivo .env');
    return;
  }

  const debugService = new StrapiDebugService();

  // 1. Probar conexión
  await debugService.testConnection();

  // 2. Obtener Content Types
  const contentTypes = await debugService.getContentTypes();
  if (contentTypes) {
    console.log('\n📋 Content Types disponibles:');
    console.log(JSON.stringify(contentTypes, null, 2));
  }

  // 3. Obtener esquema del Article
  const articleSchema = await debugService.getArticleSchema();
  if (articleSchema) {
    console.log('\n📋 Esquema del Content Type Article:');
    console.log(JSON.stringify(articleSchema, null, 2));
  }

  // 4. Probar crear un artículo de ejemplo
  const sampleArticle: StrapiArticle = {
    data: {
      title: 'Artículo de Prueba',
      slug: 'articulo-de-prueba',
      content:
        '<p>Este es un artículo de prueba para verificar la configuración.</p>',
      excerpt: 'Artículo de prueba',
      quote: 'Esta es una cita de prueba',
      featured: false,
      status: 'published',
      publishedAt: '2025-08-02T00:00:00.000Z',
      metaTitle: 'Artículo de Prueba',
      metaDescription: 'Descripción de prueba',
      keywords: 'prueba, test, debug',
    },
  };

  await debugService.testCreateArticle(sampleArticle);

  console.log('\n✅ Debug completado');
  console.log('\n📝 Próximos pasos:');
  console.log('1. Verifica que los Content Types estén creados en Strapi');
  console.log('2. Verifica que el API Token tenga permisos de escritura');
  console.log('3. Verifica que la URL de Strapi sea correcta');
  console.log(
    '4. Revisa los logs anteriores para identificar el problema específico'
  );
}

// Ejecutar debug
debugStrapi();

export { debugStrapi, StrapiDebugService };
