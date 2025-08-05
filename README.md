# IA Punto - Sitio Web Oficial

[![CI/CD](https://github.com/iapunto/web-astro/actions/workflows/ci.yml/badge.svg)](https://github.com/iapunto/web-astro/actions/workflows/ci.yml)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-brightgreen?logo=dependabot)](https://github.com/dependabot)
[![License](https://img.shields.io/github/license/iapunto/web-astro?color=blue)](LICENSE)
[![Railway Deploy](https://img.shields.io/badge/deploy-railway-blue?logo=railway)](https://railway.app/)
[![Astro Sec](https://img.shields.io/badge/astro-secure-brightgreen?logo=astro)](https://docs.astro.build/en/guides/security/)

---

Bienvenido al repositorio del **sitio web oficial de IA Punto**.

Este proyecto está desarrollado con [Astro](https://astro.build/) y utiliza tecnologías modernas para ofrecer una experiencia rápida, segura y escalable.

## 🚀 Características principales

- Generación de sitios estáticos y SSR con Astro
- Integración con Tailwind CSS y React
- Despliegue automatizado vía CI/CD en GitHub Actions y Railway
- Seguridad reforzada: dependencias actualizadas automáticamente y buenas prácticas
- Código abierto y transparente

## 🔒 Seguridad y buenas prácticas

- **CI/CD**: Cada push y PR ejecuta pruebas de build y lint automáticamente.
- **Dependabot**: Actualización automática de dependencias para evitar vulnerabilidades.
- **Variables de entorno validadas**: Uso de `env.schema` para proteger la configuración.
- **Licencia**: Código bajo licencia MIT.

## 📦 Instalación local

```bash
pnpm install
pnpm run dev
```

## 🛠️ Scripts útiles

| Comando              | Acción                                 |
|---------------------|----------------------------------------|
| `pnpm install`      | Instala dependencias                   |
| `pnpm run dev`      | Servidor local de desarrollo           |
| `pnpm run build`    | Compila el sitio para producción       |
| `pnpm run preview`  | Previsualiza el sitio compilado        |
| `pnpm run lint`     | Linter de código                       |

## 🚀 Despliegue en Railway

Este proyecto está configurado para desplegar en Railway, una plataforma que permite desplegar tanto la aplicación web como Strapi (CMS) en un solo lugar.

### Configuración Rápida:
1. Conectar el repositorio a Railway
2. Configurar variables de entorno desde `env.railway.example`
3. Railway detectará automáticamente los cambios y despliega
4. Ver `README_DEPLOYMENT.md` para configuración detallada
5. Ver `strapi-railway-setup.md` para configurar Strapi

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

---

© IA Punto - Todos los derechos reservados.
