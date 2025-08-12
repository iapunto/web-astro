import type { AppointmentRequest } from './googleCalendar';

interface CalendlyEvent {
  uri: string;
  name: string;
  active: boolean;
  slug: string;
  scheduling_url: string;
  duration: number;
  kind: string;
  pooling_type: string;
  type: string;
  color: string;
  internal_note: string;
  description_plain: string;
  description_html: string;
  profile: {
    type: string;
    name: string;
    owner: string;
  };
  secret: boolean;
  booking_method: string;
  external_intake_form: {
    type: string;
    settings: {
      is_enabled: boolean;
      is_required: boolean;
      title: string;
      fields: any[];
    };
  };
  event_guests: {
    event_memberships: any[];
    group_event_guests: any[];
  };
  calendar_event: {
    kind: string;
    start_time: string;
    end_time: string;
    location: string;
    status: string;
    event_type: string;
    event_memberships: any[];
    calendar_event_guests: any[];
  };
  location: {
    type: string;
    location: string;
  };
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
  created_at: string;
  updated_at: string;
  event_memberships: any[];
  custom_questions: any[];
  cancellation_policy: {
    type: string;
    cancellation_window: number;
  };
  cancellation_policy_kind: string;
  cancellation_policy_kind_description: string;
  cancellation_policy_kind_description_short: string;
}

interface CalendlySchedulingLink {
  booking_url: string;
  owner: string;
  event_type: string;
  max_event_count: number;
  owner_type: string;
  owner_uri: string;
  event_type_uri: string;
}

interface CalendlyInvitee {
  uri: string;
  name: string;
  email: string;
  status: string;
  timezone: string;
  event: string;
  questions_and_answers: any[];
  questions_and_responses: any[];
  tracking: {
    utm_campaign: string;
    utm_source: string;
    utm_medium: string;
    utm_content: string;
    utm_term: string;
    salesforce_uuid: string;
  };
  text_reminder_number: string;
  rescheduled: boolean;
  old_invitee: string;
  new_invitee: string;
  cancel_url: string;
  reschedule_url: string;
  payment: any;
  no_show: any;
  reconfirmation: any;
  created_at: string;
  updated_at: string;
  event_memberships: any[];
  global_destination_url: string;
  calendar_event: {
    kind: string;
    start_time: string;
    end_time: string;
    location: string;
    status: string;
    event_type: string;
    event_memberships: any[];
    calendar_event_guests: any[];
  };
  location: {
    type: string;
    location: string;
  };
}

class CalendlyService {
  private apiKey: string;
  private baseUrl: string;
  private eventTypeUri: string;

  constructor() {
    this.apiKey = process.env.CALENDLY_API_KEY || '';
    this.baseUrl = 'https://api.calendly.com';
    this.eventTypeUri = process.env.CALENDLY_EVENT_TYPE_URI || '';
    
    if (!this.apiKey) {
      console.warn('⚠️ CALENDLY_API_KEY no está configurada');
    }
    if (!this.eventTypeUri) {
      console.warn('⚠️ CALENDLY_EVENT_TYPE_URI no está configurada');
    }
  }

  /**
   * Verificar la conexión con Calendly
   */
  async verifyConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Calendly connection verified');
        return true;
      } else {
        console.error('❌ Calendly connection failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Calendly connection error:', error);
      return false;
    }
  }

  /**
   * Obtener slots disponibles para una fecha
   */
  async getAvailableSlots(date: Date): Promise<any[]> {
    try {
      console.log('🔍 Getting available slots from Calendly...');
      
      // Convertir fecha a formato ISO
      const startTime = new Date(date);
      startTime.setHours(0, 0, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(23, 59, 59, 999);

      const response = await fetch(
        `${this.baseUrl}/event_type_available_times?event_type=${this.eventTypeUri}&start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Calendly API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Available slots retrieved from Calendly');
      
      return data.available_times || [];
    } catch (error) {
      console.error('❌ Error getting available slots:', error);
      return [];
    }
  }

  /**
   * Crear una cita usando Calendly
   */
  async createAppointment(appointmentData: AppointmentRequest): Promise<any> {
    try {
      console.log('🚀 Creating appointment with Calendly...');
      
      const {
        name,
        email,
        startTime,
        endTime,
        description,
        meetingType
      } = appointmentData;

      // Crear el payload para Calendly
      const payload = {
        event_type: this.eventTypeUri,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        invitee: {
          name: name,
          email: email,
          timezone: 'America/Mexico_City'
        },
        questions_and_answers: [
          {
            question: 'Tipo de consulta',
            answer: meetingType
          },
          {
            question: 'Descripción del proyecto',
            answer: description || 'Sin descripción adicional'
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}/scheduling_links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Calendly API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data: CalendlySchedulingLink = await response.json();
      
      console.log('✅ Appointment created successfully with Calendly');
      console.log('📅 Booking URL:', data.booking_url);
      
      return {
        id: data.booking_url.split('/').pop() || 'calendly-event',
        summary: `Consulta con ${name}`,
        start: startTime,
        end: endTime,
        meetLink: data.booking_url,
        calendlyData: data
      };
    } catch (error) {
      console.error('❌ Error creating appointment with Calendly:', error);
      throw error;
    }
  }

  /**
   * Obtener detalles de un evento específico
   */
  async getEventDetails(eventUri: string): Promise<CalendlyEvent | null> {
    try {
      const response = await fetch(`${this.baseUrl}/scheduled_events/${eventUri}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error getting event details:', error);
      return null;
    }
  }

  /**
   * Cancelar una cita
   */
  async cancelAppointment(eventUri: string, reason?: string): Promise<boolean> {
    try {
      const payload = {
        reason: reason || 'Cancelado por el cliente'
      };

      const response = await fetch(`${this.baseUrl}/scheduled_events/${eventUri}/cancellation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error canceling appointment:', error);
      return false;
    }
  }
}

export default CalendlyService;
