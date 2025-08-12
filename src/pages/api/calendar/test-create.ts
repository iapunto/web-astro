import type { APIRoute } from 'astro';
import { getGoogleCalendarService } from '../../../lib/services/googleCalendar.js';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 ===== TEST CALENDAR CONFIGURATION =====');

    const calendarService = getGoogleCalendarService();

    // Probar conexión
    console.log('🔍 Testing calendar connection...');
    const connectionTest = await calendarService.testConnection();
    console.log('✅ Connection test result:', connectionTest);

    // Crear evento de prueba
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const endTime = new Date(tomorrow);
    endTime.setHours(11, 0, 0, 0);

    const testAppointment = {
      name: 'Test User',
      email: 'sl.rondon.m@gmail.com',
      startTime: tomorrow,
      endTime: endTime,
      description: 'Evento de prueba para verificar configuración',
      meetingType: 'Prueba',
    };

    console.log('📝 Creating test appointment...');
    console.log('📅 Test appointment data:', {
      startTime: testAppointment.startTime.toISOString(),
      endTime: testAppointment.endTime.toISOString(),
      calendarId: process.env.GOOGLE_CALENDAR_ID,
    });

    const createdEvent =
      await calendarService.createAppointment(testAppointment);

    console.log('✅ Test event created successfully:', createdEvent.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test completed successfully',
        eventId: createdEvent.id,
        eventDetails: createdEvent,
        connectionTest: connectionTest,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ Test failed:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : 'No stack trace',
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
