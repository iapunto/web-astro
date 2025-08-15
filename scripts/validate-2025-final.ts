import fs from 'fs';
import path from 'path';

interface ArticleValidation {
  filename: string;
  hasValidFrontmatter: boolean;
  hasValidDate: boolean;
  hasValidCover: boolean;
  coverUrl: string;
  hasValidTags: boolean;
  tagsCount: number;
  isDuplicateCover: boolean;
  duplicateWith: string[];
  errors: string[];
  warnings: string[];
}

interface ValidationResult {
  totalArticles: number;
  validArticles: number;
  invalidArticles: number;
  articlesWithDuplicateCovers: number;
  summary: {
    frontmatterErrors: number;
    dateErrors: number;
    coverErrors: number;
    tagsErrors: number;
    duplicateCovers: number;
  };
  validArticlesList: string[];
  invalidArticlesList: string[];
  duplicateCoversList: { article: string; duplicates: string[] }[];
}

function parseFrontmatter(content: string): any | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const frontmatterText = frontmatterMatch[1];

  try {
    const frontmatter: any = {};
    const lines = frontmatterText.split('\n');

    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();

        if (key === 'tags') {
          // Buscar tags en el formato correcto
          const tagsMatch = value.match(/\[(.*)\]/);
          if (tagsMatch) {
            frontmatter.tags = tagsMatch[1]
              .split(',')
              .map((tag: string) =>
                tag.trim().replace(/"/g, '').replace(/'/g, '')
              );
          }
        } else if (key === 'author') {
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

    return frontmatter;
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return null;
  }
}

function validateArticle(filePath: string): ArticleValidation {
  const filename = path.basename(filePath);
  const validation: ArticleValidation = {
    filename,
    hasValidFrontmatter: false,
    hasValidDate: false,
    hasValidCover: false,
    coverUrl: '',
    hasValidTags: false,
    tagsCount: 0,
    isDuplicateCover: false,
    duplicateWith: [],
    errors: [],
    warnings: [],
  };

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
      validation.errors.push('No se puede parsear el frontmatter');
      return validation;
    }

    validation.hasValidFrontmatter = true;

    // Validar fecha
    if (frontmatter.pubDate) {
      const dateMatch = frontmatter.pubDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (dateMatch && dateMatch[1] === '2025') {
        validation.hasValidDate = true;
      } else {
        validation.errors.push(
          `Fecha inválida: ${frontmatter.pubDate} (debe ser 2025-XX-XX)`
        );
      }
    } else {
      validation.errors.push('Campo pubDate faltante');
    }

    // Validar cover
    if (frontmatter.cover) {
      validation.coverUrl = frontmatter.cover;

      // Verificar que la URL sea válida
      if (
        frontmatter.cover.startsWith('http') ||
        frontmatter.cover.startsWith('https')
      ) {
        validation.hasValidCover = true;
      } else {
        validation.errors.push(`URL de cover inválida: ${frontmatter.cover}`);
      }
    } else {
      validation.errors.push('Campo cover faltante');
    }

    // Validar tags
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      validation.tagsCount = frontmatter.tags.length;
      if (frontmatter.tags.length >= 3) {
        validation.hasValidTags = true;
      } else {
        validation.errors.push(
          `Tags insuficientes: ${frontmatter.tags.length} (mínimo 3)`
        );
      }
    } else {
      validation.errors.push('Campo tags faltante o inválido');
    }

    // Validar campos obligatorios adicionales
    const requiredFields = [
      'title',
      'slug',
      'description',
      'coverAlt',
      'author',
      'category',
    ];
    for (const field of requiredFields) {
      if (!frontmatter[field]) {
        validation.errors.push(`Campo obligatorio faltante: ${field}`);
      }
    }

    // Validar que tenga contenido
    const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    if (!bodyMatch || bodyMatch[1].trim().length < 100) {
      validation.warnings.push('Contenido del artículo muy corto o faltante');
    }
  } catch (error) {
    validation.errors.push(
      `Error leyendo archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }

  return validation;
}

function findDuplicateCovers(
  validations: ArticleValidation[]
): ArticleValidation[] {
  const coverMap = new Map<string, string[]>();

  // Agrupar artículos por URL de cover
  validations.forEach((validation) => {
    if (validation.hasValidCover && validation.coverUrl) {
      if (!coverMap.has(validation.coverUrl)) {
        coverMap.set(validation.coverUrl, []);
      }
      coverMap.get(validation.coverUrl)!.push(validation.filename);
    }
  });

  // Marcar duplicados
  validations.forEach((validation) => {
    if (validation.hasValidCover && validation.coverUrl) {
      const articlesWithSameCover = coverMap.get(validation.coverUrl)!;
      if (articlesWithSameCover.length > 1) {
        validation.isDuplicateCover = true;
        validation.duplicateWith = articlesWithSameCover.filter(
          (name) => name !== validation.filename
        );
      }
    }
  });

  return validations;
}

async function main() {
  console.log(
    '🔍 Validación final de artículos no aprobados con fecha 2025...\n'
  );

  const rejectedDir = 'articulos-no-aprobados';

  if (!fs.existsSync(rejectedDir)) {
    console.log('❌ No existe el directorio de artículos no aprobados');
    return;
  }

  const files = fs
    .readdirSync(rejectedDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => path.join(rejectedDir, file));

  console.log(`📁 Encontrados ${files.length} artículos para validar\n`);

  const validations: ArticleValidation[] = [];

  for (const filePath of files) {
    const validation = validateArticle(filePath);
    validations.push(validation);
  }

  // Filtrar solo artículos con fecha 2025
  const articles2025 = validations.filter((v) => v.hasValidDate);

  console.log(`📅 Artículos con fecha 2025: ${articles2025.length}\n`);

  // Buscar duplicados de cover
  const validationsWithDuplicates = findDuplicateCovers(articles2025);

  // Generar resultados
  const result: ValidationResult = {
    totalArticles: articles2025.length,
    validArticles: 0,
    invalidArticles: 0,
    articlesWithDuplicateCovers: 0,
    summary: {
      frontmatterErrors: 0,
      dateErrors: 0,
      coverErrors: 0,
      tagsErrors: 0,
      duplicateCovers: 0,
    },
    validArticlesList: [],
    invalidArticlesList: [],
    duplicateCoversList: [],
  };

  const duplicateCoversMap = new Map<string, string[]>();

  validationsWithDuplicates.forEach((validation) => {
    if (validation.errors.length === 0) {
      result.validArticles++;
      result.validArticlesList.push(validation.filename);
    } else {
      result.invalidArticles++;
      result.invalidArticlesList.push(validation.filename);
    }

    if (validation.isDuplicateCover) {
      result.articlesWithDuplicateCovers++;
      if (!duplicateCoversMap.has(validation.coverUrl)) {
        duplicateCoversMap.set(validation.coverUrl, [
          validation.filename,
          ...validation.duplicateWith,
        ]);
      }
    }

    // Contar errores por tipo
    validation.errors.forEach((error) => {
      if (error.includes('frontmatter')) result.summary.frontmatterErrors++;
      if (error.includes('fecha') || error.includes('pubDate'))
        result.summary.dateErrors++;
      if (error.includes('cover')) result.summary.coverErrors++;
      if (error.includes('tags')) result.summary.tagsErrors++;
    });
  });

  result.summary.duplicateCovers = duplicateCoversMap.size;

  duplicateCoversMap.forEach((articles, coverUrl) => {
    result.duplicateCoversList.push({
      article: articles[0],
      duplicates: articles.slice(1),
    });
  });

  // Mostrar resultados
  console.log('📊 RESULTADOS DE LA VALIDACIÓN FINAL\n');
  console.log(`📁 Total de artículos 2025: ${result.totalArticles}`);
  console.log(`✅ Artículos válidos: ${result.validArticles}`);
  console.log(`❌ Artículos con errores: ${result.invalidArticles}`);
  console.log(
    `🖼️  Artículos con covers duplicados: ${result.articlesWithDuplicateCovers}\n`
  );

  console.log('📈 RESUMEN DE ERRORES:');
  console.log(`• Errores de frontmatter: ${result.summary.frontmatterErrors}`);
  console.log(`• Errores de fecha: ${result.summary.dateErrors}`);
  console.log(`• Errores de cover: ${result.summary.coverErrors}`);
  console.log(`• Errores de tags: ${result.summary.tagsErrors}`);
  console.log(`• Covers duplicados: ${result.summary.duplicateCovers}\n`);

  if (result.validArticlesList.length > 0) {
    console.log('✅ ARTÍCULOS VÁLIDOS:');
    result.validArticlesList.forEach((filename) => {
      const validation = validationsWithDuplicates.find(
        (v) => v.filename === filename
      );
      console.log(`• ${filename} (${validation?.tagsCount} tags)`);
    });
    console.log();
  }

  if (result.invalidArticlesList.length > 0) {
    console.log('❌ ARTÍCULOS CON ERRORES:');
    result.invalidArticlesList.forEach((filename) => {
      const validation = validationsWithDuplicates.find(
        (v) => v.filename === filename
      );
      console.log(`• ${filename}:`);
      validation?.errors.forEach((error) => {
        console.log(`  - ${error}`);
      });
      validation?.warnings.forEach((warning) => {
        console.log(`  ⚠️  ${warning}`);
      });
    });
    console.log();
  }

  if (result.duplicateCoversList.length > 0) {
    console.log('🖼️  COVERS DUPLICADOS:');
    result.duplicateCoversList.forEach(({ article, duplicates }) => {
      console.log(`• ${article} (${duplicates.length} duplicados):`);
      duplicates.forEach((duplicate) => {
        console.log(`  - ${duplicate}`);
      });
    });
    console.log();
  }

  // Guardar reporte detallado
  const detailedReport = {
    summary: result,
    validations: validationsWithDuplicates.map((v) => ({
      filename: v.filename,
      hasValidFrontmatter: v.hasValidFrontmatter,
      hasValidDate: v.hasValidDate,
      hasValidCover: v.hasValidCover,
      coverUrl: v.coverUrl,
      hasValidTags: v.hasValidTags,
      tagsCount: v.tagsCount,
      isDuplicateCover: v.isDuplicateCover,
      duplicateWith: v.duplicateWith,
      errors: v.errors,
      warnings: v.warnings,
    })),
  };

  fs.writeFileSync(
    'validation-2025-final-report.json',
    JSON.stringify(detailedReport, null, 2)
  );
  console.log(
    '📄 Reporte detallado guardado en: validation-2025-final-report.json'
  );

  // Mostrar recomendaciones
  console.log('\n💡 RECOMENDACIONES:');
  if (result.invalidArticles > 0) {
    console.log(
      '• Revisar y corregir los artículos con errores antes de moverlos al blog'
    );
  }
  if (result.articlesWithDuplicateCovers > 0) {
    console.log(
      '• Considerar generar nuevas imágenes para artículos con covers duplicados'
    );
  }
  if (result.validArticles > 0) {
    console.log(
      '• Los artículos válidos están listos para ser movidos al blog'
    );
  }
}

main().catch(console.error);
