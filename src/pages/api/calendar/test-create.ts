import type { APIRoute } from 'astro';
import { getGoogleCalendarService } from '../../../lib/services/googleCalendar.ts';

export const GET: APIRoute = async () => {
  try {
    const calendarService = getGoogleCalendarService();

    // Crear una cita de prueba para mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0); // 10:00 AM

    const testAppointment = {
      name: 'Cliente de Prueba',
      email: 'test@example.com',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000), // +1 hora
      description:
        'Cita de prueba para verificar integración con Google Calendar',
      meetingType: 'Prueba del Sistema',
    };

    console.log('🧪 Creating test appointment...');
    const result = await calendarService.createAppointment(testAppointment);

    return new Response(
      JSON.stringify(
        {
          success: true,
          message: 'Cita de prueba creada exitosamente',
          appointment: {
            id: result.id,
            summary: result.summary,
            start: result.start,
            end: result.end,
            meetLink: result.meetLink,
          },
          serviceType: calendarService.constructor.name,
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ Error creating test appointment:', error);

    return new Response(
      JSON.stringify(
        {
          success: false,
          error: 'Error al crear cita de prueba',
          details: error instanceof Error ? error.message : 'Error desconocido',
          serviceType: getGoogleCalendarService().constructor.name,
        },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
