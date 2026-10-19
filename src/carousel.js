// Curved photo carousel: the work section is pinned while you scroll through it and the ring turns
// with the scroll; dragging adds to it. Pictures open in the lightbox (ui.js).
export function initCarousel() {
  const sec = document.getElementById('work'), wrap = document.getElementById('cr'), ring = document.getElementById('cr-ring');
  if (!sec || !ring) return;
  const items = [...ring.children], n = items.length, step = 360 / n;
  let dragDeg = 0, drag = null, moved = 0;
  const layout = () => {
    const w = items[0].offsetWidth || 260;
    const r = Math.round((w / 2) / Math.tan(Math.PI / n)) + 24;
    ring.style.setProperty('--r', r + 'px');
    items.forEach((el, i) => { el.style.transform = `rotateY(${i * step}deg) translateZ(${r}px)`; });
  };
  const update = () => {
    const rect = sec.getBoundingClientRect(), span = rect.height - window.innerHeight;
    const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
    ring.style.transform = `translateZ(calc(var(--r) * -1)) rotateY(${-p * (360 - step) + dragDeg}deg)`;
  };
  wrap.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, d: dragDeg }; moved = 0; });
  window.addEventListener('pointermove', (e) => { if (!drag) return; moved = Math.abs(e.clientX - drag.x); dragDeg = drag.d + (e.clientX - drag.x) * 0.25; update(); });
  window.addEventListener('pointerup', () => { drag = null; });
  // a drag should not open the picture under the pointer
  wrap.addEventListener('click', (e) => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
  new ResizeObserver(() => { layout(); update(); }).observe(wrap);
  window.addEventListener('scroll', update, { passive: true });
  layout(); update();
}
