#!/usr/bin/env python3
"""
Novera Studio - Signet-Generator fuer Finanzberatung Rieken.

Bildmarke: eine 12-zaehlige Guilloche-Rosette. Die Guilloche ist das
Sicherheitsmuster auf Policen, Urkunden und Wertpapieren - also genau auf
den Dokumenten, mit denen diese Marke arbeitet. Damit ist das Signet
inhaltlich begruendet und nicht dekorativ.
"""
import math, os
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "logo")
os.makedirs(OUT, exist_ok=True)

def f(v): return f"{v:.2f}".rstrip('0').rstrip('.')

def rose_ring(cx, cy, radius, amp, k, phase, steps=720):
    pts = []
    for i in range(steps + 1):
        th = i / steps * 2 * math.pi
        r = radius + amp * math.cos(k * th + phase)
        pts.append((cx + r * math.cos(th), cy + r * math.sin(th)))
    return "M" + " L".join(f"{f(x)},{f(y)}" for x, y in pts) + " Z"

def signet_fine(size=200, color="#14332C", core="#A9722A", rings=9,
                k=12, fname="signet-fine.svg", stroke=1.15):
    c = size / 2
    R = size * 0.435
    body = []
    for i in range(rings):
        t = i / (rings - 1)
        rad = R * (1 - 0.46 * t)
        amp = R * 0.115 * (1 - 0.35 * t)
        ph = t * math.pi / k * 1.9
        op = 0.95 - 0.32 * t
        body.append(f'<path d="{rose_ring(c, c, rad, amp, k, ph)}" fill="none" '
                    f'stroke="{color}" stroke-width="{f(stroke)}" stroke-opacity="{op:.2f}"/>')
    body.append(f'<circle cx="{f(c)}" cy="{f(c)}" r="{f(size*0.052)}" fill="{core}"/>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
           f'width="{size}" height="{size}" role="img" aria-label="Signet Finanzberatung Rieken">'
           + "".join(body) + "</svg>")
    open(os.path.join(OUT, fname), "w").write(svg)
    return fname

def signet_solid(size=200, color="#14332C", core="#F2EDE4", k=12,
                 fname="signet-solid.svg"):
    """Kompaktfassung: greift ab 16 px noch, fuer Favicon, Stempel, Social."""
    c = size / 2
    R = size * 0.415
    outer = rose_ring(c, c, R * 0.94, R * 0.115, k, 0)
    inner = rose_ring(c, c, R * 0.50, R * 0.062, k, 0)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
           f'width="{size}" height="{size}" role="img" aria-label="Signet Finanzberatung Rieken">'
           f'<path d="{outer}" fill="{color}"/>'
           f'<path d="{inner}" fill="{core}"/>'
           f'<circle cx="{f(c)}" cy="{f(c)}" r="{f(size*0.105)}" fill="{color}"/>'
           f'</svg>')
    open(os.path.join(OUT, fname), "w").write(svg)
    return fname

made = []
# Primaerfassung
made.append(signet_fine(color="#14332C", core="#A9722A", fname="signet-fine-tanne.svg"))
made.append(signet_solid(color="#14332C", core="#F2EDE4", fname="signet-solid-tanne.svg"))
# Invers (auf dunklem Grund)
made.append(signet_fine(color="#E8DFCD", core="#C89551", fname="signet-fine-invers.svg"))
made.append(signet_solid(color="#E8DFCD", core="#14332C", fname="signet-solid-invers.svg"))
# Messing
made.append(signet_fine(color="#A9722A", core="#14332C", fname="signet-fine-messing.svg"))
# Einfarbig schwarz (Fax, Stempel, Presse)
made.append(signet_fine(color="#14171A", core="#14171A", fname="signet-fine-mono.svg"))
made.append(signet_solid(color="#14171A", core="#FFFFFF", fname="signet-solid-mono.svg"))
print("\n".join(made))
