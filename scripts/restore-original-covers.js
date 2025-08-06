import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de artículos con sus URLs originales de las páginas web
const originalCovers = {
  'alaan-fintech-ia-mena-48m.mdx': 'https://techcrunch.com/wp-content/uploads/2025/08/IMG_1777.jpeg',
  '7-de-10-jovenes-eeuu-ia-companeros.mdx': 'https://techcrunch.com/wp-content/uploads/2024/05/GettyImages-1354022389.jpg',
  'apple-ia-chatgpt.mdx': 'https://techcrunch.com/wp-content/uploads/2025/01/apple-intelligence-iphone-mac.jpg',
  'ia-todoterreno-openai.mdx': 'https://techcrunch.com/wp-content/uploads/2023/11/GettyImages-1778705142.jpg',
  'vogue-ia-adios-modelos.mdx': 'https://techcrunch.com/wp-content/uploads/2025/08/Guess-Vogue-AI-ad-e1754077848136.jpg',
  'vast-data-ia-30b-google-nvidia.mdx': 'https://techcrunch.com/wp-content/uploads/2023/10/GettyImages-1763782522.jpg?w=1390&crop=1',
  'techcrunch-all-stage-boston-startup.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/TCAS_Boston-2.jpg?w=1024',
  'grok-4-ia-descargas-dinero.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2223576505.jpg?resize=1536,1024',
  'ia-boom-visitas-web.mdx': 'https://techcrunch.com/wp-content/uploads/2024/07/ai-referrals-category.png?w=680'
};

// Función para restaurar las URLs originales de las imágenes
function restoreOriginalCovers() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir);
  
  let restoredCount = 0;
  let skippedCount = 0;
  
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar si el archivo tiene una URL de Cloudinary que necesita ser restaurada
    if (content.includes('res.cloudinary.com/dkb9jfet8/image/upload') && originalCovers[file]) {
      const newContent = content.replace(
        /cover: 'https:\/\/res\.cloudinary\.com\/dkb9jfet8\/image\/upload\/[^']*'/,
        `cover: '${originalCovers[file]}'`
      );
      
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Restaurado: ${file}`);
      restoredCount++;
    } else if (originalCovers[file]) {
      console.log(`⏭️  Saltado (ya tiene URL original): ${file}`);
      skippedCount++;
    } else {
      console.log(`❓ Sin mapeo: ${file}`);
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`- Restaurados: ${restoredCount}`);
  console.log(`- Saltados: ${skippedCount}`);
  console.log(`- Total procesados: ${restoredCount + skippedCount}`);
}

// Ejecutar el script
restoreOriginalCovers(); 