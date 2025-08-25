import fs from 'fs';
import path from 'path';

console.log('🔍 Script de prueba iniciado...');

const BLOG_DIR = 'src/content/blog';

try {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'));
  console.log(`📁 Encontrados ${files.length} archivos .mdx en ${BLOG_DIR}`);

  if (files.length > 0) {
    console.log('📝 Primeros 5 archivos:');
    files.slice(0, 5).forEach((file) => {
      console.log(`   - ${file}`);
    });
  }
} catch (error) {
  console.error('❌ Error:', error);
}

console.log('✅ Script completado');
