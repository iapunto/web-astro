# CHANGELOG

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Sin liberar]

### Agregado

- Informe de análisis completo del proyecto (INFO_QODER.md)
- Configuración de flujo de trabajo Git con GitFlow
- Sistema de versionado semántico
- Plantillas para commits convencionales

### Cambiado

- Estructura de branching para mejor organización del desarrollo

### Corregido

- Configuración inicial del changelog

## [1.0.0] - 2025-01-27

### Agregado

- Sistema de automatización de artículos con IA (GEM 1-5)
- Integración completa con Google Calendar API
- Sistema de agendamiento con OAuth2 y Service Account
- Blog automatizado con Google Gemini
- Integración con Cloudinary para gestión de imágenes
- Sistema de tracking de artículos en PostgreSQL
- 50+ scripts de automatización y monitoreo
- Middleware de seguridad con CSP, HSTS, XSS Protection
- Sistema de notificaciones por email con Resend
- Configuración de despliegue en Railway
- Soporte para múltiples autores y categorías
- Sistema de validación de contenido
- Backup automático de artículos

### Características Técnicas

- Framework: Astro v5.4.2 con renderizado híbrido SSG/SSR
- Frontend: React v19.0.0 + TypeScript v5.8.2
- Estilos: Tailwind CSS v3.4.17 + Flowbite v2.5.2
- Base de datos: PostgreSQL + SQLite + Better-SQLite3
- APIs: Google Calendar, Google Gemini, Cloudinary, Resend
- Contenedores: Docker multi-etapa
- Despliegue: Railway con GitHub Actions
