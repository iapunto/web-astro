import { BlogArticle, Category, Tag } from './types/cms';
import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';

// Rutas de archivos
const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const ARTICLES_DB_FILE = path.join(process.cwd(), 'data/articles.json');

export class CMSAPI {
  // Obtener todos los artículos
  static async getAllArticles(): Promise<BlogArticle[]> {
    try {
      const blogEntries = await getCollection('blog');
      
      return blogEntries.map(entry => ({
        id: entry.slug,
        title: entry.data.title,
        slug: entry.data.slug,
        pubDate: entry.data.pubDate,
        description: entry.data.description,
        cover: entry.data.cover,
        coverAlt: entry.data.coverAlt,
        author: entry.data.author,
        category: entry.data.category,
        subcategory: entry.data.subcategory,
        tags: entry.data.tags || [],
        quote: entry.data.quote,
        content: entry.body,
        status: 'published' as const,
        createdAt: entry.data.pubDate,
        updatedAt: entry.data.pubDate
      }));
    } catch (error) {
      console.error('Error getting articles:', error);
      return [];
    }
  }

  // Obtener un artículo por ID
  static async getArticleById(id: string): Promise<BlogArticle | null> {
    try {
      const articles = await this.getAllArticles();
      return articles.find(article => article.id === id) || null;
    } catch (error) {
      console.error('Error getting article by ID:', error);
      return null;
    }
  }

  // Crear un nuevo artículo
  static async createArticle(article: Omit<BlogArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogArticle> {
    try {
      const newArticle: BlogArticle = {
        ...article,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Crear archivo MDX
      await this.createMDXFile(newArticle);
      
      return newArticle;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  // Actualizar un artículo
  static async updateArticle(id: string, updates: Partial<BlogArticle>): Promise<BlogArticle | null> {
    try {
      const article = await this.getArticleById(id);
      if (!article) return null;

      const updatedArticle: BlogArticle = {
        ...article,
        ...updates,
        updatedAt: new Date()
      };

      // Actualizar archivo MDX
      await this.updateMDXFile(updatedArticle);
      
      return updatedArticle;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  // Eliminar un artículo
  static async deleteArticle(id: string): Promise<boolean> {
    try {
      const article = await this.getArticleById(id);
      if (!article) return false;

      // Eliminar archivo MDX
      await this.deleteMDXFile(id);
      
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  }

  // Publicar un artículo
  static async publishArticle(id: string): Promise<BlogArticle | null> {
    return this.updateArticle(id, { status: 'published' });
  }

  // Archivar un artículo
  static async archiveArticle(id: string): Promise<BlogArticle | null> {
    return this.updateArticle(id, { status: 'archived' });
  }

  // Crear archivo MDX
  private static async createMDXFile(article: BlogArticle): Promise<void> {
    const frontmatter = this.generateFrontmatter(article);
    const content = `${frontmatter}\n\n${article.content}`;
    
    const filename = `${article.slug}.mdx`;
    const filepath = path.join(BLOG_DIR, filename);
    
    await fs.writeFile(filepath, content, 'utf-8');
  }

  // Actualizar archivo MDX
  private static async updateMDXFile(article: BlogArticle): Promise<void> {
    const frontmatter = this.generateFrontmatter(article);
    const content = `${frontmatter}\n\n${article.content}`;
    
    const filename = `${article.slug}.mdx`;
    const filepath = path.join(BLOG_DIR, filename);
    
    await fs.writeFile(filepath, content, 'utf-8');
  }

  // Eliminar archivo MDX
  private static async deleteMDXFile(id: string): Promise<void> {
    const filename = `${id}.mdx`;
    const filepath = path.join(BLOG_DIR, filename);
    
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting MDX file:', error);
    }
  }

  // Generar frontmatter
  private static generateFrontmatter(article: BlogArticle): string {
    const frontmatter = {
      title: article.title,
      slug: article.slug,
      pubDate: article.pubDate.toISOString().split('T')[0],
      description: article.description,
      cover: article.cover,
      coverAlt: article.coverAlt,
      author: article.author,
      category: article.category,
      subcategory: article.subcategory,
      tags: article.tags,
      quote: article.quote
    };

    return `---\n${Object.entries(frontmatter)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}: '${value.replace(/'/g, "''")}'`;
        } else if (Array.isArray(value)) {
          return `${key}:\n  [\n    ${value.map(v => `'${v.replace(/'/g, "''")}'`).join(',\n    ')}\n  ]`;
        } else if (typeof value === 'object') {
          return `${key}:\n  name: '${value.name.replace(/'/g, "''")}'\n  description: '${value.description.replace(/'/g, "''")}'\n  image: '${value.image}'`;
        }
        return `${key}: ${value}`;
      })
      .join('\n')}\n---`;
  }

  // Obtener categorías
  static async getCategories(): Promise<Category[]> {
    try {
      const articles = await this.getAllArticles();
      const categories = new Map<string, number>();
      
      articles.forEach(article => {
        const count = categories.get(article.category) || 0;
        categories.set(article.category, count + 1);
      });

      return Array.from(categories.entries()).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        count
      }));
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  // Obtener etiquetas
  static async getTags(): Promise<Tag[]> {
    try {
      const articles = await this.getAllArticles();
      const tags = new Map<string, number>();
      
      articles.forEach(article => {
        article.tags.forEach(tag => {
          const count = tags.get(tag) || 0;
          tags.set(tag, count + 1);
        });
      });

      return Array.from(tags.entries()).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        count
      }));
    } catch (error) {
      console.error('Error getting tags:', error);
      return [];
    }
  }
} 