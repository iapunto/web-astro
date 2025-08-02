import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

function fixYamlComplete() {
  console.log('🔧 Iniciando corrección completa de YAML...');

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
          
          // Corregir múltiples problemas de YAML
          let fixedFrontmatter = frontmatterContent
            // Corregir campos que se extienden a múltiples líneas
            .replace(/(\w+):\s*"([^"]*?)"\s*\n\s*([^"]*?)"/g, '$1: "$2$3"')
            // Corregir campos sin comillas que se extienden
            .replace(/(\w+):\s*([^\n]*?)\s*\n\s*([^\n]*?)(?=\n\w+:|$)/g, '$1: "$2$3"')
            // Corregir arrays que se extienden
            .replace(/(\w+):\s*\[([^\]]*?)\s*\n\s*([^\]]*?)\]/g, '$1: [$2$3]')
            // Asegurar que todos los valores estén entre comillas
            .replace(/(\w+):\s*([^\n"]+)(?=\n|$)/g, (match, key, value) => {
              // No cambiar arrays, booleanos o números
              if (value.trim().startsWith('[') || value.trim() === 'true' || value.trim() === 'false' || !isNaN(Number(value.trim()))) {
                return match;
              }
              return `${key}: "${value.trim()}"`;
            })
            // Limpiar espacios extra
            .replace(/\n\s*\n/g, '\n')
            .trim();

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

    console.log('\n✅ Corrección completa de YAML finalizada!');
    console.log(`📊 Resumen:`);
    console.log(`- Archivos corregidos: ${fixedCount}`);
    console.log(`- Archivos con errores: ${errorCount}`);
    console.log(`- Total procesados: ${mdxFiles.length}`);

  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  }
}

// Ejecutar corrección
fixYamlComplete();

export { fixYamlComplete }; 