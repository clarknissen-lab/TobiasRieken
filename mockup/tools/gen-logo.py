#!/usr/bin/env python3
"""
Finanzberatung Rieken — Signet-Entwuerfe.
Monogramm TR. Motiv: die Praegung — Muenze, Siegel, Urkunde.
Rund, ruhig, warm. Kein Schild, kein Schloss: Absicherung soll
willkommen wirken, nicht wie eine Alarmanlage.
"""
import base64, os
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "logo")
os.makedirs(OUT, exist_ok=True)

FONT = "Playfair, Georgia, serif"

# Die Schrift wird in jede Datei eingebettet. Ohne das greift ein SVG,
# das ueber <img> geladen wird, auf eine Systemschrift zurueck.
_woff = os.path.join(os.path.dirname(__file__), "..", "assets", "fonts",
                     "playfair-display-latin-wght-normal.woff2")
_b64 = base64.b64encode(open(_woff, "rb").read()).decode()
FONTDEF = ("<defs><style>@font-face{font-family:'Playfair';font-weight:400 900;"
           "src:url(data:font/woff2;base64," + _b64 + ") format('woff2-variations');}"
           "</style></defs>")

def seal(fname, ring="#0D2440", ink="#0D2440", gold="#C4A05C", bg=None, size=200):
    """Entwurf A — Praegung. Doppelring, Monogramm, zwei feine Punkte."""
    c = size / 2
    back = f'<circle cx="{c}" cy="{c}" r="{c}" fill="{bg}"/>' if bg else ''
    return _write(fname, f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}"
 width="{size}" height="{size}" role="img" aria-label="Tobias Rieken Finanzberatung">{FONTDEF}
{back}
  <circle cx="{c}" cy="{c}" r="{c*0.955}" fill="none" stroke="{ring}" stroke-width="{size*0.014}"/>
  <circle cx="{c}" cy="{c}" r="{c*0.845}" fill="none" stroke="{gold}" stroke-width="{size*0.0055}"/>
  <text x="{c}" y="{c}" fill="{ink}" font-family="{FONT}" font-weight="500"
        font-size="{size*0.42}" letter-spacing="{size*0.012}"
        text-anchor="middle" dominant-baseline="central">TR</text>
  <circle cx="{c}" cy="{c*0.145}" r="{size*0.017}" fill="{gold}"/>
  <circle cx="{c}" cy="{size - c*0.145}" r="{size*0.017}" fill="{gold}"/>
</svg>''')

def coin(fname, ink="#0D2440", gold="#C4A05C", size=200):
    """Entwurf B — Muenze im Anschnitt. Voll gepraegt, greift sehr klein."""
    c = size / 2
    return _write(fname, f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}"
 width="{size}" height="{size}" role="img" aria-label="Tobias Rieken Finanzberatung">{FONTDEF}
  <circle cx="{c}" cy="{c}" r="{c}" fill="{ink}"/>
  <circle cx="{c}" cy="{c}" r="{c*0.86}" fill="none" stroke="{gold}" stroke-width="{size*0.007}" opacity=".85"/>
  <text x="{c}" y="{c}" fill="#FBF8F3" font-family="{FONT}" font-weight="500"
        font-size="{size*0.42}" letter-spacing="{size*0.012}"
        text-anchor="middle" dominant-baseline="central">TR</text>
</svg>''')

def arc(fname, ink="#0D2440", gold="#C4A05C", size=200):
    """Entwurf C — ohne Fassung. Monogramm mit steigender Linie darunter:
       Absicherung heute, Aufbau morgen. Modern, ohne Rahmen."""
    c = size / 2
    return _write(fname, f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}"
 width="{size}" height="{size}" role="img" aria-label="Tobias Rieken Finanzberatung">{FONTDEF}
  <text x="{c}" y="{c*0.90}" fill="{ink}" font-family="{FONT}" font-weight="500"
        font-size="{size*0.50}" letter-spacing="{size*0.012}"
        text-anchor="middle" dominant-baseline="central">TR</text>
  <path d="M {c*0.20} {size*0.775} L {c*0.80} {size*0.700} L {c*1.20} {size*0.740} L {size-c*0.20} {size*0.600}"
        fill="none" stroke="{gold}" stroke-width="{size*0.024}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M {c*0.20} {size*0.855} H {size-c*0.20}" stroke="{ink}" stroke-width="{size*0.008}" stroke-linecap="round" opacity=".28"/>
</svg>''')

def _write(fname, svg):
    open(os.path.join(OUT, fname), "w").write(svg)
    return fname

made = [
    seal("signet-a-seal.svg"),
    seal("signet-a-seal-invers.svg", ring="#F1E6D2", ink="#FBF8F3", gold="#D9B979"),
    coin("signet-b-coin.svg"),
    coin("signet-b-coin-invers.svg", ink="#F1E6D2", gold="#0D2440"),
    arc("signet-c-arc.svg"),
    arc("signet-c-arc-invers.svg", ink="#F1E6D2", gold="#D9B979"),
]
print("\n".join(made))
