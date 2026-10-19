import * as THREE from 'three';
import { ERAS } from './content.js';
import { COLORS } from './config.js';
import { lang, onLang } from './i18n.js';
import { initIndustry } from './industry.js';

const $ = (id) => document.getElementById(id);
const START = new Date('2013-03-01T00:00:00+09:00');
const yearFrac = (d) => d.getFullYear() + (d.getMonth() + d.getDate() / 31) / 12;

// "Time in the field": live years since March 2013, and a gauge with one arc segment per employer.
function initYears() {
  const el = $('yrs'), now = new Date();
  const years = (now - START) / (365.2425 * 864e5);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) el.textContent = years.toFixed(1);
  else {
    const t0 = performance.now();
    const tick = (t) => { const k = Math.min(1, (t - t0) / 1400); el.textContent = (years * (1 - (1 - k) ** 3)).toFixed(1); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  $('gauge-now').textContent = now.getFullYear();

  const y0 = 2013.17, y1 = Math.max(yearFrac(now), 2026.0), cx = 150, cy = 150, R = 118;
  const ang = (y) => Math.PI * (1 - (y - y0) / (y1 - y0)); // 180° at 2013 → 0° today
  const pt = (a, r = R) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  const g = $('gauge-segs'), ns = 'http://www.w3.org/2000/svg';
  const base = document.createElementNS(ns, 'path');
  const [bx0, by0] = pt(Math.PI), [bx1, by1] = pt(0);
  base.setAttribute('d', `M${bx0},${by0} A${R},${R} 0 0 1 ${bx1},${by1}`); base.setAttribute('class', 'g-base'); g.appendChild(base);
  const eraEl = $('gauge-era');
  const label = (e) => `${e.co} · ${Math.floor(e.from)} – ${e.to >= 2026 ? (lang === 'ko' ? '현재' : 'now') : Math.floor(e.to)}`;
  ERAS.forEach((e, i) => {
    const a0 = ang(e.from) - 0.02, a1 = ang(Math.min(e.to, y1)) + 0.02;
    const [x0, yy0] = pt(a0), [x1, yy1] = pt(a1);
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', `M${x0},${yy0} A${R},${R} 0 0 1 ${x1},${yy1}`);
    p.setAttribute('class', 'g-seg' + (i === ERAS.length - 1 ? ' now' : ''));
    p.setAttribute('tabindex', '0');
    const title = document.createElementNS(ns, 'title'); title.textContent = label(e); p.appendChild(title);
    const show = () => { eraEl.textContent = label(e); g.querySelectorAll('.g-seg').forEach((s) => s.classList.toggle('on', s === p)); };
    p.addEventListener('pointerenter', show); p.addEventListener('focus', show);
    g.appendChild(p);
  });
  const [dx, dy] = pt(ang(yearFrac(now)));
  $('gauge-dot').setAttribute('cx', dx); $('gauge-dot').setAttribute('cy', dy);
  onLang(() => { eraEl.textContent = label(ERAS[ERAS.length - 1]); });
}

// Live model card: the real Project A GLB on a slow turntable around the tank farm; drag to turn.
function initTurntable(A) {
  const canvas = $('turntable');
  if (!A || !canvas) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.matchMedia('(max-width:760px)').matches ? 1.5 : 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 600);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x30343a, 2.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.0); sun.position.set(-60, 120, 80); scene.add(sun);
  const mat = (hex, o = {}) => new THREE.MeshStandardMaterial({ color: hex, metalness: 0.3, roughness: 0.5, side: THREE.DoubleSide, ...o });
  const lines = [...COLORS.lines, COLORS.otherLine].map((c) => mat(c, { roughness: 0.4 }));
  const layer = { valve: mat(COLORS.valve), equip: mat(COLORS.equip, { metalness: 0.4, roughness: 0.38 }), support: mat(COLORS.support), struct: mat(COLORS.struct) };
  const target = new THREE.Vector3(-63, 3.5, 12);
  let model = null, angle = 0.9, drag = null, visible = false, last = performance.now();
  A.loaded.then(() => {
    model = A.model.clone(true);
    model.traverse((o) => {
      if (!o.isMesh) return;
      const [l, ci] = o.name.split('_');
      if (l === 'insul') { o.visible = false; return; }
      o.material = l === 'pipe' ? lines[+ci] : layer[l];
    });
    scene.add(model);
    canvas.classList.add('ready');
  }).catch(() => {});
  const resize = () => {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas); resize();
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(canvas);
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, a: angle }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => { if (drag) angle = drag.a - (e.clientX - drag.x) * 0.008; });
  canvas.addEventListener('pointerup', () => { drag = null; });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loop = (t) => {
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!visible || !model) return;
    if (!drag && !reduced) angle += dt * 0.18;
    const d = 46;
    camera.position.set(target.x + Math.cos(angle) * d, target.y + 22, target.z + Math.sin(angle) * d);
    camera.lookAt(target);
    renderer.render(scene, camera);
  };
  requestAnimationFrame(loop);
}

// Capability hexagon: pointing at (or focusing) an axis shows the resume evidence under the chart
function initRadar() {
  const ev = $('rd-ev'); if (!ev) return;
  const axes = [...document.querySelectorAll('.rd-ax')];
  let cur = -1;
  const show = (i) => {
    cur = i;
    axes.forEach((a, j) => a.classList.toggle('on', j === i));
    ev.classList.toggle('on', i >= 0);
    ev.textContent = i >= 0 ? axes[i].getAttribute('data-ev-' + lang) : ev.getAttribute('data-' + lang);
  };
  axes.forEach((a, i) => {
    a.addEventListener('pointerenter', () => show(i));
    a.addEventListener('focus', () => show(i));
    a.addEventListener('click', () => show(i));
  });
  document.querySelector('.radar').addEventListener('pointerleave', () => show(-1));
  onLang(() => show(cur));
}

export function initDashboard(A) {
  initRadar();
  initYears();
  initIndustry();
  initTurntable(A);
}
