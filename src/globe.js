import * as THREE from 'three';
import { feature } from 'topojson-client';
import land110 from 'world-atlas/land-110m.json';
import { SITES } from './content.js';
import { lang, onLang } from './i18n.js';

// Dotted globe with a pin on every project site. It tours the sites on its own (the caption follows),
// can be dragged, and the list underneath focuses a site for keyboard and screen-reader users.
const $ = (id) => document.getElementById(id);
const toVec = (lat, lon, r = 1) => {
  const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
};

// rasterise the land polygons into an equirectangular mask, then keep the sphere points that fall on land
function landMask(W = 720, H = 360) {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.fillStyle = '#fff';
  const geo = feature(land110, land110.objects.land);
  const rings = geo.features ? geo.features.flatMap((f) => f.geometry.coordinates) : geo.geometry.coordinates;
  const X = (lon) => (lon + 180) / 360 * W, Y = (lat) => (90 - lat) / 180 * H;
  rings.forEach((poly) => {
    [0, -W, W].forEach((off) => {
      g.beginPath();
      poly.forEach((ring) => {
        let prev = null, shift = 0;
        ring.forEach(([lon, lat], i) => {
          if (prev !== null && Math.abs(lon - prev) > 180) shift += lon < prev ? 360 : -360; // unwrap across the antimeridian
          prev = lon;
          const x = X(lon + shift) + off, y = Y(lat);
          if (i) g.lineTo(x, y); else g.moveTo(x, y);
        });
        g.closePath();
      });
      g.fill('evenodd');
    });
  });
  const d = g.getImageData(0, 0, W, H).data;
  return (lat, lon) => d[(Math.min(H - 1, Math.floor(Y(lat))) * W + Math.min(W - 1, Math.floor(X(lon)))) * 4] > 128;
}

