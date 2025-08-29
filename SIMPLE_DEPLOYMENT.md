# 🚀 Despliegue Simple a Coolify

## ✅ Configuración Simplificada

He creado una configuración simple para evitar los problemas con NIXPACKS y `better-sqlite3`.

---

## 📋 Archivos de Configuración Simple

### ✅ Archivos Principales
- `Dockerfile.simple` - Dockerfile básico sin NIXPACKS
- `astro.config.simple.mjs` - Configuración de Astro mínima
- `.dockerignore.simple` - Archivos a ignorar
- `deploy-simple.sh` - Script de despliegue

---

## 🛠️ Configuración en Coolify

### 1. Configurar Aplicación
- **Tipo:** Docker
- **Repositorio:** https://github.com/iapunto/web-astro
- **Branch:** main

### 2. Configurar Dockerfile
- **Dockerfile:** `Dockerfile.simple`
- **Puerto:** 4321

### 3. Variables de Entorno Mínimas
```bash
NODE_ENV=production
PORT=4321
SITE_URL=https://iapunto.com
```

---

## 🔧 Diferencias con la Configuración Anterior

### ❌ Problemas Evitados
- **NIXPACKS:** Eliminado completamente
- **better-sqlite3:** No se usa en configuración simple
- **Python:** No requerido
- **Compilación nativa:** Evitada

### ✅ Configuración Simple
- **Node.js 18 Alpine:** Base ligera
- **pnpm:** Package manager
- **Tailwind CSS:** Solo integración esencial
- **Sin dependencias problemáticas**

---

## 📊 Scripts Disponibles

```bash
# Build simple
pnpm run build:simple

# Start simple
pnpm run start:coolify

# Despliegue automático
./deploy-simple.sh
```

---

## 🚀 Próximos Pasos

1. **En Coolify:**
   - Usar `Dockerfile.simple`
   - Configurar puerto 4321
   - Variables de entorno mínimas

2. **Si funciona:**
   - Agregar más funcionalidades gradualmente
   - Migrar base de datos
   - Configurar dominio

3. **Si hay problemas:**
   - Revisar logs de Coolify
   - Verificar variables de entorno
   - Simplificar aún más si es necesario

---

## 🎯 Objetivo

**Despliegue funcional básico** que luego se puede expandir gradualmente, en lugar de una configuración compleja que falla.

---

**🎉 ¡Configuración simple lista para probar!**
