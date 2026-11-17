import { lang, onLang } from './i18n.js';

// "Drawn, then built": three model-vs-site pairs side by side, each under its own draggable divider.
// The markup ships in index.html (renderCompare in content.js); this file only wires the dividers.
export function initCompare() {
  const items = [...document.querySelectorAll('.cmp-item')];
  if (!items.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const KEYS = [50, 78, 26, 50]; // one sweep so the divider reads as draggable

  items.forEach((item, n) => {
    const frame = item.querySelector('.cmp-frame'), range = item.querySelector('.cmp-range');
    let touched = false;
    const say = () => range.setAttribute('aria-valuetext', (lang === 'ko' ? '3D 모델 ' : '3D model ') + Math.round(+range.value) + '%');
    const set = (v) => { frame.style.setProperty('--x', v + '%'); say(); };
    onLang(say);

    // Touch: the range covers the whole frame, so a page scroll that starts on the photo would throw the divider to the finger.
    // The value holds until the finger has clearly moved sideways, and goes back if it was a tap or the browser took the gesture to scroll.
    let touch = null;
    range.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') touch = { x: e.clientX, y: e.clientY, v: +range.value, go: false }; });
    range.addEventListener('pointermove', (e) => { if (touch && !touch.go && Math.abs(e.clientX - touch.x) > 8 && Math.abs(e.clientX - touch.x) > Math.abs(e.clientY - touch.y)) touch.go = true; });
    const endTouch = () => { if (touch && !touch.go) { range.value = touch.v; set(touch.v); } touch = null; };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => range.addEventListener(ev, endTouch));
    range.addEventListener('input', () => { if (touch && !touch.go) { range.value = touch.v; return; } touched = true; set(range.value); });
    set(50);

    // the sweep runs when this pair comes into view; side by side, the three follow each other left to right
    new IntersectionObserver((es, o) => {
      if (!es[0].isIntersecting) return;
      o.disconnect();
      if (reduced) return;
      const t0 = performance.now() + n * 220;
      const step = (t) => {
        if (touched) return;
        const u = Math.max(0, Math.min(1, (t - t0) / 2600)) * (KEYS.length - 1), i = Math.min(KEYS.length - 2, Math.floor(u)), f = u - i;
        const e = f * f * (3 - 2 * f), v = KEYS[i] + (KEYS[i + 1] - KEYS[i]) * e;
        range.value = v; set(v);
        if (u < KEYS.length - 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.55 }).observe(frame);
  });
}
