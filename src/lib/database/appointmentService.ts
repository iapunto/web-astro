import Database from 'better-sqlite3';
import { initializeDatabase, Appointment, EmailTemplate, EmailLog, SystemSettings } from './schema.js';
import { v4 as uuidv4 } from 'uuid';

export class AppointmentService {
  private db: Database.Database | null = null;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    if (!this.db) {
      this.db = await initializeDatabase();
    }
  }

  private async getDb(): Promise<Database.Database> {
    if (!this.db) {
      await this.initializeDatabase();
    }
    return this.db!;
  }

  // ===== MÉTODOS DE CITAS =====

  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'emailSent' | 'googleCalendarSynced'>): Promise<Appointment> {
    const db = await this.getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO appointments (
        id, clientName, clientEmail, clientPhone, appointmentDate, appointmentTime,
        appointmentDateTime, duration, serviceType, description, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      appointmentData.clientName,
      appointmentData.clientEmail,
      appointmentData.clientPhone || null,
      appointmentData.appointmentDate,
      appointmentData.appointmentTime,
      appointmentData.appointmentDateTime,
      appointmentData.duration,
      appointmentData.serviceType,
      appointmentData.description || null,
      appointmentData.status,
      now,
      now
    );

    if (result.changes === 0) {
      throw new Error('No se pudo crear la cita');
    }

    const createdAppointment = await this.getAppointmentById(id);
    if (!createdAppointment) {
      throw new Error('No se pudo recuperar la cita creada');
    }

    return createdAppointment;
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    const db = await this.getDb();
    const stmt = db.prepare('SELECT * FROM appointments WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      ...row,
      emailSent: Boolean(row.emailSent),
      googleCalendarSynced: Boolean(row.googleCalendarSynced)
    };
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const db = await this.getDb();
    const stmt = db.prepare('SELECT * FROM appointments WHERE appointmentDate = ? ORDER BY appointmentTime');
    const rows = stmt.all(date) as any[];

    return rows.map(row => ({
      ...row,
      emailSent: Boolean(row.emailSent),
      googleCalendarSynced: Boolean(row.googleCalendarSynced)
    }));
  }

  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT * FROM appointments 
      WHERE appointmentDate BETWEEN ? AND ? 
      ORDER BY appointmentDate, appointmentTime
    `);
    const rows = stmt.all(startDate, endDate) as any[];

    return rows.map(row => ({
      ...row,
      emailSent: Boolean(row.emailSent),
      googleCalendarSynced: Boolean(row.googleCalendarSynced)
    }));
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const db = await this.getDb();
    const now = new Date().toISOString();
    const current = await this.getAppointmentById(id);
    
    if (!current) {
      throw new Error('Cita no encontrada');
    }

    const updatedAppointment = { ...current, ...updates, updatedAt: now };
    
    const stmt = db.prepare(`
      UPDATE appointments SET
        clientName = ?, clientEmail = ?, clientPhone = ?, appointmentDate = ?,
        appointmentTime = ?, appointmentDateTime = ?, duration = ?, serviceType = ?,
        description = ?, googleCalendarEventId = ?, status = ?, emailSent = ?,
        googleCalendarSynced = ?, updatedAt = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      updatedAppointment.clientName,
      updatedAppointment.clientEmail,
      updatedAppointment.clientPhone || null,
      updatedAppointment.appointmentDate,
      updatedAppointment.appointmentTime,
      updatedAppointment.appointmentDateTime,
      updatedAppointment.duration,
      updatedAppointment.serviceType,
      updatedAppointment.description || null,
      updatedAppointment.googleCalendarEventId || null,
      updatedAppointment.status,
      updatedAppointment.emailSent ? 1 : 0,
      updatedAppointment.googleCalendarSynced ? 1 : 0,
      updatedAppointment.updatedAt,
      id
    );

    if (result.changes === 0) {
      throw new Error('No se pudo actualizar la cita');
    }

    return updatedAppointment;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const db = await this.getDb();
    const stmt = db.prepare('DELETE FROM appointments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async getAppointmentsCountByDate(date: string): Promise<number> {
    const db = await this.getDb();
    const stmt = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE appointmentDate = ?');
    const result = stmt.get(date) as { count: number };
    return result.count;
  }

  async getAppointmentsByStatus(status: Appointment['status']): Promise<Appointment[]> {
    const db = await this.getDb();
    const stmt = db.prepare('SELECT * FROM appointments WHERE status = ? ORDER BY appointmentDate, appointmentTime');
    const rows = stmt.all(status) as any[];

    return rows.map(row => ({
      ...row,
      emailSent: Boolean(row.emailSent),
      googleCalendarSynced: Boolean(row.googleCalendarSynced)
    }));
  }

  // ===== MÉTODOS DE CONFIGURACIÓN =====

  async getSystemSetting(key: string): Promise<string | null> {
    const db = await this.getDb();
    const stmt = db.prepare('SELECT value FROM system_settings WHERE key = ?');
    const result = stmt.get(key) as { value: string } | undefined;
    return result?.value || null;
  }

  async setSystemSetting(key: string, value: string, description?: string): Promise<void> {
    const db = await this.getDb();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO system_settings (key, value, description, updatedAt)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(key, value, description || null, now);
  }

  async getAllSystemSettings(): Promise<SystemSettings[]> {
    const db = await this.getDb();
    const stmt = db.prepare('SELECT * FROM system_settings ORDER BY key');
    return stmt.all() as SystemSettings[];
  }

  // ===== MÉTODOS DE PLANTILLAS DE EMAIL =====

  async getEmailTemplate(id: string): Promise<EmailTemplate | null> {
    const db = await this.getDb();
    const stmt = db.prepare('SELECT * FROM email_templates WHERE id = ? AND isActive = 1');
    const row = stmt.get(id) as any;
    
    if (!row) return null;

    return {
      ...row,
      isActive: Boolean(row.isActive)
    };
  }

  async getAllEmailTemplates(): Promise<EmailTemplate[]> {
    const db = await this.getDb();
    const stmt = db.prepare('SELECT * FROM email_templates ORDER BY name');
    const rows = stmt.all() as any[];

    return rows.map(row => ({
      ...row,
      isActive: Boolean(row.isActive)
    }));
  }

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const db = await this.getDb();
    const now = new Date().toISOString();
    const current = await this.getEmailTemplate(id);
    
    if (!current) {
      throw new Error('Plantilla de email no encontrada');
    }

    const updatedTemplate = { ...current, ...updates, updatedAt: now };
    
    const stmt = db.prepare(`
      UPDATE email_templates SET
        name = ?, subject = ?, htmlContent = ?, textContent = ?, isActive = ?, updatedAt = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      updatedTemplate.name,
      updatedTemplate.subject,
      updatedTemplate.htmlContent,
      updatedTemplate.textContent,
      updatedTemplate.isActive ? 1 : 0,
      updatedTemplate.updatedAt,
      id
    );

    if (result.changes === 0) {
      throw new Error('No se pudo actualizar la plantilla de email');
    }

    return updatedTemplate;
  }

  // ===== MÉTODOS DE LOGS DE EMAIL =====

  async createEmailLog(logData: Omit<EmailLog, 'id' | 'sentAt'>): Promise<EmailLog> {
    const db = await this.getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO email_logs (
        id, appointmentId, emailType, recipientEmail, subject, content, sentAt, status, errorMessage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      logData.appointmentId,
      logData.emailType,
      logData.recipientEmail,
      logData.subject,
      logData.content,
      now,
      logData.status,
      logData.errorMessage || null
    );

    if (result.changes === 0) {
      throw new Error('No se pudo crear el log de email');
    }

    return {
      ...logData,
      id,
      sentAt: now
    };
  }

  async getEmailLogsByAppointment(appointmentId: string): Promise<EmailLog[]> {
    const db = await this.getDb();
    const stmt = db.prepare('SELECT * FROM email_logs WHERE appointmentId = ? ORDER BY sentAt DESC');
    return stmt.all(appointmentId) as EmailLog[];
  }

  async getEmailLogsByDateRange(startDate: string, endDate: string): Promise<EmailLog[]> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT * FROM email_logs 
      WHERE DATE(sentAt) BETWEEN ? AND ? 
      ORDER BY sentAt DESC
    `);
    return stmt.all(startDate, endDate) as EmailLog[];
  }

  // ===== MÉTODOS DE UTILIDAD =====

  async checkAvailability(date: string, time: string): Promise<boolean> {
    const db = await this.getDb();
    // Verificar si ya existe una cita en esa fecha y hora
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM appointments 
      WHERE appointmentDate = ? AND appointmentTime = ? AND status != 'cancelled'
    `);
    const result = stmt.get(date, time) as { count: number };
    
    return result.count === 0;
  }

  async getDailyAppointmentsCount(date: string): Promise<number> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM appointments 
      WHERE appointmentDate = ? AND status != 'cancelled'
    `);
    const result = stmt.get(date) as { count: number };
    return result.count;
  }

  async getUpcomingAppointments(limit: number = 10): Promise<Appointment[]> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT * FROM appointments 
      WHERE appointmentDateTime > ? AND status != 'cancelled'
      ORDER BY appointmentDateTime 
      LIMIT ?
    `);
    const now = new Date().toISOString();
    const rows = stmt.all(now, limit) as any[];

    return rows.map(row => ({
      ...row,
      emailSent: Boolean(row.emailSent),
      googleCalendarSynced: Boolean(row.googleCalendarSynced)
    }));
  }

  async getPendingAppointments(): Promise<Appointment[]> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT * FROM appointments 
      WHERE status = 'pending' 
      ORDER BY appointmentDateTime
    `);
    const rows = stmt.all() as any[];

    return rows.map(row => ({
      ...row,
      emailSent: Boolean(row.emailSent),
      googleCalendarSynced: Boolean(row.googleCalendarSynced)
    }));
  }

  // ===== MÉTODOS DE ESTADÍSTICAS =====

  async getAppointmentStats(startDate: string, endDate: string) {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM appointments 
      WHERE appointmentDate BETWEEN ? AND ?
    `);
    
    return stmt.get(startDate, endDate) as {
      total: number;
      confirmed: number;
      cancelled: number;
      completed: number;
      pending: number;
    };
  }

  async getServiceTypeStats(startDate: string, endDate: string) {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT 
        serviceType,
        COUNT(*) as count
      FROM appointments 
      WHERE appointmentDate BETWEEN ? AND ? AND status != 'cancelled'
      GROUP BY serviceType
      ORDER BY count DESC
    `);
    
    return stmt.all(startDate, endDate) as Array<{
      serviceType: string;
      count: number;
    }>;
  }

  // Cerrar conexión a la base de datos
  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
}
