import fs from 'fs';
import path from 'path';

console.log('🔍 Analizando autores de artículos del blog...\n');

const BLOG_DIR = 'src/content/blog';
const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));

let withAuthor = 0;
let withoutAuthor = 0;
const articlesWithAuthor: string[] = [];
const articlesWithoutAuthor: string[] = [];

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Buscar el patrón de author en el frontmatter
  const authorMatch = content.match(/author:\s*\n\s*name:\s*['"]([^'"]+)['"]/);

  if (authorMatch && authorMatch[1].trim() !== '') {
    withAuthor++;
    articlesWithAuthor.push(`${file} - ${authorMatch[1]}`);
  } else {
    withoutAuthor++;
    articlesWithoutAuthor.push(file);
  }
}

console.log(`📊 Resumen:`);
console.log(`   Total de artículos: ${files.length}`);
console.log(`   Con autor: ${withAuthor}`);
console.log(`   Sin autor: ${withoutAuthor}\n`);

if (articlesWithAuthor.length > 0) {
  console.log(`✅ Artículos CON autor:`);
  articlesWithAuthor.forEach((article) => {
    console.log(`   📝 ${article}`);
  });
  console.log();
}

if (articlesWithoutAuthor.length > 0) {
  console.log(`❌ Artículos SIN autor (${articlesWithoutAuthor.length}):`);
  articlesWithoutAuthor.forEach((article) => {
    console.log(`   📝 ${article}`);
  });
  console.log();
}

// Guardar reporte
const report = {
  summary: {
    total: files.length,
    withAuthor,
    withoutAuthor,
  },
  articlesWithAuthor,
  articlesWithoutAuthor,
};

fs.writeFileSync(
  'author-analysis-simple.json',
  JSON.stringify(report, null, 2)
);
console.log(`📄 Reporte guardado en: author-analysis-simple.json`);
