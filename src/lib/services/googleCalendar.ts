import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';
import * as dotenv from 'dotenv';
import EmailService from './emailService.js';

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
  }

  /**
   * Verificar la conexión con Google Calendar
   */
  async verifyConnection(): Promise<boolean> {
    try {
      console.log('🔍 Verifying Google Calendar connection...');
      
      // Usar el endpoint de calendarios para verificar conexión
      const response = await this.calendar.calendars.get({
        calendarId: this.calendarId,
      });

      if (response.data) {
        console.log('✅ Google Calendar connection verified');
        console.log('📅 Calendar:', response.data.summary || 'Primary Calendar');
        return true;
      } else {
        console.error('❌ Google Calendar connection failed: No calendar data');
        return false;
      }
    } catch (error) {
      console.error('❌ Google Calendar connection error:', error);
      return false;
    }
  }

  /**
   * Obtener slots disponibles para una fecha
   */
  async getAvailableSlots(date: Date): Promise<any[]> {
    try {
      console.log('🔍 Getting available slots from Google Calendar...');
      
      // Convertir fecha a formato ISO
      const startTime = new Date(date);
      startTime.setHours(0, 0, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(23, 59, 59, 999);

      // Obtener eventos existentes para la fecha
      const response = await this.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      console.log(`📅 Found ${events.length} existing events for ${date.toDateString()}`);

      // Generar slots disponibles (9 AM a 6 PM, cada hora)
      const availableSlots = [];
      const workStartHour = 9;
      const workEndHour = 18;
      const slotDuration = 60; // minutos

      for (let hour = workStartHour; hour < workEndHour; hour++) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);
        
        const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);
        
        // Verificar si el slot está disponible
        const isAvailable = !events.some(event => {
          const eventStart = new Date(event.start?.dateTime || event.start?.date || '');
          const eventEnd = new Date(event.end?.dateTime || event.end?.date || '');
          
          return (
            (slotStart >= eventStart && slotStart < eventEnd) ||
            (slotEnd > eventStart && slotEnd <= eventEnd) ||
            (slotStart <= eventStart && slotEnd >= eventEnd)
          );
        });

        if (isAvailable) {
          availableSlots.push({
            start_time: slotStart.toISOString(),
            end_time: slotEnd.toISOString(),
            status: 'available'
          });
        }
      }

      console.log(`✅ Found ${availableSlots.length} available slots`);
      return availableSlots;
    } catch (error) {
      console.error('❌ Error getting available slots:', error);
      return [];
    }
  }

  /**
   * Verificar disponibilidad para un horario específico
   */
  async checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
    try {
      console.log('🔍 Checking availability...');
      console.log(`🔍 Checking availability: ${startTime.toISOString()} - ${endTime.toISOString()}`);

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

      console.log(`📊 Response data:`, response.data);
      console.log(`📊 Availability check result: ${busyPeriods.length === 0 ? 'AVAILABLE' : 'BUSY'} (${busyPeriods.length} conflicts)`);

      return busyPeriods.length === 0;
    } catch (error) {
      console.error('❌ Error checking availability:', error);
      return false;
    }
  }

  /**
   * Crear una cita en Google Calendar
   */
  async createAppointment(
    appointment: AppointmentRequest
  ): Promise<CalendarEvent> {
    try {
      console.log('🚀 ===== CREATE APPOINTMENT START =====');
      console.log(`📝 Creating appointment for ${appointment.name}`);
      console.log(`📅 Date: ${appointment.startTime.toISOString()}`);
      console.log(`⏰ Duration: ${Math.round((appointment.endTime.getTime() - appointment.startTime.getTime()) / (1000 * 60))} minutes`);
      console.log(`📧 Email: ${appointment.email}`);
      console.log(`📋 Description: ${appointment.description}`);
      console.log(`🎯 Meeting Type: ${appointment.meetingType}`);

      // Verificar disponibilidad
      console.log('🔍 Checking availability...');
      const isAvailable = await this.checkAvailability(
        appointment.startTime,
        appointment.endTime
      );

      if (!isAvailable) {
        throw new Error('El horario seleccionado no está disponible');
      }

      console.log('✅ Availability check result: AVAILABLE');

      // Generar ID único para la conferencia
      const conferenceId = `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log(`🎥 Creating Google Meet conference with ID: ${conferenceId}`);

      // Crear el evento
      const event = {
        summary: `Consulta con ${appointment.name}`,
        description: `Tipo de consulta: ${appointment.meetingType || 'Consulta General'}\n\nDescripción: ${appointment.description || 'Sin descripción adicional'}`,
        start: {
          dateTime: appointment.startTime.toISOString(),
          timeZone: this.timezone,
        },
        end: {
          dateTime: appointment.endTime.toISOString(),
          timeZone: this.timezone,
        },
        attendees: [
          { email: appointment.email, displayName: appointment.name },
        ],
        // Configurar Google Meet automáticamente
        conferenceData: {
          createRequest: {
            requestId: conferenceId,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
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
        conferenceDataVersion: 1,
        sendUpdates: 'all',
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
          meetingType: appointment.meetingType || 'Consulta General',
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
          meetingType: appointment.meetingType || 'Consulta General',
        });

        console.log(`📧 Email notifications sent successfully`);
      } catch (emailError) {
        console.error('❌ Error sending email notifications:', emailError);
        // No fallar la creación del evento por problemas de email
      }

      console.log('🏁 ===== CREATE APPOINTMENT END =====');

      return {
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
        attendees: createdEvent.attendees?.map((attendee) => ({
          email: attendee.email!,
          displayName: attendee.displayName || undefined,
          responseStatus: attendee.responseStatus || undefined,
        })),
        meetLink: meetLink || undefined,
      };
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      throw error;
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
        description: event.description || undefined,
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
        meetLink: meetLink || undefined,
      };
    } catch (error) {
      console.error('❌ Error getting appointment:', error);
      throw new Error('No se pudo obtener la información de la cita');
    }
  }

  /**
   * Cancelar una cita
   */
  async cancelAppointment(eventId: string, reason?: string): Promise<boolean> {
    try {
      console.log(`❌ Canceling appointment: ${eventId}`);

      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId,
        sendUpdates: 'all',
      });

      console.log('✅ Appointment canceled successfully');
      return true;
    } catch (error) {
      console.error('❌ Error canceling appointment:', error);
      return false;
    }
  }

  /**
   * Obtener información del calendario
   */
  async getCalendarInfo(): Promise<any> {
    try {
      const response = await this.calendar.calendars.get({
        calendarId: this.calendarId,
      });

      return {
        id: response.data.id,
        summary: response.data.summary,
        description: response.data.description,
        timeZone: response.data.timeZone,
        accessRole: (response.data as any).accessRole,
      };
    } catch (error) {
      console.error('❌ Error getting calendar info:', error);
      return null;
    }
  }

  /**
   * Listar próximos eventos
   */
  async listUpcomingEvents(maxResults: number = 10): Promise<CalendarEvent[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: new Date().toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      return events.map((event) => ({
        id: event.id!,
        summary: event.summary!,
        description: event.description || undefined,
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
        meetLink: event.conferenceData?.entryPoints?.find(
          (entry) => entry.entryPointType === 'video'
        )?.uri || undefined,
      }));
    } catch (error) {
      console.error('❌ Error listing upcoming events:', error);
      return [];
    }
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
   * Obtener tokens desde un código de autorización
   */
  async getTokensFromCode(code: string): Promise<any> {
    const auth = (this.calendar as any).options?.auth as any;
    if (auth && auth.getToken) {
      return await auth.getToken(code);
    }
    throw new Error('OAuth2 client not configured');
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

/**
 * Servicio mock para desarrollo y pruebas
 */
class MockCalendarService {
  async verifyConnection(): Promise<boolean> {
    console.log('🤖 Mock: Connection verified');
    return true;
  }

  async getAvailableSlots(date: Date): Promise<any[]> {
    console.log('🤖 Mock: Getting available slots');
    
    // Generar slots mock (9 AM a 6 PM)
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
      
      slots.push({
        start_time: slotStart.toISOString(),
        end_time: slotEnd.toISOString(),
        status: 'available'
      });
    }
    
    console.log(`🤖 Mock: Generated ${slots.length} available slots`);
    return slots;
  }

  async createAppointment(appointment: AppointmentRequest): Promise<CalendarEvent> {
    console.log('🤖 Mock: Creating appointment');
    
    const mockEvent: CalendarEvent = {
      id: `mock-${Date.now()}`,
      summary: `Consulta con ${appointment.name}`,
      description: appointment.description,
      start: {
        dateTime: appointment.startTime.toISOString(),
        timeZone: 'America/Mexico_City',
      },
      end: {
        dateTime: appointment.endTime.toISOString(),
        timeZone: 'America/Mexico_City',
      },
      attendees: [
        {
          email: appointment.email,
          displayName: appointment.name,
          responseStatus: 'accepted',
        },
      ],
      meetLink: `https://meet.google.com/mock-${Date.now()}`,
    };

    console.log('🤖 Mock: Appointment created successfully');
    return mockEvent;
  }

  async getAppointment(eventId: string): Promise<CalendarEvent> {
    console.log('🤖 Mock: Getting appointment');
    throw new Error('Mock service does not support getting appointments');
  }

  async cancelAppointment(eventId: string): Promise<boolean> {
    console.log('🤖 Mock: Canceling appointment');
    return true;
  }

  async getCalendarInfo(): Promise<any> {
    console.log('🤖 Mock: Getting calendar info');
    return {
      id: 'mock-calendar',
      summary: 'Mock Calendar',
      timeZone: 'America/Mexico_City',
    };
  }

  async listUpcomingEvents(): Promise<CalendarEvent[]> {
    console.log('🤖 Mock: Listing upcoming events');
    return [];
  }

  setCredentials(tokens: any) {
    console.log('🤖 Mock: Setting credentials');
  }

  async getTokensFromCode(code: string): Promise<any> {
    console.log('🤖 Mock: Getting tokens from code');
    throw new Error('Mock service does not support OAuth2');
  }
}

