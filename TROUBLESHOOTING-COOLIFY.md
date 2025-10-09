# 🔧 Troubleshooting - Conexión Strapi en Coolify

## Estado Actual
- ✅ Cloudflare proxy DESACTIVADO para strapi.iapunto.com
- ✅ Runtime puede hacer fetch (Google funciona)
- ❌ Aún no conecta a Strapi

## 🔍 DIAGNÓSTICO REQUERIDO

Por favor visita estos endpoints y copia los resultados:

### 1. Test de DNS
```
https://iapunto.com/api/test-dns
```
Copia el JSON completo

### 2. Test de IP directa
```
https://iapunto.com/api/test-direct-ip
```
Copia el JSON completo

### 3. Test desde el servidor (SSH)

Conéctate por SSH al servidor y ejecuta:

```bash
# Ver nombre exacto del contenedor de Astro/Web
docker ps | grep -E 'astro|web|iapunto'

# Entrar al contenedor de Web
docker exec -it [nombre-contenedor-web] sh

# Dentro del contenedor, probar conexiones:

# Test 1: DNS funciona?
nslookup strapi.iapunto.com

# Test 2: Ping a Strapi (si ping está disponible)
ping -c 3 strapi.iapunto.com

# Test 3: Curl directo
curl -I https://strapi.iapunto.com

# Test 4: Curl a la API con token
curl -H "Authorization: Bearer 5fac4193c9c1c74f70d42541071be45f0331b101ab66524a078aa27eb054ec80d6aa98c4650f8d03f48f9e272c64490acc60b3125f9999c3cb3f84b5e54b7e34b6dbc65c08967e0686ecf91a686516a04bc89788cf3d01580f3fc519b32ef21a47628ad4f5a10cc1e688e4af313c970a4239167a7d609b78215699987c2811fa" https://strapi.iapunto.com/api/articles?pagination[pageSize]=1

# Test 5: Curl por IP directa
curl -I https://190.146.4.75 -H "Host: strapi.iapunto.com"

# Test 6: Telnet al puerto (para ver si está abierto)
telnet strapi.iapunto.com 443
# O
nc -zv strapi.iapunto.com 443
```

Copia todos los resultados aquí.

## POSIBLES CAUSAS RESTANTES

### 1. Firewall del servidor bloqueando salida
```bash
# Ver reglas de iptables
sudo iptables -L OUTPUT -v -n

# Ver si hay bloqueo a la IP de Strapi
sudo iptables -L | grep 190.146.4.75
```

### 2. Strapi configurado para rechazar ciertas IPs
Verifica en Strapi:
- Settings → API Tokens → Permisos
- Plugins → Security
- Config de CORS

### 3. DNS aún no propagado
```bash
# Desde tu servidor
dig strapi.iapunto.com
nslookup strapi.iapunto.com

# Debería mostrar: 190.146.4.75
```

### 4. Certificado SSL inválido
```bash
# Verificar certificado
openssl s_client -connect strapi.iapunto.com:443 -servername strapi.iapunto.com
```

## SOLUCIÓN TEMPORAL (mientras diagnosticamos)

Si necesitas que el blog funcione YA, puedo implementar carga desde el cliente (JavaScript en el navegador). 

¿Quieres que active esa solución temporal mientras arreglamos el problema servidor-servidor?

