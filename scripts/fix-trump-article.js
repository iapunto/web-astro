import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Actualizar específicamente el artículo de Trump
function updateTrumpArticle() {
  const filePath = path.join(__dirname, '../src/content/blog/trump-ia-silicon-valley.mdx');
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log('📄 Contenido actual:');
  console.log(content.substring(0, 200));
  
  // Reemplazar la URL del cover con la imagen real de TechCrunch
  const newContent = content.replace(
    /cover: "https:\/\/res\.cloudinary\.com\/dkb9jfet8\/image\/upload\/v1753291042\/small-business_kk56r6\.jpg"/,
    'cover: "https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2224983065-e1753313001258.jpg"'
  );
  
  fs.writeFileSync(filePath, newContent);
  
  console.log('\n✅ Artículo actualizado');
  console.log('📄 Nuevo contenido:');
  console.log(newContent.substring(0, 200));
}

// Ejecutar el script
updateTrumpArticle(); 