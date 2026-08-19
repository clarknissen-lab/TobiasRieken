import { chromium } from 'playwright';
import fs from 'node:fs';
const files = process.argv[2].split(',');
const out = process.argv[3];
const cols = process.argv[4] || 3;
const tmp = '/home/user/TobiasRieken/mockup/build/_sheet.html';
fs.writeFileSync(tmp, `<body style="margin:0;background:#B9B0A0;display:grid;grid-template-columns:repeat(${cols},1fr);gap:14px;padding:14px;align-items:start">
${files.map(f=>`<img src="shots/${f}" style="width:100%;display:block">`).join('')}
</body>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 });
await p.goto('file://' + tmp);
await p.waitForTimeout(900);
await p.screenshot({ path: out, fullPage: true });
await b.close();
