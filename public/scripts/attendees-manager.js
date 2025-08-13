// Attendees Manager - Gestión de invitados para eventos de Google Calendar
class AttendeesManager {
  constructor() {
    this.currentEventId = null;
    this.attendeesList = [];
    this.init();
  }

  init() {
    console.log('🚀 ===== ATTENDEES MANAGER INICIADO =====');
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Escuchar eventos de creación exitosa de citas
    document.addEventListener('appointmentCreated', (event) => {
      const { eventId, appointmentData } = event.detail;
      this.handleAppointmentCreated(eventId, appointmentData);
    });

    // Escuchar clics en botones de gestión de invitados
    document.addEventListener('click', (event) => {
      if (event.target.matches('[data-action="add-attendees"]')) {
        this.showAddAttendeesModal();
      }

      if (event.target.matches('[data-action="manage-attendees"]')) {
        this.showManageAttendeesModal();
      }

      if (event.target.matches('[data-action="remove-attendee"]')) {
        const attendeeEmail = event.target.dataset.email;
        this.removeAttendee(attendeeEmail);
      }
    });
  }

  handleAppointmentCreated(eventId, appointmentData) {
    console.log('📅 Cita creada, configurando gestión de invitados...');
    this.currentEventId = eventId;

    // Mostrar opciones de gestión de invitados
    this.showAttendeesOptions();
  }

  showAttendeesOptions() {
    const confirmationSection = document.querySelector(
      '.appointment-confirmation'
    );
    if (!confirmationSection) return;

    const attendeesSection = document.createElement('div');
    attendeesSection.className =
      'attendees-management mt-6 p-4 bg-gray-50 rounded-lg';
    attendeesSection.innerHTML = `
      <h3 class="text-lg font-semibold mb-3">👥 Gestión de Invitados</h3>
      <div class="flex flex-wrap gap-3">
        <button 
          data-action="add-attendees"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Agregar Invitados
        </button>
        <button 
          data-action="manage-attendees"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          👥 Gestionar Invitados
        </button>
      </div>
      <div id="attendees-list" class="mt-4">
        <p class="text-gray-600">No hay invitados agregados aún.</p>
      </div>
    `;

    confirmationSection.appendChild(attendeesSection);
  }

