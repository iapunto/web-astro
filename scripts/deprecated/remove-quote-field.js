import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '../src/content/blog');

function removeQuoteField(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar el patrón del frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(frontmatterRegex);
    
    if (match) {
      let frontmatter = match[1];
      
      // Eliminar líneas que contengan "quote:"
      const lines = frontmatter.split('\n');
      const filteredLines = lines.filter(line => !line.trim().startsWith('quote:'));
      
      const newFrontmatter = filteredLines.join('\n');
      const newContent = content.replace(frontmatterRegex, `---\n${newFrontmatter}\n---\n`);
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Procesado: ${path.basename(filePath)}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
  return false;
}

function processAllFiles() {
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));
  
  console.log(`📁 Procesando ${files.length} archivos...`);
  
  let processed = 0;
  let errors = 0;
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    if (removeQuoteField(filePath)) {
      processed++;
    } else {
      errors++;
    }
  });
  
  console.log(`\n📊 Resumen:`);
  console.log(`✅ Archivos procesados: ${processed}`);
  console.log(`❌ Errores: ${errors}`);
}

processAllFiles(); 