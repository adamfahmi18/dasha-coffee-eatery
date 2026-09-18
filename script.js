const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateHeader() { header.classList.toggle('is-scrolled', window.scrollY > 28); }
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  mobileMenu.classList.toggle('is-open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('is-locked', open);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => { if (window.innerWidth >= 760) setMenu(false); });

if (!reducedMotion) {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.12, rootMargin: '0px 0px -5%' });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
}

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const categories = [...document.querySelectorAll('[data-category]')];
function applyFilter(filter) {
  filterButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.filter === filter));
  categories.forEach((category, index) => {
    const visible = filter === 'all' || category.dataset.category === filter;
    category.classList.toggle('is-hidden', !visible);
    if (visible) {
      category.classList.remove('is-entering');
      void category.offsetWidth;
      category.style.animationDelay = `${index * 40}ms`;
      category.classList.add('is-entering');
    }
  });
}
filterButtons.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter)));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('p');
let lastLightboxTrigger;
document.querySelectorAll('[data-lightbox-src]').forEach((button) => {
  button.addEventListener('click', () => {
    lastLightboxTrigger = button;
    lightboxImage.src = button.dataset.lightboxSrc;
    lightboxImage.alt = button.dataset.lightboxAlt;
    lightboxCaption.textContent = button.dataset.lightboxAlt;
    lightbox.showModal();
    document.body.classList.add('is-locked');
    requestAnimationFrame(() => lightbox.classList.add('is-visible'));
  });
});
function closeLightbox() {
  lightbox.classList.remove('is-visible');
  window.setTimeout(() => {
    lightbox.close();
    document.body.classList.remove('is-locked');
    lightboxImage.src = '';
    lastLightboxTrigger?.focus();
  }, reducedMotion ? 0 : 300);
}
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
lightbox.addEventListener('cancel', (event) => { event.preventDefault(); closeLightbox(); });
