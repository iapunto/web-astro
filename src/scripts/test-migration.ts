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

async function testMigration() {
  console.log('🧪 Iniciando prueba de migración...');

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

    // Analizar campos
    const categories = new Set<string>();
    const tags = new Set<string>();
    const authors = new Set<string>();
    const fieldsWithQuote = new Set<string>();
    const fieldsWithFeatured = new Set<string>();

    articles.forEach((article) => {
      // Categorías
      if (article.frontmatter.category) {
        categories.add(article.frontmatter.category);
      }

      // Tags
      if (article.frontmatter.tags) {
        article.frontmatter.tags.forEach((tag) => tags.add(tag));
      }

      // Autores - manejar diferentes formatos
      if (article.frontmatter.author) {
        if (typeof article.frontmatter.author === 'string') {
          authors.add(article.frontmatter.author);
        } else if (typeof article.frontmatter.author === 'object') {
          // Si es un objeto, extraer el nombre
          const authorObj = article.frontmatter.author as any;
          if (authorObj.name) {
            authors.add(authorObj.name);
          } else if (authorObj.title) {
            authors.add(authorObj.title);
          } else {
            authors.add(JSON.stringify(authorObj));
          }
        }
      }

      // Campos especiales
      if (article.frontmatter.quote) {
        fieldsWithQuote.add(article.slug);
      }

      if (article.frontmatter.featured) {
        fieldsWithFeatured.add(article.slug);
      }
    });

    console.log('\n📋 Análisis de contenido:');
    console.log(`- Artículos: ${articles.length}`);
    console.log(
      `- Categorías: ${categories.size} (${Array.from(categories).join(', ')})`
    );
    console.log(`- Tags: ${tags.size} (${Array.from(tags).join(', ')})`);
    console.log(
      `- Autores: ${authors.size} (${Array.from(authors).join(', ')})`
    );
    console.log(
      `- Artículos con quote: ${fieldsWithQuote.size} (${Array.from(fieldsWithQuote).join(', ')})`
    );
    console.log(
      `- Artículos destacados: ${fieldsWithFeatured.size} (${Array.from(fieldsWithFeatured).join(', ')})`
    );

    // Mostrar ejemplo de artículo procesado
    if (articles.length > 0) {
      const sampleArticle = articles[0];
      console.log('\n📝 Ejemplo de artículo procesado:');
      console.log(`- Título: ${sampleArticle.frontmatter.title}`);
      console.log(`- Slug: ${sampleArticle.slug}`);
      console.log(
        `- Descripción: ${sampleArticle.frontmatter.description || 'No disponible'}`
      );
      console.log(
        `- Quote: ${sampleArticle.frontmatter.quote || 'No disponible'}`
      );

      // Manejar autor correctamente
      let authorDisplay = 'No disponible';
      if (sampleArticle.frontmatter.author) {
        if (typeof sampleArticle.frontmatter.author === 'string') {
          authorDisplay = sampleArticle.frontmatter.author;
        } else if (typeof sampleArticle.frontmatter.author === 'object') {
          const authorObj = sampleArticle.frontmatter.author as any;
          authorDisplay =
            authorObj.name || authorObj.title || JSON.stringify(authorObj);
        }
      }
      console.log(`- Autor: ${authorDisplay}`);

      console.log(
        `- Categoría: ${sampleArticle.frontmatter.category || 'No disponible'}`
      );
      console.log(
        `- Tags: ${sampleArticle.frontmatter.tags?.join(', ') || 'No disponibles'}`
      );
      console.log(
        `- Destacado: ${sampleArticle.frontmatter.featured ? 'Sí' : 'No'}`
      );
      console.log(`- Contenido: ${sampleArticle.content.substring(0, 100)}...`);
    }

    // Mostrar algunos artículos con sus autores
    console.log('\n📝 Ejemplos de artículos con autores:');
    articles.slice(0, 5).forEach((article, index) => {
      let authorDisplay = 'No disponible';
      if (article.frontmatter.author) {
        if (typeof article.frontmatter.author === 'string') {
          authorDisplay = article.frontmatter.author;
        } else if (typeof article.frontmatter.author === 'object') {
          const authorObj = article.frontmatter.author as any;
          authorDisplay = authorObj.name || authorObj.title || 'Objeto autor';
        }
      }
      console.log(
        `${index + 1}. "${article.frontmatter.title}" - Autor: ${authorDisplay}`
      );
    });

    // Verificar campos requeridos
    const missingFields = articles.filter((article) => {
      return !article.frontmatter.title || !article.frontmatter.date;
    });

    if (missingFields.length > 0) {
      console.log('\n⚠️ Artículos con campos faltantes:');
      missingFields.forEach((article) => {
        console.log(
          `- ${article.slug}: ${!article.frontmatter.title ? 'sin título' : ''} ${!article.frontmatter.date ? 'sin fecha' : ''}`
        );
      });
    } else {
      console.log('\n✅ Todos los artículos tienen los campos requeridos');
    }

    console.log('\n✅ Prueba de migración completada');
    console.log('\n📝 Para ejecutar la migración real:');
    console.log('1. Configura STRAPI_API_TOKEN en tu archivo .env');
    console.log('2. Crea los Content Types en Strapi');
    console.log('3. Ejecuta: pnpm tsx src/scripts/migrate-to-strapi.ts');
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

// Ejecutar prueba
testMigration();

export { testMigration };
