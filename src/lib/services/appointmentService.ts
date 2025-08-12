import type { AppointmentRequest } from './googleCalendar.js';
import GoogleCalendarService from './googleCalendar.js';
import CalendlyService from './calendlyService.js';
import EmailService from './emailService.js';

export type ServiceType = 'google-calendar' | 'calendly';

class AppointmentService {
  private calendlyService: CalendlyService;
  private googleCalendarService: GoogleCalendarService;
  private emailService: EmailService;
  private preferredService: ServiceType;

  constructor() {
    this.calendlyService = new CalendlyService();
    this.googleCalendarService = new GoogleCalendarService();
    this.emailService = new EmailService();
    this.preferredService = this.determinePreferredService();
    console.log(`🎯 Using ${this.preferredService} as primary appointment service`);
  }

  private determinePreferredService(): ServiceType {
    const hasGoogleConfig = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    const hasCalendlyConfig = process.env.CALENDLY_API_KEY && process.env.CALENDLY_EVENT_TYPE_URI;
    
    if (hasGoogleConfig) {
      console.log('✅ Google Calendar configuration found - using Google Calendar as primary service');
      return 'google-calendar';
    } else if (hasCalendlyConfig) {
      console.log('✅ Calendly configuration found - using Calendly as fallback service');
      return 'calendly';
    } else {
      console.warn('⚠️ No appointment service configuration found - defaulting to Google Calendar');
      return 'google-calendar';
    }
  }

  async createAppointment(appointmentData: AppointmentRequest): Promise<any> {
    console.log(`🚀 Creating appointment using ${this.preferredService}...`);
    let result;
    
    try {
      if (this.preferredService === 'google-calendar') {
        result = await this.googleCalendarService.createAppointment(appointmentData);
      } else {
        result = await this.calendlyService.createAppointment(appointmentData);
      }
      
      // Enviar emails de confirmación
      await this.sendConfirmationEmails(appointmentData, result);
      return result;
    } catch (error) {
      console.error(`❌ Error creating appointment with ${this.preferredService}:`, error);
      
      // Si falla el servicio principal, intentar con el servicio alternativo
      if (this.preferredService === 'google-calendar' && this.hasCalendlyConfig()) {
        console.log('🔄 Falling back to Calendly service...');
        try {
          result = await this.calendlyService.createAppointment(appointmentData);
          await this.sendConfirmationEmails(appointmentData, result);
          return result;
        } catch (fallbackError) {
          console.error('❌ Fallback service also failed:', fallbackError);
          throw error; // Lanzar el error original
        }
      } else if (this.preferredService === 'calendly' && this.hasGoogleConfig()) {
        console.log('🔄 Falling back to Google Calendar service...');
        try {
          result = await this.googleCalendarService.createAppointment(appointmentData);
          await this.sendConfirmationEmails(appointmentData, result);
          return result;
        } catch (fallbackError) {
          console.error('❌ Fallback service also failed:', fallbackError);
          throw error; // Lanzar el error original
        }
      } else {
        throw error;
      }
    }
  }

  async verifyConnection(): Promise<boolean> {
    console.log(`🔍 Verifying connection with ${this.preferredService}...`);
    
    try {
      if (this.preferredService === 'google-calendar') {
        return await this.googleCalendarService.verifyConnection();
      } else {
        return await this.calendlyService.verifyConnection();
      }
    } catch (error) {
      console.error(`❌ Connection verification failed for ${this.preferredService}:`, error);
      return false;
    }
  }

  async getAvailableSlots(date: Date): Promise<any[]> {
    console.log(`📅 Getting available slots from ${this.preferredService}...`);
    
    try {
      if (this.preferredService === 'google-calendar') {
        return await this.googleCalendarService.getAvailableSlots(date);
      } else {
        return await this.calendlyService.getAvailableSlots(date);
      }
    } catch (error) {
      console.error(`❌ Error getting available slots from ${this.preferredService}:`, error);
      return [];
    }
  }

  async cancelAppointment(eventId: string, reason?: string): Promise<boolean> {
    console.log(`❌ Canceling appointment using ${this.preferredService}...`);
    
    try {
      if (this.preferredService === 'google-calendar') {
        return await this.googleCalendarService.cancelAppointment(eventId, reason);
      } else {
        return await this.calendlyService.cancelAppointment(eventId, reason);
      }
    } catch (error) {
      console.error(`❌ Error canceling appointment with ${this.preferredService}:`, error);
      return false;
    }
  }

  async getEventDetails(eventId: string): Promise<any> {
    console.log(`📋 Getting event details from ${this.preferredService}...`);
    
    try {
      if (this.preferredService === 'google-calendar') {
        return await this.googleCalendarService.getAppointment(eventId);
      } else {
        return await this.calendlyService.getEventDetails(eventId);
      }
    } catch (error) {
      console.error(`❌ Error getting event details from ${this.preferredService}:`, error);
      return null;
    }
  }

  private async sendConfirmationEmails(appointmentData: AppointmentRequest, result: any): Promise<void> {
    try {
      console.log('📧 Sending confirmation emails...');
      
      // Email de confirmación al cliente
      await this.emailService.sendAppointmentConfirmation({
        clientName: appointmentData.name,
        clientEmail: appointmentData.email,
        appointmentDate: appointmentData.startTime,
        appointmentTime: appointmentData.startTime.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        meetLink: result.meetLink,
        eventId: result.id,
        meetingType: appointmentData.meetingType || 'Consulta General',
      });

      // Notificación interna
      await this.emailService.sendInternalNotification({
        clientName: appointmentData.name,
        clientEmail: appointmentData.email,
        appointmentDate: appointmentData.startTime,
        appointmentTime: appointmentData.startTime.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        eventId: result.id,
        meetingType: appointmentData.meetingType || 'Consulta General',
      });

      console.log('✅ Confirmation emails sent successfully');
    } catch (error) {
      console.error('❌ Error sending confirmation emails:', error);
      // No fallar la creación del evento por problemas de email
    }
  }

  private hasGoogleConfig(): boolean {
    return !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);
  }

  private hasCalendlyConfig(): boolean {
    return !!(process.env.CALENDLY_API_KEY && process.env.CALENDLY_EVENT_TYPE_URI);
  }

  getServiceInfo(): any {
    const serviceName = this.preferredService === 'google-calendar' ? 'Google Calendar' : 'Calendly';
    const serviceType = this.preferredService;
    
    const features = {
      'google-calendar': [
        'Creación directa de eventos',
        'Integración con Google Meet',
        'Notificaciones automáticas',
        'Gestión de disponibilidad',
        'Sincronización con Google Calendar'
      ],
      'calendly': [
        'Scheduling links personalizados',
        'Gestión automática de zonas horarias',
        'Formularios personalizables',
        'Integración con múltiples calendarios'
      ]
    };

    return {
      name: serviceName,
      type: serviceType,
      features: features[serviceType] || [],
      config: {
        hasGoogleConfig: this.hasGoogleConfig(),
        hasCalendlyConfig: this.hasCalendlyConfig()
      }
    };
  }
}

let appointmentServiceInstance: AppointmentService | null = null;

export function getAppointmentService(): AppointmentService {
  if (!appointmentServiceInstance) {
    appointmentServiceInstance = new AppointmentService();
  }
  return appointmentServiceInstance;
}

export default AppointmentService;
