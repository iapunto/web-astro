# 🐳 Configuración de Strapi + Astro en Coolify

## Problema Identificado

Tu servidor Coolify tiene un **timeout de red** al intentar conectarse a Strapi via URL pública:

```
Error: connect ETIMEDOUT 190.146.4.75:443
```

Esto sucede porque el contenedor de Astro intenta conectarse a `https://strapi.iapunto.com` pero hay problemas de red (firewall, timeout, routing).

## ✅ Solución: URL Interna de Docker

Si Strapi y Astro están en el **mismo servidor de Coolify**, deben comunicarse via **red interna de Docker** en lugar de Internet.

### Paso 1: Identificar el nombre del servicio Strapi

#### Opción A: Desde Coolify Dashboard
1. Ve a tu proyecto en Coolify
2. Busca el servicio/contenedor de Strapi
3. Anota el **Service Name** o **Container Name**

#### Opción B: Desde SSH al servidor
```bash
# Conectar al servidor
ssh usuario@tu-servidor

# Ver todos los contenedores
docker ps

# Buscar Strapi específicamente
docker ps | grep strapi

# Ver el nombre completo
docker inspect [container-id] | grep Name
```

Ejemplo de salida:
```
CONTAINER ID   IMAGE           NAMES
abc123def      strapi:latest   web-iapunto-strapi
```

### Paso 2: Encontrar la red Docker de Coolify

```bash
# Listar redes de Docker
docker network ls

# Inspeccionar la red de Coolify (usualmente tiene "coolify" en el nombre)
docker network inspect coolify-network

# Ver qué contenedores están en esa red
docker network inspect coolify-network | grep Name
```

### Paso 3: Configurar Variables en Coolify

En Coolify Dashboard:

1. Ve a tu servicio de **Astro/Web**
2. Click en **Environment Variables** o **Secrets**
3. Agrega/edita estas variables:

```bash
# URL pública (mantener para referencias externas)
STRAPI_API_URL=https://strapi.iapunto.com

# Token de autenticación
STRAPI_API_TOKEN=5fac4193c9c1c74f70d42541071be45f0331b101ab66524a078aa27eb054ec80d6aa98c4650f8d03f48f9e272c64490acc60b3125f9999c3cb3f84b5e54b7e34b6dbc65c08967e0686ecf91a686516a04bc89788cf3d01580f3fc519b32ef21a47628ad4f5a10cc1e688e4af313c970a4239167a7d609b78215699987c2811fa

# ⭐ NUEVA: URL interna para comunicación entre contenedores
# Usar el nombre del servicio/contenedor de Strapi que encontraste:
STRAPI_INTERNAL_URL=http://web-iapunto-strapi:1337

# Si no funciona, prueba con variaciones:
# STRAPI_INTERNAL_URL=http://strapi:1337
# STRAPI_INTERNAL_URL=http://strapi-cms:1337
# STRAPI_INTERNAL_URL=http://localhost:1337  (si comparten el mismo pod)
```

### Paso 4: Verificar Conectividad (Opcional)

Desde el contenedor de Astro, prueba la conexión:

```bash
# Entrar al contenedor de Astro
docker exec -it [contenedor-astro] sh

# Probar conexión a Strapi por URL pública
curl -I https://strapi.iapunto.com/api/articles

# Probar conexión por URL interna
curl -I http://web-iapunto-strapi:1337/api/articles

# Si alguno funciona, usa esa URL
```

### Paso 5: Redeploy en Coolify

1. Guarda las variables de entorno
2. Redeploy el servicio de Astro en Coolify
3. Espera a que el build y deployment terminen (2-3 minutos)

### Paso 6: Verificar que Funciona

Visita estos URLs en orden:

#### 1. Diagnóstico del sistema
```
https://iapunto.com/api/diagnostics
```

