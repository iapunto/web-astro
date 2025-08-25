import fs from 'fs';
import path from 'path';

interface ArticleFrontmatter {
  title?: string;
  slug?: string;
  pubDate?: string;
  description?: string;
  cover?: string;
  coverAlt?: string;
  author?: {
    name: string;
    description: string;
    image: string;
  };
  category?: string;
  subcategory?: string;
  tags?: string[];
  quote?: string;
  date?: string; // Campo duplicado que no debería existir
}

function parseFrontmatter(content: string): { frontmatter: ArticleFrontmatter; body: string } | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const frontmatterText = frontmatterMatch[1];
  const body = frontmatterMatch[2];

  try {
    // Convertir YAML a objeto
    const frontmatter: ArticleFrontmatter = {};
    const lines = frontmatterText.split('\n');
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        
        if (key === 'tags') {
          // Parsear array de tags
          const tagsMatch = value.match(/\[(.*)\]/);
          if (tagsMatch) {
            frontmatter.tags = tagsMatch[1].split(',').map(tag => tag.trim().replace(/"/g, ''));
          }
        } else if (key === 'author') {
          // Parsear objeto author
          frontmatter.author = {
            name: '',
            description: '',
            image: ''
          };
        } else {
          frontmatter[key as keyof ArticleFrontmatter] = value.replace(/"/g, '').replace(/'/g, '');
        }
      }
    }

    return { frontmatter, body };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return null;
  }
}

function checkArticleFormat(filePath: string): { isValid: boolean; issues: string[] } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);
  
  if (!parsed) {
    return { isValid: false, issues: ['No se puede parsear el frontmatter'] };
  }

  const { frontmatter, body } = parsed;
  const issues: string[] = [];

  // Verificar campos obligatorios
  const requiredFields = ['title', 'slug', 'pubDate', 'description', 'cover', 'coverAlt', 'author', 'category', 'tags', 'quote'];
  for (const field of requiredFields) {
    if (!frontmatter[field as keyof ArticleFrontmatter]) {
      issues.push(`Campo faltante: ${field}`);
    }
  }

  // Verificar formato de fecha
  if (frontmatter.pubDate && !frontmatter.pubDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    issues.push(`Formato de fecha incorrecto: ${frontmatter.pubDate} (debe ser YYYY-MM-DD)`);
  }

  // Verificar campo duplicado 'date'
  if (frontmatter.date) {
    issues.push('Campo duplicado: date (debe usar solo pubDate)');
  }

  // Verificar uso de HTML en lugar de Markdown
  const htmlTags = body.match(/<h[1-6][^>]*>/g);
  if (htmlTags) {
    issues.push(`Uso de HTML en lugar de Markdown: ${htmlTags.join(', ')}`);
  }

  // Verificar estructura de headers markdown
  const markdownHeaders = body.match(/^#{1,6}\s+/gm);
  if (!markdownHeaders || markdownHeaders.length < 2) {
    issues.push('Falta estructura de headers markdown apropiada');
  }

  // Verificar que no haya contenido HTML problemático
  const problematicHtml = body.match(/<(h[1-6]|p|div|span)[^>]*>/g);
  if (problematicHtml) {
    issues.push(`Contenido HTML problemático: ${problematicHtml.slice(0, 3).join(', ')}...`);
  }

  return { isValid: issues.length === 0, issues };
}

function moveArticle(sourcePath: string, destPath: string): void {
  try {
    // Crear directorio de destino si no existe
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Mover archivo
    fs.renameSync(sourcePath, destPath);
    console.log(`✅ Movido: ${path.basename(sourcePath)}`);
  } catch (error) {
    console.error(`❌ Error moviendo ${sourcePath}:`, error);
  }
}

function main() {
  const blogDir = 'src/content/blog';
  const rejectedDir = 'articulos-no-aprobados';
  
  console.log('🔍 Revisando artículos en busca de problemas de formato...\n');

  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));
  let movedCount = 0;
  let validCount = 0;

  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const { isValid, issues } = checkArticleFormat(filePath);

    if (!isValid) {
      console.log(`❌ ${file}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
      
      const destPath = path.join(rejectedDir, file);
      moveArticle(filePath, destPath);
      movedCount++;
    } else {
      console.log(`✅ ${file}: Formato correcto`);
      validCount++;
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   - Artículos válidos: ${validCount}`);
  console.log(`   - Artículos movidos: ${movedCount}`);
  console.log(`   - Total revisados: ${files.length}`);
}

main();
