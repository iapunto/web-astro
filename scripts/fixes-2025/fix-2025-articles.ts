import fs from 'fs';
import path from 'path';

interface ArticleFix {
  filename: string;
  fixed: boolean;
  errors: string[];
  changes: string[];
}

interface FixResult {
  totalArticles: number;
  fixedArticles: number;
  failedArticles: number;
  summary: {
    tagsAdded: number;
    coversFixed: number;
    errors: number;
  };
  fixedList: string[];
  failedList: string[];
}

// Categorías y tags disponibles según categorias_tags_reglas.md
const CATEGORIES = [
  'Inteligencia Artificial',
  'Marketing Digital',
  'Tecnología',
  'Negocios',
  'Innovación',
  'Startups',
  'Tendencias',
  'Herramientas',
  'Análisis',
  'Guías',
];

const SUBCATEGORIES = [
  'Chatbots',
  'Automatización',
  'Machine Learning',
  'Generative AI',
  'SEO',
  'Redes Sociales',
  'Email Marketing',
  'Analytics',
  'Criptomonedas',
  'Fintech',
  'E-commerce',
  'Productividad',
  'Desarrollo',
  'Cloud Computing',
  'Cybersecurity',
  'Mobile',
  'Web3',
  'Metaverso',
  'IoT',
  'Big Data',
];

