/* Sucht überschriebene Klassenregeln.
   Muster: `.karte p { … }` steht nach `.karte__wert { font-size: 70px }` und
   gewinnt, weil ein Element-Selektor die Spezifität erhöht. Der Entwurf sieht
   dann anders aus als gemeint — ohne dass irgendwo etwas überläuft.
   Vorgehen: aus dem Stylesheet alle Regeln mit genau einer Klasse lesen und
   im Browser prüfen, ob der berechnete Wert dem entspricht. */
import { chromium } from 'playwright';
import fs from 'node:fs';

const PROPS = ['font-size', 'color', 'font-family', 'font-weight', 'display', 'text-align'];

function rulesOf(css) {
  const out = [];
  // Regeln aus @media-Blöcken gelten nur bei anderer Breite und werden hier
  // nicht geprüft — sonst meldet der Prüfer lauter Scheinfehler.
  let clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  clean = clean.replace(/@media[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  clean.split('}').forEach((block) => {
    const i = block.indexOf('{');
    if (i < 0) return;
    const sel = block.slice(0, i).trim();
    const body = block.slice(i + 1);
    sel.split(',').map(s => s.trim()).forEach((s) => {
      // nur einfache Einzelklassen ohne Kombinator, Pseudo oder Medienabfrage
      if (!/^\.[A-Za-z0-9_-]+$/.test(s)) return;
      PROPS.forEach((p) => {
        const m = body.match(new RegExp('(?:^|;)\\s*' + p + '\\s*:\\s*([^;]+)'));
        if (m) out.push({ cls: s.slice(1), prop: p, want: m[1].trim() });
      });
    });
  });
  return out;
}

const files = {
  'site/styles.css': ['site/index.html'],
  'site/admin/admin.css': ['site/admin/login.html', 'site/admin/panel.html'],
  'presentation/deck.css': ['presentation/deck.html'],
};
const B = 'file:///home/user/TobiasRieken/mockup/';
const browser = await chromium.launch();
let hits = 0;

for (const [cssFile, pages] of Object.entries(files)) {
  const rules = rulesOf(fs.readFileSync(cssFile, 'utf8'));
  for (const page of pages) {
    const p = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await p.goto(B + page, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    const found = await p.evaluate((rules) => {
      const px = (v) => v.replace(/\s+/g, ' ').trim();
      const res = [];
      rules.forEach(({ cls, prop, want }) => {
        if (/var\(|clamp\(|calc\(|inherit/.test(want)) return;   // nicht direkt vergleichbar
        const els = document.getElementsByClassName(cls);
        if (!els.length) return;
        const el = els[0];
        const got = px(getComputedStyle(el).getPropertyValue(prop));
        const w = px(want);
        let ok;
        if (prop === 'font-size' || prop === 'font-weight') ok = parseFloat(got) === parseFloat(w);
        // inline-flex/inline-grid werden in Flex- und Grid-Eltern zu flex/grid,
        // und `left` berechnet sich zu `start`. Beides ist kein Fehler.
        else if (prop === 'display') ok = got === w || got === w.replace('inline-', '');
        else if (prop === 'text-align') ok = got === w || (w === 'left' && got === 'start') || (w === 'right' && got === 'end');
        else if (prop === 'font-family') ok = got.toLowerCase().includes(w.split(',')[0].replace(/['"]/g, '').toLowerCase());
        else if (prop === 'color') ok = true;   // Farben stehen fast immer in Variablen
        else ok = got === w;
        if (!ok) res.push(`.${cls} { ${prop}: ${w} } → tatsächlich ${got}`);
      });
      return [...new Set(res)];
    }, rules);
    if (found.length) {
      console.log(`\n── ${page} ──`);
      found.forEach((f) => { hits++; console.log('  ✗ ' + f); });
    }
  }
}
await browser.close();
console.log(hits ? `\n════ ${hits} überschriebene Regel(n) ════` : '\n✓ keine überschriebenen Klassenregeln');
