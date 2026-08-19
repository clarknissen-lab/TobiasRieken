import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = '/home/user/TobiasRieken/mockup/build/shots';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
for (const [file, name, h] of [['login', 'admin-login', 1000], ['panel', 'admin-panel', 1160]]) {
  const p = await b.newPage({ viewport: { width: 1600, height: h }, deviceScaleFactor: 2 });
  await p.goto(`file:///home/user/TobiasRieken/mockup/site/admin/${file}.html`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/${name}.png` });
  await p.close();
}
await b.close();
console.log('admin shots ok');
