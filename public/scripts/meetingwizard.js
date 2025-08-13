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
    console.log('📅 Inicializando calendario personalizado...');
    
    // Configurar estado del calendario
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.monthlyAvailability = [];
    
    // Cargar disponibilidad del mes actual
    this.loadMonthlyAvailability();
    
    // Configurar navegación del calendario
    this.setupCalendarNavigation();
    
    console.log('✅ Calendario personalizado inicializado correctamente');
  }

  setupCalendarNavigation() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentMonth--;
        if (this.currentMonth < 0) {
          this.currentMonth = 11;
          this.currentYear--;
        }
        this.loadMonthlyAvailability();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentMonth++;
        if (this.currentMonth > 11) {
          this.currentMonth = 0;
          this.currentYear++;
        }
        this.loadMonthlyAvailability();
      });
    }
  }

  async loadMonthlyAvailability() {
    console.log('📅 Cargando disponibilidad mensual...');
    try {
      const response = await fetch('/api/calendar/monthly-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: this.currentYear,
          month: this.currentMonth
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        this.monthlyAvailability = result.days;
        this.renderCalendar();
        this.updateMonthTitle();
        
        // Aplicar estilos después de renderizar
        setTimeout(() => {
          this.applyCalendarStyles();
        }, 100);
      } else {
        console.error('❌ Error cargando disponibilidad mensual:', result.error);
      }
    } catch (error) {
      console.error('❌ Error cargando disponibilidad mensual:', error);
    }
  }

  updateMonthTitle() {
    const monthTitle = document.getElementById('current-month');
    if (monthTitle) {
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      monthTitle.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
    }
  }

  renderCalendar() {
    console.log('🎨 Renderizando calendario...');
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) {
      console.error('❌ No se encontró el grid del calendario');
      return;
    }

    // Obtener el primer día del mes y el número de días
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Crear encabezados de días
    const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    let calendarHTML = '';
    
    // Agregar encabezados
    dayHeaders.forEach(header => {
      calendarHTML += `<div class="calendar-day-header">${header}</div>`;
    });

    // Agregar días vacíos al inicio si es necesario
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarHTML += '<div class="calendar-day empty"></div>';
    }

    // Agregar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      
      // Buscar disponibilidad para este día
      const dayAvailability = this.monthlyAvailability.find(d => d.date === dateString);
      
      let dayClasses = ['calendar-day'];
      
      if (isPast) {
        dayClasses.push('past');
      } else if (isWeekend) {
        dayClasses.push('weekend');
      } else if (dayAvailability && dayAvailability.hasAvailability) {
        dayClasses.push('available');
      } else {
        dayClasses.push('unavailable');
      }
      
      if (isToday) {
        dayClasses.push('today');
      }
      
      if (this.selectedDate && dateString === this.selectedDate.toISOString().split('T')[0]) {
        dayClasses.push('selected');
      }
      
      const isClickable = !isPast && !isWeekend && dayAvailability && dayAvailability.hasAvailability;
      
      calendarHTML += `
        <div class="${dayClasses.join(' ')}" 
             data-date="${dateString}"
             ${isClickable ? 'onclick="meetingWizard.selectDate(this)"' : ''}>
          ${day}
        </div>
      `;
    }

    calendarGrid.innerHTML = calendarHTML;
    
    // Aplicar estilos inmediatamente después del renderizado
    setTimeout(() => {
      const days = calendarGrid.querySelectorAll('.calendar-day');
      days.forEach(day => {
        day.style.display = 'flex';
        day.style.alignItems = 'center';
        day.style.justifyContent = 'center';
        
        // Aplicar colores según las clases
        if (day.classList.contains('available')) {
          day.style.background = '#dcfce7';
          day.style.color = '#166534';
          day.style.borderColor = '#22c55e';
        } else if (day.classList.contains('unavailable')) {
          day.style.background = '#f3f4f6';
          day.style.color = '#9ca3af';
          day.style.cursor = 'not-allowed';
        } else if (day.classList.contains('selected')) {
          day.style.background = '#E51F52';
          day.style.color = 'white';
          day.style.borderColor = '#E51F52';
        } else if (day.classList.contains('weekend')) {
          day.style.background = '#fef2f2';
          day.style.color = '#dc2626';
        } else if (day.classList.contains('past')) {
          day.style.background = '#f9fafb';
          day.style.color = '#d1d5db';
          day.style.cursor = 'not-allowed';
        }
      });
    }, 50);
    
    console.log('✅ Calendario renderizado correctamente');
  }

  selectDate(element) {
    console.log('🎯 Fecha seleccionada:', element.dataset.date);
    
    // Remover selección anterior
    document.querySelectorAll('.calendar-day').forEach(day => {
      day.classList.remove('selected');
      // Restaurar estilos originales
      if (day.classList.contains('available')) {
        day.style.background = '#dcfce7';
        day.style.color = '#166534';
        day.style.borderColor = '#22c55e';
      }
    });
    
    // Seleccionar el nuevo día
    element.classList.add('selected');
    element.style.background = '#E51F52';
    element.style.color = 'white';
    element.style.borderColor = '#E51F52';
    
    // Guardar fecha seleccionada
    this.selectedDate = new Date(element.dataset.date);
    
    // Cargar horarios para la fecha seleccionada
    this.loadTimeSlots(this.selectedDate);
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
    
    // Ocultar todos los pasos - USAR SELECTOR MÁS ROBUSTO
    const allSteps = document.querySelectorAll('.wizard-step');
    console.log('📋 Pasos encontrados:', allSteps.length);
    
    allSteps.forEach((step, index) => {
      step.classList.remove('active');
      // FORZAR OCULTAMIENTO DE TODOS LOS PASOS
      step.style.display = 'none';
      step.style.visibility = 'hidden';
      step.style.opacity = '0';
      console.log(`Paso ${index + 1} (data-step="${step.getAttribute('data-step')}") removido de active y ocultado`);
    });
    
    // Mostrar el paso actual - USAR SELECTOR MÁS ROBUSTO
    let currentStepElement = document.querySelector(`.wizard-step[data-step="${this.currentStep}"]`);
    
    // Si no lo encuentra, intentar con selector más específico
    if (!currentStepElement) {
      const allSteps = document.querySelectorAll('.wizard-step');
      currentStepElement = Array.from(allSteps).find(step => 
        step.getAttribute('data-step') === this.currentStep.toString()
      );
    }
    
    if (currentStepElement) {
      currentStepElement.classList.add('active');
      
      // FORZAR VISIBILIDAD DEL PASO ACTUAL
      currentStepElement.style.display = 'block';
      currentStepElement.style.visibility = 'visible';
      currentStepElement.style.opacity = '1';
      
      console.log(`✅ Paso ${this.currentStep} activado y forzado a visible`);
      console.log(`🔍 Elemento encontrado:`, currentStepElement);
      
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
          console.log('📅 Date picker value:', datePicker.value);
          console.log('📅 Date picker placeholder:', datePicker.placeholder);
        }
        
        // Verificar si Flatpickr está funcionando
        if (this.datePicker) {
          console.log('📅 Flatpickr instance:', !!this.datePicker);
          console.log('📅 Flatpickr isOpen:', this.datePicker.isOpen);
        }
        
        // Verificar el contenido del paso 2
        const step2Content = currentStepElement.innerHTML;
        console.log('📋 Paso 2 contenido length:', step2Content.length);
        console.log('📋 Paso 2 contiene date-picker:', step2Content.includes('wizard-date-picker'));
        console.log('📋 Paso 2 contiene time-slots:', step2Content.includes('time-slots-container'));
      }
    } else {
      console.error(`❌ No se encontró el elemento del paso ${this.currentStep}`);
      // DEBUG: Mostrar todos los pasos disponibles
      const allSteps = document.querySelectorAll('.wizard-step');
      console.log('🔍 Todos los pasos disponibles:', allSteps.length);
      allSteps.forEach((step, index) => {
        console.log(`Paso ${index + 1}:`, step.getAttribute('data-step'), step);
      });
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

      // Obtener disponibilidad real de Google Calendar
      const dateString = date.toISOString().split('T')[0];
      const response = await fetch('/api/calendar/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateString }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        this.renderTimeSlots(result.timeSlots);
      } else {
        throw new Error(result.error || 'Error obteniendo disponibilidad');
      }
      
    } catch (error) {
      console.error('❌ Error cargando horarios:', error);
      this.showStepError('Error cargando horarios disponibles. Intenta de nuevo.');
    }
  }



  renderTimeSlots(slots) {
    console.log('🎨 Renderizando horarios...');
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    if (!timeSlotsGrid) {
      console.error('❌ No se encontró el grid de horarios');
      return;
    }

    if (slots.length === 0) {
      timeSlotsGrid.innerHTML = '<div class="loading">No hay horarios disponibles para esta fecha.</div>';
      return;
    }

    timeSlotsGrid.innerHTML = slots.map(slot => {
      const startTime = new Date(slot.time);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hora
      
      return `
        <div class="time-slot ${slot.available ? '' : 'disabled'}"
            data-start-time="${startTime.toISOString()}"
            data-end-time="${endTime.toISOString()}"
            ${slot.available ? 'onclick="meetingWizard.selectTimeSlot(this)"' : ''}>
         <div class="time-slot-label">${slot.formatted}</div>
        </div>
      `;
    }).join('');
    
    // Aplicar estilos inmediatamente después del renderizado
    setTimeout(() => {
      const timeSlots = timeSlotsGrid.querySelectorAll('.time-slot');
      timeSlots.forEach(slot => {
        slot.style.display = 'flex';
        slot.style.alignItems = 'center';
        slot.style.justifyContent = 'center';
        
        // Aplicar colores según las clases
        if (slot.classList.contains('disabled')) {
          slot.style.background = '#f9fafb';
          slot.style.color = '#9ca3af';
          slot.style.cursor = 'not-allowed';
          slot.style.borderColor = '#d1d5db';
        } else {
          slot.style.background = 'white';
          slot.style.color = '#374151';
          slot.style.borderColor = '#E51F52';
          slot.style.cursor = 'pointer';
        }
      });
    }, 50);
    
    console.log('✅ Horarios renderizados:', slots.length);
  }

  selectTimeSlot(element) {
    console.log('🎯 Horario seleccionado:', element);
    
    // Remover selección anterior
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.classList.remove('selected');
      // Restaurar estilos originales
      if (!slot.classList.contains('disabled')) {
        slot.style.background = 'white';
        slot.style.color = '#374151';
        slot.style.borderColor = '#E51F52';
      }
    });
    
    // Seleccionar el nuevo
    element.classList.add('selected');
    element.style.background = 'linear-gradient(135deg, #E51F52 0%, #d41a4a 100%)';
    element.style.color = 'white';
    element.style.borderColor = '#E51F52';
    
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

  applyCalendarStyles() {
    console.log('🎨 Aplicando estilos al calendario...');
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
      if (day.classList.contains('available')) {
        day.style.background = '#dcfce7';
        day.style.color = '#166534';
        day.style.borderColor = '#22c55e';
      } else if (day.classList.contains('unavailable')) {
        day.style.background = '#f3f4f6';
        day.style.color = '#9ca3af';
        day.style.cursor = 'not-allowed';
      } else if (day.classList.contains('selected')) {
        day.style.background = '#E51F52';
        day.style.color = 'white';
        day.style.borderColor = '#E51F52';
      } else if (day.classList.contains('weekend')) {
        day.style.background = '#fef2f2';
        day.style.color = '#dc2626';
      } else if (day.classList.contains('past')) {
        day.style.background = '#f9fafb';
        day.style.color = '#d1d5db';
        day.style.cursor = 'not-allowed';
      }
    });
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
       <p><strong>Hora:</strong> ${formattedStartTime}</p>
       <p><strong>Duración:</strong> 45 minutos</p>
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
         <span class="confirmation-label">🕐 Hora:</span>
         <span class="confirmation-value">${formattedStartTime}</span>
       </div>
       <div class="confirmation-row">
         <span class="confirmation-label">⏱️ Duración:</span>
         <span class="confirmation-value">45 minutos</span>
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
        endTime: this.selectedEndTime.toISOString(),
        autoConfirm: true // Confirmación automática
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
    const wizardBody = document.querySelector('.wizard-modal-body');
    const modalContent = document.querySelector('.wizard-modal-content');
    
    if (successMessage && appointmentDetails && wizardBody) {
      // Ocultar progress bar y todos los pasos
      const progressBar = document.querySelector('.wizard-progress');
      const allSteps = document.querySelectorAll('.wizard-step');
      
      if (progressBar) progressBar.style.display = 'none';
      allSteps.forEach(step => {
        step.style.display = 'none';
        step.style.visibility = 'hidden';
        step.style.opacity = '0';
      });
      
      // Ajustar el modal content para el mensaje de éxito
      if (modalContent) {
        modalContent.style.padding = '0';
        modalContent.style.overflow = 'hidden';
      }
      
      // Preparar contenido del mensaje de éxito
      appointmentDetails.innerHTML = `
        <div class="confirmation-row">
          <span class="confirmation-label">📅 Fecha:</span>
          <span class="confirmation-value">${this.selectedDate.toLocaleDateString('es-CO')}</span>
        </div>
                 <div class="confirmation-row">
           <span class="confirmation-label">🕐 Hora:</span>
           <span class="confirmation-value">${this.selectedTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
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
      
      // Mostrar mensaje de éxito
      successMessage.classList.remove('hidden');
      successMessage.style.display = 'block';
      successMessage.style.visibility = 'visible';
      successMessage.style.opacity = '1';
      
      console.log('✅ Mensaje de éxito mostrado correctamente');
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
    
    // Restaurar progress bar
    const progressBar = document.querySelector('.wizard-progress');
    if (progressBar) progressBar.style.display = 'flex';
    
    // Restaurar modal content
    const modalContent = document.querySelector('.wizard-modal-content');
    if (modalContent) {
      modalContent.style.padding = '2rem';
      modalContent.style.overflow = 'auto';
    }
    
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
