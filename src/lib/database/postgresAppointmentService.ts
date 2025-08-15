import {
  getPool,
  initializeDatabase,
  Appointment,
  EmailTemplate,
  EmailLog,
  SystemSettings,
} from './postgresSchema.js';
import { v4 as uuidv4 } from 'uuid';

export class PostgresAppointmentService {
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private settingsCache: Map<string, string> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  constructor() {
    // No inicializar automáticamente en el constructor
  }

  private async initializeDatabase() {
    if (this.initialized) {
      return;
    }

    if (this.initializationPromise) {
      // Si ya hay una inicialización en curso, esperar a que termine
      await this.initializationPromise;
      return;
    }

    // Crear una nueva promesa de inicialización
    this.initializationPromise = this.performInitialization();

    try {
      await this.initializationPromise;
      this.initialized = true;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async performInitialization() {
    try {
      await initializeDatabase();
    } catch (error) {
      console.error('Error en inicialización de base de datos:', error);
      // No lanzar el error, permitir que el sistema continúe con valores por defecto
    }
  }

  private async getClient() {
    try {
      await this.initializeDatabase();
      return getPool().connect();
    } catch (error) {
      console.error('Error obteniendo cliente de base de datos:', error);
      throw error;
    }
  }

  // Métodos para citas
  async createAppointment(
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Appointment> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        `
        INSERT INTO appointments (
          client_name, client_email, service_type, appointment_date, 
          appointment_time, status, google_calendar_event_id, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
        [
          appointmentData.clientName,
          appointmentData.clientEmail,
          appointmentData.serviceType,
          appointmentData.appointmentDate,
          appointmentData.appointmentTime,
          appointmentData.status,
          appointmentData.googleCalendarEventId,
          appointmentData.notes,
        ]
      );

      return this.mapRowToAppointment(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        'SELECT * FROM appointments WHERE id = $1',
        [id]
      );
      return result.rows.length > 0
        ? this.mapRowToAppointment(result.rows[0])
        : null;
    } finally {
      client.release();
    }
  }

  async updateAppointment(
    id: string,
    updates: Partial<Appointment>
  ): Promise<Appointment> {
    const client = await this.getClient();

    try {
      const fields = Object.keys(updates).filter(
        (key) => key !== 'id' && key !== 'createdAt'
      );
      const setClause = fields
        .map((field, index) => `${this.camelToSnake(field)} = $${index + 2}`)
        .join(', ');

      const values = [
        id,
        ...fields.map((field) => updates[field as keyof Appointment]),
      ];

      const result = await client.query(
        `
        UPDATE appointments 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `,
        values
      );

      if (result.rows.length === 0) {
        throw new Error(`Appointment with id ${id} not found`);
      }

      return this.mapRowToAppointment(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        'DELETE FROM appointments WHERE id = $1',
        [id]
      );
      return (result.rowCount || 0) > 0;
    } finally {
      client.release();
    }
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        'SELECT * FROM appointments WHERE appointment_date = $1 ORDER BY appointment_time',
        [date]
      );
      return result.rows.map((row) => this.mapRowToAppointment(row));
    } finally {
      client.release();
    }
  }

  async getAppointmentsCountByDate(date: string): Promise<number> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        'SELECT COUNT(*) as count FROM appointments WHERE appointment_date = $1 AND status != $2',
        [date, 'cancelled']
      );
      return parseInt(result.rows[0].count);
    } finally {
      client.release();
    }
  }

  async getAppointmentByGoogleEventId(
    googleEventId: string
  ): Promise<Appointment | null> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        'SELECT * FROM appointments WHERE google_event_id = $1',
        [googleEventId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToAppointment(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getDailyAppointmentsCount(date: string): Promise<number> {
    return this.getAppointmentsCountByDate(date);
  }

  // Métodos para configuraciones del sistema
  async getSystemSetting(key: string): Promise<string | null> {
    // Verificar cache primero
    const cached = this.settingsCache.get(key);
    const expiry = this.cacheExpiry.get(key);
    
    if (cached && expiry && Date.now() < expiry) {
      return cached;
    }

    try {
      const client = await this.getClient();

      try {
        const result = await client.query(
          'SELECT value FROM system_settings WHERE key = $1',
          [key]
        );
        
        const value = result.rows.length > 0 ? result.rows[0].value : null;
        
        // Actualizar cache
        if (value) {
          this.settingsCache.set(key, value);
          this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
        }
        
        return value;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(`Error obteniendo configuración ${key}:`, error);
      
      // Retornar valores por defecto en caso de error
      const defaults: { [key: string]: string } = {
        'business_hours_start': '09:00',
        'business_hours_end': '17:00',
        'max_appointments_per_day': '3',
        'timezone': 'America/Bogota',
        'lunch_break_start': '12:00',
        'lunch_break_end': '13:00'
      };
      
      return defaults[key] || null;
    }
  }

  async setSystemSetting(
    key: string,
    value: string,
    description?: string
  ): Promise<void> {
    const client = await this.getClient();

    try {
      await client.query(
        `
        INSERT INTO system_settings (key, value, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          description = EXCLUDED.description,
          updated_at = CURRENT_TIMESTAMP
      `,
        [key, value, description]
      );
    } finally {
      client.release();
    }
  }

  async getAllSystemSettings(): Promise<SystemSettings[]> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        'SELECT * FROM system_settings ORDER BY key'
      );
      return result.rows.map((row) => ({
        id: row.id,
        key: row.key,
        value: row.value,
        description: row.description,
        updatedAt: row.updated_at,
      }));
    } finally {
      client.release();
    }
  }

  // Métodos para plantillas de email
  async getEmailTemplate(type: string): Promise<EmailTemplate | null> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        'SELECT * FROM email_templates WHERE type = $1 AND is_active = true LIMIT 1',
        [type]
      );
      return result.rows.length > 0
        ? this.mapRowToEmailTemplate(result.rows[0])
        : null;
    } finally {
      client.release();
    }
  }

  async createEmailTemplate(
    template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<EmailTemplate> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        `
        INSERT INTO email_templates (name, subject, body, type, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
        [
          template.name,
          template.subject,
          template.body,
          template.type,
          template.isActive,
        ]
      );

      return this.mapRowToEmailTemplate(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async updateEmailTemplate(
    id: string,
    updates: Partial<EmailTemplate>
  ): Promise<EmailTemplate> {
    const client = await this.getClient();

    try {
      const fields = Object.keys(updates).filter(
        (key) => key !== 'id' && key !== 'createdAt'
      );
      const setClause = fields
        .map((field, index) => `${this.camelToSnake(field)} = $${index + 2}`)
        .join(', ');

      const values = [
        id,
        ...fields.map((field) => updates[field as keyof EmailTemplate]),
      ];

      const result = await client.query(
        `
        UPDATE email_templates 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `,
        values
      );

      if (result.rows.length === 0) {
        throw new Error(`Email template with id ${id} not found`);
      }

      return this.mapRowToEmailTemplate(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // Métodos para logs de email
  async createEmailLog(
    log: Omit<EmailLog, 'id' | 'createdAt'>
  ): Promise<EmailLog> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        `
        INSERT INTO email_logs (
          appointment_id, email_type, recipient_email, subject, body, status, error_message, sent_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
        [
          log.appointmentId,
          log.emailType,
          log.recipientEmail,
          log.subject,
          log.body,
          log.status,
          log.errorMessage,
          log.sentAt,
        ]
      );

      return this.mapRowToEmailLog(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getEmailLogsByAppointmentId(
    appointmentId: string
  ): Promise<EmailLog[]> {
    const client = await this.getClient();

    try {
      const result = await client.query(
        'SELECT * FROM email_logs WHERE appointment_id = $1 ORDER BY created_at DESC',
        [appointmentId]
      );
      return result.rows.map((row) => this.mapRowToEmailLog(row));
    } finally {
      client.release();
    }
  }

  // Métodos de utilidad
  private mapRowToAppointment(row: any): Appointment {
    return {
      id: row.id,
      clientName: row.client_name,
      clientEmail: row.client_email,
      serviceType: row.service_type,
      appointmentDate: row.appointment_date,
      appointmentTime: row.appointment_time,
      status: row.status,
      googleCalendarEventId: row.google_calendar_event_id,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapRowToEmailTemplate(row: any): EmailTemplate {
    return {
      id: row.id,
      name: row.name,
      subject: row.subject,
      body: row.body,
      type: row.type,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapRowToEmailLog(row: any): EmailLog {
    return {
      id: row.id,
      appointmentId: row.appointment_id,
      emailType: row.email_type,
      recipientEmail: row.recipient_email,
      subject: row.subject,
      body: row.body,
      status: row.status,
      errorMessage: row.error_message,
      sentAt: row.sent_at,
      createdAt: row.created_at,
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
