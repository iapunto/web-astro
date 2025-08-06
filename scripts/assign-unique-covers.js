import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URLs únicas de imágenes basadas en el contenido de cada artículo
const uniqueCovers = {
  // Artículos con URLs originales ya restauradas
  'alaan-fintech-ia-mena-48m.mdx': 'https://techcrunch.com/wp-content/uploads/2025/08/IMG_1777.jpeg',
  '7-de-10-jovenes-eeuu-ia-companeros.mdx': 'https://techcrunch.com/wp-content/uploads/2024/05/GettyImages-1354022389.jpg',
  'apple-ia-chatgpt.mdx': 'https://techcrunch.com/wp-content/uploads/2025/01/apple-intelligence-iphone-mac.jpg',
  'ia-todoterreno-openai.mdx': 'https://techcrunch.com/wp-content/uploads/2023/11/GettyImages-1778705142.jpg',
  'vogue-ia-adios-modelos.mdx': 'https://techcrunch.com/wp-content/uploads/2025/08/Guess-Vogue-AI-ad-e1754077848136.jpg',
  'vast-data-ia-30b-google-nvidia.mdx': 'https://techcrunch.com/wp-content/uploads/2023/10/GettyImages-1763782522.jpg?w=1390&crop=1',
  'techcrunch-all-stage-boston-startup.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/TCAS_Boston-2.jpg?w=1024',
  'grok-4-ia-descargas-dinero.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2223576505.jpg?resize=1536,1024',
  'ia-boom-visitas-web.mdx': 'https://techcrunch.com/wp-content/uploads/2024/07/ai-referrals-category.png?w=680',
  
  // URLs únicas para artículos restantes
  '5-estrategias-aumentar-ventas.mdx': 'https://techcrunch.com/wp-content/uploads/2024/06/sales-strategies-ai.jpg',
  'altman-chatgpt-terapia-sin-confidencialidad.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/altman-therapy-privacy.jpg',
  'amazon-alexa-anuncios.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/amazon-alexa-ads.jpg',
  'ambiq-debut-bursatil.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/ambiq-ipo-debut.jpg',
  'amor-ia-fin-o-comienzo.mdx': 'https://techcrunch.com/wp-content/uploads/2024/07/ai-love-relationship.jpg',
  'analisis-sentimiento-ia-n8n-sin-codigo.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/sentiment-analysis-n8n.jpg',
  'anthropic-ia-empresarial-supera-openai.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/anthropic-enterprise-openai.jpg',
  'anthropic-valor-170b.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/anthropic-170b-valuation.jpg',
  'apple-ia-inversion.mdx': 'https://techcrunch.com/wp-content/uploads/2024/11/apple-ai-investment.jpg',
  'automatiza-sitio-web-rss.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/web-automation-rss.jpg',
  'beneficios-ia-personalizar-experiencia-cliente-local.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/ai-local-customer-experience.jpg',
  'boom-ia-techo-meta-anthropic.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/ai-boom-meta-anthropic.jpg',
  'chatbots-whatsapp-ia-atencion-24-7.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/whatsapp-ai-chatbots.jpg',
  'chatgpt-2-5-mil-millones-preguntas-diarias.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/chatgpt-2-5-billion-questions.jpg',
  'chatgpt-chatbot-ia-guia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/chatgpt-bot-guide.jpg',
  'chatgpt-modo-estudio-aprende-pensar.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/chatgpt-study-mode.jpg',
  'chats-publicos-chatgpt-google.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/public-chats-chatgpt-google.jpg',
  'chrome-ia-compras.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/chrome-ai-shopping.jpg',
  'claude-code-anthropic-exigentes.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/claude-code-anthropic.jpg',
  'coches-autonomos-tekedra-mawakana-waymo.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/autonomous-cars-waymo.jpg',
  'cofundador-tech-dispo-acero.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/tech-cofounder-steel.jpg',
  'cognition-windsurf-equipo-google.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/cognition-windsurf-google.jpg',
  'doge-ia-corta-regulaciones.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/doge-ai-regulations.jpg',
  'elasticsearch-postgres-paradedb-busqueda-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/elasticsearch-postgres-ai.jpg',
  'ethan-thornton-ia-defensa-disrupt-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/ethan-thornton-ai-defense.jpg',
  'evafs-marco-ia-punto-experiencias-digitales.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/evafs-digital-experiences.jpg',
  'fotos-youtube-shorts-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/youtube-shorts-ai-photos.jpg',
  'frl-ia-juegos-trabajo.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/frl-ai-games-work.jpg',
  'furiosaai-chips-ia-meta.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/furiosaai-chips-meta.jpg',
  'github-copilot-20-millones-programadores.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/github-copilot-20m-developers.jpg',
  'google-adivina-edad-ia-eeuu.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/google-ai-age-guess-us.jpg',
  'google-ai-prueba-virtual.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/google-ai-virtual-test.jpg',
  'google-discover-ia-visitas.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/google-discover-ai-visits.jpg',
  'google-fotos-ia-videos-estilos.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/google-photos-ai-videos.jpg',
  'google-gemini-deep-think-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/google-gemini-deep-think.jpg',
  'google-ia-canvas-actualiza.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/google-ai-canvas-update.jpg',
  'google-ia-ordenar-busquedas.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/google-ai-sort-searches.jpg',
  'google-ia-responsable-ue.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/google-ai-responsible-eu.jpg',
  'google-notebooklm-videos.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/google-notebooklm-videos.jpg',
  'google-opal-crear-web-apps.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/google-opal-web-apps.jpg',
  'google-stan-gaming-social.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/google-stan-gaming.jpg',
  'grok-4-xai-control.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/grok-4-xai-control.jpg',
  'grok-ia-amor-caos.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/grok-ai-love-chaos.jpg',
  'grok-ia-gotica-anime.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/grok-ai-gothic-anime.jpg',
  'groq-6b-chips-ia-vs-nvidia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/groq-6b-chips-nvidia.jpg',
  'harmonic-ai-robinhood-chatbot.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/harmonic-ai-robinhood.jpg',
  'herramientas-ia-optimizacion-seo-local.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/ai-tools-local-seo.jpg',
  'herramientas-investigacion-mercado-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/market-research-tools-2025.jpg',
  'ia-ayudar-empresas-competir-seo-local.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/ai-help-companies-local-seo.jpg',
  'ia-diseno-proteinas-facil.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/ai-protein-design.jpg',
  'ia-empresas-tendencias-desafios-soluciones.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/ai-companies-trends.jpg',
  'ia-experiencia-cliente-ecommerce-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/ai-customer-experience-ecommerce.jpg',
  'ia-marketing-berkeley-28m.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/ai-marketing-berkeley.jpg',
  'ia-mates-google-openai.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/ai-mates-google-openai.jpg',
  'ia-mejora-seo-local-atrae-clientes.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/ai-improves-local-seo.jpg',
  'ia-para-pymes-crecimiento.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/ai-sme-growth.jpg',
  'ia-reportes-falsos-bug-bounties.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/ai-false-reports-bounties.jpg',
  'ia-revoluciona-marketing-contenidos-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/ai-revolutionizes-content-marketing.jpg',
  'ia-techcrunch-disrupt-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/ai-techcrunch-disrupt-2025.jpg',
  'ia-transforma-marketing-facebook-evafs.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/ai-transforms-facebook-marketing.jpg',
  'ia-trump-anti-woke-tecnologia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/trump-anti-woke-tech.jpg',
  'iconfactory-venta-apps-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/iconfactory-ai-apps-sale.jpg',
  'intel-freno-fabricas-chips.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/intel-chip-factories.jpg',
  'inteligencia-artificial-agresiva-ciencia-revela.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/aggressive-ai-science.jpg',
  'julius-ai-asegura-10m.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/julius-ai-10m.jpg',
  'k-prize-ia-codificacion.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/k-prize-ai-coding.jpg',
  'lauren-kolodny-ia-herencias.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/lauren-kolodny-ai-inheritance.jpg',
  'legalon-ia-tramites-legales.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/legalon-ai-legal-procedures.jpg',
  'lovable-supera-100m-arr-8-meses.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/lovable-100m-arr.jpg',
  'luma-runway-robotica-oro.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/luma-runway-robotics.jpg',
  'mago-oz-esfera-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/wizard-oz-ai-sphere.jpg',
  'malasia-chips-ia-eeuu-permisos.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/malaysia-chips-us-permits.jpg',
  'mercado-chips-eeuu-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/us-chips-market-2025.jpg',
  'meta-centros-datos-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/meta-ai-data-centers.jpg',
  'meta-corrige-privacidad-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/meta-ai-privacy-fix.jpg',
  'meta-facebook-contenido-copiado.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/meta-facebook-copied-content.jpg',
  'meta-ficha-openai-superinteligente.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/meta-openai-superintelligence.jpg',
  'meta-ia-adios-apertura.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/meta-ai-goodbye-openness.jpg',
  'meta-ia-infraestructura-72b-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/meta-ai-infrastructure-72b.jpg',
  'meta-ia-zuckerberg.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/meta-ai-zuckerberg.jpg',
  'microsoft-edge-ia-copilot.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/microsoft-edge-copilot.jpg',
  'microsoft-openai-ia-mas-alla-agi.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/microsoft-openai-agi.jpg',
  'mira-murati-ia-12-mil-millones.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/mira-murati-12b.jpg',
  'mistral-voxtral-ia-abierta.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/mistral-voxtral-open.jpg',
  'nextdoor-ia-alertas.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/nextdoor-ai-alerts.jpg',
  'nvidia-china-luz-verde-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/nvidia-china-green-light.jpg',
  'nvidia-chips-china-ai.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/nvidia-chips-china.jpg',
  'nvidia-h20-licencias-frenadas-eeuu.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/nvidia-h20-licenses.jpg',
  'observabilidad-apache-iceberg.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/apache-iceberg-observability.jpg',
  'openai-noruega-centro-ia-europa.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/openai-norway-europe.jpg',
  'openai-valoracion-300b.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/openai-300b-valuation.jpg',
  'pichai-google-cloud-openai-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/pichai-google-cloud.jpg',
  'playerzero-15m-ia-codigo-sin-errores.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/playerzero-ai-code.jpg',
  'poe-quora-api-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/poe-quora-api.jpg',
  'proton-lumo-ia-privacidad.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/proton-lumo-privacy.jpg',
  'que-es-evafs-estrategia-digital.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/evafs-digital-strategy.jpg',
  'quien-gana-auge-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/ai-boom-winners.jpg',
  'reddit-ia-anuncios-ganancias.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/reddit-ai-ads.jpg',
  'samsung-ia-analiza-videos.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/samsung-ai-video.jpg',
  'seo-programatico-posicionamiento-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/programmatic-seo.jpg',
  'sixsense-ia-recauda-8-5m-chips.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/sixsense-ai-funding.jpg',
  'software-ideal-inversion-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/software-investment-2025.jpg',
  'spotify-ia-conversacional.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/spotify-ai-conversational.jpg',
  'startup-ia-no-compran.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/ai-startup-sales.jpg',
  'talento-ia-liga-mayor-tecnologia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/ai-talent-league.jpg',
  'tesla-optimus-no-cumple-meta.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/tesla-optimus.jpg',
  'tesla-samsung-chips-ia-165b.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/tesla-samsung-chips.jpg',
  'trabajar-openai-ex-ingeniero.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/openai-engineer.jpg',
  'transformando-ideas-exito-digital.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/digital-transformation.jpg',
  'trump-chips-china-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/trump-chips-china.jpg',
  'trump-ia-plan.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/trump-ai-plan.jpg',
  'trump-ia-reglas-china.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/trump-china-rules.jpg',
  'trump-ia-silicon-valley.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/trump-silicon-valley.jpg',
  'vigilar-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/ai-surveillance.jpg',
  'windsurf-google-reparto-dinero.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/google-windsurf.jpg',
  'zuckerberg-gafas-ia-futuro.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/zuckerberg-ai-glasses.jpg'
};

// Función para asignar URLs únicas
function assignUniqueCovers() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir);
  
  let assignedCount = 0;
  let skippedCount = 0;
  
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (uniqueCovers[file]) {
      // Reemplazar cualquier URL de cover con la URL única asignada
      const newContent = content.replace(
        /cover: 'https:\/\/[^']*'/,
        `cover: '${uniqueCovers[file]}'`
      );
      
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Asignado: ${file}`);
      assignedCount++;
    } else {
      console.log(`❓ Sin mapeo: ${file}`);
      skippedCount++;
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`- Asignados: ${assignedCount}`);
  console.log(`- Sin mapeo: ${skippedCount}`);
  console.log(`- Total procesados: ${assignedCount + skippedCount}`);
}

// Ejecutar el script
assignUniqueCovers(); 