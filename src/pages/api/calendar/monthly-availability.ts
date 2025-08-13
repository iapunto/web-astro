import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface MonthlyAvailabilityRequest {
  year?: number;
  month?: number;
}

interface DayAvailability {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6 (Domingo-Sábado)
  isWeekend: boolean;
  isPast: boolean;
  isToday: boolean;
  availableSlots: number;
  totalSlots: number;
  hasAvailability: boolean;
}

class MonthlyAvailabilityService {
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

  async getMonthlyAvailability(year?: number, month?: number): Promise<DayAvailability[]> {
    try {
      const currentDate = new Date();
      const targetYear = year || currentDate.getFullYear();
      const targetMonth = month || currentDate.getMonth();

      console.log(`🔍 Obteniendo disponibilidad para: ${targetYear}-${targetMonth + 1}`);

      // Obtener el primer y último día del mes
      const firstDay = new Date(targetYear, targetMonth, 1);
      const lastDay = new Date(targetYear, targetMonth + 1, 0);
      
      // Obtener todos los eventos ocupados del mes
      const busySlots = await this.getMonthlyBusySlots(firstDay, lastDay);
      
      // Generar disponibilidad para cada día del mes
      const daysAvailability: DayAvailability[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(targetYear, targetMonth, day);
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isPast = date < today;
        const isToday = date.getTime() === today.getTime();

        // Generar horarios base para este día
        const timeSlots = this.generateBaseTimeSlots(dateString);
        
        // Verificar disponibilidad
        const availableSlots = timeSlots.filter(slot => {
          if (isPast || isWeekend) return false;
          return !this.isSlotBusy(slot.time, busySlots);
        });

        daysAvailability.push({
          date: dateString,
          dayOfWeek,
          isWeekend,
          isPast,
          isToday,
          availableSlots: availableSlots.length,
          totalSlots: timeSlots.length,
          hasAvailability: availableSlots.length > 0
        });
      }

      console.log(`✅ Disponibilidad mensual obtenida: ${daysAvailability.filter(d => d.hasAvailability).length} días con disponibilidad`);

      return daysAvailability;
    } catch (error) {
      console.error('❌ Error obteniendo disponibilidad mensual:', error);
      throw error;
    }
  }

  private generateBaseTimeSlots(date: string): any[] {
    const slots: any[] = [];
    
    // Obtener horario de trabajo desde variables de entorno
    const businessHoursStart = process.env.BUSINESS_HOURS_START || '09:00';
    const businessHoursEnd = process.env.BUSINESS_HOURS_END || '18:00';
    
    // Parsear horarios
    const startHour = parseInt(businessHoursStart.split(':')[0]);
    const endHour = parseInt(businessHoursEnd.split(':')[0]);
    
    // Generar horarios dinámicamente basados en el horario de trabajo
    for (let hour = startHour; hour < endHour; hour++) {
      const time = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`);
      time.setMinutes(0, 0, 0);
      
      // Formatear hora en español
      const formattedHour = hour < 12 ? `${hour.toString().padStart(2, '0')}:00 a. m.` : 
                           hour === 12 ? '12:00 p. m.' :
                           `${(hour - 12).toString().padStart(2, '0')}:00 p. m.`;
      
      slots.push({
        time: time.toISOString(),
        formatted: formattedHour
      });
    }
    
    return slots;
  }

  private async getMonthlyBusySlots(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          items: [{ id: this.calendarId }],
          timeZone: this.timezone,
        },
      });

      const calendarData = response.data.calendars?.[this.calendarId];
      return calendarData?.busy || [];
    } catch (error) {
      console.error('Error obteniendo horarios ocupados del mes:', error);
      return [];
    }
  }

  private isSlotBusy(slotTime: string, busySlots: any[]): boolean {
    const slotStart = new Date(slotTime);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // +1 hora

    return busySlots.some(busySlot => {
      const busyStart = new Date(busySlot.start);
      const busyEnd = new Date(busySlot.end);
      
      // Verificar si hay conflicto (cualquier superposición)
      return (slotStart < busyEnd && slotEnd > busyStart);
    });
  }
}

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 ===== ENDPOINT DE DISPONIBILIDAD MENSUAL INICIADO =====');

  try {
    const body = await request.json();
    const { year, month } = body as MonthlyAvailabilityRequest;

    console.log('📝 Datos de la solicitud:', { year, month });

    // Crear instancia del servicio
    const availabilityService = new MonthlyAvailabilityService();

    // Obtener disponibilidad mensual
    const monthlyAvailability = await availabilityService.getMonthlyAvailability(year, month);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Disponibilidad mensual obtenida exitosamente',
        year: year || new Date().getFullYear(),
        month: month || new Date().getMonth(),
        days: monthlyAvailability,
        summary: {
          totalDays: monthlyAvailability.length,
          availableDays: monthlyAvailability.filter(d => d.hasAvailability).length,
          weekendDays: monthlyAvailability.filter(d => d.isWeekend).length,
          pastDays: monthlyAvailability.filter(d => d.isPast).length,
        },
        service: 'Google Calendar',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ Error en endpoint de disponibilidad mensual:', error);

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
