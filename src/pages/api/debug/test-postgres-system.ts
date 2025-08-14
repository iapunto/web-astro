import type { APIRoute } from 'astro';
import { PostgresAppointmentManager } from '../../../lib/appointment/postgresAppointmentManager.js';
import { PostgresAppointmentService } from '../../../lib/database/postgresAppointmentService.js';
import { ResendEmailService } from '../../../lib/email/resendEmailService.js';
import { initializeDatabase } from '../../../lib/database/postgresSchema.js';
import * as dotenv from 'dotenv';

dotenv.config();

export const GET: APIRoute = async () => {
  const results: { [key: string]: any } = {};

  try {
    // 1. Probar conexión a PostgreSQL
    console.log('🔍 Probando conexión a PostgreSQL...');
    try {
      await initializeDatabase();
      results.database = {
        status: 'success',
        message: 'Conexión a PostgreSQL establecida correctamente',
        tables: ['appointments', 'email_templates', 'email_logs', 'system_settings']
      };
    } catch (error) {
      results.database = {
        status: 'error',
        message: 'Error conectando a PostgreSQL',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    // 2. Probar AppointmentService
    console.log('🔍 Probando AppointmentService...');
    try {
      const appointmentService = new PostgresAppointmentService();
      const settings = await appointmentService.getAllSystemSettings();
      results.appointmentService = {
        status: 'success',
        message: 'AppointmentService funcionando correctamente',
        systemSettings: settings.length,
        settings: settings.map(s => ({ key: s.key, value: s.value }))
      };
    } catch (error) {
      results.appointmentService = {
        status: 'error',
        message: 'Error en AppointmentService',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    // 3. Probar EmailService
    console.log('🔍 Probando EmailService...');
    try {
      const emailService = new ResendEmailService();
      const template = await emailService['appointmentService'].getEmailTemplate('confirmation');
      results.emailService = {
        status: template ? 'success' : 'warning',
        message: template ? 'EmailService funcionando correctamente' : 'EmailService funcionando pero sin plantillas',
        hasTemplates: !!template,
        resendConfigured: !!process.env.RESEND_API_KEY
      };
    } catch (error) {
      results.emailService = {
        status: 'error',
        message: 'Error en EmailService',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    // 4. Probar Google Calendar
    console.log('🔍 Probando Google Calendar...');
    try {
      const appointmentManager = new PostgresAppointmentManager();
      const availability = await appointmentManager.getAvailabilityForDate('2025-08-15');
      results.googleCalendar = {
        status: 'success',
        message: 'Google Calendar funcionando correctamente',
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        timezone: process.env.TIMEZONE || 'America/Bogota',
        testAvailability: availability.length,
        availableSlots: availability
      };
    } catch (error) {
      results.googleCalendar = {
        status: 'warning',
        message: 'Google Calendar no configurado o con errores',
        error: error instanceof Error ? error.message : 'Error desconocido',
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'No configurado',
        timezone: process.env.TIMEZONE || 'No configurado'
      };
    }

    // 5. Probar AppointmentManager completo
    console.log('🔍 Probando AppointmentManager...');
    try {
      const appointmentManager = new PostgresAppointmentManager();
      const isAvailable = await appointmentManager.checkAvailability('2025-08-15', '10:00');
      results.appointmentManager = {
        status: 'success',
        message: 'AppointmentManager funcionando correctamente',
        testAvailability: isAvailable,
        businessRules: {
          weekendsDisabled: true,
          lunchBreakExcluded: true,
          maxPerDay: 3
        }
      };
    } catch (error) {
      results.appointmentManager = {
        status: 'error',
        message: 'Error en AppointmentManager',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    // 6. Verificar variables de entorno
    console.log('🔍 Verificando variables de entorno...');
    results.environment = {
      database: {
        DATABASE_URL: process.env.DATABASE_URL ? 'Configurado' : 'No configurado',
        DATABASE_PUBLIC_URL: process.env.DATABASE_PUBLIC_URL ? 'Configurado' : 'No configurado'
      },
      email: {
        RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Configurado' : 'No configurado',
        EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'No configurado',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'No configurado'
      },
      google: {
        GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Configurado' : 'No configurado',
        GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? 'Configurado' : 'No configurado',
        GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID || 'primary'
      },
      app: {
        TIMEZONE: process.env.TIMEZONE || 'America/Bogota',
        BUSINESS_HOURS_START: process.env.BUSINESS_HOURS_START || '09:00',
        BUSINESS_HOURS_END: process.env.BUSINESS_HOURS_END || '17:00'
      }
    };

    // Determinar estado general
    const allStatuses = Object.values(results).map(r => r.status);
    const hasErrors = allStatuses.includes('error');
    const hasWarnings = allStatuses.includes('warning');
    
    const overallStatus = hasErrors ? 'error' : hasWarnings ? 'warning' : 'success';
    const overallMessage = hasErrors 
      ? 'El sistema tiene errores que necesitan atención'
      : hasWarnings 
      ? 'El sistema funciona pero con advertencias'
      : 'El sistema está funcionando correctamente';

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Prueba del sistema PostgreSQL completada',
        overallStatus,
        overallMessage,
        timestamp: new Date().toISOString(),
        results
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error en prueba del sistema PostgreSQL:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error en la prueba del sistema',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
        results
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
