import { chromium } from 'playwright';
const [lang = 'ko', theme = 'blueprint'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const url = `http://localhost:5173/?snap=1&theme=${theme}&lang=${lang}`;
let p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
p.on('pageerror', (e) => console.log('pageerror', String(e)));
await p.goto(url); await p.waitForTimeout(5000);
await p.screenshot({ path: `shots/${theme}-desktop-${lang}.png` });
const r = await p.evaluate(() => { const c = document.getElementById('globe').getBoundingClientRect(); return { x: c.left, y: c.top, w: c.width, h: c.height }; });
let found = false;
for (let yy = 0.15; yy < 0.9 && !found; yy += 0.02) for (let xx = 0.35; xx < 0.98 && !found; xx += 0.015) {
  await p.mouse.move(r.x + r.w * xx, r.y + r.h * yy);
  found = await p.evaluate(() => !document.getElementById('g-tip').hidden);
}
await p.waitForTimeout(400);
await p.screenshot({ path: `shots/${theme}-hover-${lang}.png`, clip: { x: r.x - 8, y: r.y - 8, width: r.w + 16, height: r.h + 16 } });
p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
await p.goto(url); await p.waitForTimeout(5000);
await p.screenshot({ path: `shots/${theme}-mobile-${lang}.png` });
console.log('done, tooltip', found);
await b.close();
