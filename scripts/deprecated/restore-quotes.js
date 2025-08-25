import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de artículos con sus quotes únicos
const articleQuotes = {
  'trump-ia-silicon-valley.mdx':
    'El crecimiento de una PYME hoy depende de la inteligencia con la que se aplican datos, IA y estrategia. — Sergio Rondón',
  'altman-chatgpt-terapia-sin-confidencialidad.mdx':
    'La confidencialidad en la IA es fundamental para el desarrollo de terapias efectivas. — Marilyn Cardozo',
  'amazon-alexa-anuncios.mdx':
    'La integración de anuncios en asistentes de IA redefine la experiencia del usuario. — Carlos Monnery',
  'ambiq-debut-bursatil.mdx':
    'El éxito en el mercado bursátil refleja la madurez de la tecnología de chips. — Pedro Zambrano',
  'amor-ia-fin-o-comienzo.mdx':
    'La IA no reemplaza el amor humano, sino que lo complementa de formas inesperadas. — Marilyn Cardozo',
  'anthropic-ia-empresarial-supera-openai.mdx':
    'La competencia en IA empresarial impulsa la innovación y mejora los servicios. — Sergio Rondón',
  'anthropic-valor-170b.mdx':
    'La valoración de las empresas de IA refleja el potencial transformador de la tecnología. — Carlos Monnery',
  'apple-ia-inversion.mdx':
    'Apple demuestra que la inversión en IA es estratégica para el futuro tecnológico. — Pedro Zambrano',
  'boom-ia-techo-meta-anthropic.mdx':
    'El auge de la IA alcanza nuevos límites que desafían la imaginación. — Marilyn Cardozo',
  'chatgpt-2-5-mil-millones-preguntas-diarias.mdx':
    'La adopción masiva de ChatGPT muestra el hambre de conocimiento de la humanidad. — Sergio Rondón',
  'chatgpt-chatbot-ia-guia.mdx':
    'Los chatbots de IA están transformando la forma en que interactuamos con la tecnología. — Carlos Monnery',
  'chatgpt-modo-estudio-aprende-pensar.mdx':
    'El modo estudio de ChatGPT representa un nuevo paradigma en la educación. — Pedro Zambrano',
  'chats-publicos-chatgpt-google.mdx':
    'La privacidad en la era de la IA es un desafío que debemos abordar colectivamente. — Marilyn Cardozo',
  'chrome-ia-compras.mdx':
    'La IA en el navegador está revolucionando la experiencia de compra online. — Sergio Rondón',
  'claude-code-anthropic-exigentes.mdx':
    'Los límites en el uso de IA son necesarios para mantener la calidad del servicio. — Carlos Monnery',
  'coches-autonomos-tekedra-mawakana-waymo.mdx':
    'Los vehículos autónomos representan el futuro de la movilidad urbana. — Pedro Zambrano',
  'cofundador-tech-dispo-acero.mdx':
    'La transición de tecnología a industrias tradicionales muestra la versatilidad del talento tech. — Marilyn Cardozo',
  'cognition-windsurf-equipo-google.mdx':
    'Las adquisiciones estratégicas aceleran el desarrollo de tecnologías emergentes. — Sergio Rondón',
  'doge-ia-corta-regulaciones.mdx':
    'La IA puede optimizar procesos regulatorios complejos de manera eficiente. — Carlos Monnery',
  'fotos-youtube-shorts-ia.mdx':
    'La IA en contenido de video está democratizando la creatividad digital. — Pedro Zambrano',
  'github-copilot-20-millones-programadores.mdx':
    'GitHub Copilot está transformando la forma en que escribimos código. — Marilyn Cardozo',
  'google-adivina-edad-ia-eeuu.mdx':
    'La estimación de edad por IA abre nuevas posibilidades en servicios digitales. — Sergio Rondón',
  'google-ai-prueba-virtual.mdx':
    'La realidad virtual y la IA están creando experiencias de compra revolucionarias. — Carlos Monnery',
  'google-discover-ia-visitas.mdx':
    'Los algoritmos de IA están redefiniendo cómo descubrimos contenido online. — Pedro Zambrano',
  'google-fotos-ia-videos-estilos.mdx':
    'La IA en fotografía está democratizando la creatividad visual. — Marilyn Cardozo',
  'google-gemini-deep-think-ia.mdx':
    'Gemini representa un salto cualitativo en el razonamiento de IA. — Sergio Rondón',
  'google-ia-canvas-actualiza.mdx':
    'Las herramientas de IA están transformando el proceso creativo. — Carlos Monnery',
  'google-ia-ordenar-busquedas.mdx':
    'La organización inteligente de resultados mejora la experiencia de búsqueda. — Pedro Zambrano',
  'google-ia-responsable-ue.mdx':
    'La responsabilidad en IA es fundamental para su adopción masiva. — Marilyn Cardozo',
  'google-notebooklm-videos.mdx':
    'Los notebooks de IA están revolucionando la investigación y el análisis. — Sergio Rondón',
  'google-opal-crear-web-apps.mdx':
    'Las herramientas de desarrollo con IA están democratizando la creación de software. — Carlos Monnery',
  'google-stan-gaming-social.mdx':
    'La IA en gaming está creando experiencias más inmersivas y personalizadas. — Pedro Zambrano',
  'grok-4-ia-descargas-dinero.mdx':
    'Grok 4 demuestra el potencial comercial de los modelos de IA avanzados. — Marilyn Cardozo',
  'grok-4-xai-control.mdx':
    'El control de la IA es esencial para su desarrollo responsable. — Sergio Rondón',
  'grok-ia-amor-caos.mdx':
    'Los compañeros de IA reflejan la complejidad de las relaciones humanas. — Carlos Monnery',
  'grok-ia-gotica-anime.mdx':
    'La personalización de IA abre debates sobre la ética y la creatividad. — Pedro Zambrano',
  'groq-6b-chips-ia-vs-nvidia.mdx':
    'La competencia en chips de IA está acelerando la innovación tecnológica. — Marilyn Cardozo',
  'harmonic-ai-robinhood-chatbot.mdx':
    'Los chatbots financieros están democratizando el acceso a servicios bancarios. — Sergio Rondón',
  'ia-diseno-proteinas-facil.mdx':
    'La IA en biología está acelerando descubrimientos científicos fundamentales. — Carlos Monnery',
  'ia-marketing-berkeley-28m.mdx':
    'El marketing con IA está transformando cómo las empresas conectan con sus clientes. — Pedro Zambrano',
  'ia-mates-google-openai.mdx':
    'La competencia entre gigantes de IA beneficia a los usuarios finales. — Marilyn Cardozo',
  'ia-reportes-falsos-bug-bounties.mdx':
    'La IA está cambiando el panorama de la seguridad informática. — Sergio Rondón',
  'ia-techcrunch-disrupt-2025.mdx':
    'Los eventos de IA están reuniendo a las mentes más brillantes del sector. — Carlos Monnery',
  'ia-trump-anti-woke-tecnologia.mdx':
    'La política y la IA están entrelazadas en el futuro tecnológico. — Pedro Zambrano',
  'iconfactory-venta-apps-ia.mdx':
    'La IA está transformando el mercado de aplicaciones móviles. — Marilyn Cardozo',
  'intel-freno-fabricas-chips.mdx':
    'La fabricación de chips enfrenta desafíos en un mercado en constante evolución. — Sergio Rondón',
  'julius-ai-asegura-10m.mdx':
    'El análisis de datos con IA está revolucionando la toma de decisiones empresariales. — Carlos Monnery',
  'k-prize-ia-codificacion.mdx':
    'Los desafíos de programación con IA están elevando el nivel de la industria. — Pedro Zambrano',
  'lauren-kolodny-ia-herencias.mdx':
    'La IA está modernizando procesos legales tradicionales. — Marilyn Cardozo',
  'legalon-ia-tramites-legales.mdx':
    'La automatización legal con IA está democratizando el acceso a la justicia. — Sergio Rondón',
  'luma-runway-robotica-oro.mdx':
    'La robótica y la IA están creando nuevas oportunidades de negocio. — Carlos Monnery',
  'mago-oz-esfera-ia.mdx':
    'La IA está transformando el entretenimiento y las experiencias inmersivas. — Pedro Zambrano',
  'malasia-chips-ia-eeuu-permisos.mdx':
    'La geopolítica de los chips de IA está redefiniendo las alianzas tecnológicas. — Marilyn Cardozo',
  'mercado-chips-eeuu-2025.mdx':
    'El mercado de chips de IA está experimentando una transformación sin precedentes. — Sergio Rondón',
  'meta-corrige-privacidad-ia.mdx':
    'La privacidad en la era de la IA requiere soluciones innovadoras. — Carlos Monnery',
  'meta-facebook-contenido-copiado.mdx':
    'La originalidad del contenido es crucial en la era de la IA. — Pedro Zambrano',
  'meta-ficha-openai-superinteligente.mdx':
    'La superinteligencia representa el siguiente horizonte de la IA. — Marilyn Cardozo',
  'meta-ia-adios-apertura.mdx':
    'El cambio en las políticas de apertura de Meta refleja la evolución de la IA. — Sergio Rondón',
  'meta-ia-infraestructura-72b-2025.mdx':
    'La inversión en infraestructura de IA determina el liderazgo tecnológico. — Carlos Monnery',
  'meta-ia-zuckerberg.mdx':
    'La visión de Zuckerberg sobre IA está moldeando el futuro de Meta. — Pedro Zambrano',
  'microsoft-edge-ia-copilot.mdx':
    'Copilot está transformando la experiencia de navegación web. — Marilyn Cardozo',
  'microsoft-openai-ia-mas-alla-agi.mdx':
    'La colaboración Microsoft-OpenAI está definiendo el futuro de la IA. — Sergio Rondón',
  'mira-murati-ia-12-mil-millones.mdx':
    'Los emprendedores de IA están creando valor sin precedentes. — Carlos Monnery',
  'mistral-voxtral-ia-abierta.mdx':
    'Los modelos de IA de código abierto están democratizando la tecnología. — Pedro Zambrano',
  'nextdoor-ia-alertas.mdx':
    'La IA está mejorando la seguridad y conectividad de las comunidades locales. — Marilyn Cardozo',
  'nvidia-china-luz-verde-ia.mdx':
    'Las relaciones comerciales en chips de IA son complejas y dinámicas. — Sergio Rondón',
  'nvidia-chips-china-ai.mdx':
    'La geopolítica de los chips de IA está redefiniendo el comercio global. — Carlos Monnery',
  'observabilidad-apache-iceberg.mdx':
    'La observabilidad de datos es fundamental en la era de la IA. — Pedro Zambrano',
  'openai-noruega-centro-ia-europa.mdx':
    'La expansión de OpenAI en Europa fortalece el ecosistema de IA. — Marilyn Cardozo',
  'pichai-google-cloud-openai-ia.mdx':
    'La colaboración entre gigantes tecnológicos acelera la innovación en IA. — Sergio Rondón',
  'playerzero-15m-ia-codigo-sin-errores.mdx':
    'La calidad del código es crucial en el desarrollo con IA. — Carlos Monnery',
  'poe-quora-api-ia.mdx':
    'Las APIs de IA están democratizando el acceso a modelos avanzados. — Pedro Zambrano',
  'proton-lumo-ia-privacidad.mdx':
    'La privacidad en la IA es un derecho fundamental que debemos proteger. — Marilyn Cardozo',
  'quien-gana-auge-ia.mdx':
    'El auge de la IA está creando ganadores y perdedores en la economía digital. — Sergio Rondón',
  'reddit-ia-anuncios-ganancias.mdx':
    'La monetización con IA está transformando las plataformas sociales. — Carlos Monnery',
  'samsung-ia-analiza-videos.mdx':
    'La IA en análisis de video está revolucionando múltiples industrias. — Pedro Zambrano',
  'sixsense-ia-recauda-8-5m-chips.mdx':
    'Las startups de IA están atrayendo inversiones significativas. — Marilyn Cardozo',
  'spotify-ia-conversacional.mdx':
    'La IA conversacional está transformando la experiencia musical. — Sergio Rondón',
  'startup-ia-no-compran.mdx':
    'La independencia en startups de IA puede ser una ventaja estratégica. — Carlos Monnery',
  'talento-ia-liga-mayor-tecnologia.mdx':
    'La guerra por el talento de IA está redefiniendo el mercado laboral. — Pedro Zambrano',
  'tesla-optimus-no-cumple-meta.mdx':
    'Los robots humanoides representan el futuro de la automatización. — Marilyn Cardozo',
  'tesla-samsung-chips-ia-165b.mdx':
    'Las alianzas estratégicas en chips están acelerando la innovación. — Sergio Rondón',
  'trabajar-openai-ex-ingeniero.mdx':
    'La cultura de OpenAI está moldeando el futuro de la IA. — Carlos Monnery',
  'trump-chips-china-ia.mdx':
    'La política de chips de IA está redefiniendo las relaciones internacionales. — Pedro Zambrano',
  'trump-ia-plan.mdx':
    'Los planes de IA de Trump reflejan la importancia estratégica de la tecnología. — Marilyn Cardozo',
  'trump-ia-reglas-china.mdx':
    'Las reglas de IA entre potencias tecnológicas determinan el futuro global. — Sergio Rondón',
  'vigilar-ia.mdx':
    'La supervisión de la IA es esencial para su desarrollo responsable. — Carlos Monnery',
  'zuckerberg-gafas-ia-futuro.mdx':
    'Las gafas de IA representan el futuro de la computación personal. — Pedro Zambrano',
};

function restoreQuotes() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  const files = fs.readdirSync(blogDir);

  let restoredCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;

    const quote = articleQuotes[file];
    if (!quote) {
      console.log(`⏭️  Sin quote asignado: ${file}`);
      skippedCount++;
      continue;
    }

    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Buscar el patrón del frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(frontmatterRegex);

    if (match) {
      let frontmatter = match[1];

      // Verificar si ya tiene quote
      if (frontmatter.includes('quote:')) {
        console.log(`⏭️  Ya tiene quote: ${file}`);
        skippedCount++;
        continue;
      }

      // Agregar el quote antes del cierre del frontmatter
      const newFrontmatter = frontmatter + `\nquote: "${quote}"`;
      const newContent = content.replace(
        frontmatterRegex,
        `---\n${newFrontmatter}\n---\n`
      );

      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Quote restaurado: ${file}`);
      restoredCount++;
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`- Quotes restaurados: ${restoredCount}`);
  console.log(`- Saltados: ${skippedCount}`);
  console.log(`- Total procesados: ${restoredCount + skippedCount}`);
}

restoreQuotes();
