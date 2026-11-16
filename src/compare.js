import { GALLERY } from './content.js';
import { lang, onLang } from './i18n.js';

// "Drawn, then built": a 3D model view and a site photo of the same kind of area under one draggable divider.
// Pairs are matched by area, not pixel for pixel (said on the page).
const PAIRS = [
  { a: 49, b: 12, n: ['Tank farm and unloading area', '탱크 팜, 언로딩 구역'] },
  { a: 47, b: 11, n: ['Tanks and platforms', '탱크, 플랫폼'] },
  { a: 48, b: 39, n: ['Tank tops from above', '탱크 상부'] },
];
const src = (n) => `gallery/g${String(n).padStart(2, '0')}.jpg`;

export function initCompare() {
  const frame = document.getElementById('cmp-frame');
  if (!frame) return;
  const a = document.getElementById('cmp-a'), b = document.getElementById('cmp-b'), range = document.getElementById('cmp-range');
  const pick = document.getElementById('cmp-pick'), cap = document.getElementById('cmp-cap');
  let cur = 0, touched = false;
  const set = (v) => { frame.style.setProperty('--x', v + '%'); };
  const caption = () => {
    const k = lang === 'ko' ? 1 : 0, p = PAIRS[cur];
    cap.innerHTML = `<span><b>${k ? '3D 모델' : '3D model'}</b>${GALLERY[p.a - 1][k]}</span><span><b>${k ? '현장' : 'On site'}</b>${GALLERY[p.b - 1][k]}</span>`;
    a.alt = GALLERY[p.a - 1][0]; b.alt = GALLERY[p.b - 1][0];
  };
  const buttons = () => {
    pick.innerHTML = PAIRS.map((p, i) => `<button type="button" class="lab-chip" aria-pressed="${i === cur}" data-i="${i}">${p.n[lang === 'ko' ? 1 : 0]}</button>`).join('');
  };
  const show = (i) => { cur = i; a.src = src(PAIRS[i].a); b.src = src(PAIRS[i].b); buttons(); caption(); };
  pick.addEventListener('click', (e) => { const t = e.target.closest('[data-i]'); if (t) show(+t.dataset.i); });
  range.addEventListener('input', () => { touched = true; set(range.value); });
  onLang(() => { buttons(); caption(); });
  show(0); set(50);

  // one sweep when the frame first comes into view, so the divider reads as draggable
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  new IntersectionObserver((es, o) => {
    if (!es[0].isIntersecting) return;
    o.disconnect();
    if (reduced) return;
    const t0 = performance.now(), keys = [50, 78, 26, 50];
    const step = (t) => {
      if (touched) return;
      const u = Math.min(1, (t - t0) / 2600) * (keys.length - 1), i = Math.min(keys.length - 2, Math.floor(u)), f = u - i;
      const e = f * f * (3 - 2 * f), v = keys[i] + (keys[i + 1] - keys[i]) * e;
      range.value = v; set(v);
      if (u < keys.length - 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.55 }).observe(frame);
}
