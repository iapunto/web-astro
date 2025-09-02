import { google } from 'googleapis';
import { PostgresAppointmentService } from '../database/postgresAppointmentService.js';
import { ResendEmailService } from '../email/resendEmailService.js';
import { Appointment } from '../database/postgresSchema.js';

export interface CreateAppointmentRequest {
  clientName: string;
  clientEmail: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export interface AppointmentResult {
  success: boolean;
  appointment?: Appointment;
  error?: string;
  details?: {
    databaseCreated: boolean;
    googleCalendarCreated: boolean;
    emailSent: boolean;
    adminNotificationSent: boolean;
  };
}

export class PostgresAppointmentManager {
  private appointmentService: PostgresAppointmentService;
  private emailService: ResendEmailService;
  private calendar: any;
  private calendarId: string;
  private timezone: string;

  constructor() {
    this.appointmentService = new PostgresAppointmentService();
    this.emailService = new ResendEmailService();
    this.initializeGoogleCalendar();
  }

  private async initializeGoogleCalendar() {
    try {
      this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
      this.timezone = process.env.TIMEZONE || 'America/Bogota';

      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
      const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
      const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
      const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

      if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !REFRESH_TOKEN) {
        console.warn('Faltan variables de entorno para Google Calendar (CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN). La integración con Google Calendar no funcionará.');
        return;
      }

      const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
      auth.setCredentials({ refresh_token: REFRESH_TOKEN });

      // Refresh the access token to ensure it's valid
      const { credentials } = await auth.refreshAccessToken();
      auth.setCredentials(credentials);

      this.calendar = google.calendar({ version: 'v3', auth });
      console.log('✅ Google Calendar inicializado con OAuth2 y Refresh Token.');
    } catch (error) {
      console.error('❌ Error inicializando Google Calendar con OAuth2:', error);
      // No lanzar el error para no bloquear la aplicación si el calendario falla
    }
  }

  async createAppointment(
    request: CreateAppointmentRequest
  ): Promise<AppointmentResult> {
    const result: AppointmentResult = {
      success: false,
      details: {
        databaseCreated: false,
        googleCalendarCreated: false,
        emailSent: false,
        adminNotificationSent: false,
      },
    };

    try {
      // 1. Verificar disponibilidad
      const isAvailable = await this.checkAvailability(
        request.appointmentDate,
        request.appointmentTime
      );
      if (!isAvailable) {
        result.error = 'El horario seleccionado no está disponible';
        return result;
      }

      // 2. Verificar límite diario
      const dailyCount =
        await this.appointmentService.getDailyAppointmentsCount(
          request.appointmentDate
        );
      const maxAppointments = await this.appointmentService.getSystemSetting(
        'max_appointments_per_day'
      );
      const maxPerDay = parseInt(maxAppointments || '3');

      if (dailyCount >= maxPerDay) {
        result.error =
          'Se ha alcanzado el límite máximo de citas para este día';
        return result;
      }

      // 3. Crear cita en la base de datos
      const appointment = await this.appointmentService.createAppointment({
        clientName: request.clientName,
        clientEmail: request.clientEmail,
        serviceType: request.serviceType,
        appointmentDate: request.appointmentDate,
        appointmentTime: request.appointmentTime,
        status: 'confirmed',
        notes: request.notes,
      });
      result.details!.databaseCreated = true;

      // 4. Crear evento en Google Calendar
      try {
        const googleEventId = await this.createGoogleCalendarEvent(appointment);
        if (googleEventId) {
          await this.appointmentService.updateAppointment(appointment.id, {
            googleCalendarEventId: googleEventId,
          });
          result.details!.googleCalendarCreated = true;
        }
      } catch (error) {
        console.error('Error creating Google Calendar event:', error);
        // Continuar aunque falle Google Calendar
      }

      // 5. Enviar email de confirmación
      try {
        const emailSent =
          await this.emailService.sendAppointmentConfirmation(appointment);
        result.details!.emailSent = emailSent;
      } catch (error) {
        console.error('Error sending confirmation email:', error);
        // Continuar aunque falle el email
      }

      // 6. Enviar notificación al admin
      try {
        const adminNotificationSent =
          await this.emailService.sendAdminNotification(appointment);
        result.details!.adminNotificationSent = adminNotificationSent;
      } catch (error) {
        console.error('Error sending admin notification:', error);
        // Continuar aunque falle la notificación
      }

      result.success = true;
      result.appointment = appointment;
    } catch (error) {
      result.error =
        error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error in createAppointment:', error);
    }

    return result;
  }

