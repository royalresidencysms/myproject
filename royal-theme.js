/* royal-theme.js — visual only: card tilt (desktop) and quicker hover after reveal. */
(function () {
  'use strict';
  document.addEventListener('transitionend', function (e) { var t = e.target; if (t && t.classList && t.classList.contains('visible')) t.style.transitionDelay = '0s'; }, true);
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var SEL = '.room-card,.about-card,.nearby-card,.policy-card,.facility-card,.qa-tiles a';
  document.addEventListener('mousemove', function (e) {
    var c = e.target.closest && e.target.closest(SEL); if (!c) return;
    var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.classList.add('tilt'); c.style.setProperty('--ry', (x * 10) + 'deg'); c.style.setProperty('--rx', (-y * 10) + 'deg');
  });
  document.addEventListener('mouseout', function (e) {
    var c = e.target.closest && e.target.closest(SEL); if (c && !c.contains(e.relatedTarget)) c.classList.remove('tilt');
  });
})();
