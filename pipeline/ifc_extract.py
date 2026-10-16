"""Step 2: per-object mesh extraction with the IfcOpenShell geom iterator.
usage: python pipeline/ifc_extract.py data/ifc/2023_09.ifc data/work/a_objs.pkl
"""
import ifcopenshell, ifcopenshell.geom as geom, numpy as np, sys, time, pickle, multiprocessing

src, out = sys.argv[1], sys.argv[2]
f = ifcopenshell.open(src)
s = geom.settings()
s.set("use-world-coords", True)
s.set("weld-vertices", True)
for k, v in [("mesher-linear-deflection", 0.01), ("mesher-angular-deflection", 0.6)]:
    try: s.set(k, v)
    except Exception: pass
it = geom.iterator(s, f, multiprocessing.cpu_count())
objs = []; t = time.time()
if it.initialize():
    while True:
        sh = it.get(); el = f.by_id(sh.id); g = sh.geometry
        objs.append({"id": sh.id, "cls": el.is_a(), "type": (el.ObjectType or "").split(":")[0],
                     "v": np.array(g.verts, dtype=np.float64).reshape(-1, 3),
                     "f": np.array(g.faces, dtype=np.int32).reshape(-1, 3)})
        if len(objs) % 500 == 0: print(len(objs), round(time.time() - t), "s", flush=True)
        if not it.next(): break
pickle.dump(objs, open(out, "wb"))
print("done", len(objs), round(time.time() - t, 1), "s")
