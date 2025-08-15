import fs from 'fs';
import path from 'path';

// Lista de artículos de 2025 que sabemos que están correctos
const ARTICLES_2025_TO_MOVE = [
  'alaan-fintech-ia-mena-48m.mdx',
  'apple-ia-chatgpt.mdx',
  'automatiza-tu-marketing-con-ia-guia-definitiva.mdx',
  'automatizacion-contenido-ia-estrategia-digital.mdx',
  'automatizacion-contenido-ia-flujo-completo.mdx',
  'ia-todoterreno-openai.mdx',
  'trump-ia-silicon-valley.mdx',
  'vogue-ia-adios-modelos.mdx',
  'zuckerberg-gafas-ia-futuro.mdx',
];

interface MoveResult {
  filename: string;
  moved: boolean;
  error?: string;
  originalPath: string;
  destinationPath: string;
}

function validateArticleBeforeMove(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Verificar que tenga fecha 2025
    if (!content.includes("pubDate: '2025-")) {
      return false;
    }

    // Verificar que tenga frontmatter válido
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

    // Verificar que tenga contenido
    const body = frontmatterMatch[2];
    if (!body || body.trim().length < 100) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
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

async function main() {
  console.log('📁 Moviendo artículos de 2025 al blog...\n');

  const rejectedDir = 'articulos-no-aprobados';
  const blogDir = 'src/content/blog';

  if (!fs.existsSync(rejectedDir)) {
    console.log('❌ No existe el directorio de artículos no aprobados');
    return;
  }

  // Crear directorio del blog si no existe
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
    console.log(`📁 Directorio del blog creado: ${blogDir}`);
  }

  console.log(
    `📁 Procesando ${ARTICLES_2025_TO_MOVE.length} artículos de 2025\n`
  );

  const moveResults: MoveResult[] = [];
  let validatedCount = 0;
  let movedCount = 0;

  for (const filename of ARTICLES_2025_TO_MOVE) {
    const sourcePath = path.join(rejectedDir, filename);
    const destPath = path.join(blogDir, filename);

    console.log(`📝 Procesando: ${filename}`);

    // Verificar que el archivo existe en el directorio de no aprobados
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  No encontrado en ${rejectedDir}: ${filename}`);
      moveResults.push({
        filename,
        moved: false,
        error: 'Archivo no encontrado',
        originalPath: sourcePath,
        destinationPath: destPath,
      });
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

    // Pausa entre artículos
    await new Promise((resolve) => setTimeout(resolve, 500));
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
    'move-2025-report.json',
    JSON.stringify(moveReport, null, 2)
  );
  console.log('\n📄 Reporte de movimiento guardado en: move-2025-report.json');

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
