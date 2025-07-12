# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

# Despliegue en Coolify

## Requisitos

- Tener una instancia de Coolify configurada en tu servidor propio.
- Tener Docker instalado (Coolify lo usa internamente).

## Variables de entorno

- SITE_URL: la URL pública de tu sitio (ejemplo: <https://tusitio.com>)

## Pasos básicos

1. Elimina cualquier referencia a Vercel en el proyecto (ya realizado).
2. Si tu proyecto no tiene un Dockerfile, Coolify puede detectar automáticamente proyectos Astro y usar el comando de build estándar.
3. Sube el repositorio a tu instancia de Coolify y selecciona el tipo de proyecto Astro.
4. Configura la variable de entorno SITE_URL en el panel de Coolify.
5. Despliega la aplicación.

## Notas

- Si necesitas personalizar el build, puedes agregar un Dockerfile propio.
- Para builds estándar, Coolify ejecuta `npm install` y `npm run build` automáticamente.

---

# web-iapunto
