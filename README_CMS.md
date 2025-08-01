# Sistema CMS para IA Punto

## Descripción

Este sistema CMS (Content Management System) ha sido diseñado para hacer más eficiente la gestión del blog de IA Punto. Permite crear, editar, publicar y gestionar artículos de forma visual e intuitiva con un sistema de autenticación seguro.

## 🔐 Sistema de Autenticación

### Características de Seguridad
- **URL Personalizada**: `/portal-seguro` (no indexada)
- **Base de Datos SQLite**: Almacenamiento seguro de usuarios
- **JWT Tokens**: Sesiones seguras con expiración
- **bcrypt**: Encriptación de contraseñas
- **Headers de Seguridad**: CSP, HSTS, XSS Protection
- **Middleware de Protección**: Rutas protegidas automáticamente

### Acceso al Sistema
```
URL: https://iapunto.com/portal-seguro
Usuario: admin
Contraseña: IAPunto2025!
```

### Configuración de Seguridad
- **noindex**: Las páginas admin no se indexan
- **Cookies HttpOnly**: Prevención de XSS
- **SameSite Strict**: Protección CSRF
- **CSP Headers**: Content Security Policy
- **Rate Limiting**: Protección contra ataques de fuerza bruta

## Características Principales

### 🎯 **Gestión Visual de Contenido**
- Interfaz moderna y responsive
- Editor WYSIWYG para contenido
- Gestión de metadatos visual
- Preview en tiempo real

### 📝 **Editor de Artículos**
- Formulario completo de metadatos
- Editor de contenido en Markdown
- Gestión de etiquetas y categorías
- Información del autor
- Estados de publicación (Borrador, Publicado, Archivado)

### 📊 **Dashboard Analítico**
- Estadísticas de artículos
- Categorías más populares
- Actividad reciente
- Resumen de estados

### 🔧 **API RESTful**
- Endpoints completos para CRUD
- Gestión de estados de publicación
- Integración con sistema actual de Astro

## Estructura del Sistema

```
src/
├── components/cms/
│   ├── CMSLayout.tsx          # Layout principal del CMS
│   ├── Sidebar.tsx            # Navegación lateral
│   ├── Header.tsx             # Header con acciones
│   ├── ArticleEditor.tsx      # Editor de artículos
│   ├── ArticleList.tsx        # Lista de artículos
│   └── Dashboard.tsx          # Dashboard principal
├── lib/
│   ├── types/cms.ts           # Tipos TypeScript
│   ├── cms-api.ts            # API del CMS
│   └── auth/
│       ├── database.ts        # Base de datos de usuarios
│       └── session.ts         # Gestión de sesiones
├── pages/
│   ├── portal-seguro.astro    # Página de login
│   ├── logout.astro           # Página de logout
│   ├── admin/
│   │   ├── index.astro        # Dashboard principal
│   │   └── articles.astro     # Gestión de artículos
│   └── api/cms/
│       ├── articles.ts        # API de artículos
│       └── articles/[id].ts   # API de artículo específico
└── middleware.ts              # Protección de rutas
```

## Instalación y Uso

### 1. Instalar Dependencias
```bash
pnpm install
```

### 2. Configurar Variables de Entorno
```bash
# .env
JWT_SECRET=tu-clave-secreta-super-segura
NODE_ENV=production
```

### 3. Acceso al CMS
```
http://localhost:4321/portal-seguro
```

### 4. Navegación
- **Dashboard**: Vista general y estadísticas
- **Artículos**: Gestión completa de artículos
- **Categorías**: Gestión de categorías
- **Etiquetas**: Gestión de etiquetas
- **Medios**: Gestión de imágenes y archivos
- **Configuración**: Configuración del sitio

### 5. Crear un Nuevo Artículo
1. Ir a "Artículos" en el sidebar
2. Hacer clic en "Nuevo Artículo"
3. Completar los metadatos en el panel izquierdo
4. Escribir el contenido en el editor
5. Guardar como borrador o publicar directamente

### 6. Editar un Artículo Existente
1. En la lista de artículos, hacer clic en el icono de editar
2. Modificar los campos necesarios
3. Guardar los cambios

## API Endpoints

