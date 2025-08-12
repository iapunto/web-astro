import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    console.log('🔍 ===== DEBUG ENVIRONMENT VARIABLES =====');
    
    // Verificar variables de entorno críticas
    const envVars = {
      // Google Calendar
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ SET' : '❌ NOT SET',
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? '✅ SET' : '❌ NOT SET',
      GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID ? '✅ SET' : '❌ NOT SET',
      
      // Calendly
      CALENDLY_API_KEY: process.env.CALENDLY_API_KEY ? '✅ SET' : '❌ NOT SET',
      CALENDLY_EVENT_TYPE_URI: process.env.CALENDLY_EVENT_TYPE_URI ? '✅ SET' : '❌ NOT SET',
      
      // Email
      RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ SET' : '❌ NOT SET',
      
      // General
      TIMEZONE: process.env.TIMEZONE || 'America/Mexico_City',
    };
    
    console.log('📋 Environment variables status:', envVars);
    
    // Verificar formato de las variables
    const privateKeyLength = process.env.GOOGLE_PRIVATE_KEY?.length || 0;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const calendlyApiKeyLength = process.env.CALENDLY_API_KEY?.length || 0;
    const calendlyEventTypeUri = process.env.CALENDLY_EVENT_TYPE_URI;
    
    console.log('📏 Google Private key length:', privateKeyLength);
    console.log('📅 Google Calendar ID:', calendarId);
    console.log('📏 Calendly API key length:', calendlyApiKeyLength);
    console.log('📅 Calendly Event Type URI:', calendlyEventTypeUri);
    
    // Determinar qué servicio está configurado
    const hasGoogleConfig = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    const hasCalendlyConfig = process.env.CALENDLY_API_KEY && process.env.CALENDLY_EVENT_TYPE_URI;
    
    let recommendedService = 'none';
    if (hasCalendlyConfig) {
      recommendedService = 'calendly';
    } else if (hasGoogleConfig) {
      recommendedService = 'google-calendar';
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Environment variables check completed',
        envVars,
        privateKeyLength,
        calendarId,
        calendlyApiKeyLength,
        calendlyEventTypeUri,
        recommendedService,
        hasGoogleConfig,
        hasCalendlyConfig,
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
    console.error('❌ Debug failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
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
