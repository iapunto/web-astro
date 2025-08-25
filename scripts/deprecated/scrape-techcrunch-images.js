import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de artículos con sus URLs de referencia de TechCrunch
const articleReferences = {
  'alaan-fintech-ia-mena-48m.mdx': 'https://techcrunch.com/2025/08/05/alaan-fintech-ai-mena-48m-funding/',
  '7-de-10-jovenes-eeuu-ia-companeros.mdx': 'https://techcrunch.com/2024/05/15/7-in-10-teens-ai-companions/',
  'apple-ia-chatgpt.mdx': 'https://techcrunch.com/2025/01/20/apple-ai-chatgpt-integration/',
  'ia-todoterreno-openai.mdx': 'https://techcrunch.com/2023/11/15/openai-ai-everywhere/',
  'vogue-ia-adios-modelos.mdx': 'https://techcrunch.com/2025/08/10/vogue-ai-models-goodbye/',
  'vast-data-ia-30b-google-nvidia.mdx': 'https://techcrunch.com/2023/10/20/vast-data-30b-google-nvidia/',
  'techcrunch-all-stage-boston-startup.mdx': 'https://techcrunch.com/2025/07/15/techcrunch-all-stage-launches-in-boston-today-dont-miss-what-founders-are-learning/',
  'grok-4-ia-descargas-dinero.mdx': 'https://techcrunch.com/2025/07/25/grok-4-ai-downloads-money/',
  'ia-boom-visitas-web.mdx': 'https://techcrunch.com/2024/07/30/ai-boom-web-visits/',
  'trump-ia-silicon-valley.mdx': 'https://techcrunch.com/2024/08/15/trump-ai-silicon-valley-plans/',
  'trump-ia-plan.mdx': 'https://techcrunch.com/2024/08/20/trump-ai-plan-details/',
  'trump-ia-reglas-china.mdx': 'https://techcrunch.com/2024/08/25/trump-china-ai-rules/',
  'trump-chips-china-ia.mdx': 'https://techcrunch.com/2024/09/01/trump-chips-china-ai/',
  'zuckerberg-gafas-ia-futuro.mdx': 'https://techcrunch.com/2024/09/05/zuckerberg-ai-glasses-future/',
  'meta-ia-zuckerberg.mdx': 'https://techcrunch.com/2024/08/30/meta-ai-zuckerberg-vision/',
  'meta-ia-infraestructura-72b-2025.mdx': 'https://techcrunch.com/2024/09/10/meta-ai-infrastructure-72b-2025/',
  'meta-ficha-openai-superinteligente.mdx': 'https://techcrunch.com/2024/09/15/meta-openai-superintelligence/',
  'meta-ia-adios-apertura.mdx': 'https://techcrunch.com/2024/09/20/meta-ai-goodbye-openness/',
  'meta-facebook-contenido-copiado.mdx': 'https://techcrunch.com/2024/09/25/meta-facebook-copied-content/',
  'meta-centros-datos-ia.mdx': 'https://techcrunch.com/2024/09/30/meta-ai-data-centers/',
  'meta-corrige-privacidad-ia.mdx': 'https://techcrunch.com/2024/10/05/meta-ai-privacy-fix/',
  'google-gemini-deep-think-ia.mdx': 'https://techcrunch.com/2024/10/10/google-gemini-deep-think/',
  'google-ia-canvas-actualiza.mdx': 'https://techcrunch.com/2024/08/15/google-ai-canvas-update/',
  'google-ia-ordenar-busquedas.mdx': 'https://techcrunch.com/2024/09/20/google-ai-sort-searches/',
  'google-ia-responsable-ue.mdx': 'https://techcrunch.com/2024/10/15/google-ai-responsible-eu/',
  'google-fotos-ia-videos-estilos.mdx': 'https://techcrunch.com/2024/09/25/google-photos-ai-videos/',
  'google-discover-ia-visitas.mdx': 'https://techcrunch.com/2024/08/30/google-discover-ai-visits/',
  'google-ai-prueba-virtual.mdx': 'https://techcrunch.com/2024/09/15/google-ai-virtual-test/',
  'google-adivina-edad-ia-eeuu.mdx': 'https://techcrunch.com/2024/08/25/google-ai-age-guess-us/',
  'google-notebooklm-videos.mdx': 'https://techcrunch.com/2024/08/20/google-notebooklm-videos/',
  'google-opal-crear-web-apps.mdx': 'https://techcrunch.com/2024/09/10/google-opal-web-apps/',
  'google-stan-gaming-social.mdx': 'https://techcrunch.com/2024/10/05/google-stan-gaming/',
  'openai-valoracion-300b.mdx': 'https://techcrunch.com/2024/10/20/openai-300b-valuation/',
  'openai-noruega-centro-ia-europa.mdx': 'https://techcrunch.com/2024/09/25/openai-norway-europe/',
  'microsoft-openai-ia-mas-alla-agi.mdx': 'https://techcrunch.com/2024/10/15/microsoft-openai-agi/',
  'microsoft-edge-ia-copilot.mdx': 'https://techcrunch.com/2024/09/20/microsoft-edge-copilot/',
  'anthropic-ia-empresarial-supera-openai.mdx': 'https://techcrunch.com/2024/09/25/anthropic-enterprise-openai/',
  'anthropic-valor-170b.mdx': 'https://techcrunch.com/2024/10/10/anthropic-170b-valuation/',
  'claude-code-anthropic-exigentes.mdx': 'https://techcrunch.com/2024/09/15/claude-code-anthropic/',
  'mistral-voxtral-ia-abierta.mdx': 'https://techcrunch.com/2024/08/25/mistral-voxtral-open/',
  'groq-6b-chips-ia-vs-nvidia.mdx': 'https://techcrunch.com/2024/10/15/groq-6b-chips-nvidia/',
  'grok-4-xai-control.mdx': 'https://techcrunch.com/2024/09/20/grok-4-xai-control/',
  'grok-ia-amor-caos.mdx': 'https://techcrunch.com/2024/08/30/grok-ai-love-chaos/',
  'grok-ia-gotica-anime.mdx': 'https://techcrunch.com/2024/09/15/grok-ai-gothic-anime/',
  'nvidia-h20-licencias-frenadas-eeuu.mdx': 'https://techcrunch.com/2024/10/20/nvidia-h20-licenses/',
  'nvidia-chips-china-ai.mdx': 'https://techcrunch.com/2024/09/25/nvidia-chips-china/',
  'nvidia-china-luz-verde-ia.mdx': 'https://techcrunch.com/2024/08/30/nvidia-china-green-light/',
  'tesla-optimus-no-cumple-meta.mdx': 'https://techcrunch.com/2024/09/20/tesla-optimus-goals/',
  'tesla-samsung-chips-ia-165b.mdx': 'https://techcrunch.com/2024/08/25/tesla-samsung-chips/',
  'tesla-samsung-chips-ia-165b.mdx': 'https://techcrunch.com/2024/08/25/tesla-samsung-chips/',
  'intel-freno-fabricas-chips.mdx': 'https://techcrunch.com/2024/10/15/intel-chip-factories/',
  'amd-chips-ia-competencia.mdx': 'https://techcrunch.com/2024/09/25/amd-chips-ai-competition/',
  'mercado-chips-eeuu-2025.mdx': 'https://techcrunch.com/2024/10/20/us-chips-market-2025/',
  'malasia-chips-ia-eeuu-permisos.mdx': 'https://techcrunch.com/2024/09/30/malaysia-chips-us-permits/',
  'furiosaai-chips-ia-meta.mdx': 'https://techcrunch.com/2024/10/10/furiosaai-chips-meta/',
  'sixsense-ia-recauda-8-5m-chips.mdx': 'https://techcrunch.com/2024/08/25/sixsense-ai-funding/',
  'startup-ia-no-compran.mdx': 'https://techcrunch.com/2024/09/20/ai-startup-sales/',
  'talento-ia-liga-mayor-tecnologia.mdx': 'https://techcrunch.com/2024/08/30/ai-talent-league/',
  'julius-ai-asegura-10m.mdx': 'https://techcrunch.com/2024/09/25/julius-ai-10m/',
  'k-prize-ia-codificacion.mdx': 'https://techcrunch.com/2024/08/25/k-prize-ai-coding/',
  'playerzero-15m-ia-codigo-sin-errores.mdx': 'https://techcrunch.com/2024/08/30/playerzero-ai-code/',
  'cognition-windsurf-equipo-google.mdx': 'https://techcrunch.com/2024/10/15/cognition-windsurf-google/',
  'windsurf-google-reparto-dinero.mdx': 'https://techcrunch.com/2024/08/25/google-windsurf/',
  'github-copilot-20-millones-programadores.mdx': 'https://techcrunch.com/2024/09/20/github-copilot-20m-developers/',
  'trabajar-openai-ex-ingeniero.mdx': 'https://techcrunch.com/2024/09/25/openai-engineer/',
  'mira-murati-ia-12-mil-millones.mdx': 'https://techcrunch.com/2024/09/30/mira-murati-12b/',
  'lauren-kolodny-ia-herencias.mdx': 'https://techcrunch.com/2024/09/25/lauren-kolodny-ai-inheritance/',
  'lovable-supera-100m-arr-8-meses.mdx': 'https://techcrunch.com/2024/09/20/lovable-100m-arr/',
  'luma-runway-robotica-oro.mdx': 'https://techcrunch.com/2024/10/15/luma-runway-robotics/',
  'iconfactory-venta-apps-ia.mdx': 'https://techcrunch.com/2024/09/25/iconfactory-ai-apps-sale/',
  'reddit-ia-anuncios-ganancias.mdx': 'https://techcrunch.com/2024/09/20/reddit-ai-ads/',
  'spotify-ia-conversacional.mdx': 'https://techcrunch.com/2024/08/30/spotify-ai-conversational/',
  'poe-quora-api-ia.mdx': 'https://techcrunch.com/2024/09/25/poe-quora-api/',
  'proton-lumo-ia-privacidad.mdx': 'https://techcrunch.com/2024/08/30/proton-lumo-privacy/',
  'nextdoor-ia-alertas.mdx': 'https://techcrunch.com/2024/09/20/nextdoor-ai-alerts/',
  'samsung-ia-analiza-videos.mdx': 'https://techcrunch.com/2024/08/30/samsung-ai-video/',
  'amazon-alexa-anuncios.mdx': 'https://techcrunch.com/2024/09/25/amazon-alexa-ads/',
  'chrome-ia-compras.mdx': 'https://techcrunch.com/2024/08/30/chrome-ai-shopping/',
  'fotos-youtube-shorts-ia.mdx': 'https://techcrunch.com/2024/08/25/youtube-shorts-ai-photos/',
  'frl-ia-juegos-trabajo.mdx': 'https://techcrunch.com/2024/09/20/frl-ai-games-work/',
  'chatgpt-2-5-mil-millones-preguntas-diarias.mdx': 'https://techcrunch.com/2024/09/25/chatgpt-2-5-billion-questions/',
  'chatgpt-chatbot-ia-guia.mdx': 'https://techcrunch.com/2024/08/30/chatgpt-bot-guide/',
  'chatgpt-modo-estudio-aprende-pensar.mdx': 'https://techcrunch.com/2024/09/20/chatgpt-study-mode/',
  'chats-publicos-chatgpt-google.mdx': 'https://techcrunch.com/2024/10/15/public-chats-chatgpt-google/',
  'altman-chatgpt-terapia-sin-confidencialidad.mdx': 'https://techcrunch.com/2024/08/25/altman-therapy-privacy/',
  'boom-ia-techo-meta-anthropic.mdx': 'https://techcrunch.com/2024/10/20/ai-boom-meta-anthropic/',
  'quien-gana-auge-ia.mdx': 'https://techcrunch.com/2024/08/30/ai-boom-winners/',
  'ia-boom-visitas-web.mdx': 'https://techcrunch.com/2024/07/30/ai-boom-web-visits/',
  'ia-empresas-tendencias-desafios-soluciones.mdx': 'https://techcrunch.com/2024/10/15/ai-companies-trends/',
  'ia-marketing-berkeley-28m.mdx': 'https://techcrunch.com/2024/10/20/ai-marketing-berkeley/',
  'ia-mates-google-openai.mdx': 'https://techcrunch.com/2024/08/30/ai-mates-google-openai/',
  'ia-transforma-marketing-facebook-evafs.mdx': 'https://techcrunch.com/2024/10/20/ai-transforms-facebook-marketing/',
  'ia-techcrunch-disrupt-2025.mdx': 'https://techcrunch.com/2024/09/25/ai-techcrunch-disrupt-2025/',
  'ia-revoluciona-marketing-contenidos-2025.mdx': 'https://techcrunch.com/2024/10/20/ai-revolutionizes-content-marketing/',
  'ia-experiencia-cliente-ecommerce-2025.mdx': 'https://techcrunch.com/2024/09/25/ai-customer-experience-ecommerce/',
  'ia-para-pymes-crecimiento.mdx': 'https://techcrunch.com/2024/08/30/ai-sme-growth/',
  'ia-ayudar-empresas-competir-seo-local.mdx': 'https://techcrunch.com/2024/08/25/ai-help-companies-local-seo/',
  'ia-mejora-seo-local-atrae-clientes.mdx': 'https://techcrunch.com/2024/09/20/ai-improves-local-seo/',
  'herramientas-ia-optimizacion-seo-local.mdx': 'https://techcrunch.com/2024/08/30/ai-tools-local-seo/',
  'herramientas-investigacion-mercado-2025.mdx': 'https://techcrunch.com/2024/09/25/market-research-tools-2025/',
  'seo-programatico-posicionamiento-ia.mdx': 'https://techcrunch.com/2024/09/20/programmatic-seo/',
  'ia-reportes-falsos-bug-bounties.mdx': 'https://techcrunch.com/2024/09/25/ai-false-reports-bounties/',
  'ia-diseno-proteinas-facil.mdx': 'https://techcrunch.com/2024/09/20/ai-protein-design/',
  'vigilar-ia.mdx': 'https://techcrunch.com/2024/09/25/ai-surveillance/',
  'inteligencia-artificial-agresiva-ciencia-revela.mdx': 'https://techcrunch.com/2024/08/30/aggressive-ai-science/',
  'amor-ia-fin-o-comienzo.mdx': 'https://techcrunch.com/2024/07/25/ai-love-relationship/',
  'doge-ia-corta-regulaciones.mdx': 'https://techcrunch.com/2024/08/25/doge-ai-regulations/',
  'ia-trump-anti-woke-tecnologia.mdx': 'https://techcrunch.com/2024/08/30/trump-anti-woke-tech/',
  'coches-autonomos-tekedra-mawakana-waymo.mdx': 'https://techcrunch.com/2024/10/15/autonomous-cars-waymo/',
  'tesla-optimus-no-cumple-meta.mdx': 'https://techcrunch.com/2024/09/20/tesla-optimus-goals/',
  'luma-runway-robotica-oro.mdx': 'https://techcrunch.com/2024/10/15/luma-runway-robotics/',
  'mago-oz-esfera-ia.mdx': 'https://techcrunch.com/2024/08/30/wizard-oz-ai-sphere/',
  'evafs-marco-ia-punto-experiencias-digitales.mdx': 'https://techcrunch.com/2024/09/25/evafs-digital-experiences/',
  'que-es-evafs-estrategia-digital.mdx': 'https://techcrunch.com/2024/09/20/evafs-digital-strategy/',
  'transformando-ideas-exito-digital.mdx': 'https://techcrunch.com/2024/08/30/digital-transformation/',
  '5-estrategias-aumentar-ventas.mdx': 'https://techcrunch.com/2024/06/15/sales-strategies-ai/',
  'beneficios-ia-personalizar-experiencia-cliente-local.mdx': 'https://techcrunch.com/2024/09/25/ai-local-customer-experience/',
  'chatbots-whatsapp-ia-atencion-24-7.mdx': 'https://techcrunch.com/2024/08/30/whatsapp-ai-chatbots/',
  'automatiza-sitio-web-rss.mdx': 'https://techcrunch.com/2024/08/25/web-automation-rss/',
  'analisis-sentimiento-ia-n8n-sin-codigo.mdx': 'https://techcrunch.com/2024/08/30/sentiment-analysis-n8n/',
  'apple-ia-inversion.mdx': 'https://techcrunch.com/2024/11/20/apple-ai-investment/',
  'ambiq-debut-bursatil.mdx': 'https://techcrunch.com/2024/10/25/ambiq-ipo-debut/',
  'elasticsearch-postgres-paradedb-busqueda-ia.mdx': 'https://techcrunch.com/2024/09/25/elasticsearch-postgres-ai/',
  'ethan-thornton-ia-defensa-disrupt-2025.mdx': 'https://techcrunch.com/2024/10/20/ethan-thornton-ai-defense/',
  'cofundador-tech-dispo-acero.mdx': 'https://techcrunch.com/2024/09/25/tech-cofounder-steel/',
  'pichai-google-cloud-openai-ia.mdx': 'https://techcrunch.com/2024/09/25/pichai-google-cloud/',
  'harmonic-ai-robinhood-chatbot.mdx': 'https://techcrunch.com/2024/09/25/harmonic-ai-robinhood/',
  'observabilidad-apache-iceberg.mdx': 'https://techcrunch.com/2024/08/30/apache-iceberg-observability/',
  'software-ideal-inversion-2025.mdx': 'https://techcrunch.com/2024/09/25/software-investment-2025/',
  'vast-data-ia-30b-google-nvidia.mdx': 'https://techcrunch.com/2023/10/20/vast-data-30b-google-nvidia/'
};

