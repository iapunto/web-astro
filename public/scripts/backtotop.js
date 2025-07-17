window.addEventListener('DOMContentLoaded', () => {
  const mybutton = document.getElementById('myBtn');
  if (!mybutton) return;
  window.onscroll = function () {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      mybutton.classList.remove('hidden');
    } else {
      mybutton.classList.add('hidden');
    }
  };
  mybutton.onclick = function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
});
