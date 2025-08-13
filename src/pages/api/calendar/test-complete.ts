import type { APIRoute } from 'astro';
import { google } from 'googleapis';

// Configuración de autenticación
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: import.meta.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 ===== PRUEBA COMPLETA DEL SISTEMA =====');

    const calendarId = import.meta.env.GOOGLE_CALENDAR_ID || 'primary';
    
    // 1. Verificar conexión con Google Calendar
    console.log('1️⃣ Verificando conexión con Google Calendar...');
    const calendarResponse = await calendar.calendars.get({
      calendarId: calendarId,
    });
    
    console.log('✅ Calendario accesible:', calendarResponse.data.summary);

    // 2. Verificar configuración de email
    console.log('2️⃣ Verificando configuración de email...');
    const emailUser = import.meta.env.EMAIL_USER;
    const emailPassword = import.meta.env.EMAIL_PASSWORD;
    const adminEmail = import.meta.env.ADMIN_EMAIL;

    const emailConfig = {
      emailUser: emailUser ? '✅ Configurado' : '❌ No configurado',
      emailPassword: emailPassword ? '✅ Configurado' : '❌ No configurado',
      adminEmail: adminEmail ? '✅ Configurado' : '❌ No configurado',
    };

    // 3. Verificar variables de entorno
    console.log('3️⃣ Verificando variables de entorno...');
    const envConfig = {
      googleServiceAccount: import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Configurado' : '❌ No configurado',
      googlePrivateKey: import.meta.env.GOOGLE_PRIVATE_KEY ? '✅ Configurado' : '❌ No configurado',
      googleCalendarId: import.meta.env.GOOGLE_CALENDAR_ID ? '✅ Configurado' : '❌ No configurado',
      timezone: import.meta.env.TIMEZONE || 'America/Bogota',
    };

    // 4. Crear evento de prueba
    console.log('4️⃣ Creando evento de prueba...');
    const testEvent = {
      summary: '🧪 Prueba del Sistema - IA Punto',
      description: 'Este es un evento de prueba para verificar la funcionalidad del sistema de citas.\n\nPuede ser eliminado después de la verificación.',
      start: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Mañana + 1 hora
        timeZone: 'America/Bogota',
      },
      attendees: [
        {
          email: 'test@example.com',
          displayName: 'Usuario de Prueba',
        },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const eventResponse = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: testEvent,
      sendUpdates: 'none', // No enviar actualizaciones en prueba
    });

    const testEventId = eventResponse.data.id;
    console.log('✅ Evento de prueba creado:', testEventId);

    // 5. Eliminar evento de prueba
    console.log('5️⃣ Eliminando evento de prueba...');
    await calendar.events.delete({
      calendarId: calendarId,
      eventId: testEventId!,
    });
    console.log('✅ Evento de prueba eliminado');

    return new Response(JSON.stringify({
      success: true,
      message: 'Prueba completa del sistema ejecutada exitosamente',
      timestamp: new Date().toISOString(),
      results: {
        calendar: {
          status: '✅ Funcionando',
          calendarName: calendarResponse.data.summary,
          calendarId: calendarId,
        },
        email: emailConfig,
        environment: envConfig,
        testEvent: {
          status: '✅ Creado y eliminado exitosamente',
          eventId: testEventId,
        },
      },
      recommendations: [
        emailConfig.emailUser === '❌ No configurado' ? 'Configure EMAIL_USER para enviar emails' : null,
        emailConfig.emailPassword === '❌ No configurado' ? 'Configure EMAIL_PASSWORD para enviar emails' : null,
        emailConfig.adminEmail === '❌ No configurado' ? 'Configure ADMIN_EMAIL para notificaciones' : null,
        envConfig.googleServiceAccount === '❌ No configurado' ? 'Configure GOOGLE_SERVICE_ACCOUNT_EMAIL' : null,
        envConfig.googlePrivateKey === '❌ No configurado' ? 'Configure GOOGLE_PRIVATE_KEY' : null,
      ].filter(Boolean),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error en prueba completa:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
      recommendations: [
        'Verifique las credenciales de Google Calendar API',
        'Asegúrese de que las variables de entorno estén configuradas',
        'Revise los logs del servidor para más detalles',
      ],
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