  async cancelAppointment(appointmentId: string): Promise<boolean> {
    try {
      const appointment =
        await this.appointmentService.getAppointmentById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Actualizar estado en la base de datos
      await this.appointmentService.updateAppointment(appointmentId, {
        status: 'cancelled',
      });

      // Cancelar evento en Google Calendar si existe
      if (appointment.googleCalendarEventId) {
        try {
          await this.calendar.events.delete({
            calendarId: this.calendarId,
            eventId: appointment.googleCalendarEventId,
          });
        } catch (error) {
          console.error('Error deleting Google Calendar event:', error);
        }
      }

      // Enviar email de cancelación
      try {
        await this.emailService.sendAppointmentCancellation(appointment);
      } catch (error) {
        console.error('Error sending cancellation email:', error);
      }

      return true;
    } catch (error) {
      console.error('Error in cancelAppointment:', error);
      return false;
    }
  }

  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newTime: string
  ): Promise<boolean> {
    try {
      const appointment =
        await this.appointmentService.getAppointmentById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Verificar disponibilidad del nuevo horario
      const isAvailable = await this.checkAvailability(newDate, newTime);
      if (!isAvailable) {
        throw new Error('El nuevo horario no está disponible');
      }

      // Actualizar en la base de datos
      await this.appointmentService.updateAppointment(appointmentId, {
        appointmentDate: newDate,
        appointmentTime: newTime,
      });

      // Actualizar evento en Google Calendar si existe
      if (appointment.googleCalendarEventId) {
        try {
          const startDateTime = new Date(`${newDate}T${newTime}:00`);
          const endDateTime = new Date(
            startDateTime.getTime() + 60 * 60 * 1000
          ); // 1 hora

          await this.calendar.events.update({
            calendarId: this.calendarId,
            eventId: appointment.googleCalendarEventId,
            requestBody: {
              start: {
                dateTime: startDateTime.toISOString(),
                timeZone: this.timezone,
              },
              end: {
                dateTime: endDateTime.toISOString(),
                timeZone: this.timezone,
              },
            },
          });
        } catch (error) {
          console.error('Error updating Google Calendar event:', error);
        }
      }

      return true;
    } catch (error) {
      console.error('Error in rescheduleAppointment:', error);
      return false;
    }
  }

  async checkAvailability(date: string, time: string): Promise<boolean> {
    try {
      // Verificar reglas de negocio
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false; // Fines de semana no disponibles
      }

      const hour = parseInt(time.split(':')[0]);
      if (hour === 12) {
        return false; // Hora de almuerzo no disponible
      }

      // Verificar límite diario
      const dailyCount =
        await this.appointmentService.getDailyAppointmentsCount(date);
      const maxAppointments = await this.appointmentService.getSystemSetting(
        'max_appointments_per_day'
      );
      const maxPerDay = parseInt(maxAppointments || '3');

      if (dailyCount >= maxPerDay) {
        return false;
      }

      // Verificar conflictos en la base de datos
      const existingAppointments =
        await this.appointmentService.getAppointmentsByDate(date);
      const hasConflict = existingAppointments.some(
        (apt) => apt.appointmentTime === time && apt.status !== 'cancelled'
      );

      if (hasConflict) {
        return false;
      }

      // Verificar Google Calendar
      const googleAvailable = await this.checkGoogleCalendarAvailability(
        date,
        time
      );
      return googleAvailable;
    } catch (error) {
      console.error('Error in checkAvailability:', error);
      return false;
    }
  }

  async getAvailabilityForDate(date: string): Promise<string[]> {
    try {
      console.log(`🔍 Verificando disponibilidad para: ${date}`);

      // Verificar si es fin de semana
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        console.log(`📅 ${date} es fin de semana, no disponible`);
        return []; // Fines de semana no disponibles
      }

      // Verificar si es fecha pasada
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateObj = new Date(date);
      if (dateObj < today) {
        console.log(`📅 ${date} es fecha pasada, no disponible`);
        return [];
      }

      // Obtener configuraciones con fallback
      const businessHoursStart = await this.getSystemSettingWithFallback('business_hours_start', '09:00');
      const businessHoursEnd = await this.getSystemSettingWithFallback('business_hours_end', '17:00');
      const maxAppointments = await this.getSystemSettingWithFallback('max_appointments_per_day', '3');

      const startHour = parseInt(businessHoursStart.split(':')[0]);
      const endHour = parseInt(businessHoursEnd.split(':')[0]);
      const maxPerDay = parseInt(maxAppointments);

      console.log(`📊 Configuración: ${startHour}:00 - ${endHour}:00, máximo ${maxPerDay} citas/día`);

      // Verificar límite diario
      let dailyCount = 0;
      try {
        dailyCount = await this.appointmentService.getDailyAppointmentsCount(date);
        console.log(`📊 Citas del día: ${dailyCount}/${maxPerDay}`);
      } catch (error) {
        console.error('Error obteniendo conteo diario, usando 0:', error);
        dailyCount = 0;
      }

      if (dailyCount >= maxPerDay) {
        console.log(`❌ Día completo ocupado: ${date}`);
        return []; // Día completo ocupado
      }

      const availableSlots: string[] = [];

      for (let hour = startHour; hour < endHour; hour++) {
        if (hour === 12) continue; // Excluir hora de almuerzo

        const timeString = `${hour.toString().padStart(2, '0')}:00`;

        try {
          const isAvailable = await this.checkAvailability(date, timeString);

          if (isAvailable) {
            availableSlots.push(timeString);
            console.log(`✅ ${timeString} disponible`);
          } else {
            console.log(`❌ ${timeString} no disponible`);
          }
        } catch (error) {
          console.error(
            `Error verificando disponibilidad para ${timeString}:`,
            error
          );
          // Continuar con el siguiente horario
        }
      }

      console.log(`📋 Horarios disponibles para ${date}:`, availableSlots);
      return availableSlots;
    } catch (error) {
      console.error('Error in getAvailabilityForDate:', error);
      // Retornar array vacío en lugar de propagar el error
      return [];
    }
  }

  // Método auxiliar para obtener configuraciones con fallback
  private async getSystemSettingWithFallback(key: string, defaultValue: string): Promise<string> {
    try {
      const value = await this.appointmentService.getSystemSetting(key);
      return value || defaultValue;
    } catch (error) {
      console.error(`Error obteniendo configuración ${key}, usando valor por defecto:`, error);
      return defaultValue;
    }
  }

  private async createGoogleCalendarEvent(
    appointment: Appointment
  ): Promise<string | null> {
    try {
      const startDateTime = new Date(
        `${appointment.appointmentDate}T${appointment.appointmentTime}:00`
      );
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hora

      const event = {
        summary: `Cita con ${appointment.clientName} - ${appointment.serviceType}`,
        description: `Cliente: ${appointment.clientName}\nEmail: ${appointment.clientEmail}\nServicio: ${appointment.serviceType}${appointment.notes ? `\nNotas: ${appointment.notes}` : ''}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: this.timezone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: this.timezone,
        },
        attendees: [{ email: appointment.clientEmail }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 día antes
            { method: 'popup', minutes: 30 }, // 30 minutos antes
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: event,
        sendUpdates: 'all',
      });

      return response.data.id || null;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      return null;
    }
  }

  private async checkGoogleCalendarAvailability(
    date: string,
    time: string
  ): Promise<boolean> {
    try {
      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hora

      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startDateTime.toISOString(),
          timeMax: endDateTime.toISOString(),
          items: [{ id: this.calendarId }],
        },
      });

      const busy = response.data.calendars?.[this.calendarId]?.busy || [];
      return busy.length === 0;
    } catch (error) {
      console.error('Error checking Google Calendar availability:', error);
      return true; // Si no se puede verificar, asumir disponible
    }
  }
}
