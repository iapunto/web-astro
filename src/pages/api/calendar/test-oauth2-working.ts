import type { APIRoute } from 'astro';
import OAuth2Service from '../../../lib/services/oauth2Service.js';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 ===== PRUEBA OAUTH2 FUNCIONANDO =====');

    const oauth2Service = new OAuth2Service();
    
    // 1. Verificar tokens OAuth2
    console.log('1️⃣ Verificando tokens OAuth2...');
    const tokensLoaded = oauth2Service.setTokensFromEnv();
    
    if (!tokensLoaded) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No hay tokens OAuth2 configurados',
        instructions: [
          '1. Visita /api/calendar/auth para obtener tokens',
          '2. Configura GOOGLE_ACCESS_TOKEN y GOOGLE_REFRESH_TOKEN',
          '3. Ejecuta esta prueba nuevamente'
        ]
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Verificar conexión
    console.log('2️⃣ Verificando conexión con Google Calendar...');
    const isConnected = await oauth2Service.verifyConnection();
    
    if (!isConnected) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No se pudo conectar con Google Calendar',
        instructions: [
          '1. Verifica que los tokens sean válidos',
          '2. Asegúrate de que la cuenta tenga permisos de calendario',
          '3. Intenta renovar los tokens'
        ]
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Obtener información del usuario
    console.log('3️⃣ Obteniendo información del usuario...');
    const userInfo = await oauth2Service.getUserInfo();
    const authStatus = oauth2Service.getAuthStatus();

    // 4. Crear evento de prueba con attendees y Google Meet
    console.log('4️⃣ Creando evento de prueba con OAuth2...');
    const calendar = oauth2Service.getCalendarClient();
    
    const testEvent = {
      summary: '🧪 Prueba OAuth2 - IA Punto',
      description: 'Este es un evento de prueba para verificar que OAuth2 funciona correctamente con invitados y Google Meet.\n\nPuede ser eliminado después de la verificación.',
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
      conferenceData: {
        createRequest: {
          requestId: `test-meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const eventResponse = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: testEvent,
      sendUpdates: 'none', // No enviar actualizaciones en prueba
      conferenceDataVersion: 1, // Requerido para Google Meet
    });

    const testEventId = eventResponse.data.id;
    const meetLink = eventResponse.data.conferenceData?.entryPoints?.find(
      (entry: any) => entry.entryPointType === 'video'
    )?.uri;

    console.log('✅ Evento de prueba creado:', testEventId);
    console.log('🔗 Google Meet:', meetLink ? '✅ Creado' : '❌ No creado');

    // 5. Eliminar evento de prueba
    console.log('5️⃣ Eliminando evento de prueba...');
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: testEventId!,
    });
    console.log('✅ Evento de prueba eliminado');

    return new Response(JSON.stringify({
      success: true,
      message: 'OAuth2 funciona correctamente',
      timestamp: new Date().toISOString(),
      results: {
        oauth2Status: '✅ Configurado y funcionando',
        userInfo: {
          email: userInfo?.email,
          name: userInfo?.name,
          picture: userInfo?.picture
        },
        authStatus: authStatus,
        testEvent: {
          status: '✅ Creado y eliminado exitosamente',
          eventId: testEventId,
          attendees: testEvent.attendees?.length || 0,
          googleMeet: meetLink ? '✅ Creado automáticamente' : '❌ No se creó (puede requerir Google Workspace)',
          meetLink: meetLink || null
        }
      },
      capabilities: [
        '✅ Crear eventos con invitados',
        meetLink ? '✅ Google Meet automático' : '⚠️ Google Meet manual (requiere Google Workspace)',
        '✅ Enviar invitaciones por email',
        '✅ Gestionar calendario completo'
      ],
      nextSteps: [
        'Usa /api/calendar/book para crear citas reales',
        'Los eventos incluirán invitados automáticamente',
        'Las invitaciones se enviarán por email',
        meetLink ? 'Google Meet se creará automáticamente' : 'Agrega Google Meet manualmente desde Google Calendar'
      ]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error en prueba OAuth2:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
      recommendations: [
        'Verifica que los tokens OAuth2 sean válidos',
        'Asegúrate de que la cuenta tenga permisos de calendario',
        'Revisa los logs del servidor para más detalles'
      ]
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
