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

- Chatbots Inteligentes para tu Negocio — `/servicios/chatbots-inteligentes` o <https://iapunto.com/servicios/chatbots-inteligentes>
- Diseño y Desarrollo Web Profesional — `/servicios/diseno-desarrollo-web` o <https://iapunto.com/servicios/diseno-desarrollo-web>
- Publicidad Online con IA: Más Clientes, Menos Gasto — `/servicios/publicidad-online-ia` o <https://iapunto.com/servicios/publicidad-online-ia>
- Posicionamiento SEO para Empresas — `/servicios/posicionamiento-seo` o <https://iapunto.com/servicios/posicionamiento-seo>
- Marketing de Contenidos con IA — `/servicios/marketing-de-contenidos` o <https://iapunto.com/servicios/marketing-de-contenidos>
- Desarrollo de Apps Móviles para Empresas — `/servicios/desarrollo-apps-moviles` o <https://iapunto.com/servicios/desarrollo-apps-moviles>
- Odoo ERP: Optimiza tu Gestión Empresarial — `/servicios/odoo-erp` o <https://iapunto.com/servicios/odoo-erp>
- Optimización Web y Conversión (CRO) — `/servicios/optimizacion-conversion` o <https://iapunto.com/servicios/optimizacion-conversion>
- Automatización Inteligente de Procesos — `/servicios/automatizacion-inteligente` o <https://iapunto.com/servicios/automatizacion-inteligente>

**Formato sugerido para citar un servicio:**

> _¿Quieres llevar tu negocio al siguiente nivel? Descubre nuestro servicio de [Chatbots Inteligentes para tu Negocio](/servicios/chatbots-inteligentes) y transforma tu atención al cliente._

**Ejemplo de uso en artículo:**

> _Para mejorar tu posicionamiento en Google, puedes apoyarte en nuestro servicio de [Posicionamiento SEO para Empresas](/servicios/posicionamiento-seo) y atraer más clientes potenciales._

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
tags:
  ['SEO Local', 'Inteligencia Artificial', 'Google', 'PYMES', 'Automatización']
quote: 'Frase única y épica del artículo.'
---
```

## Instrucciones para el campo quote (frase única y épica)

- El campo `quote` debe contener una frase original, memorable y alineada con el mensaje central del artículo.
- Debe ser breve, impactante y fácil de recordar (idealmente entre 8 y 20 palabras).
- Puede ser inspiradora, motivacional, disruptiva o reflexiva, pero siempre relevante para el contenido.
- Evita frases genéricas, clichés o citas de terceros. La frase debe ser propia del autor o del enfoque del artículo.
- El tono debe ser profesional, auténtico y coherente con la voz de IA Punto.
- Puedes usar la primera persona si el artículo es de opinión, o tercera persona para artículos informativos.
- Si el artículo es de un caso de éxito, la frase debe reflejar el logro o aprendizaje principal.

**Ejemplos de quote bien redactados:**

- "El éxito digital no es casualidad: es el resultado de una estrategia coherente y medible."
- "Transformar datos en decisiones es el verdadero poder de la inteligencia artificial."
- "Cada cliente es una oportunidad para crear una experiencia memorable."
- "La innovación comienza cuando te atreves a cuestionar lo establecido."
- "Automatizar es liberar tiempo para lo que realmente importa: crecer."

**Recomendación:**
Si necesitas inspiración, puedes usar herramientas de generación de frases o IA, pero siempre revisa y adapta la frase para que sea única y relevante para tu artículo y audiencia [[fuente](https://instasize.com/tools/quote-generator)][[fuente](https://thestoryshack.com/tools/quote-generator/)].
