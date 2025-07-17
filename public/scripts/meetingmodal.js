// Elimina cualquier import
// import flatpickr from 'flatpickr';

const modal = document.getElementById('meeting-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const form = document.getElementById('appointment-form');
const formContainer = document.querySelector('.form-container');
const confirmationMessage = document.getElementById('confirmation-message');

// --- DATOS DE EJEMPLO (Esto vendrá de N8N) ---
const busySlots = [
  { from: '2025-07-15T14:00:00.000Z', to: '2025-07-15T15:00:00.000Z' },
  { from: '2025-07-16T10:00:00.000Z', to: '2025-07-16T11:30:00.000Z' },
  // Día completo deshabilitado
  new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Deshabilitar en 3 días a partir de hoy
];
// ---------------------------------------------

const openModal = () => {
  if (modal) {
    modal.classList.remove('hidden');
    // Reiniciar el formulario por si se agendó antes
    form.classList.remove('hidden');
    confirmationMessage?.classList.add('hidden');
  }
};

closeModalBtn?.addEventListener('click', () => {
  modal?.classList.add('hidden');
});

// Inicializar flatpickr si está disponible globalmente
if (window.flatpickr && form) {
  window.flatpickr(form.querySelector('input[type="datetime-local"]'), {
    // Configuración personalizada aquí
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    // Puedes agregar lógica para deshabilitar slots ocupados
  });
}

// Ejemplo de apertura del modal (puedes conectar esto a un botón)
// document.getElementById('open-modal-btn').addEventListener('click', openModal);
