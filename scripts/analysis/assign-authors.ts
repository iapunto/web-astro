import fs from 'fs';
import path from 'path';

const BLOG_DIR = 'src/content/blog';

// Información de los autores
const AUTHORS = {
  'Sergio Rondón': {
    name: 'Sergio Rondón',
    description: 'CEO de IA Punto',
    image:
      'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/sergio_gdcaeh.png',
  },
  'Marilyn Cardozo': {
    name: 'Marilyn Cardozo',
    description: 'Experta en Desarrollo Digital.',
    image:
      'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739923879/marilyn_s2mi4a.png',
  },
};

interface ArticleInfo {
  filename: string;
  hasAuthor: boolean;
  assignedAuthor?: string;
}

function checkArticleAuthor(filePath: string): ArticleInfo {
  const filename = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Buscar el patrón de author en el frontmatter
  const authorMatch = content.match(/author:\s*\n\s*name:\s*['"]([^'"]+)['"]/);

  return {
    filename,
    hasAuthor: !!(authorMatch && authorMatch[1].trim() !== ''),
    assignedAuthor: authorMatch ? authorMatch[1].trim() : undefined,
  };
}

function assignAuthorToArticle(filePath: string, authorName: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const author = AUTHORS[authorName as keyof typeof AUTHORS];

    if (!author) {
      console.error(`❌ Autor no encontrado: ${authorName}`);
      return false;
    }

    // Buscar el patrón de author vacío y reemplazarlo
    const authorPattern =
      /author:\s*\n\s*name:\s*['"][^'"]*['"]\s*\n\s*description:\s*['"][^'"]*['"]\s*\n\s*image:\s*['"][^'"]*['"]/;
    const newAuthorBlock = `author:
  name: '${author.name}'
  description: '${author.description}'
  image: '${author.image}'`;

    if (authorPattern.test(content)) {
      const newContent = content.replace(authorPattern, newAuthorBlock);
      fs.writeFileSync(filePath, newContent, 'utf-8');
      return true;
    } else {
      console.error(`❌ No se encontró el patrón de author en ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error);
    return false;
  }
}

function main() {
  console.log('🔍 Analizando artículos para asignar autores...\n');

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'));
  const articlesWithoutAuthor: string[] = [];
  const articlesWithAuthor: ArticleInfo[] = [];

  // Analizar todos los artículos
  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const articleInfo = checkArticleAuthor(filePath);

    if (articleInfo.hasAuthor) {
      articlesWithAuthor.push(articleInfo);
    } else {
      articlesWithoutAuthor.push(file);
    }
  }

  console.log(`📊 Resumen inicial:`);
  console.log(`   Total de artículos: ${files.length}`);
  console.log(`   Con autor: ${articlesWithAuthor.length}`);
  console.log(`   Sin autor: ${articlesWithoutAuthor.length}\n`);

  if (articlesWithoutAuthor.length === 0) {
    console.log('✅ Todos los artículos ya tienen autor asignado.');
    return;
  }

  // Distribuir autores (CEO con 2-3 artículos más)
  const totalWithoutAuthor = articlesWithoutAuthor.length;
  const sergioArticles = Math.ceil(totalWithoutAuthor / 2) + 2; // CEO con 2 más
  const marilynArticles = totalWithoutAuthor - sergioArticles;

  console.log(`📋 Plan de distribución:`);
  console.log(`   Sergio Rondón (CEO): ${sergioArticles} artículos`);
  console.log(`   Marilyn Cardozo: ${marilynArticles} artículos\n`);

  let sergioAssigned = 0;
  let marilynAssigned = 0;
  const results = {
    success: [] as string[],
    errors: [] as string[],
  };

  // Asignar autores
  for (let i = 0; i < articlesWithoutAuthor.length; i++) {
    const file = articlesWithoutAuthor[i];
    const filePath = path.join(BLOG_DIR, file);

    let authorName: string;
    if (sergioAssigned < sergioArticles) {
      authorName = 'Sergio Rondón';
      sergioAssigned++;
    } else {
      authorName = 'Marilyn Cardozo';
      marilynAssigned++;
    }

    console.log(`📝 Asignando ${authorName} a: ${file}`);

    if (assignAuthorToArticle(filePath, authorName)) {
      results.success.push(`${file} → ${authorName}`);
    } else {
      results.errors.push(`${file} → Error`);
    }
  }

  // Reporte final
  console.log(`\n📊 Resultado final:`);
  console.log(`   ✅ Asignaciones exitosas: ${results.success.length}`);
  console.log(`   ❌ Errores: ${results.errors.length}\n`);

  if (results.success.length > 0) {
    console.log(`✅ Artículos actualizados:`);
    results.success.forEach((result) => {
      console.log(`   📝 ${result}`);
    });
    console.log();
  }

  if (results.errors.length > 0) {
    console.log(`❌ Errores:`);
    results.errors.forEach((error) => {
      console.log(`   📝 ${error}`);
    });
    console.log();
  }

  // Guardar reporte
  const report = {
    summary: {
      totalArticles: files.length,
      articlesWithAuthor: articlesWithAuthor.length,
      articlesWithoutAuthor: articlesWithoutAuthor.length,
      sergioAssigned,
      marilynAssigned,
    },
    distribution: {
      sergioArticles,
      marilynArticles,
    },
    results: {
      success: results.success,
      errors: results.errors,
    },
  };

  fs.writeFileSync(
    'author-assignment-report.json',
    JSON.stringify(report, null, 2)
  );
  console.log(`📄 Reporte guardado en: author-assignment-report.json`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, assignAuthorToArticle };
