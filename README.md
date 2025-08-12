# IA Punto - Sitio Web

Sitio web oficial de IA Punto, una empresa especializada en desarrollo web, inteligencia artificial y soluciones digitales.

## 🚀 Características

- **Diseño Moderno**: Interfaz limpia y profesional
- **Sistema de Agendamiento**: Integración completa con Google Calendar API
- **Blog Integrado**: Sistema de gestión de contenido
- **Formularios Interactivos**: Validación en tiempo real
- **SEO Optimizado**: Meta tags y estructura semántica
- **Responsive Design**: Compatible con todos los dispositivos

## 📅 Sistema de Agendamiento

### Implementación Google Calendar API

El sistema utiliza Google Calendar API para Node.js siguiendo la [guía oficial de Google](https://developers.google.com/workspace/calendar/api/quickstart/nodejs).

#### Características del Sistema de Citas:

- ✅ **Autenticación con Service Account** (recomendado para producción)
- ✅ **Creación automática de eventos** en Google Calendar
- ✅ **Integración con Google Meet** para videoconferencias
- ✅ **Verificación de disponibilidad** en tiempo real
- ✅ **Notificaciones automáticas** por email
- ✅ **Gestión de slots disponibles** (9 AM - 6 PM)
- ✅ **Validación completa** de datos de entrada
- ✅ **Manejo de errores** robusto

#### Endpoints Disponibles:

- `POST /api/calendar/book` - Crear una nueva cita
- `GET /api/calendar/availability?date=YYYY-MM-DD` - Consultar disponibilidad
- `GET /api/calendar/test` - Verificar configuración

## 🛠️ Tecnologías

- **Framework**: [Astro](https://astro.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Calendar API**: [Google Calendar API](https://developers.google.com/calendar)
- **Deployment**: [Railway](https://railway.app/)
- **CMS**: [Strapi](https://strapi.io/)

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- npm o pnpm
- Cuenta de Google Cloud
- Proyecto configurado en Google Cloud Console

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/web-iapunto.git
   cd web-iapunto
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp env.google-calendar.example .env
   ```

   Editar `.env` con tus credenciales de Google Calendar:

   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----"
   GOOGLE_CALENDAR_ID=primary
   TIMEZONE=America/Bogota
   ```

4. **Configurar Google Calendar**

   Sigue la guía completa en [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md)

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🔧 Configuración de Google Calendar

### Pasos Rápidos:

1. **Crear proyecto en Google Cloud Console**
2. **Habilitar Google Calendar API**
3. **Crear Service Account**
4. **Descargar credenciales JSON**
5. **Compartir calendario con Service Account**
6. **Configurar variables de entorno**

Para instrucciones detalladas, consulta [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md).

## 🧪 Pruebas

### Verificar Configuración

```bash
# Probar configuración de Google Calendar
curl http://localhost:4321/api/calendar/test
```

### Probar Agendamiento

```bash
# Consultar disponibilidad
curl "http://localhost:4321/api/calendar/availability?date=2025-01-15"

# Crear cita (ejemplo)
curl -X POST http://localhost:4321/api/calendar/book \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "startTime": "2025-01-15T09:00:00.000Z",
    "endTime": "2025-01-15T10:00:00.000Z",
    "description": "Consulta sobre desarrollo web",
    "meetingType": "Desarrollo Web"
  }'
```

## 📁 Estructura del Proyecto

```
web-iapunto/
├── src/
│   ├── components/          # Componentes de Astro
│   ├── layouts/            # Layouts de páginas
│   ├── pages/              # Páginas y endpoints API
│   │   └── api/
│   │       └── calendar/    # Endpoints de Google Calendar
│   ├── styles/             # Estilos CSS
│   └── content/            # Contenido del blog
├── public/                 # Archivos estáticos
│   └── scripts/           # JavaScript del frontend
├── docs/                  # Documentación
└── README.md              # Este archivo
```

## 🚀 Deployment

### Railway (Recomendado)

1. **Conectar repositorio** a Railway
2. **Configurar variables de entorno** en Railway dashboard
3. **Deploy automático** en cada push a main

### Variables de Entorno en Producción

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----"
GOOGLE_CALENDAR_ID=primary
TIMEZONE=America/Bogota
APP_URL=https://iapunto.com
```

## 🔍 Monitoreo

### Logs Recomendados

- **Tasa de éxito** de creación de citas
- **Tiempo de respuesta** de endpoints
- **Errores de autenticación** de Google Calendar
- **Uso de slots** disponibles vs ocupados

### Alertas

Configurar alertas para:

- Errores 500 en endpoints de calendar
- Fallos de autenticación con Google Calendar
- Tasa de éxito < 95%

## 🐛 Solución de Problemas

### Errores Comunes

1. **"You need to have writer access to this calendar"**
   - Solución: Compartir el calendario con el Service Account

2. **"Invalid credentials"**
   - Solución: Verificar GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY

3. **"Calendar not found"**
   - Solución: Verificar GOOGLE_CALENDAR_ID

### Logs de Debug

Todos los endpoints incluyen logs detallados. Revisa la consola del servidor para información de debug.

## 📚 Documentación

- [Configuración Google Calendar](./GOOGLE_CALENDAR_SETUP.md)
- [Análisis de Sugerencias](./ANALISIS_SUGERENCIAS_ACTUALIZADO.md)
- [Plan Centro Diagnóstico Digital](./PLAN_CENTRO_DIAGNOSTICO_DIGITAL_IA.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Website**: [https://iapunto.com](https://iapunto.com)
- **Email**: hola@iapunto.com
- **LinkedIn**: [IA Punto](https://www.linkedin.com/company/ia-punto)

---

**Desarrollado con ❤️ por el equipo de IA Punto**
