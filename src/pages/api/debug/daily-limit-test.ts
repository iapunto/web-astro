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
          error: 'Fecha requerida'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
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
      timeZone: timezone
    });

    const events = eventsResponse.data.items || [];
    const totalEvents = events.length;
    const hasReachedLimit = totalEvents >= 3;

    // Verificar si es fin de semana
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dayOfWeek];

    // Verificar si es fecha pasada
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = dateObj < today;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test de límite diario de reuniones',
        date: date,
        dayName: dayName,
        timezone: timezone,
        calendarId: calendarId,
        rules: {
          maxMeetingsPerDay: 3,
          excludeWeekends: true,
          excludePastDates: true,
          excludeLunch: '12:00 PM - 1:00 PM'
        },
        dayStatus: {
          isWeekend: isWeekend,
          isPast: isPast,
          totalEvents: totalEvents,
          hasReachedLimit: hasReachedLimit,
          canSchedule: !isWeekend && !isPast && !hasReachedLimit
        },
        events: events.map(event => ({
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          description: event.description
        })),
        summary: {
          totalEvents: totalEvents,
          limit: 3,
          remainingSlots: Math.max(0, 3 - totalEvents),
          status: hasReachedLimit ? 'LÍMITE ALCANZADO' : 
                  isWeekend ? 'FIN DE SEMANA' :
                  isPast ? 'FECHA PASADA' : 'DISPONIBLE'
        },
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error en test de límite diario',
        message: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
