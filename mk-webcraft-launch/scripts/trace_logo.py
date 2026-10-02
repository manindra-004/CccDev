"""Trace the official MK Webcraft logo (public/images/mk-logo.png) into SVG paths.

Outputs src/logo/mkLogoPaths.ts with:
  - parts: the two letterform silhouettes (M, and the ribbon/K form) used for
    stroke draw-on, clipping, glow and light sweeps
  - tones: stacked luminance layers (dark -> bright) with their sampled brand
    colours, which recreate the glossy gradient look as pure vectors

Requires: python3, numpy, pillow, scipy and the `potrace` CLI.
Run: npm run logo   (or: python3 scripts/trace_logo.py)
"""

import os
import re
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "images", "mk-logo.png")
OUT = os.path.join(ROOT, "src", "logo", "mkLogoPaths.ts")
SCALE = 3
TONE_THRESHOLDS = [150, 176, 200, 220, 238]
HIGHLIGHT_MIN_CHANNEL = 150

TOKEN = re.compile(r"[MmLlCcZz]|-?\d*\.?\d+(?:e[-+]?\d+)?")


def smooth_mask(values: np.ndarray, radius: float, threshold: float) -> np.ndarray:
    img = Image.fromarray(values.clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=radius * SCALE))
    return np.asarray(img).astype(np.float32) >= threshold


