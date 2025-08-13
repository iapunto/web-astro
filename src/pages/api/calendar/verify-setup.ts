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
    console.log('🔍 Verificando configuración del calendario...');

    const calendarId = import.meta.env.GOOGLE_CALENDAR_ID || 'primary';

    // Obtener información del calendario
    const response = await calendar.calendars.get({
      calendarId: calendarId,
    });

    const calendarInfo = response.data;

    // Verificar configuración de conferencias
    const conferenceProperties = calendarInfo.conferenceProperties;
    const allowedConferenceTypes =
      conferenceProperties?.allowedConferenceSolutionTypes || [];
    const hasGoogleMeet = allowedConferenceTypes.includes('hangoutsMeet');

    // Verificar variables de entorno
    const envCheck = {
      serviceAccountEmail: !!import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: !!import.meta.env.GOOGLE_PRIVATE_KEY,
      workspaceUser: !!import.meta.env.GOOGLE_WORKSPACE_USER,
      calendarId: !!import.meta.env.GOOGLE_CALENDAR_ID,
      timezone: !!import.meta.env.TIMEZONE,
    };

    const setupStatus = {
      calendar: {
        id: calendarInfo.id,
        summary: calendarInfo.summary,
        timeZone: calendarInfo.timeZone,
        accessRole: calendarInfo.accessRole,
      },
      googleMeet: {
        enabled: hasGoogleMeet,
        allowedTypes: allowedConferenceTypes,
        requiresWorkspace: true,
      },
      environment: envCheck,
      recommendations: [] as string[],
    };

    // Generar recomendaciones
    if (!hasGoogleMeet) {
      setupStatus.recommendations.push(
        'Google Meet no está habilitado en este calendario. Verifica la configuración de Google Workspace.'
      );
    }

    if (!envCheck.workspaceUser) {
      setupStatus.recommendations.push(
        'GOOGLE_WORKSPACE_USER no está configurado. Es requerido para Google Meet.'
      );
    }

    if (!envCheck.serviceAccountEmail || !envCheck.privateKey) {
      setupStatus.recommendations.push(
        'Credenciales de Service Account incompletas. Verifica GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY.'
      );
    }

    console.log('✅ Verificación completada:', {
      calendarId: setupStatus.calendar.id,
      googleMeetEnabled: setupStatus.googleMeet.enabled,
      recommendationsCount: setupStatus.recommendations.length,
    });

    return new Response(
      JSON.stringify({
        success: true,
        setup: setupStatus,
        message:
          setupStatus.recommendations.length === 0
            ? 'Configuración correcta'
            : 'Configuración requiere ajustes',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error verificando configuración:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error al verificar configuración',
        details: error instanceof Error ? error.message : 'Error desconocido',
        recommendations: [
          'Verifica las credenciales de Service Account',
          'Asegúrate de que el calendario esté compartido con la Service Account',
          'Verifica que tengas una suscripción activa de Google Workspace',
        ],
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
