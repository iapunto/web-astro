import type { AvailabilitySlot, AppointmentRequest, CalendarEvent } from './googleCalendar';

/**
 * Mock service para simular Google Calendar cuando no hay credenciales configuradas
 * Este servicio proporciona datos de prueba para desarrollo y fallback
 */
export class MockCalendarService {
  private timezone: string;

  constructor() {
    this.timezone = 'America/Mexico_City';
  }

  /**
   * Simular slots de disponibilidad
   */
  async getAvailableSlots(date: Date, durationMinutes: number = 60): Promise<AvailabilitySlot[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0); // 9:00 AM
    
    const endOfDay = new Date(date);
    endOfDay.setHours(17, 0, 0, 0); // 5:00 PM

    const slots: AvailabilitySlot[] = [];
    const slotDuration = durationMinutes * 60 * 1000; // Convert to milliseconds
    const slotInterval = 30 * 60 * 1000; // 30 minutes in milliseconds

    let currentTime = startOfDay.getTime();

    // Simular algunos slots ocupados para hacer más realista
    const mockBusySlots = [
      { start: 11, end: 12 }, // 11:00 AM - 12:00 PM ocupado
      { start: 14, end: 15 }, // 2:00 PM - 3:00 PM ocupado
    ];

    while (currentTime + slotDuration <= endOfDay.getTime()) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime + slotDuration);

      // Verificar si el slot está en los horarios "ocupados" simulados
      const hour = slotStart.getHours();
      const isOccupied = mockBusySlots.some(busy => hour >= busy.start && hour < busy.end);

      slots.push({
        start: slotStart,
        end: slotEnd,
        available: !isOccupied,
      });

      currentTime += slotInterval;
    }

    return slots;
  }

  /**
   * Simular creación de cita
   */
  async createAppointment(appointment: AppointmentRequest): Promise<CalendarEvent> {
    // Simular un pequeño delay como si fuera una llamada real a la API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simular que la cita se creó exitosamente
    const mockEvent: CalendarEvent = {
      id: `mock-event-${Date.now()}`,
      summary: `Consulta con ${appointment.name}`,
      description: appointment.description || `Reunión agendada con ${appointment.name}`,
      start: {
        dateTime: appointment.startTime.toISOString(),
        timeZone: this.timezone,
      },
      end: {
        dateTime: appointment.endTime.toISOString(),
        timeZone: this.timezone,
      },
      attendees: [
        {
          email: appointment.email,
          displayName: appointment.name,
          responseStatus: 'needsAction',
        },
      ],
    };

    // En un caso real, aquí podrías enviar un email de confirmación
    // o guardar la cita en una base de datos local
    console.log('Mock appointment created:', mockEvent);

    return mockEvent;
  }

  /**
   * Verificar disponibilidad de un slot específico
   */
  async checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
    // Simular verificación - en este caso, siempre disponible excepto horarios "ocupados"
    const hour = startTime.getHours();
    const mockBusySlots = [
      { start: 11, end: 12 },
      { start: 14, end: 15 },
    ];

    return !mockBusySlots.some(busy => hour >= busy.start && hour < busy.end);
  }
}
