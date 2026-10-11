/* rooms.js — Royal Residency "View Rooms" page: room grid by category, tap a room to see its photo. No booking, no status. */
(function () {
  'use strict';
  var F = 'images/rooms/sms-royal-residency-';
  var KINDS = {
    'non-ac': { title: 'Superior Non-A/C Rooms', label: 'Superior Non-A/C', price: 1000 },
    'ac':     { title: 'Superior A/C Rooms',     label: 'Superior A/C',     price: 1500 },
    'deluxe': { title: 'Deluxe A/C Room',        label: 'Deluxe A/C',       price: 4500 }
  };
  var FLOORS = { 1: '1st Floor', 2: '2nd Floor', 3: '3rd Floor' };
  var A = F + 'superior-ac-room-201-206-theni.jpg', B = F + 'superior-ac-room-202-205-theni.jpg';
  var ROOMS = [
    [101,1,'non-ac',[F+'superior-non-ac-room-101-theni.jpg']], [102,1,'non-ac',[F+'superior-non-ac-room-102-theni.jpg']],
    [103,1,'non-ac',[F+'superior-non-ac-room-103-theni.jpg']], [104,1,'non-ac',[F+'superior-non-ac-room-104-theni.jpg']],
    [105,1,'non-ac',[F+'superior-non-ac-room-105-theni.jpg']],
    [201,2,'ac',[A]], [202,2,'ac',[B]], [203,2,'ac',[B]], [204,2,'ac',[B]], [205,2,'ac',[B]], [206,2,'ac',[A]],
    [301,3,'ac',[F+'deluxe-ac-room-301-theni.jpg']], [302,3,'ac',[F+'deluxe-ac-room-302-theni.jpg']],
    [303,3,'deluxe',[F+'deluxe-ac-room-303-a-theni.jpg', F+'deluxe-ac-room-303-b-theni.jpg']],
    [304,3,'ac',[F+'deluxe-ac-room-304-theni.jpg']], [305,3,'non-ac',[F+'superior-non-ac-room-305-theni.jpg']]
  ].map(function (r) { return { number: r[0], floor: r[1], kind: r[2], photos: r[3] }; });

  var $ = function (id) { return document.getElementById(id); };
  var rs = function (n) { return '\u20B9' + n.toLocaleString('en-IN'); };
  var byNum = {}; ROOMS.forEach(function (r) { byNum[r.number] = r; });
  var vPhotos = [], vIdx = 0, viewing = null, lastFocus = null;

  var kind = 'non-ac', picked = [];
  var WA = '919698039407';

  function render() {
    var K = KINDS[kind];
    $('vr-list').innerHTML = '<div class="vr-head"><h2>' + K.title + '</h2><span>' + rs(K.price) + ' per day</span></div>' +
      [1, 2, 3].map(function (f) {
        return '<div class="vr-floor-group"><div class="vr-floor-label"><i class="fas fa-layer-group"></i> ' + FLOORS[f] + '</div><div class="vr-grid">' +
          ROOMS.filter(function (r) { return r.floor === f; }).map(function (r) {
            var off = r.kind !== kind, sel = picked.indexOf(r.number) !== -1;
            return off
              ? '<div class="vr-room vr-room--off' + (sel ? ' vr-room--off-sel' : '') + '" aria-disabled="true"><span class="vr-num">' + r.number + '</span><span class="vr-floor">' + KINDS[r.kind].label + '</span>' + (sel ? '<span class="vr-view"><i class="fas fa-check-circle"></i> Selected</span>' : '') + '</div>'
              : '<button type="button" class="vr-room' + (sel ? ' vr-room--sel' : '') + '" data-room="' + r.number + '" aria-pressed="' + sel + '" aria-label="View photo of room ' + r.number + (sel ? ' (selected)' : '') + '"><span class="vr-num">' + r.number + '</span><span class="vr-floor">' + KINDS[r.kind].label + '</span><span class="vr-view">' + (sel ? '<i class="fas fa-check-circle"></i> Selected' : '<i class="fas fa-image"></i> View photo') + '</span></button>';
          }).join('') + '</div></div>';
      }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('.vr-tab'), function (t) {
      var on = t.dataset.kind === kind; t.classList.toggle('vr-tab--on', on); t.setAttribute('aria-selected', String(on));
    });
  }

  function updateBar() {
    var bar = $('vr-bar'), list = picked.slice().sort(function (a, b) { return a - b; });
    bar.hidden = !list.length; document.body.classList.toggle('vr-bar-on', list.length > 0);
    if (!list.length) return;
    $('vr-bar-text').innerHTML = '<strong>' + list.length + ' room' + (list.length > 1 ? 's' : '') + ' selected:</strong> ' + list.join(', ');
    var msg = 'Hello Royal Residency, I would like to check room availability.\n\n' +
      'Name: \n' +
      'Mobile number: \n' +
      'Rooms: ' + list.join(', ') + '\n' +
      'Check-in: \n' +
      'Check-out: ';
    $('vr-wa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }

  function toggleRoom(n) {
    var i = picked.indexOf(n);
    if (i === -1) picked.push(n); else picked.splice(i, 1);
    render(); updateBar();
  }

  function renderSelectBtn() {
    var b = $('rpv-select'); if (!b || viewing == null) return;
    var on = picked.indexOf(viewing) !== -1;
    b.classList.toggle('rpv-select--on', on);
    b.innerHTML = on ? '<i class="fas fa-times-circle"></i> Remove' : '<i class="fas fa-check-circle"></i> Select this room';
  }

  function setKind(k) { if (KINDS[k] && k !== kind) { kind = k; render(); } }

  function showPhoto(i) {
    var img = $('rpv-img'), none = $('rpv-none'), n = vPhotos.length;
    vIdx = n ? ((i % n) + n) % n : 0;
    var src = vPhotos[vIdx] || null;
    if (src) { none.hidden = true; img.hidden = false; img.alt = 'Room ' + viewing + ' photo ' + (vIdx + 1) + ' of ' + n + ' - Royal Residency, Theni'; if (img.getAttribute('src') !== src) img.src = src; }
    else { img.hidden = true; img.removeAttribute('src'); none.hidden = false; }
    $('rpv-prev').hidden = $('rpv-next').hidden = $('rpv-dots').hidden = n < 2;
    $('rpv-dots').innerHTML = vPhotos.map(function (_, k) { return '<i class="' + (k === vIdx ? 'on' : '') + '"></i>'; }).join('');
  }

  function openViewer(n) {
    var r = byNum[n]; if (!r) return;
    lastFocus = document.activeElement; viewing = n;
    $('rpv-title').textContent = 'Room ' + r.number;
    $('rpv-sub').textContent = KINDS[r.kind].label + ' \u00B7 ' + FLOORS[r.floor];
    $('rpv-price').textContent = rs(KINDS[r.kind].price) + ' / day';
    vPhotos = r.photos.slice();
    vPhotos.forEach(function (u) { new Image().src = u; });
    showPhoto(0); renderSelectBtn();
    $('room-viewer').hidden = false; document.body.classList.add('rpv-open');
    $('rpv-close').focus({ preventScroll: true });
  }

  function closeViewer() {
    var v = $('room-viewer'); if (!v || v.hidden) return;
    v.hidden = true; document.body.classList.remove('rpv-open'); viewing = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function init() {
    var h = location.hash.slice(1); if (KINDS[h]) kind = h;
    render();
    document.querySelector('.vr-tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-kind]'); if (b) setKind(b.dataset.kind); });
    window.addEventListener('hashchange', function () { setKind(location.hash.slice(1)); });
    $('vr-list').addEventListener('click', function (e) { var b = e.target.closest('[data-room]'); if (b) openViewer(+b.dataset.room); });
    $('rpv-close').addEventListener('click', closeViewer);
    $('rpv-select').addEventListener('click', function () { if (viewing == null) return; toggleRoom(viewing); closeViewer(); });
    $('vr-clear').addEventListener('click', function () { picked = []; render(); updateBar(); });
    $('room-viewer').addEventListener('click', function (e) { if (e.target === this) closeViewer(); });
    $('rpv-prev').addEventListener('click', function () { showPhoto(vIdx - 1); });
    $('rpv-next').addEventListener('click', function () { showPhoto(vIdx + 1); });
    $('rpv-img').addEventListener('error', function () { this.hidden = true; $('rpv-none').hidden = false; });
    document.addEventListener('keydown', function (e) {
      if ($('room-viewer').hidden) return;
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowLeft') showPhoto(vIdx - 1);
      else if (e.key === 'ArrowRight') showPhoto(vIdx + 1);
    });
    var x0 = null, y0 = 0, ph = document.querySelector('.rpv-photo');
    ph.addEventListener('touchstart', function (e) { x0 = e.touches.length === 1 ? e.touches[0].clientX : null; y0 = e.touches[0].clientY; }, { passive: true });
    ph.addEventListener('touchend', function (e) {
      if (x0 == null || vPhotos.length < 2) return;
      var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0; x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) showPhoto(vIdx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
