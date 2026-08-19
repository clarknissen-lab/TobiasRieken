import { chromium } from 'playwright';
import fs from 'node:fs';

const DECK = 'file:///home/user/TobiasRieken/mockup/presentation/deck.html';
const OUT  = '/home/user/TobiasRieken/Novera-Studio_Webkonzept_Finanzberatung-Rieken.pdf';
const REVIEW = process.env.REVIEW === '1';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.log('PAGE ERROR', e.message));
await page.goto(DECK, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(async () => {
  await Promise.all([...document.images].map(i => i.complete ? 1 :
    new Promise(r => { i.onload = i.onerror = r; })));
});
await page.waitForTimeout(1200);

if (REVIEW) {
  fs.mkdirSync('/home/user/TobiasRieken/mockup/build/deck', { recursive: true });
  const n = await page.$$eval('.pg', els => els.length);
  for (let i = 0; i < n; i++) {
    const el = (await page.$$('.pg'))[i];
    await el.screenshot({ path: `/home/user/TobiasRieken/mockup/build/deck/p${String(i+1).padStart(2,'0')}.png` });
  }
  console.log('review pages:', n);
}

await page.pdf({
  path: OUT, width: '1600px', height: '900px',
  printBackground: true, preferCSSPageSize: false,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});
await browser.close();
const kb = (fs.statSync(OUT).size / 1048576).toFixed(2);
console.log('PDF:', OUT, kb, 'MB');
