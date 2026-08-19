import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = 'file:///home/user/TobiasRieken/mockup/site/index.html';
const OUT = '/home/user/TobiasRieken/mockup/build/shots';
fs.mkdirSync(OUT, { recursive: true });

const scale = Number(process.env.DSF || 2);
const browser = await chromium.launch();

async function prep(page) {
  await page.goto(URL, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: `
    .rise{opacity:1 !important;transform:none !important;transition:none !important}
    html{scroll-behavior:auto}
    .split__p{transition:none !important}
    .split.is-collapsed .split__p{flex-basis:var(--fb) !important}
  `});
  await page.evaluate(() => {
    const s = document.querySelector('.split');
    if (s) s.classList.remove('is-collapsed');
  });
  await page.waitForTimeout(500);
}

/* ---- Desktop -------------------------------------------------------- */
const d = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: scale });
await prep(d);
await d.screenshot({ path: `${OUT}/desktop-fold.png` });

const cuts = {
  'd-hero':        '.hero',
  'd-trust':       '.trust',
  'd-ueberblick':  '#ueberblick',
  'd-leistungen':  '#leistungen',
  'd-beamte':      '#beamte',
  'd-ablauf':      '#ablauf',
  'd-fragen':      '#fragen',
  'd-person':      '#person',
  'd-stimme':      '.voice',
  'd-termin':      '#termin',
  'd-foot':        'footer.foot',
  'd-card':        '#leistungen .card:nth-of-type(1)',
  'd-head':        '.nav',
};
// Für Sektions-Ausschnitte die klebende Kopfzeile ausblenden,
// sonst legt sie sich in den Abzug.
const hideHead = await d.addStyleTag({ content: '.nav{display:none !important}' });
for (const [name, sel] of Object.entries(cuts)) {
  if (name === 'd-head') continue;
  const el = await d.$(sel);
  if (el) await el.screenshot({ path: `${OUT}/${name}.png` });
}
await hideHead.evaluate((n) => n.remove());
await d.waitForTimeout(200);
{ const el = await d.$('.nav'); if (el) await el.screenshot({ path: `${OUT}/d-head.png` }); }
{ const el = await d.$('.hero'); if (el) await el.screenshot({ path: `${OUT}/d-hero.png` }); }
const full = await d.evaluate(() => document.body.scrollHeight);
console.log('desktop full height', full);
await d.close();

/* ---- Mobile --------------------------------------------------------- */
const m = await browser.newPage({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
});
await prep(m);

const mviews = [
  ['m-hero', 0, 0],
  ['m-ueberblick', '#ueberblick', 50],
  ['m-leistungen', '#leistungen', 50],
  ['m-beamte', '#beamte', 50],
  ['m-ablauf', '#ablauf', 50],
  ['m-fragen', '#fragen', 50],
  ['m-person', '#person', -250],
  ['m-termin', '#termin', 50],
];
for (const [name, target, off] of mviews) {
  if (target === 0) {
    await m.evaluate(() => scrollTo(0, 0));
  } else {
    await m.evaluate(([s, o]) => {
      const el = document.querySelector(s);
      scrollTo(0, el.getBoundingClientRect().top + scrollY - o);
    }, [target, off]);
  }
  await m.waitForTimeout(350);
  await m.screenshot({ path: `${OUT}/${name}.png` });
}
const mfull = await m.evaluate(() => document.body.scrollHeight);
console.log('mobile full height', mfull);
await m.close();

/* Ganzseiten-Abzuege in einfacher Aufloesung — sie werden nur klein gezeigt. */
for (const [w, h, mob, name] of [[1600, 1000, false, 'desktop-full'], [390, 844, true, 'mobile-full']]) {
  const pg = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1,
    isMobile: mob, hasTouch: mob });
  await prep(pg);
  await pg.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await pg.close();
}

await browser.close();
console.log('shots:', fs.readdirSync(OUT).length);
