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
    console.log('\n📝 Probando creación de artículo con datos reales...');
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

async function debugMigration() {
  console.log('🚀 Iniciando debug de migración...');

  // Verificar variables de entorno
  if (!process.env.STRAPI_API_TOKEN) {
    console.error('❌ Error: STRAPI_API_TOKEN no está configurado');
    return;
  }

  try {
    // Leer un solo archivo MDX para probar
    const mdxDir = join(process.cwd(), 'src/content/blog');
    const mdxFiles = readdirSync(mdxDir).filter((file) =>
      file.endsWith('.mdx')
    );

    if (mdxFiles.length === 0) {
      console.error('❌ No se encontraron archivos MDX');
      return;
    }

    // Tomar el primer archivo para debug
    const testFile = mdxFiles[0];
    console.log(`📁 Probando con archivo: ${testFile}`);

    const filePath = join(mdxDir, testFile);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    const slug = testFile.replace('.mdx', '');

    console.log('\n📋 Frontmatter extraído:');
    console.log(JSON.stringify(frontmatter, null, 2));

    console.log('\n📄 Contenido extraído (primeros 200 caracteres):');
    console.log(content.substring(0, 200) + '...');

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
debugMigration();
