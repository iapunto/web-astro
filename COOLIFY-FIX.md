# 🔧 Fix Rápido para Coolify - Conexión Strapi

## Nombre del contenedor identificado:
```
strapi-z444w048ssc0wks08c8ko8o8
```

## 🎯 SOLUCIÓN INMEDIATA:

### Opción 1: Usar el nombre completo del contenedor

En Coolify, servicio de **Web/Astro**, configura:

```bash
STRAPI_INTERNAL_URL=http://strapi-z444w048ssc0wks08c8ko8o8:1337
```

### Opción 2: Usar el hostname del servicio (más simple)

Coolify asigna hostnames automáticos. Prueba en orden:

```bash
# Prueba 1 - Nombre del servicio
STRAPI_INTERNAL_URL=http://strapi:1337

# Prueba 2 - Nombre completo del contenedor
STRAPI_INTERNAL_URL=http://strapi-z444w048ssc0wks08c8ko8o8:1337

# Prueba 3 - UUID del servicio
STRAPI_INTERNAL_URL=http://z444w048ssc0wks08c8ko8o8:1337
```

### Opción 3: Obtener la IP del contenedor Strapi

SSH a tu servidor:

```bash
# Ver IP del contenedor de Strapi
docker inspect strapi-z444w048ssc0wks08c8ko8o8 | grep IPAddress

# Ejemplo de salida:
# "IPAddress": "172.18.0.5"
```

Luego usa esa IP:
```bash
STRAPI_INTERNAL_URL=http://172.18.0.5:1337
```

### Opción 4: Verificar que ambos estén en la misma red

```bash
# Ver redes del contenedor de Strapi
docker inspect strapi-z444w048ssc0wks08c8ko8o8 | grep -A 10 Networks

# Ver redes del contenedor de Web
docker ps | grep web  # Obtener nombre/ID del contenedor web
docker inspect [container-web] | grep -A 10 Networks

# Deben compartir al menos una red en común
```

## 🧪 PRUEBA MANUAL DE CONECTIVIDAD:

Desde el contenedor de Web, prueba la conexión:

```bash
# Entrar al contenedor de Web/Astro
docker exec -it [container-web-nombre] sh

# Probar conexiones (probar TODAS estas):
wget -O- http://strapi:1337/api/articles
wget -O- http://strapi-z444w048ssc0wks08c8ko8o8:1337/api/articles  
wget -O- http://172.18.0.X:1337/api/articles  # Usar la IP real

# Si alguna funciona, usa esa en STRAPI_INTERNAL_URL
```

## ⚡ SOLUCIÓN RÁPIDA SI NADA FUNCIONA:

Si las redes Docker no cooperan, usa **localhost con port mapping**:

En Coolify, asegúrate de que Strapi exponga el puerto 1337 al host, luego:

```bash
STRAPI_INTERNAL_URL=http://host.docker.internal:1337
# O en Linux:
STRAPI_INTERNAL_URL=http://172.17.0.1:1337
```

---

¿Qué opción quieres que probemos primero? Te recomiendo:
1. Primero intenta Opción 1 (nombre completo del contenedor)
2. Si no funciona, Opción 3 (usar la IP directa)
