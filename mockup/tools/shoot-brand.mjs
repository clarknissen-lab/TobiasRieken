import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = '/home/user/TobiasRieken/mockup/build/shots';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 1400 }, deviceScaleFactor: 3 });
await p.goto('file:///home/user/TobiasRieken/mockup/brand/apps.html');
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(600);
for (const id of ['vk-f','vk-b','bb','sg','av','st','pal','ty','sgs']) {
  const el = await p.$('#' + id);
  if (el) await el.screenshot({ path: `${OUT}/brand-${id}.png`, omitBackground: false });
  else console.log('missing', id);
}
await b.close();
console.log('brand shots ok');
