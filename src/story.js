import * as THREE from 'three';
import { COLORS, KEYS, MOBILE_DIST, REVEAL_S, REVEAL_V, TAGS } from './config.js';
import { onLang } from './i18n.js';
import { createProjectA } from './projectA.js';
import { createProjectB } from './projectB.js';

// The scroll-driven 3D walk through Project A and B. The fixed canvas only renders while #story is on screen.
const $ = (id) => document.getElementById(id);
export const sm = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
const SNAP = new URLSearchParams(location.search).has('snap'); // screenshot runs: no easing, no sway

export function initStory() {
  COLORS.lines.forEach((c) => { const i = document.createElement('i'); i.style.background = c; $('sw-a').appendChild(i); });
  const labelsEl = $('labels');
  TAGS.forEach((t) => { const el = document.createElement('div'); el.className = 'tag3d'; el.style.setProperty('--c', t.c); labelsEl.appendChild(el); t.el = el; });
  onLang((l) => TAGS.forEach((t) => { t.el.textContent = l === 'ko' ? t.ko : t.en; }));

  const canvas = $('scene'), story = $('story'), hud = $('hud'), legA = $('legend-a'), legB = $('legend-b');
  const loader = $('loader'), loadTxt = $('load-txt'), loadBar = $('load-bar');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width:860px)').matches;
  window.__cys = { ready: false, stage: () => 0, frames: 0, goto: () => {} };

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { story.classList.add('no-gl'); return null; }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  const DARK = new THREE.Color(COLORS.bgA), LIGHT = new THREE.Color(COLORS.bgB), BGC = new THREE.Color();
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(COLORS.bgA, 140, 330);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.2, 900);
  const hemi = new THREE.HemisphereLight(0xf2f6ff, 0x2a3242, 2.4); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(-60, 120, 80); scene.add(sun);
  const fill = new THREE.DirectionalLight(0xdfe8ff, 0.9); fill.position.set(80, 40, -90); scene.add(fill);
  const gridA = new THREE.GridHelper(220, 44, 0x355178, 0x22385a); gridA.position.y = -0.02; scene.add(gridA);

  const A = createProjectA(scene, (f) => { loadBar.style.width = Math.round(f * 100) + '%'; });
  A.loaded.then(() => { loader.hidden = true; window.__cys.ready = true; })
    .catch((err) => { loadTxt.textContent = 'Model failed to load. Refresh to retry.'; console.error(err); });
  const B = createProjectB(scene);

  const K = KEYS.map((k) => ({ p: new THREE.Vector3(...k.p), t: new THREE.Vector3(...k.t) }));
  if (mobile) K.forEach((k, i) => {
    k.p.sub(k.t).multiplyScalar(MOBILE_DIST).add(k.t);
    if (KEYS[i].mo) { const o = new THREE.Vector3(...KEYS[i].mo); k.p.add(o); k.t.add(o); }
  });
  const N = K.length;
  const revealAt = (s) => {
    for (let i = 0; i < REVEAL_S.length - 1; i++) {
      if (s <= REVEAL_S[i + 1]) { const f = (s - REVEAL_S[i]) / (REVEAL_S[i + 1] - REVEAL_S[i]); return REVEAL_V[i] + (REVEAL_V[i + 1] - REVEAL_V[i]) * Math.max(0, Math.min(1, f)); }
    }
    return 1;
  };

  const hModel = $('h-model'), hClash = $('h-clash'), hBuild = $('h-build'), hWrap = $('h-clash-wrap');
  let target = 0, sNow = 0, vis = 0;
  const camP = new THREE.Vector3(), camT = new THREE.Vector3(), tmp = new THREE.Vector3();
  // Each story sheet owns one keyframe; its anchor is the scroll position that centres it.
  const sheets = [...story.querySelectorAll('.sheet[data-k]')];
  let anchors = [];
  const measure = () => {
    const vh = window.innerHeight;
    anchors = sheets.map((el) => { const r = el.getBoundingClientRect(); return r.top + window.scrollY + (r.height - vh) / 2; });
  };
  const readScroll = () => {
    const y = window.scrollY;
    if (y <= anchors[0]) target = 0;
    else if (y >= anchors[N - 1]) target = N - 1;
    else for (let i = 0; i < N - 1; i++) if (y <= anchors[i + 1]) { target = i + (y - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i]); break; }
    // canvas fades in as the story enters and out as it leaves
    const r = story.getBoundingClientRect(), vh = window.innerHeight;
    vis = sm(vh, vh * 0.35, r.top) * sm(0, vh * 0.65, r.bottom);
  };
  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w < 700 ? 54 : 40; camera.updateProjectionMatrix(); measure(); readScroll();
  };
  window.addEventListener('resize', resize); window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('load', resize); document.fonts && document.fonts.ready.then(resize);
  new ResizeObserver(() => { measure(); readScroll(); }).observe(document.querySelector('main'));
  resize(); sNow = target;
  const clock = new THREE.Clock();
  Object.assign(window.__cys, {
    stage: () => sNow,
    goto: (k) => { measure(); document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, anchors[k]); readScroll(); },
  });

  let shown = -1;
  function frame() {
    requestAnimationFrame(frame);
    window.__cys.frames++;
    const v = Math.round(vis * 100) / 100;
    if (v !== shown) {
      shown = v;
      canvas.style.opacity = v; labelsEl.style.opacity = v;
      document.body.classList.toggle('in-story', v > 0.5);
      loader.hidden = window.__cys.ready || v < 0.5;
      if (v <= 0) { hud.style.opacity = 0; legA.style.opacity = 0; legB.style.opacity = 0; }
    }
    if (v <= 0) return; // off screen: skip the render entirely

    const t = clock.getElapsedTime();
    sNow = SNAP ? target : sNow + (target - sNow) * (reduced ? 1 : 0.075);
    const s = sNow, i0 = Math.min(N - 2, Math.floor(s)), f = sm(0, 1, s - i0);
    camP.lerpVectors(K[i0].p, K[i0 + 1].p, f); camT.lerpVectors(K[i0].t, K[i0 + 1].t, f);
    if (!reduced && !SNAP) { camP.x += Math.sin(t * 0.16) * 1.0; camP.y += Math.sin(t * 0.21) * 0.4; }
    camera.position.copy(camP); camera.lookAt(camT);

    // world switch A (dark, Plant 3D) <-> B (light, Navisworks)
    const bw = sm(5.35, 5.85, s) * (1 - sm(7.35, 7.85, s));
    BGC.copy(DARK).lerp(LIGHT, bw); renderer.setClearColor(BGC, 1); scene.fog.color.copy(BGC);
    scene.fog.near = 140 - 60 * bw; scene.fog.far = 330 - 130 * bw;
    hemi.groundColor.setHex(bw > 0.5 ? 0x9aa3ad : 0x24365a);
    B.group.visible = s > 4.9 && s < 8.4; A.group.visible = s < 5.95 || s > 7.2; gridA.visible = bw < 0.5;
    B.roof.visible = camera.position.y < 14;
    hud.style.opacity = (1 - bw) * v; legA.style.opacity = (1 - bw) * v; legB.style.opacity = bw * v;

    const r = revealAt(s), ins = sm(4.6, 5.3, s), cIn = sm(3.5, 3.9, s), cOut = sm(4.3, 4.95, s);
    A.setReveal(r);
    if (A.ready) hModel.textContent = Math.round(A.pipeShown(r) * 100) + '%';
    A.insulMat.opacity = ins * 0.5;
    A.insulMeshes.forEach((m) => { m.visible = ins > 0.01; });
    let open = 0;
    A.clashes.forEach((m, j) => {
      const res = Math.min(1, Math.max(0, cOut * 1.7 - j * 0.15));
      if (res < 0.5 && cIn > 0.5) open++;
      m.material.color.setHex(res > 0.5 ? 0x4ade80 : 0xf87171);
      m.material.opacity = cIn * (1 - sm(0.6, 1, res)) * 0.95;
      m.scale.setScalar(1 + (reduced || SNAP ? 0 : Math.sin(t * 4 + j) * 0.12));
    });
    hClash.textContent = cIn > 0.5 && A.clashes.length ? open : '-';
    hWrap.className = cIn > 0.5 ? (open > 0 ? 'warn' : 'ok') : '';
    hBuild.textContent = Math.round(ins * 100) + '%';
    B.setReveal(s < 5.4 ? -1 : Math.min(1, (s - 5.4) / 1.5));

    const w = window.innerWidth, h = window.innerHeight;
    TAGS.forEach((tg) => {
      const a = sm(tg.win[0], tg.win[0] + 0.3, s) * (1 - sm(tg.win[1] - 0.3, tg.win[1], s));
      tmp.set(tg.p[0], tg.p[1], tg.p[2]).project(camera);
      const inView = tmp.z < 1 && Math.abs(tmp.x) < 1.05 && Math.abs(tmp.y) < 1.05;
      tg.el.style.opacity = inView && (A.ready || tg.b) ? a : 0;
      if (a > 0) {
        const half = tg.el.offsetWidth / 2 + 8;
        const px = Math.min(w - half, Math.max(half, (tmp.x * 0.5 + 0.5) * w));
        tg.el.style.transform = `translate(${px}px,${(-tmp.y * 0.5 + 0.5) * h}px) translate(-50%,-120%)`;
      }
    });
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  return A;
}
