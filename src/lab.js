import * as THREE from 'three';
import { COLORS } from './config.js';
import { revealMaterial } from './reveal.js';
import { lang, onLang } from './i18n.js';

// Model lab: one canvas, three uses of the same Project A model.
//  build: a 4D construction sequence scrubbed on a plan-vs-actual timeline
//  clash: a crossing before and after it is resolved (procedural, not client geometry)
//  pid:   a simplified P&ID whose items fly the camera to the matching area of the model
const $ = (id) => document.getElementById(id);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const T = (pair) => pair[lang === 'ko' ? 1 : 0];

// Plan and actual durations (months) are the recorded figures from the resume (see summary.js).
const PROJECTS = [
  { n: ['Kokomo SDI hook-up', 'Kokomo SDI Hook-up'], plan: 14, actual: 12 },
  { n: ['Michigan LGESMI2 CESS', 'Michigan LGESMI2 CESS'], plan: 18, actual: 17 },
  { n: ['Ohio Ultium Cells CESS', 'Ohio Ultium Cells CESS'], plan: 11.5, actual: 10.5 },
];
// Installation order. The split of each phase over the job (a to b, share of the actual duration) is illustrative.
const PHASES = [
  { k: 'struct', n: ['Racks and steel', '랙, 철골'], a: 0.0, b: 0.14 },
  { k: 'equip', n: ['Tanks and equipment', '탱크, 설비 반입'], a: 0.08, b: 0.26 },
  { k: 'support', n: ['Pipe supports', '배관 서포트'], a: 0.18, b: 0.52 },
  { k: 'pipe', n: ['Piping, tank to tool', '배관 (탱크에서 설비까지)'], a: 0.26, b: 0.8 },
  { k: 'valve', n: ['Valves and instruments', '밸브, 계측기'], a: 0.5, b: 0.88 },
  { k: 'insul', n: ['Insulation', '보온'], a: 0.8, b: 0.95 },
  { k: 'test', n: ['Pressure test, turnover', '압력 테스트, 인계'], a: 0.93, b: 1.0 },
];
// P&ID items: camera position and target in model metres (same frame as the story keyframes in config.js)
const NODES = {
  tank: { n: ['Storage tanks and transfer pumps', '저장 탱크, 이송 펌프'], p: [-44, 15, 38], t: [-67, 5, 12] },
  header: { n: ['Distribution header, about 150 m', '이송 헤더, 약 150 m'], p: [-52, 10.5, 27], t: [-22, 6, 8] },
  pou1: { n: ['POU 01: isolation valve, PT / TT', 'POU 01: 차단 밸브, PT / TT'], x: -0.6 },
  pou2: { n: ['POU 02: isolation valve, PT / TT', 'POU 02: 차단 밸브, PT / TT'], x: 17.3 },
  pou3: { n: ['POU 03: isolation valve, PT / TT', 'POU 03: 차단 밸브, PT / TT'], x: 41.4 },
  pou4: { n: ['POU 04: isolation valve, PT / TT', 'POU 04: 차단 밸브, PT / TT'], x: 65.3 },
};
Object.values(NODES).forEach((nd) => { if (nd.x !== undefined) { nd.p = [nd.x - 15, 9.5, 7]; nd.t = [nd.x + 1.5, 3.4, -13]; } });

