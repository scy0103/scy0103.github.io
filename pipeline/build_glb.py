"""Step 4: package the extracted meshes for the web.
usage: python pipeline/build_glb.py data/ifc/2023_09.ifc data/work/a_objs.pkl data/work

Outputs (all names, tags, properties and geo coordinates stripped):
  <work>/projectA.raw.glb   one mesh per (layer, colour) bucket, attributes POSITION, NORMAL, _KEY
  <work>/projectA.npz       same geometry for render_zone.py
  <work>/projectA.meta.json stats, clash candidates, reveal histogram (copied to public/model by the compressor)

_KEY is the reveal key per vertex (object centre x normalised 0..1, tank farm = 0, far end = 1).
The site reveals geometry with a shader threshold on _KEY, so compression is free to reorder triangles.
"""
import pickle, json, sys, math, struct, collections
import numpy as np, ifcopenshell, fast_simplification as fs, trimesh

IFC, PKL, W = sys.argv[1], sys.argv[2], sys.argv[3]
objs = pickle.load(open(PKL, "rb"))
f = ifcopenshell.open(IFC)

# system per element (first system)
sysof = {}
for s in f.by_type("IfcSystem"):
    for r in s.IsGroupedBy or []:
        for o in r.RelatedObjects:
            if o.is_a() != "IfcDistributionPort" and o.id() not in sysof: sysof[o.id()] = s.id()

SUPPORT = ("Tube Clamp", "STD PIPE SHOE", "U BAND", "PIPE CHANNEL", "Channel", "M10 ROD")
def layer(o):
    t = o["type"]
    if o["cls"] == "IfcCovering": return "insul"
    if t.startswith("Cable Tray") or o["cls"] == "IfcColumn": return "struct"
    if any(t.startswith(s) for s in SUPPORT): return "support"
    if o["cls"] in ("IfcFlowSegment", "IfcFlowFitting"): return "pipe"
    if o["cls"] == "IfcFlowController": return "valve"
    return "equip"

allv = np.concatenate([o["v"] for o in objs if len(o["v"])])
mn, mx = allv.min(0), allv.max(0); c = (mn + mx) / 2
def conv(v):  # IFC (x,y,z) -> three (y,z,x), recentred, floor at 0. Real-world coordinates are dropped here.
    return np.stack([v[:, 1] - c[1], v[:, 2] - mn[2], v[:, 0] - c[0]], 1)

# system length ranking -> 6 longest systems get colours
syslen = collections.Counter(); seglens = []
for o in objs:
    if o["cls"] == "IfcFlowSegment" and not o["type"].startswith("Cable") and len(o["v"]) > 2:
        p = o["v"] - o["v"].mean(0); ev = np.linalg.svd(p, full_matrices=False)[2][0]; L = float(np.ptp(p @ ev))
        seglens.append(L); sid = sysof.get(o["id"])
        if sid: syslen[sid] += L
colorIdx = {s: i for i, (s, _) in enumerate(syslen.most_common(6))}
print("pipe length m", round(sum(seglens)), "systems", len(syslen), "top", [round(l) for _, l in syslen.most_common(6)])

LIMIT = {"valve": 320, "equip": 320, "support": 90, "insul": 100, "struct": 200}
X0, X1 = -(mx[1] - mn[1]) / 2, (mx[1] - mn[1]) / 2
buckets = collections.defaultdict(list); boxes = []; tris_in = tris_out = 0; keep_big = 0; shade_fail = 0
for o in objs:
    if len(o["f"]) == 0: continue
    L = layer(o); ci = colorIdx.get(sysof.get(o["id"]), 6) if L == "pipe" else -1
    v = conv(o["v"]); fc = o["f"].astype(np.int64); n = len(fc); tris_in += n
    lim = LIMIT.get(L, 140)
    # tank cone bug: large equipment is never simplified (bottom ring collapses to a point otherwise)
    if L == "equip" and float(np.ptp(v, 0).max()) > 1.5: lim = 10**9; keep_big += 1
    if n > lim:
        try:
            v2, f2 = fs.simplify(v.astype(np.float32), fc.astype(np.int32), target_reduction=1 - lim / n)
            if len(f2) > 0: v, fc = v2.astype(np.float64), f2.astype(np.int64)
        except Exception: pass
    m = trimesh.Trimesh(v, fc, process=False)
    try: m = trimesh.graph.smooth_shade(m, angle=math.radians(35))
    except Exception: shade_fail += 1
    tris_out += len(m.faces)
    V = np.asarray(m.vertices, np.float32); F = np.asarray(m.faces, np.uint32); N = np.asarray(m.vertex_normals, np.float32)
    key = float(np.clip((V[:, 0].mean() - X0) / (X1 - X0), 0, 1))
    buckets[(L, ci)].append((key, V, N, F))
    boxes.append((L, sysof.get(o["id"]), V.min(0), V.max(0)))
print("tris in", tris_in, "out", tris_out, "big equip kept", keep_big, "smooth_shade failed", shade_fail)

# ---- GLB writer (no names beyond layer ids, no extras from IFC) ----
PALETTE = ["#4ADE80", "#E879F9", "#22D3EE", "#3B82F6", "#FACC15", "#F97316", "#C9CFD6"]
LAYERCOL = {"valve": "#8B95A3", "equip": "#DADFE5", "support": "#DC2626", "struct": "#E5E7EB", "insul": "#F1F5F9"}
def rgba(h): return [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)] + [1.0]

