import type { APIRoute } from 'astro';
import { getGoogleCalendarService } from '../../../lib/services/googleCalendar.js';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 ===== TEST GOOGLE CALENDAR SETUP =====');
    
    const calendarService = getGoogleCalendarService();
    
    // Verificar configuración
    console.log('📋 Checking Google Calendar configuration...');
    const hasServiceAccountEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;
    const hasCalendarId = !!process.env.GOOGLE_CALENDAR_ID;
    
    console.log(`  - GOOGLE_SERVICE_ACCOUNT_EMAIL: ${hasServiceAccountEmail ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`  - GOOGLE_PRIVATE_KEY: ${hasPrivateKey ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`  - GOOGLE_CALENDAR_ID: ${hasCalendarId ? '✅ SET' : '❌ NOT SET'}`);
    
    if (!hasServiceAccountEmail || !hasPrivateKey || !hasCalendarId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Google Calendar configuration incomplete',
          config: {
            hasServiceAccountEmail,
            hasPrivateKey,
            hasCalendarId
          },
          message: 'Please configure GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_CALENDAR_ID environment variables'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // Verificar conexión
    console.log('🔍 Testing Google Calendar connection...');
    const isConnected = await calendarService.verifyConnection();
    
    if (!isConnected) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to connect to Google Calendar API',
          config: {
            hasServiceAccountEmail,
            hasPrivateKey,
            hasCalendarId
          },
          message: 'Check your Google Calendar credentials and ensure the Service Account has the correct permissions'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // Obtener información del calendario
    console.log('📅 Getting calendar information...');
    const calendarInfo = await calendarService.getCalendarInfo();
    
    // Obtener próximos eventos
    console.log('📋 Getting upcoming events...');
    const upcomingEvents = await calendarService.listUpcomingEvents(5);
    
    // Obtener slots disponibles para mañana
    console.log('🕐 Getting available slots for tomorrow...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const availableSlots = await calendarService.getAvailableSlots(tomorrow);
    
    console.log('✅ Google Calendar setup test completed successfully');
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Google Calendar setup is working correctly',
        config: {
          hasServiceAccountEmail,
          hasPrivateKey,
          hasCalendarId,
          calendarId: process.env.GOOGLE_CALENDAR_ID
        },
        connection: {
          isConnected,
          calendarInfo
        },
        upcomingEvents: {
          count: upcomingEvents.length,
          events: upcomingEvents.map(event => ({
            id: event.id,
            summary: event.summary,
            start: event.start,
            end: event.end,
            hasMeetLink: !!event.meetLink
          }))
        },
        availableSlots: {
          date: tomorrow.toISOString(),
          count: availableSlots.length,
          slots: availableSlots.slice(0, 5) // Solo mostrar los primeros 5 slots
        },
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error) {
    console.error('❌ Google Calendar setup test failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : 'No stack trace',
        timestamp: new Date().toISOString()
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