**Busca en el JSON:**
```json
{
  "strapi": {
    "url": "http://web-iapunto-strapi:1337",  // ✅ Debería ser la URL interna
    "token": "PRESENTE (...)",
    "tokenLength": 256
  },
  "test": {
    "canFetch": true,    // ✅ Cambió a true
    "status": 200,       // ✅ Cambió a 200
    "articlesCount": 1,  // ✅ Mayor a 0
    "method": "node-fetch"  // ✅ Método que funcionó
  }
}
```

#### 2. Blog con debug
```
https://iapunto.com/blog?debug
```

**Panel amarillo debe mostrar:**
- ✅ URL: http://web-iapunto-strapi:1337
- ✅ Token: ✓ CONFIGURADO
- ✅ Total: 113 (no 1)
- ✅ Estado: ✓ OK (no ⚠ SOLO MOCK)

#### 3. Blog normal
```
https://iapunto.com/blog
```

Deberías ver **todos los artículos** (113 en total, 19 páginas).

## 🔍 Troubleshooting para Coolify

### Problema: "Connection refused"
**Causa:** Nombre del servicio incorrecto

**Solución:**
```bash
# Ver todos los servicios en la red de Coolify
docker network inspect coolify-network | grep -A 3 "Name"

# Probar diferentes variaciones de nombre
STRAPI_INTERNAL_URL=http://strapi:1337
STRAPI_INTERNAL_URL=http://iapunto-strapi:1337
STRAPI_INTERNAL_URL=http://coolify-strapi:1337
```

### Problema: "ENOTFOUND" o "getaddrinfo"
**Causa:** Los contenedores no están en la misma red Docker

**Solución:**
1. Ve a Coolify → Proyecto → Network Settings
2. Asegúrate de que ambos servicios usen la **misma red**
3. O agrega Astro a la red de Strapi manualmente:

```bash
# Encontrar la red de Strapi
docker inspect [contenedor-strapi] | grep NetworkMode

# Agregar Astro a esa red
docker network connect [red-de-strapi] [contenedor-astro]
```

### Problema: "ETIMEDOUT" persiste
**Causa:** Firewall del servidor bloqueando puertos

**Solución A - Abrir firewall (si controlas el servidor):**
```bash
# Para Ubuntu/Debian con UFW
sudo ufw allow out to 190.146.4.75 port 443

# Para CentOS/RHEL con firewalld
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" destination address="190.146.4.75" port port="443" protocol="tcp" accept'
sudo firewall-cmd --reload
```

**Solución B - Usar proxy interno:**
Si no puedes modificar el firewall, configura un proxy interno en Coolify.

### Problema: Sigue sin funcionar
**Plan B:** Cambiar arquitectura a fetch desde el cliente

Ver sección "Plan B" al final de este documento.

## 📊 Valores Recomendados para Coolify

```bash
# Variables de entorno para Coolify
STRAPI_API_URL=https://strapi.iapunto.com
STRAPI_INTERNAL_URL=http://[NOMBRE-SERVICIO-STRAPI]:1337
STRAPI_API_TOKEN=5fac4193c9c1c74f70d42541071be45f0331b101ab66524a078aa27eb054ec80d6aa98c4650f8d03f48f9e272c64490acc60b3125f9999c3cb3f84b5e54b7e34b6dbc65c08967e0686ecf91a686516a04bc89788cf3d01580f3fc519b32ef21a47628ad4f5a10cc1e688e4af313c970a4239167a7d609b78215699987c2811fa
```

## 🚀 Plan B: Fetch desde Cliente (Si todo falla)

Si la comunicación servidor-servidor no funciona, puedes hacer que el navegador del usuario haga el fetch directamente:

1. Cambiar el blog de SSR a SSG + Client-side fetch
2. El navegador del usuario conecta a Strapi (no el servidor)
3. Funciona siempre pero es menos óptimo para SEO

**¿Quieres que implemente el Plan B?** Solo si la URL interna no funciona.

---

**Última actualización:** Octubre 2025  
**Problema específico:** ETIMEDOUT en Coolify  
**Solución:** URL interna Docker
