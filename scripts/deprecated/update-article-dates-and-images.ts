import fs from 'fs';
import path from 'path';

interface ArticleUpdate {
  filename: string;
  originalUrl?: string;
  originalDate?: string;
  originalImage?: string;
  originalImageAlt?: string;
  updated: boolean;
  error?: string;
}

interface ParsedArticle {
  frontmatter: any;
  body: string;
  referenceUrl?: string;
}

function parseFrontmatter(content: string): ParsedArticle | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const frontmatterText = frontmatterMatch[1];
  const body = frontmatterMatch[2];

  try {
    const frontmatter: any = {};
    const lines = frontmatterText.split('\n');

    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();

        if (key === 'tags') {
          const tagsMatch = value.match(/\[(.*)\]/);
          if (tagsMatch) {
            frontmatter.tags = tagsMatch[1]
              .split(',')
              .map((tag: string) => tag.trim().replace(/"/g, ''));
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

    // Extraer URL de referencia del final del contenido
    const referenceUrl = extractReferenceUrl(body);

    return { frontmatter, body, referenceUrl: referenceUrl || undefined };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return null;
  }
}

function extractReferenceUrl(body: string): string | null {
  // Buscar URLs de referencia en el contenido (especialmente al final)
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
    const matches = body.match(pattern);
    if (matches && matches.length > 0) {
      // Tomar la última URL encontrada (que suele estar al final del artículo)
      return matches[matches.length - 1];
    }
  }

  return null;
}

async function fetchOriginalArticle(
  url: string
): Promise<{ date?: string; image?: string; imageAlt?: string }> {
  try {
    console.log(`🔍 Obteniendo datos de: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extraer fecha de publicación
    const dateMatch = html.match(
      /<div[^>]*wp-block-post-date[^>]*>([^<]+)<\/div>/i
    );
    const date = dateMatch ? dateMatch[1].trim() : null;

    // Extraer imagen destacada
    const imageMatch = html.match(
      /<figure[^>]*wp-block-post-featured-image[^>]*>.*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/is
    );
    const image = imageMatch ? imageMatch[1] : null;
    const imageAlt = imageMatch ? imageMatch[2] : null;

    // Si no encuentra la imagen con el patrón específico, buscar cualquier imagen destacada
    if (!image) {
      const generalImageMatch = html.match(
        /<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/i
      );
      if (generalImageMatch) {
        return {
          date: date || undefined,
          image: generalImageMatch[1],
          imageAlt: generalImageMatch[2] || undefined,
        };
      }
    }

    return {
      date: date || undefined,
      image: image || undefined,
      imageAlt: imageAlt || undefined,
    };
  } catch (error) {
    console.error(`❌ Error obteniendo datos de ${url}:`, error);
    return {};
  }
}

function parseDateTo2025(dateStr: string): string | null {
  if (!dateStr) return null;

  // Intentar diferentes formatos de fecha
  const dateFormats = [
    /(\d{4})-(\d{1,2})-(\d{1,2})T/, // YYYY-MM-DDTHH:MM:SS (ISO)
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY
    /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
    /(\w+)\s+(\d{1,2}),?\s+(\d{4})/, // Month DD, YYYY
    /(\d{1,2})\s+(\w+)\s+(\d{4})/, // DD Month YYYY
  ];

  for (const format of dateFormats) {
    const match = dateStr.match(format);
    if (match) {
      // Convertir a 2025 manteniendo el mes y día
      const month = match[2] || match[1];
      const day = match[1] || match[2];

      // Asegurar formato YYYY-MM-DD
      const monthNum = parseInt(month);
      const dayNum = parseInt(day);

      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
        return `2025-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
      }
    }
  }

  return null;
}

function updateArticleContent(
  parsed: ParsedArticle,
  originalDate: string,
  originalImage: string,
  originalImageAlt: string
): string {
  const { frontmatter, body } = parsed;

  // Actualizar frontmatter
  const updatedFrontmatter = {
    ...frontmatter,
    pubDate: originalDate,
    cover: originalImage,
    coverAlt:
      originalImageAlt ||
      frontmatter.coverAlt ||
      'Imagen del artículo original',
  };

  // Convertir frontmatter a YAML
  const frontmatterLines = [
    '---',
    `title: '${updatedFrontmatter.title || ''}'`,
    `slug: '${updatedFrontmatter.slug || ''}'`,
    `pubDate: '${updatedFrontmatter.pubDate || ''}'`,
    `description: '${updatedFrontmatter.description || ''}'`,
    `cover: '${updatedFrontmatter.cover || ''}'`,
    `coverAlt: '${updatedFrontmatter.coverAlt || ''}'`,
    `author:`,
    `  name: '${updatedFrontmatter.author?.name || ''}'`,
    `  description: '${updatedFrontmatter.author?.description || ''}'`,
    `  image: '${updatedFrontmatter.author?.image || ''}'`,
    `category: '${updatedFrontmatter.category || ''}'`,
    `subcategory: '${updatedFrontmatter.subcategory || ''}'`,
    `tags:`,
    `  [`,
    ...(updatedFrontmatter.tags || []).map((tag: string) => `    '${tag}',`),
    `  ]`,
    `quote: '${updatedFrontmatter.quote || ''}'`,
    '---',
  ];

  return frontmatterLines.join('\n') + '\n' + body;
}

async function updateArticle(filePath: string): Promise<ArticleUpdate> {
  const filename = path.basename(filePath);
  const update: ArticleUpdate = {
    filename,
    updated: false,
  };

  try {
    console.log(`\n📝 Procesando: ${filename}`);

    // Leer y parsear el artículo
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseFrontmatter(content);

    if (!parsed) {
      update.error = 'No se puede parsear el frontmatter';
      return update;
    }

    // Verificar si tiene fecha de 2024-11-11
    if (parsed.frontmatter.pubDate !== '2024-11-11') {
      update.error = 'No tiene fecha 2024-11-11, saltando';
      return update;
    }

    // Extraer URL de referencia
    if (!parsed.referenceUrl) {
      update.error = 'No se encontró URL de referencia';
      return update;
    }

    update.originalUrl = parsed.referenceUrl;

    // Obtener datos del artículo original
    const originalData = await fetchOriginalArticle(parsed.referenceUrl);

    if (!originalData.date && !originalData.image) {
      update.error = 'No se pudieron obtener datos del artículo original';
      return update;
    }

    // Parsear fecha a 2025
    let updatedDate = '2025-01-15'; // Fecha por defecto
    if (originalData.date) {
      const parsedDate = parseDateTo2025(originalData.date);
      if (parsedDate) {
        updatedDate = parsedDate;
      }
    }

    update.originalDate = originalData.date;

    // Usar imagen original si está disponible
    const updatedImage = originalData.image || parsed.frontmatter.cover;
    const updatedImageAlt =
      originalData.imageAlt || parsed.frontmatter.coverAlt;

    update.originalImage = originalData.image;
    update.originalImageAlt = originalData.imageAlt;

    // Actualizar contenido
    const updatedContent = updateArticleContent(
      parsed,
      updatedDate,
      updatedImage,
      updatedImageAlt
    );

    // Guardar archivo actualizado
    fs.writeFileSync(filePath, updatedContent);

    update.updated = true;
    console.log(`✅ Actualizado: ${filename}`);
    console.log(`   Fecha: ${parsed.frontmatter.pubDate} → ${updatedDate}`);
    if (originalData.image) {
      console.log(`   Imagen: Actualizada con imagen original`);
    }
  } catch (error) {
    update.error = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`❌ Error procesando ${filename}:`, error);
  }

  return update;
}

