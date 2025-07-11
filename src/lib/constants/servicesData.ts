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
  extraBlocks?: Array<{
    type: string;
    content: string;
  }>;
  faqSubtitle?: string;
  faqDescription?: string;
}
