import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de artículos con sus URLs reales de TechCrunch
const realArticleUrls = {
  '7-de-10-jovenes-eeuu-ia-companeros.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'alaan-fintech-ia-mena-48m.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'altman-chatgpt-terapia-sin-confidencialidad.mdx': 'https://techcrunch.com/2025/07/25/sam-altman-warns-theres-no-legal-confidentiality-when-using-chatgpt-as-a-therapist/',
  'amazon-alexa-anuncios.mdx': 'https://techcrunch.com/2025/07/31/amazon-ceo-wants-to-put-ads-in-your-alexa-conversations/',
  'ambiq-debut-bursatil.mdx': 'https://techcrunch.com/2025/07/30/kleiner-perkins-backed-ambiq-pops-on-ipo-debut/',
  'amor-ia-fin-o-comienzo.mdx': 'https://techcrunch.com/2025/07/24/ai-companions-a-threat-to-love-or-an-evolution-of-it/',
  'anthropic-ia-empresarial-supera-openai.mdx': 'https://techcrunch.com/2025/07/31/enterprises-prefer-anthropics-ai-models-over-anyone-elses-including-openais/',
  'anthropic-valor-170b.mdx': 'https://techcrunch.com/2025/07/29/anthropic-reportedly-nears-170b-valuation-with-potential-5b-round/',
  'apple-ia-chatgpt.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'apple-ia-inversion.mdx': 'https://techcrunch.com/2025/07/31/apple-plans-to-significantly-grow-ai-investments-cook-says/',
  'boom-ia-techo-meta-anthropic.mdx': 'https://techcrunch.com/podcast/from-metas-massive-offers-to-anthropics-massive-valuation-does-ai-have-a-ceiling/',
  'chatgpt-2-5-mil-millones-preguntas-diarias.mdx': 'https://techcrunch.com/2025/07/21/chatgpt-users-send-2-5-billion-prompts-a-day/',
  'chatgpt-chatbot-ia-guia.mdx': 'https://techcrunch.com/2025/07/31/chatgpt-everything-to-know-about-the-ai-chatbot/',
  'chatgpt-modo-estudio-aprende-pensar.mdx': 'https://techcrunch.com/2025/07/29/openai-launches-study-mode-in-chatgpt/',
  'chats-publicos-chatgpt-google.mdx': 'https://techcrunch.com/2025/07/31/your-public-chatgpt-queries-are-getting-indexed-by-google-and-other-search-engines/',
  'chrome-ia-compras.mdx': 'https://techcrunch.com/2025/07/28/google-chrome-adds-ai-powered-store-summaries-to-help-u-s-shoppers/',
  'claude-code-anthropic-exigentes.mdx': 'https://techcrunch.com/2025/07/28/anthropic-unveils-new-rate-limits-to-curb-claude-code-power-users/',
  'coches-autonomos-tekedra-mawakana-waymo.mdx': 'https://techcrunch.com/2025/07/31/waymos-tekedra-mawakana-on-the-truth-behind-autonomous-vehicles-at-techcrunch-disrupt-2025/',
  'cofundador-tech-dispo-acero.mdx': 'https://techcrunch.com/2025/07/28/why-dispos-co-founder-made-the-leap-from-social-media-to-steelmaking/',
  'cognition-windsurf-equipo-google.mdx': 'https://techcrunch.com/2025/07/14/cognition-maker-of-the-ai-coding-agent-devin-acquires-windsurf/',
  'doge-ia-corta-regulaciones.mdx': 'https://techcrunch.com/2025/07/27/doge-has-built-an-ai-tool-to-slash-federal-regulations/',
  'ethan-thornton-ia-defensa-disrupt-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'fotos-youtube-shorts-ia.mdx': 'https://techcrunch.com/2025/07/23/youtube-shorts-is-adding-an-image-to-video-ai-tool-new-ai-effects/',
  'frl-ia-juegos-trabajo.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'github-copilot-20-millones-programadores.mdx': 'https://techcrunch.com/2025/07/30/github-copilot-crosses-20-million-all-time-users/',
  'google-adivina-edad-ia-eeuu.mdx': 'https://techcrunch.com/2025/07/31/google-is-experimenting-with-machine-learning-powered-age-estimation-tech-in-the-u-s/',
  'google-ai-prueba-virtual.mdx': 'https://techcrunch.com/2025/07/24/googles-new-ai-feature-lets-you-virtually-try-on-clothes/',
  'google-discover-ia-visitas.mdx': 'https://techcrunch.com/2025/07/15/google-discover-adds-ai-summaries-threatening-publishers-with-further-traffic-declines/',
  'google-fotos-ia-videos-estilos.mdx': 'https://techcrunch.com/2025/07/23/google-photos-adds-ai-features-for-remixing-photos-in-different-styles-turning-pics-into-videos/',
  'google-gemini-deep-think-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'google-ia-canvas-actualiza.mdx': 'https://techcrunch.com/2025/07/29/googles-ai-mode-gets-new-canvas-feature-real-time-help-with-search-live-and-more/',
  'google-ia-ordenar-busquedas.mdx': 'https://techcrunch.com/2025/07/24/googles-new-web-view-search-experiment-organizes-results-with-ai/',
  'google-ia-responsable-ue.mdx': 'https://techcrunch.com/2025/07/30/google-says-it-will-sign-eus-ai-code-of-practice/',
  'google-notebooklm-videos.mdx': 'https://techcrunch.com/2025/07/29/googles-notebooklm-rolls-out-video-overviews/',
  'google-opal-crear-web-apps.mdx': 'https://techcrunch.com/2025/07/25/google-is-testing-a-vibe-coding-app-called-opal/',
  'google-stan-gaming-social.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'grok-4-ia-descargas-dinero.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2223576505.jpg?resize=1536,1024',
  'grok-4-xai-control.mdx': 'https://techcrunch.com/2025/07/15/xai-says-it-has-fixed-grok-4s-problematic-responses/',
  'grok-ia-amor-caos.mdx': 'https://techcrunch.com/2025/07/15/of-course-groks-ai-companions-want-to-have-sex-and-burn-down-schools/',
  'grok-ia-gotica-anime.mdx': 'https://techcrunch.com/2025/07/14/elon-musks-grok-is-making-ai-companions-including-a-goth-anime-girl/',
  'groq-6b-chips-ia-vs-nvidia.mdx': 'https://techcrunch.com/2025/07/29/nvidia-ai-chip-challenger-groq-said-to-be-nearing-new-fundraising-at-6b-valuation/',
  'harmonic-ai-robinhood-chatbot.mdx': 'https://techcrunch.com/2025/07/28/harmonic-the-robinhood-ceos-ai-math-startup-launches-an-ai-chatbot-app/',
  'ia-boom-visitas-web.mdx': 'https://techcrunch.com/wp-content/uploads/2024/07/ai-referrals-category.png?w=680',
  'ia-diseno-proteinas-facil.mdx': 'https://techcrunch.com/2025/07/21/latent-labs-launches-web-based-ai-model-to-democratize-protein-design/',
  'ia-marketing-berkeley-28m.mdx': 'https://techcrunch.com/2025/07/30/how-2-uc-berkeley-dropouts-raised-28m-for-their-ai-marketing-automation-startup/',
  'ia-mates-google-openai.mdx': 'https://techcrunch.com/2025/07/21/openai-and-google-outdo-the-mathletes-but-not-each-other/',
  'ia-reportes-falsos-bug-bounties.mdx': 'https://techcrunch.com/2025/07/24/ai-slop-and-fake-reports-are-exhausting-some-security-bug-bounties/',
  'ia-techcrunch-disrupt-2025.mdx': 'https://techcrunch.com/2025/07/28/meet-the-minds-shaping-ai-techcrunch-disrupt-2025-ai-stage-revealed/',
  'ia-todoterreno-openai.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'ia-trump-anti-woke-tecnologia.mdx': 'https://techcrunch.com/2025/07/23/trumps-anti-woke-ai-order-could-reshape-how-us-tech-companies-train-their-models/',
  'iconfactory-venta-apps-ia.mdx': 'https://techcrunch.com/2025/07/31/design-and-development-shop-the-iconfactory-is-selling-some-apps-and-ai-is-partially-to-blame/',
  'intel-freno-fabricas-chips.mdx': 'https://techcrunch.com/2025/07/24/intel-continues-to-pull-back-on-its-manufacturing-projects/',
  'julius-ai-asegura-10m.mdx': 'https://techcrunch.com/2025/07/28/ai-data-analyst-startup-julius-nabs-10m-seed-round/',
  'k-prize-ia-codificacion.mdx': 'https://techcrunch.com/2025/07/23/a-new-ai-coding-challenge-just-published-its-first-results-and-they-arent-pretty/',
  'lauren-kolodny-ia-herencias.mdx': 'https://techcrunch.com/2025/07/24/chime-backer-lauren-kolodny-bets-on-ai-to-revolutionize-estate-processing/',
  'legalon-ia-tramites-legales.mdx': 'https://techcrunch.com/2025/07/24/softbank-backed-legalon-fuels-ai-for-in-house-legal-team-with-50m-series-e/',
  'lovable-supera-100m-arr-8-meses.mdx': 'https://techcrunch.com/2025/07/22/lovable-the-swedish-unicorn-that-just-hit-100m-in-annual-recurring-revenue-in-8-months/',
  'luma-runway-robotica-oro.mdx': 'https://techcrunch.com/2025/07/29/luma-and-runway-expect-robotics-to-eventually-be-a-big-revenue-driver-for-them/',
  'mago-oz-esfera-ia.mdx': 'https://techcrunch.com/2025/07/27/wizard-of-oz-blown-up-by-ai-for-giant-sphere-screen/',
  'malasia-chips-ia-eeuu-permisos.mdx': 'https://techcrunch.com/2025/07/14/malaysia-will-require-trade-permits-for-u-s-ai-chips/',
  'mercado-chips-eeuu-2025.mdx': 'https://techcrunch.com/2025/07/25/a-timeline-of-the-u-s-semiconductor-market-in-2025/',
  'meta-centros-datos-ia.mdx': 'https://techcrunch.com/2024/02/16/meta-reportedly-using-actual-tents-to-build-data-centers/',
  'meta-corrige-privacidad-ia.mdx': 'https://techcrunch.com/2025/07/15/meta-fixes-bug-that-could-leak-users-ai-prompts-and-generated-content/',
  'meta-facebook-contenido-copiado.mdx': 'https://techcrunch.com/2025/07/14/following-youtube-meta-announces-crackdown-on-unoriginal-facebook-content/',
  'meta-ficha-openai-superinteligente.mdx': 'https://techcrunch.com/2025/07/25/meta-names-shengjia-zhao-as-chief-scientist-of-ai-superintelligence-unit/',
  'meta-ia-adios-apertura.mdx': 'https://techcrunch.com/2025/07/14/meta-built-its-ai-reputation-on-openness-that-may-be-changing/',
  'meta-ia-infraestructura-72b-2025.mdx': 'https://techcrunch.com/2025/07/30/meta-to-spend-up-to-72b-on-ai-infrastructure-in-2025-as-compute-arms-race-escalates/',
  'meta-ia-zuckerberg.mdx': 'https://techcrunch.com/2025/07/30/zuckerberg-says-meta-likely-wont-open-source-all-of-its-superintelligence-ai-models/',
  'microsoft-edge-ia-copilot.mdx': 'https://techcrunch.com/2025/07/28/microsoft-edge-is-now-an-ai-browser-with-launch-of-copilot-mode/',
  'microsoft-openai-ia-mas-alla-agi.mdx': 'https://techcrunch.com/2025/07/29/microsoft-in-talks-to-maintain-access-to-openais-tech-beyond-agi-milestone/',
  'mira-murati-ia-12-mil-millones.mdx': 'https://techcrunch.com/2025/07/15/mira-muratis-thinking-machines-lab-is-worth-12b-in-seed-round/',
  'mistral-voxtral-ia-abierta.mdx': 'https://techcrunch.com/2025/07/15/mistral-releases-voxtral-its-first-open-source-ai-audio-model/',
  'nextdoor-ia-alertas.mdx': 'https://techcrunch.com/2025/07/15/nextdoor-redesigns-app-with-ai-recommendations-local-news-and-real-time-emergency-alerts/',
  'nvidia-china-luz-verde-ia.mdx': 'https://techcrunch.com/2025/07/14/nvidia-is-set-to-resume-china-chip-sales-after-months-of-regulatory-whiplash/',
  'nvidia-chips-china-ai.mdx': 'https://techcrunch.com/2025/07/28/20-national-security-experts-urge-trump-administration-to-restrict-nvidia-h20-sales-to-china/',
  'nvidia-h20-licencias-frenadas-eeuu.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'observabilidad-apache-iceberg.mdx': 'https://techcrunch.com/2025/07/30/observe-continues-to-adapt-to-the-changing-world-of-software-observability/',
  'openai-noruega-centro-ia-europa.mdx': 'https://techcrunch.com/2025/07/31/openai-to-launch-ai-data-center-in-norway-its-first-in-europe/',
  'openai-valoracion-300b.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'pichai-google-cloud-openai-ia.mdx': 'https://techcrunch.com/2025/07/23/sundar-pichai-is-very-excited-about-google-clouds-openai-partnership/',
  'playerzero-15m-ia-codigo-sin-errores.mdx': 'https://techcrunch.com/2025/07/30/playerzero-raises-15m-to-prevent-ai-agents-from-shipping-buggy-code/',
  'poe-quora-api-ia.mdx': 'https://techcrunch.com/2025/07/31/quoras-poe-is-releasing-an-api-for-developers-to-easily-access-a-boquet-of-models/',
  'proton-lumo-ia-privacidad.mdx': 'https://techcrunch.com/2025/07/23/protons-new-privacy-first-ai-assistant-encrypts-all-chats-keeps-no-logs/',
  'quien-gana-auge-ia.mdx': 'https://techcrunch.com/podcast/who-really-benefits-from-the-ai-boom/',
  'reddit-ia-anuncios-ganancias.mdx': 'https://techcrunch.com/2025/07/31/reddit-revenue-soars-as-it-bets-on-ai-and-advertising/',
  'samsung-ia-analiza-videos.mdx': 'https://techcrunch.com/2025/07/24/samsung-backs-a-video-ai-startup-that-can-analyze-thousands-of-hours-of-footage/',
  'sixsense-ia-recauda-8-5m-chips.mdx': 'https://techcrunch.com/2025/07/31/female-founded-semiconductor-ai-startup-sixsense-raises-funding/',
  'spotify-ia-conversacional.mdx': 'https://techcrunch.com/2025/07/29/spotify-hints-at-a-more-chatty-voice-ai-interface-in-the-future/',
  'startup-ia-no-compran.mdx': 'https://techcrunch.com/2025/07/24/this-industrial-ai-startup-is-winning-over-customers-by-saying-it-wont-get-acquired/',
  'talento-ia-liga-mayor-tecnologia.mdx': 'https://techcrunch.com/podcast/ais-talent-arms-race-is-starting-to-look-like-pro-sports/',
  'techcrunch-all-stage-boston-startup.mdx': 'https://techcrunch.com/wp-content/uploads/2025/03/Early-Stage-2024-audience.jpg?w=1024',
  'tesla-optimus-no-cumple-meta.mdx': 'https://techcrunch.com/2025/07/25/tesla-is-reportedly-behind-on-its-pledge-to-build-5000-optimus-bots-this-year/',
  'tesla-samsung-chips-ia-165b.mdx': 'https://techcrunch.com/2025/07/28/tesla-signs-16-5b-deal-with-samsung-to-make-ai-chips/',
  'trabajar-openai-ex-ingeniero.mdx': 'https://techcrunch.com/2025/07/15/a-former-openai-engineer-describes-what-its-really-like-to-work-there/',
  'trump-chips-china-ia.mdx': 'https://techcrunch.com/2025/07/23/trumps-ai-action-plan-aims-to-block-chip-exports-to-china-but-lacks-key-details/',
  'trump-ia-plan.mdx': 'https://techcrunch.com/2025/07/23/trump-is-set-to-unveil-his-ai-roadmap-heres-what-to-know/',
  'trump-ia-reglas-china.mdx': 'https://techcrunch.com/2025/07/23/trumps-ai-strategy-trades-guardrails-for-growth-in-race-against-china/',
  'trump-ia-silicon-valley.mdx': 'https://techcrunch.com/podcast/should-silicon-valley-celebrate-trumps-ai-plans/',
  'vast-data-ia-30b-google-nvidia.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'vigilar-ia.mdx': 'https://techcrunch.com/2025/07/15/research-leaders-urge-tech-industry-to-monitor-ais-thoughts/',
  'vogue-ia-adios-modelos.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'windsurf-google-reparto-dinero.mdx': 'https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png',
  'zuckerberg-gafas-ia-futuro.mdx': 'https://techcrunch.com/2025/07/30/zuckerberg-says-people-without-ai-glasses-will-be-at-a-disadvantage-in-the-future/'
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
    
    const articleUrl = realArticleUrls[file];
    if (!articleUrl) {
      console.log(`⏭️  Sin URL de referencia: ${file}`);
      continue;
    }
    
    // Si la URL ya es una imagen, usarla directamente
    if (articleUrl.includes('/wp-content/uploads/')) {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const newContent = content.replace(
        /cover: 'https:\/\/[^']*'/,
        `cover: '${articleUrl}'`
      );
      
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Actualizado (imagen directa): ${file}`);
      updatedCount++;
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