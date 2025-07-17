import flatpickr from 'flatpickr';

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
  new Date().fp_incr(3), // Deshabilitar en 3 días a partir de hoy
];
// ---------------------------------------------

const openModal = () => {
  if (modal) {
    modal.classList.remove('hidden');
    // Reiniciar el formulario por si se agendó antes
    form.classList.remove('hidden');
    confirmationMessage.classList.add('hidden');
  }
};

const closeModal = () => {
  if (modal) {
    modal.classList.add('hidden');
  }
};

document.addEventListener('open-meeting-modal', openModal);
closeModalBtn?.addEventListener('click', closeModal);

const openModalButtons = document.querySelectorAll("[id^='open-modal-btn']");
openModalButtons.forEach((btn) => btn.addEventListener('click', openModal));

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Inicializar Flatpickr
const fp = flatpickr('#appointment-time', {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  minDate: 'today',
  maxDate: new Date().fp_incr(60), // Permitir agendar en los próximos 60 días
  time_24hr: true,
  minTime: '09:00',
  maxTime: '18:00',
  minuteIncrement: 30,
  disable: busySlots, // Aquí se usa la data de ejemplo
  locale: {
    firstDayOfWeek: 1, // Lunes como primer día
    weekdays: {
      shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      longhand: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
      ],
    },
    months: {
      shorthand: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
      longhand: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
    },
  },
});

// Manejar el envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Formulario enviado (simulación)');
  // Aquí iría la llamada fetch al webhook de N8N para crear la cita
  // Simular éxito y mostrar mensaje de confirmación
  form.classList.add('hidden');
  confirmationMessage.classList.remove('hidden');
});
