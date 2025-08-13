import type { APIRoute } from 'astro';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const GET: APIRoute = async () => {
  try {
    const timezone = process.env.TIMEZONE || 'America/Bogota';
    const businessHoursStart = process.env.BUSINESS_HOURS_START || '09:00';
    const businessHoursEnd = process.env.BUSINESS_HOURS_END || '17:00';
    
    // Parsear horarios
    const startHour = parseInt(businessHoursStart.split(':')[0]);
    const endHour = parseInt(businessHoursEnd.split(':')[0]);
    
    // Fechas de prueba
    const testDates = [
      '2025-08-14', // Jueves (día laboral)
      '2025-08-15', // Viernes (día laboral)
      '2025-08-16', // Sábado (fin de semana)
      '2025-08-17', // Domingo (fin de semana)
      '2025-08-18'  // Lunes (día laboral)
    ];
    
    const results = testDates.map(testDate => {
      const dateObj = new Date(testDate);
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dayOfWeek];
      
      // Generar horarios de prueba
      const timeSlots = [];
      if (!isWeekend) {
        for (let hour = startHour; hour < endHour; hour++) {
          // Excluir hora de almuerzo (12:00 PM - 1:00 PM)
          if (hour === 12) {
            continue;
          }
          
          const time = new Date(`${testDate}T${hour.toString().padStart(2, '0')}:00:00`);
          time.setMinutes(0, 0, 0);
          
          // Formatear hora en español
          const formattedHour = hour < 12 ? `${hour.toString().padStart(2, '0')}:00 a. m.` : 
                               hour === 12 ? '12:00 p. m.' :
                               `${(hour - 12).toString().padStart(2, '0')}:00 p. m.`;
          
          timeSlots.push({
            hour: hour,
            time: time.toISOString(),
            localTime: time.toLocaleString('es-CO', { timeZone: timezone }),
            formatted: formattedHour
          });
        }
      }
      
      return {
        date: testDate,
        dayName: dayName,
        isWeekend: isWeekend,
        timeSlots: timeSlots,
        totalSlots: timeSlots.length
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Business hours test with new rules',
        timezone: timezone,
        businessHours: {
          start: businessHoursStart,
          end: businessHoursEnd,
          startHour: startHour,
          endHour: endHour
        },
        rules: {
          excludeLunch: '12:00 PM - 1:00 PM (hora de almuerzo)',
          excludeWeekends: 'Sábados y domingos',
          lastAppointment: '4:00 PM - 5:00 PM (última cita)'
        },
        testResults: results,
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
        error: 'Business hours test error',
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
