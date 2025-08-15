# Flujo Optimizado de GEMs para IA Punto

## 🎯 Descripción del Flujo

Este documento describe el flujo optimizado de 4 GEMs especializadas para la creación automática de artículos en IA Punto, siguiendo exactamente la estructura solicitada.

## 🔄 Flujo Visual

```
[Entrada del usuario: Tema general]
       ↓
[ GEM 1 - Planificador de Artículo ]
       ↓
(Salida: título, descripción, secciones[], keyword, palabras totales y por sección)
       ↓
[Bucle: Para cada sección en secciones[]]
       ↓
[ GEM 2 - Investigador de Sección ]
       ↓
(Salida: investigación detallada de esa sección)
       ↓
[Unión de todas las investigaciones]
       ↓
[ GEM 3 - Redactor Final ]
       ↓
[Artículo largo en Markdown listo para publicar]
       ↓
[ GEM 4 - Generador de Frontmatter ]
       ↓
[Artículo MDX completo con frontmatter]
```

## 🤖 Especificación de Cada GEM

### **GEM 1 — Planificador de Artículo**

**Objetivo:** Diseñar la estructura editorial con SEO y extensión definidos.

**Prompt Implementado:**

```
Actúa como estratega de contenidos y experto en marketing digital e inteligencia artificial para empresas.
Recibirás un tema general y debes generar:

1. Un título optimizado para SEO (máx. 60 caracteres, en español, claro y atractivo).
2. Una meta descripción (máx. 160 caracteres).
3. Una palabra clave principal (frase clave SEO de 2-5 palabras).
4. Lista de secciones (mínimo 4, máximo 7), con un breve objetivo para cada una.
5. Extensión total estimada del artículo (entre 1,800 y 2,500 palabras).
6. Extensión estimada por sección (mín. 250 palabras por sección).

Público objetivo: empresarios, directores de marketing y profesionales que buscan soluciones digitales innovadoras.
Estilo: claro, profesional, persuasivo, alineado al manual de marca de IA Punto.

Tema: {{tema}}

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
    }
  ]
}
```

**Salida:** Estructura JSON con título, meta descripción, keyword principal, secciones y extensiones.

---

### **GEM 2 — Investigador de Sección**

**Objetivo:** Profundizar en una sola sección para obtener datos y referencias sólidas.

**Prompt Implementado:**

```
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
Título global: {{titulo_global}}
Palabra clave principal: {{keyword_principal}}
Sección: {{titulo_seccion}}
Objetivo: {{objetivo_seccion}}
Palabras estimadas: {{palabras}}

Responde ÚNICAMENTE en formato JSON válido:
{
  "seccion": "Título de la sección",
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
```

**Ejecución:** Se ejecuta en bucle para cada sección definida por GEM 1.

---

### **GEM 3 — Redactor Final**

**Objetivo:** Convertir la investigación consolidada en un artículo completo y optimizado para SEO.

**Prompt Implementado:**

```
Actúa como redactor senior especializado en marketing digital e inteligencia artificial.
Recibirás la investigación de todas las secciones, junto con la palabra clave principal y las metas de extensión.

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

Datos:
Título: {{titulo}}
Meta descripción: {{meta_descripcion}}
Palabra clave: {{keyword_principal}}
Investigación: {{investigacion_consolidada}}

Responde ÚNICAMENTE con el artículo en formato Markdown, sin JSON ni formato adicional.
```

**Salida:** Artículo completo en formato Markdown.

---

### **GEM 4 — Generador de Frontmatter**

**Objetivo:** Crear frontmatter válido y generar el archivo MDX final.

**Funcionalidad:**

- Analiza el contenido del artículo
- Asigna categoría y subcategoría según taxonomía oficial
- Selecciona tags relevantes (máximo 7)
- Genera slug SEO-friendly
- Crea quote único y memorable
- Valida contra reglas de `categorias_tags_reglas.md`

**Salida:** Archivo MDX completo con frontmatter válido.

## 🔧 Implementación Técnica

### Estructura de Archivos

```
src/lib/services/gemArticleService.ts  # Servicio principal con flujo optimizado
src/lib/database/articleTrackingSchema.ts  # Esquemas de datos
src/lib/services/articlePublisherService.ts  # Publicación de artículos
```

### Flujo de Ejecución

1. **Inicialización:** Crear tracking del artículo
2. **GEM 1:** Planificar estructura y SEO
3. **Bucle GEM 2:** Investigar cada sección individualmente
4. **GEM 3:** Consolidar investigación y redactar artículo
5. **GEM 4:** Generar frontmatter y archivo MDX
6. **Publicación:** Guardar archivo en `/src/content/blog/`

### Logs de Progreso

```
📋 GEM 1: Planificando estructura del artículo...
🔍 GEM 2: Investigando secciones...
   🔍 Investigando: Introducción
   🔍 Investigando: Sección 2
   🔍 Investigando: Sección 3
✍️  GEM 3: Redactando artículo final...
🏷️  GEM 4: Generando frontmatter...
```

## 📊 Ventajas del Flujo Optimizado

### ✅ Beneficios

1. **Especialización Clara:** Cada GEM tiene una función específica y bien definida
2. **Investigación Profunda:** GEM 2 investiga cada sección individualmente
3. **Consistencia:** Formato JSON estandarizado para facilitar el parsing
4. **Escalabilidad:** Fácil agregar más secciones o modificar prompts
5. **Trazabilidad:** Logs detallados del progreso
6. **Validación:** GEM 4 valida contra reglas oficiales

### 🎯 Optimizaciones Implementadas

- **Prompts Específicos:** Cada GEM tiene instrucciones claras y detalladas
- **Formato JSON:** Facilita el parsing y reduce errores
- **Bucle Inteligente:** GEM 2 se ejecuta solo para las secciones necesarias
- **Consolidación:** Toda la investigación se une antes de GEM 3
- **Validación Automática:** GEM 4 verifica reglas de taxonomía

## 🚀 Uso del Sistema

### Comando de Ejecución

```bash
# Crear artículo manualmente
pnpm article:create

# Crear artículo específico
curl -X POST http://localhost:4321/api/articles/create-automatic \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Cómo la IA está transformando el marketing digital para PYMES en 2025",
    "apiKey": "tu_api_key"
  }'
```

### Configuración

El sistema utiliza la configuración de `gem-config.json` para:

- Límites de artículos por día
- Temas predefinidos
- Configuración de modelos
- Reglas de validación

## 📈 Métricas de Rendimiento

- **Tiempo promedio:** 3-5 minutos por artículo completo
- **Calidad SEO:** Puntuación mínima de 70/100
- **Extensión:** 1,800-2,500 palabras por artículo
- **Secciones:** 4-7 secciones por artículo
- **Tags:** Máximo 7 tags relevantes

## 🔮 Próximas Mejoras

1. **Fuentes Reales:** Integrar búsqueda web real en GEM 2
2. **A/B Testing:** Probar diferentes prompts para optimizar resultados
3. **Cache Inteligente:** Guardar respuestas de GEMs para reutilización
4. **Análisis de Sentimiento:** Evaluar tono y estilo del contenido
5. **Optimización de Imágenes:** Generar covers automáticamente

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2025  
**Mantenido por:** Equipo de Desarrollo IA Punto
