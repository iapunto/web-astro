import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const GET: APIRoute = async () => {
  console.log('🔍 ===== VERIFY PERMISSIONS ENDPOINT INICIADO =====');

  try {
    // Verificar variables de entorno
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!serviceAccountEmail || !privateKey || !calendarId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Variables de entorno faltantes',
          missing: {
            serviceAccountEmail: !serviceAccountEmail,
            privateKey: !privateKey,
            calendarId: !calendarId,
          },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Configurar autenticación
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Crear cliente de Calendar
    const calendar = google.calendar({ version: 'v3', auth });

    // Verificar permisos de lectura
    console.log('🔍 Verificando permisos de lectura...');
    let readPermissions = false;
    try {
      const calendarInfo = await calendar.calendars.get({
        calendarId: calendarId,
      });
      readPermissions = true;
      console.log('✅ Permisos de lectura: OK');
    } catch (error) {
      console.log('❌ Permisos de lectura: FALLIDO');
      console.error('Error lectura:', error);
    }

    // Verificar permisos de escritura (intentar crear un evento de prueba)
    console.log('🔍 Verificando permisos de escritura...');
    let writePermissions = false;
    try {
      const testEvent = {
        summary: 'Test Permission Check',
        description: 'Evento de prueba para verificar permisos de escritura',
        start: {
          dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
          timeZone: 'America/Bogota',
        },
        end: {
          dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Mañana + 1 hora
          timeZone: 'America/Bogota',
        },
      };

      const createdEvent = await calendar.events.insert({
        calendarId: calendarId,
        requestBody: testEvent,
      });

      writePermissions = true;
      console.log('✅ Permisos de escritura: OK');

      // Eliminar el evento de prueba
      await calendar.events.delete({
        calendarId: calendarId,
        eventId: createdEvent.data.id!,
      });
      console.log('✅ Evento de prueba eliminado');
    } catch (error) {
      console.log('❌ Permisos de escritura: FALLIDO');
      console.error('Error escritura:', error);
    }

    // Verificar permisos de administración
    console.log('🔍 Verificando permisos de administración...');
    let adminPermissions = false;
    try {
      const acl = await calendar.acl.list({
        calendarId: calendarId,
      });
      adminPermissions = true;
      console.log('✅ Permisos de administración: OK');
    } catch (error) {
      console.log('❌ Permisos de administración: FALLIDO');
      console.error('Error administración:', error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verificación de permisos completada',
        permissions: {
          read: readPermissions,
          write: writePermissions,
          admin: adminPermissions,
        },
        serviceAccount: serviceAccountEmail,
        calendarId: calendarId,
        instructions: {
          readFailed: !readPermissions ? 'El Service Account no puede leer el calendario' : null,
          writeFailed: !writePermissions ? 'El Service Account no puede escribir en el calendario. Necesitas compartir el calendario con permisos de "Make changes and manage sharing"' : null,
          adminFailed: !adminPermissions ? 'El Service Account no tiene permisos de administración' : null,
        },
        nextSteps: !writePermissions ? [
          '1. Ir a Google Calendar',
          '2. Encontrar el calendario: ' + calendarId,
          '3. Hacer clic en los 3 puntos junto al nombre del calendario',
          '4. Seleccionar "Settings and sharing"',
          '5. En "Share with specific people", hacer clic en "+ Add people"',
          '6. Agregar el email: ' + serviceAccountEmail,
          '7. Dar permisos de "Make changes and manage sharing"',
          '8. Hacer clic en "Send"',
        ] : ['Todos los permisos están configurados correctamente'],
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ ===== ERROR EN VERIFY PERMISSIONS ENDPOINT =====');
    console.error('❌ Detalles del error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error verificando permisos',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
