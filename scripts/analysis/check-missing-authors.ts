import fs from 'fs';
import path from 'path';

const BLOG_DIR = 'src/content/blog';

interface ArticleInfo {
  filename: string;
  hasAuthor: boolean;
  authorName?: string;
  pubDate?: string;
  title?: string;
}

function parseFrontmatter(content: string): any | null {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const frontmatterText = frontmatterMatch[1];

  try {
    const frontmatter: any = {};
    const lines = frontmatterText.split('\n');

    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();

        if (key === 'author') {
          // Check if author is an object or string
          if (value.includes('name:')) {
            // Author object format
            frontmatter.author = {
              name: '',
              description: '',
              image: '',
            };
            // Parse author object
            let inAuthorBlock = false;
            for (const authorLine of lines) {
              if (authorLine.includes('author:')) {
                inAuthorBlock = true;
                continue;
              }
              if (inAuthorBlock) {
                if (authorLine.includes('name:')) {
                  frontmatter.author.name = authorLine
                    .split('name:')[1]
                    .trim()
                    .replace(/"/g, '')
                    .replace(/'/g, '');
                } else if (authorLine.includes('description:')) {
                  frontmatter.author.description = authorLine
                    .split('description:')[1]
                    .trim()
                    .replace(/"/g, '')
                    .replace(/'/g, '');
                } else if (authorLine.includes('image:')) {
                  frontmatter.author.image = authorLine
                    .split('image:')[1]
                    .trim()
                    .replace(/"/g, '')
                    .replace(/'/g, '');
                } else if (
                  authorLine.trim() === '' ||
                  (authorLine.includes(':') && !authorLine.includes('  '))
                ) {
                  break; // End of author block
                }
              }
            }
          } else {
            // Simple string author
            frontmatter.author = value.replace(/"/g, '').replace(/'/g, '');
          }
        } else {
          frontmatter[key] = value.replace(/"/g, '').replace(/'/g, '');
        }
      }
    }
    return frontmatter;
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return null;
  }
}

function checkArticleAuthor(filePath: string): ArticleInfo {
  const filename = path.basename(filePath);
  const result: ArticleInfo = {
    filename,
    hasAuthor: false,
  };

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    if (frontmatter) {
      result.pubDate = frontmatter.pubDate;
      result.title = frontmatter.title;

      if (frontmatter.author) {
        result.hasAuthor = true;
        if (typeof frontmatter.author === 'string') {
          result.authorName = frontmatter.author;
        } else if (frontmatter.author.name) {
          result.authorName = frontmatter.author.name;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
  }

  return result;
}

function main() {
  console.log('🔍 Analizando artículos del blog para verificar autores...\n');

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'));
  const articles: ArticleInfo[] = [];
  const articlesWithAuthor: ArticleInfo[] = [];
  const articlesWithoutAuthor: ArticleInfo[] = [];

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const articleInfo = checkArticleAuthor(filePath);
    articles.push(articleInfo);

    if (articleInfo.hasAuthor) {
      articlesWithAuthor.push(articleInfo);
    } else {
      articlesWithoutAuthor.push(articleInfo);
    }
  }

  console.log(`📊 Resumen:`);
  console.log(`   Total de artículos: ${articles.length}`);
  console.log(`   Con autor: ${articlesWithAuthor.length}`);
  console.log(`   Sin autor: ${articlesWithoutAuthor.length}\n`);

  if (articlesWithAuthor.length > 0) {
    console.log(`✅ Artículos CON autor:`);
    articlesWithAuthor.forEach((article) => {
      console.log(`   📝 ${article.filename} - Autor: ${article.authorName}`);
    });
    console.log();
  }

  if (articlesWithoutAuthor.length > 0) {
    console.log(`❌ Artículos SIN autor:`);
    articlesWithoutAuthor.forEach((article) => {
      console.log(
        `   📝 ${article.filename} - Título: ${article.title || 'N/A'}`
      );
    });
    console.log();
  }

  // Save detailed report
  const report = {
    summary: {
      total: articles.length,
      withAuthor: articlesWithAuthor.length,
      withoutAuthor: articlesWithoutAuthor.length,
    },
    articlesWithAuthor: articlesWithAuthor.map((a) => ({
      filename: a.filename,
      author: a.authorName,
      title: a.title,
      pubDate: a.pubDate,
    })),
    articlesWithoutAuthor: articlesWithoutAuthor.map((a) => ({
      filename: a.filename,
      title: a.title,
      pubDate: a.pubDate,
    })),
  };

  fs.writeFileSync(
    'author-analysis-report.json',
    JSON.stringify(report, null, 2)
  );
  console.log(`📄 Reporte detallado guardado en: author-analysis-report.json`);

  return {
    total: articles.length,
    withAuthor: articlesWithAuthor.length,
    withoutAuthor: articlesWithoutAuthor.length,
    articlesWithoutAuthor: articlesWithoutAuthor,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, checkArticleAuthor };
