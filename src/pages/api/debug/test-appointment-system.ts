import type { APIRoute } from 'astro';
import { AppointmentManager } from '../../../lib/appointment/appointmentManager';
import { AppointmentService } from '../../../lib/database/appointmentService';
import { EmailService } from '../../../lib/email/emailService';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const GET: APIRoute = async () => {
  console.log('🚀 ===== TEST DEL SISTEMA DE CITAS =====');

  try {
    const results = {
      database: { status: 'pending', message: '' },
      email: { status: 'pending', message: '' },
      googleCalendar: { status: 'pending', message: '' },
      systemSettings: { status: 'pending', message: '' },
      overall: { status: 'pending', message: '' }
    };

    // 1. Probar base de datos
    try {
      console.log('🔍 Probando base de datos...');
      const appointmentService = new AppointmentService();
      
      // Probar configuración del sistema
      const settings = await appointmentService.getAllSystemSettings();
      console.log('✅ Configuración del sistema cargada:', settings.length, 'configuraciones');
      
      results.systemSettings = {
        status: 'success',
        message: `Configuración cargada: ${settings.length} configuraciones`
      };

      // Probar creación de cita de prueba
      const testAppointment = await appointmentService.createAppointment({
        clientName: 'Cliente de Prueba',
        clientEmail: 'test@example.com',
        clientPhone: '+573001234567',
        appointmentDate: '2025-12-31',
        appointmentTime: '10:00',
        appointmentDateTime: new Date('2025-12-31T10:00:00').toISOString(),
        duration: 60,
        serviceType: 'Consulta de Prueba',
        description: 'Esta es una cita de prueba del sistema',
        status: 'confirmed'
      });

      console.log('✅ Cita de prueba creada:', testAppointment.id);
      
      // Eliminar la cita de prueba
      await appointmentService.deleteAppointment(testAppointment.id);
      console.log('✅ Cita de prueba eliminada');

      results.database = {
        status: 'success',
        message: 'Base de datos funcionando correctamente'
      };

      appointmentService.close();
    } catch (error) {
      console.error('❌ Error en base de datos:', error);
      results.database = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    // 2. Probar servicio de email
    try {
      console.log('🔍 Probando servicio de email...');
      const emailService = new EmailService();
      
      const connectionOk = await emailService.verifyConnection();
      if (connectionOk) {
        results.email = {
          status: 'success',
          message: 'Conexión de email verificada correctamente'
        };
      } else {
        results.email = {
          status: 'warning',
          message: 'No se pudo verificar la conexión de email (configuración pendiente)'
        };
      }
    } catch (error) {
      console.error('❌ Error en servicio de email:', error);
      results.email = {
        status: 'warning',
        message: 'Servicio de email no configurado (requiere SMTP)'
      };
    }

    // 3. Probar Google Calendar
    try {
      console.log('🔍 Probando Google Calendar...');
      const appointmentManager = new AppointmentManager();
      
      // Probar disponibilidad
      const availability = await appointmentManager.getAvailabilityForDate('2025-12-31');
      console.log('✅ Disponibilidad obtenida:', availability.length, 'horarios');
      
      results.googleCalendar = {
        status: 'success',
        message: `Google Calendar conectado. Disponibilidad: ${availability.length} horarios`
      };

      appointmentManager.close();
    } catch (error) {
      console.error('❌ Error en Google Calendar:', error);
      results.googleCalendar = {
        status: 'warning',
        message: 'Google Calendar no configurado (requiere credenciales)'
      };
    }

    // 4. Evaluar estado general
    const successCount = Object.values(results).filter(r => r.status === 'success').length;
    const errorCount = Object.values(results).filter(r => r.status === 'error').length;
    const warningCount = Object.values(results).filter(r => r.status === 'warning').length;

    if (errorCount === 0 && successCount >= 1) {
      results.overall = {
        status: 'success',
        message: `Sistema funcionando correctamente (${successCount} servicios OK, ${warningCount} advertencias)`
      };
    } else if (errorCount > 0) {
      results.overall = {
        status: 'error',
        message: `Sistema con errores (${errorCount} errores, ${successCount} OK, ${warningCount} advertencias)`
      };
    } else {
      results.overall = {
        status: 'warning',
        message: `Sistema parcialmente configurado (${successCount} OK, ${warningCount} advertencias)`
      };
    }

    console.log('✅ Test completado');
    console.log('📊 Resultados:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test del sistema de citas completado',
        timestamp: new Date().toISOString(),
        results: results,
        summary: {
          totalServices: Object.keys(results).length - 1, // Excluir overall
          successCount: successCount,
          errorCount: errorCount,
          warningCount: warningCount
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('❌ Error en test del sistema:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error ejecutando test del sistema',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
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
