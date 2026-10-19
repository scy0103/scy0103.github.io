// Gravity-style orbit around the portrait: a ring of services that turns on its own and by drag,
// plus a red ball travelling one of the orbit ellipses.
export function initOrbit() {
  const stage = document.getElementById('ob-stage'), ring = document.getElementById('ob-ring');
  if (!stage || !ring) return;
  const items = [...ring.children], n = items.length;
  const ball = stage.querySelector('.ob-ball');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let rot = 0, vel = reduced ? 0 : 0.06, drag = null, visible = false, ballT = 0;

  const place = () => {
    const w = stage.clientWidth, rx = w * 0.36, rz = w * 0.16;
    items.forEach((el, i) => {
      const a = (i / n) * Math.PI * 2 + rot;
      const x = Math.sin(a) * rx, z = Math.cos(a) * rz, front = (Math.cos(a) + 1) / 2;
      el.style.transform = `translate(-50%,-50%) translate3d(${x}px, ${Math.cos(a) * 18}px, 0) scale(${0.72 + 0.38 * front})`;
      el.style.opacity = (0.22 + 0.78 * front).toFixed(3);
      el.style.zIndex = z > 0 ? 3 : 1; // behind the portrait when on the far side
    });
    // ball on the tilted ellipse (rx 470, ry 150, rotated -18deg, in a 1000 box)
    const s = w / 1000, c = Math.cos(-18 * Math.PI / 180), sn = Math.sin(-18 * Math.PI / 180);
    const ex = Math.cos(ballT) * 470, ey = Math.sin(ballT) * 150;
    ball.style.transform = `translate(${(500 + ex * c - ey * sn) * s}px, ${(520 + ex * sn + ey * c) * s}px) translate(-50%,-50%)`;
    ball.style.zIndex = Math.sin(ballT) > 0 ? 3 : 1;
  };
  stage.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, r: rot }; stage.setPointerCapture(e.pointerId); stage.classList.add('dragging'); });
  stage.addEventListener('pointermove', (e) => { if (drag) { const dx = e.clientX - drag.x; rot = drag.r + dx * 0.006; vel = dx * 0.0004; } });
  const end = () => { drag = null; stage.classList.remove('dragging'); };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(stage);
  let last = performance.now();
  const loop = (t) => {
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!visible) return;
    if (!drag) { rot += vel * dt * 6; vel += ((reduced ? 0 : 0.06) - vel) * 0.02; }
    if (!reduced) ballT += dt * 0.35;
    place();
  };
  place(); requestAnimationFrame(loop);
}
