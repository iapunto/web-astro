import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const GET: APIRoute = async ({ url }) => {
  console.log('🔍 ===== CHECK EVENT ENDPOINT INICIADO =====');

  try {
    const eventId = url.searchParams.get('eventId');
    
    if (!eventId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Se requiere el parámetro eventId',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Configurar autenticación con Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    console.log(`🔍 Obteniendo detalles del evento: ${eventId}`);

    const response = await calendar.events.get({
      calendarId: calendarId,
      eventId: eventId,
    });

    const event = response.data;
    console.log('✅ Evento obtenido:', event);

    // Extraer enlace de Google Meet
    const meetLink = event.conferenceData?.entryPoints?.find(
      (entry: any) => entry.entryPointType === 'video'
    )?.uri;

    return new Response(
      JSON.stringify({
        success: true,
        event: {
          id: event.id,
          summary: event.summary,
          description: event.description,
          start: event.start,
          end: event.end,
          attendees: event.attendees,
          conferenceData: event.conferenceData,
          meetLink: meetLink,
          htmlLink: event.htmlLink,
        },
        hasMeetLink: !!meetLink,
        hasAttendees: !!(event.attendees && event.attendees.length > 0),
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error obteniendo evento:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error obteniendo evento',
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