const TAGS = [
  'IA',
  'Inteligencia Artificial',
  'ChatGPT',
  'OpenAI',
  'Google',
  'Meta',
  'Microsoft',
  'Apple',
  'Amazon',
  'Tesla',
  'NVIDIA',
  'Machine Learning',
  'Deep Learning',
  'Generative AI',
  'Chatbots',
  'Automatización',
  'Marketing Digital',
  'SEO',
  'Redes Sociales',
  'Email Marketing',
  'Analytics',
  'Startups',
  'Fintech',
  'Criptomonedas',
  'E-commerce',
  'Productividad',
  'Herramientas',
  'Tendencias',
  'Innovación',
  'Tecnología',
  'Negocios',
  'Desarrollo',
  'Cloud Computing',
  'Cybersecurity',
  'Mobile',
  'Web3',
  'Metaverso',
  'IoT',
  'Big Data',
  'API',
  'SaaS',
  'B2B',
  'B2C',
  'UX/UI',
  'Design',
  'Content Marketing',
  'Growth Hacking',
  'Lead Generation',
  'Conversión',
  'ROI',
  'KPIs',
  'Data Science',
  'Business Intelligence',
  'Automation',
  'Integration',
  'API',
  'Microservices',
  'DevOps',
  'Agile',
  'Scrum',
  'Project Management',
  'Team Management',
  'Remote Work',
  'Digital Transformation',
  'Industry 4.0',
  'Smart Cities',
  'Sustainability',
  'Green Tech',
  'Health Tech',
  'EdTech',
  'FinTech',
  'InsurTech',
  'PropTech',
  'LegalTech',
  'HR Tech',
  'MarTech',
  'AdTech',
  'Content Tech',
  'Video Marketing',
  'Podcast',
  'Live Streaming',
  'Virtual Reality',
  'Augmented Reality',
  'Mixed Reality',
  'Blockchain',
  'Cryptocurrency',
  'NFTs',
  'DeFi',
  'Smart Contracts',
  'Tokenization',
  'Digital Assets',
  'Trading',
  'Investment',
  'Venture Capital',
  'Angel Investors',
  'IPO',
  'M&A',
  'Exit Strategy',
  'Business Model',
  'Revenue Streams',
  'Pricing Strategy',
  'Customer Acquisition',
  'Customer Retention',
  'Customer Experience',
  'User Experience',
  'User Interface',
  'Design Thinking',
  'Lean Startup',
  'MVP',
  'Product Market Fit',
  'Growth Strategy',
  'Scaling',
  'Internationalization',
  'Localization',
  'Compliance',
  'Regulation',
  'GDPR',
  'Privacy',
  'Security',
  'Authentication',
  'Authorization',
  'Encryption',
  'Backup',
  'Disaster Recovery',
  'High Availability',
  'Load Balancing',
  'CDN',
  'Performance',
  'Optimization',
  'Caching',
  'Database',
  'SQL',
  'NoSQL',
  'GraphQL',
  'REST API',
  'Microservices',
  'Monolith',
  'Serverless',
  'Containerization',
  'Docker',
  'Kubernetes',
  'CI/CD',
  'Git',
  'Version Control',
  'Code Review',
  'Testing',
  'Unit Testing',
  'Integration Testing',
  'E2E Testing',
  'TDD',
  'BDD',
  'Code Quality',
  'Refactoring',
  'Technical Debt',
  'Architecture',
  'Design Patterns',
  'SOLID Principles',
  'Clean Code',
  'Documentation',
  'API Documentation',
  'Technical Writing',
  'Blogging',
  'Content Creation',
  'Copywriting',
  'Storytelling',
  'Branding',
  'Brand Identity',
  'Visual Design',
  'Typography',
  'Color Theory',
  'Layout',
  'Responsive Design',
  'Mobile First',
  'Progressive Web App',
  'Single Page Application',
  'Multi Page Application',
  'Static Site',
  'Dynamic Site',
  'CMS',
  'Headless CMS',
  'E-commerce Platform',
  'Payment Gateway',
  'Shopping Cart',
  'Inventory Management',
  'Order Management',
  'Customer Support',
  'Help Desk',
  'Live Chat',
  'Ticketing System',
  'Knowledge Base',
  'FAQ',
  'Onboarding',
  'User Training',
  'Documentation',
  'Tutorials',
  'Webinars',
  'Workshops',
  'Certification',
  'Skills Development',
  'Learning Management System',
  'Online Courses',
  'E-learning',
  'Gamification',
  'Leaderboards',
  'Achievements',
  'Points System',
  'Rewards',
  'Loyalty Program',
  'Referral Program',
  'Affiliate Marketing',
  'Influencer Marketing',
  'Social Proof',
  'Testimonials',
  'Case Studies',
  'Reviews',
  'Ratings',
  'Feedback',
  'Surveys',
  'Polls',
  'A/B Testing',
  'Multivariate Testing',
  'Conversion Rate Optimization',
  'Landing Page Optimization',
  'Funnel Optimization',
  'Sales Funnel',
  'Marketing Funnel',
  'Customer Journey',
  'Touchpoints',
  'Omnichannel',
  'Cross-channel',
  'Multi-channel',
  'Channel Strategy',
  'Distribution',
  'Partnerships',
  'Alliances',
  'Joint Ventures',
  'Licensing',
  'Franchising',
  'White Label',
  'Reseller',
  'Distributor',
  'Agent',
  'Broker',
  'Marketplace',
  'Platform',
  'Ecosystem',
  'Network Effects',
  'Viral Growth',
  'Word of Mouth',
  'Organic Growth',
  'Paid Growth',
  'Acquisition Channels',
  'Retention Strategies',
  'Churn Prevention',
  'Win-back Campaigns',
  'Reactivation',
  'Upselling',
  'Cross-selling',
  'Bundle',
  'Package',
  'Subscription',
  'Recurring Revenue',
  'SaaS Metrics',
  'ARR',
  'MRR',
  'LTV',
  'CAC',
  'Payback Period',
  'Unit Economics',
  'Profitability',
  'Margins',
  'Cost Structure',
  'Revenue Model',
  'Pricing Model',
  'Freemium',
  'Premium',
  'Enterprise',
  'SMB',
  'B2B2C',
  'Marketplace',
  'Platform',
  'API Economy',
  'Data Economy',
  'Attention Economy',
  'Experience Economy',
  'Sharing Economy',
  'Gig Economy',
  'Creator Economy',
  'Influencer Economy',
  'Digital Economy',
  'Knowledge Economy',
  'Information Economy',
  'Network Economy',
  'Platform Economy',
  'API Economy',
  'Data Economy',
  'Attention Economy',
  'Experience Economy',
  'Sharing Economy',
  'Gig Economy',
  'Creator Economy',
  'Influencer Economy',
  'Digital Economy',
  'Knowledge Economy',
  'Information Economy',
  'Network Economy',
];

