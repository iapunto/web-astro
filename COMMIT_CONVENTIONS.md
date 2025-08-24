# Convenciones de Commits

Este proyecto utiliza [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) para mantener un historial de cambios claro y generar automáticamente el changelog.

## Formato

```
<tipo>[alcance opcional]: <descripción>

[cuerpo opcional]

[nota(s) al pie opcional(es)]
```

## Tipos de Commits

### Principales

- **feat**: Nueva funcionalidad para el usuario
- **fix**: Corrección de bug para el usuario
- **docs**: Cambios en documentación
- **style**: Cambios de formato (espacios, comas, etc; sin cambios de código)
- **refactor**: Cambio de código que no agrega funcionalidad ni corrige bugs
- **perf**: Cambio de código que mejora el rendimiento
- **test**: Agregar tests faltantes o corregir tests existentes
- **chore**: Cambios en el proceso de build o herramientas auxiliares

### Específicos del Proyecto

- **gem**: Cambios en el sistema de generación de artículos (GEM 1-5)
- **calendar**: Cambios en el sistema de Google Calendar
- **db**: Cambios en esquemas o queries de base de datos
- **api**: Cambios en endpoints o APIs
- **script**: Cambios en scripts de automatización
- **deploy**: Cambios relacionados con despliegue

## Alcances Sugeridos

- **gem1**, **gem2**, **gem3**, **gem4**, **gem5**: Etapas específicas del sistema GEM
- **calendar**: Sistema de agendamiento
- **auth**: Autenticación y autorización
- **db**: Base de datos
- **api**: APIs y endpoints
- **ui**: Interfaz de usuario
- **config**: Configuración
- **deps**: Dependencias
- **scripts**: Scripts de automatización
- **docs**: Documentación
- **test**: Tests

## Ejemplos

```bash
# Nueva funcionalidad
feat(gem3): agregar validación de contenido en redacción automática

# Corrección de bug
fix(calendar): corregir error de permisos en OAuth2

# Refactorización
refactor(gem): simplificar flujo de 5 a 3 etapas

# Documentación
docs(api): actualizar documentación de endpoints de calendar

# Configuración
chore(config): actualizar variables de entorno para producción

# Script
script(monitor): optimizar script de monitoreo de artículos

# Base de datos
db(schema): agregar índices para mejorar performance

# Breaking change
feat(gem)!: simplificar arquitectura GEM a 3 etapas

BREAKING CHANGE: El sistema GEM ahora utiliza 3 etapas en lugar de 5.
Los scripts existentes que dependían de gem4_result y gem5_result
necesitan ser actualizados.
```

## Reglas

1. **Usar minúsculas** en tipo y alcance
2. **No usar punto final** en la descripción
3. **Usar modo imperativo** ("agregar" no "agregado")
4. **Máximo 72 caracteres** en la primera línea
5. **Describir QUÉ y POR QUÉ**, no cómo
6. **Incluir issue/ticket** si aplica: `fixes #123`

## Breaking Changes

Para cambios que rompen compatibilidad:

- Agregar `!` después del tipo/alcance: `feat(gem)!:`
- Incluir `BREAKING CHANGE:` en el footer

## Automatización

Los commits que sigan esta convención permitirán:

- Generación automática de CHANGELOG.md
- Versionado semántico automático
- Mejor trazabilidad de cambios
- Integración con herramientas de CI/CD
