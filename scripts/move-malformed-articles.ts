#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

/**
 * Script para mover artículos con formato incorrecto
 * Mueve archivos que comienzan con ``` desde src/content/blog/ a articulos-no-aprobados/
 */

const BLOG_DIR = 'src/content/blog';
const REJECTED_DIR = 'articulos-no-aprobados';

interface ArticleInfo {
  filename: string;
  startsWithBackticks: boolean;
  content: string;
}

function checkArticleFormat(filePath: string): ArticleInfo | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const startsWithBackticks = content.trim().startsWith('```');
    
    return {
      filename: path.basename(filePath),
      startsWithBackticks,
      content
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

function moveArticle(filename: string): boolean {
  const sourcePath = path.join(BLOG_DIR, filename);
  const destPath = path.join(REJECTED_DIR, filename);
  
  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(sourcePath)) {
      console.error(`❌ Archivo no encontrado: ${sourcePath}`);
      return false;
    }
    
    // Verificar que el directorio destino existe
    if (!fs.existsSync(REJECTED_DIR)) {
      fs.mkdirSync(REJECTED_DIR, { recursive: true });
      console.log(`📁 Directorio creado: ${REJECTED_DIR}`);
    }
    
    // Verificar que no existe ya en destino
    if (fs.existsSync(destPath)) {
      console.warn(`⚠️  Archivo ya existe en destino: ${destPath}`);
      // Agregar timestamp al nombre
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const nameWithoutExt = path.parse(filename).name;
      const ext = path.parse(filename).ext;
      const newFilename = `${nameWithoutExt}-${timestamp}${ext}`;
      const newDestPath = path.join(REJECTED_DIR, newFilename);
      
      fs.copyFileSync(sourcePath, newDestPath);
      fs.unlinkSync(sourcePath);
      console.log(`✅ Movido con timestamp: ${filename} → ${newFilename}`);
      return true;
    }
    
    // Mover archivo
    fs.copyFileSync(sourcePath, destPath);
    fs.unlinkSync(sourcePath);
    console.log(`✅ Movido: ${filename}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error moviendo ${filename}:`, error);
    return false;
  }
}

function main() {
  console.log('🔍 Verificando artículos con formato incorrecto...\n');
  
  // Verificar que el directorio del blog existe
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`❌ Directorio no encontrado: ${BLOG_DIR}`);
    process.exit(1);
  }
  
  // Leer todos los archivos .mdx del blog
  const files = fs.readdirSync(BLOG_DIR)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(BLOG_DIR, file));
  
  console.log(`📊 Total de archivos encontrados: ${files.length}\n`);
  
  const malformedArticles: ArticleInfo[] = [];
  const validArticles: ArticleInfo[] = [];
  
  // Verificar formato de cada archivo
  for (const filePath of files) {
    const articleInfo = checkArticleFormat(filePath);
    if (articleInfo) {
      if (articleInfo.startsWithBackticks) {
        malformedArticles.push(articleInfo);
      } else {
        validArticles.push(articleInfo);
      }
    }
  }
  
  console.log(`✅ Artículos con formato correcto: ${validArticles.length}`);
  console.log(`❌ Artículos con formato incorrecto: ${malformedArticles.length}\n`);
  
  if (malformedArticles.length === 0) {
    console.log('🎉 ¡Todos los artículos tienen formato correcto!');
    return;
  }
  
  // Mostrar artículos con formato incorrecto
  console.log('📋 Artículos con formato incorrecto:');
  malformedArticles.forEach(article => {
    console.log(`  - ${article.filename}`);
  });
  console.log('');
  
  // Mover automáticamente sin confirmación
  console.log('🚚 Moviendo artículos automáticamente...\n');
  
  let movedCount = 0;
  let errorCount = 0;
  
  for (const article of malformedArticles) {
    const success = moveArticle(article.filename);
    if (success) {
      movedCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log('\n📊 Resumen:');
  console.log(`✅ Artículos movidos exitosamente: ${movedCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📁 Destino: ${REJECTED_DIR}/`);
  
  if (movedCount > 0) {
    console.log('\n🎉 ¡Operación completada!');
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
