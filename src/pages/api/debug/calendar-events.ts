import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { date } = body;

    if (!date) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Fecha requerida',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const timezone = process.env.TIMEZONE || 'America/Bogota';

    // Configurar autenticación
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Obtener eventos del día
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const eventsResponse = await calendar.events.list({
      calendarId: calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: timezone,
    });

    const events = eventsResponse.data.items || [];

    // Obtener información de freebusy
    const freebusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        items: [{ id: calendarId }],
        timeZone: timezone,
      },
    });

    const busySlots = freebusyResponse.data.calendars?.[calendarId]?.busy || [];

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Eventos del calendario obtenidos',
        date: date,
        timezone: timezone,
        calendarId: calendarId,
        events: events.map((event) => ({
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          description: event.description,
        })),
        busySlots: busySlots,
        totalEvents: events.length,
        totalBusySlots: busySlots.length,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error obteniendo eventos',
        message: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