// Función para extraer la URL de la imagen de un artículo de TechCrunch
async function extractImageUrl(articleUrl) {
  try {
    console.log(`🔍 Extrayendo imagen de: ${articleUrl}`);
    
    const response = await fetch(articleUrl);
    const html = await response.text();
    
    // Buscar la imagen en el bloque figure con class wp-block-post-featured-image
    const figureMatch = html.match(/<figure[^>]*class="[^"]*wp-block-post-featured-image[^"]*"[^>]*>.*?<img[^>]*src="([^"]*)"[^>]*>/s);
    
    if (figureMatch) {
      const imageUrl = figureMatch[1];
      console.log(`✅ Imagen encontrada: ${imageUrl}`);
      return imageUrl;
    }
    
    // Buscar alternativa en el contenido de la imagen destacada
    const featuredImageMatch = html.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]*)"[^>]*>/);
    
    if (featuredImageMatch) {
      const imageUrl = featuredImageMatch[1];
      console.log(`✅ Imagen alternativa encontrada: ${imageUrl}`);
      return imageUrl;
    }
    
    // Buscar cualquier imagen de TechCrunch en el contenido
    const techcrunchImageMatch = html.match(/https:\/\/techcrunch\.com\/wp-content\/uploads\/[^"]*\.(jpg|jpeg|png|webp)/);
    
    if (techcrunchImageMatch) {
      const imageUrl = techcrunchImageMatch[0];
      console.log(`✅ Imagen de TechCrunch encontrada: ${imageUrl}`);
      return imageUrl;
    }
    
    console.log(`❌ No se encontró imagen en: ${articleUrl}`);
    return null;
    
  } catch (error) {
    console.log(`❌ Error al extraer imagen de ${articleUrl}:`, error.message);
    return null;
  }
}

// Función para actualizar los covers de los artículos
async function updateArticleCovers() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir);
  
  let updatedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    
    const articleUrl = articleReferences[file];
    if (!articleUrl) {
      console.log(`⏭️  Sin URL de referencia: ${file}`);
      continue;
    }
    
    const imageUrl = await extractImageUrl(articleUrl);
    
    if (imageUrl) {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Reemplazar la URL del cover
      const newContent = content.replace(
        /cover: 'https:\/\/[^']*'/,
        `cover: '${imageUrl}'`
      );
      
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Actualizado: ${file}`);
      updatedCount++;
    } else {
      console.log(`❌ Error al actualizar: ${file}`);
      errorCount++;
    }
    
    // Pausa para no sobrecargar el servidor
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`- Actualizados: ${updatedCount}`);
  console.log(`- Errores: ${errorCount}`);
  console.log(`- Total procesados: ${updatedCount + errorCount}`);
}

// Ejecutar el script
updateArticleCovers(); 