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
      image: '/icons/chatbot.png',
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
      image: '/icons/ads.png',
      alt: 'Publicidad Online con IA',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1753233559/entorno-digital_1_kny4c1.jpg',
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
      title: '¡Llega a la Cima de Google con Estrategia y Tecnología!',
      description:
        'Optimizamos tu presencia digital con técnicas de posicionamiento SEO apoyadas por inteligencia artificial. Más visibilidad, más tráfico calificado, más clientes.',
      image: '/icons/seo.png',
      alt: 'Icono de Posicionamiento SEO',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1753235537/interfaz-seo-moderna_w2rqyk.jpg',
      alt: 'SEO Inteligente - Gráfico',
    },
    benefits: [
      {
        title: 'Visibilidad Garantizada',
        description:
          'Mejoramos tu posicionamiento en Google para que te encuentren justo cuando te necesitan.',
      },
      {
        title: 'Tráfico Calificado',
        description:
          'Atraemos visitantes que realmente están interesados en tus productos o servicios.',
      },
      {
        title: 'SEO Automatizado',
        description:
          'La inteligencia artificial se encarga de ajustar y actualizar tu estrategia sin que tengas que mover un dedo.',
      },
      {
        title: 'Resultados Medibles',
        description:
          'Cada mejora se traduce en más clics, más visitas, y más oportunidades de negocio.',
      },
      {
        title: 'Estrategia Contra tu Competencia',
        description:
          'Analizamos a tus competidores para superarlos en posicionamiento y relevancia.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: 'Proceso SEO impulsado por IA',
      description:
        'Combinamos análisis profundo, inteligencia artificial y estrategias personalizadas para mejorar tu presencia orgánica:',
      steps: [
        {
          title: 'Análisis Inicial',
          description:
            'Auditoría completa de tu sitio y análisis de palabras clave.',
        },
        {
          title: 'SEO On-Page',
          description:
            'Optimización de estructura, velocidad, metadatos y contenido.',
        },
        {
          title: 'SEO Técnico',
          description:
            'Corrección de errores, mejora de indexación y compatibilidad.',
        },
        {
          title: 'Contenido Estratégico',
          description:
            'Creamos contenido enfocado en atraer búsquedas con alta intención.',
        },
        {
          title: 'Linkbuilding Inteligente',
          description:
            'Obtenemos enlaces de calidad que aumentan tu autoridad online.',
        },
      ],
    },
    features: [
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>',
        title: 'SEO On-Page y Off-Page',
        description:
          'Optimizamos contenido y autoridad para que Google te priorice.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>',
        title: 'Auditoría SEO Completa',
        description:
          'Identificamos problemas y oportunidades con un análisis exhaustivo.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>',
        title: 'Monitorización y Reporting',
        description:
          'Seguimiento continuo de métricas clave y reportes accionables.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>',
        title: 'Estrategias a Medida',
        description: 'Diseñamos planes SEO personalizados según tu negocio.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>',
        title: 'Indexación y Velocidad',
        description:
          'Mejoramos la velocidad del sitio y garantizamos correcta indexación en buscadores.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m-7.5-7.5v15" /></svg>',
        title: 'SEO para Contenido',
        description:
          'Optimizamos tu blog, páginas de servicio y categorías para escalar en buscadores.',
      },
    ],
    faqs: [
      {
        question: '¿Cuánto tiempo tarda en verse resultados con SEO?',
        answer:
          'El SEO empieza a mostrar resultados entre los 3 y 6 meses, dependiendo de tu industria y competencia.',
      },
      {
        question: '¿Qué diferencia hay entre SEO y publicidad pagada (SEM)?',
        answer:
          'SEO genera tráfico orgánico a largo plazo, mientras SEM implica pago por clic en plataformas como Google Ads.',
      },
      {
        question: '¿Ustedes escriben contenido optimizado?',
        answer:
          'Sí, creamos y mejoramos contenido basado en palabras clave relevantes para tu negocio.',
      },
      {
        question: '¿Cómo sabré que está funcionando?',
        answer:
          'Te entregamos reportes periódicos con métricas clave: tráfico, rankings, conversiones y más.',
      },
      {
        question: '¿El SEO incluye mejoras técnicas al sitio?',
        answer:
          'Sí. Trabajamos en velocidad, errores de indexación, estructura, y más aspectos técnicos.',
      },
      {
        question: '¿Pueden posicionar cualquier tipo de sitio web?',
        answer:
          'Sí, ya sea e-commerce, blog, sitio corporativo o local, adaptamos la estrategia a tu caso.',
      },
      {
        question: '¿Ofrecen auditorías SEO antes de contratar?',
        answer:
          'Sí. Puedes solicitar una auditoría gratuita para conocer el estado de tu sitio.',
      },
    ],
    faqSubtitle: 'SEO Inteligente: Preguntas Frecuentes',
    faqDescription:
      'Respondemos las dudas más comunes sobre cómo mejorar tu posicionamiento web con ayuda de la IA.',
    cta: {
      text: 'Solicita una auditoría SEO gratuita',
      link: '/contacto',
    },
  },
  // Marketing de Contenidos
  {
    slug: 'marketing-de-contenidos',
    title: 'Marketing de Contenidos',
    hero: {
      title: 'Convierte Contenido en Clientes',
      description:
        'Creamos contenido inteligente, original y estratégico. Atrae, educa y convierte con textos impulsados por SEO e inteligencia artificial.',
      image: '/icons/content.png',
      alt: 'Icono de Marketing de Contenidos',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1753236224/marketing-de-contenidos_rvslam.jpg',
      alt: 'Marketing de Contenidos - Gráfico',
    },
    benefits: [
      {
        title: 'Atracción Orgánica',
        description:
          'Atrae tráfico de calidad con contenido que responde a lo que tu audiencia busca.',
      },
      {
        title: 'Confianza y Autoridad',
        description:
          'Posiciónate como referente en tu sector con artículos útiles, claros y bien escritos.',
      },
      {
        title: 'Conversión Potenciada',
        description:
          'No solo informamos: persuadimos. El contenido impulsa tus objetivos de venta.',
      },
      {
        title: 'Alineación SEO',
        description:
          'Cada palabra está optimizada para mejorar tu posicionamiento en buscadores.',
      },
      {
        title: 'Escalabilidad Automática',
        description:
          'Usamos IA para escalar producción de contenido sin perder calidad.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: 'Contenido con propósito, proceso con lógica',
      description:
        'Transformamos ideas en contenido estratégico que conecta con tu público y cumple objetivos reales:',
      steps: [
        {
          title: 'Brief y Estrategia',
          description:
            'Analizamos tu marca, público y metas para definir tono, temas y estilo.',
        },
        {
          title: 'Investigación y SEO',
          description:
            'Estudiamos keywords relevantes, intención de búsqueda y competencia.',
        },
        {
          title: 'Redacción Profesional',
          description:
            'Creamos contenido original con estructura, narrativa y llamadas a la acción.',
        },
        {
          title: 'Revisión y Optimización',
          description:
            'Ajustamos según métricas de legibilidad, SEO, y estilo de marca.',
        },
      ],
    },
    features: [
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>',
        title: 'Blog Corporativo',
        description:
          'Publicaciones periódicas con valor, optimizadas para buscadores.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>',
        title: 'Landing Pages',
        description:
          'Textos que capturan leads y convierten visitantes en clientes.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>',
        title: 'Scripts para Video/Podcast',
        description: 'Ideas claras para contenidos que se escuchan y se ven.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>',
        title: 'Difusión en Redes Sociales',
        description: 'Adaptamos cada pieza a tu audiencia y canal digital.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>',
        title: 'Boletines y Email Marketing',
        description: 'Contenido por correo que nutre y convierte.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m-7.5-7.5v15" /></svg>',
        title: 'Pilares y Clústeres SEO',
        description:
          'Arquitectura de contenido que estructura tu sitio para escalar.',
      },
    ],
    faqs: [
      {
        question: '¿Qué tipo de contenido ofrecen?',
        answer:
          'Blogs, artículos, emails, guiones, contenido para redes, landing pages, ebooks y más.',
      },
      {
        question: '¿El contenido es original y único?',
        answer:
          'Sí. Cada pieza es redactada a medida, libre de plagio y adaptada a tu marca.',
      },
      {
        question: '¿Cómo aseguran que el contenido esté optimizado para SEO?',
        answer:
          'Incluimos keywords estratégicas, estructura clara, metadatos y enlaces internos.',
      },
      {
        question: '¿Puedo revisar y aprobar los textos antes de publicarlos?',
        answer:
          'Por supuesto. Cada entrega pasa por tu aprobación antes de difusión.',
      },
      {
        question: '¿Generan contenido para campañas específicas?',
        answer:
          'Sí. Creamos contenido enfocado en objetivos concretos: lanzamientos, promociones, eventos, etc.',
      },
      {
        question: '¿El contenido lo escribe una persona o una IA?',
        answer:
          'Nuestros redactores utilizan IA como asistente, pero todo pasa por manos humanas expertas.',
      },
      {
        question: '¿También pueden difundir el contenido?',
        answer:
          'Sí. Podemos ayudarte a programar y difundir cada pieza en redes, blog y email marketing.',
      },
    ],
    faqSubtitle: 'Marketing de Contenidos: Preguntas Frecuentes',
    faqDescription:
      'Aquí respondemos lo esencial para que sepas cómo nuestra estrategia de contenidos puede impulsar tu marca.',
    cta: {
      text: 'Solicita una consultoría gratuita de contenidos',
      link: '/contacto',
    },
  },
  // Desarrollo de Apps Móviles
  {
    slug: 'desarrollo-apps-moviles',
    title: 'Desarrollo de Apps Móviles',
    hero: {
      title: 'Conecta con tu Audiencia en Cualquier Lugar',
      description:
        'Llega a tus clientes donde quiera que estén con una app móvil atractiva y funcional.',
      image: '/icons/app-dev.png',
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
        title: 'Personalización Avanzada',
        description:
          'Diseñamos apps que reflejan la identidad y los valores de tu marca.',
      },
      {
        title: 'Escalabilidad',
        description:
          'Tus apps pueden crecer junto con tu negocio, añadiendo nuevas funcionalidades según sea necesario.',
      },
      {
        title: 'Seguridad Robusta',
        description:
          'Implementamos medidas de seguridad avanzadas para proteger los datos de tus usuarios.',
      },
      {
        title: 'Optimización para el Rendimiento',
        description:
          'Aseguramos que tu app funcione sin problemas en todos los dispositivos.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle:
        'Un enfoque claro y colaborativo para llevar tu idea al mundo móvil.',
      description:
        'Cada app que creamos es única, como tu negocio. Descubre cómo nuestro proceso personalizado convierte tu idea en una app funcional, intuitiva y potente.',
      steps: [
        {
          title: 'Análisis Inicial',
          description:
            'Comprendemos tus objetivos, público objetivo y requisitos técnicos.',
        },
        {
          title: 'Diseño UI/UX',
          description:
            'Creamos prototipos y maquetas que reflejan la identidad de tu marca y la experiencia del usuario.',
        },
        {
          title: 'Desarrollo Técnico',
          description:
            'Implementamos las funcionalidades necesarias y optimizamos el rendimiento.',
        },
        {
          title: 'Pruebas Exhaustivas',
          description:
            'Probamos la app en diferentes dispositivos y escenarios para garantizar su calidad.',
        },
      ],
    },
    features: [
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>',
        title: 'Apps Híbridas y Nativas',
        description:
          'Desarrollamos tanto apps híbridas como nativas según las necesidades de tu proyecto.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>',
        title: 'Integración con Sistemas Externos',
        description:
          'Conectamos tu app con CRMs, sistemas de reservas, plataformas de email marketing y más.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>',
        title: 'Soporte Multiplataforma',
        description:
          'Aseguramos compatibilidad con iOS y Android para llegar a la mayor audiencia posible.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>',
        title: 'Mantenimiento y Actualizaciones',
        description:
          'Ofrecemos planes de mantenimiento para que tu app permanezca actualizada y segura.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12m-6-6v12" /></svg>',
        title: 'Publicación en Tiendas',
        description:
          'Te ayudamos a publicar tu app en App Store y Google Play sin complicaciones.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>',
        title: 'Notificaciones Push',
        description:
          'Enviamos mensajes directos a los dispositivos móviles de tus usuarios para aumentar la retención.',
      },
    ],
    faqs: [
      {
        question: '¿Cuánto tiempo toma desarrollar una app móvil?',
        answer:
          'Depende del alcance del proyecto, pero generalmente los proyectos básicos tardan entre 1 y 2 meses, mientras que los más complejos pueden tomar más tiempo.',
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
      {
        question:
          '¿Pueden ayudarme a publicar la app en App Store y Google Play?',
        answer:
          'Sí, nos encargamos de todo el proceso de publicación y te asesoramos para cumplir con todos los requisitos.',
      },
      {
        question: '¿Qué tipo de apps desarrollan?',
        answer:
          'Desarrollamos apps nativas para iOS y Android, así como híbridas con tecnologías como Flutter o React Native.',
      },
      {
        question: '¿El diseño de la app será personalizado?',
        answer:
          'Sí, cada diseño es creado a medida para reflejar la identidad visual y experiencia deseada por tu marca.',
      },
    ],
    cta: {
      text: 'Solicita una consultoría gratuita para tu app',
      link: '/contacto',
    },
    extraBlocks: [
      {
        type: 'intro',
        content: `<section class=\"overflow-hidden bg-white py-24 sm:py-32\">
          <div class=\"mx-auto max-w-7xl px-4 lg:px-8 content-center\">
            <div class=\"mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2\">
              <div class=\"lg:pt-4 lg:pr-8\">
                <div class=\"lg:max-w-lg\">
                  <h2 class=\"text-base/7 font-semibold text-[#E51F52]\">Beneficios Clave</h2>
                  <p class=\"mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl\">¿Por qué el Desarrollo de Apps Móviles es Tan Genial?</p>
                  <p class=\"mt-6 text-lg/8 text-gray-600\">Llega a tus clientes donde quiera que estén con una app móvil atractiva y funcional.</p>
                </div>
              </div>
              <img src=\"https://res.cloudinary.com/dkb9jfet8/image/upload/v1740099869/app-movil_kimh1c.png\" alt=\"Desarrollo de Apps Móviles\" class=\"w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0\" width=\"2432\" height=\"1442\" loading=\"lazy\" />
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
      image: '/icons/odoo.png',
      alt: 'Icono de Odoo ERP',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1753238925/SPI_homepage_zspy5z.png',
      alt: 'Odoo ERP - Interfaz de Usuario',
    },
    benefits: [
      {
        title: 'Control Total del Negocio',
        description:
          'Gestiona desde ventas hasta contabilidad en un solo sistema centralizado.',
      },
      {
        title: 'Flujos de Trabajo Inteligentes',
        description: 'Automatiza procesos clave y elimina tareas repetitivas.',
      },
      {
        title: 'Acceso Remoto Seguro',
        description:
          'Gestiona tu empresa desde cualquier lugar con seguridad garantizada.',
      },
      {
        title: 'Escalabilidad Modular',
        description: 'Agrega funcionalidades cuando tu empresa lo necesite.',
      },
      {
        title: 'Informes en Tiempo Real',
        description:
          'Toma decisiones informadas con datos actualizados y visualizaciones claras.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: 'Implementación de Odoo paso a paso',
      description:
        'Nuestro enfoque garantiza una implementación eficiente y personalizada de Odoo ERP. Así lo hacemos:',
      steps: [
        {
          title: 'Configuración Inicial',
          description:
            'Detectamos necesidades clave y definimos los módulos a integrar y configurar.',
        },
        {
          title: 'Personalización',
          description:
            'Adaptamos flujos, campos y vistas para alinearse con tus procesos.',
        },
        {
          title: 'Capacitación',
          description:
            'Entrenamos a tu equipo para que saque el máximo provecho del sistema.',
        },
        {
          title: 'Soporte Continuo',
          description:
            'Monitoreamos y damos asistencia para asegurar que todo funcione sin fricciones.',
        },
      ],
    },
    features: [
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>',
        title: 'Gestión Financiera',
        description:
          'Automatización contable, facturación electrónica y reportes fiscales.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>',
        title: 'CRM y Ventas',
        description:
          'Gestiona oportunidades, clientes y automatiza tu proceso comercial.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>',
        title: 'Inventario y Compras',
        description:
          'Controla tu stock, automatiza pedidos y optimiza almacenes.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>',
        title: 'Recursos Humanos',
        description:
          'Administra personal, nómina, ausencias y desempeño desde un solo lugar.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>',
        title: 'Marketing Automatizado',
        description:
          'Lanza campañas por correo, SMS o redes desde un solo panel.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>',
        title: 'Reportes Personalizados',
        description:
          'Visualiza KPIs con dashboards personalizados y reportes dinámicos.',
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
      {
        question: '¿Odoo es escalable para empresas en crecimiento?',
        answer:
          'Sí, puedes empezar con los módulos básicos y añadir más a medida que tu negocio crece.',
      },
      {
        question: '¿Se puede acceder a Odoo desde dispositivos móviles?',
        answer: 'Sí, Odoo cuenta con apps móviles para Android y iOS.',
      },
      {
        question: '¿Cuánto tiempo tarda la implementación?',
        answer:
          'Depende del tamaño y complejidad del proyecto, pero por lo general de 4 a 8 semanas.',
      },
      {
        question: '¿Qué tipo de soporte ofrecen?',
        answer:
          'Brindamos soporte técnico continuo y mantenimiento personalizado.',
      },
      {
        question: '¿Qué tan seguro es Odoo?',
        answer:
          'Muy seguro. Aplicamos configuraciones avanzadas de seguridad y respaldos automáticos.',
      },
    ],
    cta: {
      text: 'Solicita una consultoría gratuita de Odoo',
      link: '/contacto',
    },
    extraBlocks: [
      {
        type: 'intro',
        content:
          '<section class="overflow-hidden bg-white py-24 sm:py-32">\n        <div class="mx-auto max-w-7xl px-4 lg:px-8 content-center">\n          <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">\n            <div class="lg:pt-4 lg:pr-8">\n              <div class="lg:max-w-lg">\n                <h2 class="text-base/7 font-semibold text-[#E51F52]">Beneficios Clave</h2>\n                <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">¿Por qué Odoo ERP es Tan Genial?</p>\n                <p class="mt-6 text-lg/8 text-gray-600">Implementamos y personalizamos Odoo ERP para optimizar la gestión integral de tu empresa.</p>\n              </div>\n            </div>\n            <img src="https://res.cloudinary.com/dkb9jfet8/image/upload/v1753238925/SPI_homepage_zspy5z.png" alt="Odoo ERP" class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" loading="lazy" />\n          </div>\n        </div>\n      </section>',
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
      image: '/icons/optimization.png',
      alt: 'Icono de Optimización y Conversión',
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1753242378/optimizacin-de-sitios-web_wwaagb.jpg',
      alt: 'Optimización y Conversión - Gráfico',
    },
    benefits: [
      {
        title: 'Mejor Experiencia de Usuario',
        description:
          'Diseñamos sitios que no solo se ven bien, sino que guían al usuario de forma natural hacia la conversión.',
      },
      {
        title: 'Mayor Velocidad de Carga',
        description:
          'Reducimos el tiempo de carga de tu sitio para evitar abandonos innecesarios.',
      },
      {
        title: 'Elementos Persuasivos',
        description:
          'Incluimos llamados a la acción efectivos y diseño centrado en conversiones.',
      },
      {
        title: 'Pruebas A/B',
        description:
          'Testeamos diferentes versiones de tu sitio para identificar qué funciona mejor.',
      },
      {
        title: 'Adaptabilidad Mobile',
        description:
          'Optimizamos tu web para dispositivos móviles, donde ocurre gran parte del tráfico.',
      },
    ],
    howItWorks: {
      title: '¿Cómo Funciona?',
      subtitle: 'Convertimos clics en clientes.',
      description:
        'Analizamos tu embudo de conversión, identificamos puntos críticos y aplicamos mejoras medibles para convertir más visitantes en clientes.',
      steps: [
        {
          title: 'Auditoría UX y Analítica',
          description:
            'Revisamos el comportamiento del usuario en tu sitio para encontrar fricciones.',
        },
        {
          title: 'Hipótesis de Mejora',
          description:
            'Proponemos cambios basados en datos, no en suposiciones.',
        },
        {
          title: 'Implementación',
          description:
            'Aplicamos ajustes técnicos, de contenido y diseño que impacten la conversión.',
        },
        {
          title: 'Pruebas y Optimización Continua',
          description:
            'No nos detenemos en lanzar: medimos, analizamos y mejoramos constantemente.',
        },
      ],
    },
    features: [
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>',
        title: 'Heatmaps y Grabaciones',
        description:
          'Visualiza cómo navegan los usuarios en tu sitio para tomar decisiones informadas.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>',
        title: 'Optimización de Formularios',
        description:
          'Simplificamos y mejoramos tus formularios para aumentar el envío de leads.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>',
        title: 'CRO con IA',
        description:
          'Usamos inteligencia artificial para identificar patrones y recomendar mejoras.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>',
        title: 'Integración con CRM y Email Marketing',
        description:
          'Alineamos tu web con tus herramientas de venta para cerrar más negocios.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 14v7m0 0-3-3m3 3 3-3" /></svg>',
        title: 'Análisis de Funnel',
        description:
          'Detectamos dónde abandonan los usuarios para optimizar cada paso.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>',
        title: 'Monitoreo en Tiempo Real',
        description:
          'Detectamos bloqueos en la experiencia del usuario mientras ocurren.',
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
      {
        question: '¿Qué tipo de pruebas realizan?',
        answer:
          'Realizamos pruebas A/B, heatmaps, test de formularios y monitoreo de comportamiento.',
      },
      {
        question: '¿Cuánto tiempo tarda en verse resultados?',
        answer:
          'Depende del sitio, pero los primeros indicadores suelen aparecer en semanas.',
      },
      {
        question: '¿Pueden trabajar con mi plataforma actual?',
        answer:
          'Sí, trabajamos con Shopify, WordPress, Webflow, Magento, entre otras.',
      },
      {
        question: '¿Puedo mantener el diseño actual?',
        answer: 'Sí, optimizamos sin perder la identidad visual de tu marca.',
      },
      {
        question: '¿Es necesario instalar herramientas adicionales?',
        answer:
          'Solo si se requieren funciones como heatmaps o test A/B. Te asesoramos según el caso.',
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
              <img src="https://res.cloudinary.com/dkb9jfet8/image/upload/v1753242378/optimizacin-de-sitios-web_wwaagb.jpg" alt="Optimización y Conversión" class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" loading="lazy" />
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
      image: '/icons/automation.png',
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
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9Z" /></svg>',
        title: 'Procesos Administrativos',
        description:
          'Automatiza tareas como facturación, gestión de inventarios y reportes.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>',
        title: 'Atención al Cliente',
        description:
          'Responde consultas frecuentes, gestiona tickets y mejora la experiencia del usuario.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 12v-8m0 0-3 3m3-3 3 3" /></svg>',
        title: 'Integración de Sistemas',
        description:
          'Conecta tus plataformas y herramientas para un flujo de trabajo sin fricciones.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><circle cx="12" cy="7" r="4" /></svg>',
        title: 'Alertas y Monitoreo',
        description:
          'Recibe notificaciones automáticas y monitorea procesos en tiempo real.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 14v7m0 0-3-3m3 3 3-3" /></svg>',
        title: 'Análisis Predictivo',
        description:
          'Utiliza IA para anticipar comportamientos y optimizar procesos antes de que ocurran cuellos de botella.',
      },
      {
        icon: '<svg class="size-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>',
        title: 'Automatización Multicanal',
        description:
          'Sincroniza interacciones por email, redes sociales, formularios web y más desde un solo sistema automatizado.',
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
      {
        question: '¿La automatización es segura para mis datos?',
        answer:
          'Sí. Aplicamos estrictos protocolos de seguridad y cifrado en cada integración para proteger tu información.',
      },
      {
        question: '¿La automatización se adapta a mi sector?',
        answer:
          'Sí. Hemos trabajado con sectores como salud, retail, educación, servicios financieros y más.',
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
