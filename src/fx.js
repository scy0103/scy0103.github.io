// 3D FX sample (loaded only with ?fx=1): cinematic hero over the real Project A model with bloom,
// a scanning light, rising particles, a scroll-driven blueprint grid behind every section,
// 3D card tilt with glare, a custom cursor, and split-letter headings.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { COLORS } from './config.js';
import { lang, onLang } from './i18n.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = window.matchMedia('(hover: none)').matches;
const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function heroMarkup() {
  const sec = document.createElement('section');
  sec.id = 'fx-hero';
  sec.setAttribute('aria-label', 'Intro');
  sec.innerHTML = `
    <div class="fx-title">
      <p class="fx-k" data-en="Plant piping design · overseas site PL" data-ko="플랜트 배관 설계 · 해외 현장 PL"></p>
      <h1 class="fx-name" aria-label="Jacob Song"><span class="fx-split">JACOB</span><span class="fx-split hl">SONG</span></h1>
      <p class="fx-sub" data-en="13 years · 8 countries · 2,039 m of pipe in this model" data-ko="13년 · 8개국 · 이 모델의 배관 2,039 m"></p>
      <div class="fx-cta">
        <a class="btn accent big" href="#career" data-en="See my career" data-ko="경력 보기"></a>
        <a class="btn ghost big" href="#contact" data-en="Contact me" data-ko="연락하기"></a>
        <span class="status-chip" data-en="Open to offers · start date negotiable" data-ko="포지션 제안 받는 중 · 입사 시기 협의 가능"></span>
      </div>
    </div>
    <a class="fx-cue" href="#top"><span data-en="Scroll" data-ko="스크롤"></span><i></i></a>`;
  document.getElementById('main').prepend(sec);
  sec.querySelectorAll('[data-en]').forEach((el) => { el.textContent = el.getAttribute('data-' + lang); });
  return sec;
}

// split text into per-letter spans (re-run after a language switch rewrites the text)
function split(el) {
  const txt = el.textContent;
  el.setAttribute('aria-label', txt);
  // letters animate one by one, but each word stays unbreakable so Korean never wraps mid-word
  let i = 0;
  el.innerHTML = txt.split(' ').map((w) => `<span class="fx-w">${[...w].map((c) => `<span class="fx-ch" aria-hidden="true" style="--i:${i++}">${c}</span>`).join('')}</span>`).join(' ');
}

function initSplitHeadings() {
  const heads = [...document.querySelectorAll('.fx-split, .t2-h, #sm-h, .cd-col h2, #ct-h > span, #wk-h > span, #sk-h > span')];
  const run = () => heads.forEach(split);
  run(); onLang(() => requestAnimationFrame(run));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add('fx-in'); }), { rootMargin: '0px 0px -10% 0px' });
  heads.forEach((h) => io.observe(h));
}

