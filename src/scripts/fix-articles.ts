import { readFileSync, writeFileSync, readdirSync } from 'fs';
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

function generateTitleFromSlug(slug: string): string {
  // Convertir slug a título legible
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\b(ia|ai|seo|rss|api|iot|saas|fintech|legal tech|legal technology)\b/gi, (match) => {
      const upperMap: { [key: string]: string } = {
        'ia': 'IA',
        'ai': 'AI',
        'seo': 'SEO',
        'rss': 'RSS',
        'api': 'API',
        'iot': 'IoT',
        'saas': 'SaaS',
        'fintech': 'Fintech',
        'legal tech': 'Legal Tech',
        'legal technology': 'Legal Technology'
      };
      return upperMap[match.toLowerCase()] || match.toUpperCase();
    });
}

function generateDateFromSlug(slug: string): string {
  // Extraer fecha del slug si existe, o usar fecha actual
  const dateMatch = slug.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
  }
  
  // Si no hay fecha en el slug, usar fecha actual
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function formatYamlValue(value: any): string {
  if (typeof value === 'string') {
    // Escapar comillas y caracteres especiales
    const escaped = value.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `"${escaped}"`;
  } else if (Array.isArray(value)) {
    return `[${value.map(v => `"${v}"`).join(', ')}]`;
  } else if (typeof value === 'boolean') {
    return value.toString();
  } else if (typeof value === 'number') {
    return value.toString();
  } else if (value === null || value === undefined) {
    return '""';
  } else {
    return `"${JSON.stringify(value)}"`;
  }
}

async function fixArticles() {
  console.log('🔧 Iniciando corrección de artículos MDX...');

  try {
    // Leer artículos MDX existentes
    const mdxDir = join(process.cwd(), 'src/content/blog');
    const mdxFiles = readdirSync(mdxDir).filter((file) =>
      file.endsWith('.mdx')
    );

    console.log(`📁 Encontrados ${mdxFiles.length} archivos MDX`);

    let fixedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Procesar cada archivo MDX
    for (const file of mdxFiles) {
      try {
        const filePath = join(mdxDir, file);
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);
        const slug = file.replace('.mdx', '');

        let needsUpdate = false;
        let newFrontmatter = { ...frontmatter };

        // Verificar y corregir título
        if (!frontmatter.title) {
          const generatedTitle = generateTitleFromSlug(slug);
          newFrontmatter.title = generatedTitle;
          needsUpdate = true;
          console.log(`📝 Agregando título: "${generatedTitle}" a ${slug}`);
        }

        // Verificar y corregir fecha
        if (!frontmatter.date) {
          const generatedDate = generateDateFromSlug(slug);
          newFrontmatter.date = generatedDate;
          needsUpdate = true;
          console.log(`📅 Agregando fecha: "${generatedDate}" a ${slug}`);
        }

        // Si necesita actualización, escribir el archivo
        if (needsUpdate) {
          // Reconstruir el frontmatter con formato YAML correcto
          const newFrontmatterString = Object.entries(newFrontmatter)
            .map(([key, value]) => {
              return `${key}: ${formatYamlValue(value)}`;
            })
            .join('\n');

          const newContent = `---\n${newFrontmatterString}\n---\n\n${content}`;
          
          writeFileSync(filePath, newContent, 'utf-8');
          fixedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error procesando ${file}:`, (error as Error).message);
        errorCount++;
      }
    }

    console.log('\n✅ Corrección completada!');
    console.log(`📊 Resumen:`);
    console.log(`- Archivos corregidos: ${fixedCount}`);
    console.log(`- Archivos sin cambios: ${skippedCount}`);
    console.log(`- Archivos con errores: ${errorCount}`);
    console.log(`- Total procesados: ${mdxFiles.length}`);

    if (fixedCount > 0) {
      console.log('\n📝 Los siguientes campos fueron agregados:');
      console.log('- Títulos generados automáticamente desde el slug');
      console.log('- Fechas generadas automáticamente');
      console.log('\n💡 Revisa los archivos corregidos para verificar que los títulos sean apropiados');
    }

    if (errorCount > 0) {
      console.log('\n⚠️ Algunos archivos tuvieron errores. Revisa manualmente los archivos problemáticos.');
    }

  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  }
}

// Ejecutar corrección
fixArticles();

export { fixArticles }; 