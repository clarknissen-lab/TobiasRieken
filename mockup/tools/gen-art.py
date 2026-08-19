#!/usr/bin/env python3
"""
Novera Studio – Bildsprache-Generator
Erzeugt Guilloche-Gravuren (Rosetten, Wellenbaender, Ornamente) als SVG.

Warum: Versicherung, Police, Urkunde, Wertpapier - die Guilloche ist das
historische Sicherheitsmerkmal genau dieser Dokumente. Sie gibt der Marke
eine eigene, thematisch begruendete Bildsprache statt Stock-Illustrationen.
"""
import math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "art")
os.makedirs(OUT, exist_ok=True)

def fmt(v):
    return f"{v:.1f}".rstrip('0').rstrip('.')

def path_from(points):
    d = "M" + " L".join(f"{fmt(x)},{fmt(y)}" for x, y in points)
    return d + " Z"

def hypotrochoid(cx, cy, R, r, d, steps=900, rot=0.0, scale=1.0):
    pts = []
    g = math.gcd(int(R), int(r)) or 1
    turns = int(r / g)
    for i in range(steps + 1):
        t = (i / steps) * 2 * math.pi * turns
        x = (R - r) * math.cos(t) + d * math.cos((R - r) / r * t)
        y = (R - r) * math.sin(t) - d * math.sin((R - r) / r * t)
        x, y = x * scale, y * scale
        ca, sa = math.cos(rot), math.sin(rot)
        pts.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
    return pts

def rosette(size=900, layers=26, R=13, r=5, d=7.4, base=0.985, stroke=0.55,
            color="#14332C", opacity=0.5, fname="rosette.svg"):
    """Konzentrisch geschachtelte Rosette - der Kern des Motivs."""
    cx = cy = size / 2
    body = []
    unit = (size / 2) / (R - r + d)
    for i in range(layers):
        f = base ** i
        sc = unit * f
        rot = i * 0.028
        pts = hypotrochoid(cx, cy, R, r, d, steps=760, rot=rot, scale=sc)
        op = opacity * (0.35 + 0.65 * (1 - i / layers))
        body.append(f'<path d="{path_from(pts)}" fill="none" stroke="{color}" '
                    f'stroke-width="{fmt(stroke)}" stroke-opacity="{op:.3f}"/>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
           f'width="{size}" height="{size}">' + "".join(body) + "</svg>")
    open(os.path.join(OUT, fname), "w").write(svg)
    return fname

def wave_band(w=1600, h=180, lines=34, color="#14332C", opacity=0.42,
              stroke=0.5, fname="band.svg", f1=3.0, f2=7.0, f3=11.0, taper=True):
    """Interferenz-Wellenband - Trenner zwischen den Sektionen."""
    body = []
    for i in range(lines):
        p = i / max(lines - 1, 1)
        amp = (h * 0.30) * (1 - abs(p - 0.5) * 1.1 if taper else 1)
        ph = p * math.pi * 2
        pts = []
        for s in range(int(w / 2) + 1):
            x = s * 2
            u = x / w * math.pi * 2
            y = (h / 2
                 + amp * 0.62 * math.sin(f1 * u + ph)
                 + amp * 0.26 * math.sin(f2 * u - ph * 1.6)
                 + amp * 0.14 * math.sin(f3 * u + ph * 0.4))
            pts.append((x, y))
        d = "M" + " L".join(f"{fmt(x)},{fmt(y)}" for x, y in pts)
        op = opacity * (0.30 + 0.70 * math.sin(math.pi * p))
        body.append(f'<path d="{d}" fill="none" stroke="{color}" '
                    f'stroke-width="{fmt(stroke)}" stroke-opacity="{op:.3f}"/>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
           f'width="{w}" height="{h}" preserveAspectRatio="none">' + "".join(body) + "</svg>")
    open(os.path.join(OUT, fname), "w").write(svg)
    return fname

def engraved_field(w=1200, h=1600, lines=150, color="#0E2621", opacity=0.5,
                   stroke=0.6, fname="field.svg", amp=26, f1=2.0, f2=5.0):
    """Flaechengravur fuer Bildplatzhalter / dunkle Sektionen."""
    body = []
    for i in range(lines):
        p = i / (lines - 1)
        y0 = p * h
        pts = []
        for s in range(0, int(w) + 1, 6):
            u = s / w * math.pi * 2
            y = (y0
                 + amp * math.sin(f1 * u + p * 9.0)
                 + amp * 0.42 * math.sin(f2 * u - p * 5.0))
            pts.append((s, y))
        d = "M" + " L".join(f"{fmt(x)},{fmt(yy)}" for x, yy in pts)
        body.append(f'<path d="{d}" fill="none" stroke="{color}" '
                    f'stroke-width="{fmt(stroke)}" stroke-opacity="{opacity:.3f}"/>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
           f'width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice">'
           + "".join(body) + "</svg>")
    open(os.path.join(OUT, fname), "w").write(svg)
    return fname

def guilloche_seal(size=320, color="#B0762B", opacity=0.85, fname="seal.svg"):
    """Kleines Siegel-Ornament fuer Zertifikat/Registernummer."""
    cx = cy = size / 2
    body = []
    unit = (size / 2) / (11 - 4 + 6)
    for i in range(9):
        sc = unit * (0.99 ** i)
        pts = hypotrochoid(cx, cy, 11, 4, 6, steps=520, rot=i * 0.05, scale=sc)
        body.append(f'<path d="{path_from(pts)}" fill="none" stroke="{color}" '
                    f'stroke-width="0.7" stroke-opacity="{opacity*(1-i/12):.3f}"/>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
           f'width="{size}" height="{size}">' + "".join(body) + "</svg>")
    open(os.path.join(OUT, fname), "w").write(svg)
    return fname

made = []
made.append(rosette(size=1000, layers=30, R=13, r=5, d=7.4, base=0.975, stroke=0.6,
                    color="#14332C", opacity=0.55, fname="rosette-ink.svg"))
made.append(rosette(size=1000, layers=30, R=13, r=5, d=7.4, base=0.975, stroke=0.6,
                    color="#E8DFCD", opacity=0.42, fname="rosette-light.svg"))
made.append(rosette(size=1000, layers=22, R=17, r=6, d=8.6, base=0.968, stroke=0.65,
                    color="#B0762B", opacity=0.55, fname="rosette-brass.svg"))
made.append(wave_band(w=1800, h=200, lines=38, color="#14332C", opacity=0.40,
                      fname="band-ink.svg"))
made.append(wave_band(w=1800, h=200, lines=38, color="#D8CDB6", opacity=0.55,
                      fname="band-light.svg"))
made.append(wave_band(w=1800, h=120, lines=22, color="#B0762B", opacity=0.5,
                      f1=4.0, f2=9.0, f3=15.0, fname="band-brass.svg"))
made.append(engraved_field(w=1000, h=1400, lines=78, color="#5C9683", opacity=0.30,
                           stroke=0.9, fname="field-dark.svg", amp=46, f1=2.0, f2=5.0))
made.append(engraved_field(w=1000, h=1400, lines=78, color="#A8916B", opacity=0.42,
                           stroke=0.9, fname="field-paper.svg", amp=40, f1=3.0, f2=7.0))
made.append(guilloche_seal())
print("\n".join(made))
