import fs from 'fs';
import path from 'path';

interface ArticleAnalysis {
  filename: string;
  title?: string;
  pubDate?: string;
  cover?: string;
  coverAlt?: string;
  hasValidDate: boolean;
  hasValidImage: boolean;
  isReferenced: boolean;
  referenceUrl?: string;
  issues: string[];
}

function parseFrontmatter(
  content: string
): { frontmatter: any; body: string } | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const frontmatterText = frontmatterMatch[1];
  const body = frontmatterMatch[2];

  try {
    // Convertir YAML a objeto de forma más robusta
    const frontmatter: any = {};
    const lines = frontmatterText.split('\n');

    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();

        if (key === 'tags') {
          // Parsear array de tags
          const tagsMatch = value.match(/\[(.*)\]/);
          if (tagsMatch) {
            frontmatter.tags = tagsMatch[1]
              .split(',')
              .map((tag: string) => tag.trim().replace(/"/g, ''));
          }
        } else if (key === 'author') {
          // Parsear objeto author
          frontmatter.author = {
            name: '',
            description: '',
            image: '',
          };
        } else {
          frontmatter[key] = value.replace(/"/g, '').replace(/'/g, '');
        }
      }
    }

    return { frontmatter, body };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return null;
  }
}

function extractReferenceUrl(body: string): string | null {
  // Buscar URLs de referencia en el contenido
  const urlPatterns = [
    /https?:\/\/(?:www\.)?techcrunch\.com\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?theverge\.com\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?wired\.com\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?arstechnica\.com\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?engadget\.com\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?venturebeat\.com\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?cnn\.com\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?bbc\.com\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?reuters\.com\/[^\s\)]+/gi,
    /https?:\/\/(?:www\.)?bloomberg\.com\/[^\s\)]+/gi,
  ];

  for (const pattern of urlPatterns) {
    const match = body.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

function isReferencedArticle(body: string): boolean {
  const referenceUrl = extractReferenceUrl(body);
  return referenceUrl !== null;
}

function validateDate(dateStr?: string): boolean {
  if (!dateStr) return false;

  // Verificar si es formato YYYY-MM-DD y es de 2025
  const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateMatch) {
    const year = parseInt(dateMatch[1]);
    return year === 2025;
  }

  // Verificar otros formatos de fecha
  const otherFormats = [
    /^(\d{4})\s+(\w+)\s+(\d{1,2})$/i, // "2025 Aug 15"
    /^(\w+)\s+(\d{1,2})\s+(\d{4})$/i, // "Aug 15 2025"
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/i, // "08/15/2025"
  ];

  for (const format of otherFormats) {
    const match = dateStr.match(format);
    if (match) {
      const year = parseInt(match[3] || match[1]);
      return year === 2025;
    }
  }

  return false;
}

