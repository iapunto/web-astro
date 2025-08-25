import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de artículos con sus URLs originales de imágenes
const originalCovers = {
  'alaan-fintech-ia-mena-48m.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_fintech_money.png',
  '7-de-10-jovenes-eeuu-ia-companeros.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/teens_ai_companions.png',
  'apple-ia-chatgpt.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/apple_ai_chatgpt.png',
  'ia-todoterreno-openai.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/openai_ai_everywhere.png',
  'vogue-ia-adios-modelos.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/vogue_ai_models.png',
  'vast-data-ia-30b-google-nvidia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/vast_data_ai.png',
  'windsurf-google-reparto-dinero.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_windsurf.png',
  'openai-valoracion-300b.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/openai_300b.png',
  'nvidia-h20-licencias-frenadas-eeuu.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/nvidia_h20.png',
  'google-stan-gaming-social.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_stan.png',
  'google-gemini-deep-think-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/gemini_deep_think.png',
  'frl-ia-juegos-trabajo.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/frl_ai_games.png',
  'ethan-thornton-ia-defensa-disrupt-2025.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ethan_thornton_ai.png',
  'boom-ia-techo-meta-anthropic.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_boom_meta.png',
  'zuckerberg-gafas-ia-futuro.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/zuckerberg_ai_glasses.png',
  'vigilar-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_surveillance.png',
  'trump-ia-silicon-valley.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/trump_silicon_valley.png',
  'trump-ia-reglas-china.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/trump_china_rules.png',
  'trump-ia-plan.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/trump_ai_plan.png',
  'trump-chips-china-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/trump_chips_china.png',
  'transformando-ideas-exito-digital.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/digital_transformation.png',
  'trabajar-openai-ex-ingeniero.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/openai_engineer.png',
  'tesla-samsung-chips-ia-165b.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/tesla_samsung_chips.png',
  'tesla-optimus-no-cumple-meta.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/tesla_optimus.png',
  'techcrunch-all-stage-boston-startup.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/techcrunch_boston.png',
  'talento-ia-liga-mayor-tecnologia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_talent_league.png',
  'startup-ia-no-compran.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_startup_sales.png',
  'software-ideal-inversion-2025.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/software_investment_2025.png',
  'spotify-ia-conversacional.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/spotify_ai_conversational.png',
  'seo-programatico-posicionamiento-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/programmatic_seo.png',
  'sixsense-ia-recauda-8-5m-chips.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/sixsense_ai_funding.png',
  'samsung-ia-analiza-videos.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/samsung_ai_video.png',
  'reddit-ia-anuncios-ganancias.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/reddit_ai_ads.png',
  'quien-gana-auge-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_boom_winners.png',
  'que-es-evafs-estrategia-digital.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/evafs_digital_strategy.png',
  'proton-lumo-ia-privacidad.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/proton_lumo_privacy.png',
  'playerzero-15m-ia-codigo-sin-errores.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/playerzero_ai_code.png',
  'poe-quora-api-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/poe_quora_api.png',
  'pichai-google-cloud-openai-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/pichai_google_cloud.png',
  'openai-noruega-centro-ia-europa.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/openai_norway_europe.png',
  'observabilidad-apache-iceberg.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/apache_iceberg_observability.png',
  'nvidia-chips-china-ai.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/nvidia_chips_china.png',
  'nvidia-china-luz-verde-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/nvidia_china_green_light.png',
  'nextdoor-ia-alertas.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/nextdoor_ai_alerts.png',
  'mistral-voxtral-ia-abierta.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/mistral_voxtral_open.png',
  'mira-murati-ia-12-mil-millones.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/mira_murati_12b.png',
  'microsoft-edge-ia-copilot.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/microsoft_edge_copilot.png',
  'microsoft-openai-ia-mas-alla-agi.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/microsoft_openai_agi.png',
  'meta-ia-zuckerberg.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/meta_ai_zuckerberg.png',
  'meta-ia-infraestructura-72b-2025.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/meta_ai_infrastructure_72b.png',
  'meta-ficha-openai-superinteligente.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/meta_openai_superintelligence.png',
  'meta-ia-adios-apertura.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/meta_ai_goodbye_openness.png',
  'meta-facebook-contenido-copiado.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/meta_facebook_copied_content.png',
  'meta-centros-datos-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/meta_ai_data_centers.png',
  'meta-corrige-privacidad-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/meta_ai_privacy_fix.png',
  'mercado-chips-eeuu-2025.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/us_chips_market_2025.png',
  'malasia-chips-ia-eeuu-permisos.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/malaysia_chips_us_permits.png',
  'mago-oz-esfera-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/wizard_of_oz_ai_sphere.png',
  'luma-runway-robotica-oro.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/luma_runway_robotics.png',
  'lovable-supera-100m-arr-8-meses.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/lovable_100m_arr.png',
  'lauren-kolodny-ia-herencias.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/lauren_kolodny_ai_inheritance.png',
  'legalon-ia-tramites-legales.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/legalon_ai_legal_procedures.png',
  'k-prize-ia-codificacion.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/k_prize_ai_coding.png',
  'inteligencia-artificial-agresiva-ciencia-revela.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/aggressive_ai_science.png',
  'julius-ai-asegura-10m.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/julius_ai_10m.png',
  'intel-freno-fabricas-chips.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/intel_chip_factories_brake.png',
  'iconfactory-venta-apps-ia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/iconfactory_ai_apps_sale.png',
  'ia-trump-anti-woke-tecnologia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/trump_anti_woke_tech.png',
  'ia-transforma-marketing-facebook-evafs.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_transforms_facebook_marketing.png',
  'ia-techcrunch-disrupt-2025.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_techcrunch_disrupt_2025.png',
  'ia-revoluciona-marketing-contenidos-2025.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_revolutionizes_content_marketing.png',
  'ia-para-pymes-crecimiento.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_for_sme_growth.png',
  'ia-reportes-falsos-bug-bounties.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_false_reports_bug_bounties.png',
  'ia-mejora-seo-local-atrae-clientes.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_improves_local_seo.png',
  'ia-mates-google-openai.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_mates_google_openai.png',
  'ia-experiencia-cliente-ecommerce-2025.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_customer_experience_ecommerce.png',
  'ia-marketing-berkeley-28m.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_marketing_berkeley_28m.png',
  'ia-empresas-tendencias-desafios-soluciones.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_companies_trends_challenges.png',
  'ia-diseno-proteinas-facil.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_protein_design_easy.png',
  'ia-boom-visitas-web.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_boom_web_visits.png',
  'ia-ayudar-empresas-competir-seo-local.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_help_companies_compete_local_seo.png',
  'herramientas-ia-optimizacion-seo-local.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/ai_tools_local_seo_optimization.png',
  'herramientas-investigacion-mercado-2025.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/market_research_tools_2025.png',
  'harmonic-ai-robinhood-chatbot.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/harmonic_ai_robinhood_chatbot.png',
  'groq-6b-chips-ia-vs-nvidia.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/groq_6b_chips_vs_nvidia.png',
  'grok-ia-gotica-anime.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/grok_ai_gothic_anime.png',
  'grok-4-xai-control.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/grok_4_xai_control.png',
  'grok-ia-amor-caos.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/grok_ai_love_chaos.png',
  'grok-4-ia-descargas-dinero.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/grok_4_ai_downloads_money.png',
  'google-opal-crear-web-apps.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_opal_web_apps.png',
  'google-notebooklm-videos.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_notebooklm_videos.png',
  'google-ia-responsable-ue.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_ai_responsible_eu.png',
  'google-ia-ordenar-busquedas.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_ai_sort_searches.png',
  'google-ia-canvas-actualiza.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_ai_canvas_update.png',
  'google-fotos-ia-videos-estilos.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_photos_ai_videos_styles.png',
  'google-discover-ia-visitas.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_discover_ai_visits.png',
  'google-ai-prueba-virtual.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_ai_virtual_test.png',
  'google-adivina-edad-ia-eeuu.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/google_ai_guess_age_us.png',
  'github-copilot-20-millones-programadores.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/github_copilot_20m_developers.png',
  'furiosaai-chips-ia-meta.mdx': 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739925181/furiosaai_chips_meta.png'
};

// Función para restaurar las URLs de las imágenes
function restoreCovers() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir);
  
  let restoredCount = 0;
  let skippedCount = 0;
  
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar si el archivo tiene una URL de TechCrunch que necesita ser restaurada
    if (content.includes('techcrunch.com/wp-content/uploads') && originalCovers[file]) {
      const newContent = content.replace(
        /cover: 'https:\/\/techcrunch\.com\/wp-content\/uploads\/[^']*'/,
        `cover: '${originalCovers[file]}'`
      );
      
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Restaurado: ${file}`);
      restoredCount++;
    } else if (originalCovers[file]) {
      console.log(`⏭️  Saltado (ya tiene URL correcta): ${file}`);
      skippedCount++;
    } else {
      console.log(`❓ Sin mapeo: ${file}`);
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`- Restaurados: ${restoredCount}`);
  console.log(`- Saltados: ${skippedCount}`);
  console.log(`- Total procesados: ${restoredCount + skippedCount}`);
}

// Ejecutar el script
restoreCovers(); 