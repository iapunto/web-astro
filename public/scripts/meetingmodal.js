// Google Calendar Integration - Meeting Modal
class MeetingModalManager {
  constructor() {
    this.modal = document.getElementById('meeting-modal');
    this.closeBtn = document.getElementById('close-modal-btn');
    this.form = document.getElementById('appointment-form');
    this.formContainer = document.querySelector('.form-container');
    this.confirmationMessage = document.getElementById('confirmation-message');
    
    this.availableSlots = [];
    this.selectedSlot = null;
    this.flatpickrInstance = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeFlatpickr();
  }

  setupEventListeners() {
    // Cerrar modal
    this.closeBtn?.addEventListener('click', () => this.closeModal());
    
    // Cerrar modal al hacer clic fuera
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Manejar envío del formulario
    this.form?.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal?.classList.contains('hidden')) {
        this.closeModal();
      }
    });
  }

  initializeFlatpickr() {
    if (!window.flatpickr || !this.form) return;

    const appointmentTimeInput = this.form.querySelector('#appointment-time');
    if (!appointmentTimeInput) return;

    this.flatpickrInstance = window.flatpickr(appointmentTimeInput, {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      time_24hr: true,
      minDate: 'today',
      maxDate: new Date().fp_incr(30), // 30 días hacia adelante
      locale: 'es', // Español
      disable: [
        // Deshabilitar fines de semana
        function(date) {
          return (date.getDay() === 0 || date.getDay() === 6);
        }
      ],
      minTime: '09:00',
      maxTime: '17:00',
      minuteIncrement: 30,
      onChange: (selectedDates, dateStr, instance) => {
        if (selectedDates.length > 0) {
          this.onDateTimeSelected(selectedDates[0]);
        }
      },
      onReady: () => {
        console.log('Flatpickr initialized');
      }
    });
  }

  async onDateTimeSelected(selectedDate) {
    try {
      // Validar que la fecha sea válida
      if (!selectedDate || selectedDate < new Date()) {
        this.showError('Por favor selecciona una fecha y hora válida.');
        return;
      }

      // Validar horario de negocio
      const hour = selectedDate.getHours();
      if (hour < 9 || hour >= 17) {
        this.showError('Por favor selecciona un horario entre 9:00 AM y 5:00 PM.');
        return;
      }

      // Validar que no sea fin de semana
      const day = selectedDate.getDay();
      if (day === 0 || day === 6) {
        this.showError('No se pueden agendar citas los fines de semana.');
        return;
      }

      this.selectedSlot = {
        start: selectedDate,
        end: new Date(selectedDate.getTime() + 60 * 60 * 1000) // 1 hora después
      };

      // Verificar disponibilidad
      await this.checkAvailability(selectedDate);

    } catch (error) {
      console.error('Error selecting date/time:', error);
      this.showError('Error al verificar disponibilidad. Inténtalo de nuevo.');
    }
  }

  async checkAvailability(date) {
    try {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const response = await fetch(`/api/calendar/availability?date=${dateStr}&duration=60`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error verificando disponibilidad');
      }

      const data = await response.json();
      this.availableSlots = data.availableSlots;

      // Verificar si el slot seleccionado está disponible
      const selectedTime = date.toISOString();
      const isAvailable = this.availableSlots.some(slot => {
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        return date >= slotStart && date < slotEnd;
      });

      if (!isAvailable) {
        this.showError('El horario seleccionado no está disponible. Por favor elige otro horario.');
        this.flatpickrInstance?.clear();
        this.selectedSlot = null;
      } else {
        this.clearError();
      }

    } catch (error) {
      console.error('Error checking availability:', error);
      this.showError('Error verificando disponibilidad. Inténtalo más tarde.');
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    
    try {
      const formData = new FormData(this.form);
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();

      // Validaciones básicas
      if (!name || !email || !this.selectedSlot) {
        this.showError('Por favor completa todos los campos y selecciona un horario.');
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.showError('Por favor ingresa un email válido.');
        return;
      }

      // Mostrar estado de carga
      this.setLoadingState(true);

      // Preparar datos para la API
      const appointmentData = {
        name: name,
        email: email,
        startTime: this.selectedSlot.start.toISOString(),
        endTime: this.selectedSlot.end.toISOString(),
        description: `Consulta agendada a través del sitio web de IA Punto.`,
        meetingType: 'Consulta General'
      };

      // Enviar solicitud a la API
      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al agendar la cita');
      }

      // Mostrar confirmación
      this.showConfirmation(result.appointment);

    } catch (error) {
      console.error('Error booking appointment:', error);
      this.showError(error.message || 'Error al agendar la cita. Inténtalo más tarde.');
    } finally {
      this.setLoadingState(false);
    }
  }

  showConfirmation(appointment) {
    this.formContainer?.classList.add('hidden');
    this.confirmationMessage?.classList.remove('hidden');
    
    // Actualizar mensaje de confirmación con detalles
    if (this.confirmationMessage) {
      const startTime = new Date(appointment.start.dateTime);
      const formattedDate = startTime.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const formattedTime = startTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });

      this.confirmationMessage.innerHTML = `
        <h2 class="text-2xl font-bold text-green-600 mb-4">¡Cita Agendada!</h2>
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p class="text-green-800 font-semibold">${formattedDate}</p>
          <p class="text-green-700">${formattedTime}</p>
        </div>
        <p class="text-gray-700 mb-2">Recibirás una invitación de Google Calendar en tu correo electrónico.</p>
        <p class="text-gray-600 text-sm">ID de la cita: ${appointment.id}</p>
        <button onclick="meetingModal.closeModal()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Cerrar
        </button>
      `;
    }
  }

  showError(message) {
    // Remover errores anteriores
    this.clearError();

    // Crear elemento de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4';
    errorDiv.textContent = message;
    errorDiv.id = 'form-error';

    // Insertar al inicio del formulario
    this.form?.insertBefore(errorDiv, this.form.firstChild);

    // Auto-remover después de 5 segundos
    setTimeout(() => this.clearError(), 5000);
  }

  clearError() {
    const existingError = document.getElementById('form-error');
    if (existingError) {
      existingError.remove();
    }
  }

  setLoadingState(loading) {
    const submitButton = this.form?.querySelector('button[type="submit"]');
    if (submitButton) {
      if (loading) {
        submitButton.disabled = true;
        submitButton.textContent = 'Agendando...';
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        submitButton.disabled = false;
        submitButton.textContent = 'Confirmar Cita';
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  }

  openModal() {
    if (this.modal) {
      this.modal.classList.remove('hidden');
      // Resetear formulario
      this.resetForm();
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.add('hidden');
      this.resetForm();
    }
  }

  resetForm() {
    // Resetear formulario
    this.form?.reset();
    
    // Limpiar Flatpickr
    this.flatpickrInstance?.clear();
    
    // Resetear estado
    this.selectedSlot = null;
    this.availableSlots = [];
    
    // Mostrar formulario y ocultar confirmación
    this.formContainer?.classList.remove('hidden');
    this.confirmationMessage?.classList.add('hidden');
    
    // Limpiar errores
    this.clearError();
    
    // Resetear estado de carga
    this.setLoadingState(false);
  }
}

// Inicializar cuando el DOM esté listo
let meetingModal;

document.addEventListener('DOMContentLoaded', () => {
  meetingModal = new MeetingModalManager();
  
  // Hacer disponible globalmente para otros scripts
  window.meetingModal = meetingModal;
});

// Función global para abrir el modal (para botones externos)
function openMeetingModal() {
  if (window.meetingModal) {
    window.meetingModal.openModal();
  }
}