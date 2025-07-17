let lastScroll = 0;
const navbar = document.getElementById('navbar');
const topbar = document.getElementById('topbar-container');
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 60) {
    if (topbar) topbar.style.transform = 'translateY(-100%)';
    if (navbar) navbar.classList.add('shrink');
  } else {
    if (topbar) topbar.style.transform = 'translateY(0)';
    if (navbar) navbar.classList.remove('shrink');
  }
  lastScroll = currentScroll;
});
// Menú hamburguesa
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuClose = document.getElementById('menu-close');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('open');
  });
}
if (menuClose && mobileMenu) {
  menuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
}
document.addEventListener('click', (e) => {
  if (mobileMenu && mobileMenu.classList.contains('open')) {
    if (!mobileMenu.contains(e.target) && e.target !== menuToggle) {
      mobileMenu.classList.remove('open');
    }
  }
});
// Dropdown de servicios en mobile
const mobileServicesToggle = document.getElementById('mobile-services-toggle');
const mobileServicesList = document.getElementById('mobile-services-list');
if (mobileServicesToggle && mobileServicesList) {
  mobileServicesToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileServicesList.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (
      !mobileServicesToggle.contains(e.target) &&
      !mobileServicesList.contains(e.target)
    ) {
      mobileServicesList.classList.add('hidden');
    }
  });
}
// Buscador global desktop desplegable
const searchToggleBtn = document.getElementById('search-toggle-btn');
const searchbarInput = document.getElementById('searchbar-input');
const searchbarForm = searchToggleBtn?.closest('form');
if (searchToggleBtn && searchbarInput && searchbarForm) {
  function closeSearchbar() {
    searchbarInput.classList.remove('active');
    searchbarInput.value = '';
  }
  searchToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (searchbarInput.classList.contains('active')) {
      closeSearchbar();
    } else {
      searchbarInput.classList.add('active');
      searchbarInput.focus();
      searchbarInput.value = '';
    }
  });
  searchbarInput.addEventListener('blur', () => {
    setTimeout(() => {
      closeSearchbar();
    }, 200);
  });
  document.addEventListener('mousedown', (e) => {
    if (
      searchbarInput.classList.contains('active') &&
      !searchbarInput.contains(e.target) &&
      !searchToggleBtn.contains(e.target)
    ) {
      closeSearchbar();
    }
  });
  searchbarForm.addEventListener('submit', (e) => {
    if (!searchbarInput.value.trim()) {
      e.preventDefault();
      searchbarInput.focus();
    }
  });
  searchbarInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchbarForm.submit();
    }
  });
}