/**
 * Obtener instancia del servicio de Google Calendar
 */
export function getGoogleCalendarService(): GoogleCalendarService | MockCalendarService {
  console.log('🚀 getGoogleCalendarService() called');

  // Verificar si las credenciales están configuradas
  if (!hasGoogleCredentials()) {
    console.log('❌ No Google Calendar credentials found, using mock service');
    if (!mockCalendarService) {
      mockCalendarService = new MockCalendarService();
    }
    return mockCalendarService;
  }

  // Usar Service Account (preferido)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    console.log('🔧 FORCING REAL SERVICE - MOCK DISABLED');
    
    if (!googleCalendarService) {
      console.log('🔄 Creating new GoogleCalendarService instance...');
      googleCalendarService = new GoogleCalendarService();
      console.log('✅ Service Account authentication configured');
      console.log(`📅 Calendar service initialized with ID: ${process.env.GOOGLE_CALENDAR_ID || 'primary'}`);
    }
    
    console.log('📅 Returning service type: GoogleCalendarService');
    return googleCalendarService;
  }

  // Fallback a OAuth2 (requiere configuración adicional)
  console.log('⚠️ OAuth2 configuration detected but tokens not available');
  if (!mockCalendarService) {
    mockCalendarService = new MockCalendarService();
  }
  return mockCalendarService;
}

export default GoogleCalendarService;
