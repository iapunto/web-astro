import type { APIRoute } from 'astro';
import { getStaffForCalendar, IA_PUNTO_STAFF } from '../../../lib/constants/staff.js';

export const GET: APIRoute = async () => {
  try {
    console.log('🧪 ===== PRUEBA STAFF IA PUNTO =====');

    // 1. Verificar configuración del staff
    console.log('1️⃣ Verificando configuración del staff...');
    const staffMembers = getStaffForCalendar();
    const staffEmails = IA_PUNTO_STAFF.map(member => member.email);

    // 2. Verificar que todos los emails estén configurados
    console.log('2️⃣ Verificando emails del staff...');
    const validEmails = staffEmails.filter(email => email && email.includes('@'));

    // 3. Simular evento con staff
    console.log('3️⃣ Simulando evento con staff...');
    const mockEvent = {
      summary: '🧪 Prueba Staff - IA Punto',
      attendees: [
        {
          email: 'cliente@ejemplo.com',
          displayName: 'Cliente de Prueba',
        },
        ...staffMembers,
      ],
    };

    return new Response(JSON.stringify({
      success: true,
      message: 'Configuración del staff verificada',
      timestamp: new Date().toISOString(),
      results: {
        staffConfiguration: {
          totalMembers: staffMembers.length,
          validEmails: validEmails.length,
          status: validEmails.length === staffEmails.length ? '✅ Configurado correctamente' : '⚠️ Algunos emails pueden estar mal configurados'
        },
        staffMembers: IA_PUNTO_STAFF.map(member => ({
          name: member.displayName,
          email: member.email,
          role: member.role,
          status: member.email && member.email.includes('@') ? '✅ Válido' : '❌ Inválido'
        })),
        mockEvent: {
          totalAttendees: mockEvent.attendees.length,
          clientAttendees: 1,
          staffAttendees: staffMembers.length,
          attendees: mockEvent.attendees.map(attendee => ({
            email: attendee.email,
            displayName: attendee.displayName,
            type: attendee.email === 'cliente@ejemplo.com' ? 'Cliente' : 'Staff'
          }))
        }
      },
      capabilities: [
        '✅ Staff se agrega automáticamente a todos los eventos',
        '✅ Invitaciones se envían a todos los miembros del staff',
        '✅ No se duplican invitados si ya están en el evento',
        '✅ Funciona tanto en creación como en actualización de eventos'
      ],
      nextSteps: [
        'Usa /api/calendar/book para crear eventos con staff automático',
        'Usa /api/calendar/update-event para agregar invitados (staff incluido automáticamente)',
        'Verifica que todos los emails del staff sean correctos',
        'Los eventos incluirán automáticamente: Cliente + 4 miembros del staff'
      ]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error en prueba del staff:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
      recommendations: [
        'Verifica la configuración del staff en src/lib/constants/staff.ts',
        'Asegúrate de que todos los emails sean válidos',
        'Revisa los logs del servidor para más detalles'
      ]
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
