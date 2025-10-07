import type { APIRoute } from 'astro';
import { PostgresAppointmentService } from '../../../lib/database/postgresAppointmentService.js';
import { Client } from 'pg';

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const appointmentId = params.id;
    
    if (!appointmentId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'ID de cita requerido'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const client = new Client({
      connectionString: process.env.DATABASE_PUBLIC_URL,
    });

    await client.connect();
    const appointmentService = new PostgresAppointmentService(client);

    // Verificar que la cita existe
    const appointment = await appointmentService.getAppointmentById(appointmentId);
    if (!appointment) {
      await client.end();
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Cita no encontrada'
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Actualizar estado a completado
    await appointmentService.updateAppointment(appointmentId, {
      status: 'completed'
    });

    await client.end();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cita marcada como completada exitosamente',
        appointmentId: appointmentId
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error completando cita:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
