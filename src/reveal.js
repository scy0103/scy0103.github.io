import * as THREE from 'three';

// Standard material that discards fragments whose per-vertex _key is above a shared threshold.
// Every object carries one constant key (its position along the run), so objects appear whole, in order.
export function revealMaterial(hex, uniform, opts = {}) {
  const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), metalness: 0.25, roughness: 0.5, side: THREE.DoubleSide, ...opts });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uReveal = uniform;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float _key;\nvarying float vKey;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvKey = _key;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uReveal;\nvarying float vKey;')
      .replace('void main() {', 'void main() {\n  if (vKey > uReveal + 0.0005) discard;');
  };
  m.customProgramCacheKey = () => 'reveal';
  return m;
}

export function plainMaterial(hex, opts = {}) {
  return new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), metalness: 0.25, roughness: 0.5, side: THREE.DoubleSide, ...opts });
}
