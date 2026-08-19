/* Finanzberatung Rieken — sparsame Bewegung.
   Regel: Animation nur dort, wo sie Orientierung gibt oder Ruhe erzeugt. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1 · Kopfzeile bekommt eine Kante, sobald sie klebt */
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('is-stuck', scrollY > 8); };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* 2 · Inhalte steigen einmalig ein — kein Parallax, kein Dauerzappeln */
  var rise = document.querySelectorAll('.rise');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (!r.isIntersecting) return;
        r.target.classList.add('is-in');
        io.unobserve(r.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    rise.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    rise.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* 3 · Navigation zeigt den Abschnitt, in dem man gerade liest */
  var ids = ['leistungen', 'beamte', 'ablauf', 'fragen', 'person'];
  var links = document.querySelectorAll('.nav__links a');
  var spy = new IntersectionObserver(function (rows) {
    rows.forEach(function (r) {
      if (!r.isIntersecting) return;
      links.forEach(function (a) {
        a.classList.toggle('is-active', a.hash === '#' + r.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  /* 4 · Der Balken der Beihilfelücke waechst, wenn er ins Bild kommt.
        Der zusammengeklappte Zustand haengt an einer Klasse, nicht an
        Inline-Styles: faellt dieses Script aus, steht der Balken trotzdem
        richtig statt zusammengeschoben und oben abgeschnitten. */
  var split = document.querySelector('.split');
  if (split && !reduce && 'IntersectionObserver' in window) {
    split.classList.add('is-collapsed');
    new IntersectionObserver(function (rows, obs) {
      rows.forEach(function (r) {
        if (!r.isIntersecting) return;
        split.classList.remove('is-collapsed');
        obs.disconnect();
      });
    }, { threshold: 0.35 }).observe(split);
  }

  /* 5 · Navigation kennt jetzt auch den Abschnitt "Kosten & Fragen" */
})();
