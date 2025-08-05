import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
dotenv.config();

interface MDXArticle {
  frontmatter: {
    title: string;
    description?: string;
    date: string;
    author?: string;
    category?: string;
    tags?: string[];
    featured?: boolean;
    image?: string;
    quote?: string;
    [key: string]: any;
  };
  content: string;
  slug: string;
}

class StrapiService {
  private apiUrl: string;
  private apiToken: string;

  constructor() {
    this.apiUrl = process.env.STRAPI_API_URL || 'https://strapi.iapunto.com';
    this.apiToken = process.env.STRAPI_API_TOKEN || '';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiUrl}/api${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiToken}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error en petición:', error);
      throw error;
    }
  }

  async findArticleBySlug(slug: string) {
    return await this.makeRequest(`/articles?filters[slug][$eq]=${slug}`);
  }

  async updateArticleContent(id: number, content: any) {
    return await this.makeRequest(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          content: content,
        },
      }),
    });
  }
}

function convertContentToBlocks(content: string) {
  // Convertir el contenido MDX a bloques de Strapi
  // Para simplificar, vamos a crear un bloque de rich-text con todo el contenido
  return [
    {
      __component: 'shared.rich-text',
      body: content,
      title: null,
    },
  ];
}

async function updateContentWithBlocks() {
  console.log('🔍 Actualizando contenido con formato de bloques...');
  const strapiService = new StrapiService();

  try {
    // Leer artículos MDX existentes
    const mdxDir = join(process.cwd(), 'src/content/blog');
    const mdxFiles = readdirSync(mdxDir).filter((file) =>
      file.endsWith('.mdx')
    );

    console.log(`📁 Encontrados ${mdxFiles.length} archivos MDX`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const file of mdxFiles) {
      try {
        const filePath = join(mdxDir, file);
        const fileContent = readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);
        const slug = file.replace('.mdx', '');

        console.log(`\n📝 Procesando: ${slug}`);

        // Buscar el artículo en Strapi
        const articleResponse = await strapiService.findArticleBySlug(slug);

        if (!articleResponse.data || articleResponse.data.length === 0) {
          console.log(`⚠️ Artículo no encontrado: ${slug}`);
          continue;
        }

        const article = articleResponse.data[0];
        console.log(`✅ Artículo encontrado con ID: ${article.id}`);

        // Convertir contenido a bloques
        const contentBlocks = convertContentToBlocks(content);
        console.log(
          `📦 Contenido convertido a ${contentBlocks.length} bloques`
        );

        // Actualizar el contenido
        await strapiService.updateArticleContent(article.id, contentBlocks);
        console.log(`✅ Contenido actualizado para: ${slug}`);
        updatedCount++;
      } catch (error) {
        console.error(`❌ Error procesando ${file}:`, error);
        errorCount++;
      }
    }

    console.log(`\n🎉 Proceso completado:`);
    console.log(`✅ Artículos actualizados: ${updatedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

updateContentWithBlocks();
