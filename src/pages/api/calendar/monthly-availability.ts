import type { APIRoute } from 'astro';
import { PostgresAppointmentManager } from '../../../lib/appointment/postgresAppointmentManager.js';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface DayAvailability {
  date: string;
  available: boolean;
  availableSlots: string[];
  totalSlots: number;
  hasReachedLimit: boolean;
  isWeekend: boolean;
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const year = parseInt(url.searchParams.get('year') || '');
    const month = parseInt(url.searchParams.get('month') || '');

    if (!year || !month) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Año y mes requeridos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('🚀 ===== ENDPOINT DE DISPONIBILIDAD MENSUAL INICIADO =====');
    console.log('📝 Datos de la solicitud:', { year, month });

    const daysInMonth = new Date(year, month, 0).getDate();
    const availability: DayAvailability[] = [];

    // Usar el nuevo método optimizado
    let appointmentManager: PostgresAppointmentManager | null = null;
    try {
      appointmentManager = new PostgresAppointmentManager();
      const result = await appointmentManager.getMonthlyAvailability(year, month);
      availability.push(...result.availability);
    } catch (error) {
      console.error('Error usando método optimizado, usando fallback:', error);
      
      // Fallback: procesar día por día
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Verificar si es fecha pasada
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPastDate = dateObj < today;

        if (isPastDate || isWeekend) {
          availability.push({
            date,
            available: false,
            availableSlots: [],
            totalSlots: 0,
            hasReachedLimit: false,
            isWeekend,
          });
          continue;
        }

        // Lógica por defecto: horario de 9:00 a 17:00, excluyendo 12:00
        const availableSlots: string[] = [];
        for (let hour = 9; hour < 17; hour++) {
          if (hour === 12) continue; // Excluir hora de almuerzo
          availableSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }

        availability.push({
          date,
          available: availableSlots.length > 0,
          availableSlots,
          totalSlots: availableSlots.length,
          hasReachedLimit: false,
          isWeekend: false,
        });
      }
    }

    const availableDays = availability.filter((day) => day.available).length;
    console.log(
      '✅ Disponibilidad mensual obtenida:',
      availableDays,
      'días con disponibilidad'
    );

    return new Response(
      JSON.stringify({
        success: true,
        year,
        month,
        availability,
        summary: {
          totalDays: daysInMonth,
          availableDays,
          unavailableDays: daysInMonth - availableDays,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error en disponibilidad mensual:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { year, month } = body;

    if (!year || !month) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Año y mes requeridos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('🚀 ===== ENDPOINT DE DISPONIBILIDAD MENSUAL INICIADO =====');
    console.log('📝 Datos de la solicitud:', { year, month });

    const appointmentManager = new PostgresAppointmentManager();
    const daysInMonth = new Date(year, month, 0).getDate();
    const availability: DayAvailability[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Verificar si es fecha pasada
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPastDate = dateObj < today;

      if (isPastDate) {
        availability.push({
          date,
          available: false,
          availableSlots: [],
          totalSlots: 0,
          hasReachedLimit: false,
          isWeekend: false,
        });
        continue;
      }

      if (isWeekend) {
        availability.push({
          date,
          available: false,
          availableSlots: [],
          totalSlots: 0,
          hasReachedLimit: false,
          isWeekend: true,
        });
        continue;
      }

      const availableSlots =
        await appointmentManager.getAvailabilityForDate(date);
      const hasReachedLimit = availableSlots.length === 0;

      availability.push({
        date,
        available: availableSlots.length > 0,
        availableSlots,
        totalSlots: availableSlots.length,
        hasReachedLimit,
        isWeekend: false,
      });
    }

    const availableDays = availability.filter((day) => day.available).length;
    console.log(
      '✅ Disponibilidad mensual obtenida:',
      availableDays,
      'días con disponibilidad'
    );

    return new Response(
      JSON.stringify({
        success: true,
        year,
        month,
        availability,
        summary: {
          totalDays: daysInMonth,
          availableDays,
          unavailableDays: daysInMonth - availableDays,
        },
        timezone: process.env.TIMEZONE || 'America/Bogota',
        businessHours: {
          start: process.env.BUSINESS_HOURS_START || '09:00',
          end: process.env.BUSINESS_HOURS_END || '17:00',
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error en endpoint de disponibilidad mensual:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error obteniendo disponibilidad mensual',
        message: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
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