function initTilt() {
  if (touch || reduced) return;
  const els = document.querySelectorAll('.dash .card:not(.c-globe):not(.c-model)'); // dashboard only; reading sections stay still
  els.forEach((el) => {
    el.classList.add('fx-tilt');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      const k = Math.min(1, 380 / Math.max(r.width, r.height)) * 9;
      el.style.setProperty('--rx', `${((0.5 - y) * k).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((x - 0.5) * k).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });
}

function initCursor() {
  if (touch) return;
  const ring = document.createElement('div');
  ring.className = 'fx-ring';
  document.body.append(ring); // the system cursor stays visible; the ring only follows it
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    ring.classList.toggle('big', !!e.target.closest('a, button, .card, .lg, .ph-btn, .rd-ax, .in-legend li, summary'));
  });
  const loop = () => { rx += (x - rx) * 0.18; ry += (y - ry) * 0.18; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); };
  loop();
}

// soft round sprite for the dust
function dotTex() {
  const c = document.createElement('canvas'); c.width = c.height = 32;
  const g = c.getContext('2d'), r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.4, 'rgba(255,255,255,.5)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

// One fixed WebGL canvas: the hero model with bloom, then a blueprint grid and dust behind the page.
function initStage(A) {
  const canvas = document.createElement('canvas');
  canvas.id = 'fx-canvas'; canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); } catch (e) { return; }
  const mobile = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const BG = new THREE.Color('#0A1424');
  scene.background = BG; scene.fog = new THREE.Fog(BG, 90, 260);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 900);
  // studio reflections so the stainless tanks read as metal
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  scene.add(new THREE.HemisphereLight(0xbcd3f0, 0x0a1424, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-80, 120, 60); scene.add(key);
  const scanLight = new THREE.PointLight(0xff7a1a, 900, 60, 1.6); scene.add(scanLight);

  // model: dark steel with coloured lines kept, so bloom catches the scan and the orange lines
  const model = new THREE.Group(); scene.add(model);
  const lineCols = [...COLORS.lines, '#8FA3BC'];
  const mats = {
    pipe: lineCols.map((c) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.4, roughness: 0.35, emissive: c, emissiveIntensity: 0.18 })),
    equip: new THREE.MeshStandardMaterial({ color: 0x9fb2c8, metalness: 0.85, roughness: 0.28 }),
    valve: new THREE.MeshStandardMaterial({ color: 0x6f8099, metalness: 0.7, roughness: 0.35 }),
    support: new THREE.MeshStandardMaterial({ color: 0xff7a1a, metalness: 0.3, roughness: 0.5, emissive: 0xff7a1a, emissiveIntensity: 0.35 }),
    struct: new THREE.MeshStandardMaterial({ color: 0x51647e, metalness: 0.6, roughness: 0.5 }),
  };
  if (A) A.loaded.then(() => {
    const m = A.model.clone(true);
    m.traverse((o) => {
      if (!o.isMesh) return;
      const [l, ci] = o.name.split('_');
      if (l === 'insul') { o.visible = false; return; }
      o.material = l === 'pipe' ? mats.pipe[+ci] : mats[l];
    });
    model.add(m);
  }).catch(() => {});

  // scan: an orange band of light that sweeps the plant inside the materials themselves
  const uScan = { value: -999 };
  Object.values(mats).flat().forEach((m) => {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uScan = uScan;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vWX;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWX = (modelMatrix * vec4(transformed, 1.0)).x;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uScan;\nvarying float vWX;')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\nfloat sd = abs(vWX - uScan);\ntotalEmissiveRadiance += vec3(1.0, 0.48, 0.1) * (smoothstep(3.5, 0.0, sd) * 2.2 + smoothstep(14.0, 0.0, sd) * 0.25);');
    };
    m.customProgramCacheKey = () => 'fx-scan';
  });

  // blueprint floor grid that runs to the horizon
  const grid = new THREE.GridHelper(1600, 320, 0x2c4c78, 0x16294a); grid.position.y = -0.05; scene.add(grid);
  const grid2 = new THREE.GridHelper(1600, 32, 0x3d6aa3, 0x3d6aa3); grid2.position.y = -0.04; grid2.material.transparent = true; grid2.material.opacity = 0.5; scene.add(grid2);

  // dust: slow rising particles, additive
  const N = mobile ? 900 : 2200, pos = new Float32Array(N * 3), spd = new Float32Array(N);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 320; pos[i * 3 + 1] = Math.random() * 70; pos[i * 3 + 2] = (Math.random() - 0.5) * 200; spd[i] = 0.4 + Math.random(); }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ map: dotTex(), alphaTest: 0.01, color: 0x9cc0ff, size: mobile ? 0.7 : 0.55, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.9, 0.55, 0.62);
  composer.addPass(bloom); composer.addPass(new OutputPass());

  const resize = () => { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.fov = w < 760 ? 52 : 38; camera.updateProjectionMatrix(); };
  addEventListener('resize', resize); resize();

  let mx = 0, my = 0, sx = 0, sy = 0;
  addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  const clock = new THREE.Clock(), tgt = new THREE.Vector3();
  const loop = () => {
    requestAnimationFrame(loop);
    if (document.body.classList.contains('in-story')) { canvas.style.opacity = 0; return; } // the 3D story owns the screen
    canvas.style.opacity = 1;
    const t = clock.getElapsedTime(), vh = innerHeight, y = scrollY;
    const hero = y / vh;               // 0 at the top, 1 once the hero has scrolled away
    const deep = y / (vh * 6);         // slow drift for the rest of the page
    sx += (mx - sx) * 0.05; sy += (my - sy) * 0.05;
    const a = (reduced ? 0.6 : t * 0.06) + sx * 0.6;
    const r = THREE.MathUtils.lerp(112, 60, sm(0, 1.1, hero));
    camera.position.set(Math.cos(a) * r, THREE.MathUtils.lerp(44, 22, sm(0, 1.1, hero)) - sy * 10 + deep * 20, Math.sin(a) * r * 0.75 - deep * 40);
    tgt.set(-6, 2 - deep * 8, -deep * 40);
    camera.lookAt(tgt);
    // the model belongs to the hero; afterwards only the grid and the dust stay
    const mv = 1 - sm(0.45, 0.95, hero);
    model.visible = mv > 0.01; scanLight.intensity = 900 * mv;
    const sxp = ((t * 22) % 190) - 95; // sweep along the 156 m plant
    uScan.value = sxp; scanLight.position.set(sxp, 9, 6);
    bloom.strength = 0.5 + 0.5 * mv;
    const p = dg.attributes.position.array;
    if (!reduced) for (let i = 0; i < N; i++) { p[i * 3 + 1] += spd[i] * 0.03; if (p[i * 3 + 1] > 70) p[i * 3 + 1] = 0; }
    dg.attributes.position.needsUpdate = true;
    composer.render();
  };
  loop();
}

export function initFx(A) {
  document.documentElement.classList.add('fx');
  heroMarkup();
  initStage(A);
  initSplitHeadings();
  initTilt();
  initCursor();
}
