/* Markiert im laufenden Layout, wo Bewegung stattfindet.
   Die Nummern verweisen auf die Legende im Präsentationsdeck. */
import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = 'file:///home/user/TobiasRieken/mockup/site/index.html';
const OUT = '/home/user/TobiasRieken/mockup/build/shots';
fs.mkdirSync(OUT, { recursive: true });

const PINS = {
  'motion-hero': { sel: '.hero', marks: [
    ['.hero h1', 1, 'tl'],
    ['.hero__lead', 2, 'bl'],
    ['.hero__cta .btn--gold', 3, 'tr'],
    ['.card-glass', 4, 'tr'],
  ]},
  'motion-cards': { sel: '#leistungen', marks: [
    ['#leistungen .card:nth-of-type(1)', 6, 'tr'],
    ['#leistungen .card:nth-of-type(2) .card__ico', 7, 'tr'],
    ['#leistungen .card--wide .btn', 8, 'tr'],
  ]},
  'motion-beamte': { sel: '#beamte', marks: [
    ['.split', 9, 'tr'],
    ['.plain', 10, 'tr'],
  ]},
  'motion-ablauf': { sel: '#ablauf', marks: [
    ['.steps .step:nth-child(2) .step__n', 11, 'tr'],
    ['.steps', 12, 'tl'],
  ]},
  'motion-trust': { sel: '.trust', marks: [
    ['.trust__i:nth-child(1)', 5, 'tr'],
  ]},
};

const CSS = `
.mo-out{outline:2px dashed rgba(224,198,141,.95) !important;outline-offset:6px;border-radius:6px}
.mo-out-dark{outline:2px dashed rgba(44,107,184,.95) !important;outline-offset:6px;border-radius:6px}
.mo-pin{position:absolute;z-index:9999;width:34px;height:34px;border-radius:50%;
  background:linear-gradient(135deg,#E6CD97,#C09A4E);color:#1B1408;
  display:flex;align-items:center;justify-content:center;
  font:700 15px/1 Inter,system-ui,sans-serif;
  box-shadow:0 0 0 4px rgba(224,198,141,.28),0 8px 20px -8px rgba(0,0,0,.6)}
`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: `
  .rise{opacity:1 !important;transform:none !important;transition:none !important}
  html{scroll-behavior:auto}
  .split__p{transition:none !important}
  .nav{display:none !important}
` + CSS });
await page.evaluate(() => {
  const s = document.querySelector('.split');
  if (s) s.classList.remove('is-collapsed');
});
await page.waitForTimeout(500);

for (const [name, cfg] of Object.entries(PINS)) {
  await page.evaluate(({ marks }) => {
    document.querySelectorAll('.mo-pin').forEach(n => n.remove());
    document.querySelectorAll('.mo-out,.mo-out-dark').forEach(n => {
      n.classList.remove('mo-out'); n.classList.remove('mo-out-dark');
    });
    marks.forEach(([sel, no, corner]) => {
      const el = document.querySelector(sel);
      if (!el) { console.log('missing', sel); return; }
      const onDark = !!el.closest('.hero, .sec--navy, .book');
      el.classList.add(onDark ? 'mo-out' : 'mo-out-dark');
      const r = el.getBoundingClientRect();
      const pin = document.createElement('div');
      pin.className = 'mo-pin';
      pin.textContent = no;
      const top = r.top + scrollY + (corner[0] === 't' ? -17 : r.height - 17);
      const left = r.left + scrollX + (corner[1] === 'l' ? -17 : r.width - 17);
      pin.style.top = top + 'px';
      pin.style.left = left + 'px';
      document.body.appendChild(pin);
    });
  }, cfg);
  await page.waitForTimeout(220);
  const el = await page.$(cfg.sel);
  if (el) await el.screenshot({ path: `${OUT}/${name}.png` });
}

await browser.close();
console.log('motion shots ok');
