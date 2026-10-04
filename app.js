/**
 * THE AURA ROOMS & BANQUET
 * Production JavaScript
 */

/* ─── Enquiry Modal ──────────────────────────────── */

const modal        = document.getElementById('enquiryModal');
const modalHeading = document.getElementById('modalHeading');
const enquiryForm  = document.getElementById('enquiryForm');
const enquirySuccess = document.getElementById('enquirySuccess');

let modalTrigger = null;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function openEnquiryModal(contextTitle) {
  modalTrigger = document.activeElement;

  if (contextTitle && modalHeading) {
    modalHeading.textContent = contextTitle;
  }

  if (enquiryForm) {
    enquiryForm.classList.remove('hidden');
    enquiryForm.reset();
  }
  if (enquirySuccess) {
    enquirySuccess.classList.add('hidden');
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    const firstFocusable = modal.querySelector(FOCUSABLE);
    if (firstFocusable) firstFocusable.focus();
  });
}

function closeEnquiryModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  const trigger = modalTrigger;
  modalTrigger = null;

  if (trigger && typeof trigger.focus === 'function') {
    requestAnimationFrame(() => {
      try { trigger.focus(); } catch (_) {}
    });
  }
}

function handleEnquirySubmit(e) {
  e.preventDefault();

  const nameEl  = document.getElementById('guestName');
  const phoneEl = document.getElementById('guestPhone');
  const name    = nameEl  ? nameEl.value.trim()  : '';
  const phone   = phoneEl ? phoneEl.value.trim() : '';

  if (!name) { if (nameEl) nameEl.focus(); return; }
  if (!phone) { if (phoneEl) phoneEl.focus(); return; }

  if (enquiryForm)    enquiryForm.classList.add('hidden');
  if (enquirySuccess) enquirySuccess.classList.remove('hidden');
}

/* ─── Expose globals immediately ─────────────────── */
window.openEnquiryModal    = openEnquiryModal;
window.closeEnquiryModal   = closeEnquiryModal;
window.handleEnquirySubmit = handleEnquirySubmit;

/* ─── Close modal on backdrop click ──────────────── */
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeEnquiryModal();
  });
}

/* ─── Keyboard: Escape + focus trap ─────────────── */
document.addEventListener('keydown', (e) => {
  if (!modal || !modal.classList.contains('is-open')) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeEnquiryModal();
    return;
  }

  if (e.key === 'Tab') {
    const focusable = Array.from(modal.querySelectorAll(FOCUSABLE))
      .filter(el => !el.closest('.hidden'));
    if (!focusable.length) { e.preventDefault(); return; }

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }
});

/* ─── Gallery Filter ─────────────────────────────── */
(function initGalleryFilter() {
  const filterNav   = document.getElementById('galleryFilterNav');
  const galleryGrid = document.getElementById('galleryGrid');
  if (!filterNav || !galleryGrid) return;

  const buttons = filterNav.querySelectorAll('.gallery-filter');
  const items   = galleryGrid.querySelectorAll('.gallery-item');

  filterNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.gallery-filter');
    if (!btn) return;

    const filter = btn.getAttribute('data-filter');

    buttons.forEach(b => {
      b.classList.remove('gallery-filter--active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('gallery-filter--active');
    btn.setAttribute('aria-selected', 'true');

    items.forEach(item => {
      const category = item.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'none';
        requestAnimationFrame(() => {
          item.style.animation = 'fadeIn 0.3s ease both';
        });
      } else {
        item.classList.add('hidden');
      }
    });
  });
})();

/* ─── Mobile Navigation ──────────────────────────── */
(function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const nav     = document.getElementById('primary-nav');
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('primary-nav--open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    const icon = menuBtn.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = isOpen ? 'close' : 'menu';
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        nav.classList.remove('primary-nav--open');
        menuBtn.setAttribute('aria-expanded', 'false');
        const icon = menuBtn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      }
    });
  });
})();

/* ─── Header Scroll Shadow ───────────────────────── */
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── Active Nav on Scroll ───────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.primary-nav .nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('nav-link--active', active);
        if (active) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();

/* ─── Gallery fade-in & Reveal keyframes ────────── */
(function injectKeyframes() {
  if (document.querySelector('#aura-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'aura-keyframes';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    
    .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                  transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .stagger-1 { transition-delay: 100ms; }
    .stagger-2 { transition-delay: 200ms; }
    .stagger-3 { transition-delay: 300ms; }
    .stagger-4 { transition-delay: 400ms; }
  `;
  document.head.appendChild(style);
})();

/* ─── Scroll Reveal Observer ────────────────────── */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  });
  
  revealElements.forEach(el => observer.observe(el));
})();
