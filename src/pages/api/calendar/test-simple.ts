import type { APIRoute } from 'astro';
import { google } from 'googleapis';

// Configuración de autenticación
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: import.meta.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 ===== PRUEBA SIMPLE SIN DOMAIN-WIDE DELEGATION =====');

    const calendarId = import.meta.env.GOOGLE_CALENDAR_ID || 'primary';
    
    // 1. Verificar conexión con Google Calendar
    console.log('1️⃣ Verificando conexión con Google Calendar...');
    const calendarResponse = await calendar.calendars.get({
      calendarId: calendarId,
    });
    
    console.log('✅ Calendario accesible:', calendarResponse.data.summary);

    // 2. Crear evento de prueba SIN attendees
    console.log('2️⃣ Creando evento de prueba sin attendees...');
    const testEvent = {
      summary: '🧪 Prueba Simple - IA Punto',
      description: 'Este es un evento de prueba para verificar la funcionalidad sin Domain-Wide Delegation.\n\nPuede ser eliminado después de la verificación.',
      start: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Mañana + 1 hora
        timeZone: 'America/Bogota',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const eventResponse = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: testEvent,
      sendUpdates: 'none', // No enviar actualizaciones
    });

    const testEventId = eventResponse.data.id;
    console.log('✅ Evento de prueba creado:', testEventId);

    // 3. Intentar agregar un attendee (esto debería fallar sin Domain-Wide Delegation)
    console.log('3️⃣ Intentando agregar attendee (esto puede fallar sin Domain-Wide Delegation)...');
    let attendeeTestResult = 'No probado';
    
    try {
      const updateResponse = await calendar.events.update({
        calendarId: calendarId,
        eventId: testEventId!,
        requestBody: {
          attendees: [
            {
              email: 'test@example.com',
              displayName: 'Usuario de Prueba',
            },
          ],
        },
        sendUpdates: 'none',
      });
      
      attendeeTestResult = '✅ Éxito - Attendee agregado';
      console.log('✅ Attendee agregado exitosamente');
    } catch (attendeeError) {
      attendeeTestResult = `❌ Falló - ${attendeeError instanceof Error ? attendeeError.message : 'Error desconocido'}`;
      console.log('❌ Error agregando attendee:', attendeeError);
    }

    // 4. Eliminar evento de prueba
    console.log('4️⃣ Eliminando evento de prueba...');
    await calendar.events.delete({
      calendarId: calendarId,
      eventId: testEventId!,
    });
    console.log('✅ Evento de prueba eliminado');

    return new Response(JSON.stringify({
      success: true,
      message: 'Prueba simple ejecutada exitosamente',
      timestamp: new Date().toISOString(),
      results: {
        calendar: {
          status: '✅ Funcionando',
          calendarName: calendarResponse.data.summary,
          calendarId: calendarId,
        },
        eventCreation: {
          status: '✅ Funcionando',
          eventId: testEventId,
        },
        attendeeTest: {
          status: attendeeTestResult,
          note: 'Sin Domain-Wide Delegation, agregar attendees puede fallar',
        },
        recommendations: [
          'El sistema funciona correctamente para crear eventos',
          'Para agregar attendees, configure Domain-Wide Delegation o use el sistema manual',
          'Los emails se envían manualmente desde Google Calendar',
        ],
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error en prueba simple:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
      recommendations: [
        'Verifique las credenciales de Google Calendar API',
        'Asegúrese de que las variables de entorno estén configuradas',
        'Revise los logs del servidor para más detalles',
      ],
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
