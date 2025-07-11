// Modelo de datos para servicios dinámicos
export interface ServiceData {
  slug: string;
  title: string;
  hero: {
    title: string;
    description: string;
    image: string;
    alt: string;
  };
  benefits: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  howItWorks: {
    title: string;
    subtitle: string;
    description: string;
    steps: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
  };
  mainImage: {
    url: string;
    alt: string;
  };
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  cta: {
    text: string;
    link: string;
  };
}

export const servicesData: ServiceData[] = [
  {
    slug: 'chatbots-inteligentes',
    title: 'Chatbots Inteligentes',
    hero: {
      title: 'Chatbots Inteligentes que Hablan por Ti',
      description:
        'Automatiza tu atención al cliente, genera leads y dispara la satisfacción con chatbots personalizados que ¡sí que saben conversar!',
      image: '/public/icons/chatbot.png',
      alt: 'Chatbots Inteligentes que Hablan por Ti',
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
        // Aquí irían los pasos del proceso, puedes completarlos según el contenido real
      ],
    },
    mainImage: {
      url: 'https://res.cloudinary.com/dkb9jfet8/image/upload/v1739915869/chatbot-concept_ravyht.png',
      alt: 'Concepto de Chatbot',
    },
    features: [
      // Aquí irían las features específicas, puedes completarlas según el contenido real
    ],
    faqs: [
      // Aquí irían las preguntas frecuentes, puedes completarlas según el contenido real
    ],
    cta: {
      text: 'Solicita tu chatbot personalizado',
      link: '/contacto',
    },
  },
];
