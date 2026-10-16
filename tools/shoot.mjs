// Chapter screenshots: node tools/shoot.mjs [baseUrl] [--lang=ko] [--only=0,4,7]
// Writes shots/<viewport>/<lang>-chNN.png (1440x900 desktop, 390x844 mobile)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith('http')) || 'http://localhost:5173/';
const lang = (args.find((a) => a.startsWith('--lang=')) || '--lang=en').slice(7);
const only = (args.find((a) => a.startsWith('--only=')) || '').slice(7);
const chapters = only ? only.split(',').map(Number) : [...Array(11).keys()];
const VIEWS = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const v of VIEWS) {
  mkdirSync(`shots/${v.name}`, { recursive: true });
  const ctx = await browser.newContext({ ...v, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const t0 = Date.now();
  await page.goto(`${base}?snap=1&lang=${lang}`);
  await page.waitForFunction(() => window.__cys && window.__cys.ready, null, { timeout: 120000 });
  console.log(v.name, 'model ready in', ((Date.now() - t0) / 1000).toFixed(1), 's');
  for (const i of chapters) {
    await page.evaluate((i) => {
      const max = document.documentElement.scrollHeight - innerHeight;
      // stage i maps to scroll fraction i/10
      document.documentElement.style.scrollBehavior = 'auto';
      scrollTo(0, Math.round((i / 10) * max));
    }, i);
    const f0 = await page.evaluate(() => window.__cys.frames);
    await page.waitForFunction((f0) => window.__cys.frames > f0 + 3, f0, { timeout: 60000 });
    await page.waitForTimeout(400); // css opacity transitions
    const file = `shots/${v.name}/${lang}-ch${String(i).padStart(2, '0')}.png`;
    await page.screenshot({ path: file });
    console.log(' ', file, 'stage', (await page.evaluate(() => window.__cys.stage())).toFixed(2));
  }
  if (errors.length) console.log('console:', [...new Set(errors)].slice(0, 10));
  await ctx.close();
}
await browser.close();