def potrace_paths(mask: np.ndarray, size: int, turd: int = 40, opt: float = 1.0) -> list[str]:
    """Trace a boolean mask (at SCALE x resolution) into absolute SVG subpaths in 1x units."""
    h, w = mask.shape
    with tempfile.TemporaryDirectory() as tmp:
        pbm = os.path.join(tmp, "m.pbm")
        svg = os.path.join(tmp, "m.svg")
        Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).convert("1").save(pbm)
        subprocess.run(
            ["potrace", pbm, "-b", "svg", "-o", svg, "-t", str(turd), "-a", "1.0", "-O", str(opt)],
            check=True,
        )
        text = open(svg, encoding="utf-8").read()

    ds = re.findall(r'<path d="([^"]+)"', text, re.S)
    sx, sy, ty = 0.1 / SCALE, -0.1 / SCALE, h / SCALE

    subpaths: list[str] = []
    for d in ds:
        toks = TOKEN.findall(d.replace("\n", " "))
        i = 0
        cx = cy = 0.0
        start = (0.0, 0.0)
        cmd = None
        cur: list[str] = []

        def num() -> float:
            nonlocal i
            v = float(toks[i])
            i += 1
            return v

        def fmt(x: float, y: float) -> str:
            return f"{x * sx:.1f} {y * sy + ty:.1f}"

        while i < len(toks):
            t = toks[i]
            if re.fullmatch(r"[MmLlCcZz]", t):
                cmd = t
                i += 1
                if cmd in "Zz":
                    cur.append("Z")
                    subpaths.append(" ".join(cur))
                    cur = []
                    cx, cy = start
                continue
            if cmd in ("M", "m"):
                x, y = num(), num()
                if cmd == "m":
                    x, y = cx + x, cy + y
                cx, cy = x, y
                start = (x, y)
                cur = [f"M{fmt(x, y)}"]
                cmd = "l" if cmd == "m" else "L"
            elif cmd in ("L", "l"):
                x, y = num(), num()
                if cmd == "l":
                    x, y = cx + x, cy + y
                cx, cy = x, y
                cur.append(f"L{fmt(x, y)}")
            elif cmd in ("C", "c"):
                pts = [num() for _ in range(6)]
                if cmd == "c":
                    pts = [cx + pts[0], cy + pts[1], cx + pts[2], cy + pts[3], cx + pts[4], cy + pts[5]]
                cx, cy = pts[4], pts[5]
                cur.append(f"C{fmt(pts[0], pts[1])} {fmt(pts[2], pts[3])} {fmt(pts[4], pts[5])}")
            else:
                raise ValueError(f"Unexpected token {t}")
        if cur:
            subpaths.append(" ".join(cur))
    return subpaths


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    size = im.width
    big = im.resize((size * SCALE, size * SCALE), Image.LANCZOS)
    arr = np.asarray(big).astype(np.float32)
    alpha = arr[..., 3] / 255.0
    rgb = arr[..., :3]

    silhouette = smooth_mask(alpha * 255.0, 0.7, 128)
    labels, count = ndimage.label(silhouette)
    sizes = ndimage.sum(silhouette, labels, range(1, count + 1))
    keep = [i + 1 for i, s in enumerate(sizes) if s > 2000 * SCALE * SCALE]
    keep.sort(key=lambda lab: np.where(labels == lab)[1].min())
    names = ["m", "ribbon"]

    parts = []
    for name, lab in zip(names, keep):
        comp = labels == lab
        ys, xs = np.where(comp)
        parts.append(
            {
                "id": name,
                "d": " ".join(potrace_paths(comp, size, turd=80, opt=0.8)),
                "bbox": [float(xs.min() / SCALE), float(ys.min() / SCALE), float(xs.max() / SCALE), float(ys.max() / SCALE)],
            }
        )
    body = np.isin(labels, keep)

    lum_raw = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    lum = np.asarray(
        Image.fromarray(lum_raw.clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.4 * SCALE))
    ).astype(np.float32)

    tones = []
    bands = [0] + TONE_THRESHOLDS + [256]
    for lo, hi in zip(bands[:-1], bands[1:]):
        band = body & (lum >= lo) & (lum < hi) & (alpha > 0.9)
        if band.sum() < 50:
            continue
        colour = "#%02x%02x%02x" % tuple(int(round(c)) for c in np.median(rgb[band], axis=0))
        if lo == 0:
            base_colour = colour
            continue
        d = " ".join(potrace_paths(body & (lum >= lo), size, turd=120, opt=1.4))
        tones.append({"threshold": lo, "color": colour, "d": d})

    min_channel = rgb.min(axis=2) * (alpha > 0.9)
    highlight = smooth_mask(min_channel, 0.45, HIGHLIGHT_MIN_CHANNEL) & body
    highlight_colour = np.median(rgb[highlight], axis=0)
    highlight_d = " ".join(potrace_paths(highlight, size, turd=30, opt=0.6))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("// Generated by scripts/trace_logo.py from public/images/mk-logo.png. Do not edit by hand.\n\n")
        f.write(f"export const LOGO_VIEWBOX = {{ width: {size}, height: {size} }};\n\n")
        f.write("export type LogoPart = { id: string; d: string; bbox: [number, number, number, number] };\n")
        f.write("export type LogoTone = { threshold: number; color: string; d: string };\n\n")
        f.write("export const LOGO_PARTS: LogoPart[] = [\n")
        for p in parts:
            bb = ", ".join(f"{v:.1f}" for v in p["bbox"])
            f.write(f"  {{ id: '{p['id']}', bbox: [{bb}], d: '{p['d']}' }},\n")
        f.write("];\n\n")
        f.write(f"export const LOGO_BASE_COLOR = '{base_colour}';\n\n")
        f.write("export const LOGO_TONES: LogoTone[] = [\n")
        for t in tones:
            f.write(f"  {{ threshold: {t['threshold']}, color: '{t['color']}', d: '{t['d']}' }},\n")
        f.write("];\n\n")
        hc = "#%02x%02x%02x" % tuple(int(round(c)) for c in highlight_colour)
        f.write(f"export const LOGO_HIGHLIGHT = {{ color: '{hc}', d: '{highlight_d}' }};\n")

    print(f"parts={len(parts)} tones={len(tones)} -> {OUT}")
    for p in parts:
        print("part", p["id"], len(p["d"]))
    for t in tones:
        print("tone", t["threshold"], t["color"], len(t["d"]))
    print("highlight", len(highlight_d))


if __name__ == "__main__":
    main()
