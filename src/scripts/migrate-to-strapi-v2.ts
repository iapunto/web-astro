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
    article_status: 'draft' | 'published';
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

interface StrapiCategory {
  data: {
    name: string;
    slug: string;
    description: string;
    color?: string;
  };
}

interface StrapiTag {
  data: {
    name: string;
    slug: string;
    color?: string;
  };
}

interface StrapiAuthor {
  data: {
    name: string;
    email: string;
    bio: string;
    website?: string;
    twitter?: string;
    linkedIn?: string;
    avatar?: number;
  };
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

  async createArticle(articleData: StrapiArticle) {
    return this.makeRequest('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async updateArticle(id: number, articleData: StrapiArticle) {
    return this.makeRequest(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  }

  async findArticleBySlug(slug: string) {
    const response = await this.makeRequest(
      `/articles?filters[slug][$eq]=${slug}`
    );
    return response.data?.[0];
  }

  async createCategory(categoryData: StrapiCategory) {
    return this.makeRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async createTag(tagData: StrapiTag) {
    return this.makeRequest('/tags', {
      method: 'POST',
      body: JSON.stringify(tagData),
    });
  }

  async createAuthor(authorData: StrapiAuthor) {
    return this.makeRequest('/authors', {
      method: 'POST',
      body: JSON.stringify(authorData),
    });
  }

  async findCategoryBySlug(slug: string) {
    const response = await this.makeRequest(
      `/categories?filters[slug][$eq]=${slug}`
    );
    return response.data?.[0];
  }

  async findTagBySlug(slug: string) {
    const response = await this.makeRequest(`/tags?filters[slug][$eq]=${slug}`);
    return response.data?.[0];
  }

  async findAuthorByName(name: string) {
    const response = await this.makeRequest(
      `/authors?filters[name][$eq]=${name}`
    );
    return response.data?.[0];
  }
}

async function migrateArticlesToStrapi() {
  console.log('🚀 Iniciando migración de MDX a Strapi (v2)...');

  // Verificar variables de entorno
  if (!process.env.STRAPI_API_TOKEN) {
    console.error('❌ Error: STRAPI_API_TOKEN no está configurado');
    console.log('💡 Agrega STRAPI_API_TOKEN a tu archivo .env');
    return;
  }

  try {
    // Leer artículos MDX existentes
    const mdxDir = join(process.cwd(), 'src/content/blog');
    const mdxFiles = readdirSync(mdxDir).filter((file) =>
      file.endsWith('.mdx')
    );

    console.log(`📁 Encontrados ${mdxFiles.length} archivos MDX`);

    const articles: MDXArticle[] = [];

    // Procesar cada archivo MDX
    for (const file of mdxFiles) {
      const filePath = join(mdxDir, file);
      const fileContent = readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);
      const slug = file.replace('.mdx', '');

      articles.push({
        frontmatter: frontmatter as any,
        content,
        slug,
      });
    }

    console.log(`📊 Procesados ${articles.length} artículos`);

    // Crear categorías en Strapi
    const categories = new Set<string>();
    articles.forEach((article) => {
      if (article.frontmatter.category) {
        categories.add(article.frontmatter.category);
      }
    });

    console.log(
      `📂 Categorías encontradas: ${Array.from(categories).join(', ')}`
    );

    // Crear tags en Strapi
    const tags = new Set<string>();
    articles.forEach((article) => {
      if (article.frontmatter.tags) {
        article.frontmatter.tags.forEach((tag) => tags.add(tag));
      }
    });

    console.log(`🏷️ Tags encontrados: ${Array.from(tags).join(', ')}`);

    // Crear autor en Strapi
    const authors = new Set<string>();
    articles.forEach((article) => {
      if (article.frontmatter.author) {
        if (typeof article.frontmatter.author === 'string') {
          authors.add(article.frontmatter.author);
        } else if (
          typeof article.frontmatter.author === 'object' &&
          article.frontmatter.author &&
          'name' in article.frontmatter.author
        ) {
          authors.add((article.frontmatter.author as any).name);
        }
      }
    });

    console.log(`👤 Autores encontrados: ${Array.from(authors).join(', ')}`);

    // Inicializar StrapiService
    const strapiService = new StrapiService();

    // Crear categorías
    console.log('\n📂 Creando categorías...');
    for (const categoryName of categories) {
      await createCategoryInStrapi(categoryName, strapiService);
    }

    // Crear tags
    console.log('\n🏷️ Creando tags...');
    for (const tagName of tags) {
      await createTagInStrapi(tagName, strapiService);
    }

    // Crear autores
    console.log('\n👤 Creando autores...');
    for (const authorName of authors) {
      await createAuthorInStrapi(authorName, strapiService);
    }

    // Crear/actualizar artículos
    console.log('\n📝 Procesando artículos...');
    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      try {
        const result = await createOrUpdateArticleInStrapi(
          article,
          strapiService
        );
        if (result === 'created') {
          createdCount++;
        } else if (result === 'updated') {
          updatedCount++;
        }
      } catch (error) {
        console.error(`❌ Error procesando artículo ${article.slug}:`, error);
        errorCount++;
      }
    }

    console.log('\n✅ Migración completada exitosamente!');
    console.log('\n📋 Resumen de migración:');
    console.log(`- Artículos creados: ${createdCount}`);
    console.log(`- Artículos actualizados: ${updatedCount}`);
    console.log(`- Errores: ${errorCount}`);
    console.log(`- Total procesados: ${articles.length}`);
    console.log(`- Categorías: ${categories.size}`);
    console.log(`- Tags: ${tags.size}`);
    console.log(`- Autores: ${authors.size}`);
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
}

// Función para crear o actualizar un artículo en Strapi
async function createOrUpdateArticleInStrapi(
  article: MDXArticle,
  strapiService: StrapiService
): Promise<'created' | 'updated'> {
  try {
    // Verificar si el artículo ya existe
    const existingArticle = await strapiService.findArticleBySlug(article.slug);

    if (existingArticle) {
      console.log(
        `🔄 Actualizando artículo existente: ${article.frontmatter.title}`
      );

      // Obtener IDs de relaciones
      let authorId: number | undefined;
      let categoryId: number | undefined;
      let tagIds: number[] = [];

      if (article.frontmatter.author) {
        let authorName: string | null = null;
        if (typeof article.frontmatter.author === 'string') {
          authorName = article.frontmatter.author;
        } else if (
          typeof article.frontmatter.author === 'object' &&
          article.frontmatter.author &&
          'name' in article.frontmatter.author
        ) {
          authorName = (article.frontmatter.author as any).name;
        }

        if (authorName) {
          const author = await strapiService.findAuthorByName(authorName);
          authorId = author?.id;
        }
      }

      if (article.frontmatter.category) {
        const category = await strapiService.findCategoryBySlug(
          article.frontmatter.category.toLowerCase().replace(/\s+/g, '-')
        );
        categoryId = category?.id;
      }

      if (article.frontmatter.tags) {
        for (const tagName of article.frontmatter.tags) {
          const tag = await strapiService.findTagBySlug(
            tagName.toLowerCase().replace(/\s+/g, '-')
          );
          if (tag?.id) {
            tagIds.push(tag.id);
          }
        }
      }

      const articleData: StrapiArticle = {
        data: {
          title: article.frontmatter.title,
          slug: article.slug,
          content: article.content,
          excerpt: (article.frontmatter.description || '').substring(0, 80),
          quote: article.frontmatter.quote || '',
          featured: article.frontmatter.featured || false,
          article_status: 'draft',
          publishedAt: article.frontmatter.date,
          metaTitle: article.frontmatter.title,
          metaDescription: article.frontmatter.description,
          keywords: article.frontmatter.tags?.join(', '),
          ...(authorId && { author: authorId }),
          ...(categoryId && { category: categoryId }),
          ...(tagIds.length > 0 && { tags: tagIds }),
        },
      };

      await strapiService.updateArticle(existingArticle.id, articleData);
      console.log(`✅ Artículo actualizado: ${article.frontmatter.title}`);
      return 'updated';
    } else {
      console.log(`📝 Creando nuevo artículo: ${article.frontmatter.title}`);

      // Obtener IDs de relaciones
      let authorId: number | undefined;
      let categoryId: number | undefined;
      let tagIds: number[] = [];

      if (article.frontmatter.author) {
        let authorName: string | null = null;
        if (typeof article.frontmatter.author === 'string') {
          authorName = article.frontmatter.author;
        } else if (
          typeof article.frontmatter.author === 'object' &&
          article.frontmatter.author &&
          'name' in article.frontmatter.author
        ) {
          authorName = (article.frontmatter.author as any).name;
        }

        if (authorName) {
          const author = await strapiService.findAuthorByName(authorName);
          authorId = author?.id;
        }
      }

      if (article.frontmatter.category) {
        const category = await strapiService.findCategoryBySlug(
          article.frontmatter.category.toLowerCase().replace(/\s+/g, '-')
        );
        categoryId = category?.id;
      }

      if (article.frontmatter.tags) {
        for (const tagName of article.frontmatter.tags) {
          const tag = await strapiService.findTagBySlug(
            tagName.toLowerCase().replace(/\s+/g, '-')
          );
          if (tag?.id) {
            tagIds.push(tag.id);
          }
        }
      }

      const articleData: StrapiArticle = {
        data: {
          title: article.frontmatter.title,
          slug: article.slug,
          content: article.content,
          excerpt: (article.frontmatter.description || '').substring(0, 80),
          quote: article.frontmatter.quote || '',
          featured: article.frontmatter.featured || false,
          article_status: 'draft',
          publishedAt: article.frontmatter.date,
          metaTitle: article.frontmatter.title,
          metaDescription: article.frontmatter.description,
          keywords: article.frontmatter.tags?.join(', '),
          ...(authorId && { author: authorId }),
          ...(categoryId && { category: categoryId }),
          ...(tagIds.length > 0 && { tags: tagIds }),
        },
      };

      await strapiService.createArticle(articleData);
      console.log(`✅ Artículo creado: ${article.frontmatter.title}`);
      return 'created';
    }
  } catch (error) {
    console.error(`❌ Error procesando artículo ${article.slug}:`, error);
    throw error;
  }
}

// Función para crear categoría en Strapi
async function createCategoryInStrapi(
  name: string,
  strapiService: StrapiService
) {
  try {
    const categoryData: StrapiCategory = {
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: `Artículos sobre ${name}`,
      },
    };

    console.log(`📂 Creando categoría: ${name}`);
    await strapiService.createCategory(categoryData);
    console.log(`✅ Categoría creada: ${name}`);
  } catch (error) {
    console.error(`❌ Error creando categoría ${name}:`, error);
  }
}

// Función para crear tag en Strapi
async function createTagInStrapi(name: string, strapiService: StrapiService) {
  try {
    const tagData: StrapiTag = {
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      },
    };

    console.log(`🏷️ Creando tag: ${name}`);
    await strapiService.createTag(tagData);
    console.log(`✅ Tag creado: ${name}`);
  } catch (error) {
    console.error(`❌ Error creando tag ${name}:`, error);
  }
}

// Función para crear autor en Strapi
async function createAuthorInStrapi(
  name: string,
  strapiService: StrapiService
) {
  try {
    const authorData: StrapiAuthor = {
      data: {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@iapunto.com`,
        bio: `Autor de artículos sobre tecnología e inteligencia artificial`,
      },
    };

    console.log(`👤 Creando autor: ${name}`);
    await strapiService.createAuthor(authorData);
    console.log(`✅ Autor creado: ${name}`);
  } catch (error) {
    console.error(`❌ Error creando autor ${name}:`, error);
  }
}

// Ejecutar migración
migrateArticlesToStrapi();

export {
  migrateArticlesToStrapi,
  createOrUpdateArticleInStrapi,
  createCategoryInStrapi,
  createTagInStrapi,
  createAuthorInStrapi,
  StrapiService,
};
