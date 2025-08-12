import type { APIRoute } from 'astro';
import { getAppointmentService } from '../../../lib/services/appointmentService.js';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 ===== TEST CALENDLY INTEGRATION =====');
    
    const appointmentService = getAppointmentService();
    const serviceInfo = appointmentService.getServiceInfo();
    
    console.log('📅 Service info:', serviceInfo);
    
    // Verificar conexión
    console.log('🔍 Testing connection...');
    const isConnected = await appointmentService.verifyConnection();
    console.log('✅ Connection test result:', isConnected);
    
    if (!isConnected) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No se pudo conectar con el servicio de agendamiento',
          service: serviceInfo.name,
          serviceType: serviceInfo.type
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // Obtener slots disponibles para mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    console.log('📅 Getting available slots for tomorrow...');
    const availableSlots = await appointmentService.getAvailableSlots(tomorrow);
    console.log('✅ Available slots:', availableSlots.length);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Calendly integration test completed successfully',
        service: serviceInfo.name,
        serviceType: serviceInfo.type,
        connection: isConnected,
        availableSlots: availableSlots.length,
        features: serviceInfo.features,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error) {
    console.error('❌ Calendly test failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : 'No stack trace',
        timestamp: new Date().toISOString()
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
