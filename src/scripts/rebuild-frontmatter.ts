import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

function rebuildFrontmatter() {
  console.log('🔧 Iniciando reconstrucción de frontmatter...');

  try {
    // Leer artículos MDX existentes
    const mdxDir = join(process.cwd(), 'src/content/blog');
    const mdxFiles = readdirSync(mdxDir).filter((file) =>
      file.endsWith('.mdx')
    );

    console.log(`📁 Encontrados ${mdxFiles.length} archivos MDX`);

    let fixedCount = 0;
    let errorCount = 0;

    // Procesar cada archivo MDX
    for (const file of mdxFiles) {
      try {
        const filePath = join(mdxDir, file);
        const fileContent = readFileSync(filePath, 'utf-8');
        const slug = file.replace('.mdx', '');

        // Extraer el contenido después del frontmatter
        const contentMatch = fileContent.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
        const content = contentMatch ? contentMatch[1] : fileContent;

        // Reconstruir el frontmatter desde cero
        const newFrontmatter = `title: "${generateTitleFromSlug(slug)}"
slug: "${slug}"
pubDate: "2024-11-11"
description: "Descubre cómo la IA puede impulsar tu PYME: estrategias concretas de marketing, automatización y datos para aumentar ventas."
cover: "https://res.cloudinary.com/dkb9jfet8/image/upload/v1753291042/small-business_kk56r6.jpg"
coverAlt: "Ilustración de una PYME transformándose digitalmente con inteligencia artificial."
author: "Sergio Rondón"
category: "Negocios y Tecnología"
subcategory: "PYMES y Emprendimiento"
tags: ["PYMES", "Inteligencia Artificial", "Marketing Digital", "Automatización", "Ventas"]
quote: "El crecimiento de una PYME hoy depende de la inteligencia con la que se aplican datos, IA y estrategia. — Sergio Rondón"
date: "2025-08-02"`;

        // Reconstruir el archivo completo
        const newContent = `---\n${newFrontmatter}\n---\n\n${content}`;

        writeFileSync(filePath, newContent, 'utf-8');
        console.log(`✅ Reconstruido frontmatter en ${file}`);
        fixedCount++;

      } catch (error) {
        console.error(`❌ Error procesando ${file}:`, (error as Error).message);
        errorCount++;
      }
    }

    console.log('\n✅ Reconstrucción de frontmatter completada!');
    console.log(`📊 Resumen:`);
    console.log(`- Archivos corregidos: ${fixedCount}`);
    console.log(`- Archivos con errores: ${errorCount}`);
    console.log(`- Total procesados: ${mdxFiles.length}`);

  } catch (error) {
    console.error('❌ Error durante la reconstrucción:', error);
  }
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

// Ejecutar reconstrucción
rebuildFrontmatter();

export { rebuildFrontmatter }; 