// src/data/services.ts
import chatbotIcon from "../../assets/icons/chatbot.png";
import webDesignIcon from '../../assets/icons/web-design.png';
import advertisingIcon from '../../assets/icons/ads.png';
import seoIcon from '../../assets/icons/seo.png';
import contentIcon from '../../assets/icons/content.png';
import appDevIcon from '../../assets/icons/app-dev.png';
import odooIcon from '../../assets/icons/odoo.png';
import optimizationIcon from '../../assets/icons/optimization.png';
import automationIcon from '../../assets/icons/automation.png';

export interface Services {
    title: string;
    description: string;
    icon: string;
    alt: string;
    link: string;
    ctaText: string;
}

export const services: Services[] = [
    {
        title: "Chatbots Inteligentes",
        description: "Automatiza la atención al cliente 24/7, genera leads y mejora la satisfacción con chatbots personalizados e IA.",
        icon: "/assets/icons/chatbot.png",
        alt: "Icono de Chatbots Inteligentes",
        link: "/servicios/chatbots-inteligentes",
        ctaText: "Saber más"
    },
    {
        title: "Diseño y Desarrollo Web",
        description: "Creamos sitios web profesionales a medida, enfocados en la conversión y optimizados para UX/UI.",
        icon: '/assets/icons/web-design.png',
        alt: "Icono de Diseño y Desarrollo Web",
        link: "/servicios/diseno-desarrollo-web",
        ctaText: "Ver proyectos"
    },
    {
        title: "Publicidad Online con IA",
        description: "Maximiza tu ROI con campañas publicitarias inteligentes en Google Ads y redes sociales, impulsadas por IA.",
        icon: '/assets/icons/ads.png',
        alt: "Icono de Publicidad Online con IA",
        link: "/servicios/publicidad-online-ia",
        ctaText: "Impulsa tu negocio"
    },
    {
        title: "Posicionamiento SEO",
        description: "Aumenta tu visibilidad orgánica en Google con estrategias SEO On-Page y Off-Page.",
        icon: '/assets/icons/seo.png',
        alt: "Icono de Posicionamiento SEO",
        link: "/servicios/posicionamiento-seo",
        ctaText: "Mejora tu ranking"
    },
    {
        title: "Marketing de Contenidos",
        description: "Creamos contenido optimizado para SEO que atrae a tu audiencia y posiciona tu marca. Usamos IA.",
        icon: '/assets/icons/content.png',
        alt: "Icono de Marketing de Contenidos",
        link: "/servicios/marketing-de-contenidos",
        ctaText: "Atrae más clientes"
    },
    {
        title: "Desarrollo de Apps Móviles",
        description: "Desarrollamos apps móviles nativas e híbridas para iOS y Android con diseño UI/UX intuitivo.",
        icon: '/assets/icons/app-dev.png',
        alt: "Icono de Desarrollo de Apps Móviles",
        link: "/servicios/desarrollo-apps-moviles",
        ctaText: "Desarrolla tu app"
    },
    {
        title: "Odoo ERP",
        description: "Implementamos y personalizamos Odoo ERP para optimizar la gestión integral de tu empresa.",
        icon: '/assets/icons/odoo.png',
        alt: "Icono de Odoo ERP",
        link: "/servicios/odoo-erp",
        ctaText: "Optimiza tu gestión"
    },
    {
        title: "Optimización y Conversión",
        description: "Optimizamos tu sitio web para mejorar el rendimiento, la usabilidad y aumentar las conversiones.",
        icon: '/assets/icons/optimization.png',
        alt: "Icono de Optimización y Conversión",
        link: "/servicios/optimizacion-conversion",
        ctaText: "Aumenta tus ventas"
    },
    {
        title: "Automatización Inteligente",
        description: "Automatizamos flujos de trabajo integrando tus aplicaciones y sistemas para aumentar la eficiencia.",
        icon: '/assets/icons/automation.png',
        alt: "Icono de Automatización Inteligente",
        link: "/servicios/automatizacion-inteligente",
        ctaText: "Automatiza tu empresa"
    },
];