bin_parts = []; off = 0; views = []; accs = []; meshes = []; nodes = []; mats = []; npz = {}
def add_view(arr, target):
    global off
    b = arr.tobytes(); pad = (-len(b)) % 4
    views.append({"buffer": 0, "byteOffset": off, "byteLength": len(b), "target": target})
    bin_parts.append(b + b"\0" * pad); off += len(b) + pad
    return len(views) - 1
def add_acc(arr, comp, typ, target, mnmx=False):
    a = {"bufferView": add_view(arr, target), "componentType": comp, "count": len(arr), "type": typ}
    if mnmx: a["min"] = arr.min(0).tolist(); a["max"] = arr.max(0).tolist()
    accs.append(a); return len(accs) - 1

for (L, ci), items in sorted(buckets.items()):
    items.sort(key=lambda t: t[0])
    Vs, Ns, Ks, Fs = [], [], [], []; nv = 0
    for key, V, N, F in items:
        Vs.append(V); Ns.append(N); Ks.append(np.full(len(V), key, np.float32)); Fs.append(F + nv); nv += len(V)
    V = np.concatenate(Vs); N = np.concatenate(Ns); K = np.concatenate(Ks); F = np.concatenate(Fs).astype(np.uint32).ravel()
    name = f"{L}_{ci}" if L == "pipe" else L
    col = PALETTE[ci] if L == "pipe" else LAYERCOL[L]
    mats.append({"name": name, "pbrMetallicRoughness": {"baseColorFactor": rgba(col), "metallicFactor": 0.3, "roughnessFactor": 0.5}, "doubleSided": True})
    prim = {"attributes": {"POSITION": add_acc(V, 5126, "VEC3", 34962, True), "NORMAL": add_acc(N, 5126, "VEC3", 34962),
                           "_KEY": add_acc(K, 5126, "SCALAR", 34962)},
            "indices": add_acc(F, 5125, "SCALAR", 34963), "material": len(mats) - 1}
    meshes.append({"name": name, "primitives": [prim]}); nodes.append({"name": name, "mesh": len(meshes) - 1})
    npz[name + "_v"] = V; npz[name + "_f"] = F.reshape(-1, 3)
    print(f"  {name:10s} verts {len(V):8d} tris {len(F)//3:8d}")

gltf = {"asset": {"version": "2.0", "generator": "cysong-portfolio build_glb.py"}, "scene": 0, "scenes": [{"nodes": list(range(len(nodes)))}],
        "nodes": nodes, "meshes": meshes, "materials": mats, "accessors": accs, "bufferViews": views, "buffers": [{"byteLength": off}]}
js = json.dumps(gltf, separators=(",", ":")).encode(); js += b" " * ((-len(js)) % 4)
binb = b"".join(bin_parts)
with open(W + "/projectA.raw.glb", "wb") as fo:
    fo.write(struct.pack("<III", 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(binb)))
    fo.write(struct.pack("<II", len(js), 0x4E4F534A)); fo.write(js)
    fo.write(struct.pack("<II", len(binb), 0x004E4942)); fo.write(binb)
np.savez(W + "/projectA.npz", **npz)

# ---- meta: published counts, clash candidates, reveal histogram ----
gmn = np.min([b[2] for b in boxes], 0); gmx = np.max([b[3] for b in boxes], 0)
stats = {"pipes": sum(1 for o in objs if o["cls"] == "IfcFlowSegment" and not o["type"].startswith("Cable")),
         "fittings": sum(1 for o in objs if o["cls"] == "IfcFlowFitting"),
         "valves": sum(1 for o in objs if layer(o) == "valve"),
         "supports": sum(1 for o in objs if layer(o) == "support"),
         "systems": len(syslen), "pipeLenM": round(sum(seglens)), "size": [round(float(x), 1) for x in (gmx - gmn)]}
pk = np.sort([k for (L, _), it in buckets.items() if L == "pipe" for k, *_ in it])
hist = [round(float(np.searchsorted(pk, q, "right") / len(pk)), 4) for q in np.linspace(0, 1, 101)]
pp = [b for b in boxes if b[0] == "pipe" and b[1]]
lo_ = np.array([b[2] for b in pp]); hi_ = np.array([b[3] for b in pp]); sid = np.array([b[1] for b in pp])
cands = []
for i in range(len(pp)):
    lo = np.maximum(lo_[i], lo_[i + 1:]); hi = np.minimum(hi_[i], hi_[i + 1:])
    ok = np.all(hi > lo, 1) & (sid[i + 1:] != sid[i])
    cands += ((lo[ok] + hi[ok]) / 2).tolist()
cands = np.array(cands); print("crossing candidates", len(cands))
pick = [[round(float(x), 2) for x in cands[np.argmin(np.abs(cands[:, 0] - q))]] for q in np.linspace(cands[:, 0].min(), cands[:, 0].max(), 7)[1:-1]]
eq = [b for b in boxes if b[0] == "equip"]
big = np.array([(b[2] + b[3]) / 2 for b in eq if (b[3] - b[2]).max() > 1.5])
json.dump({"stats": stats, "clashes": pick, "pipeReveal": hist, "equipX": np.round(np.sort(big[:, 0]), 1).tolist(),
           "bounds": {"min": np.round(gmn, 2).tolist(), "max": np.round(gmx, 2).tolist()}},
          open(W + "/projectA.meta.json", "w"), indent=1)
print("raw glb MB", round((len(js) + len(binb)) / 1e6, 1), stats, "clashes", pick)
