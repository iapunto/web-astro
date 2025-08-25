import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para extraer URLs reales de las referencias de los artículos
function extractRealUrls() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir);
  
  const realUrls = {};
  
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar URLs de TechCrunch en las referencias
    const techcrunchMatches = content.match(/https:\/\/techcrunch\.com\/[^\s"']+/g);
    
    if (techcrunchMatches && techcrunchMatches.length > 0) {
      // Tomar la primera URL de TechCrunch encontrada
      const realUrl = techcrunchMatches[0];
      realUrls[file] = realUrl;
      console.log(`✅ ${file}: ${realUrl}`);
    } else {
      console.log(`❌ ${file}: Sin URL de TechCrunch`);
    }
  }
  
  console.log(`\n📊 Total de URLs extraídas: ${Object.keys(realUrls).length}`);
  
  // Guardar el mapeo en un archivo
  const mappingContent = `// Mapeo de artículos con sus URLs reales de TechCrunch
export const realArticleUrls = ${JSON.stringify(realUrls, null, 2)};
`;
  
  fs.writeFileSync(path.join(__dirname, 'real-urls-mapping.js'), mappingContent);
  console.log(`\n💾 Mapeo guardado en: scripts/real-urls-mapping.js`);
  
  return realUrls;
}

// Ejecutar el script
extractRealUrls(); 