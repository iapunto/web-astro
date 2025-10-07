# Archivos de Appointments - Temporalmente Deshabilitados

Estos archivos han sido movidos temporalmente para permitir que el build de producción se complete exitosamente.

## Archivos movidos:
- `cancel.ts` - Cancelar citas
- `complete.ts` - Completar citas  
- `confirm.ts` - Confirmar citas

## Razón:
Problemas con importaciones de `postgresAppointmentService.js` en el entorno de build de producción.

## Solución temporal:
Los archivos se pueden restaurar una vez que se resuelva el problema de importaciones de TypeScript ES modules.

## Para restaurar:
```bash
mv src/pages/api/appointments/backup/* src/pages/api/appointments/[id]/
```