export function initLab(A) {
  const sec = $('lab'), canvas = $('lab-gl');
  if (!sec || !canvas || !A) return null;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { sec.classList.add('no-gl'); return null; }
  const small = window.matchMedia('(max-width:760px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 1200);
  scene.add(new THREE.HemisphereLight(0xf2f6ff, 0x2a3242, 2.5));
  const sun = new THREE.DirectionalLight(0xffffff, 2.1); sun.position.set(-60, 120, 80); scene.add(sun);
  const grid = new THREE.GridHelper(260, 52, 0x355178, 0x22385a); grid.position.y = -0.02; scene.add(grid);

  /* ---------- model with one reveal threshold per layer ---------- */
  const U = { struct: { value: 0 }, equip: { value: 0 }, support: { value: 0 }, pipe: { value: 0 }, valve: { value: 0 } };
  const lineMats = [...COLORS.lines, COLORS.otherLine].map((c) => revealMaterial(c, U.pipe, { roughness: 0.4 }));
  const mats = {
    valve: revealMaterial(COLORS.valve, U.valve),
    equip: revealMaterial(COLORS.equip, U.equip, { metalness: 0.4, roughness: 0.38 }),
    support: revealMaterial(COLORS.support, U.support, { roughness: 0.55 }),
    struct: revealMaterial(COLORS.struct, U.struct),
    insul: new THREE.MeshStandardMaterial({ color: COLORS.insul, roughness: 0.9, metalness: 0, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
  };
  let model = null; const insul = [];
  A.loaded.then(() => {
    model = A.model.clone(true);
    model.traverse((o) => {
      if (!o.isMesh) return;
      const [l, ci] = o.name.split('_');
      o.material = l === 'pipe' ? lineMats[+ci] : mats[l];
      if (l === 'insul') { o.renderOrder = 2; insul.push(o); }
    });
    scene.add(model); model.visible = tab !== 'clash';
    sec.classList.add('ready');
  }).catch(() => {});

  /* ---------- clash demo: a new line against two existing headers under a cable tray ---------- */
  const demo = new THREE.Group(); demo.visible = false; scene.add(demo);
  const std = (hex, o = {}) => new THREE.MeshStandardMaterial({ color: hex, metalness: 0.3, roughness: 0.5, ...o });
  const rod = (len, r, mat) => new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 20), mat);
  const HDR_Z = [-1.6, 1.6], LINE_Y = 4.0, DROP = 0.95;
  HDR_Z.forEach((z, i) => { const m = rod(16, 0.24, std(i ? COLORS.lines[2] : COLORS.otherLine)); m.rotation.z = Math.PI / 2; m.position.set(0, LINE_Y, z); demo.add(m); });
  const tray = new THREE.Mesh(new THREE.BoxGeometry(16, 0.12, 1.3), std(0xd6b55a, { roughness: 0.7 })); tray.position.set(0, 5.05, 0); demo.add(tray);
  [-0.65, 0.65].forEach((z) => { const s = new THREE.Mesh(new THREE.BoxGeometry(16, 0.22, 0.05), std(0xd6b55a, { roughness: 0.7 })); s.position.set(0, 5.16, z); demo.add(s); });
  [-6.5, 6.5].forEach((x) => { // rack frames carrying the headers and the tray
    const steel = std(COLORS.struct, { roughness: 0.6 });
    [-3.2, 3.2].forEach((z) => { const c = new THREE.Mesh(new THREE.BoxGeometry(0.3, 6.2, 0.3), steel); c.position.set(x, 3.1, z); demo.add(c); });
    [3.62, 4.84].forEach((y) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 6.7), steel); b.position.set(x, y, 0); demo.add(b); });
  });
  const newMat = std(COLORS.lines[5], { roughness: 0.4, emissive: 0x000000 });
  const newLine = new THREE.Mesh(new THREE.BufferGeometry(), newMat); demo.add(newLine);
  const linePath = (k) => { // k = 0 straight through the headers, 1 = offset underneath with two 45-degree sets
    const d = DROP * k, y = LINE_Y, pts = [[0, y, -9], [0, y, -3.5], [0, y - d, -3.5 + d], [0, y - d, 3.5 - d], [0, y, 3.5], [0, y, 9]];
    const path = new THREE.CurvePath();
    for (let i = 0; i < pts.length - 1; i++) { const a = new THREE.Vector3(...pts[i]), b = new THREE.Vector3(...pts[i + 1]); if (a.distanceTo(b) > 1e-4) path.add(new THREE.LineCurve3(a, b)); }
    return path;
  };
  const setLine = (k) => { newLine.geometry.dispose(); newLine.geometry = new THREE.TubeGeometry(linePath(k), 120, 0.2, 16, false); };
  const hits = HDR_Z.map((z) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 12), new THREE.MeshBasicMaterial({ color: 0xf87171, wireframe: true, transparent: true, depthTest: false }));
    m.position.set(0, LINE_Y, z); m.renderOrder = 5; demo.add(m); return m;
  });
  let clashK = 0, clashGoal = 0, clashDrawn = -1;

  /* ---------- P&ID highlight ring ---------- */
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.07, 8, 48), new THREE.MeshBasicMaterial({ color: 0xff7a1a, transparent: true, depthTest: false }));
  ring.renderOrder = 6; ring.visible = false; scene.add(ring);

  /* ---------- camera rig: orbit around a target, eased toward a goal ---------- */
  const rig = { t: new THREE.Vector3(0, 2, 0), r: 220, th: 0.95, ph: 0.5 };
  const goal = { t: new THREE.Vector3(0, 2, 0), r: 220, th: 0.95, ph: 0.5 };
  let fitR = 220, tab = 'build', drag = null, visible = false, node = 'tank', sway = 0, swayBase = 0.95;
  const aim = (p, t) => {
    const v = new THREE.Vector3(...p).sub(new THREE.Vector3(...t)), r = v.length();
    goal.t.set(...t); goal.r = r; goal.ph = Math.asin(v.y / r); goal.th = Math.atan2(v.z, v.x);
    // take the short way round
    while (goal.th - rig.th > Math.PI) goal.th -= Math.PI * 2;
    while (goal.th - rig.th < -Math.PI) goal.th += Math.PI * 2;
  };
  const view = () => {
    if (tab === 'build') { goal.t.set(0, 1, 0); goal.r = fitR; goal.ph = 0.42; }
    else if (tab === 'clash') { goal.t.set(0, 3.9, 0); goal.r = small ? 36 : 28; goal.ph = 0.3; goal.th = 0.72 + Math.round((rig.th - 0.72) / (Math.PI * 2)) * Math.PI * 2; }
    else aim(NODES[node].p, NODES[node].t);
  };
  const resize = () => {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
    const half = Math.atan(Math.tan(16 * Math.PI / 180) * camera.aspect);
    fitR = Math.min(480, 80 / Math.tan(half)); // the 156 m run sits on the diagonal of the frame
    if (tab === 'build') goal.r = fitR;
  };
  new ResizeObserver(resize).observe(canvas); resize(); rig.r = goal.r = fitR;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { rootMargin: '120px' }).observe(canvas);
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, th: goal.th }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => { if (drag) goal.th = drag.th + (e.clientX - drag.x) * 0.008; });
  const endDrag = () => { drag = null; swayBase = goal.th; sway = 0; };
  canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag);

  /* ---------- labels drawn over the canvas ---------- */
  const tagEls = [...sec.querySelectorAll('.lab-tag')];
  const tags = tagEls.map((el) => ({ el, p: new THREE.Vector3(), on: false }));
  const tmp = new THREE.Vector3();
  const drawTags = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    tags.forEach((tg) => {
      if (!tg.on) { tg.el.style.opacity = 0; return; }
      tmp.copy(tg.p).project(camera);
      const ok = tmp.z < 1 && Math.abs(tmp.x) < 1.02 && Math.abs(tmp.y) < 1.02;
      tg.el.style.opacity = ok ? 1 : 0;
      const half = tg.el.offsetWidth / 2 + 6;
      const px = Math.min(w - half, Math.max(half, (tmp.x * 0.5 + 0.5) * w));
      tg.el.style.transform = `translate(${px}px,${(-tmp.y * 0.5 + 0.5) * h}px) translate(-50%,-135%)`;
    });
  };

  /* ---------- 4D timeline ---------- */
  const range = $('lab-range'), playBtn = $('lab-play'), readout = $('lab-read'), nowEl = $('lab-now');
  const gantt = $('lab-gantt'), chips = $('lab-proj'), saved = $('lab-saved');
  let proj = 0, month = 0, playing = false, lastUi = '';
  const P = () => PROJECTS[proj];
  const drawChips = () => {
    chips.innerHTML = PROJECTS.map((p, i) => `<button type="button" class="lab-chip" aria-pressed="${i === proj}" data-i="${i}">${T(p.n)}</button>`).join('');
  };
  chips.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (!b) return; proj = +b.dataset.i; month = 0; drawChips(); drawGantt(); play(true); });
  const drawGantt = () => {
    const p = P(), f = p.actual / p.plan, pc = (x) => (x * 100).toFixed(2) + '%';
    const row = (cls, name, inner, val) => `<div class="gt-row ${cls}"><span class="gt-n">${name}</span><span class="gt-track">${inner}</span><span class="gt-v">${val}</span></div>`;
    const mo = (v) => (lang === 'ko' ? `${v}개월` : `${v} mo`);
    gantt.innerHTML =
      row('sum plan', T(['Plan', '계획']), '<i class="gt-bar" style="left:0;width:100%"><b data-fill="plan"></b></i>', mo(p.plan))
      + row('sum act', T(['Actual', '실제']), `<i class="gt-bar" style="left:0;width:${pc(f)}"><b data-fill="act"></b></i>`, mo(p.actual))
      + PHASES.map((ph, i) => row('', T(ph.n),
        `<i class="gt-ghost" style="left:${pc(ph.a)};width:${pc(ph.b - ph.a)}"></i><i class="gt-bar" style="left:${pc(ph.a * f)};width:${pc((ph.b - ph.a) * f)}"><b data-fill="${i}"></b></i>`, '')).join('')
      + '<i class="gt-head" id="lab-head"></i>';
    saved.innerHTML = `<b>-${+(p.plan - p.actual).toFixed(1)}</b><span>${T(['months ahead of plan', '개월 단축'])}</span>`;
    lastUi = '';
  };
  const share = (ph) => clamp01((month / P().actual - ph.a) / (ph.b - ph.a));
  const applyBuild = () => {
    const p = P(), prog = clamp01(month / p.actual);
    const v = Object.fromEntries(PHASES.map((ph) => [ph.k, share(ph)]));
    // 1.001 so the last object of a finished layer is never cut by the threshold
    U.struct.value = v.struct * 1.001; U.equip.value = v.equip * 1.001; U.support.value = v.support * 1.001;
    U.pipe.value = v.pipe * 1.001; U.valve.value = v.valve * 1.001;
    mats.insul.opacity = v.insul * 0.5; insul.forEach((m) => { m.visible = v.insul > 0.01; });
    const key = month.toFixed(2) + proj + lang;
    if (key === lastUi) return; lastUi = key;
    range.value = Math.round(month / p.plan * 1000);
    const head = $('lab-head'); if (head) head.style.setProperty('--x', month / p.plan);
    gantt.querySelectorAll('[data-fill]').forEach((b) => {
      const k = b.dataset.fill;
      b.style.width = ((k === 'plan' ? clamp01(month / p.plan) : k === 'act' ? prog : v[PHASES[+k].k]) * 100).toFixed(1) + '%';
    });
    const done = month >= p.actual - 1e-6;
    saved.classList.toggle('on', done); sec.classList.toggle('built', done);
    readout.textContent = lang === 'ko' ? `${month.toFixed(1)}개월 차 / 계획 ${p.plan}개월` : `Month ${month.toFixed(1)} of ${p.plan} planned`;
    const active = PHASES.filter((ph) => { const s = share(ph); return s > 0 && s < 1; }).map((ph) => T(ph.n));
    nowEl.textContent = done ? T(['Complete: handed over ahead of plan', '준공: 계획보다 일찍 인계']) : (active.length ? active.join(' · ') : T(['Site mobilisation', '현장 착수']));
  };
  const setPlayLabel = () => { playBtn.textContent = playing ? T(['❚❚ Pause', '❚❚ 일시정지']) : (month >= P().plan - 1e-6 ? T(['↻ Replay', '↻ 다시 재생']) : T(['▶ Play', '▶ 재생'])); playBtn.setAttribute('aria-pressed', playing); };
  const play = (restart) => { if (restart || month >= P().plan - 1e-6) month = 0; playing = true; setPlayLabel(); };
  const pause = () => { playing = false; setPlayLabel(); };
  playBtn.addEventListener('click', () => (playing ? pause() : play(false)));
  range.addEventListener('input', () => { pause(); month = (+range.value / 1000) * P().plan; });

  /* ---------- tabs ---------- */
  const tabBtns = [...sec.querySelectorAll('[data-tab]')], panes = [...sec.querySelectorAll('.lab-pane')];
  const cBtns = [...sec.querySelectorAll('[data-clash]')], cTxt = [...sec.querySelectorAll('[data-clash-txt]')], cOpen = $('lab-open');
  const pidEls = [...sec.querySelectorAll('[data-node]')], pidName = $('lab-node');
  const setClash = (k) => {
    clashGoal = k;
    cBtns.forEach((b) => b.setAttribute('aria-pressed', +b.dataset.clash === k));
    cTxt.forEach((el) => { el.hidden = +el.dataset.clashTxt !== k; });
    cOpen.textContent = k ? '0' : '2'; cOpen.parentElement.className = 'lab-stat ' + (k ? 'ok' : 'warn');
  };
  cBtns.forEach((b) => b.addEventListener('click', () => setClash(+b.dataset.clash)));
  const setNode = (id) => {
    node = id;
    pidEls.forEach((el) => el.classList.toggle('on', el.dataset.node === id));
    pidName.textContent = T(NODES[id].n);
    if (tab === 'pid') view();
  };
  pidEls.forEach((el) => {
    el.addEventListener('click', () => setNode(el.dataset.node));
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setNode(el.dataset.node); } });
  });
  const setTab = (name) => {
    tab = name;
    tabBtns.forEach((b) => { const on = b.dataset.tab === name; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    panes.forEach((p) => { p.hidden = p.dataset.pane !== name; });
    sec.dataset.mode = name;
    if (model) model.visible = name !== 'clash';
    demo.visible = name === 'clash'; grid.visible = name !== 'clash'; ring.visible = name === 'pid';
    if (name !== 'build') pause();
    if (name === 'clash') { clashK = 0; clashDrawn = -1; setClash(0); setTimeout(() => { if (tab === 'clash' && clashGoal === 0) setClash(1); }, reduced ? 0 : 2600); }
    view();
  };
  tabBtns.forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));
  sec.querySelector('.lab-tabs').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = tabBtns.findIndex((b) => b.dataset.tab === tab), n = tabBtns[(i + (e.key === 'ArrowRight' ? 1 : tabBtns.length - 1)) % tabBtns.length];
    setTab(n.dataset.tab); n.focus();
  });

  onLang(() => { drawChips(); drawGantt(); setPlayLabel(); pidName.textContent = T(NODES[node].n); });
  setTab('build'); setNode('tank');

  // the sequence starts by itself the first time the section is well inside the viewport
  let autoplayed = false;
  new IntersectionObserver((e) => { if (e[0].isIntersecting && !autoplayed) { autoplayed = true; if (tab === 'build' && month === 0) play(true); } }, { threshold: 0.5 }).observe(canvas);

  let last = performance.now();
  const loop = (t) => {
    requestAnimationFrame(loop);
    const real = Math.min(0.5, (t - last) / 1000), dt = Math.min(0.05, real); last = t; // real: wall-clock step for playback, dt: capped step for easing
    if (!visible) return;
    if (tab === 'build') {
      if (playing) { month = Math.min(P().plan, month + real * P().plan / (reduced ? 6 : 11)); if (month >= P().plan) pause(); }
      applyBuild();
      if (!drag && !reduced) { sway += dt; goal.th = swayBase + Math.sin(sway * 0.22) * 0.16; } // gentle sway around the diagonal view, never end-on
    } else if (tab === 'pid') {
      U.struct.value = U.equip.value = U.support.value = U.pipe.value = U.valve.value = 1.001;
      mats.insul.opacity = 0; insul.forEach((m) => { m.visible = false; });
      const nd = NODES[node];
      ring.position.set(...nd.t); ring.quaternion.copy(camera.quaternion);
      const pulse = reduced ? 0 : (t / 1400) % 1;
      ring.scale.setScalar((node === 'tank' ? 4.2 : node === 'header' ? 2.4 : 1) * (1 + pulse * 0.35)); ring.material.opacity = 1 - pulse * 0.75;
      tags[0].on = true; tags[0].p.set(nd.t[0], nd.t[1] + (node === 'tank' ? 9 : 3), nd.t[2]);
      tags[0].el.textContent = T(nd.n); tags[0].el.className = 'lab-tag';
      tags[1].on = false;
    }
    if (tab === 'clash') {
      clashK += (clashGoal - clashK) * (reduced ? 1 : Math.min(1, dt * 5));
      if (Math.abs(clashK - clashGoal) < 0.002) clashK = clashGoal;
      if (clashK !== clashDrawn) { clashDrawn = clashK; setLine(clashK); }
      const bad = 1 - clashK;
      newMat.emissive.setRGB(0.55 * bad, 0.05 * bad, 0.02 * bad);
      hits.forEach((m, i) => { m.material.opacity = bad * 0.95; m.scale.setScalar(1 + (reduced ? 0 : Math.sin(t / 160 + i) * 0.1)); m.visible = bad > 0.02; });
      hits.forEach((m, i) => {
        const tg = tags[i]; tg.on = !(small && i === 1); tg.p.set(0, LINE_Y + (clashK > 0.5 ? -DROP - 0.1 : 0.9), small ? 0 : HDR_Z[i]);
        tg.el.textContent = clashK > 0.5 ? T(['CLEAR', '간섭 해소']) : T(['CLASH', '간섭']);
        tg.el.className = 'lab-tag ' + (clashK > 0.5 ? 'ok' : 'bad');
      });
    } else if (tab === 'build') { tags.forEach((tg) => { tg.on = false; }); }

    const e = reduced ? 1 : Math.min(1, dt * 3.2);
    rig.t.lerp(goal.t, e); rig.r += (goal.r - rig.r) * e; rig.th += (goal.th - rig.th) * e; rig.ph += (goal.ph - rig.ph) * e;
    const c = Math.cos(rig.ph);
    camera.position.set(rig.t.x + rig.r * c * Math.cos(rig.th), rig.t.y + rig.r * Math.sin(rig.ph), rig.t.z + rig.r * c * Math.sin(rig.th));
    camera.lookAt(rig.t); camera.updateMatrixWorld();
    drawTags();
    renderer.render(scene, camera);
  };
  requestAnimationFrame(loop);

  const api = { tab: setTab, play: () => { setTab('build'); play(true); }, seek: (f) => { pause(); month = clamp01(f) * P().plan; }, clash: setClash, node: setNode, state: () => ({ tab, month, proj, playing, node, clashK }) };
  window.__lab = api;
  return api;
}
