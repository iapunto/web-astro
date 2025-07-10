// src/lib/constants/services.ts
import type { ImageMetadata } from 'astro';

import type { ImageMetadata } from 'astro';

export interface Service {
  title: string;
  description: string;
  icon: ImageMetadata; // Ahora es ImageMetadata
  alt: string;
  link: string;
  ctaText: string;
}

export interface ServiceCategory {
  title: string;
  links: Array<{
    href: string;
    text: string;
    description: string;
  }>;
}

// Íconos cargados desde assets/icons
import chatbot from '/public/icons/chatbot.png';
import webDesign from '/public/icons/web-design.png';
import advertising from '/public/icons/ads.png';
import seo from '/public/icons/seo.png';
import content from '/public/icons/content.png';
import appDev from '/public/icons/app-dev.png';
import odoo from '/public/icons/odoo.png';
import optimization from '/public/icons/optimization.png';
import automation from '/public/icons/automation.png';

const ICONS = {
  chatbot,
  webDesign,
  advertising,
  seo,
  content,
  appDev,
  odoo,
  optimization,
  automation,
};

// Datos de los servicios
export const services: Service[] = [
  {
    title: 'Chatbots Inteligentes',
    description:
      'Automatiza la atención al cliente 24/7, genera leads y mejora la satisfacción con chatbots personalizados e IA.',
    icon: ICONS.chatbot,
    alt: 'Icono de Chatbots Inteligentes',
    link: '/servicios/chatbots-inteligentes',
    ctaText: 'Saber más',
  },
  {
    title: 'Diseño y Desarrollo Web',
    description:
      'Creamos sitios web profesionales a medida, enfocados en la conversión y optimizados para UX/UI.',
    icon: ICONS.webDesign,
    alt: 'Icono de Diseño y Desarrollo Web',
    link: '/servicios/diseno-desarrollo-web',
    ctaText: 'Ver proyectos',
  },
  {
    title: 'Publicidad Online con IA',
    description:
      'Maximiza tu ROI con campañas publicitarias inteligentes en Google Ads y redes sociales, impulsadas por IA.',
    icon: ICONS.advertising,
    alt: 'Icono de Publicidad Online con IA',
    link: '/servicios/publicidad-online-ia',
    ctaText: 'Impulsa tu negocio',
  },
  {
    title: 'Posicionamiento SEO',
    description:
      'Aumenta tu visibilidad orgánica en Google con estrategias SEO On-Page y Off-Page.',
    icon: ICONS.seo,
    alt: 'Icono de Posicionamiento SEO',
    link: '/servicios/posicionamiento-seo',
    ctaText: 'Mejora tu ranking',
  },
  {
    title: 'Marketing de Contenidos',
    description:
      'Creamos contenido optimizado para SEO que atrae a tu audiencia y posiciona tu marca. Usamos IA.',
    icon: ICONS.content,
    alt: 'Icono de Marketing de Contenidos',
    link: '/servicios/marketing-de-contenidos',
    ctaText: 'Atrae más clientes',
  },
  {
    title: 'Desarrollo de Apps Móviles',
    description:
      'Desarrollamos apps móviles nativas e híbridas para iOS y Android con diseño UI/UX intuitivo.',
    icon: ICONS.appDev,
    alt: 'Icono de Desarrollo de Apps Móviles',
    link: '/servicios/desarrollo-apps-moviles',
    ctaText: 'Desarrolla tu app',
  },
  {
    title: 'Odoo ERP',
    description:
      'Implementamos y personalizamos Odoo ERP para optimizar la gestión integral de tu empresa.',
    icon: ICONS.odoo,
    alt: 'Icono de Odoo ERP',
    link: '/servicios/odoo-erp',
    ctaText: 'Optimiza tu gestión',
  },
  {
    title: 'Optimización y Conversión',
    description:
      'Optimizamos tu sitio web para mejorar el rendimiento, la usabilidad y aumentar las conversiones.',
    icon: ICONS.optimization,
    alt: 'Icono de Optimización y Conversión',
    link: '/servicios/optimizacion-conversion',
    ctaText: 'Aumenta tus ventas',
  },
  {
    title: 'Automatización Inteligente',
    description:
      'Automatizamos flujos de trabajo integrando tus aplicaciones y sistemas para aumentar la eficiencia.',
    icon: ICONS.automation,
    alt: 'Icono de Automatización Inteligente',
    link: '/servicios/automatizacion-inteligente',
    ctaText: 'Automatiza tu empresa',
  },
];

// Menú de categorías de servicios
export const servicesMenuData: ServiceCategory[] = [
  {
    title: 'DESARROLLO DIGITAL',
    links: [
      {
        href: '/servicios/diseno-desarrollo-web',
        text: 'Desarrollo Web',
        description: 'Diseño y desarrollo web',
      },
      {
        href: '/servicios/desarrollo-apps-moviles',
        text: 'Desarrollo Móvil',
        description: 'Desarrollo de apps móviles',
      },
      {
        href: '/servicios/automatizacion-inteligente',
        text: 'Automatización Inteligente',
        description: 'Automatización de flujos',
      },
    ],
  },
  {
    title: 'MARKETING DIGITAL',
    links: [
      {
        href: '/servicios/posicionamiento-seo',
        text: 'SEO',
        description: 'Posicionamiento en buscadores',
      },
      {
        href: '/servicios/publicidad-online-ia',
        text: 'Publicidad Online con IA',
        description: 'Publicidad online impulsada con IA',
      },
      {
        href: '/servicios/marketing-de-contenidos',
        text: 'Marketing de Contenidos',
        description: 'Marketing de contenidos con IA',
      },
    ],
  },
  {
    title: 'OPTIMIZACIÓN Y GESTIÓN',
    links: [
      {
        href: '/servicios/optimizacion-conversion',
        text: 'CRO',
        description: 'Optimización de conversiones',
      },
      {
        href: '/servicios/chatbots-inteligentes',
        text: 'Chatbots Inteligentes',
        description: 'Chatbots que responden con IA',
      },
      {
        href: '/servicios/odoo-erp',
        text: 'Odoo ERP',
        description: 'Implementación de Odoo',
      },
    ],
  },
];
