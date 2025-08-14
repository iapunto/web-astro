import { Pool, PoolClient } from 'pg';

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  googleCalendarEventId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'confirmation' | 'reminder' | 'cancellation' | 'admin_notification';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailLog {
  id: string;
  appointmentId: string;
  emailType: string;
  recipientEmail: string;
  subject: string;
  body: string;
  status: 'sent' | 'failed' | 'pending';
  errorMessage?: string;
  sentAt?: string;
  createdAt: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function initializeDatabase(): Promise<void> {
  const client = await getPool().connect();
  
  try {
    await createTables(client);
    await insertDefaultSettings(client);
    await insertDefaultEmailTemplates(client);
  } finally {
    client.release();
  }
}

async function createTables(client: PoolClient): Promise<void> {
  // Tabla de citas
  await client.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_name VARCHAR(255) NOT NULL,
      client_email VARCHAR(255) NOT NULL,
      service_type VARCHAR(100) NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
      google_calendar_event_id VARCHAR(255),
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de plantillas de email
  await client.query(`
    CREATE TABLE IF NOT EXISTS email_templates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL UNIQUE,
      subject VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de logs de email
  await client.query(`
    CREATE TABLE IF NOT EXISTS email_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
      email_type VARCHAR(50) NOT NULL,
      recipient_email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      error_message TEXT,
      sent_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla de configuraciones del sistema
  await client.query(`
    CREATE TABLE IF NOT EXISTS system_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      key VARCHAR(100) UNIQUE NOT NULL,
      value TEXT NOT NULL,
      description TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Índices para mejorar el rendimiento
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    CREATE INDEX IF NOT EXISTS idx_email_logs_appointment_id ON email_logs(appointment_id);
    CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
  `);
}

async function insertDefaultSettings(client: PoolClient): Promise<void> {
  const settings = [
    {
      key: 'business_hours_start',
      value: '09:00',
      description: 'Hora de inicio del horario laboral'
    },
    {
      key: 'business_hours_end',
      value: '17:00',
      description: 'Hora de fin del horario laboral'
    },
    {
      key: 'timezone',
      value: 'America/Bogota',
      description: 'Zona horaria del sistema'
    },
    {
      key: 'max_appointments_per_day',
      value: '3',
      description: 'Máximo número de citas por día'
    },
    {
      key: 'lunch_break_start',
      value: '12:00',
      description: 'Inicio del descanso para almuerzo'
    },
    {
      key: 'lunch_break_end',
      value: '13:00',
      description: 'Fin del descanso para almuerzo'
    }
  ];

  for (const setting of settings) {
    await client.query(`
      INSERT INTO system_settings (key, value, description)
      VALUES ($1, $2, $3)
      ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        description = EXCLUDED.description,
        updated_at = CURRENT_TIMESTAMP
    `, [setting.key, setting.value, setting.description]);
  }
}

async function insertDefaultEmailTemplates(client: PoolClient): Promise<void> {
  const templates = [
    {
      name: 'Confirmación de Cita',
      subject: 'Confirmación de tu cita con IA Punto',
      body: `
        <h2>¡Hola {{clientName}}!</h2>
        <p>Tu cita ha sido confirmada exitosamente.</p>
        <p><strong>Detalles de la cita:</strong></p>
        <ul>
          <li><strong>Servicio:</strong> {{serviceType}}</li>
          <li><strong>Fecha:</strong> {{appointmentDate}}</li>
          <li><strong>Hora:</strong> {{appointmentTime}}</li>
        </ul>
        <p>Nos vemos pronto.</p>
        <p>Saludos,<br>Equipo de IA Punto</p>
      `,
      type: 'confirmation'
    },
    {
      name: 'Recordatorio de Cita',
      subject: 'Recordatorio: Tu cita con IA Punto mañana',
      body: `
        <h2>¡Hola {{clientName}}!</h2>
        <p>Te recordamos que tienes una cita programada para mañana.</p>
        <p><strong>Detalles de la cita:</strong></p>
        <ul>
          <li><strong>Servicio:</strong> {{serviceType}}</li>
          <li><strong>Fecha:</strong> {{appointmentDate}}</li>
          <li><strong>Hora:</strong> {{appointmentTime}}</li>
        </ul>
        <p>Nos vemos mañana.</p>
        <p>Saludos,<br>Equipo de IA Punto</p>
      `,
      type: 'reminder'
    },
    {
      name: 'Cancelación de Cita',
      subject: 'Tu cita con IA Punto ha sido cancelada',
      body: `
        <h2>¡Hola {{clientName}}!</h2>
        <p>Tu cita ha sido cancelada.</p>
        <p><strong>Detalles de la cita cancelada:</strong></p>
        <ul>
          <li><strong>Servicio:</strong> {{serviceType}}</li>
          <li><strong>Fecha:</strong> {{appointmentDate}}</li>
          <li><strong>Hora:</strong> {{appointmentTime}}</li>
        </ul>
        <p>Si necesitas reprogramar, por favor contáctanos.</p>
        <p>Saludos,<br>Equipo de IA Punto</p>
      `,
      type: 'cancellation'
    },
    {
      name: 'Notificación de Nueva Cita (Admin)',
      subject: 'Nueva cita programada - IA Punto',
      body: `
        <h2>Nueva cita programada</h2>
        <p><strong>Detalles del cliente:</strong></p>
        <ul>
          <li><strong>Nombre:</strong> {{clientName}}</li>
          <li><strong>Email:</strong> {{clientEmail}}</li>
          <li><strong>Servicio:</strong> {{serviceType}}</li>
          <li><strong>Fecha:</strong> {{appointmentDate}}</li>
          <li><strong>Hora:</strong> {{appointmentTime}}</li>
        </ul>
        <p>Esta cita ha sido registrada en el sistema.</p>
      `,
      type: 'admin_notification'
    }
  ];

  for (const template of templates) {
    await client.query(`
      INSERT INTO email_templates (name, subject, body, type)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO UPDATE SET
        subject = EXCLUDED.subject,
        body = EXCLUDED.body,
        type = EXCLUDED.type,
        updated_at = CURRENT_TIMESTAMP
    `, [template.name, template.subject, template.body, template.type]);
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
