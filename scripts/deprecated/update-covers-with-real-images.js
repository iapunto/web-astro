import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de artículos con sus URLs reales de imágenes extraídas
const realImageUrls = {
  'trump-ia-silicon-valley.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2224983065-e1753313001258.jpg',
  'altman-chatgpt-terapia-sin-confidencialidad.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/altman-on-theo-von.jpg?w=1024',
  'amazon-alexa-anuncios.mdx': 'https://techcrunch.com/wp-content/uploads/2025/04/GettyImages-2201505679.jpg?w=1024',
  'ambiq-debut-bursatil.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2227082921.jpg?w=1024',
  'amor-ia-fin-o-comienzo.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/Open-to-Debate-Photo-By-Ryan-Rose-0479.jpg?w=1024',
  'anthropic-ia-empresarial-supera-openai.mdx': 'https://techcrunch.com/wp-content/uploads/2024/06/YouTube-Thumb-Text-2-3.png?w=1024',
  'anthropic-valor-170b.mdx': 'https://techcrunch.com/wp-content/uploads/2025/02/GettyImages-2153561878.jpg?w=1024',
  'apple-ia-inversion.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/tim-cook-2025-GettyImages-2223580830.jpg?w=1024',
  'boom-ia-techo-meta-anthropic.mdx': 'https://techcrunch.com/wp-content/uploads/2024/08/GettyImages-2154160973-e1723115200227.jpg',
  'chatgpt-2-5-mil-millones-preguntas-diarias.mdx': 'https://techcrunch.com/wp-content/uploads/2024/11/GettyImages-1733837014-e.jpg?w=1024',
  'chatgpt-chatbot-ia-guia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/01/GettyImages-2191707579.jpg?w=1024',
  'chatgpt-modo-estudio-aprende-pensar.mdx': 'https://techcrunch.com/wp-content/uploads/2024/05/OpenAI-and-ChatGPT.jpeg?w=1024',
  'chats-publicos-chatgpt-google.mdx': 'https://techcrunch.com/wp-content/uploads/2025/04/Search-in-ChatGPT.jpg?w=1024',
  'chrome-ia-compras.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/chrome-with-ai-GettyImages-2184968624.jpg?w=1024',
  'claude-code-anthropic-exigentes.mdx': 'https://techcrunch.com/wp-content/uploads/2024/06/YouTube-Thumb-Text-2-3.png?w=1024',
  'coches-autonomos-tekedra-mawakana-waymo.mdx': 'https://techcrunch.com/wp-content/uploads/2024/03/53560747222_fa1ff0b7c7_k.jpg?w=1024',
  'cofundador-tech-dispo-acero.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-1474110149.jpeg?w=1024',
  'cognition-windsurf-equipo-google.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/Screenshot-2025-07-14-at-2.44.29PM.png?w=1024',
  'doge-ia-corta-regulaciones.mdx': 'https://techcrunch.com/wp-content/uploads/2025/02/GettyImages-2200924488.jpg?w=1024',
  'fotos-youtube-shorts-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2020/06/GettyImages-1149449083.jpg?w=1024',
  'github-copilot-20-millones-programadores.mdx': 'https://techcrunch.com/wp-content/uploads/2024/02/GettyImages-1785159335.jpg?w=1024',
  'google-adivina-edad-ia-eeuu.mdx': 'https://techcrunch.com/wp-content/uploads/2025/04/GettyImages-2169510461.jpg?w=1024',
  'google-ai-prueba-virtual.mdx': 'https://techcrunch.com/wp-content/uploads/2024/10/GettyImages-1337403704.jpg?w=1024',
  'google-discover-ia-visitas.mdx': 'https://techcrunch.com/wp-content/uploads/2019/10/google-search-app-ios.jpg?w=1024',
  'google-fotos-ia-videos-estilos.mdx': 'https://techcrunch.com/wp-content/uploads/2019/12/GettyImages-887454024.jpg?w=1024',
  'google-ia-canvas-actualiza.mdx': 'https://techcrunch.com/wp-content/uploads/2025/06/GettyImages-2206888090.jpg?w=1024',
  'google-ia-ordenar-busquedas.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/WebGuide_Hero.width-2200.format-webp.webp?w=1024',
  'google-ia-responsable-ue.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2173567293.jpg?w=1024',
  'google-notebooklm-videos.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/notebooklm-video-overviews.png?w=1024',
  'google-opal-crear-web-apps.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/Google-Opal.jpg?w=1024',
  'grok-4-xai-control.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2218892225.jpg?w=1024',
  'grok-ia-amor-caos.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/grok.jpg?w=1024',
  'grok-ia-gotica-anime.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/grok.jpg?w=1024',
  'groq-6b-chips-ia-vs-nvidia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/Groq-chip.jpg?w=1024',
  'harmonic-ai-robinhood-chatbot.mdx': 'https://techcrunch.com/wp-content/uploads/2019/11/GettyImages-1047349788-1.jpg?w=1024',
  'ia-diseno-proteinas-facil.mdx': 'https://techcrunch.com/wp-content/uploads/2025/02/Dr-Simon-Kohl-CEO-and-Founder-of-Latent-Labs-e1739199819495.jpg?w=1024',
  'ia-marketing-berkeley-28m.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/Conversion-founders-Neil-Tewari-James-Jiao.jpg?w=1024',
  'ia-mates-google-openai.mdx': 'https://techcrunch.com/wp-content/uploads/2016/03/shutterstock_317431127.jpg?w=1000',
  'ia-reportes-falsos-bug-bounties.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/ai-slop-bug-bounty-reports-1646637201.jpg?w=1024',
  'ia-techcrunch-disrupt-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2023/09/May-Habib-Disrupt-2023.jpg?w=1024',
  'ia-trump-anti-woke-tecnologia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2225853634.jpg?w=1024',
  'iconfactory-venta-apps-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/Tapestry-Quicklinks-New.jpg?w=1024',
  'intel-freno-fabricas-chips.mdx': 'https://techcrunch.com/wp-content/uploads/2025/03/GettyImages-2205047441.jpg?w=1024',
  'julius-ai-asegura-10m.mdx': 'https://techcrunch.com/wp-content/uploads/2025/05/Rahul-Headshot-rotated.jpeg?w=1024',
  'k-prize-ia-codificacion.mdx': 'https://techcrunch.com/wp-content/uploads/2024/06/GettyImages-1388336038.jpg?w=1024',
  'lauren-kolodny-ia-herencias.mdx': 'https://techcrunch.com/wp-content/uploads/2017/12/lauren-kolodny.jpg?w=1024',
  'legalon-ia-tramites-legales.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/Daniel-Lewis-Nozomu-Tsunoda.jpg?w=1024',
  'luma-runway-robotica-oro.mdx': 'https://techcrunch.com/wp-content/uploads/2023/06/GettyImages-1474076387.jpg?w=1024',
  'mago-oz-esfera-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/wizard-of-oz.jpg?w=1024',
  'malasia-chips-ia-eeuu-permisos.mdx': 'https://techcrunch.com/wp-content/uploads/2024/05/GettyImages-2026266993.jpg?w=1024',
  'mercado-chips-eeuu-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2025/05/GettyImages-1366897838.jpg?w=1024',
  'meta-corrige-privacidad-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2022/10/meta-distorted-glitched.jpg?w=1024',
  'meta-facebook-contenido-copiado.mdx': 'https://techcrunch.com/wp-content/uploads/2022/05/GettyImages-1201955892.jpeg?w=1024',
  'meta-ficha-openai-superinteligente.mdx': 'https://techcrunch.com/wp-content/uploads/2025/01/GettyImages-2173579488.jpg?w=1024',
  'meta-ia-adios-apertura.mdx': 'https://techcrunch.com/wp-content/uploads/2025/02/GettyImages-2195497483.jpg?w=1024',
  'meta-ia-infraestructura-72b-2025.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2194278734.jpg?w=1024',
  'meta-ia-zuckerberg.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2170596427.jpg?w=1024',
  'microsoft-edge-ia-copilot.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/imgi_9_Blog-Hero1920b-1600x900-1.png?w=1024',
  'microsoft-openai-ia-mas-alla-agi.mdx': 'https://techcrunch.com/wp-content/uploads/2023/11/GettyImages-1778706501.jpg?w=1024',
  'mira-murati-ia-12-mil-millones.mdx': 'https://techcrunch.com/wp-content/uploads/2025/04/GettyImages-1730510668.jpg?w=1024',
  'mistral-voxtral-ia-abierta.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2219786590.jpg?w=1024',
  'nextdoor-ia-alertas.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/nextdoor-press-devices-logo-us-2.png?w=1024',
  'nvidia-china-luz-verde-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2219673294.jpg?w=1024',
  'nvidia-chips-china-ai.mdx': 'https://techcrunch.com/wp-content/uploads/2025/06/GettyImages-1246479507.jpg?w=1024',
  'observabilidad-apache-iceberg.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/ObserveTeam.jpg?w=1024',
  'openai-noruega-centro-ia-europa.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2173788627.jpg?w=1024',
  'pichai-google-cloud-openai-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/02/GettyImages-2173545265.jpg?w=1024',
  'playerzero-15m-ia-codigo-sin-errores.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/PlayerZero-Founder-and-CEO-Animesh-Koratana.jpg?w=1024',
  'poe-quora-api-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/03/Poe-platform.png?w=1024',
  'proton-lumo-ia-privacidad.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/Lumo-by-proton.jpeg?w=1024',
  'quien-gana-auge-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2225853634.jpg',
  'reddit-ia-anuncios-ganancias.mdx': 'https://techcrunch.com/wp-content/uploads/2024/05/reddit-ipo-v2.webp?w=1024',
  'samsung-ia-analiza-videos.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/Memories.ai-Founders-feat.jpg?w=1024',
  'sixsense-ia-recauda-8-5m-chips.mdx': 'https://techcrunch.com/wp-content/uploads/2015/06/shutterstock_151456658.jpg?w=1000',
  'spotify-ia-conversacional.mdx': 'https://techcrunch.com/wp-content/uploads/2023/10/spotify-app-GettyImages-1689920063-e1702479483636.jpeg?w=1024',
  'startup-ia-no-compran.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/cvector.jpg?w=1024',
  'talento-ia-liga-mayor-tecnologia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/01/GettyImages-2173579488.jpg',
  'tesla-optimus-no-cumple-meta.mdx': 'https://techcrunch.com/wp-content/uploads/2024/12/musk-promises-2024.jpg?w=1024',
  'tesla-samsung-chips-ia-165b.mdx': 'https://techcrunch.com/wp-content/uploads/2024/07/GettyImages-2158243805.jpg?w=1024',
  'trabajar-openai-ex-ingeniero.mdx': 'https://techcrunch.com/wp-content/uploads/2025/02/GettyImages-2197181367.jpg?w=1024',
  'trump-chips-china-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2025/06/GettyImages-1246479507.jpg?w=1024',
  'trump-ia-plan.mdx': 'https://techcrunch.com/wp-content/uploads/2021/07/GettyImages-1327493808.jpg?w=1024',
  'trump-ia-reglas-china.mdx': 'https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2225249178.jpg?w=1024',
  'vigilar-ia.mdx': 'https://techcrunch.com/wp-content/uploads/2023/10/GettyImages-1194975140.jpg?w=1024',
  'zuckerberg-gafas-ia-futuro.mdx': 'https://techcrunch.com/wp-content/uploads/2024/09/zuck-meta.png?w=1024'
};

// Función para actualizar los covers de los artículos
function updateArticleCovers() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir);
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    
    const imageUrl = realImageUrls[file];
    if (!imageUrl) {
      console.log(`⏭️  Sin imagen asignada: ${file}`);
      skippedCount++;
      continue;
    }
    
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
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`- Actualizados: ${updatedCount}`);
  console.log(`- Saltados: ${skippedCount}`);
  console.log(`- Total procesados: ${updatedCount + skippedCount}`);
}

// Ejecutar el script
updateArticleCovers(); 