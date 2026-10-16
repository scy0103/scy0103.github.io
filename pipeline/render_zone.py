"""Step 5: shaded iso render of one x-zone, to check geometry without a browser.
usage: python pipeline/render_zone.py data/work out.png x0 x1
"""
import sys, numpy as np, matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
from matplotlib.collections import PolyCollection
W, out = sys.argv[1], sys.argv[2]; x0, x1 = float(sys.argv[3]), float(sys.argv[4])
d = np.load(W + "/projectA.npz")
PAL = ["#4ADE80", "#E879F9", "#22D3EE", "#3B82F6", "#FACC15", "#F97316", "#C9CFD6"]
LC = {"valve": "#8B95A3", "equip": "#DADFE5", "support": "#DC2626", "struct": "#E5E7EB"}
def rgb(h): return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)]) / 255
a = np.radians(40); e = np.radians(30); L = np.array([-0.4, 0.8, 0.45]); L /= np.linalg.norm(L)
P = []; C = []; D = []
for name in sorted({k[:-2] for k in d.files}):
    if name == "insul": continue
    V = d[name + "_v"]; F = d[name + "_f"].astype(int); T = V[F]
    cx = T[:, :, 0].mean(1); T = T[(cx > x0) & (cx < x1)]
    if not len(T): continue
    n = np.cross(T[:, 1] - T[:, 0], T[:, 2] - T[:, 0]); n /= np.linalg.norm(n, axis=1, keepdims=True) + 1e-9
    sh = 0.45 + 0.55 * np.abs(n @ L)
    base = rgb(PAL[int(name.split("_")[1])]) if name.startswith("pipe") else rgb(LC[name])
    x, y, z = T[..., 0], T[..., 1], T[..., 2]
    X = x * np.cos(a) - z * np.sin(a); Dp = x * np.sin(a) + z * np.cos(a); Y = y * np.cos(e) + Dp * np.sin(e)
    P.append(np.stack([X, Y], -1)); C.append(np.clip(base[None] * sh[:, None], 0, 1)); D.append(Dp.mean(1))
P = np.concatenate(P); C = np.concatenate(C); D = np.concatenate(D); o = np.argsort(-D)
fig, ax = plt.subplots(figsize=(14, 9), dpi=110); ax.set_facecolor("#1F2631")
ax.add_collection(PolyCollection(P[o], facecolors=C[o], edgecolors="none")); ax.autoscale(); ax.set_aspect("equal"); ax.axis("off")
plt.savefig(out, bbox_inches="tight", facecolor="#1F2631"); print(len(P), "tris drawn")
