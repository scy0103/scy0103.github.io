// Section screenshots: node tools/shoot.mjs [baseUrl] [--lang=ko] [--only=top,skills] [--views=desktop,mobile]
// Writes shots/<viewport>/<lang>-<nn>-<name>.png (1440x900 desktop, 390x844 mobile)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith('http')) || 'http://localhost:5173/';
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split('=')[1];
const lang = opt('lang', 'en'), only = opt('only', ''), views = opt('views', 'desktop,mobile').split(',');
// name → how to get there: '#id' scrolls the element's top under the bar, 'story:k' goes to a 3D chapter
const STOPS = [
  ['top', '#top'], ['summary', '#summary'],
  ['story0', 'story:0'], ['story4', 'story:4'], ['story7', 'story:7'],
  ['metrics', '#skills .metrics'], ['skills2', '#skills .srows'], ['work', 'work:0.35'], ['career', '#career'],
  ['creds', '#creds'], ['contact', '#contact'], ['foot', 'bottom'],
].map((s, i) => [...s, i]).filter(([n]) => !only || only.split(',').includes(n));
const VIEWS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
};

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const name of views) {
  const v = VIEWS[name];
  mkdirSync(`shots/${name}`, { recursive: true });
  const ctx = await browser.newContext({ ...v, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${base}?snap=1&lang=${lang}`);
  await page.waitForFunction(() => window.__cys && window.__cys.ready, null, { timeout: 120000 });
  await page.waitForTimeout(1500);
  for (const [n, where, i] of STOPS) {
    await page.evaluate((where) => {
      document.documentElement.style.scrollBehavior = 'auto';
      if (where.startsWith('story:')) return window.__cys.goto(+where.slice(6));
      if (where === 'bottom') return window.scrollTo(0, document.documentElement.scrollHeight);
      if (where.startsWith('work:')) { const s = document.getElementById('work'); return window.scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * +where.slice(5)); }
      const el = document.querySelector(where); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 60);
    }, where);
    await page.waitForTimeout(1300); // entrances + easing settle
    const file = `shots/${name}/${lang}-${String(i).padStart(2, '0')}-${n}.png`;
    await page.screenshot({ path: file, timeout: 120000 });
  }
  console.log(name, 'done', errors.length ? 'errors: ' + [...new Set(errors)].slice(0, 6).join(' | ') : 'no console errors');
  await ctx.close();
}
await browser.close();
