'use strict';

const root = document.documentElement;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Trava o scroll da página (menu aberto ou lightbox) */
function lockScroll(on) {
  root.classList.toggle('is-locked', on);
}

/* Mantém o foco dentro de um contêiner enquanto ele estiver aberto */
function trapFocus(event, container) {
  if (event.key !== 'Tab') return;
  const items = [...container.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* === Header: fundo sólido após o hero + link ativo === */
function initHeader() {
  const header = document.querySelector('[data-header]');
  const hero = document.getElementById('inicio');
  if (!header || !hero) return;
  const links = [...header.querySelectorAll('[data-nav-link]')];
  const targets = links.map((link) => document.getElementById(link.dataset.navLink));
  let ticking = false;

  function update() {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle('is-solid', y > hero.offsetHeight - header.offsetHeight);

    // Ativo = o último destino do menu cujo topo já passou de 40% da tela
    const mark = y + window.innerHeight * 0.4;
    let active = -1;
    targets.forEach((section, i) => {
      if (section && section.offsetTop <= mark) active = i;
    });
    links.forEach((link, i) => {
      const on = i === active;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

/* === Menu mobile em tela cheia === */
function initMenu() {
  const header = document.querySelector('[data-header]');
  const toggle = header && header.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  const desktop = window.matchMedia('(min-width: 1024px)');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    lockScroll(open);
    if (open) nav.querySelector('a').focus();
  }

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') && nav.classList.contains('is-open')) setOpen(false);
  });

  header.addEventListener('keydown', (event) => {
    if (!nav.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      setOpen(false);
      toggle.focus();
      return;
    }
    trapFocus(event, header);
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches && nav.classList.contains('is-open')) setOpen(false);
  });
}

/* === Lightbox para [data-lightbox] === */
function initLightbox() {
  const images = [...document.querySelectorAll('img[data-lightbox]')];
  if (!images.length) return;

  // Cada foto vira um botão acessível por teclado
  images.forEach((img) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'zoom';
    button.setAttribute('aria-haspopup', 'dialog');
    img.replaceWith(button);
    button.appendChild(img);
  });

  const box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Foto ampliada');
  box.innerHTML =
    '<figure class="lightbox-figure">' +
      '<img class="lightbox-img" alt="">' +
      '<figcaption class="lightbox-caption"></figcaption>' +
    '</figure>' +
    '<button type="button" class="lightbox-btn lightbox-prev">Anterior</button>' +
    '<button type="button" class="lightbox-btn lightbox-next">Próxima</button>' +
    '<button type="button" class="lightbox-btn lightbox-close">Fechar</button>';
  document.body.appendChild(box);

  const view = box.querySelector('.lightbox-img');
  const caption = box.querySelector('.lightbox-caption');
  const prev = box.querySelector('.lightbox-prev');
  const next = box.querySelector('.lightbox-next');
  const close = box.querySelector('.lightbox-close');
  let group = [];
  let index = 0;
  let opener = null;

  function show(i) {
    index = (i + group.length) % group.length;
    const img = group[index];
    const figcaption = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    view.src = img.currentSrc || img.src;
    view.alt = img.alt;
    caption.textContent = figcaption ? figcaption.textContent : img.alt;
    if (group.length > 1) caption.textContent += ` · ${index + 1} / ${group.length}`;
  }

  function open(img) {
    const section = img.closest('section');
    group = images.filter((item) => item.closest('section') === section);
    prev.hidden = next.hidden = group.length < 2;
    opener = img.closest('button');
    show(group.indexOf(img));
    box.hidden = false;
    lockScroll(true);
    close.focus();
  }

  function shut() {
    box.hidden = true;
    view.removeAttribute('src');
    lockScroll(false);
    if (opener) opener.focus();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.zoom');
    if (button) open(button.querySelector('img'));
  });
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  close.addEventListener('click', shut);
  box.addEventListener('click', (event) => {
    if (event.target === box || event.target.classList.contains('lightbox-figure')) shut();
  });
  box.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') shut();
    else if (event.key === 'ArrowLeft' && group.length > 1) show(index - 1);
    else if (event.key === 'ArrowRight' && group.length > 1) show(index + 1);
    else trapFocus(event, box);
  });
}

initHeader();
initMenu();
initLightbox();
