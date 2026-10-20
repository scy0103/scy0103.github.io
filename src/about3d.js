import * as THREE from 'three';
import { onLang } from './i18n.js';

// About me as a walk-through gallery: the photos hang in 3D space, staggered left and right along a
// corridor, and scrolling the pinned section moves the camera down it, oldest photo first.
// The bento grid stays in the DOM as the no-WebGL fallback and as the source for captions and the lightbox.
export function initAbout3d() {
  const sec = document.getElementById('about'), stage = document.getElementById('ab-stage');
  const canvas = document.getElementById('ab-gl'), grid = document.getElementById('ab-grid');
  if (!sec || !stage || !canvas || !grid) return;
  const figs = [...grid.querySelectorAll('.ab-ph')];
  const n = figs.length;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
  stage.hidden = false;
  sec.classList.add('ab-3d');
  stage.style.setProperty('--n', n);

  const mobile = window.matchMedia('(max-width:760px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile.matches ? 1.5 : 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 80);
  const GAP = 6;            // corridor distance between photos
  const VIEW = 5.6;         // distance at which a photo is 'in front of you' and turns to face the camera
  const START = VIEW;       // camera z at the first photo
  const loader = new THREE.TextureLoader();

  // one framed plane per photo; the frame is a slightly larger plane behind it that turns orange when active
  const frames = figs.map((fig, i) => {
    const g = new THREE.Group();
    const side = i % 2 ? 1 : -1;
    g.userData = { i, side, z: -i * GAP, y: 0.45 + (i % 3 - 1) * 0.25 };
    const mat = new THREE.MeshBasicMaterial({ color: 0x1a2a40, transparent: true });
    const ph = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xeaf0f6, transparent: true }));
    back.position.z = -0.01;
    g.add(back, ph);
    g.userData.parts = { ph, back };
    const size = (aspect) => {
      const h = 2.2, w = h * aspect;
      ph.scale.set(w, h, 1); back.scale.set(w + 0.1, h + 0.1, 1);
      g.userData.w = w;
    };
    size(1);
    const src = fig.querySelector('img').getAttribute('src');
    loader.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true;
      size(tex.image.width / tex.image.height); place();
    });
    scene.add(g);
    return g;
  });

  // drifting dust gives the corridor depth between the photos
  const dustN = 500, pos = new Float32Array(dustN * 3);
  for (let k = 0; k < dustN; k++) {
    pos[k * 3] = (Math.random() - 0.5) * 16;
    pos[k * 3 + 1] = (Math.random() - 0.5) * 9;
    pos[k * 3 + 2] = START + 4 - Math.random() * (n * GAP + 12);
  }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x9fc3ea, size: 0.035, transparent: true, opacity: 0.6, depthWrite: false }));
  scene.add(dust);

  // floor grid lines running down the corridor, in the blueprint style of the rest of the site
  const floor = new THREE.GridHelper(n * GAP + 30, Math.round((n * GAP + 30) / 1.5), 0x2b4466, 0x1a2c46);
  floor.position.set(0, -2.6, -(n * GAP) / 2 + 2);
  floor.material.transparent = true; floor.material.opacity = 0.5;
  scene.add(floor);

  let spread = 1.9;
  function place() {
    frames.forEach((g) => {
      const { side, z, y, w } = g.userData;
      g.userData.x = side * (spread + (w || 2.2) / 2 - 0.5);       // resting spot at the corridor wall
      g.userData.cx = spread < 1 ? 0 : side * Math.min(spread * 0.45, 0.9);         // nearer the middle while it is the one you look at
      g.position.set(g.userData.x, y, z);
      g.rotation.y = -side * 0.42;
    });
  }

  const cap = document.getElementById('ab-cap'), num = document.getElementById('ab-n'), bar = document.getElementById('ab-bar');
  let active = -1;
  const showCap = (i) => {
    active = i;
    const fc = figs[i].querySelector('figcaption');
    cap.innerHTML = `<img class="ab-flag" src="flags/${figs[i].dataset.cc}.svg" alt="">` + fc.innerHTML;
    num.textContent = String(i + 1).padStart(2, '0');
    cap.classList.remove('in'); void cap.offsetWidth; cap.classList.add('in');
  };
  onLang(() => { if (active >= 0) showCap(active); });

  const resize = () => {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.fov = camera.aspect < 0.8 ? 68 : 50;
    camera.updateProjectionMatrix();
    spread = camera.aspect < 0.8 ? 0.55 : camera.aspect < 1.3 ? 1.3 : 1.9;
    place();
  };
  new ResizeObserver(resize).observe(canvas); resize();

  // scroll progress through the pinned stage -> camera z
  const progress = () => {
    const rect = stage.getBoundingClientRect(), span = rect.height - window.innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
  };
  const endZ = -(n - 1) * GAP + VIEW;
  let camZ = START, mx = 0, my = 0, px = 0, py = 0, visible = false, hover = -1;
  sec.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1; my = -(((e.clientY - r.top) / r.height) * 2 - 1);
  });
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(stage);

  // clicking a photo opens the same lightbox as the grid (ui.js listens on the grid buttons)
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(frames.map((g) => g.userData.parts.ph))[0];
    return hit && hit.object.material.opacity > 0.3 ? hit.object.parent.userData.i : -1;
  };
  canvas.addEventListener('pointermove', (e) => { hover = pick(e); canvas.style.cursor = hover >= 0 ? 'zoom-in' : ''; });
  canvas.addEventListener('pointerleave', () => { hover = -1; });
  canvas.addEventListener('click', (e) => { const i = pick(e); if (i >= 0) figs[i].querySelector('.ph-btn').click(); });

  const WHITE = new THREE.Color(0xeaf0f6), ORANGE = new THREE.Color(0xff7a1a);
  let last = performance.now();
  const loop = (t) => {
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!visible) return;
    const p = progress();
    bar.style.transform = `scaleX(${p})`;
    // the walk pauses at each photo: the first ~40% of every step holds still, the rest eases to the next
    const f = p * (n - 1), k = Math.min(n - 2, Math.floor(f)), fr = f - k;
    const e = fr < 0.4 ? 0 : (fr - 0.4) / 0.6, step = k + e * e * (3 - 2 * e);
    const target = p >= 1 ? endZ : -step * GAP + VIEW;
    camZ += (target - camZ) * (reduced ? 1 : 1 - Math.exp(-dt * 6));
    px += (mx - px) * (1 - Math.exp(-dt * 3)); py += (my - py) * (1 - Math.exp(-dt * 3));
    const par = reduced ? 0 : 1;
    camera.position.set(px * 0.6 * par, 0.25 + py * 0.35 * par, camZ);
    camera.lookAt(px * 0.25 * par, py * 0.15 * par, camZ - 6);

    // the photo the camera is approaching is the active one: it turns to face the viewer and lights up
    let best = 0, bestD = Infinity;
    frames.forEach((g) => {
      const { i, side, z } = g.userData, d = camZ - z;   // distance in front of the camera
      if (Math.abs(d - VIEW) < bestD) { bestD = Math.abs(d - VIEW); best = i; }
      const near = Math.max(0, 1 - Math.abs(d - VIEW) / 3);
      const face = near * near;
      g.rotation.y += ((-side * 0.42) * (1 - face) - g.rotation.y) * (1 - Math.exp(-dt * 5));
      g.position.x += (g.userData.x + (g.userData.cx - g.userData.x) * face - g.position.x) * (1 - Math.exp(-dt * 5));
      const lift = (hover === i ? 0.12 : 0) + face * 0.06;
      g.scale.setScalar(g.scale.x + (1 + lift - g.scale.x) * (1 - Math.exp(-dt * 6)));
      // fade in from the dark ahead, fade out once passed
      const op = d < 1.2 ? Math.max(0, (d - 0.2) / 1) : Math.min(1, Math.max(0, 1 - (d - 12) / 10));
      const { ph, back } = g.userData.parts;
      ph.material.opacity = op; back.material.opacity = op * 0.9;
      back.material.color.lerpColors(WHITE, ORANGE, Math.max(face, hover === i ? 1 : 0));
      g.visible = op > 0.01;
    });
    if (best !== active) showCap(best);
    dust.rotation.z = t * 0.00002;
    renderer.render(scene, camera);
  };
  requestAnimationFrame(loop);
}
