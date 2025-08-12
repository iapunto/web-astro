import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface AvailableSlot {
  start_time: string;
  end_time: string;
  status: 'available' | 'busy';
}

class GoogleCalendarService {
  private calendar: any;
  private calendarId: string;
  private timezone: string;

  constructor() {
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

    this.calendar = google.calendar({ version: 'v3', auth });
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.timezone = process.env.TIMEZONE || 'America/Bogota';
  }

  async verifyConnection(): Promise<boolean> {
    try {
      console.log('🔍 Verificando conexión con Google Calendar...');

      const response = await this.calendar.calendars.get({
        calendarId: this.calendarId,
      });

      if (response.data) {
        console.log('✅ Conexión con Google Calendar verificada');
        console.log(
          '📅 Calendario:',
          response.data.summary || 'Calendario Principal'
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error(
        '❌ Error verificando conexión con Google Calendar:',
        error
      );
      return false;
    }
  }

  async getAvailableSlots(date: Date): Promise<AvailableSlot[]> {
    try {
      console.log('🔍 Obteniendo slots disponibles de Google Calendar...');

      // Convertir fecha a formato ISO
      const startTime = new Date(date);
      startTime.setHours(0, 0, 0, 0);

      const endTime = new Date(date);
      endTime.setHours(23, 59, 59, 999);

      // Obtener eventos existentes para la fecha
      const response = await this.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      console.log(
        `📅 Encontrados ${events.length} eventos existentes para ${date.toDateString()}`
      );

      // Generar slots disponibles (9 AM a 6 PM, cada hora)
      const availableSlots: AvailableSlot[] = [];
      const workStartHour = 9;
      const workEndHour = 18;
      const slotDuration = 60; // minutos

      for (let hour = workStartHour; hour < workEndHour; hour++) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);

        const slotEnd = new Date(
          slotStart.getTime() + slotDuration * 60 * 1000
        );

        // Verificar si el slot está disponible
        const isAvailable = !events.some((event) => {
          const eventStart = new Date(
            event.start?.dateTime || event.start?.date || ''
          );
          const eventEnd = new Date(
            event.end?.dateTime || event.end?.date || ''
          );

          return (
            (slotStart >= eventStart && slotStart < eventEnd) ||
            (slotEnd > eventStart && slotEnd <= eventEnd) ||
            (slotStart <= eventStart && slotEnd >= eventEnd)
          );
        });

        availableSlots.push({
          start_time: slotStart.toISOString(),
          end_time: slotEnd.toISOString(),
          status: isAvailable ? 'available' : 'busy',
        });
      }

      console.log(
        `✅ Encontrados ${availableSlots.filter((slot) => slot.status === 'available').length} slots disponibles`
      );
      return availableSlots;
    } catch (error) {
      console.error('❌ Error obteniendo slots disponibles:', error);
      return [];
    }
  }
}

export const GET: APIRoute = async ({ url }) => {
  console.log('🚀 ===== ENDPOINT DE DISPONIBILIDAD INICIADO =====');
  console.log('📥 Solicitud recibida en /api/calendar/availability');

  try {
    const searchParams = url.searchParams;
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      console.error('❌ Parámetro de fecha faltante');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Parámetro de fecha requerido',
          message: 'Proporciona un parámetro "date" en formato YYYY-MM-DD',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar formato de fecha
    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      console.error('❌ Formato de fecha inválido');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de fecha inválido',
          message: 'La fecha debe estar en formato YYYY-MM-DD',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Verificar que la fecha no esté en el pasado
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (date < now) {
      console.error('❌ La fecha está en el pasado');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Fecha en el pasado',
          message: 'No se pueden consultar fechas pasadas',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log(`📅 Consultando disponibilidad para: ${date.toDateString()}`);

    // Crear instancia del servicio de Google Calendar
    console.log('🔍 Creando servicio de Google Calendar...');
    const calendarService = new GoogleCalendarService();

    // Verificar conexión del servicio
    console.log('🔍 Verificando conexión del servicio...');
    const isConnected = await calendarService.verifyConnection();

    if (!isConnected) {
      console.error('❌ Falló la conexión del servicio');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No se pudo conectar con Google Calendar',
          details: 'Verifica las credenciales de Google Calendar',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('✅ Conexión del servicio verificada');

    // Obtener slots disponibles
    console.log('📅 Obteniendo slots disponibles...');
    const availableSlots = await calendarService.getAvailableSlots(date);

    console.log(
      `✅ Obtenidos ${availableSlots.length} slots para ${date.toDateString()}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        date: dateParam,
        slots: availableSlots,
        totalSlots: availableSlots.length,
        availableSlots: availableSlots.filter(
          (slot) => slot.status === 'available'
        ).length,
        busySlots: availableSlots.filter((slot) => slot.status === 'busy')
          .length,
        service: 'Google Calendar',
        serviceType: 'google-calendar',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ ===== ERROR EN ENDPOINT DE DISPONIBILIDAD =====');
    console.error('❌ Detalles del error:', error);
    console.error(
      '❌ Stack del error:',
      error instanceof Error ? error.stack : 'Sin stack trace'
    );
    console.error('🏁 ===== FIN DEL ENDPOINT DE DISPONIBILIDAD =====');

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
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

// Manejar preflight requests para CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
