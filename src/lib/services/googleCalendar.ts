import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';
import { MockCalendarService } from './mockCalendarService.js';
import EmailService from './emailService.js';
import * as dotenv from 'dotenv';

export interface AppointmentRequest {
  name: string;
  email: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  meetingType?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
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
    responseStatus?: string;
  }>;
  meetLink?: string;
}

export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
}

class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;
  private calendarId: string;
  private timezone: string;
  private emailService: EmailService;
  private isServiceAccount: boolean;

  constructor() {
    let auth;
    this.isServiceAccount = false;

    // Cargar variables de entorno usando dotenv
    dotenv.config();

    // Intentar Service Account primero (más simple para aplicaciones servidor)
    if (
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
    ) {
      try {
        auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
          scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
          ],
        });
        this.isServiceAccount = true;
        console.log('✅ Service Account authentication configured');
      } catch (serviceAccountError) {
        console.warn(
          '⚠️ Service Account auth failed, falling back to OAuth2:',
          serviceAccountError
        );
        auth = null;
      }
    }

    // Fallback a OAuth2 si no hay Service Account
    if (!auth) {
      auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      console.warn(
        '⚠️ OAuth2 configured but no tokens available. Consider using Service Account for production.'
      );
    }

    // Configurar el cliente de Google Calendar
    this.calendar = google.calendar({ version: 'v3', auth });
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.timezone = process.env.TIMEZONE || 'America/Mexico_City';
    this.emailService = new EmailService();

    console.log(`📅 Calendar service initialized with ID: ${this.calendarId}`);
  }

  /**
   * Configurar tokens de acceso para el usuario autenticado
   */
  setCredentials(tokens: any) {
    const auth = (this.calendar as any).options?.auth as any;
    if (auth && auth.setCredentials) {
      auth.setCredentials(tokens);
    }
  }

  /**
   * Obtener URL de autorización para OAuth2
   */
  getAuthUrl(): string {
    const auth = (this.calendar as any).options?.auth as any;
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    return auth.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  /**
   * Intercambiar código de autorización por tokens
   */
  async getTokensFromCode(code: string) {
    const auth = (this.calendar as any).options?.auth as any;
    const { tokens } = await auth.getToken(code);
    return tokens;
  }

  /**
   * Verificar disponibilidad en un rango de tiempo
   */
  async checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
    try {
      console.log('🔍 ===== CHECK AVAILABILITY START =====');
      console.log(
        `🔍 Checking availability: ${startTime.toISOString()} - ${endTime.toISOString()}`
      );
      console.log(`📅 Calendar ID: ${this.calendarId}`);
      console.log(`🌍 Timezone: ${this.timezone}`);

      const requestBody = {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: [{ id: this.calendarId }],
        timeZone: this.timezone,
      };

      console.log(
        '📤 Sending freebusy query with:',
        JSON.stringify(requestBody, null, 2)
      );

      const response = await this.calendar.freebusy.query({
        requestBody,
      });

      console.log('📥 Freebusy response received');
      console.log('📊 Response data:', JSON.stringify(response.data, null, 2));

      const busyTimes = response.data.calendars?.[this.calendarId]?.busy || [];
      const isAvailable = busyTimes.length === 0;

      console.log(
        `📊 Availability check result: ${isAvailable ? 'AVAILABLE' : 'BUSY'} (${busyTimes.length} conflicts)`
      );
      if (busyTimes.length > 0) {
        console.log('🚫 Busy times found:', JSON.stringify(busyTimes, null, 2));
      }
      console.log('🔍 ===== CHECK AVAILABILITY END =====');

      return isAvailable;
    } catch (error) {
      console.error('❌ ===== CHECK AVAILABILITY ERROR =====');
      console.error('❌ Error checking availability:', error);
      console.error(
        '❌ Error details:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      console.error('❌ ===== CHECK AVAILABILITY ERROR END =====');
      throw new Error('No se pudo verificar la disponibilidad');
    }
  }

  /**
   * Obtener slots de disponibilidad para un día específico
   */
  async getAvailableSlots(
    date: Date,
    durationMinutes: number = 60
  ): Promise<AvailabilitySlot[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(
      parseInt(process.env.BUSINESS_HOURS_START?.split(':')[0] || '9'),
      0,
      0,
      0
    );

    const endOfDay = new Date(date);
    endOfDay.setHours(
      parseInt(process.env.BUSINESS_HOURS_END?.split(':')[0] || '17'),
      0,
      0,
      0
    );

    const slots: AvailabilitySlot[] = [];
    const slotDuration = durationMinutes * 60 * 1000; // Convert to milliseconds

    try {
      console.log(`📅 Getting available slots for ${date.toDateString()}`);

      // Obtener eventos ocupados del día
      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          items: [{ id: this.calendarId }],
          timeZone: this.timezone,
        },
      });

      const busyTimes = response.data.calendars?.[this.calendarId]?.busy || [];

      // Generar slots cada 30 minutos
      const slotInterval = 30 * 60 * 1000; // 30 minutes in milliseconds
      let currentTime = startOfDay.getTime();

      while (currentTime + slotDuration <= endOfDay.getTime()) {
        const slotStart = new Date(currentTime);
        const slotEnd = new Date(currentTime + slotDuration);

        // Verificar si el slot está ocupado
        const isAvailable = !busyTimes.some((busy: any) => {
          const busyStart = new Date(busy.start).getTime();
          const busyEnd = new Date(busy.end).getTime();

          return slotStart.getTime() < busyEnd && slotEnd.getTime() > busyStart;
        });

        slots.push({
          start: slotStart,
          end: slotEnd,
          available: isAvailable,
        });

        currentTime += slotInterval;
      }

      const availableCount = slots.filter((slot) => slot.available).length;
      console.log(
        `✅ Found ${availableCount} available slots out of ${slots.length} total slots`
      );

      return slots;
    } catch (error) {
      console.error('❌ Error getting available slots:', error);
      throw new Error('No se pudieron obtener los horarios disponibles');
    }
  }

  /**
   * Crear una nueva cita en Google Calendar
   */
  async createAppointment(
    appointment: AppointmentRequest
  ): Promise<CalendarEvent> {
    try {
      console.log('🚀 ===== CREATE APPOINTMENT START =====');
      console.log(`📝 Creating appointment for ${appointment.name}`);
      console.log(`📅 Date: ${appointment.startTime.toISOString()}`);
      console.log(
        `⏰ Duration: ${Math.round((appointment.endTime.getTime() - appointment.startTime.getTime()) / (1000 * 60))} minutes`
      );
      console.log(`📧 Email: ${appointment.email}`);
      console.log(`📋 Description: ${appointment.description}`);
      console.log(`🎯 Meeting Type: ${appointment.meetingType}`);

      // Verificar disponibilidad antes de crear
      console.log('🔍 Checking availability...');
      const isAvailable = await this.checkAvailability(
        appointment.startTime,
        appointment.endTime
      );

      console.log(
        `✅ Availability check result: ${isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}`
      );

      if (!isAvailable) {
        console.error('❌ Selected time is not available');
        throw new Error('El horario seleccionado no está disponible');
      }

      // Generar ID único para la conferencia
      const conferenceId = `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const event: calendar_v3.Schema$Event = {
        summary: `Consulta con ${appointment.name}`,
        description: this.generateEventDescription(appointment),
        start: {
          dateTime: appointment.startTime.toISOString(),
          timeZone: this.timezone,
        },
        end: {
          dateTime: appointment.endTime.toISOString(),
          timeZone: this.timezone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
        // Configurar Google Meet automáticamente
        conferenceData: {
          createRequest: {
            requestId: conferenceId,
            conferenceSolutionKey: {
              type: 'addOn',
            },
          },
        },
        // Configurar permisos del evento
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: false,
        // Configurar visibilidad
        transparency: 'opaque', // Muestra como ocupado
        // Configurar ubicación virtual
        location: 'Reunión Virtual - Google Meet',
      };

      console.log(
        `🎥 Creating Google Meet conference with ID: ${conferenceId}`
      );

      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: this.isServiceAccount ? 'none' : 'all', // Service Account no puede enviar invitaciones automáticas
      });

      const createdEvent = response.data;
      console.log(`✅ Event created successfully: ${createdEvent.id}`);
      console.log(`📅 Event summary: ${createdEvent.summary}`);
      console.log(`🕐 Event start: ${createdEvent.start?.dateTime}`);
      console.log(`🕐 Event end: ${createdEvent.end?.dateTime}`);
      console.log(`📧 Event attendees: ${createdEvent.attendees?.length || 0}`);

      // Extraer enlace de Google Meet
      const meetLink = createdEvent.conferenceData?.entryPoints?.find(
        (entry) => entry.entryPointType === 'video'
      )?.uri;

      if (meetLink) {
        console.log(`🔗 Google Meet link generated: ${meetLink}`);
      } else {
        console.warn('⚠️ No Google Meet link found in event response');
        console.log(
          '🔍 Conference data:',
          JSON.stringify(createdEvent.conferenceData, null, 2)
        );
      }

      // Enviar notificaciones por email
      try {
        await this.emailService.sendAppointmentConfirmation({
          clientName: appointment.name,
          clientEmail: appointment.email,
          appointmentDate: appointment.startTime,
          appointmentTime: appointment.startTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          meetLink,
          eventId: createdEvent.id!,
          meetingType: appointment.meetingType,
        });

        // Notificación interna
        await this.emailService.sendInternalNotification({
          clientName: appointment.name,
          clientEmail: appointment.email,
          appointmentDate: appointment.startTime,
          appointmentTime: appointment.startTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          eventId: createdEvent.id!,
          meetingType: appointment.meetingType,
        });

        console.log(`📧 Email notifications sent successfully`);
      } catch (emailError) {
        console.error('❌ Error sending email notifications:', emailError);
        // No fallar la creación del evento por problemas de email
      }

      const result = {
        id: createdEvent.id!,
        summary: createdEvent.summary!,
        description: createdEvent.description || undefined,
        start: {
          dateTime: createdEvent.start!.dateTime!,
          timeZone: createdEvent.start!.timeZone!,
        },
        end: {
          dateTime: createdEvent.end!.dateTime!,
          timeZone: createdEvent.end!.timeZone!,
        },
        attendees:
          createdEvent.attendees?.map((attendee) => ({
            email: attendee.email!,
            displayName: attendee.displayName || undefined,
            responseStatus: attendee.responseStatus || undefined,
          })) || [],
        meetLink: meetLink || undefined,
      };

      console.log('🎉 ===== CREATE APPOINTMENT SUCCESS =====');
      console.log(`✅ Final result:`, JSON.stringify(result, null, 2));
      console.log('🎉 ===== CREATE APPOINTMENT END =====');

      return result;
    } catch (error) {
      console.error('❌ ===== CREATE APPOINTMENT ERROR =====');
      console.error('❌ Error creating appointment:', error);
      console.error(
        '❌ Error details:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      console.error(
        '❌ Error stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      );
      console.error('❌ ===== CREATE APPOINTMENT ERROR END =====');
      throw new Error('No se pudo crear la cita');
    }
  }

  /**
   * Generar descripción del evento
   */
  private generateEventDescription(appointment: AppointmentRequest): string {
    const lines = [
      `Reunión agendada con ${appointment.name}`,
      '',
      `📧 Email: ${appointment.email}`,
      `💼 Tipo: ${appointment.meetingType || 'Consulta general'}`,
      `⏰ Duración: ${Math.round((appointment.endTime.getTime() - appointment.startTime.getTime()) / (1000 * 60))} minutos`,
      '',
      appointment.description ||
        'Consulta sobre marketing digital e inteligencia artificial',
      '',
      '---',
      'Agendado automáticamente desde iapunto.com',
      'Para cancelar o reprogramar, contacta a info@iapunto.com',
    ];

    return lines.join('\n');
  }

  /**
   * Actualizar una cita existente
   */
  async updateAppointment(
    eventId: string,
    updates: Partial<AppointmentRequest>
  ): Promise<CalendarEvent> {
    try {
      console.log(`📝 Updating appointment: ${eventId}`);

      const event: calendar_v3.Schema$Event = {};

      if (updates.name) {
        event.summary = `Consulta con ${updates.name}`;
      }

      if (updates.startTime && updates.endTime) {
        event.start = {
          dateTime: updates.startTime.toISOString(),
          timeZone: this.timezone,
        };
        event.end = {
          dateTime: updates.endTime.toISOString(),
          timeZone: this.timezone,
        };
      }

      if (updates.description) {
        event.description = updates.description;
      }

      if (updates.email) {
        event.attendees = [
          {
            email: updates.email,
            displayName: updates.name,
          },
        ];
      }

      const response = await this.calendar.events.patch({
        calendarId: this.calendarId,
        eventId: eventId,
        requestBody: event,
        sendUpdates: 'all',
      });

      const updatedEvent = response.data;
      console.log(`✅ Appointment updated successfully`);

      return {
        id: updatedEvent.id!,
        summary: updatedEvent.summary!,
        description: updatedEvent.description,
        start: {
          dateTime: updatedEvent.start!.dateTime!,
          timeZone: updatedEvent.start!.timeZone!,
        },
        end: {
          dateTime: updatedEvent.end!.dateTime!,
          timeZone: updatedEvent.end!.timeZone!,
        },
        attendees: updatedEvent.attendees?.map((attendee) => ({
          email: attendee.email!,
          displayName: attendee.displayName || undefined,
          responseStatus: attendee.responseStatus || undefined,
        })),
      };
    } catch (error) {
      console.error('❌ Error updating appointment:', error);
      throw new Error('No se pudo actualizar la cita');
    }
  }

  /**
   * Cancelar una cita
   */
  async cancelAppointment(eventId: string): Promise<void> {
    try {
      console.log(`❌ Canceling appointment: ${eventId}`);

      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId,
        sendUpdates: 'all',
      });

      console.log(`✅ Appointment canceled successfully`);
    } catch (error) {
      console.error('❌ Error canceling appointment:', error);
      throw new Error('No se pudo cancelar la cita');
    }
  }

  /**
   * Obtener detalles de una cita específica
   */
  async getAppointment(eventId: string): Promise<CalendarEvent> {
    try {
      console.log(`📋 Getting appointment details: ${eventId}`);

      const response = await this.calendar.events.get({
        calendarId: this.calendarId,
        eventId: eventId,
      });

      const event = response.data;

      // Extraer enlace de Meet
      const meetLink = event.conferenceData?.entryPoints?.find(
        (entry) => entry.entryPointType === 'video'
      )?.uri;

      return {
        id: event.id!,
        summary: event.summary!,
        description: event.description,
        start: {
          dateTime: event.start!.dateTime!,
          timeZone: event.start!.timeZone!,
        },
        end: {
          dateTime: event.end!.dateTime!,
          timeZone: event.end!.timeZone!,
        },
        attendees: event.attendees?.map((attendee) => ({
          email: attendee.email!,
          displayName: attendee.displayName || undefined,
          responseStatus: attendee.responseStatus || undefined,
        })),
        meetLink,
      };
    } catch (error) {
      console.error('❌ Error getting appointment:', error);
      throw new Error('No se pudo obtener la información de la cita');
    }
  }

  /**
   * Verificar el estado de la conexión con Google Calendar
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing Google Calendar connection...');

      const response = await this.calendar.calendarList.list({
        maxResults: 1,
      });

      const hasAccess = response.data.items && response.data.items.length > 0;
      console.log(
        `✅ Calendar connection test: ${hasAccess ? 'SUCCESS' : 'FAILED'}`
      );

      return hasAccess;
    } catch (error) {
      console.error('❌ Calendar connection test failed:', error);
      return false;
    }
  }
}

// Singleton instances
let googleCalendarService: GoogleCalendarService;
let mockCalendarService: MockCalendarService;

/**
 * Verificar si las credenciales de Google Calendar están configuradas
 */
function hasGoogleCredentials(): boolean {
  console.log('🔍 Checking Google Calendar credentials...');

  // Cargar variables de entorno usando dotenv
  dotenv.config();

  // Service Account (preferido) - Funciona sin tokens adicionales
  const hasServiceAccount = !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_CALENDAR_ID
  );

  console.log('📋 Credentials check:');
  console.log(
    `  - GOOGLE_SERVICE_ACCOUNT_EMAIL: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ SET' : '❌ NOT SET'}`
  );
  console.log(
    `  - GOOGLE_PRIVATE_KEY: ${process.env.GOOGLE_PRIVATE_KEY ? '✅ SET' : '❌ NOT SET'}`
  );
  console.log(
    `  - GOOGLE_CALENDAR_ID: ${process.env.GOOGLE_CALENDAR_ID ? '✅ SET' : '❌ NOT SET'}`
  );

  if (hasServiceAccount) {
    console.log('✅ Service Account credentials found');
    return true;
  }

  // OAuth2 (requiere tokens) - Por ahora devolver false hasta configurar tokens
  const hasOAuth2Basic = !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALENDAR_ID
  );

  if (hasOAuth2Basic) {
    console.warn(
      '⚠️ OAuth2 credentials found but tokens not configured. Using mock service until Service Account is set up.'
    );
    return false; // Usar mock hasta configurar tokens
  }

  console.warn('❌ No Google Calendar credentials found');
  return false;
}

export function getGoogleCalendarService():
  | GoogleCalendarService
  | MockCalendarService {
  console.log('🚀 getGoogleCalendarService() called');

  // FORZAR USO DEL SERVICIO REAL - DESACTIVAR MOCK
  console.log('🔧 FORCING REAL SERVICE - MOCK DISABLED');

  // Si no hay credenciales configuradas, LANZAR ERROR en lugar de usar mock
  if (!hasGoogleCredentials()) {
    console.error('❌ CRITICAL: No Google Calendar credentials found');
    console.error('❌ Cannot use mock service - forcing real service only');
    throw new Error(
      'Google Calendar credentials not configured. Please check environment variables.'
    );
  }

  // Si hay credenciales, usar el servicio real
  if (!googleCalendarService) {
    console.log('🔄 Creating new GoogleCalendarService instance...');
    googleCalendarService = new GoogleCalendarService();
  } else {
    console.log('✅ Using existing GoogleCalendarService instance');
  }

  console.log(
    `📅 Returning service type: ${googleCalendarService.constructor.name}`
  );
  return googleCalendarService;
}

export default GoogleCalendarService;
