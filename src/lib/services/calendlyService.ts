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

interface CalendlyAvailableTime {
  start_time: string;
  end_time: string;
  status: string;
}

interface CalendlyAvailableTimesResponse {
  available_times: CalendlyAvailableTime[];
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
   * Verificar la conexión con Calendly API v2
   */
  async verifyConnection(): Promise<boolean> {
    try {
      console.log('🔍 Verifying Calendly API v2 connection...');
      
      // Usar el endpoint de usuario para verificar autenticación
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Calendly API v2 connection verified');
        console.log('👤 User:', userData.resource?.name || 'Unknown');
        return true;
      } else {
        console.error('❌ Calendly connection failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Calendly connection error:', error);
      return false;
    }
  }

  /**
   * Obtener slots disponibles para una fecha usando Calendly API v2
   */
  async getAvailableSlots(date: Date): Promise<any[]> {
    try {
      console.log('🔍 Getting available slots from Calendly API v2...');
      
      // Convertir fecha a formato ISO
      const startTime = new Date(date);
      startTime.setHours(0, 0, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(23, 59, 59, 999);

      // Usar el endpoint correcto de Calendly API v2
      const url = new URL(`${this.baseUrl}/event_type_available_times`);
      url.searchParams.append('event_type', this.eventTypeUri);
      url.searchParams.append('start_time', startTime.toISOString());
      url.searchParams.append('end_time', endTime.toISOString());

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Calendly API error:', response.status, errorText);
        throw new Error(`Calendly API error: ${response.status} - ${errorText}`);
      }

      const data: CalendlyAvailableTimesResponse = await response.json();
      console.log('✅ Available slots retrieved from Calendly API v2');
      console.log(`📅 Found ${data.available_times?.length || 0} available slots`);
      
      return data.available_times || [];
    } catch (error) {
      console.error('❌ Error getting available slots:', error);
      return [];
    }
  }

  /**
   * Crear una cita usando Calendly API v2
   * Nota: Calendly no permite crear eventos directamente via API
   * En su lugar, creamos un scheduling link que el usuario puede usar
   */
  async createAppointment(appointmentData: AppointmentRequest): Promise<any> {
    try {
      console.log('🚀 Creating Calendly scheduling link...');
      
      const {
        name,
        email,
        startTime,
        endTime,
        description,
        meetingType
      } = appointmentData;

      // Calendly no permite crear eventos directamente via API
      // En su lugar, creamos un scheduling link personalizado
      const payload = {
        max_event_count: 1,
        owner: this.eventTypeUri.split('/').pop() || 'default',
        owner_type: 'EventType'
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
        console.error('❌ Calendly API error:', response.status, errorData);
        throw new Error(`Calendly API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data: CalendlySchedulingLink = await response.json();
      
      console.log('✅ Calendly scheduling link created successfully');
      console.log('📅 Booking URL:', data.booking_url);
      
      // Crear un evento simulado para mantener compatibilidad
      return {
        id: `calendly-${Date.now()}`,
        summary: `Consulta con ${name}`,
        start: startTime,
        end: endTime,
        meetLink: data.booking_url,
        calendlyData: data,
        isCalendlyLink: true
      };
    } catch (error) {
      console.error('❌ Error creating Calendly scheduling link:', error);
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

  /**
   * Obtener información del usuario de Calendly
   */
  async getUserInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error getting user info:', error);
      return null;
    }
  }

  /**
   * Obtener tipos de eventos disponibles
   */
  async getEventTypes(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/event_types`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get event types: ${response.status}`);
      }

      const data = await response.json();
      return data.collection || [];
    } catch (error) {
      console.error('❌ Error getting event types:', error);
      return [];
    }
  }
}

export default CalendlyService;
