const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');
const errorMsg = document.getElementById('form-error');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  successMsg?.classList.add('hidden');
  errorMsg?.classList.add('hidden');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      form.reset();
      successMsg?.classList.remove('hidden');
    } else {
      errorMsg?.classList.remove('hidden');
    }
  } catch (err) {
    errorMsg?.classList.remove('hidden');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensaje';
    }
  }
});
