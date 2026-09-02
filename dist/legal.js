const languageKey = 'coffeeBridgeLanguage';
const languageButtons = document.querySelectorAll('[data-language]');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

function setLanguage(language) {
  const selected = language === 'kh' ? 'kh' : 'en';
  document.documentElement.lang = selected === 'kh' ? 'km' : 'en';
  document.body.classList.toggle('khmer', selected === 'kh');
  document.querySelectorAll('[data-en]').forEach((element) => {
    element.textContent = element.dataset[selected];
  });
  languageButtons.forEach((button) => {
    const active = button.dataset.language === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  localStorage.setItem(languageKey, selected);
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
});

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

setLanguage(localStorage.getItem(languageKey) || 'en');
