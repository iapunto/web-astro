import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    console.log('🔍 ===== DEBUG ENVIRONMENT VARIABLES =====');
    
    // Verificar variables de entorno críticas
    const envVars = {
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ SET' : '❌ NOT SET',
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? '✅ SET' : '❌ NOT SET',
      GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID ? '✅ SET' : '❌ NOT SET',
      TIMEZONE: process.env.TIMEZONE || 'America/Mexico_City',
      RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ SET' : '❌ NOT SET',
    };
    
    console.log('📋 Environment variables status:', envVars);
    
    // Verificar formato de las variables
    const privateKeyLength = process.env.GOOGLE_PRIVATE_KEY?.length || 0;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    
    console.log('📏 Private key length:', privateKeyLength);
    console.log('📅 Calendar ID:', calendarId);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Environment variables check completed',
        envVars,
        privateKeyLength,
        calendarId,
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
