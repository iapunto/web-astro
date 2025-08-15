import fs from 'fs';
import path from 'path';

// Lista específica de artículos de 2025 que necesitan corrección
const ARTICLES_2025 = [
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

// Tags específicos para cada artículo
const ARTICLE_TAGS = {
  'alaan-fintech-ia-mena-48m.mdx': [
    'IA',
    'Fintech',
    'Startups',
    'Innovación',
    'Tecnología',
    'Negocios',
    'FinTech',
    'Digital',
  ],
  'apple-ia-chatgpt.mdx': [
    'IA',
    'ChatGPT',
    'Apple',
    'Tecnología',
    'Innovación',
    'Digital',
    'Machine Learning',
    'Generative AI',
  ],
  'automatiza-tu-marketing-con-ia-guia-definitiva.mdx': [
    'IA',
    'Automatización',
    'Marketing Digital',
    'Herramientas',
    'Tecnología',
    'Innovación',
    'Digital',
    'ROI',
  ],
  'automatizacion-contenido-ia-estrategia-digital.mdx': [
    'IA',
    'Automatización',
    'Content Marketing',
    'Estrategia Digital',
    'Tecnología',
    'Innovación',
    'Digital',
    'Herramientas',
  ],
  'automatizacion-contenido-ia-flujo-completo.mdx': [
    'IA',
    'Automatización',
    'Content Marketing',
    'Flujo de Trabajo',
    'Tecnología',
    'Innovación',
    'Digital',
    'Productividad',
  ],
  'ia-todoterreno-openai.mdx': [
    'IA',
    'OpenAI',
    'Inteligencia Artificial',
    'Tecnología',
    'Innovación',
    'Digital',
    'Machine Learning',
    'Generative AI',
  ],
  'trump-ia-silicon-valley.mdx': [
    'IA',
    'Silicon Valley',
    'Tecnología',
    'Innovación',
    'Digital',
    'Startups',
    'Negocios',
    'Tendencias',
  ],
  'vogue-ia-adios-modelos.mdx': [
    'IA',
    'Moda',
    'Tecnología',
    'Innovación',
    'Digital',
    'Tendencias',
    'Industria',
    'Transformación Digital',
  ],
  'zuckerberg-gafas-ia-futuro.mdx': [
    'IA',
    'Meta',
    'Zuckerberg',
    'Tecnología',
    'Innovación',
    'Digital',
    'Realidad Virtual',
    'Metaverso',
  ],
};

// Nuevas URLs de cover para artículos con covers duplicados
const NEW_COVERS = {
  'alaan-fintech-ia-mena-48m.mdx':
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
  'apple-ia-chatgpt.mdx':
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  'ia-todoterreno-openai.mdx':
    'https://images.unsplash.com/photo-1676299251996-879af6e91c49?w=800&h=600&fit=crop',
  'vogue-ia-adios-modelos.mdx':
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
};

function fixArticleManually(filePath: string): {
  fixed: boolean;
  changes: string[];
  errors: string[];
} {
  const filename = path.basename(filePath);
  const result = { fixed: false, changes: [], errors: [] };

  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Verificar que sea un artículo de 2025
    if (!content.includes("pubDate: '2025-")) {
      result.errors.push('No es un artículo de 2025');
      return result;
    }

    // Parsear frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      result.errors.push('No se puede parsear el frontmatter');
      return result;
    }

    const frontmatterText = frontmatterMatch[1];
    const body = frontmatterMatch[2];

    // Parsear líneas del frontmatter
    const lines = frontmatterText.split('\n');
    const newLines: string[] = [];
    let inTagsSection = false;
    let tagsAdded = false;
    let coverUpdated = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === 'tags:') {
        // Saltar todo el bloque de tags existente
        inTagsSection = true;
        continue;
      }

      if (inTagsSection) {
        if (
          line.trim() === '' ||
          (line.includes(':') && !line.includes('  ['))
        ) {
          inTagsSection = false;
          // Agregar tags correctos
          if (!tagsAdded) {
            const tags = ARTICLE_TAGS[
              filename as keyof typeof ARTICLE_TAGS
            ] || ['IA', 'Tecnología', 'Innovación', 'Digital'];
            newLines.push('tags:');
            newLines.push('  [');
            tags.forEach((tag) => {
              newLines.push(`    '${tag}',`);
            });
            newLines.push('  ]');
            result.changes.push(`Tags agregados: ${tags.join(', ')}`);
            tagsAdded = true;
          }
          newLines.push(line);
        }
        continue;
      }

      if (line.includes('cover:')) {
        const newCover = NEW_COVERS[filename as keyof typeof NEW_COVERS];
        if (newCover) {
          newLines.push(`cover: '${newCover}'`);
          result.changes.push(`Cover actualizado: ${newCover}`);
          coverUpdated = true;
        } else {
          newLines.push(line);
        }
      } else {
        newLines.push(line);
      }
    }

    // Si no se agregaron tags, agregarlos al final
    if (!tagsAdded) {
      const tags = ARTICLE_TAGS[filename as keyof typeof ARTICLE_TAGS] || [
        'IA',
        'Tecnología',
        'Innovación',
        'Digital',
      ];
      newLines.push('tags:');
      newLines.push('  [');
      tags.forEach((tag) => {
        newLines.push(`    '${tag}',`);
      });
      newLines.push('  ]');
      result.changes.push(`Tags agregados: ${tags.join(', ')}`);
    }

    // Reconstruir el archivo
    const newContent = `---\n${newLines.join('\n')}\n---\n${body}`;
    fs.writeFileSync(filePath, newContent);
    result.fixed = true;
  } catch (error) {
    result.errors.push(
      `Error procesando archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }

  return result;
}

async function main() {
  console.log('🔧 Corrigiendo manualmente artículos de 2025...\n');

  const rejectedDir = 'articulos-no-aprobados';

  if (!fs.existsSync(rejectedDir)) {
    console.log('❌ No existe el directorio de artículos no aprobados');
    return;
  }

  console.log(
    `📁 Procesando ${ARTICLES_2025.length} artículos específicos de 2025\n`
  );

  const results = [];
  let fixedCount = 0;
  let errorCount = 0;

  for (const filename of ARTICLES_2025) {
    const filePath = path.join(rejectedDir, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  No encontrado: ${filename}`);
      continue;
    }

    console.log(`📝 Procesando: ${filename}`);
    const result = fixArticleManually(filePath);
    results.push({ filename, ...result });

    if (result.fixed) {
      console.log(`✅ ${filename}: ${result.changes.join(', ')}`);
      fixedCount++;
    } else {
      console.log(`❌ ${filename}: ${result.errors.join(', ')}`);
      errorCount++;
    }

    // Pausa entre artículos
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Mostrar resultados
  console.log('\n📊 RESULTADOS DE LA CORRECCIÓN MANUAL\n');
  console.log(`📁 Total de artículos procesados: ${ARTICLES_2025.length}`);
  console.log(`✅ Artículos corregidos: ${fixedCount}`);
  console.log(`❌ Artículos con errores: ${errorCount}\n`);

  const allChanges = results.flatMap((r) => r.changes);
  const tagsChanges = allChanges.filter((c) => c.includes('Tags'));
  const coverChanges = allChanges.filter((c) => c.includes('Cover'));

  console.log('📈 RESUMEN DE CAMBIOS:');
  console.log(`• Tags corregidos: ${tagsChanges.length}`);
  console.log(`• Covers actualizados: ${coverChanges.length}\n`);

  if (fixedCount > 0) {
    console.log('✅ ARTÍCULOS CORREGIDOS:');
    results
      .filter((r) => r.fixed)
      .forEach((result) => {
        console.log(`• ${result.filename}: ${result.changes.join(', ')}`);
      });
    console.log();
  }

  if (errorCount > 0) {
    console.log('❌ ARTÍCULOS CON ERRORES:');
    results
      .filter((r) => !r.fixed)
      .forEach((result) => {
        console.log(`• ${result.filename}: ${result.errors.join(', ')}`);
      });
    console.log();
  }

  // Guardar reporte
  const report = {
    summary: {
      total: ARTICLES_2025.length,
      fixed: fixedCount,
      errors: errorCount,
      tagsFixed: tagsChanges.length,
      coversFixed: coverChanges.length,
    },
    results: results.map((r) => ({
      filename: r.filename,
      fixed: r.fixed,
      changes: r.changes,
      errors: r.errors,
    })),
  };

  fs.writeFileSync(
    'fix-2025-manual-report.json',
    JSON.stringify(report, null, 2)
  );
  console.log(
    '📄 Reporte de corrección manual guardado en: fix-2025-manual-report.json'
  );

  console.log('\n🎉 ¡Proceso de corrección manual completado!');
}

main().catch(console.error);
