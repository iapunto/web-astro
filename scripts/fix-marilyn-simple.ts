import fs from 'fs';
import path from 'path';

console.log('🔧 Corrigiendo avatar de Marilyn Cardozo...\n');

const BLOG_DIR = 'src/content/blog';

// URL correcta del avatar de Marilyn
const MARILYN_CORRECT_AVATAR =
  'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739923879/marilyn_s2mi4a.png';
const MARILYN_WRONG_AVATAR =
  'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/marilyn_placeholder.png';

const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));
let fixedCount = 0;
const fixedFiles: string[] = [];

console.log(`📁 Analizando ${files.length} artículos...\n`);

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Buscar artículos que tengan a Marilyn Cardozo como autor
    const marilynMatch = content.match(
      /author:\s*\n\s*name:\s*['"]Marilyn Cardozo['"]/
    );

    if (marilynMatch) {
      // Reemplazar la URL incorrecta con la correcta
      const newContent = content.replace(
        MARILYN_WRONG_AVATAR,
        MARILYN_CORRECT_AVATAR
      );

      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        fixedCount++;
        fixedFiles.push(file);
        console.log(`✅ Corregido: ${file}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error procesando ${file}:`, error);
  }
}

console.log(`\n📊 Resultado:`);
console.log(`   ✅ Artículos corregidos: ${fixedCount}`);
console.log(`   📝 Total analizados: ${files.length}`);

if (fixedFiles.length > 0) {
  console.log(`\n📝 Archivos corregidos:`);
  fixedFiles.forEach((file) => {
    console.log(`   - ${file}`);
  });
}

console.log('\n✅ Proceso completado');
