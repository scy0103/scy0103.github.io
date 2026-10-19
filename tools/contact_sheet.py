"""Tile chapter screenshots into one image per viewport: python tools/contact_sheet.py shots en"""
import sys, glob, os
from PIL import Image, ImageDraw
root, lang = sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "en"
for view, w, cols in (("desktop", 560, 3), ("mobile", 240, 6)):
    files = sorted(glob.glob(f"{root}/{view}/{lang}-[0-9]*.png"))
    if not files: continue
    ims = [Image.open(f).convert("RGB") for f in files]
    h = round(ims[0].height * w / ims[0].width)
    rows = -(-len(ims) // cols)
    sheet = Image.new("RGB", (cols * w, rows * h), "black")
    for i, (im, f) in enumerate(zip(ims, files)):
        x, y = (i % cols) * w, (i // cols) * h
        sheet.paste(im.resize((w, h), Image.LANCZOS), (x, y))
        ImageDraw.Draw(sheet).rectangle([x, y, x + 110, y + 16], fill="black")
        ImageDraw.Draw(sheet).text((x + 4, y + 2), os.path.basename(f)[3:-4], fill="yellow")
    sheet.save(f"{root}/sheet_{view}_{lang}.png")
