import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 620 }, deviceScaleFactor: 1 });
await p.goto('file:///home/user/TobiasRieken/mockup/tools/art-preview.html');
await p.waitForTimeout(600);
await p.screenshot({ path: 'build/art-preview.png' });
await b.close();
