import {
  ArticleTracking,
  ArticleStatus,
  Gem1Result,
  Gem2Result,
  Gem3Result,
  Gem4Result,
  Gem5Result,
  ArticleTrackingService,
} from '../database/articleTrackingSchema.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v2 as cloudinary } from 'cloudinary';
import { getAuthorById, getDefaultAuthor } from '../constants/authors.js';

export class GemArticleService {
  private genAI: GoogleGenerativeAI;
  private trackingService: ArticleTrackingService;
  private gem1Model: any;
  private gem2Model: any;
  private gem3Model: any;
  private gem4Model: any;
  private authorId: string;

  constructor(
    apiKey: string,
    trackingService: ArticleTrackingService,
    authorId?: string
  ) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.trackingService = trackingService;
    this.authorId = authorId || 'marilyn-cardozo';
    this.initializeModels();
  }

  private initializeModels() {
    // Inicializar los modelos de Gemini para cada GEM
    this.gem1Model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    this.gem2Model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    this.gem3Model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    this.gem4Model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  }

  async createArticle(topic: string): Promise<ArticleTracking> {
    try {
      // Crear tracking inicial
      const tracking = await this.trackingService.createTracking(topic);

      // Ejecutar GEM 1: Planificación del artículo
      console.log('📋 GEM 1: Planificando estructura del artículo...');
      const gem1Result = await this.executeGem1(topic);
      await this.trackingService.updateGem1Result(tracking.id, gem1Result);

      // Ejecutar GEM 2: Investigación por secciones (bucle)
      console.log('🔍 GEM 2: Investigando secciones...');
      const gem2Results = await this.executeGem2(gem1Result);
      for (const result of gem2Results) {
        await this.trackingService.updateGem2Result(tracking.id, result);
      }

      // Ejecutar GEM 3: Creación del artículo completo
      console.log('✍️  GEM 3: Redactando artículo final...');
      const gem3Result = await this.executeGem3(gem1Result, gem2Results);
      await this.trackingService.updateGem3Result(tracking.id, gem3Result);

      // Ejecutar GEM 4: Generación de imagen
      console.log('🖼️  GEM 4: Generando imagen...');
      const gem4Result = await this.executeGem4(
        gem3Result.fullArticle,
        gem1Result
      );
      await this.trackingService.updateGem4Result(tracking.id, gem4Result);

      // Ejecutar GEM 5: Generación de frontmatter y MDX con imagen
      console.log('🏷️  GEM 5: Generando frontmatter...');
      const gem5Result = await this.executeGem5(
        gem3Result.fullArticle,
        gem1Result,
        gem4Result
      );
      await this.trackingService.updateGem5Result(tracking.id, gem5Result);

      return tracking;
    } catch (error) {
      console.error('Error en la creación del artículo:', error);
      throw error;
    }
  }

  private async executeGem1(topic: string): Promise<Gem1Result> {
    const prompt = `
Actúa como estratega de contenidos y experto en marketing digital e inteligencia artificial para empresas.
Recibirás un tema general y debes generar:

1. Un título optimizado para SEO (máx. 60 caracteres, en español, claro y atractivo).
2. Una meta descripción (máx. 160 caracteres).
3. Una palabra clave principal (frase clave SEO de 2-5 palabras).
4. Lista de secciones (mínimo 4, máximo 7), con un breve objetivo para cada una.
5. Extensión total estimada del artículo (entre 1,800 y 2,500 palabras).
6. Extensión estimada por sección (MÍNIMO 250 palabras por sección, preferiblemente 300-400 palabras).

Público objetivo: empresarios, directores de marketing y profesionales que buscan soluciones digitales innovadoras.
Estilo: claro, profesional, persuasivo, alineado al manual de marca de IA Punto.

IMPORTANTE: Cada sección DEBE tener al menos 250 palabras objetivo. Si no cumples este requisito, el sistema fallará.

Tema: ${topic}

Responde ÚNICAMENTE en formato JSON válido:

{
  "titulo": "Título optimizado para SEO",
  "meta_descripcion": "Meta descripción atractiva",
  "keyword_principal": "palabra clave principal",
  "palabras_totales": 2000,
  "secciones": [
    {
      "titulo": "Introducción",
      "objetivo": "Presentar el contexto y el propósito del artículo",
      "palabras": 300
    },
    {
      "titulo": "Sección 2",
      "objetivo": "Explicar...",
      "palabras": 350
    }
  ]
}
`;

    try {
      console.log('🔍 Verificando API key de Gemini...');
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY no está configurada');
      }

      console.log('📡 Enviando petición a Gemini...');
      const result = await this.gem1Model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('✅ Respuesta recibida de Gemini');

      // Limpiar la respuesta de Gemini (remover markdown si está presente)
      let cleanText = text.trim();

      // Remover ```json y ``` si están presentes
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '');
      }
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '');
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.replace(/\s*```$/, '');
      }

      console.log('🧹 Texto limpio:', cleanText.substring(0, 200) + '...');

      const parsedResult = JSON.parse(cleanText);
      return {
        title: parsedResult.titulo,
        keywords: [parsedResult.keyword_principal],
        sections: parsedResult.secciones.map((sec: any, index: number) => ({
          id: `seccion_${index + 1}`,
          title: sec.titulo,
          description: sec.objetivo,
          keywords: [parsedResult.keyword_principal],
          targetLength: sec.palabras,
        })),
        targetLength: parsedResult.palabras_totales,
        seoMeta: {
          title: parsedResult.titulo,
          description: parsedResult.meta_descripcion,
          keywords: [parsedResult.keyword_principal],
          focusKeyword: parsedResult.keyword_principal,
        },
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('❌ Error en GEM 1:', error);

      // Manejar errores específicos de la API
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('API_KEY_HTTP_REFERRER_BLOCKED')) {
        throw new Error(
          'API key de Gemini tiene restricciones de referrer. Ejecuta: pnpm gemini:fix'
        );
      }

      if (errorMessage.includes('403 Forbidden')) {
        throw new Error(
          'API key de Gemini inválida o con restricciones. Ejecuta: pnpm gemini:fix'
        );
      }

      throw new Error(`Error en GEM 1: ${errorMessage}`);
    }
  }

  private async executeGem2(gem1Result: Gem1Result): Promise<Gem2Result[]> {
    const results: Gem2Result[] = [];

    for (const section of gem1Result.sections) {
      console.log(`   🔍 Investigando: ${section.title}`);

      const prompt = `
Actúa como investigador de marketing digital e inteligencia artificial.
Recibirás el título global, la palabra clave principal y una sección específica con su objetivo y número de palabras.
Debes entregar:

- Resumen de la sección (3-4 líneas).
- Datos clave y estadísticas actualizadas (últimos 12 meses si es posible).
- Ejemplos concretos relevantes para empresas.
- Subtemas sugeridos para cubrir la extensión indicada.
- Ideas de listas, viñetas o cuadros comparativos.

Lenguaje técnico pero accesible. Evita frases genéricas. 
No redactes el artículo final, solo el contenido investigado.

Datos:
Título global: ${gem1Result.title}
Palabra clave principal: ${gem1Result.keywords[0]}
Sección: ${section.title}
Objetivo: ${section.description}
Palabras estimadas: ${section.targetLength}

Responde ÚNICAMENTE en formato JSON válido:

{
  "seccion": "${section.title}",
  "investigacion": "Texto investigado detallado...",
  "subtemas": ["Subtema 1", "Subtema 2"],
  "datos": [
    "Estadística o dato clave 1",
    "Estadística o dato clave 2"
  ],
  "ejemplos": [
    "Ejemplo 1",
    "Ejemplo 2"
  ]
}
`;

      const result = await this.gem2Model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        // Limpiar la respuesta de Gemini (remover markdown si está presente)
        let cleanText = text.trim();

        // Remover ```json y ``` si están presentes
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\s*/, '');
        }
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\s*/, '');
        }
        if (cleanText.endsWith('```')) {
          cleanText = cleanText.replace(/\s*```$/, '');
        }

        console.log(
          `   🧹 Texto limpio GEM 2 (${section.title}):`,
          cleanText.substring(0, 100) + '...'
        );

        const parsedResult = JSON.parse(cleanText);

        // Verificar que tenemos la investigación
        if (!parsedResult.investigacion) {
          console.error(
            `❌ GEM 2: No se encontró 'investigacion' en la respuesta para ${section.title}`
          );
          console.error(`❌ Respuesta recibida:`, parsedResult);
          // Usar un valor por defecto para evitar el error de base de datos
          parsedResult.investigacion = `Investigación en progreso para: ${section.title}`;
        }

        results.push({
          sectionId: section.id,
          research: parsedResult.investigacion,
          sources: [], // Se pueden agregar fuentes reales después
          insights: [
            ...(Array.isArray(parsedResult.datos) ? parsedResult.datos : []),
            ...(Array.isArray(parsedResult.ejemplos)
              ? parsedResult.ejemplos
              : []),
          ],
          createdAt: new Date(),
        });
      } catch (error) {
        console.error(
          `Error parsing GEM 2 response for section ${section.id}:`,
          error
        );
      }
    }

    return results;
  }

  private async executeGem3(
    gem1Result: Gem1Result,
    gem2Results: Gem2Result[]
  ): Promise<Gem3Result> {
    // Consolidar toda la investigación
    const investigacionConsolidada = gem2Results
      .map((r) => r.research)
      .join('\n\n');

    const prompt = `
Actúa como redactor senior especializado en marketing digital e inteligencia artificial.
Recibirás la investigación de todas las secciones, junto con la palabra clave principal y las metas de extensión.

REQUISITO CRÍTICO: El artículo DEBE tener MÍNIMO 1800 palabras. Si no alcanzas esta cantidad, expande las secciones con más detalles, ejemplos, casos de uso y explicaciones.

Debes:
1. Redactar el artículo en español, estilo profesional y persuasivo, alineado al manual de marca de IA Punto.
2. Formato Markdown:
   - Título H1
   - Meta descripción en un bloque destacado al inicio.
   - Secciones en H2 y subsecciones en H3.
3. Respetar la cantidad de palabras aproximada por sección.
4. Usar la palabra clave principal al menos 2 veces por sección.
5. Párrafos cortos (máx. 4 líneas), uso de listas y ejemplos.
6. No incluir enlaces ni fuentes, pero sí mantener tono confiable.
7. EXPANDIR cada sección con ejemplos prácticos, casos de uso, estadísticas y explicaciones detalladas.

Datos:
Título: ${gem1Result.title}
Meta descripción: ${gem1Result.seoMeta.description}
Palabra clave: ${gem1Result.keywords[0]}
Palabras objetivo: ${gem1Result.targetLength}
Investigación: ${investigacionConsolidada}

IMPORTANTE: Asegúrate de que el artículo tenga al menos 1800 palabras. Si es necesario, agrega más contenido, ejemplos y explicaciones detalladas.

Responde ÚNICAMENTE con el artículo en formato Markdown, sin JSON ni formato adicional.
`;

    const result = await this.gem3Model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return {
      fullArticle: content,
      wordCount: this.countWords(content),
      seoOptimized: true,
      readabilityScore: this.calculateReadabilityScore(content),
      createdAt: new Date(),
    };
  }

  private async executeGem4(
    articleContent: string,
    gem1Result: Gem1Result
  ): Promise<Gem4Result> {
    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
      // Generar prompt para la imagen usando Gemini
      const imagePromptGeneration = `
       Eres un experto en generación de prompts para imágenes de portada de blog.
       
       Título del artículo: ${gem1Result.title}
       Palabras clave: ${gem1Result.keywords.join(', ')}
       
       Genera un prompt en inglés para crear una imagen de portada profesional y atractiva que represente este artículo.
       
       El prompt debe:
       - Ser descriptivo y específico
       - Incluir estilo profesional y moderno
       - Representar el tema del artículo
       - Ser apropiado para una portada de blog
       - Incluir elementos visuales relevantes
       - Máximo 200 palabras
       
       Responde ÚNICAMENTE con el prompt en inglés, sin comillas ni formato adicional.
       `;

      const promptResult = await this.gem4Model.generateContent(
        imagePromptGeneration
      );
      const promptResponse = await promptResult.response;
      const imagePrompt = promptResponse.text().trim();

      console.log(
        '🎨 Prompt generado para imagen:',
        imagePrompt.substring(0, 100) + '...'
      );

      // Generar imagen usando la API de Imagen de Google
      const imageResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY || '',
          },
          body: JSON.stringify({
            instances: [
              {
                prompt: imagePrompt,
              },
            ],
            parameters: {
              sampleCount: 1,
              aspectRatio: '16:9', // Formato ideal para portadas de blog
            },
          }),
        }
      );

      if (!imageResponse.ok) {
        throw new Error(
          `Error en la API de Imagen: ${imageResponse.status} ${imageResponse.statusText}`
        );
      }

      const imageData = await imageResponse.json();

      if (
        !imageData.predictions ||
        !imageData.predictions[0] ||
        !imageData.predictions[0].bytesBase64Encoded
      ) {
        throw new Error('No se recibió imagen válida de la API de Imagen');
      }

      // Convertir base64 a buffer
      const imageBuffer = Buffer.from(
        imageData.predictions[0].bytesBase64Encoded,
        'base64'
      );

      // Generar slug temporal para la imagen
      const tempSlug = gem1Result.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

      // Subir a Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'blog-covers',
              public_id: `${tempSlug}-${Date.now()}`,
              transformation: [
                { width: 1200, height: 630, crop: 'fill' },
                { quality: 'auto', fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(imageBuffer);
      });

      const cloudinaryResult = uploadResult as any;

      // Generar alt text descriptivo
      const altTextPrompt = `
       Genera un alt text descriptivo y accesible para esta imagen de portada de blog.
       
       Título del artículo: ${gem1Result.title}
       
       El alt text debe:
       - Ser descriptivo y específico
       - Tener máximo 125 caracteres
       - Ser accesible para lectores de pantalla
       - Describir el contenido visual de la imagen
       
       Responde ÚNICAMENTE con el alt text, sin comillas ni formato adicional.
       `;

      const altResult = await this.gem4Model.generateContent(altTextPrompt);
      const altResponse = await altResult.response;
      const imageAlt = altResponse.text().trim();

      console.log(
        '🎨 Imagen generada y subida a Cloudinary:',
        cloudinaryResult.secure_url
      );
      console.log('📝 Alt text generado:', imageAlt);

      return {
        id: `gem4_${Date.now()}`,
        imageUrl: cloudinaryResult.secure_url,
        imageAlt: imageAlt,
        cloudinaryPublicId: cloudinaryResult.public_id,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('❌ Error en GEM 4:', error);

      // Si falla la generación de imagen, usar placeholder
      console.log('🔄 Usando imagen placeholder como fallback...');

      const placeholderImageUrl = `https://res.cloudinary.com/${process.env.PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/blog-covers/placeholder-ai-marketing.jpg`;

      return {
        id: `gem4_${Date.now()}`,
        imageUrl: placeholderImageUrl,
        imageAlt: `Imagen de portada para artículo sobre ${gem1Result.title}`,
        cloudinaryPublicId: `blog-covers/placeholder-${Date.now()}`,
        createdAt: new Date(),
      };
    }
  }

  private async executeGem5(
    articleContent: string,
    gem1Result: Gem1Result,
    gem4Result: Gem4Result
  ): Promise<Gem5Result> {
    const prompt = `
  Eres GEM 5, especialista en generación de frontmatter y optimización de contenido MDX.
      
  Contenido completo del artículo:
  ${articleContent}
      
  Información del plan:
  Título original: ${gem1Result.title}
  Palabras clave: ${gem1Result.keywords.join(', ')}
  
  Imagen generada:
  URL: ${gem4Result.imageUrl}
  Alt text: ${gem4Result.imageAlt}
      
  Tu tarea es generar el frontmatter completo siguiendo las reglas oficiales de IA Punto:
      
  Categorías oficiales:
  - Inteligencia Artificial
  - Marketing Digital y SEO
  - Negocios y Tecnología
  - Desarrollo Web
  - Automatización y Productividad
  - Opinión y Tendencias
  - Casos de Éxito
  - Ciencia y Salud
  - EVAFS
  - Skailan
      
    Tags oficiales:
   Inteligencia Artificial, Machine Learning, Deep Learning, Modelos de Lenguaje, Chatbots, Automatización, No-Code, Low-Code, SEO, SEO Local, SEO Programático, Marketing Digital, Marketing de Contenidos, Publicidad Digital, Google, Facebook, OpenAI, PYMES, Empresas, Transformación Digital, Innovación, Tendencias, Opinión, Seguridad, Privacidad, Analítica, Datos, Productividad, Herramientas, Software, APIs, Integraciones, Biotecnología, Salud, Ecommerce, Personalización, EVAFS, Skailan, Futuro, Ética IA, Regulación IA, Hardware IA, Data Management, SaaS, Startups, Emprendimiento

   IMPORTANTE: Usar "Analítica" (con tilde) NO "Análitica"
      
  Reglas obligatorias:
  1. Generar slug único y SEO-friendly
  2. Crear description atractiva (máximo 160 caracteres)
  3. Asignar categoría y subcategoría apropiadas
  4. Seleccionar máximo 7 tags relevantes
  5. Generar quote único y memorable (máximo 120 caracteres, aproximadamente 15-20 palabras)
    6. Usar autor: ${getAuthorById(this.authorId)?.name || getDefaultAuthor().name} con imagen y descripción
  7. Usar la imagen generada: ${gem4Result.imageUrl} como cover
  8. Usar el alt text generado: ${gem4Result.imageAlt} como coverAlt
  9. Usar fecha actual para pubDate
    10. Para mdxContent: COPIA EXACTAMENTE el contenido del artículo que recibiste, sin modificaciones, sin agregar frontmatter, sin agregar ---, sin cortar el contenido
      
  Responde en formato JSON:
  {
    "frontmatter": {
      "title": "Título optimizado",
      "slug": "slug-seo-friendly",
      "pubDate": "2025-01-27",
      "description": "Descripción SEO...",
      "cover": "${gem4Result.imageUrl}",
      "coverAlt": "${gem4Result.imageAlt}",
            "author": {
         "name": "${getAuthorById(this.authorId)?.name || getDefaultAuthor().name}",
         "description": "${getAuthorById(this.authorId)?.description || getDefaultAuthor().description}",
         "image": "${getAuthorById(this.authorId)?.image || getDefaultAuthor().image}"
       },
      "category": "Categoría oficial",
      "subcategory": "Subcategoría oficial",
      "tags": ["tag1", "tag2", "tag3"],
      "quote": "Frase única y memorable"
    },
    "mdxContent": "COPIA EXACTAMENTE el contenido del artículo que recibiste, sin modificaciones",
    "validationPassed": true,
    "validationErrors": []
  }
  `;

    const result = await this.gem4Model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Limpiar la respuesta de Gemini (remover markdown si está presente)
      let cleanText = text.trim();

      // Remover ```json y ``` si están presentes
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '');
      }
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '');
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.replace(/\s*```$/, '');
      }

      console.log(
        '🧹 Texto limpio GEM 5:',
        cleanText.substring(0, 200) + '...'
      );

      const gem5Result = JSON.parse(cleanText);
      gem5Result.createdAt = new Date();

      // Validar que cumple con las reglas
      const validation = this.validateFrontmatter(gem5Result.frontmatter);
      gem5Result.validationPassed = validation.isValid;
      gem5Result.validationErrors = validation.errors;

      return gem5Result;
    } catch (error) {
      throw new Error(`Error parsing GEM 5 response: ${error}`);
    }
  }

  private validateFrontmatter(frontmatter: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validar campos obligatorios
    const requiredFields = [
      'title',
      'slug',
      'pubDate',
      'description',
      'cover',
      'coverAlt',
      'author',
      'category',
      'tags',
      'quote',
    ];
    for (const field of requiredFields) {
      if (!frontmatter[field]) {
        errors.push(`Campo obligatorio faltante: ${field}`);
      }
    }

    // Validar categorías oficiales
    const officialCategories = [
      'Inteligencia Artificial',
      'Marketing Digital y SEO',
      'Negocios y Tecnología',
      'Desarrollo Web',
      'Automatización y Productividad',
      'Opinión y Tendencias',
      'Casos de Éxito',
      'Ciencia y Salud',
      'EVAFS',
      'Skailan',
    ];

    if (!officialCategories.includes(frontmatter.category)) {
      errors.push(`Categoría no válida: ${frontmatter.category}`);
    }

    // Validar tags oficiales
    const officialTags = [
      'Inteligencia Artificial',
      'Machine Learning',
      'Deep Learning',
      'Modelos de Lenguaje',
      'Chatbots',
      'Automatización',
      'No-Code',
      'Low-Code',
      'SEO',
      'SEO Local',
      'SEO Programático',
      'Marketing Digital',
      'Marketing de Contenidos',
      'Publicidad Digital',
      'Google',
      'Facebook',
      'OpenAI',
      'PYMES',
      'Empresas',
      'Transformación Digital',
      'Innovación',
      'Tendencias',
      'Opinión',
      'Seguridad',
      'Privacidad',
      'Analítica',
      'Datos',
      'Productividad',
      'Herramientas',
      'Software',
      'APIs',
      'Integraciones',
      'Biotecnología',
      'Salud',
      'Ecommerce',
      'Personalización',
      'EVAFS',
      'Skailan',
      'Futuro',
      'Ética IA',
      'Regulación IA',
      'Hardware IA',
      'Data Management',
      'SaaS',
      'Startups',
      'Emprendimiento',
    ];

    for (const tag of frontmatter.tags) {
      if (!officialTags.includes(tag)) {
        errors.push(`Tag no válido: ${tag}`);
      }
    }

    // Validar límite de tags
    if (frontmatter.tags.length > 7) {
      errors.push('Máximo 7 tags permitidos');
    }

    // Validar quote
    if (frontmatter.quote && frontmatter.quote.length > 120) {
      errors.push('Quote demasiado largo (máximo 120 caracteres)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }

  private calculateReadabilityScore(text: string): number {
    // Algoritmo simple de legibilidad
    const sentences = text.split(/[.!?]+/).length;
    const words = this.countWords(text);
    const syllables = text.toLowerCase().replace(/[^a-z]/g, '').length * 0.3;

    if (sentences === 0 || words === 0) return 0;

    return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  }
}
