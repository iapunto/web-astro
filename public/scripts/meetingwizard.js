class MeetingWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.formData = {};
    this.selectedDate = null;
    this.selectedTime = null;
    this.datePicker = null;
    this.availableSlots = [];
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.initDatePicker();
  }

  bindEvents() {
    // Botones de navegación
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('wizard-next-btn')) {
        this.nextStep();
      }
      if (e.target.classList.contains('wizard-prev-btn')) {
        this.prevStep();
      }
      if (e.target.classList.contains('wizard-confirm-btn')) {
        this.confirmAppointment();
      }
    });

    // Cerrar modal
    const closeBtn = document.getElementById('close-wizard-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Cerrar al hacer clic fuera del modal
    const modal = document.getElementById('meeting-wizard-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }

    // Validación en tiempo real del paso 1
    this.setupStep1Validation();
  }

  initDatePicker() {
    const dateInput = document.getElementById('wizard-date-picker');
    if (!dateInput) return;

    // Configurar Flatpickr para fechas disponibles
    this.datePicker = flatpickr(dateInput, {
      locale: 'es',
      dateFormat: 'Y-m-d',
      minDate: 'today',
      maxDate: new Date().fp_incr(30), // 30 días desde hoy
      disable: [
        function(date) {
          // Deshabilitar fines de semana
          return date.getDay() === 0 || date.getDay() === 6;
        }
      ],
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          this.selectedDate = selectedDates[0];
          this.loadTimeSlots(this.selectedDate);
        }
      }
    });
  }

  setupStep1Validation() {
    const form = document.getElementById('wizard-step1-form');
    if (!form) return;

    const fields = ['wizard-name', 'wizard-email', 'wizard-phone', 'wizard-meeting-type', 'wizard-description'];
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('blur', () => this.validateField(fieldId));
        field.addEventListener('input', () => this.clearFieldError(fieldId));
      }
    });
  }

  validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (!field || !errorElement) return true;

    let isValid = true;
    let errorMessage = '';

    // Validaciones específicas por campo
    switch (fieldId) {
      case 'wizard-name':
        if (!field.value.trim()) {
          errorMessage = 'El nombre es requerido';
          isValid = false;
        } else if (field.value.trim().length < 2) {
          errorMessage = 'El nombre debe tener al menos 2 caracteres';
          isValid = false;
        }
        break;

      case 'wizard-email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!field.value.trim()) {
          errorMessage = 'El email es requerido';
          isValid = false;
        } else if (!emailRegex.test(field.value.trim())) {
          errorMessage = 'Ingresa un email válido';
          isValid = false;
        }
        break;

      case 'wizard-phone':
        if (!field.value.trim()) {
          errorMessage = 'El teléfono es requerido';
          isValid = false;
        } else if (field.value.trim().length < 10) {
          errorMessage = 'Ingresa un teléfono válido';
          isValid = false;
        }
        break;

      case 'wizard-meeting-type':
        if (!field.value) {
          errorMessage = 'Selecciona un tipo de consulta';
          isValid = false;
        }
        break;

      case 'wizard-description':
        if (!field.value.trim()) {
          errorMessage = 'La descripción es requerida';
          isValid = false;
        } else if (field.value.trim().length < 20) {
          errorMessage = 'La descripción debe tener al menos 20 caracteres';
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      field.classList.add('error');
      errorElement.textContent = errorMessage;
    } else {
      field.classList.remove('error');
      errorElement.textContent = '';
    }

    return isValid;
  }

  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field && errorElement) {
      field.classList.remove('error');
      errorElement.textContent = '';
    }
  }

  validateStep1() {
    const fields = ['wizard-name', 'wizard-email', 'wizard-phone', 'wizard-meeting-type', 'wizard-description'];
    let isValid = true;

    fields.forEach(fieldId => {
      if (!this.validateField(fieldId)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateStep2() {
    return this.selectedDate && this.selectedTime;
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (!this.validateStep1()) {
        this.showStepError('Por favor, completa todos los campos requeridos correctamente.');
        return;
      }
      this.saveStep1Data();
    } else if (this.currentStep === 2) {
      if (!this.validateStep2()) {
        this.showStepError('Por favor, selecciona una fecha y hora.');
        return;
      }
      this.prepareConfirmation();
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateStep();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStep();
    }
  }

  updateStep() {
    // Actualizar pasos visibles
    document.querySelectorAll('.wizard-step').forEach(step => {
      step.classList.remove('active');
    });
    document.querySelector(`[data-step="${this.currentStep}"]`).classList.add('active');

    // Actualizar progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      const stepNumber = index + 1;
      step.classList.remove('active', 'completed');
      
      if (stepNumber < this.currentStep) {
        step.classList.add('completed');
      } else if (stepNumber === this.currentStep) {
        step.classList.add('active');
      }
    });

    // Habilitar/deshabilitar botones según el paso
    this.updateNavigationButtons();
  }

  updateNavigationButtons() {
    const nextBtn = document.querySelector(`[data-next="${this.currentStep + 1}"]`);
    const prevBtn = document.querySelector(`[data-prev="${this.currentStep - 1}"]`);
    
    if (nextBtn) {
      nextBtn.disabled = false;
    }
    
    if (prevBtn) {
      prevBtn.disabled = false;
    }
  }

  saveStep1Data() {
    this.formData = {
      name: document.getElementById('wizard-name').value.trim(),
      email: document.getElementById('wizard-email').value.trim(),
      phone: document.getElementById('wizard-phone').value.trim(),
      meetingType: document.getElementById('wizard-meeting-type').value,
      description: document.getElementById('wizard-description').value.trim()
    };
  }

  async loadTimeSlots(date) {
    try {
      // Mostrar loading
      const timeSlotsContainer = document.getElementById('time-slots-container');
      const timeSlotsGrid = document.getElementById('time-slots-grid');
      
      timeSlotsContainer.style.display = 'block';
      timeSlotsGrid.innerHTML = '<div class="loading">Cargando horarios disponibles...</div>';

      // Generar horarios disponibles (9:00 AM - 5:00 PM, cada hora)
      const timeSlots = this.generateTimeSlots(date);
      
      // Simular verificación de disponibilidad
      const availableSlots = await this.checkAvailability(date, timeSlots);
      
      this.renderTimeSlots(availableSlots);
      
    } catch (error) {
      console.error('Error cargando horarios:', error);
      this.showStepError('Error cargando horarios disponibles. Intenta de nuevo.');
    }
  }

  generateTimeSlots(date) {
    const slots = [];
    const startHour = 9; // 9:00 AM
    const endHour = 17; // 5:00 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const time = new Date(date);
      time.setHours(hour, 0, 0, 0);
      
      slots.push({
        time: time,
        formatted: time.toLocaleTimeString('es-CO', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        available: true
      });
    }
    
    return slots;
  }

  async checkAvailability(date, timeSlots) {
    try {
      // Llamar al endpoint real de disponibilidad
      const response = await fetch('/api/calendar/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date.toISOString().split('T')[0] // YYYY-MM-DD
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Mapear los resultados del API a nuestro formato
        return timeSlots.map(slot => {
          const apiSlot = result.timeSlots.find(apiSlot => 
            new Date(apiSlot.time).getHours() === slot.time.getHours()
          );
          return {
            ...slot,
            available: apiSlot ? apiSlot.available : false
          };
        });
      } else {
        console.warn('Error en API de disponibilidad, usando slots por defecto:', result.error);
        // Fallback: marcar todos como disponibles
        return timeSlots.map(slot => ({
          ...slot,
          available: true
        }));
      }
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      // Fallback: marcar todos como disponibles
      return timeSlots.map(slot => ({
        ...slot,
        available: true
      }));
    }
  }

  renderTimeSlots(slots) {
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    
    timeSlotsGrid.innerHTML = slots.map(slot => `
      <div class="time-slot ${slot.available ? '' : 'disabled'}" 
           data-time="${slot.time.toISOString()}"
           ${slot.available ? 'onclick="meetingWizard.selectTimeSlot(this)"' : ''}>
        ${slot.formatted}
      </div>
    `).join('');
  }

  selectTimeSlot(element) {
    // Deseleccionar slot anterior
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
      slot.classList.remove('selected');
    });
    
    // Seleccionar nuevo slot
    element.classList.add('selected');
    
    // Guardar selección
    this.selectedTime = new Date(element.dataset.time);
    
    // Mostrar información de selección
    this.showSelectionInfo();
    
    // Habilitar botón siguiente
    const nextBtn = document.getElementById('wizard-next-step2');
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  showSelectionInfo() {
    const selectionInfo = document.getElementById('selection-info');
    const selectedDatetimeInfo = document.getElementById('selected-datetime-info');
    
    if (selectionInfo && selectedDatetimeInfo) {
      const formattedDate = this.selectedDate.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const formattedTime = this.selectedTime.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      selectedDatetimeInfo.innerHTML = `
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Hora:</strong> ${formattedTime}</p>
        <p><strong>Duración:</strong> 60 minutos</p>
      `;
      
      selectionInfo.style.display = 'block';
    }
  }

  prepareConfirmation() {
    const confirmationDetails = document.getElementById('confirmation-details');
    
    if (confirmationDetails) {
      const formattedDate = this.selectedDate.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const formattedTime = this.selectedTime.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const endTime = new Date(this.selectedTime.getTime() + 60 * 60 * 1000); // +1 hora
      const formattedEndTime = endTime.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      confirmationDetails.innerHTML = `
        <div class="confirmation-row">
          <span class="confirmation-label">👤 Nombre:</span>
          <span class="confirmation-value">${this.formData.name}</span>
        </div>
        <div class="confirmation-row">
          <span class="confirmation-label">📧 Email:</span>
          <span class="confirmation-value">${this.formData.email}</span>
        </div>
        <div class="confirmation-row">
          <span class="confirmation-label">📱 Teléfono:</span>
          <span class="confirmation-value">${this.formData.phone}</span>
        </div>
        <div class="confirmation-row">
          <span class="confirmation-label">💼 Tipo de Consulta:</span>
          <span class="confirmation-value">${this.formData.meetingType}</span>
        </div>
        <div class="confirmation-row">
          <span class="confirmation-label">📅 Fecha:</span>
          <span class="confirmation-value">${formattedDate}</span>
        </div>
        <div class="confirmation-row">
          <span class="confirmation-label">🕐 Horario:</span>
          <span class="confirmation-value">${formattedTime} - ${formattedEndTime}</span>
        </div>
        <div class="confirmation-row">
          <span class="confirmation-label">📝 Descripción:</span>
          <span class="confirmation-value">${this.formData.description}</span>
        </div>
      `;
    }
  }

  async confirmAppointment() {
    try {
      // Mostrar loading
      const confirmBtn = document.getElementById('wizard-confirm-appointment');
      const originalText = confirmBtn.textContent;
      confirmBtn.textContent = '⏳ Confirmando...';
      confirmBtn.disabled = true;

      // Preparar datos para la API
      const appointmentData = {
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        meetingType: this.formData.meetingType,
        description: this.formData.description,
        startTime: this.selectedTime.toISOString(),
        endTime: new Date(this.selectedTime.getTime() + 60 * 60 * 1000).toISOString()
      };

      // Llamar a la API
      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccessMessage(result);
      } else {
        throw new Error(result.error || 'Error al agendar la cita');
      }

    } catch (error) {
      console.error('Error confirmando cita:', error);
      this.showStepError('Error al confirmar la cita. Intenta de nuevo.');
      
      // Restaurar botón
      const confirmBtn = document.getElementById('wizard-confirm-appointment');
      confirmBtn.textContent = '✅ Confirmar Cita';
      confirmBtn.disabled = false;
    }
  }

  showSuccessMessage(result) {
    // Ocultar todos los pasos
    document.querySelectorAll('.wizard-step').forEach(step => {
      step.style.display = 'none';
    });
    
    // Ocultar progress bar
    document.querySelector('.wizard-progress').style.display = 'none';
    
    // Mostrar mensaje de éxito
    const successMessage = document.getElementById('wizard-success-message');
    const appointmentDetails = document.getElementById('wizard-appointment-details');
    
    if (successMessage && appointmentDetails) {
      appointmentDetails.innerHTML = `
        <p><strong>ID de la cita:</strong> ${result.appointment.id}</p>
        <p><strong>Resumen:</strong> ${result.appointment.summary}</p>
        <p><strong>Fecha:</strong> ${new Date(result.appointment.start.dateTime).toLocaleString('es-CO')}</p>
        ${result.appointment.meetLink ? `<p><strong>Google Meet:</strong> <a href="${result.appointment.meetLink}" target="_blank">Unirse a la reunión</a></p>` : ''}
      `;
      
      successMessage.classList.remove('hidden');
    }
  }

  showStepError(message) {
    // Crear o actualizar mensaje de error
    let errorElement = document.querySelector('.wizard-step-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'wizard-step-error';
      errorElement.style.cssText = `
        background: #fed7d7;
        border: 1px solid #feb2b2;
        color: #c53030;
        padding: 0.75rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
      `;
      
      const currentStep = document.querySelector(`[data-step="${this.currentStep}"]`);
      if (currentStep) {
        currentStep.insertBefore(errorElement, currentStep.firstChild);
      }
    }
    
    errorElement.textContent = message;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      if (errorElement) {
        errorElement.remove();
      }
    }, 5000);
  }

  openModal() {
    const modal = document.getElementById('meeting-wizard-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = document.getElementById('meeting-wizard-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      
      // Resetear wizard
      this.resetWizard();
    }
  }

  resetWizard() {
    this.currentStep = 1;
    this.formData = {};
    this.selectedDate = null;
    this.selectedTime = null;
    
    // Limpiar formulario
    const form = document.getElementById('wizard-step1-form');
    if (form) {
      form.reset();
    }
    
    // Limpiar errores
    document.querySelectorAll('.field-error').forEach(error => {
      error.textContent = '';
    });
    
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
      field.classList.remove('error');
    });
    
    // Resetear date picker
    if (this.datePicker) {
      this.datePicker.clear();
    }
    
    // Ocultar contenedores
    document.getElementById('time-slots-container').style.display = 'none';
    document.getElementById('selection-info').style.display = 'none';
    
    // Ocultar mensaje de éxito
    document.getElementById('wizard-success-message').classList.add('hidden');
    
    // Mostrar progress bar
    document.querySelector('.wizard-progress').style.display = 'flex';
    
    // Resetear pasos
    this.updateStep();
  }
}

// Inicializar wizard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.meetingWizard = new MeetingWizard();
});

// Función global para abrir el wizard
window.openMeetingWizard = () => {
  if (window.meetingWizard) {
    window.meetingWizard.openModal();
  }
};
