import fs from 'fs/promises';
import path from 'path';
import {
  Gem4Result,
  ArticleFrontmatter,
  Gem5Result,
} from '../database/articleTrackingSchema';

export class ArticlePublisherService {
  private blogContentPath: string;
  private baseUrl: string;

  constructor(
    blogContentPath: string = 'src/content/blog',
    baseUrl: string = 'https://iapunto.com'
  ) {
    this.blogContentPath = blogContentPath;
    this.baseUrl = baseUrl;
  }

  async publishArticle(
    gem5Result: Gem5Result,
    gem4Result?: any
  ): Promise<{
    success: boolean;
    filePath: string;
    url: string;
    error?: string;
  }> {
    try {
      // Verificar que tenemos el resultado de GEM 5
      if (!gem5Result || !gem5Result.frontmatter) {
        throw new Error('No se encontró el resultado de GEM 5 con frontmatter');
      }

      console.log('🔍 Verificando frontmatter de GEM 5...');
      console.log('🔍 Cover URL:', gem5Result.frontmatter.cover);
      console.log('🔍 Cover Alt:', gem5Result.frontmatter.coverAlt);

      // Validar que el resultado de GEM 5 sea válido
      if (gem5Result.validationPassed === false) {
        const errors = gem5Result.validationErrors || [];
        throw new Error(`Validación fallida: ${errors.join(', ')}`);
      }

      // Si validationPassed es undefined, asumir que es válido
      if (gem5Result.validationPassed === undefined) {
        console.log('⚠️  Validación no especificada, asumiendo válido');
      }

      // Validar que el frontmatter tenga todos los campos obligatorios
      const requiredFields = [
        'title',
        'slug',
        'pubDate',
        'description',
        'cover',
        'coverAlt',
        'author',
        'category',
        'tags',
        'quote',
      ];

      console.log('🔍 Validando campos obligatorios...');
      const missingFields = requiredFields.filter((field) => {
        const hasField = !!gem5Result.frontmatter[field];
        if (!hasField) {
          console.log(`❌ Campo faltante: ${field}`);
        }
        return !hasField;
      });

      if (missingFields.length > 0) {
        console.log('❌ Campos faltantes encontrados:', missingFields);
        throw new Error(
          `Validación fallida: Campos obligatorios faltantes: ${missingFields.join(', ')}`
        );
      }

      console.log('✅ Todos los campos obligatorios están presentes');

      // Validar quote después de la actualización
      if (
        gem5Result.frontmatter.quote &&
        gem5Result.frontmatter.quote.length > 120
      ) {
        throw new Error(
          `Validación fallida: Quote demasiado largo (máximo 120 caracteres, actual: ${gem5Result.frontmatter.quote.length})`
        );
      }

      // Actualizar la fecha de publicación al momento actual
      const updatedFrontmatter = {
        ...gem5Result.frontmatter,
        pubDate: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      };

      console.log(
        `📅 Actualizando fecha de publicación a: ${updatedFrontmatter.pubDate}`
      );

      // Generar el contenido MDX completo con la fecha actualizada
      const mdxContent = this.generateMDXContent(
        updatedFrontmatter,
        gem5Result.mdxContent
      );

      // Crear el nombre del archivo
      const fileName = `${gem5Result.frontmatter.slug}.mdx`;
      const filePath = path.join(this.blogContentPath, fileName);

      // Verificar que el archivo no exista
      try {
        await fs.access(filePath);
        throw new Error(`El archivo ${fileName} ya existe`);
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      // Escribir el archivo MDX
      await fs.writeFile(filePath, mdxContent, 'utf-8');

      // Generar la URL del artículo
      const articleUrl = `${this.baseUrl}/blog/${gem5Result.frontmatter.slug}`;

      // Log de publicación
      console.log(`✅ Artículo publicado exitosamente:`);
      console.log(`   📁 Archivo: ${filePath}`);
      console.log(`   🔗 URL: ${articleUrl}`);
      console.log(`   📝 Título: ${gem5Result.frontmatter.title}`);
      console.log(`   🏷️  Categoría: ${gem5Result.frontmatter.category}`);
      console.log(`   📊 Tags: ${gem5Result.frontmatter.tags.join(', ')}`);

      return {
        success: true,
        filePath,
        url: articleUrl,
      };
    } catch (error) {
      console.error('❌ Error al publicar artículo:', error);
      return {
        success: false,
        filePath: '',
        url: '',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  private generateMDXContent(
    frontmatter: ArticleFrontmatter,
    content: string
  ): string {
    // Generar el frontmatter en formato YAML
    const yamlFrontmatter = this.generateYAMLFrontmatter(frontmatter);

    // Combinar frontmatter y contenido
    return `${yamlFrontmatter}\n${content}`;
  }

  private generateYAMLFrontmatter(frontmatter: ArticleFrontmatter): string {
    const yamlLines = [
      '---',
      `title: "${this.escapeYAMLString(frontmatter.title)}"`,
      `slug: "${frontmatter.slug}"`,
      `pubDate: "${frontmatter.pubDate}"`,
      `description: "${this.escapeYAMLString(frontmatter.description)}"`,
      `cover: "${frontmatter.cover}"`,
      `coverAlt: "${this.escapeYAMLString(frontmatter.coverAlt)}"`,
      'author:',
      `  name: "${this.escapeYAMLString(frontmatter.author.name)}"`,
      `  description: "${this.escapeYAMLString(frontmatter.author.description)}"`,
      `  image: "${frontmatter.author.image}"`,
      `category: "${frontmatter.category}"`,
    ];

    // Agregar subcategoría si existe
    if (frontmatter.subcategory) {
      yamlLines.push(`subcategory: "${frontmatter.subcategory}"`);
    }

    // Agregar tags
    yamlLines.push(
      `tags: [${frontmatter.tags.map((tag) => `"${tag}"`).join(', ')}]`
    );
    yamlLines.push(`quote: "${this.escapeYAMLString(frontmatter.quote)}"`);
    yamlLines.push('---');

    return yamlLines.join('\n');
  }

  private escapeYAMLString(str: string): string {
    // Escapar caracteres especiales en YAML
    return str
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  async validateArticleStructure(
    filePath: string
  ): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const errors: string[] = [];

      // Verificar que tenga frontmatter
      if (!content.startsWith('---')) {
        errors.push('No se encontró frontmatter');
      }

      // Verificar que tenga contenido
      const contentWithoutFrontmatter = content.replace(
        /^---[\s\S]*?---\s*/,
        ''
      );
      if (!contentWithoutFrontmatter.trim()) {
        errors.push('No se encontró contenido después del frontmatter');
      }

      // Verificar estructura básica del frontmatter
      const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const requiredFields = [
          'title',
          'slug',
          'pubDate',
          'description',
          'cover',
          'coverAlt',
          'author',
          'category',
          'tags',
          'quote',
        ];

        for (const field of requiredFields) {
          if (!frontmatter.includes(`${field}:`)) {
            errors.push(`Campo obligatorio faltante en frontmatter: ${field}`);
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [
          `Error al leer archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        ],
      };
    }
  }

  async getArticleStats(): Promise<{
    totalArticles: number;
    categories: Record<string, number>;
    tags: Record<string, number>;
  }> {
    try {
      const files = await fs.readdir(this.blogContentPath);
      const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

      const stats = {
        totalArticles: mdxFiles.length,
        categories: {} as Record<string, number>,
        tags: {} as Record<string, number>,
      };

      // Analizar cada archivo para obtener estadísticas
      for (const file of mdxFiles) {
        const filePath = path.join(this.blogContentPath, file);
        const content = await fs.readFile(filePath, 'utf-8');

        // Extraer categoría
        const categoryMatch = content.match(/category:\s*"([^"]+)"/);
        if (categoryMatch) {
          const category = categoryMatch[1];
          stats.categories[category] = (stats.categories[category] || 0) + 1;
        }

        // Extraer tags
        const tagsMatch = content.match(/tags:\s*\[([^\]]+)\]/);
        if (tagsMatch) {
          const tagsString = tagsMatch[1];
          const tags =
            tagsString
              .match(/"([^"]+)"/g)
              ?.map((tag) => tag.replace(/"/g, '')) || [];

          for (const tag of tags) {
            stats.tags[tag] = (stats.tags[tag] || 0) + 1;
          }
        }
      }

      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas de artículos:', error);
      return {
        totalArticles: 0,
        categories: {},
        tags: {},
      };
    }
  }

  async backupArticle(filePath: string): Promise<string> {
    try {
      const backupDir = path.join(this.blogContentPath, 'backups');
      await fs.mkdir(backupDir, { recursive: true });

      const fileName = path.basename(filePath);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `${fileName.replace('.mdx', '')}_backup_${timestamp}.mdx`;
      const backupPath = path.join(backupDir, backupFileName);

      const content = await fs.readFile(filePath, 'utf-8');
      await fs.writeFile(backupPath, content, 'utf-8');

      console.log(`📦 Backup creado: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('Error al crear backup:', error);
      throw error;
    }
  }

  async rollbackArticle(
    backupPath: string,
    originalPath: string
  ): Promise<boolean> {
    try {
      const backupContent = await fs.readFile(backupPath, 'utf-8');
      await fs.writeFile(originalPath, backupContent, 'utf-8');

      console.log(`🔄 Rollback completado: ${originalPath}`);
      return true;
    } catch (error) {
      console.error('Error al hacer rollback:', error);
      return false;
    }
  }
}
