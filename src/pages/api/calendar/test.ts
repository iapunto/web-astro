import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const GET: APIRoute = async () => {
  console.log('🚀 ===== TEST ENDPOINT INICIADO =====');

  try {
    // Verificar variables de entorno
    const config = {
      hasServiceAccountEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'No configurado',
      timezone: process.env.TIMEZONE || 'No configurado',
    };

    console.log('📋 Configuración:', config);

    if (
      !config.hasServiceAccountEmail ||
      !config.hasPrivateKey ||
      !config.hasCalendarId
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Configuración incompleta',
          message: 'Faltan variables de entorno requeridas',
          config,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Intentar conectar con Google Calendar
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

    console.log('🔍 Intentando conectar con Google Calendar...');

    // Verificar conexión
    const calendarResponse = await calendar.calendars.get({
      calendarId: calendarId,
    });

    console.log('✅ Conexión exitosa con Google Calendar');

    // Obtener información del calendario
    const calendarInfo = {
      id: calendarResponse.data.id,
      summary: calendarResponse.data.summary,
      description: calendarResponse.data.description,
      timeZone: calendarResponse.data.timeZone,
      accessRole: (calendarResponse.data as any).accessRole,
    };

    console.log('📅 Información del calendario:', calendarInfo);

    // Verificar permisos intentando listar eventos
    console.log('🔍 Verificando permisos...');
    const eventsResponse = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const upcomingEvents = eventsResponse.data.items || [];
    console.log(`📅 Eventos próximos encontrados: ${upcomingEvents.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Configuración de Google Calendar verificada correctamente',
        config,
        connection: {
          isConnected: true,
          calendarInfo,
        },
        upcomingEvents: {
          count: upcomingEvents.length,
          events: upcomingEvents.map((event) => ({
            id: event.id,
            summary: event.summary,
            start: event.start,
            end: event.end,
          })),
        },
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ ===== ERROR EN TEST ENDPOINT =====');
    console.error('❌ Detalles del error:', error);
    console.error(
      '❌ Stack del error:',
      error instanceof Error ? error.stack : 'Sin stack trace'
    );

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error verificando configuración',
        details: error instanceof Error ? error.message : 'Error desconocido',
        config: {
          hasServiceAccountEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
          hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
          calendarId: process.env.GOOGLE_CALENDAR_ID || 'No configurado',
        },
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
