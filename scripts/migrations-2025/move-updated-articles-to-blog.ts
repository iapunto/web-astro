import fs from 'fs';
import path from 'path';

interface MoveResult {
  filename: string;
  moved: boolean;
  error?: string;
  originalPath: string;
  destinationPath: string;
}

function readUpdateReport(): { successful: any[]; failed: any[] } | null {
  try {
    const reportPath = 'update-report.json';
    if (!fs.existsSync(reportPath)) {
      console.log('❌ No se encontró el archivo update-report.json');
      return null;
    }

    const reportContent = fs.readFileSync(reportPath, 'utf-8');
    const report = JSON.parse(reportContent);

    return {
      successful: report.successful || [],
      failed: report.failed || [],
    };
  } catch (error) {
    console.error('❌ Error leyendo el reporte:', error);
    return null;
  }
}

function moveArticle(sourcePath: string, destPath: string): MoveResult {
  const filename = path.basename(sourcePath);
  const result: MoveResult = {
    filename,
    moved: false,
    originalPath: sourcePath,
    destinationPath: destPath,
  };

  try {
    // Verificar que el archivo fuente existe
    if (!fs.existsSync(sourcePath)) {
      result.error = 'Archivo fuente no existe';
      return result;
    }

    // Crear directorio de destino si no existe
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Verificar que no existe un archivo con el mismo nombre en el destino
    if (fs.existsSync(destPath)) {
      // Crear backup del archivo existente
      const backupPath = destPath.replace('.mdx', `.backup-${Date.now()}.mdx`);
      fs.renameSync(destPath, backupPath);
      console.log(
        `📦 Backup creado: ${path.basename(destPath)} → ${path.basename(backupPath)}`
      );
    }

    // Mover el archivo
    fs.renameSync(sourcePath, destPath);

    result.moved = true;
    console.log(`✅ Movido: ${filename}`);
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`❌ Error moviendo ${filename}:`, error);
  }

  return result;
}

function validateArticleBeforeMove(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Verificar que tiene frontmatter válido
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      return false;
    }

    const frontmatterText = frontmatterMatch[1];

    // Verificar campos obligatorios
    const requiredFields = [
      'title',
      'slug',
      'pubDate',
      'description',
      'cover',
      'coverAlt',
      'author',
      'category',
      'tags',
    ];
    for (const field of requiredFields) {
      if (!frontmatterText.includes(`${field}:`)) {
        return false;
      }
    }

    // Verificar que la fecha es de 2025
    const pubDateMatch = frontmatterText.match(
      /pubDate:\s*['"]?(\d{4}-\d{2}-\d{2})['"]?/
    );
    if (!pubDateMatch || !pubDateMatch[1].startsWith('2025-')) {
      return false;
    }

    // Verificar que tiene contenido
    const body = frontmatterMatch[2];
    if (!body || body.trim().length < 100) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔄 Iniciando movimiento de artículos actualizados al blog...\n');

  // Leer el reporte de actualizaciones
  const report = readUpdateReport();
  if (!report) {
    console.log('❌ No se pudo leer el reporte de actualizaciones');
    return;
  }

  console.log(
    `📊 Artículos exitosos en el reporte: ${report.successful.length}`
  );
  console.log(`📊 Artículos fallidos en el reporte: ${report.failed.length}\n`);

  if (report.successful.length === 0) {
    console.log('❌ No hay artículos exitosos para mover');
    return;
  }

  const rejectedDir = 'articulos-no-aprobados';
  const blogDir = 'src/content/blog';

  // Verificar que existe el directorio de artículos no aprobados
  if (!fs.existsSync(rejectedDir)) {
    console.log('❌ No existe el directorio de artículos no aprobados');
    return;
  }

  // Crear directorio del blog si no existe
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
    console.log(`📁 Directorio del blog creado: ${blogDir}`);
  }

  const moveResults: MoveResult[] = [];
  let validatedCount = 0;
  let movedCount = 0;

  console.log('🔍 Validando y moviendo artículos...\n');

  for (const article of report.successful) {
    const filename = article.filename;
    const sourcePath = path.join(rejectedDir, filename);
    const destPath = path.join(blogDir, filename);

    console.log(`📝 Procesando: ${filename}`);

    // Verificar que el archivo existe en el directorio de no aprobados
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  No encontrado en ${rejectedDir}: ${filename}`);
      continue;
    }

    // Validar el artículo antes de moverlo
    if (!validateArticleBeforeMove(sourcePath)) {
      console.log(`❌ Validación fallida: ${filename}`);
      moveResults.push({
        filename,
        moved: false,
        error: 'Validación fallida',
        originalPath: sourcePath,
        destinationPath: destPath,
      });
      continue;
    }

    validatedCount++;

    // Mover el artículo
    const result = moveArticle(sourcePath, destPath);
    moveResults.push(result);

    if (result.moved) {
      movedCount++;
    }
  }

  // Generar reporte final
  const successfulMoves = moveResults.filter((r) => r.moved);
  const failedMoves = moveResults.filter((r) => !r.moved);

  console.log('\n📊 RESUMEN DEL MOVIMIENTO\n');
  console.log(`✅ Artículos movidos exitosamente: ${successfulMoves.length}`);
  console.log(`❌ Artículos con errores: ${failedMoves.length}`);
  console.log(`🔍 Artículos validados: ${validatedCount}`);
  console.log(`📁 Total procesados: ${moveResults.length}`);

  if (failedMoves.length > 0) {
    console.log('\n❌ ARTÍCULOS CON ERRORES:');
    failedMoves.forEach((result) => {
      console.log(`• ${result.filename}: ${result.error}`);
    });
  }

  if (successfulMoves.length > 0) {
    console.log('\n✅ ARTÍCULOS MOVIDOS EXITOSAMENTE:');
    successfulMoves.forEach((result) => {
      console.log(`• ${result.filename}`);
    });
  }

  // Guardar reporte de movimiento
  const moveReport = {
    summary: {
      total: moveResults.length,
      successful: successfulMoves.length,
      failed: failedMoves.length,
      validated: validatedCount,
    },
    successful: successfulMoves.map((r) => ({
      filename: r.filename,
      originalPath: r.originalPath,
      destinationPath: r.destinationPath,
    })),
    failed: failedMoves.map((r) => ({
      filename: r.filename,
      error: r.error,
      originalPath: r.originalPath,
      destinationPath: r.destinationPath,
    })),
  };

  fs.writeFileSync(
    'move-to-blog-report.json',
    JSON.stringify(moveReport, null, 2)
  );
  console.log(
    '\n📄 Reporte de movimiento guardado en: move-to-blog-report.json'
  );

  // Mostrar estadísticas del blog
  if (fs.existsSync(blogDir)) {
    const blogFiles = fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith('.mdx'));
    console.log(`\n📁 Total de artículos en el blog: ${blogFiles.length}`);
  }

  console.log('\n🎉 ¡Proceso completado!');
}

main().catch(console.error);
