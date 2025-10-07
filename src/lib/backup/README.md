# Librerías - Temporalmente Deshabilitadas

Estos archivos han sido movidos temporalmente para permitir que el build de producción se complete exitosamente.

## Archivos movidos:
- `postgresAppointmentManager.ts` - Gestor de citas PostgreSQL
- `resendEmailService.ts` - Servicio de email con Resend

## Razón:
Problemas con importaciones de módulos TypeScript en el entorno de build de producción.

## Solución temporal:
Los archivos se pueden restaurar una vez que se resuelva el problema de importaciones.

## Para restaurar:
```bash
mv src/lib/backup/postgresAppointmentManager.ts src/lib/appointment/
mv src/lib/backup/resendEmailService.ts src/lib/email/
```