  showAddAttendeesModal() {
    const modal = document.createElement('div');
    modal.className =
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">➕ Agregar Invitados</h3>
          <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
            ✕
          </button>
        </div>
        
        <form id="add-attendees-form">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Emails de invitados (uno por línea)
              </label>
              <textarea 
                id="attendees-emails"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="invitado1@ejemplo.com&#10;invitado2@ejemplo.com&#10;invitado3@ejemplo.com"
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                onclick="this.closest('.fixed').remove()"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Agregar Invitados
              </button>
            </div>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Manejar envío del formulario
    const form = modal.querySelector('#add-attendees-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddAttendees(modal);
    });
  }

  async handleAddAttendees(modal) {
    const emailsTextarea = modal.querySelector('#attendees-emails');
    const emailsText = emailsTextarea.value.trim();

    if (!emailsText) {
      this.showError('Por favor ingresa al menos un email');
      return;
    }

    // Parsear emails
    const emails = emailsText
      .split('\n')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emails.length === 0) {
      this.showError('Por favor ingresa al menos un email válido');
      return;
    }

    // Validar formato de emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      this.showError(`Emails inválidos: ${invalidEmails.join(', ')}`);
      return;
    }

    // Preparar datos de invitados
    const attendees = emails.map((email) => ({
      email: email,
      displayName: email.split('@')[0], // Usar parte local del email como nombre
    }));

    try {
      this.setLoadingState(true);

      const response = await fetch('/api/calendar/update-event', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: this.currentEventId,
          attendees: attendees,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al agregar invitados');
      }

      // Actualizar lista de invitados
      this.attendeesList = result.event.attendees || [];
      this.updateAttendeesList();

      // Cerrar modal
      modal.remove();

      // Mostrar confirmación
      this.showSuccess(
        `✅ ${attendees.length} invitado(s) agregado(s) exitosamente`
      );

      // Enviar evento personalizado
      document.dispatchEvent(
        new CustomEvent('attendeesAdded', {
          detail: {
            eventId: this.currentEventId,
            attendees: this.attendeesList,
          },
        })
      );
    } catch (error) {
      console.error('❌ Error agregando invitados:', error);
      this.showError(`Error al agregar invitados: ${error.message}`);
    } finally {
      this.setLoadingState(false);
    }
  }

  async showManageAttendeesModal() {
    // Cargar información actualizada del evento antes de mostrar el modal
    const loaded = await this.loadEventInfo();
    if (!loaded) {
      return;
    }

    const modal = document.createElement('div');
    modal.className =
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

    const attendeesHtml =
      this.attendeesList.length > 0
        ? this.attendeesList
            .map(
              (attendee) => `
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">${attendee.displayName || attendee.email}</p>
              <p class="text-sm text-gray-600">${attendee.email}</p>
              ${attendee.responseStatus ? `<p class="text-xs text-blue-600">${attendee.responseStatus}</p>` : ''}
            </div>
            <button 
              data-action="remove-attendee"
              data-email="${attendee.email}"
              class="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        `
            )
            .join('')
        : '<p class="text-gray-600">No hay invitados agregados.</p>';

    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">👥 Gestionar Invitados</h3>
          <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
            ✕
          </button>
        </div>
        
        <div class="space-y-3">
          ${attendeesHtml}
        </div>
        
        <div class="mt-4 pt-4 border-t">
          <button 
            data-action="add-attendees"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onclick="this.closest('.fixed').remove()"
          >
            ➕ Agregar Más Invitados
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  async removeAttendee(email) {
    if (!confirm(`¿Estás seguro de que quieres remover a ${email}?`)) {
      return;
    }

    try {
      this.setLoadingState(true);

      // Filtrar el invitado removido
      const updatedAttendees = this.attendeesList.filter(
        (attendee) => attendee.email !== email
      );

      const response = await fetch('/api/calendar/update-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: this.currentEventId,
          attendees: updatedAttendees,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al remover invitado');
      }

      // Actualizar lista de invitados
      this.attendeesList = result.event.attendees || [];
      this.updateAttendeesList();

      this.showSuccess(`✅ Invitado removido exitosamente`);
    } catch (error) {
      console.error('❌ Error removiendo invitado:', error);
      this.showError(`Error al remover invitado: ${error.message}`);
    } finally {
      this.setLoadingState(false);
    }
  }

  updateAttendeesList() {
    const attendeesListElement = document.getElementById('attendees-list');
    if (!attendeesListElement) return;

    if (this.attendeesList.length === 0) {
      attendeesListElement.innerHTML =
        '<p class="text-gray-600">No hay invitados agregados aún.</p>';
      return;
    }

    const attendeesHtml = this.attendeesList
      .map(
        (attendee) => `
      <div class="flex justify-between items-center p-2 bg-white border rounded-lg">
        <div>
          <p class="font-medium text-sm">${attendee.displayName || attendee.email}</p>
          <p class="text-xs text-gray-600">${attendee.email}</p>
        </div>
        <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
          ${attendee.responseStatus || 'Pendiente'}
        </span>
      </div>
    `
      )
      .join('');

    attendeesListElement.innerHTML = `
      <div class="space-y-2">
        ${attendeesHtml}
      </div>
      <p class="text-sm text-gray-600 mt-2">
        Total: ${this.attendeesList.length} invitado(s)
      </p>
    `;
  }

  setLoadingState(isLoading) {
    const buttons = document.querySelectorAll(
      '[data-action="add-attendees"], [data-action="manage-attendees"]'
    );
    buttons.forEach((button) => {
      if (isLoading) {
        button.disabled = true;
        button.textContent = '⏳ Cargando...';
      } else {
        button.disabled = false;
        if (button.dataset.action === 'add-attendees') {
          button.textContent = '➕ Agregar Invitados';
        } else if (button.dataset.action === 'manage-attendees') {
          button.textContent = '👥 Gestionar Invitados';
        }
      }
    });
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success'
        ? 'bg-green-500 text-white'
        : type === 'error'
          ? 'bg-red-500 text-white'
          : 'bg-blue-500 text-white'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remover después de 5 segundos
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Método público para configurar un evento existente
  setCurrentEvent(eventId, attendees = []) {
    this.currentEventId = eventId;
    this.attendeesList = attendees;
    this.updateAttendeesList();
  }

  // Método público para obtener la lista actual de invitados
  getAttendees() {
    return this.attendeesList;
  }

  // Método para cargar información actualizada del evento desde Google Calendar
  async loadEventInfo() {
    if (!this.currentEventId) {
      console.error('❌ No hay ID de evento para cargar');
      return false;
    }

    try {
      this.setLoadingState(true);

      const response = await fetch(
        `/api/calendar/get-event?eventId=${this.currentEventId}`
      );
      const result = await response.json();

      if (result.success && result.event) {
        this.currentEvent = result.event;
        this.attendeesList = result.event.attendees || [];
        this.updateAttendeesList();
        console.log('✅ Información del evento cargada:', this.currentEvent);
        return true;
      } else {
        console.error(
          '❌ Error al cargar información del evento:',
          result.error
        );
        this.showError('No se pudo cargar la información del evento');
        return false;
      }
    } catch (error) {
      console.error('❌ Error al cargar información del evento:', error);
      this.showError('Error de conexión al cargar información del evento');
      return false;
    } finally {
      this.setLoadingState(false);
    }
  }
}

// Inicializar el gestor de invitados cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.attendeesManager = new AttendeesManager();
});

// Exportar para uso global
window.AttendeesManager = AttendeesManager;
