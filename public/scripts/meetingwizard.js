class MeetingWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.formData = {};
    this.selectedDate = null;
    this.selectedTime = null;
    this.selectedEndTime = null;
    this.datePicker = null;
    this.availableSlots = [];
    
    console.log('🚀 MeetingWizard constructor iniciado');
    this.init();
  }

  init() {
    console.log('🔧 Inicializando MeetingWizard...');
    this.bindEvents();
    this.initDatePicker();
    console.log('✅ MeetingWizard inicializado correctamente');
  }

  bindEvents() {
    console.log('🔗 Vinculando eventos...');
    
    // Botones de navegación
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('wizard-next-btn')) {
        console.log('👉 Botón siguiente clickeado');
        this.nextStep();
      }
      if (e.target.classList.contains('wizard-prev-btn')) {
        console.log('👈 Botón anterior clickeado');
        this.prevStep();
      }
      if (e.target.classList.contains('wizard-confirm-btn')) {
        console.log('✅ Botón confirmar clickeado');
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
    console.log('✅ Eventos vinculados correctamente');
  }

  initDatePicker() {
    console.log('📅 Inicializando Flatpickr...');
    const dateInput = document.getElementById('wizard-date-picker');
    if (!dateInput) {
      console.error('❌ No se encontró el input de fecha');
      return;
    }

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
        console.log('📅 Fecha seleccionada:', selectedDates[0]);
        if (selectedDates.length > 0) {
          this.selectedDate = selectedDates[0];
          this.loadTimeSlots(this.selectedDate);
        }
      }
    });
    console.log('✅ Flatpickr inicializado correctamente');
  }

  setupStep1Validation() {
    const form = document.getElementById('wizard-step1-form');
    if (!form) {
      console.error('❌ No se encontró el formulario del paso 1');
      return;
    }

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
    console.log('🔍 Validando paso 1...');
    const fields = ['wizard-name', 'wizard-email', 'wizard-phone', 'wizard-meeting-type', 'wizard-description'];
    let isValid = true;

    fields.forEach(fieldId => {
      if (!this.validateField(fieldId)) {
        isValid = false;
      }
    });

    console.log('✅ Paso 1 válido:', isValid);
    return isValid;
  }

  validateStep2() {
    console.log('🔍 Validando paso 2...');
    const isValid = this.selectedDate && this.selectedTime;
    console.log('✅ Paso 2 válido:', isValid, 'Fecha:', this.selectedDate, 'Hora:', this.selectedTime);
    return isValid;
  }

  nextStep() {
    console.log('👉 Avanzando al siguiente paso. Paso actual:', this.currentStep);
    
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
      console.log('🔄 Actualizando al paso:', this.currentStep);
      this.updateStep();
    }
  }

  prevStep() {
    console.log('👈 Retrocediendo al paso anterior. Paso actual:', this.currentStep);
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStep();
    }
  }

  updateStep() {
    console.log('🔄 Actualizando paso a:', this.currentStep);
    
    // Ocultar todos los pasos
    const allSteps = document.querySelectorAll('.wizard-step');
    console.log('📋 Pasos encontrados:', allSteps.length);
    
    allSteps.forEach((step, index) => {
      step.classList.remove('active');
      console.log(`Paso ${index + 1} removido de active`);
    });
    
    // Mostrar el paso actual
    const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
    if (currentStepElement) {
      currentStepElement.classList.add('active');
      console.log(`✅ Paso ${this.currentStep} activado`);
      
      // Verificar visibilidad del paso actual
      const computedStyle = window.getComputedStyle(currentStepElement);
      console.log(`👁️ Paso ${this.currentStep} display:`, computedStyle.display);
      console.log(`👁️ Paso ${this.currentStep} visibility:`, computedStyle.visibility);
      console.log(`👁️ Paso ${this.currentStep} opacity:`, computedStyle.opacity);
      
      // Verificar contenido del paso
      if (this.currentStep === 2) {
        const datePicker = document.getElementById('wizard-date-picker');
        const timeSlotsContainer = document.getElementById('time-slots-container');
        console.log('📅 Date picker encontrado:', !!datePicker);
        console.log('🕐 Time slots container encontrado:', !!timeSlotsContainer);
        
        if (datePicker) {
          console.log('📅 Date picker visible:', window.getComputedStyle(datePicker).display !== 'none');
        }
      }
    } else {
      console.error(`❌ No se encontró el elemento del paso ${this.currentStep}`);
    }

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
    
    console.log('✅ Paso actualizado correctamente');
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
    console.log('💾 Guardando datos del paso 1...');
    this.formData = {
      name: document.getElementById('wizard-name').value.trim(),
      email: document.getElementById('wizard-email').value.trim(),
      phone: document.getElementById('wizard-phone').value.trim(),
      meetingType: document.getElementById('wizard-meeting-type').value,
      description: document.getElementById('wizard-description').value.trim()
    };
    console.log('✅ Datos guardados:', this.formData);
  }

  async loadTimeSlots(date) {
    console.log('🕐 Cargando horarios para:', date);
    try {
      // Mostrar loading
      const timeSlotsContainer = document.getElementById('time-slots-container');
      const timeSlotsGrid = document.getElementById('time-slots-grid');
      
      if (!timeSlotsContainer || !timeSlotsGrid) {
        console.error('❌ No se encontraron elementos de horarios');
        return;
      }
      
      timeSlotsContainer.style.display = 'block';
      timeSlotsGrid.innerHTML = '<div class="loading">Cargando horarios disponibles...</div>';

      // Generar horarios disponibles
      const timeSlots = this.generateTimeSlots(date);
      
      // Verificar disponibilidad
      const availableSlots = await this.checkAvailability(date, timeSlots);
      
      this.renderTimeSlots(availableSlots);
      
    } catch (error) {
      console.error('❌ Error cargando horarios:', error);
      this.showStepError('Error cargando horarios disponibles. Intenta de nuevo.');
    }
  }

  generateTimeSlots(date) {
    const slots = [];
    // Rangos de horas específicos: 9-10, 10-11, 11-12, 13-14, 14-15, 15-16, 16-17
    const timeRanges = [
      { start: 9, end: 10, label: '9:00 - 10:00' },
      { start: 10, end: 11, label: '10:00 - 11:00' },
      { start: 11, end: 12, label: '11:00 - 12:00' },
      { start: 13, end: 14, label: '1:00 - 2:00 PM' },
      { start: 14, end: 15, label: '2:00 - 3:00 PM' },
      { start: 15, end: 16, label: '3:00 - 4:00 PM' },
      { start: 16, end: 17, label: '4:00 - 5:00 PM' }
    ];

    timeRanges.forEach(range => {
      const startTime = new Date(date);
      startTime.setHours(range.start, 0, 0, 0);

      const endTime = new Date(date);
      endTime.setHours(range.end, 0, 0, 0);

      slots.push({
        startTime: startTime,
        endTime: endTime,
        time: startTime, // Para compatibilidad
        formatted: range.label,
        available: true
      });
    });

    console.log('✅ Horarios generados:', slots.length);
    return slots;
  }

  async checkAvailability(date, timeSlots) {
    console.log('🔍 Verificando disponibilidad...');
    try {
      const response = await fetch('/api/calendar/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date.toISOString().split('T')[0] }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📊 Resultado de disponibilidad:', result);
      
      // Mapear los resultados del API a nuestro formato
      return timeSlots.map(slot => {
        // Buscar slots ocupados que se superpongan con nuestro rango
        const conflictingSlot = result.timeSlots.find(apiSlot => {
          const apiStart = new Date(apiSlot.time);
          const apiEnd = new Date(apiStart.getTime() + 60 * 60 * 1000); // +1 hora

          // Verificar si hay superposición
          return !apiSlot.available &&
                 (slot.startTime < apiEnd && slot.endTime > apiStart);
        });

        return {
          ...slot,
          available: !conflictingSlot
        };
      });
    } catch (error) {
      console.error('❌ Error verificando disponibilidad:', error);
      // En caso de error, asumir que todos están disponibles
      return timeSlots.map(slot => ({ ...slot, available: true }));
    }
  }

  renderTimeSlots(slots) {
    console.log('🎨 Renderizando horarios...');
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    if (!timeSlotsGrid) {
      console.error('❌ No se encontró el grid de horarios');
      return;
    }

    timeSlotsGrid.innerHTML = slots.map(slot => `
      <div class="time-slot ${slot.available ? '' : 'disabled'}"
          data-start-time="${slot.startTime.toISOString()}"
          data-end-time="${slot.endTime.toISOString()}"
          ${slot.available ? 'onclick="meetingWizard.selectTimeSlot(this)"' : ''}>
       <div class="time-slot-label">${slot.formatted}</div>
       <div class="time-slot-duration">45 min reunión</div>
      </div>
    `).join('');
    
    console.log('✅ Horarios renderizados:', slots.length);
  }

  selectTimeSlot(element) {
    console.log('🎯 Horario seleccionado:', element);
    
    // Remover selección anterior
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.classList.remove('selected');
    });
    
    // Seleccionar el nuevo
    element.classList.add('selected');
    
    // Guardar selección
    this.selectedTime = new Date(element.dataset.startTime);
    this.selectedEndTime = new Date(element.dataset.endTime);
    
    console.log('✅ Horario guardado:', this.selectedTime, 'a', this.selectedEndTime);
    
    // Mostrar información de selección
    this.showSelectionInfo();
    
    // Habilitar botón siguiente
    const nextBtn = document.getElementById('wizard-next-step2');
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  showSelectionInfo() {
    const selectedDatetimeInfo = document.getElementById('selected-datetime-info');
    const selectionInfo = document.getElementById('selection-info');
    
    if (!selectedDatetimeInfo || !selectionInfo) {
      console.error('❌ No se encontraron elementos de información de selección');
      return;
    }
    
    const formattedDate = this.selectedDate.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedStartTime = this.selectedTime.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const formattedEndTime = this.selectedEndTime.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    selectedDatetimeInfo.innerHTML = `
      <p><strong>Fecha:</strong> ${formattedDate}</p>
      <p><strong>Horario:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
      <p><strong>Duración:</strong> 45 minutos (reunión) + 15 minutos (margen)</p>
    `;
    
    selectionInfo.style.display = 'block';
    console.log('✅ Información de selección mostrada');
  }

  prepareConfirmation() {
    console.log('📋 Preparando confirmación...');
    const confirmationDetails = document.getElementById('confirmation-details');
    if (!confirmationDetails) {
      console.error('❌ No se encontró el elemento de confirmación');
      return;
    }
    
    const formattedDate = this.selectedDate.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedStartTime = this.selectedTime.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const formattedEndTime = this.selectedEndTime.toLocaleTimeString('es-CO', {
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
        <span class="confirmation-label">📝 Descripción:</span>
        <span class="confirmation-value">${this.formData.description}</span>
      </div>
      <div class="confirmation-row">
        <span class="confirmation-label">📅 Fecha:</span>
        <span class="confirmation-value">${formattedDate}</span>
      </div>
      <div class="confirmation-row">
        <span class="confirmation-label">🕐 Horario:</span>
        <span class="confirmation-value">${formattedStartTime} - ${formattedEndTime}</span>
      </div>
      <div class="confirmation-row">
        <span class="confirmation-label">⏱️ Duración:</span>
        <span class="confirmation-value">45 minutos (reunión) + 15 minutos (margen)</span>
      </div>
    `;
    
    console.log('✅ Confirmación preparada');
  }

  async confirmAppointment() {
    console.log('✅ Confirmando cita...');
    try {
      const appointmentData = {
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        meetingType: this.formData.meetingType,
        description: this.formData.description,
        startTime: this.selectedTime.toISOString(),
        endTime: this.selectedEndTime.toISOString()
      };

      console.log('📤 Enviando datos:', appointmentData);

      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccessMessage(result);
      } else {
        this.showStepError(result.message || 'Error al agendar la cita. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('❌ Error confirmando cita:', error);
      this.showStepError('Error de conexión. Intenta de nuevo.');
    }
  }

  showSuccessMessage(result) {
    console.log('🎉 Mostrando mensaje de éxito');
    const successMessage = document.getElementById('wizard-success-message');
    const appointmentDetails = document.getElementById('wizard-appointment-details');
    
    if (successMessage && appointmentDetails) {
      appointmentDetails.innerHTML = `
        <div class="confirmation-row">
          <span class="confirmation-label">📅 Fecha:</span>
          <span class="confirmation-value">${this.selectedDate.toLocaleDateString('es-CO')}</span>
        </div>
        <div class="confirmation-row">
          <span class="confirmation-label">🕐 Horario:</span>
          <span class="confirmation-value">${this.selectedTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })} - ${this.selectedEndTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
        </div>
        <div class="confirmation-row">
          <span class="confirmation-label">👤 Cliente:</span>
          <span class="confirmation-value">${this.formData.name}</span>
        </div>
        <div class="confirmation-row">
          <span class="confirmation-label">📧 Email:</span>
          <span class="confirmation-value">${this.formData.email}</span>
        </div>
      `;
      
      successMessage.classList.remove('hidden');
    }
  }

  showStepError(message) {
    console.error('❌ Error en paso:', message);
    // Aquí podrías mostrar un mensaje de error en la UI
    alert(message);
  }

  openModal() {
    console.log('🚀 Abriendo modal del wizard...');
    const modal = document.getElementById('meeting-wizard-modal');
    if (modal) {
      modal.classList.remove('hidden');
      console.log('✅ Modal abierto');
    } else {
      console.error('❌ No se encontró el modal');
    }
  }

  closeModal() {
    console.log('🔒 Cerrando modal del wizard...');
    const modal = document.getElementById('meeting-wizard-modal');
    if (modal) {
      modal.classList.add('hidden');
      this.resetWizard();
      console.log('✅ Modal cerrado');
    }
  }

  resetWizard() {
    console.log('🔄 Reseteando wizard...');
    this.currentStep = 1;
    this.formData = {};
    this.selectedDate = null;
    this.selectedTime = null;
    this.selectedEndTime = null;
    
    // Resetear formulario
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
    
    // Resetear selecciones
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.classList.remove('selected');
    });
    
    // Ocultar contenedores
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const selectionInfo = document.getElementById('selection-info');
    const successMessage = document.getElementById('wizard-success-message');
    
    if (timeSlotsContainer) timeSlotsContainer.style.display = 'none';
    if (selectionInfo) selectionInfo.style.display = 'none';
    if (successMessage) successMessage.classList.add('hidden');
    
    // Resetear progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index === 0) step.classList.add('active');
    });
    
    // Mostrar paso 1
    this.updateStep();
    
    console.log('✅ Wizard reseteado');
  }
}

// Inicialización global
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌐 DOM cargado, inicializando MeetingWizard...');
  
  // Verificar que Flatpickr esté disponible
  if (typeof flatpickr === 'undefined') {
    console.error('❌ Flatpickr no está disponible');
    return;
  }
  
  // Crear instancia global
  window.meetingWizard = new MeetingWizard();

  // Conectar botones específicos al wizard
  const wizardButtons = [
    'open-wizard-btn-nav', // Botón navbar desktop
    'open-wizard-btn-nav-mobile', // Botón navbar mobile
    'open-wizard-btn-services', // Botón en sección de servicios
    'open-wizard-btn', // Botón genérico
  ];

  wizardButtons.forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`🎯 Botón ${buttonId} clickeado`);
        window.meetingWizard.openModal();
      });
    } else {
      console.log(`⚠️ Botón ${buttonId} no encontrado`);
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
        console.log('🎯 Botón de agenda encontrado por texto');
        window.meetingWizard.openModal();
      });
    }
  });

  console.log('✅ MeetingWizard inicializado globalmente');
});

// Función global para abrir el wizard
window.openMeetingWizard = () => {
  console.log('🌐 Función global openMeetingWizard llamada');
  if (window.meetingWizard) {
    window.meetingWizard.openModal();
  } else {
    console.error('❌ MeetingWizard no está disponible');
  }
};