function validateImageUrl(imageUrl?: string): boolean {
  if (!imageUrl) return false;

  // Verificar que la URL sea válida y accesible
  try {
    const url = new URL(imageUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function analyzeArticle(filePath: string): ArticleAnalysis {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);

  const analysis: ArticleAnalysis = {
    filename: path.basename(filePath),
    hasValidDate: false,
    hasValidImage: false,
    isReferenced: false,
    issues: [],
  };

  if (!parsed) {
    analysis.issues.push('No se puede parsear el frontmatter');
    return analysis;
  }

  const { frontmatter, body } = parsed;

  // Extraer información básica
  analysis.title = frontmatter.title;
  analysis.pubDate = frontmatter.pubDate;
  analysis.cover = frontmatter.cover;
  analysis.coverAlt = frontmatter.coverAlt;

  // Verificar si es un artículo referenciado
  analysis.isReferenced = isReferencedArticle(body);
  if (analysis.isReferenced) {
    analysis.referenceUrl = extractReferenceUrl(body);
  }

  // Validar fecha
  analysis.hasValidDate = validateDate(frontmatter.pubDate);
  if (!analysis.hasValidDate) {
    analysis.issues.push(
      `Fecha inválida o no de 2025: ${frontmatter.pubDate || 'No especificada'}`
    );
  }

  // Validar imagen (solo para artículos referenciados)
  if (analysis.isReferenced) {
    analysis.hasValidImage = validateImageUrl(frontmatter.cover);
    if (!analysis.hasValidImage) {
      analysis.issues.push(
        `URL de imagen inválida: ${frontmatter.cover || 'No especificada'}`
      );
    }
  }

  return analysis;
}

function main() {
  const rejectedDir = 'articulos-no-aprobados';

  console.log('🔍 Analizando artículos no aprobados...\n');

  if (!fs.existsSync(rejectedDir)) {
    console.log('❌ No existe el directorio de artículos no aprobados');
    return;
  }

  const files = fs
    .readdirSync(rejectedDir)
    .filter((file) => file.endsWith('.mdx'));
  const analyses: ArticleAnalysis[] = [];

  for (const file of files) {
    const filePath = path.join(rejectedDir, file);
    const analysis = analyzeArticle(filePath);
    analyses.push(analysis);
  }

  // Categorizar artículos
  const articlesWithDateIssues = analyses.filter((a) => !a.hasValidDate);
  const referencedArticles = analyses.filter((a) => a.isReferenced);
  const referencedWithImageIssues = referencedArticles.filter(
    (a) => !a.hasValidImage
  );

  console.log('📊 RESUMEN DEL ANÁLISIS\n');
  console.log(`📁 Total de artículos analizados: ${analyses.length}`);
  console.log(
    `📅 Artículos con problemas de fecha: ${articlesWithDateIssues.length}`
  );
  console.log(`🔗 Artículos referenciados: ${referencedArticles.length}`);
  console.log(
    `🖼️  Artículos referenciados con problemas de imagen: ${referencedWithImageIssues.length}`
  );

  console.log('\n📅 ARTÍCULOS CON PROBLEMAS DE FECHA (no son de 2025):\n');
  articlesWithDateIssues.forEach((article) => {
    console.log(`• ${article.filename}`);
    console.log(`  Título: ${article.title || 'No especificado'}`);
    console.log(`  Fecha actual: ${article.pubDate || 'No especificada'}`);
    console.log(`  Referenciado: ${article.isReferenced ? 'Sí' : 'No'}`);
    if (article.referenceUrl) {
      console.log(`  URL referencia: ${article.referenceUrl}`);
    }
    console.log('');
  });

  console.log('\n🔗 ARTÍCULOS REFERENCIADOS CON PROBLEMAS DE IMAGEN:\n');
  referencedWithImageIssues.forEach((article) => {
    console.log(`• ${article.filename}`);
    console.log(`  Título: ${article.title || 'No especificado'}`);
    console.log(`  URL imagen actual: ${article.cover || 'No especificada'}`);
    console.log(`  URL referencia: ${article.referenceUrl || 'No encontrada'}`);
    console.log('');
  });

  // Generar archivo de reporte
  const report = {
    summary: {
      totalArticles: analyses.length,
      articlesWithDateIssues: articlesWithDateIssues.length,
      referencedArticles: referencedArticles.length,
      referencedWithImageIssues: referencedWithImageIssues.length,
    },
    articlesWithDateIssues: articlesWithDateIssues.map((a) => ({
      filename: a.filename,
      title: a.title,
      pubDate: a.pubDate,
      isReferenced: a.isReferenced,
      referenceUrl: a.referenceUrl,
    })),
    referencedWithImageIssues: referencedWithImageIssues.map((a) => ({
      filename: a.filename,
      title: a.title,
      cover: a.cover,
      referenceUrl: a.referenceUrl,
    })),
  };

  fs.writeFileSync(
    'articulos-analysis-report.json',
    JSON.stringify(report, null, 2)
  );
  console.log(
    '📄 Reporte detallado guardado en: articulos-analysis-report.json'
  );
}

main();