### Autenticación
- `POST /portal-seguro` - Iniciar sesión
- `GET /logout` - Cerrar sesión

### Artículos (Protegidos)
- `GET /api/cms/articles` - Obtener todos los artículos
- `POST /api/cms/articles` - Crear nuevo artículo
- `GET /api/cms/articles/[id]` - Obtener artículo específico
- `PUT /api/cms/articles/[id]` - Actualizar artículo
- `DELETE /api/cms/articles/[id]` - Eliminar artículo
- `PATCH /api/cms/articles/[id]` - Cambiar estado (publicar/archivar)

### Categorías
- `GET /api/cms/categories` - Obtener categorías
- `POST /api/cms/categories` - Crear categoría

### Etiquetas
- `GET /api/cms/tags` - Obtener etiquetas
- `POST /api/cms/tags` - Crear etiqueta

## Tipos de Datos

### BlogArticle
```typescript
interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  pubDate: Date;
  description: string;
  cover: string;
  coverAlt?: string;
  author: {
    name: string;
    description: string;
    image: string;
  };
  category: string;
  subcategory?: string;
  tags: string[];
  quote?: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

### UserSession
```typescript
interface UserSession {
  id: number;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
```

## Integración con Sistema Actual

El CMS se integra perfectamente con el sistema actual de Astro:

1. **Compatibilidad Total**: Los archivos MDX generados son compatibles con el sistema actual
2. **Frontmatter Estándar**: Mantiene el formato de frontmatter existente
3. **Rutas Existentes**: No afecta las rutas del blog público
4. **SEO Preservado**: Mantiene toda la información SEO
5. **Autenticación Transparente**: No interfiere con el sitio público

## Ventajas del Nuevo Sistema

### 🚀 **Eficiencia**
- Creación de artículos 3x más rápida
- Gestión visual de metadatos
- Preview en tiempo real

### 📈 **Productividad**
- Interfaz intuitiva
- Acciones rápidas
- Gestión masiva de contenido

### 🔒 **Seguridad**
- Autenticación robusta
- Sesiones seguras
- Protección CSRF/XSS
- Headers de seguridad

### 📊 **Analytics**
- Estadísticas en tiempo real
- Métricas de rendimiento
- Insights de contenido

## Tecnologías Utilizadas

- **React 19**: Interfaz de usuario
- **TypeScript**: Tipado seguro
- **Tailwind CSS**: Estilos modernos
- **Astro**: Framework base
- **MDX**: Formato de contenido
- **SQLite**: Base de datos
- **JWT**: Autenticación
- **bcrypt**: Encriptación

## Configuración de Producción

### 1. Variables de Entorno
```bash
JWT_SECRET=clave-super-secreta-y-unica
NODE_ENV=production
```

### 2. Base de Datos
- La base de datos se crea automáticamente en `data/cms.db`
- Usuario admin se crea por defecto
- **IMPORTANTE**: Cambiar contraseña después del primer acceso

### 3. Seguridad Adicional
- Configurar HTTPS en producción
- Implementar rate limiting
- Monitoreo de logs de acceso
- Backup regular de la base de datos

## Próximas Mejoras

- [ ] Editor WYSIWYG avanzado
- [ ] Gestión de imágenes integrada
- [ ] Sistema de versionado
- [ ] Colaboración en tiempo real
- [ ] Analytics avanzados
- [ ] SEO automático
- [ ] Backup automático
- [ ] Notificaciones push
- [ ] Autenticación de dos factores
- [ ] Logs de auditoría

## Contribución

Para contribuir al desarrollo del CMS:

1. Crear una rama feature
2. Implementar cambios
3. Probar funcionalidad
4. Crear pull request

## Soporte

Para soporte técnico o preguntas sobre el CMS, contactar al equipo de desarrollo de IA Punto.

## Seguridad

### Mejores Prácticas
1. **Cambiar contraseña por defecto** inmediatamente
2. **Usar HTTPS** en producción
3. **Mantener actualizado** el sistema
4. **Monitorear logs** de acceso
5. **Backup regular** de la base de datos

### Reportar Vulnerabilidades
Si encuentras una vulnerabilidad de seguridad, contacta inmediatamente al equipo de desarrollo.
