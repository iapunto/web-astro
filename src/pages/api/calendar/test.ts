import type { APIRoute } from 'astro';
import { getGoogleCalendarService } from '../../../lib/services/googleCalendar';
import EmailService from '../../../lib/services/emailService';

export const GET: APIRoute = async () => {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      tests: {} as any,
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
      },
    };

    // Test 1: Verificar variables de entorno
    results.tests.environment = {
      name: 'Variables de Entorno',
      passed: true,
      details: {},
    };

    const requiredEnvVars = [
      'GOOGLE_CALENDAR_ID',
      'TIMEZONE',
      'SMTP_USER',
      'SMTP_PASSWORD',
      'INTERNAL_NOTIFICATION_EMAIL',
    ];

    requiredEnvVars.forEach((varName) => {
      const value = process.env[varName];
      results.tests.environment.details[varName] = {
        exists: !!value,
        value: value
          ? varName.includes('PASSWORD')
            ? '***'
            : value
          : 'NO_CONFIGURADO',
      };

      if (!value) {
        results.tests.environment.passed = false;
      }
    });

    // Test 2: Verificar Google Calendar Service
    results.tests.calendarService = {
      name: 'Servicio de Google Calendar',
      passed: true,
      details: {},
    };

    try {
      const calendarService = getGoogleCalendarService();
      results.tests.calendarService.details.serviceType =
        calendarService.constructor.name;

      // Verificar si es el servicio real o mock
      if (calendarService.constructor.name === 'MockCalendarService') {
        results.tests.calendarService.details.warning =
          'Usando servicio mock - verificar credenciales de Google';
        results.tests.calendarService.passed = false;
      } else {
        results.tests.calendarService.details.status =
          'Servicio real configurado';

        // Probar conexión si es el servicio real
        if (calendarService.testConnection) {
          try {
            const connectionTest = await calendarService.testConnection();
            results.tests.calendarService.details.connectionTest =
              connectionTest ? 'SUCCESS' : 'FAILED';
            if (!connectionTest) {
              results.tests.calendarService.passed = false;
            }
          } catch (error) {
            results.tests.calendarService.details.connectionTest = 'ERROR';
            results.tests.calendarService.details.connectionError =
              error instanceof Error ? error.message : 'Error desconocido';
            results.tests.calendarService.passed = false;
          }
        }
      }
    } catch (error) {
      results.tests.calendarService.passed = false;
      results.tests.calendarService.details.error =
        error instanceof Error ? error.message : 'Error desconocido';
    }

    // Test 3: Verificar Email Service
    results.tests.emailService = {
      name: 'Servicio de Email',
      passed: true,
      details: {},
    };

    try {
      const emailService = new EmailService();
      results.tests.emailService.details.status = 'EmailService inicializado';

      // Verificar conexión del servidor de email
      try {
        const emailConnection = await emailService.verifyConnection();
        results.tests.emailService.details.connectionTest = emailConnection
          ? 'SUCCESS'
          : 'FAILED';
        if (!emailConnection) {
          results.tests.emailService.passed = false;
        }
      } catch (error) {
        results.tests.emailService.details.connectionTest = 'ERROR';
        results.tests.emailService.details.connectionError =
          error instanceof Error ? error.message : 'Error desconocido';
        results.tests.emailService.passed = false;
      }
    } catch (error) {
      results.tests.emailService.passed = false;
      results.tests.emailService.details.error =
        error instanceof Error ? error.message : 'Error desconocido';
    }

    // Test 4: Verificar endpoints de la API
    results.tests.apiEndpoints = {
      name: 'Endpoints de la API',
      passed: true,
      details: {},
    };

    try {
      // Probar endpoint de disponibilidad con una fecha válida (mañana)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      
      const availabilityUrl = new URL(
        `/api/calendar/availability?date=${dateStr}`,
        process.env.APP_URL || 'http://localhost:4321'
      );
      const availabilityResponse = await fetch(availabilityUrl.toString());
      results.tests.apiEndpoints.details.availability = {
        status: availabilityResponse.status,
        ok: availabilityResponse.ok,
      };

      if (!availabilityResponse.ok) {
        results.tests.apiEndpoints.passed = false;
      }
    } catch (error) {
      results.tests.apiEndpoints.passed = false;
      results.tests.apiEndpoints.details.error =
        error instanceof Error ? error.message : 'Error desconocido';
    }

    // Calcular resumen
    const tests = Object.values(results.tests);
    results.summary.total = tests.length;
    results.summary.passed = tests.filter((test: any) => test.passed).length;
    results.summary.failed = tests.filter((test: any) => !test.passed).length;

    // Determinar estado general
    const overallStatus = results.summary.failed === 0 ? 'SUCCESS' : 'FAILED';
    results.overallStatus = overallStatus;

    return new Response(JSON.stringify(results, null, 2), {
      status: results.summary.failed === 0 ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in calendar test endpoint:', error);

    return new Response(
      JSON.stringify({
        error: 'Error del servidor',
        message: 'No se pudo ejecutar las pruebas del sistema',
        details: error instanceof Error ? error.message : 'Error desconocido',
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

// Manejar preflight requests para CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
