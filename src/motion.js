// Entrances, the skill-row fill, active nav, and the coordinate readout.
export function initMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  // entrances: each [data-reveal] (and each dashboard card) rises once, staggered within its parent
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-reveal], .dash .card').forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.matches('[data-reveal], .card'));
    el.style.setProperty('--d', `${Math.max(0, sibs.indexOf(el)) * 80}ms`);
    io.observe(el);
  });

  const rows = [...document.querySelectorAll('.srow')];
  const secs = [...document.querySelectorAll('[data-sec]')].filter((s) => s.matches('section, .story'));
  const links = [...document.querySelectorAll('.nav a[data-sec]')];
  const xy = document.getElementById('hud-xy');
  let mx = 0, my = 0, secName = 'DASHBOARD', lastSec = '';
  const onScroll = () => {
    const vh = window.innerHeight;
    rows.forEach((row) => {
      const r = row.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.45)));
      row.style.setProperty('--p', reduced ? 1 : p.toFixed(3));
    });
    // active section = the last one whose top has passed 40% of the viewport
    let cur = secs[0];
    secs.forEach((s) => { if (s.getBoundingClientRect().top < vh * 0.4) cur = s; });
    const key = cur.dataset.sec;
    if (key !== lastSec) {
      lastSec = key;
      links.forEach((a) => a.classList.toggle('on', a.dataset.sec === key));
      const a = links.find((l) => l.dataset.sec === key);
      secName = (a ? a.getAttribute('data-en') : key).toUpperCase();
    }
    readout();
  };
  const readout = () => {
    if (!xy) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.round(window.scrollY / max * 100) : 0;
    xy.textContent = `X:${String(mx).padStart(4, '0')} Y:${String(my).padStart(4, '0')} P:${String(p).padStart(3, '0')}% S:${secName}`;
  };
  window.addEventListener('pointermove', (e) => { mx = Math.round(e.clientX); my = Math.round(e.clientY); readout(); }, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}
