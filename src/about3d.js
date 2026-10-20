import * as THREE from 'three';
import { onLang } from './i18n.js';

// About me as a bending film strip: the photos sit side by side on a gently curved WebGL strip.
// Scrolling the pinned section (or dragging) slides the strip; the faster it moves, the more each
// photo bows. Photos keep their own colours (no filters). The bento grid stays in the DOM as the
// no-WebGL fallback and as the source for captions and the lightbox.
const VERT = `
uniform float uVel, uCurve;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  wp.z -= wp.x * wp.x * uCurve;                       // the whole strip curves away at the sides
  wp.z += sin(uv.x * 3.14159) * uVel * 0.45;           // each photo bows with the speed
    gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const FRAG = `
uniform sampler2D uTex;
uniform vec2 uPlane, uImg;
uniform float uVel, uOn, uHover, uLoaded;
varying vec2 vUv;
float box(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main() {
  // each plane has the photo's own aspect ratio, so the whole photo shows, uncropped
  vec2 uv = vUv;
  vec3 c = texture2D(uTex, uv).rgb;
  c = mix(vec3(0.10, 0.16, 0.25), c, uLoaded);
  vec2 p = (vUv - 0.5) * uPlane;
  float d = box(p, uPlane * 0.5, 0.12);
  float a = 1.0 - smoothstep(-0.01, 0.01, d);
  float edge = (1.0 - smoothstep(0.0, 0.025, abs(d + 0.015))) * uOn;  // thin orange rim on the active photo
  c = mix(c, vec3(1.0, 0.48, 0.10), edge);
  gl_FragColor = vec4(c, a);
}`;

export function initAbout3d() {
  const sec = document.getElementById('about'), stage = document.getElementById('ab-stage');
  const canvas = document.getElementById('ab-gl'), grid = document.getElementById('ab-grid');
  const labels = document.getElementById('ab-labels');
  if (!sec || !stage || !canvas || !grid) return;
  const figs = [...grid.querySelectorAll('.ab-ph')];
  const n = figs.length;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
  stage.hidden = false;
  sec.classList.add('ab-3d');
  stage.style.setProperty('--n', n);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  const loader = new THREE.TextureLoader();
  const strip = new THREE.Group(); scene.add(strip);
  const geo = new THREE.PlaneGeometry(1, 1, 40, 20);
  const curve = { value: 0.035 };

  const items = figs.map((fig, i) => {
    const u = {
      uTex: { value: null }, uPlane: { value: new THREE.Vector2(1, 1) }, uImg: { value: new THREE.Vector2(1, 1) },
      uVel: { value: 0 }, uCurve: curve, uOn: { value: 0 }, uHover: { value: 0 }, uLoaded: { value: 0 },
    };
    const m = new THREE.Mesh(geo, new THREE.ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG, transparent: true }));
    m.userData = { i, u };
    loader.load(fig.querySelector('.ph-btn').dataset.full, (tex) => {   // full-size file: the strip shows photos large
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      // no colour-space conversion: the shader writes the file's pixel values straight to the screen
      u.uTex.value = tex; u.uImg.value.set(tex.image.width, tex.image.height); u.uLoaded.value = 1;
      m.userData.aspect = tex.image.width / tex.image.height; layout();
    });
    strip.add(m);
    const lab = document.createElement('div');
    lab.className = 'ab-lab';
    lab.innerHTML = `<img src="flags/${fig.dataset.cc}.svg" alt="">${fig.dataset.y ? `<span>${fig.dataset.y}</span>` : ''}`;
    labels.appendChild(lab);
    m.userData.lab = lab;
    return m;
  });

  // all photos share one height; each width follows the photo's own aspect ratio
  let H = 3.4, GAP = 0.45;
  function layout() {
    let x = 0;
    items.forEach((m) => {
      const w = H * (m.userData.aspect || 1.33);
      m.scale.set(w, H, 1); m.userData.u.uPlane.value.set(w, H);
      m.userData.cx = x + w / 2; m.userData.w = w; m.position.x = m.userData.cx; x += w + GAP;
    });
  }
  layout();

  const resize = () => {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
    const narrow = camera.aspect < 0.8;
    // a landscape photo should never be wider than ~84% of the view
    const viewW = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    H = Math.min(2.3, (viewW * 0.62) / 1.33); GAP = narrow ? 0.25 : 0.45; curve.value = narrow ? 0.12 : 0.035;
    layout();
  };
  new ResizeObserver(resize).observe(canvas); resize();

  const cap = document.getElementById('ab-cap'), num = document.getElementById('ab-n'), bar = document.getElementById('ab-bar');
  let active = -1;
  const showCap = (i) => {
    active = i;
    cap.innerHTML = figs[i].querySelector('figcaption').innerHTML;
    cap.classList.toggle('q', figs[i].classList.contains('ab-q'));   // caption still to confirm
    num.textContent = String(i + 1).padStart(2, '0');
    cap.classList.remove('in'); void cap.offsetWidth; cap.classList.add('in');
  };
  onLang(() => { if (active >= 0) showCap(active); });

  // scrolling through the pinned stage picks the photo in the middle; a drag nudges it and springs back
  const progress = () => {
    const rect = stage.getBoundingClientRect(), span = rect.height - window.innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
  };
  let drag = null, dragX = 0, moved = 0, cur = 0, vel = 0, visible = false, hover = -1;
  const toWorld = () => (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect) / canvas.clientWidth;
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, d: dragX }; moved = 0; });
  window.addEventListener('pointermove', (e) => { if (!drag) return; moved = Math.max(moved, Math.abs(e.clientX - drag.x)); dragX = drag.d - (e.clientX - drag.x) * toWorld(); });
  window.addEventListener('pointerup', () => { drag = null; });
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(stage);

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(items)[0];
    return hit ? hit.object.userData.i : -1;
  };
  canvas.addEventListener('pointermove', (e) => { hover = drag ? -1 : pick(e); canvas.style.cursor = drag ? 'grabbing' : hover >= 0 ? 'zoom-in' : 'grab'; });
  canvas.addEventListener('pointerleave', () => { hover = -1; });
  canvas.addEventListener('click', (e) => { if (moved > 6) return; const i = pick(e); if (i >= 0) figs[i].querySelector('.ph-btn').click(); });

  const v = new THREE.Vector3();
  let last = performance.now();
  const loop = (t) => {
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!visible) return;
    const p = progress();
    bar.style.transform = `scaleX(${p})`;
    const first = items[0].userData.cx, lastC = items[n - 1].userData.cx;
    if (!drag) dragX *= Math.exp(-dt * 2.5);
    // the strip rests on each photo for a moment: the first 35% of every step holds, the rest eases on
    const f = p * (n - 1), k = Math.min(n - 2, Math.floor(f)), fr = f - k;
    const e = fr < 0.35 ? 0 : (fr - 0.35) / 0.65, at = p >= 1 ? n - 1 : k + e * e * (3 - 2 * e);
    const ka = Math.floor(at), base = items[ka].userData.cx + (ka < n - 1 ? (items[ka + 1].userData.cx - items[ka].userData.cx) * (at - ka) : 0);
    const target = Math.min(lastC + 1, Math.max(first - 1, base + dragX));
    const prev = cur;
    cur += (target - cur) * (reduced ? 1 : 1 - Math.exp(-dt * 5));
    const speed = dt > 0 ? (cur - prev) / dt : 0;
    vel += (Math.max(-1.6, Math.min(1.6, speed * 0.25)) - vel) * (1 - Math.exp(-dt * 8));
    strip.position.x = -cur;
    strip.updateMatrixWorld();

    let best = 0, bd = Infinity;
    items.forEach((m) => {
      const { i, u, cx, w, lab } = m.userData;
      const off = cx - cur;
      if (Math.abs(off) < bd) { bd = Math.abs(off); best = i; }
      u.uVel.value = reduced ? 0 : vel;
      const on = Math.max(0, 1 - Math.abs(off) / (w * 0.75));
      u.uOn.value += (on - u.uOn.value) * (1 - Math.exp(-dt * 8));
      u.uHover.value += ((hover === i ? 1 : 0) - u.uHover.value) * (1 - Math.exp(-dt * 10));
      // year + flag tag under each photo's lower left corner, following the curve
      v.set(off - w / 2, -H / 2 - 0.16, 0);
      v.z -= v.x * v.x * curve.value;
      v.project(camera);
      const sx = (v.x * 0.5 + 0.5) * canvas.clientWidth, sy = (-v.y * 0.5 + 0.5) * canvas.clientHeight;
      lab.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
      lab.style.opacity = Math.abs(v.x) < 1.05 ? (0.45 + 0.55 * u.uOn.value).toFixed(2) : 0;
    });
    if (best !== active) showCap(best);
    renderer.render(scene, camera);
  };
  requestAnimationFrame(loop);
}
