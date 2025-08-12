import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const GET: APIRoute = async () => {
  console.log('🔍 ===== DEBUG ENDPOINT INICIADO =====');

  try {
    // Verificar variables de entorno
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    console.log('📋 Variables de entorno:', {
      hasServiceAccountEmail: !!serviceAccountEmail,
      hasPrivateKey: !!privateKey,
      hasCalendarId: !!calendarId,
      serviceAccountEmail: serviceAccountEmail,
      calendarId: calendarId,
    });

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

    // Intentar obtener información del calendario
    console.log('🔍 Intentando obtener información del calendario...');
    let calendarInfo = null;
    let calendarError = null;
    
    try {
      const response = await calendar.calendars.get({
        calendarId: calendarId,
      });
      calendarInfo = response.data;
      console.log('✅ Información del calendario obtenida:', calendarInfo);
    } catch (error) {
      calendarError = error;
      console.log('❌ Error obteniendo información del calendario:', error);
    }

    // Intentar listar eventos
    console.log('🔍 Intentando listar eventos...');
    let events = null;
    let eventsError = null;
    
    try {
      const response = await calendar.events.list({
        calendarId: calendarId,
        maxResults: 5,
        timeMin: new Date().toISOString(),
      });
      events = response.data;
      console.log('✅ Eventos listados:', events);
    } catch (error) {
      eventsError = error;
      console.log('❌ Error listando eventos:', error);
    }

    // Intentar crear un evento de prueba
    console.log('🔍 Intentando crear evento de prueba...');
    let testEvent = null;
    let testEventError = null;
    
    try {
      const eventData = {
        summary: 'Test Event - Debug',
        description: 'Evento de prueba para debug',
        start: {
          dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Bogota',
        },
        end: {
          dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          timeZone: 'America/Bogota',
        },
      };

      const response = await calendar.events.insert({
        calendarId: calendarId,
        requestBody: eventData,
      });
      
      testEvent = response.data;
      console.log('✅ Evento de prueba creado:', testEvent);

      // Eliminar el evento de prueba
      await calendar.events.delete({
        calendarId: calendarId,
        eventId: testEvent.id!,
      });
      console.log('✅ Evento de prueba eliminado');
    } catch (error) {
      testEventError = error;
      console.log('❌ Error creando evento de prueba:', error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Debug completado',
        config: {
          serviceAccountEmail: serviceAccountEmail,
          calendarId: calendarId,
          hasPrivateKey: !!privateKey,
        },
        tests: {
          calendarInfo: {
            success: !!calendarInfo,
            data: calendarInfo,
            error: calendarError ? {
              message: calendarError.message,
              code: calendarError.code,
              status: calendarError.status,
            } : null,
          },
          listEvents: {
            success: !!events,
            data: events,
            error: eventsError ? {
              message: eventsError.message,
              code: eventsError.code,
              status: eventsError.status,
            } : null,
          },
          createEvent: {
            success: !!testEvent,
            data: testEvent,
            error: testEventError ? {
              message: testEventError.message,
              code: testEventError.code,
              status: testEventError.status,
            } : null,
          },
        },
        summary: {
          canRead: !!calendarInfo,
          canListEvents: !!events,
          canCreateEvents: !!testEvent,
          allPermissionsOk: !!(calendarInfo && events && testEvent),
        },
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ ===== ERROR EN DEBUG ENDPOINT =====');
    console.error('❌ Detalles del error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error en debug',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
