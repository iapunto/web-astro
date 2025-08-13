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

// Configurar impersonación del usuario de Google Workspace (requerido para Google Meet)
if (import.meta.env.GOOGLE_WORKSPACE_USER) {
  console.log(
    '🔐 Configurada impersonación para:',
    import.meta.env.GOOGLE_WORKSPACE_USER
  );
} else {
  console.warn(
    '⚠️ GOOGLE_WORKSPACE_USER no configurado. Google Meet puede no funcionar.'
  );
}

const calendar = google.calendar({ version: 'v3', auth });

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');

    if (!eventId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Se requiere el ID del evento',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('🔍 Obteniendo información del evento:', eventId);

    const response = await calendar.events.get({
      calendarId: 'primary',
      eventId: eventId,
    });

    const event = response.data;

    if (!event) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Evento no encontrado',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Extraer información relevante del evento
    const eventInfo = {
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start,
      end: event.end,
      attendees: event.attendees || [],
      conferenceData: event.conferenceData,
      htmlLink: event.htmlLink,
      created: event.created,
      updated: event.updated,
      status: event.status,
      organizer: event.organizer,
    };

    console.log('✅ Información del evento obtenida:', {
      id: eventInfo.id,
      summary: eventInfo.summary,
      attendeesCount: eventInfo.attendees.length,
      hasConference: !!eventInfo.conferenceData,
    });

    return new Response(
      JSON.stringify({
        success: true,
        event: eventInfo,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error al obtener información del evento:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error al obtener información del evento',
        details: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
