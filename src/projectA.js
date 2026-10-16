import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { COLORS } from './config.js';
import { revealMaterial } from './reveal.js';

// Project A: the real Revit CESS model, converted by pipeline/build_glb.py + tools/compress_glb.mjs
export function createProjectA(scene, onProgress) {
  const group = new THREE.Group();
  scene.add(group);
  const uReveal = { value: 0 };
  const lineMats = COLORS.lines.map((c) => revealMaterial(c, uReveal, { roughness: 0.4 }))
    .concat([revealMaterial(COLORS.otherLine, uReveal, { metalness: 0.4, roughness: 0.4 })]);
  const layerMats = {
    valve: revealMaterial(COLORS.valve, uReveal),
    equip: revealMaterial(COLORS.equip, uReveal, { metalness: 0.4, roughness: 0.38 }),
    support: revealMaterial(COLORS.support, uReveal, { roughness: 0.55 }),
    struct: revealMaterial(COLORS.struct, uReveal),
    insul: new THREE.MeshStandardMaterial({ color: COLORS.insul, metalness: 0, roughness: 0.9, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
  };
  const api = { group, ready: false, meta: null, clashes: [], insulMat: layerMats.insul, insulMeshes: [] };

  const base = import.meta.env.BASE_URL;
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  api.loaded = Promise.all([
    fetch(base + 'model/projectA.meta.json').then((r) => r.json()),
    new Promise((res, rej) => loader.load(base + 'model/projectA.glb', res,
      (e) => { if (e.total) onProgress(e.loaded / e.total); }, rej)),
  ]).then(([meta, gltf]) => {
    api.meta = meta;
    const meshes = [];
    gltf.scene.traverse((o) => { if (o.isMesh) meshes.push(o); });
    meshes.forEach((o) => {
      const [layer, ci] = o.name.split('_');
      o.material = layer === 'pipe' ? lineMats[+ci] : layerMats[layer];
      if (layer === 'insul') { o.renderOrder = 2; api.insulMeshes.push(o); }
      if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
    });
    group.add(gltf.scene);
    meta.clashes.forEach((p) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1.1, 18, 12),
        new THREE.MeshBasicMaterial({ color: 0xf87171, wireframe: true, transparent: true, opacity: 0, depthTest: false }));
      m.position.set(p[0], p[1], p[2]); m.renderOrder = 5; group.add(m); api.clashes.push(m);
    });
    api.ready = true;
  });

  api.setReveal = (r) => { uReveal.value = r; };
  // share of pipe objects shown at reveal r (histogram from the build step)
  api.pipeShown = (r) => (api.meta ? api.meta.pipeReveal[Math.max(0, Math.min(100, Math.floor(r * 100 + 1e-6)))] : 0);
  return api;
}
