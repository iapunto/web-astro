import type { APIRoute } from 'astro';
import * as dotenv from 'dotenv';
import OAuth2Service from '../../../lib/services/oauth2Service.js';
import EmailService from '../../../lib/services/emailService.js';

// Cargar variables de entorno
dotenv.config();

interface AppointmentRequest {
  name: string;
  email: string;
  startTime: string;
  endTime: string;
  description?: string;
  meetingType?: string;
}

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  meetLink?: string;
}

class GoogleCalendarOAuth2Service {
  private calendar: any;
  private calendarId: string;
  private timezone: string;
  private oauth2Service: OAuth2Service;

  constructor() {
    this.oauth2Service = new OAuth2Service();
    
    // Intentar cargar tokens desde variables de entorno
    const tokensLoaded = this.oauth2Service.setTokensFromEnv();
    
    if (!tokensLoaded) {
      console.warn('⚠️ No se encontraron tokens OAuth2 en variables de entorno');
      console.warn('📋 Ejecuta el flujo de OAuth2 primero visitando /api/calendar/auth');
    }

    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.timezone = process.env.TIMEZONE || 'America/Bogota';
  }

  async verifyConnection(): Promise<boolean> {
    try {
      return await this.oauth2Service.verifyConnection();
    } catch (error) {
      console.error('❌ Error verificando conexión OAuth2:', error);
      return false;
    }
  }

