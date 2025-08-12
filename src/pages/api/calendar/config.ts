import type { APIRoute } from 'astro';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const GET: APIRoute = async () => {
  console.log('🔍 ===== CONFIG ENDPOINT INICIADO =====');

  try {
    // Verificar variables de entorno
    const config = {
      hasServiceAccountEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'No configurado',
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'No configurado',
      timezone: process.env.TIMEZONE || 'No configurado',
    };

    console.log('📋 Configuración:', config);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Configuración de Google Calendar',
        config: {
          hasServiceAccountEmail: config.hasServiceAccountEmail,
          hasPrivateKey: config.hasPrivateKey,
          hasCalendarId: config.hasCalendarId,
          serviceAccountEmail: config.serviceAccountEmail,
          calendarId: config.calendarId,
          timezone: config.timezone,
        },
        instructions: {
          step1: 'Ir a Google Calendar',
          step2: 'Encontrar el calendario: ' + config.calendarId,
          step3: 'Hacer clic en los 3 puntos junto al nombre del calendario',
          step4: 'Seleccionar "Settings and sharing"',
          step5: 'En "Share with specific people", hacer clic en "+ Add people"',
          step6: 'Agregar el email del Service Account: ' + config.serviceAccountEmail,
          step7: 'Dar permisos de "Make changes and manage sharing"',
          step8: 'Hacer clic en "Send"',
        },
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
    console.error('❌ ===== ERROR EN CONFIG ENDPOINT =====');
    console.error('❌ Detalles del error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error obteniendo configuración',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
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
