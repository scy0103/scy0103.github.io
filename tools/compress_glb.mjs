// Step 4b: data/work/projectA.raw.glb -> public/model/projectA.glb (quantized + EXT_meshopt_compression)
// Triangle order is irrelevant to the site (reveal runs on the _KEY attribute), so any meshopt reordering is safe.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { quantize, reorder, prune, dedup } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import { copyFileSync, statSync } from 'node:fs';

const SRC = 'data/work/projectA.raw.glb', DST = 'public/model/projectA.glb';
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(SRC);
await doc.transform(
  dedup(), prune(),
  reorder({ encoder: MeshoptEncoder, target: 'size' }),
  // 16-bit positions over ~156 m = 2.4 mm steps; _KEY keeps 12 bits (0..1 normalised)
  quantize({ quantizePosition: 16, quantizeNormal: 10, quantizeGeneric: 12 }),
);
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });
await io.write(DST, doc);
copyFileSync('data/work/projectA.meta.json', 'public/model/projectA.meta.json');
console.log('raw', (statSync(SRC).size / 1e6).toFixed(1), 'MB ->', (statSync(DST).size / 1e6).toFixed(1), 'MB');
