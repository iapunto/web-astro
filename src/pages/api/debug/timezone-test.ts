import type { APIRoute } from 'astro';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const GET: APIRoute = async () => {
  try {
    const timezone = process.env.TIMEZONE || 'America/Bogota';
    const businessHoursStart = process.env.BUSINESS_HOURS_START || '09:00';
    const businessHoursEnd = process.env.BUSINESS_HOURS_END || '18:00';

    // Parsear horarios
    const startHour = parseInt(businessHoursStart.split(':')[0]);
    const endHour = parseInt(businessHoursEnd.split(':')[0]);

    // Fecha de prueba (14 de agosto de 2025)
    const testDate = '2025-08-14';

    // Generar horarios de prueba
    const timeSlots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const time = new Date(
        `${testDate}T${hour.toString().padStart(2, '0')}:00:00`
      );
      time.setMinutes(0, 0, 0);

      // Formatear hora en español
      const formattedHour =
        hour < 12
          ? `${hour.toString().padStart(2, '0')}:00 a. m.`
          : hour === 12
            ? '12:00 p. m.'
            : `${(hour - 12).toString().padStart(2, '0')}:00 p. m.`;

      timeSlots.push({
        hour: hour,
        time: time.toISOString(),
        localTime: time.toLocaleString('es-CO', { timeZone: timezone }),
        formatted: formattedHour,
      });
    }

    // Información de zona horaria
    const timezoneInfo = {
      configured: timezone,
      currentTime: new Date().toISOString(),
      currentTimeLocal: new Date().toLocaleString('es-CO', {
        timeZone: timezone,
      }),
      offset: new Date().toLocaleString('es-CO', {
        timeZone: timezone,
        timeZoneName: 'short',
      }),
      businessHours: {
        start: businessHoursStart,
        end: businessHoursEnd,
        startHour: startHour,
        endHour: endHour,
      },
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Timezone and time slots test',
        timezone: timezoneInfo,
        timeSlots: timeSlots,
        testDate: testDate,
        totalSlots: timeSlots.length,
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
    return new Response(
      JSON.stringify({
        error: 'Timezone test error',
        message: error instanceof Error ? error.message : 'Unknown error',
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
