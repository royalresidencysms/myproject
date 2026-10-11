/* =====================================================
   script.js — Royal Residency
===================================================== */

// ---- STICKY HEADER + NAV HIGHLIGHT ----
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Back to top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }

  // Active nav link highlighting
  highlightNav();
});

function highlightNav() {
  const targets = [...document.querySelectorAll('section[id], #nearby')]
    .sort((a, b) => (a.getBoundingClientRect().top + window.scrollY) - (b.getBoundingClientRect().top + window.scrollY));
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';

  targets.forEach(el => {
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY >= top) current = el.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ---- HAMBURGER / MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
window.closeMobileMenu = closeMobileMenu;

// ---- BACK TO TOP ----
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- SCROLL REVEAL ANIMATIONS ----
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

function addRevealClass(selector, className = 'reveal') {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add(className);
    el.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(el);
  });
}

addRevealClass('.about-card');
addRevealClass('.room-card');
addRevealClass('.facility-card');
addRevealClass('.nearby-card');
addRevealClass('.policy-card');
addRevealClass('.contact-info-item');

document.querySelectorAll('.section-header').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

document.querySelectorAll('.contact-info').forEach(el => {
  el.classList.add('reveal-left');
  revealObserver.observe(el);
});

// ---- NAVBAR ACTIVE STYLE (CSS injection) ----
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: #D4AF37 !important;
  }
  .nav-links a.active::after {
    width: 60% !important;
  }
`;
document.head.appendChild(style);

// ---- COUNTER ANIMATION for stats ----
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(counter => {
    if (!/^\d+\D*$/.test(counter.textContent.trim())) return;   // leave text like "24/7" exactly as written
    const target = counter.textContent.replace(/[^0-9]/g, '');
    if (!target) return;
    const suffix = counter.textContent.replace(/[0-9]/g, '');
    const num = parseInt(target, 10);
    let current = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { current = num; clearInterval(timer); }
      counter.textContent = current + suffix;
    }, 30);
  });
}

const statsSection = document.querySelector('.stat-row');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

// ---- FOOTER YEAR (always the current year) ----
(function () { const y = document.getElementById('footer-year'); if (y) y.textContent = new Date().getFullYear(); })();

// ---- GUEST INFO TABS (Policies / FAQ) ----
(function () {
  const tabs = document.querySelectorAll('.info-tab');
  if (!tabs.length) return;
  function show(name) {
    tabs.forEach(t => {
      const on = t.id === 'tab-' + name;
      t.classList.toggle('info-tab--on', on);
      t.setAttribute('aria-selected', String(on));
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
  }
  tabs.forEach(t => t.addEventListener('click', () => show(t.id.replace('tab-', ''))));
  // links to #faq or #policies open the right tab first (capture phase runs before the smooth-scroll handler)
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href="#faq"],a[href="#policies"],a[href="#info"]');
    if (a) show(a.getAttribute('href') === '#info' ? 'policies' : a.getAttribute('href').slice(1));
  }, true);
  if (location.hash === '#faq' || location.hash === '#policies') show(location.hash.slice(1));
})();
