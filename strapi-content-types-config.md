# Configuración de Content Types en Strapi

## 📋 Resumen del Debug

- ✅ **Conexión**: Funcionando correctamente
- ✅ **Categorías**: Configuradas y funcionando
- ✅ **Tags**: Configurados y funcionando
- ❌ **Authors**: Necesita configuración del campo `bio`
- ❌ **Articles**: Necesita configuración del campo `content`

## 🔧 Configuraciones Necesarias

### 1. Content Type: **Author**

#### Campos Requeridos:

```json
{
  "name": "Text (Short)",
  "email": "Email",
  "bio": "Text (Long)", // ← ESTE CAMPO FALTA
  "website": "Text (Short)",
  "twitter": "Text (Short)",
  "linkedIn": "Text (Short)",
  "avatar": "Media (Single)"
}
```

#### Pasos para configurar:

1. Ir a **Content Manager** → **Content Types**
2. Seleccionar **Author**
3. Agregar campo **Text (Long)** con nombre `bio`
4. Guardar

### 2. Content Type: **Article**

#### Campos Requeridos:

```json
{
  "title": "Text (Short)",
  "slug": "UID",
  "content": "Rich Text", // ← ESTE CAMPO FALTA
  "excerpt": "Text (Long)",
  "quote": "Text (Long)",
  "featured": "Boolean",
  "status": "Enumeration (draft, published)",
  "publishedAt": "DateTime",
  "metaTitle": "Text (Short)",
  "metaDescription": "Text (Long)",
  "keywords": "Text (Long)",
  "canonicalURL": "Text (Short)",
  "cover": "Media (Single)",
  "author": "Relation (Many to One) → Author",
  "category": "Relation (Many to One) → Category",
  "tags": "Relation (Many to Many) → Tag"
}
```

#### Pasos para configurar:

1. Ir a **Content Manager** → **Content Types**
2. Seleccionar **Article**
3. Agregar campo **Rich Text** con nombre `content`
4. Guardar

## 🚀 Pasos para Configurar

### Paso 1: Configurar Author

1. Acceder al admin de Strapi: `https://strapi.iapunto.com/admin`
2. Ir a **Content Manager** → **Content Types**
3. Buscar **Author** y hacer clic
4. En la pestaña **Fields**, agregar:
   - **Field Type**: Text (Long)
   - **Field Name**: bio
   - **Description**: Biografía del autor
5. Guardar

### Paso 2: Configurar Article

1. En **Content Manager** → **Content Types**
2. Buscar **Article** y hacer clic
3. En la pestaña **Fields**, agregar:
   - **Field Type**: Rich Text
   - **Field Name**: content
   - **Description**: Contenido del artículo
4. Guardar

### Paso 3: Verificar Permisos

1. Ir a **Settings** → **Users & Permissions Plugin** → **Roles**
2. Seleccionar **Public** o el rol que uses para la API
3. Verificar que tenga permisos de **Create**, **Read**, **Update** para:
   - Articles
   - Categories
   - Tags
   - Authors

## 🔍 Verificación

Después de configurar, ejecutar:

```bash
pnpm tsx src/scripts/debug-strapi.ts
```

Deberías ver:

- ✅ Authors: Creado exitosamente
- ✅ Articles: Creado exitosamente

## 📝 Notas Importantes

1. **Rich Text vs Text**: Para artículos, usa **Rich Text** para el campo `content` ya que permite formato HTML/Markdown
2. **Relaciones**: Asegúrate de que las relaciones estén configuradas correctamente
3. **Permisos**: El API Token debe tener permisos de escritura
4. **Validación**: Strapi validará automáticamente los campos requeridos

## 🎯 Próximos Pasos

Una vez configurados los Content Types:

1. Ejecutar el debug nuevamente para verificar
2. Ejecutar la migración completa: `pnpm tsx src/scripts/migrate-to-strapi.ts`
3. Verificar que los artículos se migren correctamente
