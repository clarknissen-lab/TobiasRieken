/* Prüft Webseite, Redaktionsbereich und Präsentation systematisch auf
   Layoutfehler: abgeschnittene Inhalte, waagerechten Überlauf, kaputte
   Bilder, aus der Seite laufende Elemente und zu schwache Kontraste. */
import { chromium } from 'playwright';

const browser = await chromium.launch();
let problems = 0;
const say = (t) => { console.log(t); };
const bad = (t) => { problems++; console.log('  ✗ ' + t); };

/* ---------- gemeinsame Prüfungen im Seitenkontext ---------- */
const CHECKS = () => {
  const out = { broken: [], clipped: [], wide: [], contrast: [] };

  document.querySelectorAll('img').forEach((im) => {
    if (!im.complete || im.naturalWidth === 0) out.broken.push(im.getAttribute('src') || '(ohne src)');
  });

  const lum = (c) => {
    const m = c.match(/[\d.]+/g); if (!m) return null;
    const [r, g, b] = m.slice(0, 3).map(Number);
    const a = m[3] !== undefined ? Number(m[3]) : 1;
    if (a < 0.9) return null;
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  /* Viele Flächen sind Verläufe. Deren Farbe steht in background-image,
     nicht in background-color — sonst meldet der Prüfer weiße Schrift auf
     dunklem Grund fälschlich als Kontrastfehler. Für Verläufe wird der
     Mittelwert aller Farbstopps genommen. */
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      const c = cs.backgroundColor;
      const m = c.match(/[\d.]+/g);
      if (m && (m[3] === undefined || Number(m[3]) > 0.85)) return c;
      const bi = cs.backgroundImage;
      if (bi && bi !== 'none') {
        const stops = [...bi.matchAll(/rgba?\(([\d.,\s]+)\)/g)]
          .map(s => s[1].split(',').map(Number))
          .filter(v => v.length < 4 || v[3] > 0.5);
        if (stops.length) {
          const avg = [0, 1, 2].map(i => Math.round(stops.reduce((s, v) => s + v[i], 0) / stops.length));
          return `rgb(${avg.join(', ')})`;
        }
      }
      n = n.parentElement;
    }
    return 'rgb(255, 255, 255)';
  };

  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;

    // abgeschnittener Inhalt
    const hidesY = cs.overflowY === 'hidden' || cs.overflow === 'hidden';
    const hidesX = cs.overflowX === 'hidden' || cs.overflow === 'hidden';
    const tag = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
    if (hidesY && el.scrollHeight - el.clientHeight > 3 && !el.dataset.clipOk)
      out.clipped.push(`${tag} — ${el.scrollHeight - el.clientHeight}px zu hoch`);
    if (hidesX && el.scrollWidth - el.clientWidth > 3 && !el.dataset.clipOk)
      out.clipped.push(`${tag} — ${el.scrollWidth - el.clientWidth}px zu breit`);

    // laeuft aus dem Fenster
    if (r.right > innerWidth + 2 && cs.position !== 'fixed') out.wide.push(`${tag} — ragt ${Math.round(r.right - innerWidth)}px raus`);

    // Kontrast fuer echten Text
    const txt = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2);
    if (txt) {
      const fg = lum(cs.color), bgc = bgOf(el), bg = lum(bgc);
      if (fg !== null && bg !== null) {
        const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
        const size = parseFloat(cs.fontSize);
        const big = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
        const need = big ? 3 : 4.5;
        if (ratio < need) out.contrast.push(`${tag} — ${ratio.toFixed(2)}:1 (nötig ${need}) · ${cs.fontSize} · ${cs.color} auf ${bgc}`);
      }
    }
  });

  out.docScroll = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  return out;
};

