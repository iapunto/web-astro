import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

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

async function analyzeMigration() {
  console.log('🔍 Analizando artículos MDX para migración...');

  try {
    // Leer artículos MDX existentes
    const mdxDir = join(process.cwd(), 'src/content/blog');
    const mdxFiles = readdirSync(mdxDir).filter((file) =>
      file.endsWith('.mdx')
    );

    console.log(`📁 Encontrados ${mdxFiles.length} archivos MDX`);

    const articles: MDXArticle[] = [];
    const authors = new Set<string>();
    const categories = new Set<string>();
    const tags = new Set<string>();

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

      // Recolectar autores
      if (frontmatter.author) {
        authors.add(frontmatter.author);
      }

      // Recolectar categorías
      if (frontmatter.category) {
        categories.add(frontmatter.category);
      }

      // Recolectar tags
      if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
        frontmatter.tags.forEach((tag: string) => tags.add(tag));
      }
    }

    console.log('\n📊 ANÁLISIS COMPLETO:');
    console.log('='.repeat(50));

    console.log(`\n📝 ARTÍCULOS (${articles.length}):`);
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.frontmatter.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Autor: ${article.frontmatter.author || 'Sin autor'}`);
      console.log(
        `   Categoría: ${article.frontmatter.category || 'Sin categoría'}`
      );
      console.log(
        `   Tags: ${article.frontmatter.tags?.join(', ') || 'Sin tags'}`
      );
      console.log(
        `   Descripción: ${(article.frontmatter.description || '').substring(0, 100)}...`
      );
      console.log(`   Contenido: ${article.content.length} caracteres`);
      console.log('');
    });

    console.log('\n👤 AUTORES ÚNICOS:');
    console.log('='.repeat(30));
    Array.from(authors).forEach((author, index) => {
      console.log(`${index + 1}. ${author}`);
    });

    console.log('\n📂 CATEGORÍAS ÚNICAS:');
    console.log('='.repeat(30));
    Array.from(categories).forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });

    console.log('\n🏷️ TAGS ÚNICOS:');
    console.log('='.repeat(30));
    Array.from(tags).forEach((tag, index) => {
      console.log(`${index + 1}. ${tag}`);
    });

    console.log('\n📋 RESUMEN:');
    console.log('='.repeat(30));
    console.log(`- Total artículos: ${articles.length}`);
    console.log(`- Autores únicos: ${authors.size}`);
    console.log(`- Categorías únicas: ${categories.size}`);
    console.log(`- Tags únicos: ${tags.size}`);

    // Verificar problemas comunes
    console.log('\n⚠️ PROBLEMAS DETECTADOS:');
    console.log('='.repeat(30));

    const articlesWithoutAuthor = articles.filter((a) => !a.frontmatter.author);
    if (articlesWithoutAuthor.length > 0) {
      console.log(`❌ ${articlesWithoutAuthor.length} artículos sin autor:`);
      articlesWithoutAuthor.forEach((article) => {
        console.log(`   - ${article.slug}`);
      });
    }

    const articlesWithoutCategory = articles.filter(
      (a) => !a.frontmatter.category
    );
    if (articlesWithoutCategory.length > 0) {
      console.log(
        `❌ ${articlesWithoutCategory.length} artículos sin categoría:`
      );
      articlesWithoutCategory.forEach((article) => {
        console.log(`   - ${article.slug}`);
      });
    }

    const articlesWithoutDescription = articles.filter(
      (a) => !a.frontmatter.description
    );
    if (articlesWithoutDescription.length > 0) {
      console.log(
        `❌ ${articlesWithoutDescription.length} artículos sin descripción:`
      );
      articlesWithoutDescription.forEach((article) => {
        console.log(`   - ${article.slug}`);
      });
    }

    const articlesWithLongDescription = articles.filter(
      (a) => a.frontmatter.description && a.frontmatter.description.length > 80
    );
    if (articlesWithLongDescription.length > 0) {
      console.log(
        `⚠️ ${articlesWithLongDescription.length} artículos con descripción > 80 caracteres:`
      );
      articlesWithLongDescription.forEach((article) => {
        console.log(
          `   - ${article.slug}: ${article.frontmatter.description?.length} caracteres`
        );
      });
    }
  } catch (error) {
    console.error('❌ Error durante el análisis:', error);
  }
}

// Ejecutar análisis
analyzeMigration();
