import type { APIRoute } from 'astro';
import CalendlyService from '../../../lib/services/calendlyService.js';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 ===== TEST CALENDLY SETUP =====');
    
    const calendlyService = new CalendlyService();
    
    // Verificar configuración
    console.log('📋 Checking Calendly configuration...');
    const hasApiKey = !!process.env.CALENDLY_API_KEY;
    const hasEventTypeUri = !!process.env.CALENDLY_EVENT_TYPE_URI;
    
    console.log(`  - CALENDLY_API_KEY: ${hasApiKey ? '✅ SET' : '❌ NOT SET'}`);
    console.log(`  - CALENDLY_EVENT_TYPE_URI: ${hasEventTypeUri ? '✅ SET' : '❌ NOT SET'}`);
    
    if (!hasApiKey || !hasEventTypeUri) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Calendly configuration incomplete',
          config: {
            hasApiKey,
            hasEventTypeUri
          },
          message: 'Please configure CALENDLY_API_KEY and CALENDLY_EVENT_TYPE_URI environment variables'
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
    console.log('🔍 Testing Calendly connection...');
    const isConnected = await calendlyService.verifyConnection();
    
    if (!isConnected) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to connect to Calendly API',
          config: {
            hasApiKey,
            hasEventTypeUri
          },
          message: 'Check your CALENDLY_API_KEY and ensure it has the correct permissions'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // Obtener información del usuario
    console.log('👤 Getting user information...');
    const userInfo = await calendlyService.getUserInfo();
    
    // Obtener tipos de eventos
    console.log('📅 Getting event types...');
    const eventTypes = await calendlyService.getEventTypes();
    
    // Obtener slots disponibles para mañana
    console.log('🕐 Getting available slots for tomorrow...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const availableSlots = await calendlyService.getAvailableSlots(tomorrow);
    
    console.log('✅ Calendly setup test completed successfully');
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Calendly setup is working correctly',
        config: {
          hasApiKey,
          hasEventTypeUri,
          eventTypeUri: process.env.CALENDLY_EVENT_TYPE_URI
        },
        connection: {
          isConnected,
          userInfo: userInfo?.resource || null
        },
        eventTypes: {
          count: eventTypes.length,
          types: eventTypes.map(et => ({
            name: et.name,
            uri: et.uri,
            duration: et.duration,
            active: et.active
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
    console.error('❌ Calendly setup test failed:', error);
    
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
