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
    author?: string | { name: string; description?: string; image?: string };
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
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error en petición:', error);
      throw error;
    }
  }

  async findAuthorByName(name: string) {
    const response = await this.makeRequest(
      `/authors?filters[name][$eq]=${encodeURIComponent(name)}`
    );
    return response.data && response.data.length > 0 ? response.data[0] : null;
  }

  async findCategoryBySlug(slug: string) {
    const response = await this.makeRequest(
      `/categories?filters[slug][$eq]=${slug}`
    );
    return response.data && response.data.length > 0 ? response.data[0] : null;
  }

  async findTagBySlug(slug: string) {
    const response = await this.makeRequest(`/tags?filters[slug][$eq]=${slug}`);
    return response.data && response.data.length > 0 ? response.data[0] : null;
  }

  async createArticle(articleData: any) {
    return await this.makeRequest('/articles', {
      method: 'POST',
      body: JSON.stringify({ data: articleData }),
    });
  }
}

function convertContentToBlocks(content: string) {
  // Convertir el contenido MDX a bloques usando el campo block con dynamiczone
  return [
    {
      __component: 'shared.rich-text',
      body: content, // Strapi manejará esto como richtext automáticamente
    },
  ];
}

async function migrateWithCorrectBlocks() {
  console.log('🔍 Ejecutando migración con bloques correctos...');
  const strapiService = new StrapiService();

  try {
    // Leer artículos MDX existentes
    const mdxDir = join(process.cwd(), 'src/content/blog');
    const mdxFiles = readdirSync(mdxDir).filter((file) =>
      file.endsWith('.mdx')
    );

    console.log(`📁 Encontrados ${mdxFiles.length} archivos MDX`);

    let createdCount = 0;
    let errorCount = 0;

    for (const file of mdxFiles) {
      try {
        const filePath = join(mdxDir, file);
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);
        const slug = file.replace('.mdx', '');

        console.log(`\n📝 Procesando: ${slug}`);

        // Manejar autor
        let authorId = null;
        if (frontmatter.author) {
          let authorName: string;
          if (typeof frontmatter.author === 'string') {
            authorName = frontmatter.author;
          } else if (
            typeof frontmatter.author === 'object' &&
            frontmatter.author &&
            'name' in frontmatter.author
          ) {
            authorName = (frontmatter.author as any).name;
          } else {
            console.warn(
              `⚠️ Formato de autor no reconocido en ${slug}:`,
              frontmatter.author
            );
            continue;
          }

          const author = await strapiService.findAuthorByName(authorName);
          authorId = author?.id;
        }

        // Manejar categoría
        let categoryId = null;
        if (frontmatter.category) {
          const category = await strapiService.findCategoryBySlug(
            frontmatter.category.toLowerCase().replace(/\s+/g, '-')
          );
          categoryId = category?.id;
        }

        // Manejar tags
        let tagIds: number[] = [];
        if (Array.isArray(frontmatter.tags)) {
          for (const tag of frontmatter.tags) {
            const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
            const tagData = await strapiService.findTagBySlug(tagSlug);
            if (tagData) {
              tagIds.push(tagData.id);
            }
          }
        }

        // Convertir contenido a bloques usando el campo block
        const contentBlocks = convertContentToBlocks(content);

        // Crear datos del artículo usando el campo block
        const articleData = {
          title: frontmatter.title,
          slug: `${slug}-correct-blocks`, // Usar un slug diferente para evitar conflictos
          excerpt: (frontmatter.description || '').substring(0, 80),
          block: contentBlocks, // Usar el campo block en lugar de content
          image: frontmatter.image,
          quote: frontmatter.quote,
          featured: frontmatter.featured || false,
          article_status: 'draft',
          publishedAt: frontmatter.date,
          metaTitle: frontmatter.metaTitle || frontmatter.title,
          metaDescription:
            frontmatter.metaDescription || frontmatter.description,
          keywords: frontmatter.keywords
            ? Array.isArray(frontmatter.keywords)
              ? frontmatter.keywords.join(', ')
              : frontmatter.keywords
            : '',
          canonicalURL: frontmatter.canonicalURL || '',
          ...(authorId && { author: authorId }),
          ...(categoryId && { category: categoryId }),
          ...(tagIds.length > 0 && { tags: tagIds }),
        };

        // Crear el artículo
        await strapiService.createArticle(articleData);
        console.log(`✅ Artículo creado: ${slug}-correct-blocks`);
        createdCount++;
      } catch (error) {
        console.error(`❌ Error procesando ${file}:`, error);
        errorCount++;
      }
    }

    console.log(`\n🎉 Proceso completado:`);
    console.log(`✅ Artículos creados: ${createdCount}`);
    console.log(`❌ Errores: ${errorCount}`);
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

migrateWithCorrectBlocks();
