/* Finanzberatung Rieken — sparsame Interaktion.
   Regel: Bewegung nur dort, wo sie Orientierung gibt. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Kopfzeile bekommt Kante, sobald sie klebt */
  var head = document.querySelector('.masthead');
  var onScroll = function () {
    head.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* 2. Inhalte steigen einmalig ein — kein Parallax, kein Dauerzappeln */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (!r.isIntersecting) return;
        r.target.classList.add('is-in');
        io.unobserve(r.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    document.querySelectorAll('.rise').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.rise').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* 3. Register-Schiene und Navigation zeigen den aktuellen Abschnitt */
  var ids = ['top', 'ausgangslage', 'leistungen', 'beamte', 'ablauf', 'person', 'stimme', 'termin'];
  var sections = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var rail = document.querySelectorAll('.railnav a');
  var nav = document.querySelectorAll('.mainnav a');
  var spy = new IntersectionObserver(function (rows) {
    rows.forEach(function (r) {
      if (!r.isIntersecting) return;
      var id = r.target.id;
      rail.forEach(function (a) { a.classList.toggle('is-active', a.hash === '#' + id); });
      nav.forEach(function (a) { a.classList.toggle('is-active', a.hash === '#' + id); });
      document.querySelector('.railnav')
        .classList.toggle('on-dark-rail', /beamte|termin/.test(id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function (s) { spy.observe(s); });

  /* 4. Terminraster ist bedienbar, nicht dekorativ */
  var bind = function (sel, cls) {
    var items = document.querySelectorAll(sel);
    items.forEach(function (el) {
      el.addEventListener('click', function () {
        if (el.classList.contains('is-off')) return;
        items.forEach(function (o) { o.classList.remove(cls); });
        el.classList.add(cls);
      });
    });
  };
  bind('.day', 'is-on');
  bind('.slot', 'is-on');
  bind('.sched__mode', 'is-on');
})();
