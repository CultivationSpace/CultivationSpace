;(function () {
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function initMobileMenu() {
    var toggle = qs('#hamburger');
    var label = qs('label[for="hamburger"]');
    var menu = qs('#menu-items');
    if (!toggle || !label || !menu) return;

    function sync() {
      var open = !!toggle.checked;
      label.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    sync();
    toggle.addEventListener('change', sync);

    qsa('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.checked = false;
        sync();
      });
    });
  }

  function initGalleryLightbox() {
    var items = qsa('[data-gallery-item]');
    var lightbox = qs('[data-gallery-lightbox]');
    if (!items.length || !lightbox) return;

    var img = qs('[data-gallery-img]', lightbox);
    var cap = qs('[data-gallery-caption]', lightbox);
    var closeBtn = qs('[data-gallery-close]', lightbox);
    var prevBtn = qs('[data-gallery-prev]', lightbox);
    var nextBtn = qs('[data-gallery-next]', lightbox);
    var index = 0;
    var lastActive = null;

    function set(i) {
      index = (i + items.length) % items.length;
      var el = items[index];
      var src = el.getAttribute('data-src') || '';
      var alt = el.getAttribute('data-alt') || '';
      if (img) { img.src = src; img.alt = alt; }
      if (cap) { cap.textContent = alt; }
    }

    function open(i) {
      lastActive = document.activeElement;
      lightbox.hidden = false;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      set(i);
      if (typeof lightbox.focus === 'function') lightbox.focus();
    }

    function close() {
      lightbox.hidden = true;
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastActive && typeof lastActive.focus === 'function') lastActive.focus();
    }

    function prev() { set(index - 1); }
    function next() { set(index + 1); }

    items.forEach(function (el, i) {
      el.addEventListener('click', function () { open(i); });
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); next(); });
    lightbox.addEventListener('click', function (e) { if (e && e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initGalleryLightbox();
  });
})();