export function initGlobe() {
  const canvas = $('globe');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { canvas.parentElement.classList.add('no-gl'); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.matchMedia('(max-width:760px)').matches ? 1.5 : 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50); camera.position.set(0, 0, 5.2);
  const world = new THREE.Group(); scene.add(world);

  // ocean sphere with a soft rim so the silhouette reads on the dark card
  world.add(new THREE.Mesh(new THREE.SphereGeometry(0.995, 64, 48), new THREE.ShaderMaterial({
    uniforms: { uA: { value: new THREE.Color(0.06, 0.11, 0.19) }, uB: { value: new THREE.Color(0.3, 0.42, 0.58) } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 uA; uniform vec3 uB; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.-max(dot(vN,vV),0.),2.4); vec3 c = mix(uA, uB, f); gl_FragColor = vec4(c,1.); }',
  })));

  // land dots on a Fibonacci lattice
  const isLand = landMask();
  const N = 22000, pos = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, lat = Math.asin(y) * 180 / Math.PI, lon = ((i * 137.50776) % 360) - 180;
    if (isLand(lat, lon)) { const v = toVec(lat, lon, 1.0); pos.push(v.x, v.y, v.z); }
  }
  const dotGeo = new THREE.BufferGeometry(); dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const dpr = renderer.getPixelRatio();
  world.add(new THREE.Points(dotGeo, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uSize: { value: 2.2 * dpr }, uC: { value: new THREE.Color(0.85, 0.91, 0.97) } },
    vertexShader: 'uniform float uSize; varying float vF; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vec3 n = normalize(normalMatrix*position); vF = clamp(dot(n, normalize(-mv.xyz))*1.6, 0., 1.); gl_PointSize = uSize; gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 uC; varying float vF; void main(){ vec2 p = gl_PointCoord-.5; if(dot(p,p)>.25) discard; gl_FragColor = vec4(uC, 0.25+0.7*vF); }',
  })));

  // pins: a short spike, a head, and a pulse ring; arcs from Seoul to each site
  const red = new THREE.Color('#FF7A1A'); // safety orange
  const pinMat = new THREE.MeshBasicMaterial({ color: red });
  const dimMat = new THREE.MeshBasicMaterial({ color: 0xeaf0f6 });
  const ringGeo = new THREE.RingGeometry(0.028, 0.036, 32);
  // invisible, larger spheres make the pins easy to hover
  const hitGeo = new THREE.SphereGeometry(0.075, 10, 8);
  const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const pins = [];
  SITES.forEach((s) => {
    const n = toVec(s.lat, s.lon, 1).normalize();
    const g = new THREE.Group(); g.position.copy(n);
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    const spike = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.09, 6).translate(0, 0.045, 0), s.now ? pinMat : dimMat);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8).translate(0, 0.09, 0), pinMat);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: red, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.002;
    const hit = new THREE.Mesh(hitGeo, hitMat); hit.position.y = 0.08; hit.userData.i = pins.length;
    g.add(spike, head, ring, hit); world.add(g);
    const pin = { g, ring, n, hit }; pins.push(pin); return pin;
  });
  const home = toVec(37.55, 126.99, 1);
  const arcMat = new THREE.LineBasicMaterial({ color: red, transparent: true, opacity: 0.55 });
  const arcs = SITES.map((s) => {
    const b = toVec(s.lat, s.lon, 1), mid = home.clone().add(b).multiplyScalar(0.5);
    const h = 1 + home.distanceTo(b) * 0.35;
    const curve = new THREE.QuadraticBezierCurve3(home, mid.normalize().multiplyScalar(h), b);
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)); geo.setDrawRange(0, 0);
    const line = new THREE.Line(geo, arcMat); world.add(line); return line;
  });

  // caption + list
  const place = $('g-place'), name = $('g-name'), yr = $('g-yr'), list = $('g-list');
  let cur = 0, pauseUntil = 0;
  const caption = () => {
    const s = SITES[cur], k = lang === 'ko' ? 1 : 0;
    place.textContent = s.p[k]; name.textContent = s.n[k]; yr.textContent = s.y;
    list.querySelectorAll('li').forEach((li, i) => li.classList.toggle('on', i === cur));
  };
  onLang(caption);

  // orientation: rotate the world so the current site faces the camera, slightly above centre
  const qTarget = new THREE.Quaternion(), qDrag = new THREE.Quaternion();
  const focus = (i) => {
    cur = (i + SITES.length) % SITES.length; caption();
    const n = pins[cur].n.clone();
    const want = new THREE.Vector3(0, 0.32, 1).normalize();
    qTarget.setFromUnitVectors(n, want);
    arcs.forEach((a, j) => { a.userData.on = j === cur; });
  };
  $('g-prev').addEventListener('click', () => { focus(cur - 1); pauseUntil = performance.now() + 9000; });
  $('g-next').addEventListener('click', () => { focus(cur + 1); pauseUntil = performance.now() + 9000; });

  // hover a pin to read it; click or tap a pin to bring it to the front; drag the globe to spin it
  const tip = $('g-tip'), card = canvas.parentElement;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), tmpV = new THREE.Vector3(), camDir = new THREE.Vector3();
  let hover = -1;
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(pins.map((p) => p.hit), false);
    for (const h of hits) {
      const p = pins[h.object.userData.i];
      p.hit.getWorldPosition(tmpV); camDir.copy(camera.position).sub(tmpV);
      const nW = p.n.clone().applyQuaternion(world.quaternion);
      if (nW.dot(camDir) > 0) return h.object.userData.i; // only pins on the visible side
    }
    return -1;
  };
  const showTip = (i, e) => {
    if (i < 0) { tip.hidden = true; return; }
    const s = SITES[i], k = lang === 'ko' ? 1 : 0, cr = card.getBoundingClientRect();
    const img = s.img ? `<img src="gallery/g${String(s.img).padStart(2, '0')}_s.jpg" alt="">` : '';
    tip.innerHTML = `${img}<b>${s.p[k]}</b><span>${s.n[k]}</span><em>${s.y}</em>`;
    tip.hidden = false;
    const x = e.clientX - cr.left, y = e.clientY - cr.top, w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.min(cr.width - w - 12, Math.max(12, x + 16)) + 'px';
    tip.style.top = Math.min(cr.height - h - 12, Math.max(12, y - h / 2)) + 'px';
  };
  const setHover = (i, e) => {
    if (i !== hover) {
      hover = i;
      canvas.style.cursor = i >= 0 ? 'pointer' : '';
      if (i >= 0) { cur = i; caption(); arcs.forEach((a, j) => { a.userData.on = j === i; }); }
    }
    showTip(i, e);
    pauseUntil = i >= 0 ? Infinity : Math.min(pauseUntil, performance.now() + 4000);
  };
  let drag = null, spin = 0, moved = 0;
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; moved = 0; canvas.setPointerCapture(e.pointerId); pauseUntil = Infinity; });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) { if (e.pointerType === 'mouse') setHover(pick(e), e); return; }
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x: e.clientX, y: e.clientY }; moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 4) { tip.hidden = true; hover = -1; }
    qDrag.setFromEuler(new THREE.Euler(dy * 0.006, dx * 0.006, 0));
    world.quaternion.premultiply(qDrag); qTarget.copy(world.quaternion);
  });
  const end = (e) => {
    if (!drag) return;
    drag = null;
    if (moved <= 4) { const i = pick(e); if (i >= 0) { focus(i); showTip(i, e); } } // a tap or click on a pin
    pauseUntil = performance.now() + 6000;
  };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', () => { drag = null; });
  canvas.addEventListener('pointerleave', (e) => { if (!drag && e.pointerType === 'mouse') setHover(-1, e); });

  // zoom: mouse wheel over the globe, or the +/- buttons (1 = whole globe fits the card)
  let baseZ = 5, zoom = 1;
  const camLook = new THREE.Vector3();
  const setZoom = (z) => { zoom = Math.min(1.5, Math.max(0.55, z)); };
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); setZoom(zoom * Math.exp(e.deltaY * 0.0012)); }, { passive: false });
  $('g-in').addEventListener('click', () => setZoom(zoom / 1.25));
  $('g-out').addEventListener('click', () => setZoom(zoom * 1.25));
  const resize = () => {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height;
    // fit the sphere to the card and push it right on wide cards so the caption sits beside it
    const fitH = 1.08 / Math.tan(15 * Math.PI / 180), fitW = fitH / Math.min(1, camera.aspect);
    baseZ = Math.max(fitH, fitW) * 1.32; camera.position.z = baseZ * zoom;
    world.position.x = camera.aspect > 1.15 ? 0.42 : 0; world.position.y = camera.aspect > 1.15 ? -0.02 : 0.12;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas); resize();
  let visible = false;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(canvas);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SNAP = new URLSearchParams(location.search).has('snap');
  focus(0); world.quaternion.copy(qTarget);
  let next = 0, lastT = 0;
  const qSpin = new THREE.Quaternion(), yAxis = new THREE.Vector3(0, 1, 0), tmpN = new THREE.Vector3();
  const loop = (t) => {
    requestAnimationFrame(loop);
    if (!visible) return;
    const dt = Math.min(0.05, (t - (lastT || t)) / 1000); lastT = t;
    if (!drag && !SNAP && t > pauseUntil && hover < 0) {
      // idle: turn slowly around the poles and caption whichever site faces the viewer
      qSpin.setFromAxisAngle(yAxis, dt * (reduced ? 0.06 : 0.12));
      world.quaternion.multiply(qSpin); qTarget.copy(world.quaternion);
      if (t > next) {
        let best = -2, bi = cur;
        pins.forEach((p, i) => { const d = tmpN.copy(p.n).applyQuaternion(world.quaternion).z; if (d > best) { best = d; bi = i; } });
        if (bi !== cur) { cur = bi; caption(); arcs.forEach((a, j) => { a.userData.on = j === cur; }); }
        next = t + 600;
      }
    } else if (!drag) world.quaternion.slerp(qTarget, reduced ? 1 : 0.045);
    // zooming in moves the camera toward the site in focus (hovered pin, else the current one)
    const f = pins[hover >= 0 ? hover : cur].hit.getWorldPosition(tmpV);
    const k = Math.min(1, Math.max(0, (1 - zoom) / 0.45));
    camLook.set(f.x * k, f.y * k, 0);
    camera.position.set(camLook.x, camLook.y, baseZ * zoom); camera.lookAt(camLook);
    spin = (spin + 0.016) % 1;
    pins.forEach((p, i) => {
      const k = i === cur ? (spin * 1.0) : 0;
      p.ring.scale.setScalar(1 + k * 3); p.ring.material.opacity = i === cur ? 1 - spin : 0.35;
      const sc = i === hover ? 1.6 : 1; p.g.scale.x += (sc - p.g.scale.x) * 0.25; p.g.scale.z = p.g.scale.y = p.g.scale.x;
    });
    arcs.forEach((a) => {
      const n = a.geometry.attributes.position.count, d = a.geometry.drawRange.count;
      const want = a.userData.on ? n : 0;
      if (d !== want) a.geometry.setDrawRange(0, d < want ? Math.min(want, d + 3) : Math.max(0, d - 4));
    });
    renderer.render(scene, camera);
  };
  requestAnimationFrame(loop);
}
