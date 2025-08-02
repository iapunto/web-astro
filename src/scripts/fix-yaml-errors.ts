import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

function fixYamlErrors() {
  console.log('🔧 Iniciando corrección de errores YAML...');

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

        // Buscar el frontmatter
        const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n/);
        
        if (frontmatterMatch) {
          const frontmatterContent = frontmatterMatch[1];
          
          // Corregir URLs largas que causan problemas de YAML
          let fixedFrontmatter = frontmatterContent
            // Corregir URLs que se extienden a múltiples líneas
            .replace(/cover:\s*"([^"]*?)"\s*\n\s*([^"]*?)"/g, 'cover: "$1$2"')
            .replace(/slug:\s*"([^"]*?)"\s*\n\s*([^"]*?)"/g, 'slug: "$1$2"')
            // Corregir otros campos que puedan tener problemas similares
            .replace(/(\w+):\s*"([^"]*?)"\s*\n\s*([^"]*?)"/g, '$1: "$2$3"');

          // Reconstruir el archivo
          const newContent = fileContent.replace(
            /^---\n[\s\S]*?\n---\n/,
            `---\n${fixedFrontmatter}\n---\n`
          );

          // Solo escribir si hubo cambios
          if (newContent !== fileContent) {
            writeFileSync(filePath, newContent, 'utf-8');
            console.log(`✅ Corregido YAML en ${file}`);
            fixedCount++;
          }
        }
      } catch (error) {
        console.error(`❌ Error procesando ${file}:`, (error as Error).message);
        errorCount++;
      }
    }

    console.log('\n✅ Corrección de YAML completada!');
    console.log(`📊 Resumen:`);
    console.log(`- Archivos corregidos: ${fixedCount}`);
    console.log(`- Archivos con errores: ${errorCount}`);
    console.log(`- Total procesados: ${mdxFiles.length}`);

  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  }
}

// Ejecutar corrección
fixYamlErrors();

export { fixYamlErrors }; 