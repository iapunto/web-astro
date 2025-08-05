import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
dotenv.config();

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
    console.log(`📦 Body:`, options.body);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`📊 Status: ${response.status}`);

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

  async testCreateArticle(articleData: any) {
    console.log('\n📝 Probando creación de artículo...');
    console.log('📋 Datos del artículo:');
    console.log(JSON.stringify(articleData, null, 2));

    try {
      const response = await this.makeRequest('/articles', {
        method: 'POST',
        body: JSON.stringify(articleData),
      });
      console.log('✅ Artículo creado exitosamente');
      return response;
    } catch (error) {
      console.error('❌ Error creando artículo:', error);
      return null;
    }
  }
}

async function debugSingleArticle() {
  console.log('🚀 Debuggeando un solo artículo...');

  // Verificar variables de entorno
  if (!process.env.STRAPI_API_TOKEN) {
    console.error('❌ Error: STRAPI_API_TOKEN no está configurado');
    return;
  }

  try {
    // Leer un archivo específico para debug
    const testFile = 'vogue-ia-adios-modelos.mdx';
    console.log(`📁 Probando con archivo: ${testFile}`);

    const filePath = join(process.cwd(), 'src/content/blog', testFile);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    const slug = testFile.replace('.mdx', '');

    console.log('\n📋 Frontmatter extraído:');
    console.log(JSON.stringify(frontmatter, null, 2));

    // Manejar autor (puede ser string u objeto)
    let authorName: string | null = null;
    if (typeof frontmatter.author === 'string') {
      authorName = frontmatter.author;
    } else if (
      typeof frontmatter.author === 'object' &&
      frontmatter.author &&
      'name' in frontmatter.author
    ) {
      authorName = (frontmatter.author as any).name;
    }

    console.log(`\n👤 Autor extraído: ${authorName}`);

    // Crear datos del artículo como lo haría el script de migración
    const articleData = {
      data: {
        title: frontmatter.title,
        slug: slug,
        content: content,
        excerpt: (frontmatter.description || '').substring(0, 80),
        quote: frontmatter.quote || '',
        featured: frontmatter.featured || false,
        article_status: 'draft',
        publishedAt: frontmatter.date,
        metaTitle: frontmatter.title,
        metaDescription: frontmatter.description,
        keywords: frontmatter.tags?.join(', '),
      },
    };

    // Probar creación
    const debugService = new StrapiDebugService();
    await debugService.testCreateArticle(articleData);
  } catch (error) {
    console.error('❌ Error durante el debug:', error);
  }
}

// Ejecutar debug
debugSingleArticle();
