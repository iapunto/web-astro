import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { StrapiService } from '../lib/strapi';

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

async function migrateArticlesToStrapi() {
  console.log('🚀 Iniciando migración de MDX a Strapi...');

  try {
    // Leer artículos MDX existentes
    const mdxDir = join(process.cwd(), 'src/content/blog');
    const mdxFiles = readdirSync(mdxDir).filter(file => file.endsWith('.mdx'));

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
        slug
      });
    }

    console.log(`📊 Procesados ${articles.length} artículos`);

    // Crear categorías en Strapi
    const categories = new Set<string>();
    articles.forEach(article => {
      if (article.frontmatter.category) {
        categories.add(article.frontmatter.category);
      }
    });

    console.log(`📂 Categorías encontradas: ${Array.from(categories).join(', ')}`);

    // Crear tags en Strapi
    const tags = new Set<string>();
    articles.forEach(article => {
      if (article.frontmatter.tags) {
        article.frontmatter.tags.forEach(tag => tags.add(tag));
      }
    });

    console.log(`🏷️ Tags encontrados: ${Array.from(tags).join(', ')}`);

    // Crear autor en Strapi
    const authors = new Set<string>();
    articles.forEach(article => {
      if (article.frontmatter.author) {
        authors.add(article.frontmatter.author);
      }
    });

    console.log(`👤 Autores encontrados: ${Array.from(authors).join(', ')}`);

    // Aquí iría la lógica para crear los datos en Strapi
    // Por ahora solo mostramos la información procesada

    console.log('\n📋 Resumen de migración:');
    console.log(`- Artículos: ${articles.length}`);
    console.log(`- Categorías: ${categories.size}`);
    console.log(`- Tags: ${tags.size}`);
    console.log(`- Autores: ${authors.size}`);

    console.log('\n✅ Migración completada (modo simulación)');
    console.log('\n📝 Para completar la migración:');
    console.log('1. Crear los Content Types en Strapi');
    console.log('2. Crear categorías, tags y autores');
    console.log('3. Crear los artículos con las relaciones correspondientes');
    console.log('4. Actualizar el sitio web para usar Strapi');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
}

// Función para crear un artículo en Strapi
async function createArticleInStrapi(article: MDXArticle) {
  try {
    const articleData = {
      data: {
        title: article.frontmatter.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.frontmatter.description || '',
        quote: article.frontmatter.quote || '',
        featured: article.frontmatter.featured || false,
        status: 'published',
        publishedAt: article.frontmatter.date,
        // Aquí irían las relaciones con categorías, tags, autor, etc.
      }
    };

    console.log(`📝 Creando artículo: ${article.frontmatter.title}`);
    // Aquí iría la llamada a la API de Strapi
    // await StrapiService.createArticle(articleData);

  } catch (error) {
    console.error(`❌ Error creando artículo ${article.slug}:`, error);
  }
}

// Función para crear categoría en Strapi
async function createCategoryInStrapi(name: string) {
  try {
    const categoryData = {
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: `Artículos sobre ${name}`
      }
    };

    console.log(`📂 Creando categoría: ${name}`);
    // Aquí iría la llamada a la API de Strapi
    // await StrapiService.createCategory(categoryData);

  } catch (error) {
    console.error(`❌ Error creando categoría ${name}:`, error);
  }
}

// Función para crear tag en Strapi
async function createTagInStrapi(name: string) {
  try {
    const tagData = {
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      }
    };

    console.log(`🏷️ Creando tag: ${name}`);
    // Aquí iría la llamada a la API de Strapi
    // await StrapiService.createTag(tagData);

  } catch (error) {
    console.error(`❌ Error creando tag ${name}:`, error);
  }
}

// Función para crear autor en Strapi
async function createAuthorInStrapi(name: string) {
  try {
    const authorData = {
      data: {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@iapunto.com`,
        bio: `Autor de artículos sobre tecnología e inteligencia artificial`
      }
    };

    console.log(`👤 Creando autor: ${name}`);
    // Aquí iría la llamada a la API de Strapi
    // await StrapiService.createAuthor(authorData);

  } catch (error) {
    console.error(`❌ Error creando autor ${name}:`, error);
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateArticlesToStrapi();
}

export {
  migrateArticlesToStrapi,
  createArticleInStrapi,
  createCategoryInStrapi,
  createTagInStrapi,
  createAuthorInStrapi
}; 