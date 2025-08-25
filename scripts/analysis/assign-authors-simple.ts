import fs from 'fs';
import path from 'path';

console.log('🔍 Iniciando asignación de autores...\n');

const BLOG_DIR = 'src/content/blog';

// Información de los autores
const AUTHORS = {
  'Sergio Rondón': {
    name: 'Sergio Rondón',
    description: 'CEO de IA Punto',
    image:
      'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/sergio_gdcaeh.png',
  },
  'Marilyn Cardozo': {
    name: 'Marilyn Cardozo',
    description: 'Experta en Desarrollo Digital.',
    image:
      'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739923879/marilyn_s2mi4a.png',
  },
};

function assignAuthorToArticle(filePath: string, authorName: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const author = AUTHORS[authorName as keyof typeof AUTHORS];

    if (!author) {
      console.error(`❌ Autor no encontrado: ${authorName}`);
      return false;
    }

    // Buscar el patrón de author vacío y reemplazarlo
    const authorPattern =
      /author:\s*\n\s*name:\s*['"][^'"]*['"]\s*\n\s*description:\s*['"][^'"]*['"]\s*\n\s*image:\s*['"][^'"]*['"]/;
    const newAuthorBlock = `author:
  name: '${author.name}'
  description: '${author.description}'
  image: '${author.image}'`;

    if (authorPattern.test(content)) {
      const newContent = content.replace(authorPattern, newAuthorBlock);
      fs.writeFileSync(filePath, newContent, 'utf-8');
      return true;
    } else {
      console.error(`❌ No se encontró el patrón de author en ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error);
    return false;
  }
}

// Lista de artículos sin autor (del análisis anterior)
const articlesWithoutAuthor = [
  '7-de-10-jovenes-eeuu-ia-companeros.mdx',
  'altman-chatgpt-terapia-sin-confidencialidad.mdx',
  'amazon-alexa-anuncios.mdx',
  'ambiq-debut-bursatil.mdx',
  'amor-ia-fin-o-comienzo.mdx',
  'anthropic-ia-empresarial-supera-openai.mdx',
  'anthropic-valor-170b.mdx',
  'apple-ia-inversion.mdx',
  'chatgpt-2-5-mil-millones-preguntas-diarias.mdx',
  'chatgpt-chatbot-ia-guia.mdx',
  'chatgpt-modo-estudio-aprende-pensar.mdx',
  'chats-publicos-chatgpt-google.mdx',
  'chrome-ia-compras.mdx',
  'claude-code-anthropic-exigentes.mdx',
  'coches-autonomos-tekedra-mawakana-waymo.mdx',
  'cofundador-tech-dispo-acero.mdx',
  'cognition-windsurf-equipo-google.mdx',
  'doge-ia-corta-regulaciones.mdx',
  'fotos-youtube-shorts-ia.mdx',
  'github-copilot-20-millones-programadores.mdx',
  'google-adivina-edad-ia-eeuu.mdx',
  'google-ai-prueba-virtual.mdx',
  'google-discover-ia-visitas.mdx',
  'google-fotos-ia-videos-estilos.mdx',
  'google-ia-canvas-actualiza.mdx',
  'google-ia-ordenar-busquedas.mdx',
  'google-ia-responsable-ue.mdx',
  'google-notebooklm-videos.mdx',
  'google-opal-crear-web-apps.mdx',
  'grok-4-xai-control.mdx',
  'grok-ia-amor-caos.mdx',
  'grok-ia-gotica-anime.mdx',
  'groq-6b-chips-ia-vs-nvidia.mdx',
  'harmonic-ai-robinhood-chatbot.mdx',
  'ia-boom-visitas-web.mdx',
  'ia-diseno-proteinas-facil.mdx',
  'ia-marketing-berkeley-28m.mdx',
  'ia-mates-google-openai.mdx',
  'ia-reportes-falsos-bug-bounties.mdx',
  'ia-techcrunch-disrupt-2025.mdx',
  'ia-trump-anti-woke-tecnologia.mdx',
  'iconfactory-venta-apps-ia.mdx',
  'intel-freno-fabricas-chips.mdx',
  'julius-ai-asegura-10m.mdx',
  'k-prize-ia-codificacion.mdx',
  'lauren-kolodny-ia-herencias.mdx',
  'legalon-ia-tramites-legales.mdx',
  'luma-runway-robotica-oro.mdx',
  'mago-oz-esfera-ia.mdx',
  'malasia-chips-ia-eeuu-permisos.mdx',
  'mercado-chips-eeuu-2025.mdx',
  'meta-corrige-privacidad-ia.mdx',
  'meta-facebook-contenido-copiado.mdx',
  'meta-ficha-openai-superinteligente.mdx',
  'meta-ia-adios-apertura.mdx',
  'meta-ia-infraestructura-72b-2025.mdx',
  'meta-ia-zuckerberg.mdx',
  'microsoft-edge-ia-copilot.mdx',
  'microsoft-openai-ia-mas-alla-agi.mdx',
  'mira-murati-ia-12-mil-millones.mdx',
  'mistral-voxtral-ia-abierta.mdx',
  'nextdoor-ia-alertas.mdx',
  'nvidia-china-luz-verde-ia.mdx',
  'nvidia-chips-china-ai.mdx',
  'observabilidad-apache-iceberg.mdx',
  'openai-noruega-centro-ia-europa.mdx',
  'pichai-google-cloud-openai-ia.mdx',
  'playerzero-15m-ia-codigo-sin-errores.mdx',
  'poe-quora-api-ia.mdx',
  'proton-lumo-ia-privacidad.mdx',
  'reddit-ia-anuncios-ganancias.mdx',
  'samsung-ia-analiza-videos.mdx',
  'sixsense-ia-recauda-8-5m-chips.mdx',
  'spotify-ia-conversacional.mdx',
  'startup-ia-no-compran.mdx',
  'techcrunch-all-stage-boston-startup.mdx',
  'tesla-optimus-no-cumple-meta.mdx',
  'tesla-samsung-chips-ia-165b.mdx',
  'trabajar-openai-ex-ingeniero.mdx',
  'trump-chips-china-ia.mdx',
  'trump-ia-plan.mdx',
  'trump-ia-reglas-china.mdx',
  'vigilar-ia.mdx',
  'zuckerberg-gafas-ia-futuro.mdx',
];

console.log(`📊 Total de artículos sin autor: ${articlesWithoutAuthor.length}`);

// Distribuir autores (CEO con 2-3 artículos más)
const totalWithoutAuthor = articlesWithoutAuthor.length;
const sergioArticles = Math.ceil(totalWithoutAuthor / 2) + 2; // CEO con 2 más
const marilynArticles = totalWithoutAuthor - sergioArticles;

console.log(`📋 Plan de distribución:`);
console.log(`   Sergio Rondón (CEO): ${sergioArticles} artículos`);
console.log(`   Marilyn Cardozo: ${marilynArticles} artículos\n`);

let sergioAssigned = 0;
let marilynAssigned = 0;
const results = {
  success: [] as string[],
  errors: [] as string[],
};

// Asignar autores
for (let i = 0; i < articlesWithoutAuthor.length; i++) {
  const file = articlesWithoutAuthor[i];
  const filePath = path.join(BLOG_DIR, file);

  let authorName: string;
  if (sergioAssigned < sergioArticles) {
    authorName = 'Sergio Rondón';
    sergioAssigned++;
  } else {
    authorName = 'Marilyn Cardozo';
    marilynAssigned++;
  }

  console.log(`📝 Asignando ${authorName} a: ${file}`);

  if (assignAuthorToArticle(filePath, authorName)) {
    results.success.push(`${file} → ${authorName}`);
  } else {
    results.errors.push(`${file} → Error`);
  }
}

// Reporte final
console.log(`\n📊 Resultado final:`);
console.log(`   ✅ Asignaciones exitosas: ${results.success.length}`);
console.log(`   ❌ Errores: ${results.errors.length}\n`);

if (results.success.length > 0) {
  console.log(`✅ Artículos actualizados:`);
  results.success.forEach((result) => {
    console.log(`   📝 ${result}`);
  });
  console.log();
}

if (results.errors.length > 0) {
  console.log(`❌ Errores:`);
  results.errors.forEach((error) => {
    console.log(`   📝 ${error}`);
  });
  console.log();
}

console.log('✅ Proceso completado');