function generateTagsForArticle(title: string, description: string): string[] {
  const content = `${title} ${description}`.toLowerCase();
  const selectedTags: string[] = [];

  // Seleccionar tags basados en el contenido
  TAGS.forEach((tag) => {
    if (content.includes(tag.toLowerCase()) && selectedTags.length < 8) {
      selectedTags.push(tag);
    }
  });

  // Si no hay suficientes tags, agregar algunos genéricos
  if (selectedTags.length < 3) {
    const genericTags = ['Tecnología', 'Innovación', 'IA', 'Digital'];
    genericTags.forEach((tag) => {
      if (!selectedTags.includes(tag) && selectedTags.length < 8) {
        selectedTags.push(tag);
      }
    });
  }

  return selectedTags.slice(0, 8); // Máximo 8 tags
}

function generateNewCoverUrl(originalUrl: string, filename: string): string {
  // Si es el logo de TechCrunch, usar una imagen placeholder
  if (originalUrl.includes('tc-logo-2018-square-reverse2x.png')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop';
  }

  // Para otros casos, mantener la URL original
  return originalUrl;
}

function fixArticle(filePath: string): ArticleFix {
  const filename = path.basename(filePath);
  const fix: ArticleFix = {
    filename,
    fixed: false,
    errors: [],
    changes: [],
  };

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
      fix.errors.push('No se puede parsear el frontmatter');
      return fix;
    }

    const frontmatterText = frontmatterMatch[1];
    const body = frontmatterMatch[2];

    // Parsear frontmatter actual
    const lines = frontmatterText.split('\n');
    const frontmatter: any = {};

    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();

        if (key === 'tags') {
          const tagsMatch = value.match(/\[(.*)\]/);
          if (tagsMatch) {
            frontmatter.tags = tagsMatch[1]
              .split(',')
              .map((tag: string) => tag.trim().replace(/"/g, ''));
          }
        } else if (key === 'author') {
          frontmatter.author = {
            name: '',
            description: '',
            image: '',
          };
        } else {
          frontmatter[key] = value.replace(/"/g, '').replace(/'/g, '');
        }
      }
    }

    let hasChanges = false;
    const newFrontmatterLines: string[] = [];

    // Reconstruir frontmatter con correcciones
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();

        if (key === 'tags') {
          // Si no hay tags o están vacíos, generarlos
          if (!frontmatter.tags || frontmatter.tags.length === 0) {
            const newTags = generateTagsForArticle(
              frontmatter.title || '',
              frontmatter.description || ''
            );
            newFrontmatterLines.push(`tags:`);
            newFrontmatterLines.push(`  [`);
            newTags.forEach((tag) => {
              newFrontmatterLines.push(`    '${tag}',`);
            });
            newFrontmatterLines.push(`  ]`);
            fix.changes.push(`Tags agregados: ${newTags.join(', ')}`);
            hasChanges = true;
          } else {
            newFrontmatterLines.push(line);
          }
        } else if (key === 'cover') {
          // Verificar si es un cover duplicado (logo de TechCrunch)
          if (value.includes('tc-logo-2018-square-reverse2x.png')) {
            const newCoverUrl = generateNewCoverUrl(value, filename);
            newFrontmatterLines.push(`cover: '${newCoverUrl}'`);
            fix.changes.push(`Cover actualizado: ${newCoverUrl}`);
            hasChanges = true;
          } else {
            newFrontmatterLines.push(line);
          }
        } else {
          newFrontmatterLines.push(line);
        }
      } else {
        newFrontmatterLines.push(line);
      }
    }

    // Si no había tags, agregarlos al final
    if (!frontmatter.tags || frontmatter.tags.length === 0) {
      const newTags = generateTagsForArticle(
        frontmatter.title || '',
        frontmatter.description || ''
      );
      newFrontmatterLines.push(`tags:`);
      newFrontmatterLines.push(`  [`);
      newTags.forEach((tag) => {
        newFrontmatterLines.push(`    '${tag}',`);
      });
      newFrontmatterLines.push(`  ]`);
      fix.changes.push(`Tags agregados: ${newTags.join(', ')}`);
      hasChanges = true;
    }

    if (hasChanges) {
      // Reconstruir el archivo
      const newContent = `---\n${newFrontmatterLines.join('\n')}\n---\n${body}`;
      fs.writeFileSync(filePath, newContent);
      fix.fixed = true;
    }
  } catch (error) {
    fix.errors.push(
      `Error procesando archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }

  return fix;
}

async function main() {
  console.log('🔧 Corrigiendo artículos de 2025...\n');

  const rejectedDir = 'articulos-no-aprobados';

  if (!fs.existsSync(rejectedDir)) {
    console.log('❌ No existe el directorio de artículos no aprobados');
    return;
  }

  const files = fs
    .readdirSync(rejectedDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => path.join(rejectedDir, file));

  console.log(`📁 Encontrados ${files.length} artículos para procesar\n`);

  const fixes: ArticleFix[] = [];
  let processedCount = 0;

  for (const filePath of files) {
    const fix = fixArticle(filePath);
    fixes.push(fix);
    processedCount++;

    if (fix.fixed) {
      console.log(`✅ ${fix.filename}: ${fix.changes.join(', ')}`);
    } else if (fix.errors.length > 0) {
      console.log(`❌ ${fix.filename}: ${fix.errors.join(', ')}`);
    } else {
      console.log(`ℹ️  ${fix.filename}: Sin cambios necesarios`);
    }

    // Pausa cada 5 artículos
    if (processedCount % 5 === 0) {
      console.log(
        `⏳ Pausa de 1 segundo... (${processedCount}/${files.length})`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Generar resultados
  const result: FixResult = {
    totalArticles: fixes.length,
    fixedArticles: 0,
    failedArticles: 0,
    summary: {
      tagsAdded: 0,
      coversFixed: 0,
      errors: 0,
    },
    fixedList: [],
    failedList: [],
  };

  fixes.forEach((fix) => {
    if (fix.fixed) {
      result.fixedArticles++;
      result.fixedList.push(fix.filename);

      fix.changes.forEach((change) => {
        if (change.includes('Tags agregados')) result.summary.tagsAdded++;
        if (change.includes('Cover actualizado')) result.summary.coversFixed++;
      });
    } else {
      result.failedArticles++;
      result.failedList.push(fix.filename);
      result.summary.errors += fix.errors.length;
    }
  });

  // Mostrar resultados
  console.log('\n📊 RESULTADOS DE LA CORRECCIÓN\n');
  console.log(`📁 Total de artículos procesados: ${result.totalArticles}`);
  console.log(`✅ Artículos corregidos: ${result.fixedArticles}`);
  console.log(`❌ Artículos con errores: ${result.failedArticles}\n`);

  console.log('📈 RESUMEN DE CAMBIOS:');
  console.log(`• Tags agregados: ${result.summary.tagsAdded}`);
  console.log(`• Covers actualizados: ${result.summary.coversFixed}`);
  console.log(`• Errores encontrados: ${result.summary.errors}\n`);

  if (result.fixedList.length > 0) {
    console.log('✅ ARTÍCULOS CORREGIDOS:');
    result.fixedList.forEach((filename) => {
      console.log(`• ${filename}`);
    });
    console.log();
  }

  if (result.failedList.length > 0) {
    console.log('❌ ARTÍCULOS CON ERRORES:');
    result.failedList.forEach((filename) => {
      console.log(`• ${filename}`);
    });
    console.log();
  }

  // Guardar reporte
  const report = {
    summary: result,
    fixes: fixes.map((fix) => ({
      filename: fix.filename,
      fixed: fix.fixed,
      changes: fix.changes,
      errors: fix.errors,
    })),
  };

  fs.writeFileSync('fix-2025-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Reporte de correcciones guardado en: fix-2025-report.json');

  console.log('\n🎉 ¡Proceso de corrección completado!');
}

main().catch(console.error);
