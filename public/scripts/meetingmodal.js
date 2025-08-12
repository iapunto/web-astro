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
    this.isSubmitting = false;

    // Debug: verificar que los elementos existen
    console.log('Modal elements found:', {
      modal: !!this.modal,
      closeBtn: !!this.closeBtn,
      form: !!this.form,
      formContainer: !!this.formContainer,
      confirmationMessage: !!this.confirmationMessage,
    });

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeFlatpickr();
    this.setupRealTimeValidation();
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

  setupRealTimeValidation() {
    // Validación en tiempo real del nombre
    const nameInput = this.form?.querySelector('#name');
    nameInput?.addEventListener('input', () => {
      this.validateField('name', nameInput.value.trim());
    });

    // Validación en tiempo real del email
    const emailInput = this.form?.querySelector('#email');
    emailInput?.addEventListener('input', () => {
      this.validateField('email', emailInput.value.trim());
    });

    // Validación en tiempo real de la fecha/hora
    const timeInput = this.form?.querySelector('#appointment-time');
    timeInput?.addEventListener('change', () => {
      this.validateField('time', timeInput.value);
    });
  }

  validateField(fieldName, value) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = this.form?.querySelector(`#${fieldName}`);

    if (!errorElement || !inputElement) return;

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        if (!value) {
          isValid = false;
          errorMessage = 'El nombre es requerido';
        } else if (value.length < 2) {
          isValid = false;
          errorMessage = 'El nombre debe tener al menos 2 caracteres';
        }
        break;

      case 'email':
        if (!value) {
          isValid = false;
          errorMessage = 'El email es requerido';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor ingresa un email válido';
          }
        }
        break;

      case 'time':
        if (!value) {
          isValid = false;
          errorMessage = 'Por favor selecciona una fecha y hora';
        }
        break;
    }

    // Actualizar UI
    if (isValid) {
      errorElement.textContent = '';
      inputElement.classList.remove('error');
    } else {
      errorElement.textContent = errorMessage;
      inputElement.classList.add('error');
    }

    return isValid;
  }

  validateForm() {
    const nameValid = this.validateField(
      'name',
      this.form?.querySelector('#name')?.value.trim()
    );
    const emailValid = this.validateField(
      'email',
      this.form?.querySelector('#email')?.value.trim()
    );
    const timeValid = this.validateField(
      'time',
      this.form?.querySelector('#appointment-time')?.value
    );

    return nameValid && emailValid && timeValid && this.selectedSlot;
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
      locale: window.flatpickr?.l10ns?.es || 'es', // Español con fallback
      disable: [
        // Deshabilitar fines de semana
        function (date) {
          return date.getDay() === 0 || date.getDay() === 6;
        },
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
        console.log('✅ Flatpickr initialized successfully');
      },
    });
  }

  async onDateTimeSelected(selectedDate) {
    try {
      // Validar que la fecha sea válida
      if (!selectedDate || selectedDate < new Date()) {
        this.showFieldError(
          'time',
          'Por favor selecciona una fecha y hora válida.'
        );
        return;
      }

      // Validar horario de negocio
      const hour = selectedDate.getHours();
      if (hour < 9 || hour >= 17) {
        this.showFieldError(
          'time',
          'Por favor selecciona un horario entre 9:00 AM y 5:00 PM.'
        );
        return;
      }

      // Validar que no sea fin de semana
      const day = selectedDate.getDay();
      if (day === 0 || day === 6) {
        this.showFieldError(
          'time',
          'No se pueden agendar citas los fines de semana.'
        );
        return;
      }

      this.selectedSlot = {
        start: selectedDate,
        end: new Date(selectedDate.getTime() + 60 * 60 * 1000), // 1 hora después
      };

      // Limpiar error de tiempo si todo está bien
      this.clearFieldError('time');

      // Verificar disponibilidad
      await this.checkAvailability(selectedDate);
    } catch (error) {
      console.error('Error selecting date/time:', error);
      this.showFieldError(
        'time',
        'Error al verificar disponibilidad. Inténtalo de nuevo.'
      );
    }
  }

  showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = this.form?.querySelector(`#${fieldName}`);

    if (errorElement) {
      errorElement.textContent = message;
    }
    if (inputElement) {
      inputElement.classList.add('error');
    }
  }

  clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = this.form?.querySelector(`#${fieldName}`);

    if (errorElement) {
      errorElement.textContent = '';
    }
    if (inputElement) {
      inputElement.classList.remove('error');
    }
  }

  async checkAvailability(date) {
    try {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const response = await fetch(
        `/api/calendar/availability?date=${dateStr}&duration=60`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Error verificando disponibilidad'
        );
      }

      const data = await response.json();
      this.availableSlots = data.availableSlots;

      // Verificar si el slot seleccionado está disponible
      const selectedTime = date.toISOString();
      const isAvailable = this.availableSlots.some((slot) => {
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        return date >= slotStart && date < slotEnd;
      });

      if (!isAvailable) {
        this.showFieldError(
          'time',
          'El horario seleccionado no está disponible. Por favor elige otro horario.'
        );
        this.flatpickrInstance?.clear();
        this.selectedSlot = null;
      } else {
        this.clearFieldError('time');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      this.showFieldError(
        'time',
        'Error verificando disponibilidad. Inténtalo más tarde.'
      );
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    if (this.isSubmitting) {
      return; // Evitar envíos múltiples
    }

    try {
      // Validar formulario
      if (!this.validateForm()) {
        this.showError(
          'Por favor completa todos los campos requeridos correctamente.'
        );
        return;
      }

      const formData = new FormData(this.form);
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const meetingType =
        formData.get('meeting-type')?.toString() || 'Consulta General';
      const description = formData.get('description')?.toString().trim();

      // Mostrar estado de carga
      this.setLoadingState(true);
      this.isSubmitting = true;

      // Preparar datos para la API
      const appointmentData = {
        name: name,
        email: email,
        startTime: this.selectedSlot.start.toISOString(),
        endTime: this.selectedSlot.end.toISOString(),
        description:
          description ||
          `Consulta agendada a través del sitio web de IA Punto.`,
        meetingType: meetingType,
      };

      console.log('📝 Sending appointment data:', appointmentData);

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
      this.showConfirmation(result.appointment, appointmentData);
    } catch (error) {
      console.error('Error booking appointment:', error);
      this.showError(
        error.message || 'Error al agendar la cita. Inténtalo más tarde.'
      );
    } finally {
      this.setLoadingState(false);
      this.isSubmitting = false;
    }
  }

  showConfirmation(appointment, appointmentData) {
    this.formContainer?.classList.add('hidden');
    this.confirmationMessage?.classList.remove('hidden');

    // Actualizar mensaje de confirmación con detalles
    if (this.confirmationMessage) {
      const startTime = new Date(appointment.start.dateTime);
      const formattedDate = startTime.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = startTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const appointmentDetails = document.getElementById('appointment-details');
      if (appointmentDetails) {
        appointmentDetails.innerHTML = `
          <h3 style="margin-top: 0; color: #1e293b;">📅 Detalles de tu cita:</h3>
          <p><strong>Cliente:</strong> ${appointmentData.name}</p>
          <p><strong>Email:</strong> ${appointmentData.email}</p>
          <p><strong>Fecha:</strong> ${formattedDate}</p>
          <p><strong>Hora:</strong> ${formattedTime} (Hora de México)</p>
          <p><strong>Tipo:</strong> ${appointmentData.meetingType}</p>
          <p><strong>ID de evento:</strong> ${appointment.id}</p>
          ${appointment.meetLink ? `<p><strong>Enlace Meet:</strong> <a href="${appointment.meetLink}" target="_blank">Ver enlace</a></p>` : ''}
        `;
      }
    }
  }

  showError(message) {
    // Remover errores anteriores
    this.clearError();

    // Crear elemento de error
    const errorDiv = document.createElement('div');
    errorDiv.className =
      'error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4';
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
        submitButton.textContent = '📅 Agendando...';
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        submitButton.disabled = false;
        submitButton.textContent = '📅 Confirmar Cita';
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  }

  openModal() {
    console.log('Attempting to open modal...');
    if (this.modal) {
      console.log('Modal found, opening...');
      this.modal.classList.remove('hidden');
      // Resetear formulario
      this.resetForm();
      console.log('Modal opened successfully');
    } else {
      console.error('Modal element not found!');
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
    this.isSubmitting = false;

    // Mostrar formulario y ocultar confirmación
    this.formContainer?.classList.remove('hidden');
    this.confirmationMessage?.classList.add('hidden');

    // Limpiar errores
    this.clearError();
    this.clearFieldError('name');
    this.clearFieldError('email');
    this.clearFieldError('time');

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

  // Conectar botones específicos al modal
  const modalButtons = [
    'open-modal-btn-nav', // Botón navbar desktop
    'open-modal-btn-nav-mobile', // Botón navbar mobile
    'open-modal-btn-services', // Botón en sección de servicios
    'open-modal-btn', // Botón genérico
  ];

  modalButtons.forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        meetingModal.openModal();
      });
    }
  });

  // También buscar botones por clase o texto para mayor compatibilidad
  const buttonsByText = document.querySelectorAll('button, a');
  buttonsByText.forEach((button) => {
    const text = button.textContent?.toLowerCase() || '';
    if (
      text.includes('agenda') &&
      (text.includes('reunión') || text.includes('reunion'))
    ) {
      button.addEventListener('click', (e) => {
        // Solo prevenir default si no tiene href
        if (!button.getAttribute('href')) {
          e.preventDefault();
        }
        meetingModal.openModal();
      });
    }
  });
});

// Función global para abrir el modal (para botones externos)
function openMeetingModal() {
  if (window.meetingModal) {
    window.meetingModal.openModal();
  }
}
