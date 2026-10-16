import * as THREE from 'three';
import { OZ, COLORS } from './config.js';
import { revealMaterial, plainMaterial } from './reveal.js';

// Project B: fab hook-up hall rebuilt procedurally from the layout pattern of the coordination captures.
// Not client geometry (stated on sheet 8). Hall 116 x 54 m, 15 m high, columns at 8 m.
const V = (a, b, c) => new THREE.Vector3(a, b, c);

export function createProjectB(scene) {
  const group = new THREE.Group();
  group.visible = false;
  scene.add(group);
  const uReveal = { value: 0 };

  let bk = {};
  const bucket = (n) => bk[n] || (bk[n] = { p: [], nm: [], k: [], ix: [], nv: 0 });
  function put(n, geo, key = 0) {
    const b = bucket(n), p = geo.attributes.position.array, nm = geo.attributes.normal.array, ix = geo.index ? geo.index.array : null;
    for (let i = 0; i < p.length; i++) { b.p.push(p[i]); b.nm.push(nm[i]); }
    for (let i = 0; i < p.length / 3; i++) b.k.push(key);
    if (ix) for (let i = 0; i < ix.length; i++) b.ix.push(ix[i] + b.nv);
    else for (let i = 0; i < p.length / 3; i++) b.ix.push(b.nv + i);
    b.nv += p.length / 3; geo.dispose();
  }
  const box = (n, w, h, d, x, y, z, k) => put(n, new THREE.BoxGeometry(w, h, d).translate(x, y, z), k);
  const cylY = (n, r, h, x, y, z, seg, k) => put(n, new THREE.CylinderGeometry(r, r, h, seg || 16).translate(x, y, z), k);
  const cylX = (n, r, len, x, y, z, k) => put(n, new THREE.CylinderGeometry(r, r, len, 14).rotateZ(Math.PI / 2).translate(x, y, z), k);
  const cylZ = (n, r, len, x, y, z, k) => put(n, new THREE.CylinderGeometry(r, r, len, 14).rotateX(Math.PI / 2).translate(x, y, z), k);
  function clean(pts) {
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) if (pts[i].distanceTo(out[out.length - 1]) > 0.05) out.push(pts[i]);
    const res = [out[0]];
    for (let i = 1; i < out.length - 1; i++) {
      const a = out[i].clone().sub(res[res.length - 1]).normalize(), b = out[i + 1].clone().sub(out[i]).normalize();
      if (a.dot(b) < 0.999) res.push(out[i]);
    }
    res.push(out[out.length - 1]); return res;
  }
  // orthogonal pipe run with bend radius ~3D
  function route(n, r, raw, k) {
    const pts = clean(raw.map((a) => V(a[0], a[1], a[2])));
    const path = new THREE.CurvePath(); let cur = pts[0].clone(); const R = Math.max(0.35, r * 3);
    for (let i = 1; i < pts.length - 1; i++) {
      const a = pts[i - 1], b = pts[i], c = pts[i + 1];
      const d1 = b.clone().sub(a), l1 = d1.length(); d1.normalize();
      const d2 = c.clone().sub(b), l2 = d2.length(); d2.normalize();
      const rr = Math.min(R, l1 / 2.1, l2 / 2.1), p1 = b.clone().addScaledVector(d1, -rr), p2 = b.clone().addScaledVector(d2, rr);
      if (cur.distanceTo(p1) > 1e-3) path.add(new THREE.LineCurve3(cur.clone(), p1));
      path.add(new THREE.QuadraticBezierCurve3(p1, b.clone(), p2)); cur = p2;
    }
    path.add(new THREE.LineCurve3(cur, pts[pts.length - 1].clone()));
    put(n, new THREE.TubeGeometry(path, Math.max(24, Math.round(path.getLength() * 2.2)), r, 8, false), k);
  }

  let seed = 77; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const XA = -58, XB = 58, key = (x) => (x - XA) / (XB - XA);
  let x;
  box('floor', 124, 0.3, 60, 0, -0.15, OZ);
  const colZ = [-27, -9, 9, 27];
  // building frame and roof trusses
  for (x = -56; x <= 56; x += 8) {
    colZ.forEach((cz) => box('steel', 0.6, 15, 0.6, x, 7.5, OZ + cz));
    box('roof', 0.35, 0.9, 56, x, 15.2, OZ);
    for (let j = 0; j < 3; j++) {
      const z0 = -27 + j * 18;
      put('roof', new THREE.BoxGeometry(0.15, 0.15, Math.hypot(18, 1.6)).rotateX(Math.atan2(1.6, 18) * (j % 2 ? 1 : -1)).translate(x, 14.6, OZ + z0 + 9));
    }
  }
  colZ.forEach((cz) => box('roof', 112, 0.6, 0.35, 0, 15.2, OZ + cz));
  // main racks along x at z = -9 and +9
  [-9, 9].forEach((rz) => {
    for (x = -56; x <= 56; x += 8) {
      box('steel', 0.3, 0.3, 6.4, x, 8.2, OZ + rz);
      box('rod', 0.05, 6.6, 0.05, x + 4, 11.6, OZ + rz - 3); box('rod', 0.05, 6.6, 0.05, x + 4, 11.6, OZ + rz + 3);
    }
    box('steel', 112, 0.25, 0.25, 0, 8.2, OZ + rz - 3.1); box('steel', 112, 0.25, 0.25, 0, 8.2, OZ + rz + 3.1);
    [0.42, 0.36, 0.3, 0.3, 0.24, 0.22].forEach((r, k) => cylX('grey', r, 112, 0, 8.35 + r, OZ + rz - 2.5 + k * 1.0));
    for (let i = 0; i < 5; i++) cylX('grey', 0.12, 112, 0, 10.3, OZ + rz - 2 + i * 1.0);
  });
  // cross racks along z
  [-48, -24, 0, 24, 48].forEach((cx) => {
    cylZ('grey', 0.34, 54, cx, 12.2, OZ); cylZ('grey', 0.26, 54, cx + 1.2, 12.2, OZ);
    box('steel', 2.4, 0.25, 0.25, cx + 0.6, 11.8, OZ - 18); box('steel', 2.4, 0.25, 0.25, cx + 0.6, 11.8, OZ + 18);
  });
  // coloured headers (key 0: present from the start of the B chapter)
  [-9, 9].forEach((rz) => {
    const side = rz < 0 ? -1 : 1, edge = OZ + rz;
    cylX('red', 0.14, 112, 0, 7.3, edge - 3.5 * side, 0); cylX('blue', 0.14, 112, 0, 7.3, edge - 3.9 * side, 0);
    cylX('mag', 0.08, 112, 0, 12.8, edge - 4.6 * side, 0);
    for (let q = 0; q < 3; q++) cylX('yel', 0.05, 112, 0, 13.4, edge - (5.2 + q * 0.12) * side, 0);
    for (let hx = -54; hx <= 54; hx += 4) { box('rod', 0.04, 1.6, 0.04, hx, 14.0, edge - 4.6 * side); box('rod', 0.04, 7.6, 0.04, hx, 11.2, edge - 3.7 * side); }
  });
  // tool rows at z = -18, 0, +18, served from the nearest rack
  const tools = [];
  [{ z: -18, rack: -9 }, { z: 0, rack: -9 }, { z: 18, rack: 9 }].forEach((row) => {
    for (x = -52; x <= 52; x += 8) tools.push({ x: x + (rnd() - 0.5) * 0.8, z: row.z, rack: row.rack });
  });
  tools.sort((a, b) => a.x - b.x);
  tools.forEach((t) => {
    const x = t.x, zc = OZ + t.z, k = key(x), side = t.rack < 0 ? -1 : 1, edge = OZ + t.rack;
    box('tool', 5.2, 2.6, 4.2, x, 1.3, zc); box('steel', 5.6, 0.2, 4.6, x, 0.1, zc);
    box('deck', 6.2, 0.15, 5.2, x, 3.25, zc);
    [2.55, -2.55].forEach((oz) => { box('rail', 6.2, 0.06, 0.06, x, 4.35, zc + oz); box('rail', 6.2, 0.05, 0.05, x, 3.8, zc + oz); });
    [3.05, -3.05].forEach((ox) => box('rail', 0.06, 0.06, 5.1, x + ox, 4.35, zc));
    for (let px = -3; px <= 3; px += 1.5) { box('rail', 0.06, 1.1, 0.06, x + px, 3.85, zc + 2.55); box('rail', 0.06, 1.1, 0.06, x + px, 3.85, zc - 2.55); }
    const nv = 1 + Math.floor(rnd() * 2);
    for (let i = 0; i < nv; i++) {
      const vx = x - 1.6 + i * 1.6, vr = 0.45 + rnd() * 0.3, vh = 6 + rnd() * 3.5;
      cylY('tool', vr, vh, vx, vh / 2, zc + 1.1, 20);
      put('tool', new THREE.SphereGeometry(vr, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2).translate(vx, vh, zc + 1.1));
    }
    const mx = x + 1.7, mz = zc - 1.1;
    cylY('tool', 0.62, 1.4, mx, 4.05, mz, 24); cylY('tool', 0.5, 0.3, mx, 4.9, mz, 20);
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; put('tool', new THREE.BoxGeometry(0.04, 1.2, 0.18).translate(0, 0, 0.68).rotateY(a).translate(mx, 4.05, mz)); }
    route('greyS', 0.07, [[x - 1.6, 2.0, zc + 1.1], [x - 1.6, 2.0, zc - 0.6], [x + 0.6, 2.0, zc - 0.6], [x + 0.6, 2.6, zc - 0.6]]);
    const dz = zc + (t.z < t.rack ? 1.6 : -1.6);
    route('red', 0.12, [[x - 0.6, 7.3, edge - 3.5 * side], [x - 0.6, 7.3, dz + 0.3], [x - 0.6, 2.65, dz + 0.3]], k);
    route('blue', 0.12, [[x - 0.25, 7.3, edge - 3.9 * side], [x - 0.25, 7.3, dz + 0.65], [x - 0.25, 2.65, dz + 0.65]], k);
    route('mag', 0.07, [[x + 0.4, 12.8, edge - 4.6 * side], [x + 0.4, 12.8, dz - 0.4], [x + 0.4, 5.2, dz - 0.4], [x + 1.1, 5.2, dz - 0.4], [x + 1.1, 4.4, dz - 0.4]], k);
    for (let i = 0; i < 3; i++) {
      const yx = x - 2.2 + i * 0.35;
      route('yel', 0.045, [[yx, 13.4, edge - (5.2 + i * 0.12) * side], [yx, 13.4, zc - 1.9], [yx, 4.6, zc - 1.9], [yx + 0.5, 4.6, zc - 1.9], [yx + 0.5, 3.4, zc - 1.9]], k);
    }
  });

  const B = COLORS.b;
  const MB = {
    floor: plainMaterial('#8C939B', { roughness: 0.9, metalness: 0 }), steel: plainMaterial(B.steel, { roughness: 0.6 }),
    roof: plainMaterial(B.steel, { roughness: 0.6 }),
    deck: plainMaterial('#A6ACB3', { roughness: 0.7 }), rail: plainMaterial('#D9DDE1'),
    tool: plainMaterial('#D7DBE0', { metalness: 0.35, roughness: 0.35 }), grey: plainMaterial(B.grey, { metalness: 0.5, roughness: 0.3 }),
    greyS: plainMaterial('#C5C9CE', { metalness: 0.5, roughness: 0.3 }), rod: plainMaterial('#9AA1A9'),
    red: revealMaterial(B.red, uReveal, { roughness: 0.35 }), blue: revealMaterial(B.blue, uReveal, { roughness: 0.35 }),
    mag: revealMaterial(B.mag, uReveal, { roughness: 0.35 }), yel: revealMaterial(B.yel, uReveal, { roughness: 0.35 }),
  };
  let tris = 0, roof = null;
  Object.keys(bk).forEach((n) => {
    const b = bk[n], g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(b.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(b.nm, 3));
    g.setAttribute('_key', new THREE.Float32BufferAttribute(b.k, 1));
    g.setIndex(b.nv > 65535 ? new THREE.Uint32BufferAttribute(b.ix, 1) : new THREE.Uint16BufferAttribute(b.ix, 1));
    tris += b.ix.length / 3;
    const mesh = new THREE.Mesh(g, MB[n]);
    if (n === 'roof') roof = mesh;
    group.add(mesh);
  });
  bk = null;
  return { group, roof, tris, setReveal: (r) => { uReveal.value = r; } };
}
