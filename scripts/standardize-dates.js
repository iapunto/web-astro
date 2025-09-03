import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para convertir fecha a formato ISO
function convertToISODate(dateString) {
  if (!dateString) return null;
  
  // Si ya está en formato ISO, retornar como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Convertir formato 'Aug 26 2025' a '2025-08-26'
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn(`Fecha inválida: ${dateString}`);
    return null;
  }
  
  return date.toISOString().split('T')[0];
}

// Función para procesar un archivo MDX
function processMDXFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Buscar línea de pubDate
      if (line.includes('pubDate:')) {
        const match = line.match(/pubDate:\s*['"]([^'"]+)['"]/);
        if (match) {
          const oldDate = match[1];
          const newDate = convertToISODate(oldDate);
          
          if (newDate && newDate !== oldDate) {
            lines[i] = line.replace(oldDate, newDate);
            modified = true;
            console.log(`  ${oldDate} → ${newDate}`);
          }
        }
      }
      
      // Buscar línea de date (eliminar si existe)
      if (line.includes('date:') && !line.includes('pubDate:')) {
        lines[i] = '';
        modified = true;
        console.log(`  Eliminado campo 'date' duplicado`);
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función principal
function main() {
  const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
  
  if (!fs.existsSync(blogDir)) {
    console.error('Directorio del blog no encontrado:', blogDir);
    return;
  }
  
  console.log('Estandarizando fechas en artículos del blog...\n');
  
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));
  let processedCount = 0;
  let modifiedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    console.log(`Procesando: ${file}`);
    
    const modified = processMDXFile(filePath);
    if (modified) {
      modifiedCount++;
    }
    processedCount++;
    console.log('');
  }
  
  console.log(`Resumen:`);
  console.log(`- Archivos procesados: ${processedCount}`);
  console.log(`- Archivos modificados: ${modifiedCount}`);
  console.log(`- Archivos sin cambios: ${processedCount - modifiedCount}`);
}

// Ejecutar script
main();
