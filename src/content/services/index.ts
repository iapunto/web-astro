import type { ServiceData } from '../../lib/constants/servicesData.ts';

// Estructura robusta para cada servicio
export const services: ServiceData[] = [
  // Chatbots Inteligentes
  {
    slug: 'chatbots-inteligentes',
    title:
      'Chatbots Inteligentes para WhatsApp, Instagram, Facebook y Telegram',
    hero: {
      title: 'Chatbots que Atienden, Venden y Fidelizan',
      description:
        'Automatiza tu atención al cliente, genera leads y responde en segundos con chatbots inteligentes diseñados para WhatsApp, Instagram, Facebook y Telegram.',
      image: '/public/icons/chatbot.png',
      alt: 'Chatbots Inteligentes para Canales de Mensajería',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1753230622/chatbots_inteligentes_image_uotuxy.jpg',
      alt: 'Chatbot en canales de mensajería',
    },
    benefits: [
      {
        title: 'Disponibilidad 24/7',
        description:
          'Tus clientes obtienen respuestas automáticas al instante, sin importar la hora ni el día.',
      },
      {
        title: 'Atención Personalizada',
        description:
          'Los chatbots aprenden y adaptan sus respuestas para ofrecer experiencias únicas en cada conversación.',
      },
      {
        title: 'Captura de Leads',
        description:
          'Recolecta datos clave como nombre, correo y necesidades específicas de cada cliente mientras conversan por WhatsApp, Instagram o Facebook.',
      },
      {
        title: 'Mejora en Satisfacción',
        description:
          'Los clientes obtienen soluciones inmediatas, lo que aumenta la confianza y reduce la frustración.',
      },
      {
        title: 'Reducción de Costos',
        description:
          'Automatiza procesos repetitivos y reduce la carga de tu equipo humano.',
      },
    ],
    features: [
      {
        icon: '<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"/></svg>',
        title: 'E-Commerce',
        description:
          'Responde dudas, guía el proceso de compra y activa promociones por WhatsApp, Instagram y más.',
      },
      {
        icon: '<svg class=w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M14.079 6.839a3 3 0 0 0-4.255.1M13 20h1.083A3.916 3.916 0 0 0 18 16.083V9A6 6 0 1 0 6 9v7m7 4v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1Zm-7-4v-6H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1Zm12-6h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z"/></svg>',
        title: 'Atención al Cliente',
        description:
          'Automatiza respuestas, programación de citas y soporte técnico.',
      },
      {
        icon: '<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 9H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6m0-6v6m0-6 5.419-3.87A1 1 0 0 1 18 5.942v12.114a1 1 0 0 1-1.581.814L11 15m7 0a3 3 0 0 0 0-6M6 15h3v5H6v-5Z"/></svg>',
        title: 'Marketing y Leads',
        description:
          'Segmenta audiencias, lanza campañas automatizadas y captura contactos valiosos.',
      },
      {
        icon: '<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="1" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/></svg>',
        title: 'Recursos Humanos',
        description:
          'Gestiona solicitudes, responde preguntas frecuentes internas y programa entrevistas.',
      },
      {
        icon: '<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V9a3 3 0 0 0-3-3h-3m1.5-2-2 2 2 2"/></svg>',
        title: 'Integración Multicanal',
        description:
          'Unifica la atención desde WhatsApp, Facebook, Instagram y Telegram en un solo flujo.',
      },
      {
        icon: '<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"/></svg>',
        title: 'Análisis y Reportes',
        description:
          'Visualiza estadísticas de conversaciones, rendimiento y evolución del bot.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: 'Tu chatbot en 4 pasos',
      description:
        'Creamos chatbots personalizados que entienden tu negocio, responden con precisión y mejoran con el tiempo.',
      steps: [
        {
          title: 'Diagnóstico del negocio',
          description:
            'Analizamos tu flujo de atención actual y detectamos oportunidades para automatizar y mejorar.',
          icon: '<svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"></path></svg>',
        },
        {
          title: 'Diseño conversacional',
          description:
            'Diseñamos los flujos, mensajes y respuestas para reflejar el tono y personalidad de tu marca.',
          icon: '<svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
        },
        {
          title: 'Integración multicanal',
          description:
            'Conectamos tu chatbot con WhatsApp, Instagram, Facebook, Telegram y tus sistemas internos como CRM o e-commerce.',
          icon: '<svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"></path></svg>',
        },
        {
          title: 'Entrenamiento y mejora',
          description:
            'Revisamos métricas reales, entrenamos al bot con nuevas preguntas y lo actualizamos constantemente.',
          icon: '<svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z"/></svg>',
        },
      ],
    },
    faqSubtitle:
      'Chatbots para WhatsApp, Instagram y más: lo que necesitas saber',
    faqDescription:
      'Resolvemos las dudas más comunes sobre nuestros chatbots inteligentes para mensajería y cómo pueden ayudarte a automatizar y escalar tu atención al cliente.',
    cta: {
      text: 'Solicita tu chatbot personalizado',
      link: '/contacto',
    },
    faqs: [
      {
        question: '¿Qué canales de mensajería soportan estos chatbots?',
        answer:
          'Nuestros chatbots funcionan en WhatsApp, Instagram, Facebook Messenger y Telegram, con integración total en cada uno.',
      },
      {
        question: '¿Puedo usar el mismo chatbot en múltiples plataformas?',
        answer:
          'Sí, diseñamos chatbots multicanal que pueden operar de forma coherente en diferentes plataformas al mismo tiempo.',
      },
      {
        question: '¿Cómo recopila datos mi chatbot?',
        answer:
          'A través de conversaciones naturales, el chatbot solicita y guarda datos como nombre, email, teléfono o necesidades específicas.',
      },
      {
        question:
          '¿Qué tan difícil es integrarlo con mi CRM o sistema de ventas?',
        answer:
          'No es difícil. Nosotros nos encargamos de la integración con herramientas como HubSpot, Zoho, Google Sheets, o sistemas personalizados.',
      },
      {
        question:
          '¿Es posible entrenar el chatbot con mis preguntas frecuentes?',
        answer:
          'Sí, adaptamos el bot para que responda usando tus FAQs, flujos internos y tono de comunicación.',
      },
      {
        question: '¿Qué pasa si el chatbot no entiende una pregunta?',
        answer:
          'Puede redirigir la conversación a un humano o dejar una alerta para revisión. Además, entrenamos constantemente para minimizar estos casos.',
      },
      {
        question: '¿El chatbot puede vender productos directamente?',
        answer:
          'Sí, puede mostrar catálogos, procesar pedidos y dirigir a pasarelas de pago si lo necesitas.',
      },
      {
        question: '¿Cuánto cuesta un chatbot para WhatsApp o Instagram?',
        answer:
          'Desde COP $180.000 según el alcance, flujos y número de canales. Te damos una cotización personalizada.',
      },
      {
        question: '¿Qué tipo de empresas usan estos chatbots?',
        answer:
          'Trabajamos con tiendas online, clínicas, inmobiliarias, agencias de marketing, educación y más.',
      },
      {
        question: '¿Necesito tener conocimientos técnicos para usarlo?',
        answer:
          'No. Recibes todo listo para usar y te damos capacitación si lo necesitas.',
      },
    ],
  },
  // Publicidad Online con IA
  {
    slug: 'publicidad-online-ia',
    title: 'Publicidad Online Potenciada con IA',
    hero: {
      title: 'Publicidad Online con IA que Atrae, Convence y Vende',
      description:
        'Usamos inteligencia artificial para crear campañas publicitarias más inteligentes, rentables y personalizadas. Llega a tu audiencia ideal con anuncios que generan resultados reales.',
      image: '/public/icons/ads.png',
      alt: 'Publicidad Online con IA',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1753228301/una-escena-moderna-y-minimalista-de-un-equipo-trabajando-en-desarrollo-web-un-escritorio-con-dos-pe_uttce8.jpg',
      alt: 'Publicidad Online con IA - Gráfico',
    },
    benefits: [
      {
        title: 'Audiencias Precisas',
        description:
          'La IA analiza datos en tiempo real para segmentar tu publicidad y llegar solo a quienes están listos para comprar.',
      },
      {
        title: 'Ads en Tiempo Real',
        description:
          'Tus campañas se ajustan automáticamente según el rendimiento. Más clics, menos gasto.',
      },
      {
        title: 'Aprovechamiento del Presupuesto',
        description:
          'Invertimos tu dinero donde realmente impacta. No más gastos innecesarios en publicidad digital.',
      },
      {
        title: 'Creatividad que Conecta',
        description:
          'Diseñamos anuncios atractivos y efectivos para cada plataforma. Publicidad con estilo y resultados.',
      },
      {
        title: 'Resultados Medibles',
        description:
          'Obtén reportes claros con métricas clave: clics, conversiones, retorno y recomendaciones.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: 'Publicidad con IA, paso a paso',
      description:
        'Combinamos estrategia digital con algoritmos inteligentes para optimizar cada campaña en redes sociales, buscadores y plataformas digitales.',
      steps: [
        {
          title: 'Análisis Predictivo',
          description:
            'Estudiamos el comportamiento de tu audiencia para predecir acciones y anticipar resultados.',
        },
        {
          title: 'Segmentación Inteligente',
          description:
            'Agrupamos a tus usuarios por intereses, comportamientos y datos para impactar con mensajes precisos.',
        },
        {
          title: 'Optimización con IA',
          description:
            'La inteligencia artificial redistribuye tu presupuesto en tiempo real para potenciar lo que funciona.',
        },
        {
          title: 'Análisis y Reportes',
          description:
            'Te entregamos insights útiles con recomendaciones para mejorar y escalar tus campañas.',
        },
      ],
    },
    features: [
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>',
        title: 'E-Commerce',
        description:
          'Campañas de remarketing, conversión y productos dinámicos para tiendas online.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 14v7m0 0-3-3m3 3 3-3" /></svg>',
        title: 'Emprendedores',
        description:
          'Visibilidad rápida en redes sociales y buscadores para negocios que están comenzando.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>',
        title: 'Pymes',
        description:
          'Publicidad rentable con resultados visibles en poco tiempo y control del presupuesto.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>',
        title: 'Corporativos',
        description:
          'Estrategias avanzadas de publicidad en redes sociales, Google Ads y medios digitales.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>',
        title: 'Publicidad en Redes',
        description:
          'Campañas optimizadas con IA en Facebook, Instagram, TikTok y más, enfocadas en conversión.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h3m0 0h12m-12 0V6m12 4v10M4 21h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1Z" /></svg>',
        title: 'Análisis de Resultados',
        description:
          'Medición precisa del impacto publicitario para tomar decisiones basadas en datos.',
      },
    ],
    faqs: [
      {
        question: '¿Qué plataformas manejan para hacer publicidad online?',
        answer:
          'Trabajamos con Meta Ads (Facebook e Instagram), Google Ads, LinkedIn, TikTok y otras según tu objetivo.',
      },
      {
        question: '¿Cómo ayuda la IA en la publicidad digital?',
        answer:
          'La IA mejora la segmentación, automatiza la optimización de anuncios y predice qué creativos generan mejores resultados.',
      },
      {
        question: '¿Qué tipo de resultados puedo esperar?',
        answer:
          'Dependiendo del tipo de campaña, puedes lograr más visitas, formularios, ventas o reconocimiento de marca.',
      },
      {
        question: '¿Cuánto presupuesto necesito para hacer ads?',
        answer:
          'Desde COP $300.000 puedes empezar a ver resultados con campañas bien optimizadas.',
      },
      {
        question: '¿También hacen publicidad en redes sociales?',
        answer:
          'Sí. Somos expertos en publicidad en redes sociales y adaptamos la estrategia a cada plataforma.',
      },
      {
        question: '¿Cómo sabré si los anuncios están funcionando?',
        answer:
          'Te enviamos reportes detallados con métricas clave, análisis y mejoras constantes.',
      },
      {
        question: '¿Necesito experiencia previa para contratar este servicio?',
        answer:
          'No. Nos encargamos de todo y te explicamos el rendimiento de tus campañas paso a paso.',
      },
      {
        question: '¿Hacen campañas para tiendas online?',
        answer:
          'Sí. Especialmente para e-commerce que buscan escalar sus ventas con campañas inteligentes.',
      },
      {
        question: '¿Qué diferencia su servicio de otros?',
        answer:
          'Usamos IA para optimizar presupuesto, creatividades y segmentación. No trabajamos con suposiciones, sino con datos reales.',
      },
      {
        question: '¿Puedo tener campañas en más de una red a la vez?',
        answer:
          'Por supuesto. Podemos correr campañas multicanal integradas y medir el rendimiento de cada una.',
      },
    ],
    faqSubtitle: 'Publicidad con IA: Todo lo que necesitas saber',
    faqDescription:
      'Respondemos las dudas más comunes sobre nuestros servicios de publicidad digital con inteligencia artificial.',
    cta: {
      text: 'Solicita una auditoría gratuita de tu publicidad',
      link: '/contacto',
    },
  },
  // Posicionamiento SEO
  {
    slug: 'posicionamiento-seo',
    title: 'Posicionamiento SEO',
    hero: {
      title: '¡Llega a la Cima de Google y Domina tu Mercado!',
      description:
        'No solo optimizamos sitios web… ¡Los lanzamos directamente a la primera página de los resultados de búsqueda!',
      image: '/public/icons/seo.png',
      alt: 'Icono de Posicionamiento SEO',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1753233559/representa-un-entorno-digital-moderno-donde-se-visualiza-una-campaa-de-publicidad-online-con-inteli_1_kny4c1.jpg',
      alt: 'SEO Inteligente - Gráfico',
    },
    benefits: [
      {
        title: 'Visibilidad Garantizada',
        description:
          'Mejoramos tu posicionamiento en Google para que aparezcas justo cuando tu audiencia te busca.',
      },
      {
        title: 'Tráfico Calificado',
        description:
          'Atraemos visitantes reales interesados en tus productos o servicios, no solo clics aleatorios.',
      },
      {
        title: 'Optimización Automática',
        description:
          'La IA ajusta constantemente tu estrategia SEO para mantenerse al día con los cambios de los algoritmos de Google.',
      },
      {
        title: 'ROI Medible',
        description:
          'Cada acción está diseñada para generar resultados tangibles y medibles, desde más visitas hasta conversiones.',
      },
      {
        title: 'Competencia Superada',
        description:
          'Analizamos a tus competidores y creamos estrategias para destacarte sobre ellos.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: 'Un proceso tan estratégico que parece magia.',
      description:
        'Detrás de cada campaña de SEO hay un sistema inteligente que convierte datos en decisiones estratégicas. Aquí te explicamos cómo lo hacemos:',
      steps: [
        {
          title: 'Análisis Inicial de Necesidades',
          description:
            'Evaluamos tu sitio web, identificamos áreas de mejora y analizamos palabras clave relevantes para tu negocio.',
        },
        {
          title: 'Optimización On-Page',
          description:
            'Mejoramos la estructura de tu sitio, optimizamos títulos, meta descripciones, imágenes y contenido para que Google te ame.',
        },
        {
          title: 'SEO Técnico',
          description:
            'Corregimos errores técnicos, mejoramos la velocidad de carga y aseguramos la indexación correcta.',
        },
        {
          title: 'Estrategia de Contenidos',
          description:
            'Creamos y optimizamos contenido relevante y de valor para atraer y retener a tu audiencia.',
        },
        {
          title: 'Linkbuilding Inteligente',
          description:
            'Generamos enlaces de calidad para aumentar la autoridad de tu sitio.',
        },
      ],
    },
    features: [
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>`,
        title: 'SEO On-Page y Off-Page',
        description:
          'Optimizamos tanto el contenido interno como la autoridad externa de tu web.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>`,
        title: 'Auditoría SEO Completa',
        description:
          'Analizamos todos los aspectos técnicos y de contenido para detectar oportunidades.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>`,
        title: 'Monitorización y Reporting',
        description:
          'Seguimiento constante de posiciones, tráfico y conversiones.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>`,
        title: 'Estrategias Personalizadas',
        description:
          'Cada negocio es único, por eso diseñamos estrategias a medida.',
      },
    ],
    faqs: [
      {
        question: '¿Cuánto tiempo tarda en verse resultados?',
        answer:
          'El SEO es una estrategia a mediano y largo plazo. Normalmente se ven mejoras en 3-6 meses.',
      },
      {
        question: '¿Qué diferencia hay entre SEO y SEM?',
        answer:
          'El SEO se enfoca en resultados orgánicos, mientras que el SEM implica publicidad pagada.',
      },
      {
        question: '¿Incluyen informes periódicos?',
        answer:
          'Sí, recibirás reportes periódicos con métricas clave y recomendaciones.',
      },
    ],
    cta: {
      text: 'Solicita una auditoría SEO gratuita',
      link: '/contacto',
    },
    extraBlocks: [
      {
        type: 'intro',
        content: `<section class="overflow-hidden bg-white py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-4 lg:px-8 content-center">
            <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div class="lg:pt-4 lg:pr-8">
                <div class="lg:max-w-lg">
                  <h2 class="text-base/7 font-semibold text-[#E51F52]">Beneficios Clave</h2>
                  <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">¿Por qué el Posicionamiento SEO es Tan Genial?</p>
                  <p class="mt-6 text-lg/8 text-gray-600">No solo optimizamos sitios web… ¡Los lanzamos directamente a la primera página de los resultados de búsqueda!</p>
                </div>
              </div>
              <img src="https://res.cloudinary.com/dkb9jfet8/image/upload/v1739915869/seo_zjzj1j.png" alt="Posicionamiento SEO" class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" loading="lazy" />
            </div>
          </div>
        </section>`,
      },
    ],
  },
  // Marketing de Contenidos
  {
    slug: 'marketing-de-contenidos',
    title: 'Marketing de Contenidos',
    hero: {
      title: 'Marketing de Contenidos',
      description:
        'Creamos contenido optimizado para SEO que atrae a tu audiencia y posiciona tu marca. Usamos IA.',
      image: '/public/icons/content.png',
      alt: 'Icono de Marketing de Contenidos',
    },
    mainImage: {
      url: 'YOUR_CLOUDINARY_URL_FOR_MARKETING_IMAGE',
      alt: 'Marketing de Contenidos - Gráfico',
    },
    benefits: [
      {
        title: 'Disponibilidad 24/7',
        description:
          '¡Dile adiós a las esperas! Tus clientes tendrán respuestas al instante, incluso si estás de vacaciones en la luna.',
      },
      {
        title: 'Atención Personalizada',
        description:
          'Cada cliente es único, ¡y tus chatbots también! Se adaptan a sus necesidades y les dan la atención VIP que se merecen.',
      },
      {
        title: 'Generación de Leads',
        description:
          '¡Olvídate de perseguir clientes! Tus chatbots capturan la información clave y te la entregan en bandeja de plata.',
      },
      {
        title: 'Aumento de la Satisfacción',
        description:
          'Clientes felices, ¡vida feliz! Los chatbots resuelven sus dudas al instante y les hacen sentir como reyes.',
      },
      {
        title: 'Reducción de Costos',
        description:
          '¡Que el dinero no se te escape! Los chatbots automatizan tareas y liberan a tu equipo para que se enfoque en lo que realmente importa.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: '¡Magia Digital en Acción!',
      description:
        'Cada chatbot que creamos es único, como tu negocio. Descubre cómo nuestro proceso de diseño personalizado te permitirá tener un chatbot con la personalidad de tu marca, ¡para que tus clientes se sientan como en casa!',
      steps: [
        {
          title: 'Análisis de Necesidades',
          description:
            'Entendemos tu negocio y a tus clientes para diseñar un chatbot a medida.',
        },
        {
          title: 'Diseño Personalizado',
          description:
            'Creamos un chatbot con la personalidad de tu marca, ¡para que tus clientes se sientan como en casa!',
        },
      ],
    },
    features: [
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>`,
        title: 'Blog Corporativo',
        description:
          'Publicaciones optimizadas para SEO y alineadas a tu estrategia de marca.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>`,
        title: 'Redacción para Landing Pages',
        description:
          'Textos persuasivos que convierten visitantes en clientes.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>`,
        title: 'Guiones para Video y Podcast',
        description:
          'Contenido multimedia para potenciar tu presencia digital.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>`,
        title: 'Difusión en Redes Sociales',
        description: 'Adaptación de contenidos para cada canal y audiencia.',
      },
    ],
    faqs: [
      {
        question: '¿Qué tipo de contenido crean?',
        answer:
          'Creamos blogs, artículos, guiones, textos para landing pages, redes sociales y más.',
      },
      {
        question: '¿El contenido es original?',
        answer: 'Sí, todo el contenido es 100% original y optimizado para SEO.',
      },
    ],
    cta: {
      text: 'Solicita una consultoría gratuita de contenidos',
      link: '/contacto',
    },
    extraBlocks: [
      {
        type: 'intro',
        content: `<section class="overflow-hidden bg-white py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-4 lg:px-8 content-center">
            <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div class="lg:pt-4 lg:pr-8">
                <div class="lg:max-w-lg">
                  <h2 class="text-base/7 font-semibold text-[#E51F52]">Beneficios Clave</h2>
                  <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">¿Por qué el Marketing de Contenidos es Tan Genial?</p>
                  <p class="mt-6 text-lg/8 text-gray-600">Creamos contenido optimizado para SEO que atrae a tu audiencia y posiciona tu marca. Usamos IA.</p>
                </div>
              </div>
              <img src="https://res.cloudinary.com/dkb9jfet8/image/upload/v1739915869/content_zjzj1j.png" alt="Marketing de Contenidos" class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" loading="lazy" />
            </div>
          </div>
        </section>`,
      },
    ],
  },
  // Desarrollo de Apps Móviles
  {
    slug: 'desarrollo-apps-moviles',
    title: 'Desarrollo de Apps Móviles',
    hero: {
      title: 'Conecta con tu Audiencia en Cualquier Lugar',
      description:
        'Llega a tus clientes donde quiera que estén con una app móvil atractiva y funcional.',
      image: '/public/icons/app-dev.png',
      alt: 'Icono de Desarrollo de Apps Móviles',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1740099869/app-movil_kimh1c.png',
      alt: 'Desarrollo de Apps Móviles - Pantalla de Producto',
    },
    benefits: [
      {
        title: 'Accesibilidad 24/7',
        description:
          'Tu audiencia puede interactuar contigo en cualquier momento y lugar.',
      },
      {
        title: 'Personalización avanzada',
        description:
          'Diseñamos apps que reflejan la identidad y los valores de tu marca.',
      },
      {
        title: 'Escalabilidad',
        description:
          'Tus apps pueden crecer junto con tu negocio, añadiendo nuevas funcionalidades según sea necesario.',
      },
      {
        title: 'Seguridad robusta',
        description:
          'Implementamos medidas de seguridad avanzadas para proteger los datos de tus usuarios.',
      },
      {
        title: 'Optimización para el rendimiento',
        description:
          'Aseguramos que tu app funcione sin problemas en todos los dispositivos.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle:
        'Un enfoque claro y colaborativo para llevar tu idea al mundo móvil.',
      description:
        'Cada app que creamos es única, como tu negocio. Descubre cómo nuestro proceso de diseño personalizado te permitirá tener una app con la personalidad de tu marca, ¡para que tus clientes se sientan como en casa!',
      steps: [
        {
          title: 'Análisis inicial',
          description:
            'Comprendemos tus objetivos, público objetivo y requisitos técnicos.',
        },
        {
          title: 'Diseño UI/UX',
          description:
            'Creamos prototipos y maquetas que reflejan la identidad de tu marca y la experiencia del usuario.',
        },
        {
          title: 'Desarrollo técnico',
          description:
            'Implementamos las funcionalidades necesarias y optimizamos el rendimiento.',
        },
        {
          title: 'Pruebas exhaustivas',
          description:
            'Probamos la app en diferentes dispositivos y escenarios para garantizar su calidad.',
        },
      ],
    },
    features: [
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>`,
        title: 'Apps Híbridas y Nativas',
        description:
          'Desarrollamos tanto apps híbridas como nativas según las necesidades de tu proyecto.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>`,
        title: 'Integración con Sistemas Externos',
        description:
          'Conectamos tu app con CRMs, sistemas de reservas, plataformas de email marketing y más.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>`,
        title: 'Soporte Multiplataforma',
        description:
          'Aseguramos compatibilidad con iOS y Android para llegar a la mayor audiencia posible.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>`,
        title: 'Mantenimiento y Actualizaciones',
        description:
          'Ofrecemos planes de mantenimiento para que tu app permanezca actualizada y segura.',
      },
    ],
    faqs: [
      {
        question: '¿Cuánto tiempo toma desarrollar una app móvil?',
        answer:
          'Depende del alcance del proyecto, pero generalmente los proyectos básicos tardan entre 1 y 2 meses, mientras que los más complejos pueden tomar un poco más de tiempo.',
      },
      {
        question: '¿Ofrecen mantenimiento después del lanzamiento?',
        answer:
          'Sí, ofrecemos planes de mantenimiento para garantizar que tu app permanezca actualizada y segura.',
      },
      {
        question: '¿Pueden integrar mi app con otras herramientas?',
        answer:
          '¡Claro! Podemos integrar tu app con CRMs, sistemas de reservas, plataformas de email marketing y más.',
      },
      {
        question: '¿Qué pasa si necesito cambios después del lanzamiento?',
        answer:
          'No hay problema. Ofrecemos paquetes de soporte post-lanzamiento para implementar cualquier cambio o mejora que necesites.',
      },
    ],
    cta: {
      text: 'Solicita una consultoría gratuita para tu app',
      link: '/contacto',
    },
    extraBlocks: [
      {
        type: 'intro',
        content: `<section class="overflow-hidden bg-white py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-4 lg:px-8 content-center">
            <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div class="lg:pt-4 lg:pr-8">
                <div class="lg:max-w-lg">
                  <h2 class="text-base/7 font-semibold text-[#E51F52]">Beneficios Clave</h2>
                  <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">¿Por qué el Desarrollo de Apps Móviles es Tan Genial?</p>
                  <p class="mt-6 text-lg/8 text-gray-600">Llega a tus clientes donde quiera que estén con una app móvil atractiva y funcional.</p>
                </div>
              </div>
              <img src="https://res.cloudinary.com/dkb9jfet8/image/upload/v1740099869/app-movil_kimh1c.png" alt="Desarrollo de Apps Móviles" class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" loading="lazy" />
            </div>
          </div>
        </section>`,
      },
    ],
  },
  // Odoo ERP
  {
    slug: 'odoo-erp',
    title: 'Odoo ERP',
    hero: {
      title: 'Odoo ERP',
      description:
        'Implementamos y personalizamos Odoo ERP para optimizar la gestión integral de tu empresa.',
      image: '/public/icons/odoo.png',
      alt: 'Icono de Odoo ERP',
    },
    mainImage: {
      url: 'YOUR_CLOUDINARY_URL_FOR_ODOO_IMAGE',
      alt: 'Odoo ERP - Interfaz de Usuario',
    },
    benefits: [
      {
        title: 'Disponibilidad 24/7',
        description:
          '¡Dile adiós a las esperas! Tus clientes tendrán respuestas al instante, incluso si estás de vacaciones en la luna.',
      },
      {
        title: 'Atención Personalizada',
        description:
          'Cada cliente es único, ¡y tus chatbots también! Se adaptan a sus necesidades y les dan la atención VIP que se merecen.',
      },
      {
        title: 'Generación de Leads',
        description:
          '¡Olvídate de perseguir clientes! Tus chatbots capturan la información clave y te la entregan en bandeja de plata.',
      },
      {
        title: 'Aumento de la Satisfacción',
        description:
          'Clientes felices, ¡vida feliz! Los chatbots resuelven sus dudas al instante y les hacen sentir como reyes.',
      },
      {
        title: 'Reducción de Costos',
        description:
          '¡Que el dinero no se te escape! Los chatbots automatizan tareas y liberan a tu equipo para que se enfoque en lo que realmente importa.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: '¡Magia Digital en Acción!',
      description:
        'Cada chatbot que creamos es único, como tu negocio. Descubre cómo nuestro proceso de diseño personalizado te permitirá tener un chatbot con la personalidad de tu marca, ¡para que tus clientes se sientan como en casa!',
      steps: [
        {
          title: 'Análisis de Necesidades',
          description:
            'Entendemos tu negocio y a tus clientes para diseñar un chatbot a medida.',
        },
        {
          title: 'Diseño Personalizado',
          description:
            'Creamos un chatbot con la personalidad de tu marca, ¡para que tus clientes se sientan como en casa!',
        },
      ],
    },
    features: [
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>`,
        title: 'Gestión Integral',
        description:
          'Control total de ventas, compras, inventario, contabilidad y más.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>`,
        title: 'Personalización',
        description:
          'Adaptamos Odoo a los procesos y necesidades específicas de tu empresa.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>`,
        title: 'Automatización de Procesos',
        description: 'Reduce tareas manuales y errores con flujos automáticos.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>`,
        title: 'Soporte y Actualizaciones',
        description: 'Acompañamiento y mantenimiento continuo para tu ERP.',
      },
    ],
    faqs: [
      {
        question: '¿Qué es Odoo ERP?',
        answer:
          'Odoo es un sistema de gestión empresarial (ERP) modular y flexible que integra todas las áreas de tu empresa en una sola plataforma.',
      },
      {
        question: '¿Puedo migrar mis datos actuales a Odoo?',
        answer:
          'Sí, realizamos migraciones de datos desde otros sistemas a Odoo de forma segura.',
      },
    ],
    cta: {
      text: 'Solicita una consultoría gratuita de Odoo',
      link: '/contacto',
    },
    extraBlocks: [
      {
        type: 'intro',
        content: `<section class="overflow-hidden bg-white py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-4 lg:px-8 content-center">
            <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div class="lg:pt-4 lg:pr-8">
                <div class="lg:max-w-lg">
                  <h2 class="text-base/7 font-semibold text-[#E51F52]">Beneficios Clave</h2>
                  <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">¿Por qué el Odoo ERP es Tan Genial?</p>
                  <p class="mt-6 text-lg/8 text-gray-600">Implementamos y personalizamos Odoo ERP para optimizar la gestión integral de tu empresa.</p>
                </div>
              </div>
              <img src="https://res.cloudinary.com/dkb9jfet8/image/upload/v1739915869/odoo_zjzj1j.png" alt="Odoo ERP" class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" loading="lazy" />
            </div>
          </div>
        </section>`,
      },
    ],
  },
  // Optimización y Conversión
  {
    slug: 'optimizacion-conversion',
    title: 'Optimización y Conversión',
    hero: {
      title: 'Optimización y Conversión',
      description:
        'Optimizamos tu sitio web para mejorar el rendimiento, la usabilidad y aumentar las conversiones.',
      image: '/public/icons/optimization.png',
      alt: 'Icono de Optimización y Conversión',
    },
    mainImage: {
      url: 'YOUR_CLOUDINARY_URL_FOR_OPTIMIZATION_IMAGE',
      alt: 'Optimización y Conversión - Gráfico',
    },
    benefits: [
      {
        title: 'Disponibilidad 24/7',
        description:
          '¡Dile adiós a las esperas! Tus clientes tendrán respuestas al instante, incluso si estás de vacaciones en la luna.',
      },
      {
        title: 'Atención Personalizada',
        description:
          'Cada cliente es único, ¡y tus chatbots también! Se adaptan a sus necesidades y les dan la atención VIP que se merecen.',
      },
      {
        title: 'Generación de Leads',
        description:
          '¡Olvídate de perseguir clientes! Tus chatbots capturan la información clave y te la entregan en bandeja de plata.',
      },
      {
        title: 'Aumento de la Satisfacción',
        description:
          'Clientes felices, ¡vida feliz! Los chatbots resuelven sus dudas al instante y les hacen sentir como reyes.',
      },
      {
        title: 'Reducción de Costos',
        description:
          '¡Que el dinero no se te escape! Los chatbots automatizan tareas y liberan a tu equipo para que se enfoque en lo que realmente importa.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: '¡Magia Digital en Acción!',
      description:
        'Cada chatbot que creamos es único, como tu negocio. Descubre cómo nuestro proceso de diseño personalizado te permitirá tener un chatbot con la personalidad de tu marca, ¡para que tus clientes se sientan como en casa!',
      steps: [
        {
          title: 'Análisis de Necesidades',
          description:
            'Entendemos tu negocio y a tus clientes para diseñar un chatbot a medida.',
        },
        {
          title: 'Diseño Personalizado',
          description:
            'Creamos un chatbot con la personalidad de tu marca, ¡para que tus clientes se sientan como en casa!',
        },
      ],
    },
    features: [
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>`,
        title: 'E-Commerce',
        description:
          'Responde preguntas sobre productos, guía a los clientes en el proceso de compra, ofrece descuentos personalizados.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>`,
        title: 'Atención al Cliente',
        description:
          'Resuelve dudas frecuentes, gestiona quejas, programa citas, ofrece soporte técnico.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>`,
        title: 'Marketing',
        description:
          'Captura leads, realiza encuestas, promociona productos, segmenta audiencias.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 14v7m0 0-3-3m3 3 3-3" /></svg>`,
        title: 'Recursos Humanos',
        description:
          'Responde preguntas sobre la empresa, gestiona solicitudes de empleo, programa entrevistas.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>`,
        title: 'Integración Multicanal',
        description:
          'Conecta tu chatbot con WhatsApp, Facebook Messenger, Instagram y más.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>`,
        title: 'Análisis y Reportes',
        description:
          'Obtén métricas detalladas sobre las conversaciones y el rendimiento de tu chatbot.',
      },
    ],
    faqs: [
      {
        question: '¿Qué es la optimización de conversión?',
        answer:
          'Es el proceso de mejorar tu sitio web para que más visitantes realicen una acción deseada, como comprar o registrarse.',
      },
      {
        question: '¿Cómo miden los resultados?',
        answer:
          'Utilizamos herramientas de analítica y test A/B para medir el impacto de cada mejora.',
      },
    ],
    cta: {
      text: 'Solicita una auditoría gratuita de conversión',
      link: '/contacto',
    },
    extraBlocks: [
      {
        type: 'intro',
        content: `<section class="overflow-hidden bg-white py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-4 lg:px-8 content-center">
            <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div class="lg:pt-4 lg:pr-8">
                <div class="lg:max-w-lg">
                  <h2 class="text-base/7 font-semibold text-[#E51F52]">Beneficios Clave</h2>
                  <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">¿Por qué la Optimización y Conversión es Tan Genial?</p>
                  <p class="mt-6 text-lg/8 text-gray-600">Optimizamos tu sitio web para mejorar el rendimiento, la usabilidad y aumentar las conversiones.</p>
                </div>
              </div>
              <img src="https://res.cloudinary.com/dkb9jfet8/image/upload/v1739915869/optimization_zjzj1j.png" alt="Optimización y Conversión" class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" loading="lazy" />
            </div>
          </div>
        </section>`,
      },
    ],
  },
  // Automatización Inteligente
  {
    slug: 'automatizacion-inteligente',
    title: 'Automatización Inteligente',
    hero: {
      title: 'La Revolución que tu Negocio Necesita',
      description:
        'Imagina un mundo donde las tareas repetitivas desaparecen, los errores son cosa del pasado y tu equipo se enfoca en lo que realmente importa: innovar y crecer.',
      image: '/public/icons/automation.png',
      alt: 'Icono de Automatización Inteligente',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1740168099/automatizacion-inteligente_plg82y.png',
      alt: 'Automatización Inteligente - Flujo de Trabajo',
    },
    benefits: [
      {
        title: 'Ahorra Tiempo y Recursos',
        description:
          'Automatiza tareas repetitivas y libera a tu equipo para que se enfoque en estrategias de alto impacto.',
      },
      {
        title: 'Reduce Errores Humanos',
        description:
          'Con procesos precisos y sistemas inteligentes, los errores se convierten en cosa del pasado.',
      },
      {
        title: 'Toma Decisiones más Rápidas',
        description:
          'Accede a datos en tiempo real y toma decisiones informadas al instante.',
      },
      {
        title: 'Mejora la Experiencia del Cliente',
        description:
          'Ofrece respuestas rápidas, servicios personalizados y una atención impecable.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona la Automatización Inteligente?',
      subtitle: '',
      description:
        'En IA Punto, la automatización inteligente es lo que hacemos.',
      steps: [
        {
          title: 'Diagnóstico y Planificación',
          description:
            'Analizamos tus procesos actuales para identificar áreas de mejora y oportunidades de automatización.',
        },
        {
          title: 'Diseño de Flujos de Trabajo',
          description:
            'Creamos flujos inteligentes que se adaptan a tus necesidades y objetivos.',
        },
        {
          title: 'Implementación de IA',
          description:
            'Integramos tecnologías avanzadas de Inteligencia Artificial (IA) para automatizar tareas.',
        },
        {
          title: 'Monitoreo y Optimización',
          description:
            'Aseguramos que todo funcione a la perfección y ajustamos los sistemas según sea necesario.',
        },
      ],
    },
    features: [
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>`,
        title: 'Procesos Administrativos',
        description:
          'Automatiza tareas como facturación, gestión de inventarios y reportes.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>`,
        title: 'Atención al Cliente',
        description:
          'Responde consultas frecuentes, gestiona tickets y mejora la experiencia del usuario.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>`,
        title: 'Integración de Sistemas',
        description:
          'Conecta tus plataformas y herramientas para un flujo de trabajo sin fricciones.',
      },
      {
        icon: `<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>`,
        title: 'Alertas y Monitoreo',
        description:
          'Recibe notificaciones automáticas y monitorea procesos en tiempo real.',
      },
    ],
    faqs: [
      {
        question: '¿Qué tipo de tareas se pueden automatizar?',
        answer:
          'Casi cualquier tarea repetitiva: desde envío de emails y gestión de inventarios hasta análisis de datos y atención al cliente.',
      },
      {
        question: '¿Es complicado implementar la automatización?',
        answer:
          '¡Para nada! En IA Punto, nos encargamos de todo. Desde el diagnóstico hasta la implementación y el soporte continuo.',
      },
      {
        question: '¿Qué herramientas de IA utilizan?',
        answer:
          'Usamos herramientas de vanguardia como Zapier, Make, Microsoft Power Automate y soluciones personalizadas desarrolladas por nuestro equipo.',
      },
      {
        question: '¿Cuánto tiempo se tarda en ver resultados?',
        answer:
          'Depende del proyecto, pero la mayoría de nuestros clientes ven mejoras significativas en cuestión de semanas.',
      },
      {
        question: '¿Es costoso implementar la automatización?',
        answer:
          'Es una inversión que se paga sola. El ahorro de tiempo y recursos, junto con el aumento de eficiencia, generan un retorno rápido y tangible.',
      },
    ],
    cta: {
      text: 'Solicita una consultoría gratuita de automatización',
      link: '/contacto',
    },
    extraBlocks: [
      {
        type: 'intro',
        content: `<section class="overflow-hidden bg-white py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-4 lg:px-8 content-center">
            <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div class="lg:pt-4 lg:pr-8">
                <div class="lg:max-w-lg">
                  <h2 class="text-base/7 font-semibold text-[#E51F52]">Beneficios Clave</h2>
                  <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">¿Por qué la Automatización Inteligente es Tan Genial?</p>
                  <p class="mt-6 text-lg/8 text-gray-600">La Revolución que tu Negocio Necesita</p>
                </div>
              </div>
              <img src="https://res.cloudinary.com/dkb9jfet8/image/upload/v1740168099/automatizacion-inteligente_plg82y.png" alt="Automatización Inteligente" class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" loading="lazy" />
            </div>
          </div>
        </section>`,
      },
    ],
  },
  // Diseño y Desarrollo Web
  {
    slug: 'diseno-desarrollo-web',
    title: 'Diseño y Desarrollo Web',
    hero: {
      title:
        'Diseño y Desarrollo Web Profesional para Negocios que Quieren Crecer',
      description:
        'Creamos sitios web que convierten: rápidos, seguros y optimizados para posicionarse en Google.',
      image: '/icons/web-design.png',
      alt: 'Icono de Diseño y Desarrollo Web',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1753229236/una-escena-moderna-y-minimalista-de-un-equipo-trabajando-en-desarrollo-web-un-escritorio-con-dos-pe_1_gqhuma.jpg',
      alt: 'Product screenshot',
    },
    benefits: [
      {
        title: 'Diseño responsive',
        description:
          'Tu sitio se adapta a móviles, tablets y todo tipo de pantalla.',
      },
      {
        title: 'Integración total',
        description:
          'Conectamos tu web con CRMs, reservas, WhatsApp, email marketing y más.',
      },
      {
        title: 'SEO de base',
        description:
          'Optimización técnica desde el inicio para destacar en Google.',
      },
      {
        title: 'E-commerce funcional',
        description:
          'Tiendas online con control de stock, cupones, pagos y fidelización.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: 'Nuestro Proceso de Diseño y Desarrollo Web',
      description:
        'Construimos tu web con estrategia, diseño y tecnología. Nada genérico.',
      steps: [
        {
          title: 'Análisis Estratégico',
          description:
            'Investigamos tu negocio, mercado, competencia y objetivos digitales.',
          icon: `<svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15v3c0 .5523.44772 1 1 1h4v-4m-5 0v-4m0 4h5m-5-4V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v1.98935M3 11h5v4m9.4708 4.1718-.8696-1.4388-2.8164-.235-2.573-4.2573 1.4873-2.8362 1.4441 2.3893c.3865.6396 1.2183.8447 1.8579.4582.6396-.3866.8447-1.2184.4582-1.858l-1.444-2.38925h3.1353l2.6101 4.27715-1.0713 2.5847.8695 1.4388"/></svg>`,
        },
        {
          title: 'Diseño UX/UI',
          description:
            'Diseñamos interfaces intuitivas y visuales que conectan con tu audiencia.',
          icon: `<svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m4.988 19.012 5.41-5.41m2.366-6.424 4.058 4.058-2.03 5.41L5.3 20 4 18.701l3.355-9.494 5.41-2.029Zm4.626 4.625L12.197 6.61 14.807 4 20 9.194l-2.61 2.61Z"/></svg>`,
        },
        {
          title: 'Desarrollo técnico',
          description:
            'Programamos tu sitio web con velocidad, seguridad y compatibilidad total.',
          icon: `<svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.35709 16V5.78571c0-.43393.34822-.78571.77777-.78571H18.5793c.4296 0 .7778.35178.7778.78571V16M5.35709 16h-1c-.55229 0-1 .4477-1 1v1c0 .5523.44771 1 1 1H20.3571c.5523 0 1-.4477 1-1v-1c0-.5523-.4477-1-1-1h-1M5.35709 16H19.3571M9.35709 8l2.62501 2.5L9.35709 13m4.00001 0h2"/></svg>`,
        },
        {
          title: 'Pruebas + Lanzamiento',
          description:
            'Validamos funcionalidad, velocidad y usabilidad antes de lanzar tu sitio.',
          icon: `<svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1M9 12H4m8 8V9h8v11h-8Zm0 0H9m8-4a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"/></svg>`,
        },
      ],
    },
    features: [
      {
        icon: `<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z"/></svg>`,
        title: 'Sitios Corporativos',
        description:
          'Webs institucionales, portafolios y páginas de presentación.',
      },
      {
        icon: `<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"/></svg>
`,
        title: 'E-commerce',
        description:
          'Tiendas online con pasarelas de pago y gestión de inventario.',
      },
      {
        icon: `<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V9a3 3 0 0 0-3-3h-3m1.5-2-2 2 2 2"/></svg>`,
        title: 'Integraciones',
        description:
          'Conexión con CRMs, sistemas de reservas, email marketing y más.',
      },
      {
        icon: `<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m10.051 8.102-3.778.322-1.994 1.994a.94.94 0 0 0 .533 1.6l2.698.316m8.39 1.617-.322 3.78-1.994 1.994a.94.94 0 0 1-1.595-.533l-.4-2.652m8.166-11.174a1.366 1.366 0 0 0-1.12-1.12c-1.616-.279-4.906-.623-6.38.853-1.671 1.672-5.211 8.015-6.31 10.023a.932.932 0 0 0 .162 1.111l.828.835.833.832a.932.932 0 0 0 1.111.163c2.008-1.102 8.35-4.642 10.021-6.312 1.475-1.478 1.133-4.77.855-6.385Zm-2.961 3.722a1.88 1.88 0 1 1-3.76 0 1.88 1.88 0 0 1 3.76 0Z"/></svg>`,
        title: 'Optimización de Velocidad',
        description:
          'Webs rápidas y ligeras para mejorar la experiencia del usuario y el SEO.',
      },
      {
        icon: `<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="1" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87 1.07 1.413 2.075 1.228 3.192 2.644 1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58 1.402.693 2.918.351 2.918 2.334 0 .276 0 2.008 1.972 2.008 2.026.031 2.026-1.678 2.026-2.008 0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
        title: 'Accesibilidad Web',
        description:
          'Sitios diseñados para ser usables por todas las personas, cumpliendo estándares internacionales.',
      },
      {
        icon: `<svg class="w-[64px] h-[64px] text-primary-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M14.079 6.839a3 3 0 0 0-4.255.1M13 20h1.083A3.916 3.916 0 0 0 18 16.083V9A6 6 0 1 0 6 9v7m7 4v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1Zm-7-4v-6H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1Zm12-6h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z"/></svg>`,
        title: 'Soporte y Mantenimiento',
        description:
          'Planes de soporte para mantener tu web actualizada y segura.',
      },
    ],
    faqs: [
      {
        question: '¿Qué incluye el servicio de desarrollo web?',
        answer:
          'Diseño UX/UI, programación personalizada, integración de herramientas, optimización SEO y soporte técnico post-lanzamiento.',
      },
      {
        question: '¿En cuánto tiempo estará lista mi web?',
        answer:
          'Entre 2 y 8 semanas, según la complejidad. Definimos contigo un cronograma claro.',
      },
      {
        question: '¿Puedo actualizar mi sitio luego del lanzamiento?',
        answer:
          'Sí. Entregamos acceso total a un panel de administración intuitivo.',
      },
      {
        question: '¿El desarrollo web incluye dominio y hosting?',
        answer: 'Podemos asesorarte o gestionar ambos por ti. Tú decides.',
      },
      {
        question: '¿La web estará optimizada para buscadores?',
        answer:
          'Sí. Todos nuestros proyectos incluyen optimización técnica SEO para destacar en Google.',
      },
      {
        question: '¿Puedo agregar tienda online o agendamiento de citas?',
        answer:
          'Claro. Integramos e-commerce, calendarios, CRM, pagos en línea y todo lo que necesites.',
      },
      {
        question: '¿Qué pasa si necesito ayuda luego del lanzamiento?',
        answer:
          'Contamos con planes de soporte y mantenimiento desde $50.000 al mes.',
      },
    ],
    cta: {
      text: 'Solicita una consultoría gratuita para tu web',
      link: '/contacto',
    },
    extraBlocks: [
      {
        type: 'intro',
        content: `<section class="overflow-hidden bg-white py-24 sm:py-32">
          <div class="mx-auto max-w-7xl px-4 lg:px-8 content-center">
            <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div class="lg:pt-4 lg:pr-8">
                <div class="lg:max-w-lg">
                  <h2 class="text-base/7 font-semibold text-[#E51F52]">Beneficios Clave</h2>
                  <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">¿Por Qué Invertir en Desarrollo Web Hoy?</p>
                  <p class="mt-6 text-lg/8 text-gray-600">Convierte visitantes en clientes con un sitio web profesional, funcional y optimizado para el éxito. Estas son razones reales, no promesas vacías:</p>
                </div>
              </div>
              <img src="https://res.cloudinary.com/dkb9jfet8/image/upload/v1753228301/una-escena-moderna-y-minimalista-de-un-equipo-trabajando-en-desarrollo-web-un-escritorio-con-dos-pe_uttce8.jpg" alt="Diseño y Desarrollo Web" class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" loading="lazy" />
            </div>
          </div>
        </section>`,
      },
    ],
    pricing: [
      {
        title: 'Desarrollo Inicial',
        type: 'grid',
        plans: [
          {
            name: 'Plan Básico',
            price: '$1.200.000',
            features: [
              'Hasta 5 páginas',
              'Diseño responsive',
              'Soporte básico',
            ],
          },
          {
            name: 'Plan Intermedio',
            price: '$1.600.000',
            features: [
              'Hasta 10 páginas',
              'Integración con formularios',
              'Soporte estándar',
            ],
          },
          {
            name: 'Plan Avanzado',
            price: '$1.900.000',
            features: [
              'Hasta 20 páginas',
              'Integración con CRM y pasarela de pago',
              'Soporte prioritario',
            ],
          },
        ],
      },
      {
        title: 'Mantenimiento y Soporte',
        type: 'table',
        plans: [
          {
            name: 'Soporte Básico',
            price: '$80.000/mes',
            features: ['Actualizaciones menores', 'Soporte por email'],
          },
          {
            name: 'Soporte Premium',
            price: '$190.000/mes',
            features: [
              'Actualizaciones ilimitadas',
              'Soporte prioritario',
              'Backups automáticos',
            ],
          },
        ],
      },
    ],
  },
];

export default services;
