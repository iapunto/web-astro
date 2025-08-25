import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

function fixYamlFinal() {
  console.log('🔧 Iniciando corrección final de YAML...');

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
          
          // Reconstruir completamente el frontmatter
          const lines = frontmatterContent.split('\n');
          const newLines: string[] = [];
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            // Buscar el patrón clave: valor
            const colonIndex = trimmedLine.indexOf(':');
            if (colonIndex > 0) {
              const key = trimmedLine.substring(0, colonIndex).trim();
              const value = trimmedLine.substring(colonIndex + 1).trim();
              
              // Reconstruir la línea correctamente
              if (value.startsWith('"') && value.endsWith('"')) {
                // Ya está entre comillas
                newLines.push(`${key}: ${value}`);
              } else if (value.startsWith('[') && value.endsWith(']')) {
                // Es un array
                newLines.push(`${key}: ${value}`);
              } else if (value === 'true' || value === 'false') {
                // Es un booleano
                newLines.push(`${key}: ${value}`);
              } else if (!isNaN(Number(value))) {
                // Es un número
                newLines.push(`${key}: ${value}`);
              } else {
                // Es un string, agregar comillas
                newLines.push(`${key}: "${value}"`);
              }
            } else {
              // Línea sin dos puntos, agregarla tal como está
              newLines.push(trimmedLine);
            }
          }
          
          const fixedFrontmatter = newLines.join('\n');

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

    console.log('\n✅ Corrección final de YAML completada!');
    console.log(`📊 Resumen:`);
    console.log(`- Archivos corregidos: ${fixedCount}`);
    console.log(`- Archivos con errores: ${errorCount}`);
    console.log(`- Total procesados: ${mdxFiles.length}`);

  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  }
}

// Ejecutar corrección
fixYamlFinal();

export { fixYamlFinal }; 