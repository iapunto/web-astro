# Taxonomía oficial de categorías, subcategorías y tags para artículos del blog

## Categorías y Subcategorías

### 1. Inteligencia Artificial

- Aplicaciones Empresariales
- Modelos y Herramientas
- Ética y Regulación
- Tendencias y Opinión
- Seguridad y Privacidad

### 2. Marketing Digital y SEO

- SEO Local
- SEO Programático
- Marketing de Contenidos
- Publicidad Digital
- Analítica y Datos

### 3. Negocios y Tecnología

- Transformación Digital
- Software y Herramientas
- Eficiencia Empresarial
- PYMES y Emprendimiento

### 4. Desarrollo Web

- Automatización Web
- Frontend
- Backend
- Integraciones y APIs

### 5. Automatización y Productividad

- Automatización Empresarial
- No-Code / Low-Code
- Productividad Personal

### 6. Opinión y Tendencias

- Futuro Digital
- Reflexión y Análisis

### 7. Casos de Éxito

- Empresas
- PYMES
- Innovación

### 8. Ciencia y Salud

- Biotecnología
- Salud Digital

### 9. EVAFS

- Frameworks de Estrategia Digital
- Casos de Aplicación
- Metodología y Mejores Prácticas

### 10. Skailan

- Producto SaaS
- Integraciones
- Casos de Uso
- Automatización con Skailan

---

## Servicios oficiales de IA Punto (Referencia para artículos)

Los siguientes servicios pueden ser citados, recomendados o enlazados desde los artículos del blog, según la temática y el enfoque del contenido. Usa el slug o la URL indicada para enlazar correctamente:

- Estrategia Digital con IA — `/servicios/estrategia-digital-ia` o <https://iapunto.com/servicios/estrategia-digital-ia>
- Desarrollo Web Inteligente — `/servicios/desarrollo-web-inteligente` o <https://iapunto.com/servicios/desarrollo-web-inteligente>
- Automatización de Marketing — `/servicios/automatizacion-marketing` o <https://iapunto.com/servicios/automatizacion-marketing>
- SEO Programático — `/servicios/seo-programatico` o <https://iapunto.com/servicios/seo-programatico>
- Publicidad Digital con IA — `/servicios/publicidad-digital-ia` o <https://iapunto.com/servicios/publicidad-digital-ia>
- Analítica y Dashboards Inteligentes — `/servicios/analitica-dashboards` o <https://iapunto.com/servicios/analitica-dashboards>
- Integración de Chatbots y Asistentes Virtuales — `/servicios/chatbots-asistentes` o <https://iapunto.com/servicios/chatbots-asistentes>
- Centralización de Datos y CRM — `/servicios/centralizacion-datos-crm` o <https://iapunto.com/servicios/centralizacion-datos-crm>
- Consultoría en Transformación Digital — `/servicios/consultoria-transformacion-digital` o <https://iapunto.com/servicios/consultoria-transformacion-digital>
- Implementación de EVAFS — `/servicios/evafs` o <https://iapunto.com/servicios/evafs>
- Plataformas SaaS (Skailan) — `/servicios/skailan` o <https://iapunto.com/servicios/skailan>

**Formato sugerido para citar un servicio:**

> _¿Quieres llevar tu negocio al siguiente nivel? Descubre nuestro servicio de [Automatización de Marketing](/servicios/automatizacion-marketing) y transforma tu estrategia digital._

**Ejemplo de uso en artículo:**

> _Para implementar una estrategia de SEO programático, puedes apoyarte en nuestro servicio de [SEO Programático](/servicios/seo-programatico) diseñado para PYMES y empresas en crecimiento._

---

## Lista oficial de tags permitidos

Inteligencia Artificial, Machine Learning, Deep Learning, Modelos de Lenguaje, Chatbots, Automatización, No-Code, Low-Code, SEO, SEO Local, SEO Programático, Marketing Digital, Marketing de Contenidos, Publicidad Digital, Google, Facebook, OpenAI, PYMES, Empresas, Transformación Digital, Innovación, Tendencias, Opinión, Seguridad, Privacidad, Analítica, Datos, Productividad, Herramientas, Software, APIs, Integraciones, Biotecnología, Salud, Ecommerce, Personalización, EVAFS, Skailan, Futuro, Ética IA, Regulación IA, Hardware IA, Data Management, SaaS, Startups, Emprendimiento

---

## Reglas para el frontmatter de artículos

- Todos los artículos deben tener los siguientes campos en el frontmatter:
  - `title`
  - `slug`
  - `pubDate`
  - `description` (extracto o contentSnippet)
  - `cover`
  - `coverAlt`
  - `author` (objeto: `name`, `description`, `image`)
  - `category` (de la lista oficial)
  - `subcategory` (de la lista oficial, si aplica)
  - `tags` (solo de la lista oficial, máximo 7)
  - `quote` (frase única y relevante)
- No se permite crear nuevas categorías, subcategorías ni tags.
- El campo `description` debe ser un resumen atractivo y relevante del artículo.
- El campo `author` debe tener los tres subcampos obligatorios.
- El campo `quote` debe ser único y alineado con el contenido.
- No usar tags redundantes ni sinónimos de la categoría/subcategoría.
- Si el artículo es de opinión, usar la categoría "Opinión y Tendencias" y la subcategoría correspondiente.
- Si el artículo es un caso de éxito, usar la categoría "Casos de Éxito" y la subcategoría correspondiente.
- Si el artículo es sobre herramientas, software o automatización, priorizar las categorías "Negocios y Tecnología", "Automatización y Productividad" o "Desarrollo Web" según el enfoque.

---

## Ejemplo de frontmatter normalizado

```yaml
---
title: 'Cómo la IA Revoluciona el SEO Local en 2025'
slug: 'ia-revoluciona-seo-local-2025'
pubDate: '2025-07-22'
description: 'Extracto o resumen destacado del artículo.'
cover: 'https://...'
coverAlt: 'Descripción de la imagen de portada.'
author:
  name: 'Nombre del autor'
  description: 'Descripción del autor'
  image: 'https://...'
category: 'Marketing Digital y SEO'
subcategory: 'SEO Local'
tags: ['SEO Local', 'Inteligencia Artificial', 'Google', 'PYMES', 'Automatización']
quote: 'Frase única y épica del artículo.'
---
```
