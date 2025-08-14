import Database from 'better-sqlite3';
import path from 'path';

// Tipos para TypeScript
export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  appointmentDateTime: string; // ISO string
  duration: number; // minutos
  serviceType: string; // 'Desarrollo Web', 'Marketing Digital', 'Consulta General', etc.
  description?: string;
  googleCalendarEventId?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  emailSent: boolean;
  googleCalendarSynced: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailLog {
  id: string;
  appointmentId: string;
  emailType: 'confirmation' | 'reminder' | 'cancellation';
  recipientEmail: string;
  subject: string;
  content: string;
  sentAt: string;
  status: 'sent' | 'failed';
  errorMessage?: string;
}

export interface SystemSettings {
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

// Inicializar base de datos
export async function initializeDatabase(): Promise<Database.Database> {
  const dbPath = path.join(process.cwd(), 'data', 'appointments.db');
  
  // Crear directorio si no existe
  const fs = await import('fs');
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const db = new Database(dbPath);
  
  // Habilitar foreign keys
  db.pragma('foreign_keys = ON');
  
  // Crear tablas
  createTables(db);
  
  return db;
}

function createTables(db: Database.Database) {
  // Tabla de citas
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      clientName TEXT NOT NULL,
      clientEmail TEXT NOT NULL,
      clientPhone TEXT,
      appointmentDate TEXT NOT NULL,
      appointmentTime TEXT NOT NULL,
      appointmentDateTime TEXT NOT NULL,
      duration INTEGER NOT NULL DEFAULT 60,
      serviceType TEXT NOT NULL,
      description TEXT,
      googleCalendarEventId TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      emailSent BOOLEAN NOT NULL DEFAULT 0,
      googleCalendarSynced BOOLEAN NOT NULL DEFAULT 0
    )
  `);
  
  // Tabla de plantillas de email
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      htmlContent TEXT NOT NULL,
      textContent TEXT NOT NULL,
      isActive BOOLEAN NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
  
  // Tabla de logs de emails
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_logs (
      id TEXT PRIMARY KEY,
      appointmentId TEXT NOT NULL,
      emailType TEXT NOT NULL CHECK (emailType IN ('confirmation', 'reminder', 'cancellation')),
      recipientEmail TEXT NOT NULL,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      sentAt TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
      errorMessage TEXT,
      FOREIGN KEY (appointmentId) REFERENCES appointments (id) ON DELETE CASCADE
    )
  `);
  
  // Tabla de configuraciones del sistema
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updatedAt TEXT NOT NULL
    )
  `);
  
  // Crear índices para mejor rendimiento
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments (appointmentDate);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status);
    CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments (clientEmail);
    CREATE INDEX IF NOT EXISTS idx_appointments_google_id ON appointments (googleCalendarEventId);
    CREATE INDEX IF NOT EXISTS idx_email_logs_appointment ON email_logs (appointmentId);
    CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs (sentAt);
  `);
  
  // Insertar configuraciones por defecto
  insertDefaultSettings(db);
  
  // Insertar plantillas de email por defecto
  insertDefaultEmailTemplates(db);
}

function insertDefaultSettings(db: Database.Database) {
  const settings = [
    {
      key: 'business_hours_start',
      value: '09:00',
      description: 'Hora de inicio del horario de trabajo'
    },
    {
      key: 'business_hours_end',
      value: '17:00',
      description: 'Hora de fin del horario de trabajo'
    },
    {
      key: 'timezone',
      value: 'America/Bogota',
      description: 'Zona horaria del negocio'
    },
    {
      key: 'max_appointments_per_day',
      value: '3',
      description: 'Máximo número de citas por día'
    },
    {
      key: 'appointment_duration',
      value: '60',
      description: 'Duración de las citas en minutos'
    },
    {
      key: 'email_from_name',
      value: 'IA Punto',
      description: 'Nombre del remitente de emails'
    },
    {
      key: 'email_from_address',
      value: 'hola@iapunto.com',
      description: 'Dirección de email del remitente'
    }
  ];
  
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO system_settings (key, value, description, updatedAt)
    VALUES (?, ?, ?, ?)
  `);
  
  const now = new Date().toISOString();
  settings.forEach(setting => {
    stmt.run(setting.key, setting.value, setting.description, now);
  });
}

function insertDefaultEmailTemplates(db: Database.Database) {
  const templates = [
    {
      id: 'appointment_confirmation',
      name: 'Confirmación de Cita',
      subject: 'Tu cita con IA Punto ha sido confirmada',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡Tu cita ha sido confirmada!</h2>
          <p>Hola {{clientName}},</p>
          <p>Tu cita con IA Punto ha sido confirmada exitosamente.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detalles de tu cita:</h3>
            <p><strong>Fecha:</strong> {{appointmentDate}}</p>
            <p><strong>Hora:</strong> {{appointmentTime}}</p>
            <p><strong>Servicio:</strong> {{serviceType}}</p>
            <p><strong>Duración:</strong> {{duration}} minutos</p>
          </div>
          
          <p>Te enviaremos un enlace de Google Meet antes de la reunión.</p>
          
          <p>Si necesitas cancelar o reprogramar tu cita, por favor contáctanos con al menos 24 horas de anticipación.</p>
          
          <p>Saludos,<br>El equipo de IA Punto</p>
        </div>
      `,
      textContent: `
        ¡Tu cita ha sido confirmada!
        
        Hola {{clientName}},
        
        Tu cita con IA Punto ha sido confirmada exitosamente.
        
        Detalles de tu cita:
        - Fecha: {{appointmentDate}}
        - Hora: {{appointmentTime}}
        - Servicio: {{serviceType}}
        - Duración: {{duration}} minutos
        
        Te enviaremos un enlace de Google Meet antes de la reunión.
        
        Si necesitas cancelar o reprogramar tu cita, por favor contáctanos con al menos 24 horas de anticipación.
        
        Saludos,
        El equipo de IA Punto
      `
    },
    {
      id: 'appointment_reminder',
      name: 'Recordatorio de Cita',
      subject: 'Recordatorio: Tu cita con IA Punto mañana',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Recordatorio de tu cita</h2>
          <p>Hola {{clientName}},</p>
          <p>Te recordamos que tienes una cita programada para mañana.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detalles de tu cita:</h3>
            <p><strong>Fecha:</strong> {{appointmentDate}}</p>
            <p><strong>Hora:</strong> {{appointmentTime}}</p>
            <p><strong>Servicio:</strong> {{serviceType}}</p>
            <p><strong>Enlace de Google Meet:</strong> <a href="{{meetLink}}">{{meetLink}}</a></p>
          </div>
          
          <p>Nos vemos mañana en la reunión.</p>
          
          <p>Saludos,<br>El equipo de IA Punto</p>
        </div>
      `,
      textContent: `
        Recordatorio de tu cita
        
        Hola {{clientName}},
        
        Te recordamos que tienes una cita programada para mañana.
        
        Detalles de tu cita:
        - Fecha: {{appointmentDate}}
        - Hora: {{appointmentTime}}
        - Servicio: {{serviceType}}
        - Enlace de Google Meet: {{meetLink}}
        
        Nos vemos mañana en la reunión.
        
        Saludos,
        El equipo de IA Punto
      `
    }
  ];
  
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO email_templates (id, name, subject, htmlContent, textContent, isActive, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const now = new Date().toISOString();
  templates.forEach(template => {
    stmt.run(
      template.id,
      template.name,
      template.subject,
      template.htmlContent,
      template.textContent,
      1,
      now,
      now
    );
  });
}
