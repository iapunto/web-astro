# Esquemas de Strapi para IA Punto

## 1. Content Type: Article (Artículo)

### Campos Básicos:
- **Title** (Text, required): Título del artículo
- **Slug** (UID, required): URL amigable (basado en Title)
- **Content** (Rich Text, required): Contenido del artículo
- **Excerpt** (Text, optional): Resumen del artículo
- **Featured** (Boolean, default: false): Artículo destacado
- **Status** (Enumeration, required):
  - `draft` (Borrador)
  - `published` (Publicado)

### Campos de SEO:
- **Meta Title** (Text, optional): Título para SEO
- **Meta Description** (Text, optional): Descripción para SEO
- **Keywords** (Text, optional): Palabras clave
- **Canonical URL** (Text, optional): URL canónica

### Relaciones:
- **Cover** (Media, single): Imagen de portada
- **Author** (Relation, single): Autor del artículo
- **Category** (Relation, single): Categoría del artículo
- **Tags** (Relation, multiple): Etiquetas del artículo

### Configuración:
- **API ID**: `article`
- **Display name**: `Article`
- **API endpoint**: `/api/articles`

---

## 2. Content Type: Category (Categoría)

### Campos:
- **Name** (Text, required): Nombre de la categoría
- **Slug** (UID, required): URL amigable (basado en Name)
- **Description** (Text, optional): Descripción de la categoría
- **Color** (Text, optional): Color para la categoría (hex)

### Relaciones:
- **Articles** (Relation, multiple): Artículos de esta categoría

### Configuración:
- **API ID**: `category`
- **Display name**: `Category`
- **API endpoint**: `/api/categories`

---

## 3. Content Type: Tag (Etiqueta)

### Campos:
- **Name** (Text, required): Nombre de la etiqueta
- **Slug** (UID, required): URL amigable (basado en Name)
- **Color** (Text, optional): Color para la etiqueta (hex)

### Relaciones:
- **Articles** (Relation, multiple): Artículos con esta etiqueta

### Configuración:
- **API ID**: `tag`
- **Display name**: `Tag`
- **API endpoint**: `/api/tags`

---

## 4. Content Type: Author (Autor)

### Campos:
- **Name** (Text, required): Nombre del autor
- **Email** (Email, required): Email del autor
- **Bio** (Text, optional): Biografía del autor
- **Website** (Text, optional): Sitio web del autor
- **Twitter** (Text, optional): Twitter del autor
- **LinkedIn** (Text, optional): LinkedIn del autor

### Relaciones:
- **Avatar** (Media, single): Foto del autor
- **Articles** (Relation, multiple): Artículos del autor

### Configuración:
- **API ID**: `author`
- **Display name**: `Author`
- **API endpoint**: `/api/authors`

---

## 5. Content Type: Global (Configuración Global)

### Campos:
- **Site Name** (Text, required): Nombre del sitio
- **Site Description** (Text, required): Descripción del sitio
- **Default SEO Title** (Text, required): Título SEO por defecto
- **Default SEO Description** (Text, required): Descripción SEO por defecto
- **Default SEO Keywords** (Text, optional): Palabras clave SEO por defecto

### Relaciones:
- **Favicon** (Media, single): Favicon del sitio
- **Default Share Image** (Media, single): Imagen por defecto para redes sociales

### Configuración:
- **API ID**: `global`
- **Display name**: `Global`
- **API endpoint**: `/api/global`
- **Singleton**: Sí (solo una entrada)

---

## Pasos para Crear los Esquemas:

### 1. Acceder al Panel de Administración:
- Ve a `https://strapi.iapunto.com/admin`
- Inicia sesión con tus credenciales

### 2. Crear Content Types:
1. Ve a **Content-Type Builder**
2. Haz clic en **Create new collection type**
3. Crea cada Content Type siguiendo la estructura anterior

### 3. Configurar Relaciones:
1. En cada Content Type, agrega los campos de relación
2. Configura las relaciones bidireccionales
3. Establece los permisos de acceso

### 4. Configurar Permisos:
1. Ve a **Settings** → **Users & Permissions Plugin** → **Roles**
2. Selecciona **Public** y **Authenticated**
3. Configura los permisos para cada Content Type:
   - **Public**: `find`, `findOne` para lectura
   - **Authenticated**: `create`, `update`, `delete` para administración

### 5. Configurar API Token:
1. Ve a **Settings** → **API Tokens**
2. Crea un nuevo token con permisos de **Full access**
3. Copia el token para usar en el sitio web

### 6. Configurar Variables de Entorno:
En tu sitio web, agrega estas variables:
```env
STRAPI_API_URL=https://strapi.iapunto.com
STRAPI_API_TOKEN=tu_token_aqui
```

---

## Estructura de Datos Esperada:

### Ejemplo de Artículo:
```json
{
  "id": 1,
  "attributes": {
    "title": "El Futuro de la Inteligencia Artificial",
    "slug": "futuro-inteligencia-artificial",
    "content": "<p>Contenido del artículo...</p>",
    "excerpt": "Descripción breve del artículo",
    "featured": true,
    "status": "published",
    "publishedAt": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "cover": {
      "data": {
        "id": 1,
        "attributes": {
          "url": "/uploads/cover_image.jpg",
          "alternativeText": "Imagen de portada"
        }
      }
    },
    "author": {
      "data": {
        "id": 1,
        "attributes": {
          "name": "Sergio Rondón",
          "email": "sergio@iapunto.com"
        }
      }
    },
    "category": {
      "data": {
        "id": 1,
        "attributes": {
          "name": "Tecnología",
          "slug": "tecnologia"
        }
      }
    },
    "tags": {
      "data": [
        {
          "id": 1,
          "attributes": {
            "name": "IA",
            "slug": "ia"
          }
        }
      ]
    }
  }
}
```

---

## Próximos Pasos:

1. **Crear los Content Types** en Strapi
2. **Configurar las relaciones** entre Content Types
3. **Establecer permisos** de acceso
4. **Crear API Token** para el sitio web
5. **Probar la integración** con el endpoint de prueba
6. **Migrar contenido existente** desde MDX a Strapi
7. **Actualizar el sitio web** para usar Strapi en lugar de MDX

¿Ya tienes acceso al panel de administración de Strapi para comenzar a crear los esquemas? 