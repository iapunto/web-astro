import type { APIRoute } from 'astro';
import { PostgresAppointmentService } from '../../../lib/database/postgresAppointmentService';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('🔄 Iniciando sincronización de eventos de Google Calendar...');

    // Configurar Google Calendar API
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('GOOGLE_PRIVATE_KEY no está configurado');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error('GOOGLE_CALENDAR_ID no está configurado');
    }

    // Obtener eventos de los últimos 30 días y próximos 90 días
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    console.log('📅 Obteniendo eventos desde:', thirtyDaysAgo.toISOString(), 'hasta:', ninetyDaysFromNow.toISOString());

    const response = await calendar.events.list({
      calendarId,
      timeMin: thirtyDaysAgo.toISOString(),
      timeMax: ninetyDaysFromNow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    console.log(`📋 Encontrados ${events.length} eventos en Google Calendar`);

    // Inicializar servicio de base de datos
    const appointmentService = new PostgresAppointmentService();

    let syncedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const event of events) {
      try {
        if (!event.id || !event.start?.dateTime) {
          console.log('⚠️ Evento sin ID o fecha de inicio, saltando:', event.summary);
          continue;
        }

        const startDate = new Date(event.start.dateTime);
        const endDate = new Date(event.end?.dateTime || startDate.getTime() + 60 * 60 * 1000);

        // Verificar si el evento ya existe en la base de datos
        const existingAppointment = await appointmentService.getAppointmentByGoogleEventId(event.id);

        const appointmentData = {
          clientName: event.summary || 'Evento de Google Calendar',
          clientEmail: event.attendees?.[0]?.email || 'calendar@iapunto.com',
          clientPhone: '',
          serviceType: 'Consulta General',
          description: event.description || event.summary || 'Evento sincronizado desde Google Calendar',
          appointmentDate: startDate.toISOString().split('T')[0],
          appointmentTime: startDate.toTimeString().split(' ')[0].substring(0, 5),
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          googleEventId: event.id,
          googleEventLink: event.htmlLink || '',
          status: 'confirmed',
          source: 'google_calendar_sync'
        };

        if (existingAppointment) {
          // Actualizar evento existente
          await appointmentService.updateAppointment(existingAppointment.id, appointmentData);
          updatedCount++;
          console.log(`✅ Evento actualizado: ${event.summary} (${event.id})`);
        } else {
          // Crear nuevo evento
          await appointmentService.createAppointment(appointmentData);
          syncedCount++;
          console.log(`✅ Evento sincronizado: ${event.summary} (${event.id})`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error procesando evento ${event.id}:`, error);
      }
    }

    const result = {
      success: true,
      message: 'Sincronización completada',
      summary: {
        totalEvents: events.length,
        synced: syncedCount,
        updated: updatedCount,
        errors: errorCount
      }
    };

    console.log('🎉 Sincronización completada:', result.summary);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error en sincronización:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error durante la sincronización',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    success: false,
    error: 'Método GET no soportado. Use POST para sincronizar eventos.'
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
};
