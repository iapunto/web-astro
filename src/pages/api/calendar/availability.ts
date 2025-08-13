import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface AvailabilityRequest {
  date: string; // YYYY-MM-DD
}

interface TimeSlot {
  time: string; // ISO string
  formatted: string; // Formato legible
  available: boolean;
}

class AvailabilityService {
  private calendar: any;
  private calendarId: string;
  private timezone: string;

  constructor() {
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.timezone = process.env.TIMEZONE || 'America/Bogota';
    
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

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async getAvailabilityForDate(date: string): Promise<TimeSlot[]> {
    try {
      console.log(`🔍 Verificando disponibilidad para: ${date}`);

      // Generar horarios base
      const timeSlots = this.generateBaseTimeSlots(date);
      console.log(`📅 Horarios base generados: ${timeSlots.length}`);
      
      // Verificar conflictos en Google Calendar
      const busySlots = await this.getBusySlots(date);
      console.log(`📅 Slots ocupados encontrados: ${busySlots.length}`);
      console.log(`📅 Detalles de slots ocupados:`, busySlots);
      
      // Marcar slots como disponibles/no disponibles
      const availableSlots = timeSlots.map(slot => {
        const isBusy = this.isSlotBusy(slot.time, busySlots);
        console.log(`🕐 ${slot.formatted}: ${isBusy ? 'OCUPADO' : 'DISPONIBLE'}`);
        return {
          ...slot,
          available: !isBusy
        };
      });

      const availableCount = availableSlots.filter(s => s.available).length;
      console.log(`✅ Disponibilidad verificada: ${availableCount}/${availableSlots.length} horarios disponibles`);
      console.log(`📋 Horarios disponibles:`, availableSlots.filter(s => s.available).map(s => s.formatted));

      return availableSlots;
    } catch (error) {
      console.error('❌ Error verificando disponibilidad:', error);
      throw error;
    }
  }

  private generateBaseTimeSlots(date: string): TimeSlot[] {
    const slots: TimeSlot[] = [];
    // Horarios específicos según la imagen de Google Calendar
    const timeSlots = [
      { hour: 9, label: '09:00 a. m.' },
      { hour: 10, label: '10:00 a. m.' },
      { hour: 11, label: '11:00 a. m.' },
      { hour: 12, label: '12:00 p. m.' },
      { hour: 13, label: '01:00 p. m.' },
      { hour: 14, label: '02:00 p. m.' },
      { hour: 15, label: '03:00 p. m.' },
      { hour: 16, label: '04:00 p. m.' }
    ];
    
    for (const slot of timeSlots) {
      const time = new Date(`${date}T${slot.hour.toString().padStart(2, '0')}:00:00`);
      time.setMinutes(0, 0, 0);
      
      slots.push({
        time: time.toISOString(),
        formatted: slot.label,
        available: true
      });
    }
    
    return slots;
  }

  private async getBusySlots(date: string): Promise<any[]> {
    try {
      const startOfDay = new Date(`${date}T00:00:00`);
      const endOfDay = new Date(`${date}T23:59:59`);

      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          items: [{ id: this.calendarId }],
          timeZone: this.timezone,
        },
      });

      const calendarData = response.data.calendars?.[this.calendarId];
      return calendarData?.busy || [];
    } catch (error) {
      console.error('Error obteniendo horarios ocupados:', error);
      return [];
    }
  }

  private isSlotBusy(slotTime: string, busySlots: any[]): boolean {
    const slotStart = new Date(slotTime);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // +1 hora

    console.log(`🔍 Verificando slot: ${slotStart.toISOString()} - ${slotEnd.toISOString()}`);

    return busySlots.some(busySlot => {
      const busyStart = new Date(busySlot.start);
      const busyEnd = new Date(busySlot.end);
      
      // Verificar si hay conflicto (superposición significativa)
      // Un slot se considera ocupado si hay más del 50% de superposición
      const overlapStart = Math.max(slotStart.getTime(), busyStart.getTime());
      const overlapEnd = Math.min(slotEnd.getTime(), busyEnd.getTime());
      const overlapDuration = overlapEnd - overlapStart;
      const slotDuration = slotEnd.getTime() - slotStart.getTime();
      
      const hasConflict = overlapDuration > (slotDuration * 0.5); // Más del 50% de superposición
      
      if (hasConflict) {
        console.log(`❌ Conflicto detectado: ${busyStart.toISOString()} - ${busyEnd.toISOString()}`);
        console.log(`📊 Superposición: ${overlapDuration}ms de ${slotDuration}ms (${(overlapDuration/slotDuration*100).toFixed(1)}%)`);
      }
      
      return hasConflict;
    });
  }
}

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 ===== ENDPOINT DE DISPONIBILIDAD INICIADO =====');
  console.log('📥 Solicitud recibida en /api/calendar/availability');

  try {
    console.log('📋 Parseando cuerpo de la solicitud...');
    const body = await request.json();
    console.log('✅ Cuerpo de la solicitud parseado exitosamente');
    console.log('📝 Datos de la solicitud:', JSON.stringify(body, null, 2));

    // Validación de datos requeridos
    const { date } = body as AvailabilityRequest;

    console.log('🔍 Validando campos requeridos...');
    if (!date) {
      console.error('❌ Falta campo requerido: date');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Falta campo requerido: date',
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
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      console.error('❌ Formato de fecha inválido');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de fecha inválido. Use YYYY-MM-DD',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar que la fecha no esté en el pasado
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      console.error('❌ La fecha está en el pasado');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No se puede verificar disponibilidad para fechas pasadas',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('✅ Todas las validaciones pasaron');

    // Crear instancia del servicio de disponibilidad
    console.log('🔍 Creando servicio de disponibilidad...');
    const availabilityService = new AvailabilityService();

    // Obtener disponibilidad para la fecha
    console.log('🚀 Verificando disponibilidad...');
    const timeSlots = await availabilityService.getAvailabilityForDate(date);

    console.log('✅ Disponibilidad verificada exitosamente');
    console.log('📅 Horarios disponibles:', timeSlots.filter(slot => slot.available).length);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Disponibilidad verificada exitosamente',
        date: date,
        timeSlots: timeSlots,
        summary: {
          total: timeSlots.length,
          available: timeSlots.filter(slot => slot.available).length,
          busy: timeSlots.filter(slot => !slot.available).length,
        },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