async function auditPage(url, label, vp, mobile = false) {
  const p = await browser.newPage({ viewport: vp, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  await p.goto(url, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '.rise{opacity:1!important;transform:none!important;transition:none!important}' });
  await p.evaluate(() => { const s = document.querySelector('.split'); if (s) s.classList.remove('is-collapsed'); });
  await p.waitForTimeout(500);
  const r = await p.evaluate(CHECKS);
  say(`\n── ${label} (${vp.width}px) ──`);
  if (r.docScroll > 1) bad(`waagerechter Überlauf der Seite: ${r.docScroll}px`);
  [...new Set(r.broken)].forEach((x) => bad('kaputtes Bild: ' + x));
  [...new Set(r.clipped)].forEach((x) => bad('abgeschnitten: ' + x));
  [...new Set(r.wide)].slice(0, 12).forEach((x) => bad('zu breit: ' + x));
  [...new Set(r.contrast)].slice(0, 12).forEach((x) => bad('Kontrast: ' + x));
  if (!r.docScroll && !r.broken.length && !r.clipped.length && !r.wide.length && !r.contrast.length)
    say('  ✓ ohne Befund');
  await p.close();
}

const B = 'file:///home/user/TobiasRieken/mockup';
await auditPage(`${B}/site/index.html`, 'Webseite · Desktop', { width: 1600, height: 1000 });
await auditPage(`${B}/site/index.html`, 'Webseite · Laptop', { width: 1280, height: 900 });
await auditPage(`${B}/site/index.html`, 'Webseite · Tablet', { width: 820, height: 1100 });
await auditPage(`${B}/site/index.html`, 'Webseite · Telefon', { width: 390, height: 844 }, true);
await auditPage(`${B}/site/index.html`, 'Webseite · kleines Telefon', { width: 320, height: 700 }, true);
await auditPage(`${B}/site/admin/login.html`, 'Redaktion · Anmeldung', { width: 1600, height: 900 });
await auditPage(`${B}/site/admin/panel.html`, 'Redaktion · Übersicht', { width: 1600, height: 1020 });

/* ---------- Deck: laeuft Inhalt aus der Seite? ---------- */
say('\n── Präsentation · 24 Seiten ──');
const dp = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await dp.goto(`${B}/presentation/deck.html`, { waitUntil: 'networkidle' });
await dp.evaluate(() => document.fonts.ready);
await dp.evaluate(async () => { await Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; }))); });
await dp.waitForTimeout(900);
const deck = await dp.evaluate(() => {
  const res = [];
  document.querySelectorAll('.pg').forEach((pg, i) => {
    const pr = pg.getBoundingClientRect();
    const issues = [];
    if (Math.round(pr.width) !== 1600 || Math.round(pr.height) !== 900)
      issues.push(`Seitenmaß ${Math.round(pr.width)}×${Math.round(pr.height)} statt 1600×900`);
    pg.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      if (el.classList.contains('art')) return;           // Ziermotive dürfen anschneiden
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const tag = el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
      const over = [];
      if (r.bottom > pr.bottom - 24) over.push(`unten ${Math.round(r.bottom - (pr.bottom - 24))}px`);
      if (r.right > pr.right - 12) over.push(`rechts ${Math.round(r.right - (pr.right - 12))}px`);
      if (r.left < pr.left + 12) over.push(`links ${Math.round(pr.left + 12 - r.left)}px`);
      if (over.length && !el.closest('.pg__bot') && !el.closest('.pg__top') && !el.closest('.bw__vp'))
        issues.push(`${tag}: ${over.join(', ')}`);
    });
    const broken = [...pg.querySelectorAll('img')].filter(im => !im.complete || im.naturalWidth === 0)
      .map(im => im.getAttribute('src'));
    broken.forEach(b => issues.push('kaputtes Bild: ' + b));
    if (issues.length) res.push({ page: i + 1, issues: [...new Set(issues)].slice(0, 6) });
  });
  return res;
});
if (!deck.length) say('  ✓ ohne Befund');
deck.forEach(({ page, issues }) => { say(`  Seite ${page}:`); issues.forEach(bad); });

await browser.close();
say(`\n════ ${problems} Befund(e) ════`);
