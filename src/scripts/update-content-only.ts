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

  async updateArticleContent(id: number, content: string) {
    return this.makeRequest(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          content: content,
        },
      }),
    });
  }

  async findArticleBySlug(slug: string) {
    const response = await this.makeRequest(
      `/articles?filters[slug][$eq]=${slug}`
    );
    return response.data?.[0];
  }
}

async function updateContentOnly() {
  console.log('🚀 Actualizando solo el contenido de los artículos...');

  if (!process.env.STRAPI_API_TOKEN) {
    console.error('❌ Error: STRAPI_API_TOKEN no está configurado');
    return;
  }

  try {
    // Leer artículos MDX existentes
    const mdxDir = join(process.cwd(), 'src/content/blog');
    const mdxFiles = readdirSync(mdxDir).filter((file) =>
      file.endsWith('.mdx')
    );

    console.log(`📁 Encontrados ${mdxFiles.length} archivos MDX`);

    const strapiService = new StrapiService();
    let updatedCount = 0;
    let errorCount = 0;

    for (const file of mdxFiles) {
      try {
        const filePath = join(mdxDir, file);
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);
        const slug = file.replace('.mdx', '');

        console.log(`📝 Procesando: ${frontmatter.title}`);

        // Buscar el artículo en Strapi
        const existingArticle = await strapiService.findArticleBySlug(slug);

        if (existingArticle) {
          console.log(
            `🔄 Actualizando contenido para: ${frontmatter.title} (ID: ${existingArticle.id})`
          );

          // Actualizar solo el contenido
          await strapiService.updateArticleContent(existingArticle.id, content);
          console.log(`✅ Contenido actualizado: ${frontmatter.title}`);
          updatedCount++;
        } else {
          console.log(`⚠️ Artículo no encontrado en Strapi: ${slug}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Error procesando ${file}:`, error);
        errorCount++;
      }
    }

    console.log('\n✅ Actualización de contenido completada!');
    console.log(`📋 Resumen:`);
    console.log(`- Artículos actualizados: ${updatedCount}`);
    console.log(`- Errores: ${errorCount}`);
    console.log(`- Total procesados: ${mdxFiles.length}`);
  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
  }
}

// Ejecutar actualización
updateContentOnly();
