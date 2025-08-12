import type { AppointmentRequest } from './googleCalendar';
import GoogleCalendarService from './googleCalendar';
import CalendlyService from './calendlyService';
import EmailService from './emailService';

export type ServiceType = 'calendly' | 'google-calendar';

class AppointmentService {
  private calendlyService: CalendlyService;
  private googleCalendarService: GoogleCalendarService;
  private emailService: EmailService;
  private preferredService: ServiceType;

  constructor() {
    this.calendlyService = new CalendlyService();
    this.googleCalendarService = new GoogleCalendarService();
    this.emailService = new EmailService();
    
    // Determinar qué servicio usar basado en las variables de entorno
    this.preferredService = this.determinePreferredService();
    
    console.log(`🎯 Using ${this.preferredService} as primary appointment service`);
  }

  /**
   * Determinar qué servicio usar basado en la configuración
   */
  private determinePreferredService(): ServiceType {
    const hasCalendlyConfig = process.env.CALENDLY_API_KEY && process.env.CALENDLY_EVENT_TYPE_URI;
    const hasGoogleConfig = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    
    if (hasCalendlyConfig) {
      console.log('✅ Calendly configuration found - using Calendly as primary service');
      return 'calendly';
    } else if (hasGoogleConfig) {
      console.log('✅ Google Calendar configuration found - using Google Calendar as primary service');
      return 'google-calendar';
    } else {
      console.warn('⚠️ No appointment service configuration found - defaulting to Calendly');
      return 'calendly';
    }
  }

  /**
   * Verificar la conexión del servicio activo
   */
  async verifyConnection(): Promise<boolean> {
    try {
      if (this.preferredService === 'calendly') {
        return await this.calendlyService.verifyConnection();
      } else {
        return await this.googleCalendarService.verifyConnection();
      }
    } catch (error) {
      console.error('❌ Connection verification failed:', error);
      return false;
    }
  }

  /**
   * Obtener slots disponibles
   */
  async getAvailableSlots(date: Date): Promise<any[]> {
    try {
      if (this.preferredService === 'calendly') {
        return await this.calendlyService.getAvailableSlots(date);
      } else {
        return await this.googleCalendarService.getAvailableSlots(date);
      }
    } catch (error) {
      console.error('❌ Error getting available slots:', error);
      return [];
    }
  }

  /**
   * Crear una cita
   */
  async createAppointment(appointmentData: AppointmentRequest): Promise<any> {
    try {
      console.log(`🚀 Creating appointment using ${this.preferredService}...`);
      
      let result;
      
      if (this.preferredService === 'calendly') {
        result = await this.calendlyService.createAppointment(appointmentData);
      } else {
        result = await this.googleCalendarService.createAppointment(appointmentData);
      }

      // Enviar emails de confirmación
      await this.sendConfirmationEmails(appointmentData, result);
      
      return result;
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Enviar emails de confirmación
   */
  private async sendConfirmationEmails(appointmentData: AppointmentRequest, result: any): Promise<void> {
    try {
      const {
        name,
        email,
        startTime,
        endTime,
        meetingType,
        description
      } = appointmentData;

      const appointmentTime = startTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Mexico_City'
      });

      const emailData = {
        clientName: name,
        clientEmail: email,
        appointmentDate: startTime,
        appointmentTime: appointmentTime,
        meetLink: result.meetLink,
        eventId: result.id,
        meetingType: meetingType || 'Consulta General'
      };

      // Enviar confirmación al cliente
      await this.emailService.sendAppointmentConfirmation(emailData);
      
      // Enviar notificación interna
      await this.emailService.sendInternalNotification(emailData);
      
      console.log('✅ Confirmation emails sent successfully');
    } catch (error) {
      console.error('❌ Error sending confirmation emails:', error);
      // No lanzar error para no afectar la creación de la cita
    }
  }

  /**
   * Cancelar una cita
   */
  async cancelAppointment(eventId: string, reason?: string): Promise<boolean> {
    try {
      if (this.preferredService === 'calendly') {
        return await this.calendlyService.cancelAppointment(eventId, reason);
      } else {
        return await this.googleCalendarService.cancelAppointment(eventId, reason);
      }
    } catch (error) {
      console.error('❌ Error canceling appointment:', error);
      return false;
    }
  }

  /**
   * Obtener detalles de un evento
   */
  async getEventDetails(eventId: string): Promise<any> {
    try {
      if (this.preferredService === 'calendly') {
        return await this.calendlyService.getEventDetails(eventId);
      } else {
        return await this.googleCalendarService.getEventDetails(eventId);
      }
    } catch (error) {
      console.error('❌ Error getting event details:', error);
      return null;
    }
  }

  /**
   * Obtener información del servicio activo
   */
  getServiceInfo(): { type: ServiceType; name: string; features: string[] } {
    if (this.preferredService === 'calendly') {
      return {
        type: 'calendly',
        name: 'Calendly',
        features: [
          'Gestión automática de zonas horarias',
          'Integración automática con Google Meet',
          'Notificaciones automáticas',
          'Gestión de conflictos',
          'Formularios personalizables'
        ]
      };
    } else {
      return {
        type: 'google-calendar',
        name: 'Google Calendar',
        features: [
          'Integración directa con Google Calendar',
          'Creación de eventos nativos',
          'Sincronización automática',
          'Gestión de disponibilidad'
        ]
      };
    }
  }
}

// Instancia singleton
let appointmentServiceInstance: AppointmentService | null = null;

export function getAppointmentService(): AppointmentService {
  if (!appointmentServiceInstance) {
    appointmentServiceInstance = new AppointmentService();
  }
  return appointmentServiceInstance;
}

export default AppointmentService;
