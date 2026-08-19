import { chromium } from 'playwright';
import fs from 'node:fs';
const from = +process.argv[2], to = +process.argv[3], out = process.argv[4];
const files = [];
for (let i = from; i <= to; i++) files.push(`p${String(i).padStart(2,'0')}.png`);
const tmp = '/home/user/TobiasRieken/mockup/build/_deck.html';
fs.writeFileSync(tmp, `<body style="margin:0;background:#54565B;display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:10px">
${files.map((f,i)=>`<div style="position:relative"><img src="deck/${f}" style="width:100%;display:block">
<span style="position:absolute;left:4px;top:4px;background:#000;color:#fff;font:10px monospace;padding:2px 5px">${from+i}</span></div>`).join('')}</body>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 });
await p.goto('file://' + tmp);
await p.waitForTimeout(1200);
await p.screenshot({ path: out, fullPage: true });
await b.close();