  async checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
    try {
      console.log('🔍 Verificando disponibilidad...');

      const calendar = this.oauth2Service.getCalendarClient();
      
      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: this.calendarId }],
          timeZone: this.timezone,
        },
      });

      const calendarData = response.data.calendars?.[this.calendarId];
      const busyPeriods = calendarData?.busy || [];

      console.log(
        `📊 Resultado de verificación: ${busyPeriods.length === 0 ? 'DISPONIBLE' : 'OCUPADO'} (${busyPeriods.length} conflictos)`
      );

      return busyPeriods.length === 0;
    } catch (error) {
      console.error('❌ Error verificando disponibilidad:', error);
      return false;
    }
  }

  async createAppointment(
    appointment: AppointmentRequest
  ): Promise<CalendarEvent> {
    try {
      console.log('🚀 ===== CREANDO CITA CON OAUTH2 =====');
      console.log(`📝 Creando cita para ${appointment.name}`);
      console.log(`📅 Fecha: ${appointment.startTime}`);
      console.log(`📧 Email: ${appointment.email}`);

      const startDate = new Date(appointment.startTime);
      const endDate = new Date(appointment.endTime);

      // Verificar disponibilidad
      console.log('🔍 Verificando disponibilidad...');
      const isAvailable = await this.checkAvailability(startDate, endDate);

      if (!isAvailable) {
        throw new Error('El horario seleccionado no está disponible');
      }

      console.log('✅ Verificación de disponibilidad: DISPONIBLE');

      // Crear el evento CON attendees (OAuth2 permite esto)
      const event = {
        summary: `Consulta con ${appointment.name}`,
        description: `Tipo de consulta: ${appointment.meetingType || 'Consulta General'}\n\nDescripción: ${appointment.description || 'Sin descripción adicional'}\n\nCliente: ${appointment.name} (${appointment.email})\n\nNota: Puedes agregar Google Meet manualmente desde Google Calendar`,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: this.timezone,
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: this.timezone,
        },
        attendees: [
          {
            email: appointment.email,
            displayName: appointment.name,
          },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 horas antes
            { method: 'popup', minutes: 30 }, // 30 minutos antes
          ],
        },
      };

      const calendar = this.oauth2Service.getCalendarClient();
      
      const response = await calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: event,
        sendUpdates: 'all', // Enviar invitaciones automáticamente
      });

      const createdEvent = response.data;

      console.log(`✅ Evento creado exitosamente: ${createdEvent.id}`);
      console.log(`📅 Resumen del evento: ${createdEvent.summary}`);
      console.log(`🕐 Inicio: ${createdEvent.start?.dateTime}`);
      console.log(`🕐 Fin: ${createdEvent.end?.dateTime}`);
      console.log(`👥 Invitados: ${createdEvent.attendees?.length || 0}`);

      // Extraer enlace de Google Meet si existe
      const meetLink = createdEvent.conferenceData?.entryPoints?.find(
        (entry: any) => entry.entryPointType === 'video'
      )?.uri;

      if (meetLink) {
        console.log(`🔗 Enlace de Google Meet: ${meetLink}`);
      } else {
        console.log('ℹ️ Google Meet no se crea automáticamente. Puedes agregarlo manualmente desde Google Calendar.');
      }

      console.log('🏁 ===== CITA CREADA CON OAUTH2 =====');

      return {
        id: createdEvent.id!,
        summary: createdEvent.summary!,
        start: {
          dateTime: createdEvent.start!.dateTime!,
          timeZone: createdEvent.start!.timeZone!,
        },
        end: {
          dateTime: createdEvent.end!.dateTime!,
          timeZone: createdEvent.end!.timeZone!,
        },
        attendees: createdEvent.attendees?.map((attendee: any) => ({
          email: attendee.email!,
          displayName: attendee.displayName || undefined,
        })),
        meetLink: meetLink || undefined,
      };
    } catch (error) {
      console.error('❌ Error creando cita con OAuth2:', error);
      throw error;
    }
  }
}

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 ===== ENDPOINT DE AGENDAMIENTO OAUTH2 INICIADO =====');
  console.log('📥 Solicitud recibida en /api/calendar/book-oauth2');

  try {
    console.log('📋 Parseando cuerpo de la solicitud...');
    const body = await request.json();
    console.log('✅ Cuerpo de la solicitud parseado exitosamente');
    console.log('📝 Datos de la solicitud:', JSON.stringify(body, null, 2));

    // Validación de datos requeridos
    const { name, email, startTime, endTime, description, meetingType } = body;

    console.log('🔍 Validando campos requeridos...');
    if (!name || !email || !startTime || !endTime) {
      console.error('❌ Faltan campos requeridos');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Faltan campos requeridos: name, email, startTime, endTime',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Formato de email inválido');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Formato de email inválido',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validar fechas
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    if (startDate < now) {
      console.error('❌ La fecha de inicio está en el pasado');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'La fecha de inicio no puede estar en el pasado',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (endDate <= startDate) {
      console.error(
        '❌ La fecha de fin debe ser posterior a la fecha de inicio'
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: 'La fecha de fin debe ser posterior a la fecha de inicio',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('✅ Todas las validaciones pasaron');

    // Crear instancia del servicio de Google Calendar OAuth2
    console.log('🔍 Creando servicio de Google Calendar OAuth2...');
    const calendarService = new GoogleCalendarOAuth2Service();

    // Verificar conexión del servicio
    console.log('🔍 Verificando conexión del servicio OAuth2...');
    const isConnected = await calendarService.verifyConnection();

    if (!isConnected) {
      console.error('❌ Falló la conexión del servicio OAuth2');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No se pudo conectar con Google Calendar',
          details: 'Verifica la autenticación OAuth2. Visita /api/calendar/auth para configurar',
          authRequired: true,
          authUrl: '/api/calendar/auth'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('✅ Conexión del servicio OAuth2 verificada');

    // Crear la cita
    console.log('🚀 Creando cita con OAuth2...');
    const appointmentData: AppointmentRequest = {
      name,
      email,
      startTime,
      endTime,
      description: description || '',
      meetingType: meetingType || 'Consulta General',
    };

    const createdAppointment =
      await calendarService.createAppointment(appointmentData);

    console.log('✅ Cita creada exitosamente con OAuth2');
    console.log('📅 Detalles de la cita:', {
      id: createdAppointment.id,
      summary: createdAppointment.summary,
      start: createdAppointment.start,
      end: createdAppointment.end,
      attendees: createdAppointment.attendees?.length || 0,
      meetLink: createdAppointment.meetLink,
    });

    // Enviar emails de confirmación
    console.log('📧 Enviando emails de confirmación...');
    const emailService = new EmailService();

    const emailData = {
      name: appointmentData.name,
      email: appointmentData.email,
      startTime: appointmentData.startTime,
      endTime: appointmentData.endTime,
      meetingType: appointmentData.meetingType || 'Consulta General',
      description: appointmentData.description,
      meetLink: createdAppointment.meetLink,
    };

    // Enviar email al cliente
    const clientEmailSent =
      await emailService.sendAppointmentConfirmation(emailData);
    if (clientEmailSent) {
      console.log('✅ Email de confirmación enviado al cliente');
    } else {
      console.warn('⚠️ No se pudo enviar email de confirmación al cliente');
    }

    // Enviar notificación al administrador
    const adminEmailSent =
      await emailService.sendNotificationToAdmin(emailData);
    if (adminEmailSent) {
      console.log('✅ Notificación enviada al administrador');
    } else {
      console.warn('⚠️ No se pudo enviar notificación al administrador');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cita creada exitosamente con OAuth2',
        appointment: {
          id: createdAppointment.id,
          summary: createdAppointment.summary,
          start: createdAppointment.start,
          end: createdAppointment.end,
          attendees: createdAppointment.attendees,
          meetLink: createdAppointment.meetLink,
        },
        service: 'Google Calendar OAuth2',
        serviceType: 'google-calendar-oauth2',
        authStatus: 'authenticated',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ ===== ERROR EN ENDPOINT DE AGENDAMIENTO OAUTH2 =====');
    console.error('❌ Detalles del error:', error);
    console.error(
      '❌ Stack del error:',
      error instanceof Error ? error.stack : 'Sin stack trace'
    );
    console.error('🏁 ===== FIN DEL ENDPOINT DE AGENDAMIENTO OAUTH2 =====');

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
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

// Manejar preflight requests para CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