async function main() {
  const rejectedDir = 'articulos-no-aprobados';

  console.log('🔄 Iniciando actualización de fechas e imágenes...\n');

  if (!fs.existsSync(rejectedDir)) {
    console.log('❌ No existe el directorio de artículos no aprobados');
    return;
  }

  const files = fs
    .readdirSync(rejectedDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => path.join(rejectedDir, file));

  console.log(`📁 Encontrados ${files.length} artículos para procesar\n`);

  const updates: ArticleUpdate[] = [];
  let processedCount = 0;

  for (const filePath of files) {
    const update = await updateArticle(filePath);
    updates.push(update);
    processedCount++;

    // Pausa entre requests para no sobrecargar los servidores
    if (processedCount % 5 === 0) {
      console.log(
        `⏳ Pausa de 2 segundos... (${processedCount}/${files.length})`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Generar reporte
  const successfulUpdates = updates.filter((u) => u.updated);
  const failedUpdates = updates.filter((u) => !u.updated);

  console.log('\n📊 RESUMEN DE ACTUALIZACIONES\n');
  console.log(`✅ Actualizaciones exitosas: ${successfulUpdates.length}`);
  console.log(`❌ Actualizaciones fallidas: ${failedUpdates.length}`);
  console.log(`📁 Total procesados: ${updates.length}`);

  if (failedUpdates.length > 0) {
    console.log('\n❌ ARTÍCULOS CON ERRORES:');
    failedUpdates.forEach((update) => {
      console.log(`• ${update.filename}: ${update.error}`);
    });
  }

  // Guardar reporte detallado
  const report = {
    summary: {
      total: updates.length,
      successful: successfulUpdates.length,
      failed: failedUpdates.length,
    },
    successful: successfulUpdates,
    failed: failedUpdates,
  };

  fs.writeFileSync('update-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Reporte detallado guardado en: update-report.json');
}

main().catch(console.error);
