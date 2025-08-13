import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
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

class GoogleCalendarService {
  private calendar: any;
  private calendarId: string;
  private timezone: string;

  constructor() {
    // Configurar autenticación con Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });

    // Configurar impersonación del usuario de Google Workspace (requerido para Google Meet)
    if (process.env.GOOGLE_WORKSPACE_USER) {
      console.log(
        '🔐 Configurada impersonación para:',
        process.env.GOOGLE_WORKSPACE_USER
      );
    } else {
      console.warn(
        '⚠️ GOOGLE_WORKSPACE_USER no configurado. Google Meet puede no funcionar.'
      );
    }

    this.calendar = google.calendar({ version: 'v3', auth });
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.timezone = process.env.TIMEZONE || 'America/Bogota';
  }

  async verifyConnection(): Promise<boolean> {
    try {
      console.log('🔍 Verificando conexión con Google Calendar...');

      const response = await this.calendar.calendars.get({
        calendarId: this.calendarId,
      });

      if (response.data) {
        console.log('✅ Conexión con Google Calendar verificada');
        console.log(
          '📅 Calendario:',
          response.data.summary || 'Calendario Principal'
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error(
        '❌ Error verificando conexión con Google Calendar:',
        error
      );
      return false;
    }
  }

  async checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
    try {
      console.log('🔍 Verificando disponibilidad...');

      const response = await this.calendar.freebusy.query({
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
      console.log('🚀 ===== CREANDO CITA =====');
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

      // Crear el evento con el cliente como attendee
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

      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: event,
        sendUpdates: 'all', // Enviar actualizaciones al cliente
      });

      const createdEvent = response.data;

      console.log(`✅ Evento creado exitosamente: ${createdEvent.id}`);
      console.log(`📅 Resumen del evento: ${createdEvent.summary}`);
      console.log(`🕐 Inicio: ${createdEvent.start?.dateTime}`);
      console.log(`🕐 Fin: ${createdEvent.end?.dateTime}`);

      // Nota sobre Google Meet manual
      console.log('ℹ️ Google Meet no se crea automáticamente. Puedes agregarlo manualmente desde Google Calendar.');

      console.log('🏁 ===== CITA CREADA =====');

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
        meetLink: undefined, // Google Meet se agrega manualmente
      };
    } catch (error) {
      console.error('❌ Error creando cita:', error);
      throw error;
    }
  }
}

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 ===== ENDPOINT DE AGENDAMIENTO INICIADO =====');
  console.log('📥 Solicitud recibida en /api/calendar/book');

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

    // Crear instancia del servicio de Google Calendar
    console.log('🔍 Creando servicio de Google Calendar...');
    const calendarService = new GoogleCalendarService();

    // Verificar conexión del servicio
    console.log('🔍 Verificando conexión del servicio...');
    const isConnected = await calendarService.verifyConnection();

    if (!isConnected) {
      console.error('❌ Falló la conexión del servicio');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No se pudo conectar con Google Calendar',
          details: 'Verifica las credenciales de Google Calendar',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('✅ Conexión del servicio verificada');

    // Crear la cita
    console.log('🚀 Creando cita...');
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

    console.log('✅ Cita creada exitosamente');
    console.log('📅 Detalles de la cita:', {
      id: createdAppointment.id,
      summary: createdAppointment.summary,
      start: createdAppointment.start,
      end: createdAppointment.end,
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
        message: 'Cita creada exitosamente',
        appointment: {
          id: createdAppointment.id,
          summary: createdAppointment.summary,
          start: createdAppointment.start,
          end: createdAppointment.end,
          meetLink: createdAppointment.meetLink,
        },
        service: 'Google Calendar',
        serviceType: 'google-calendar',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ ===== ERROR EN ENDPOINT DE AGENDAMIENTO =====');
    console.error('❌ Detalles del error:', error);
    console.error(
      '❌ Stack del error:',
      error instanceof Error ? error.stack : 'Sin stack trace'
    );
    console.error('🏁 ===== FIN DEL ENDPOINT DE AGENDAMIENTO =====');

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
