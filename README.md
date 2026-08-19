# Finanzberatung Rieken — Webseiten-Konzept

Entwurf von **Novera Studio** für Tobias Rieken, Versicherungsmakler in Hannover.
Onepager, Marke und Redaktionsbereich.

**Ergebnis:** [`Novera-Studio_Webkonzept_Finanzberatung-Rieken.pdf`](Novera-Studio_Webkonzept_Finanzberatung-Rieken.pdf)
— 24 Seiten, 16:9, bildgeführt.

---

## Leitidee — „Seriös im Blau, warm im Ton“

Finanzberatung lebt vom Vertrauen. Tiefes Blau trägt die Seriosität, eine warme
Cremeebene nimmt ihm die Kälte, Gold führt zu dem einen Knopf, der zählt. Wer
hier liest, soll sich gut aufgehoben fühlen — nicht wie in einer Bankfiliale.

| | |
|---|---|
| **Blau** | `#0B2039` Nachtblau · `#153860` Tiefblau · `#2C6BB8` Signalblau · `#EEF5FC` Lichtblau |
| **Creme** | `#FDFBF7` · `#F8F2E8` |
| **Gold** | `#C4A05C` |
| **Tinte** | `#14202E` |
| **Schrift** | Fraunces (Auszeichnung) · Inter (Lesetext und Beschriftung) — beide SIL OFL |

Die Abschnitte wechseln bewusst zwischen warm, hell-kühl und dunkel. Der Blick
bekommt Pausen, beim Scrollen wird es nicht langweilig, und die Übergänge
trennen dezent statt hart.

**Zur Helligkeit des Blaus:** Auftakt und Terminblock bleiben am tiefsten — dort
sitzt die Eleganz. Der große Schwerpunkt-Abschnitt „Für Beamte“ ist bewusst
heller (`#123156` mit Lichtverlauf), damit drei dunkle Blöcke die Seite nicht
erdrücken. Das gibt zusätzlich Tiefenstaffelung, ohne eine neue Farbe zu brauchen.

**Fraunces statt einer klassischen Didone:** weiche Ecken (`SOFT 45`), gerade
Formen (`WONK 0`). Seriös genug für Finanzen, freundlich genug, dass sich
niemand eingeschüchtert fühlt.

## Logo — Monogramm TR

Drei Entwürfe liegen zur Wahl (Seite 17 im PDF). Motiv ist die **Prägung** —
Münze, Siegel, Urkunde. Rund und ruhig statt Schild und Schloss: Absicherung
soll willkommen wirken, nicht wie eine Alarmanlage.

| | |
|---|---|
| **A · Siegel** *(Empfehlung)* | Doppelring mit zwei goldenen Punkten. Am wärmsten, am edelsten. |
| **B · Münze** | Voll geprägt, greift noch bei 16 px — Favicon, Profilbild, Stempel. |
| **C · ohne Fassung** | Monogramm mit steigender Linie. Moderner, offener. |

Die Schrift ist in jede SVG-Datei eingebettet; die Dateien greifen also auch
dort, wo Playfair nicht installiert ist. Für den finalen Satz sollten die
Buchstaben noch in Pfade umgewandelt werden.

## Zahlen, die jeder versteht

Zwei Erklärgrafiken statt Zahlenkosmetik:

1. **Vorher / Nachher** — elf Verträge gegen sechs, mit grünen Marken für die
   Ersparnis daneben. Niemand muss rechnen.
2. **Die Beihilfelücke** — ein Balken für 70 zu 30 und ein Satz in Klartext:
   „Kostet die Behandlung 1.000 €, zahlst Du 300 €.“ Darunter Haken und Kreuze
   statt Fachjargon.

Beide sind als Beispiel gekennzeichnet.

## Überzeugen statt behaupten

Ein eigener Abschnitt **„Bevor Du fragst“** nimmt die Einwände vorweg, an denen
Termine sonst scheitern:

- Die **Kostenfrage** steht ganz oben und wird offen beantwortet — inklusive
  der Vergütung über die Gesellschaft. Das ist der häufigste Grund, warum jemand
  doch nicht bucht.
- Darunter **sechs Fragen**, die im Erstgespräch ohnehin kommen: Unterlagen,
  Verpflichtung, Online-Termin, bestehender Berater, Unterschied zum Vertreter,
  Wartezeit.
- Dazu drei Zusagen direkt unter dem Auftakt: kein Verkauf im ersten Termin,
  schriftliche Empfehlung, für Dich kostenlos.

## Am Telefon liest niemand Blöcke

Auf Mobil bekommt jeder Einleitungstext eine goldene Kante und wird kleiner — er
liest sich dann als Zwischenruf, nicht als Absatz. Knöpfe stehen untereinander
statt gequetscht nebeneinander, Karten sind deutlich getrennt, die Texte selbst
sind durchgehend gekürzt.

## Termine laufen über Calendly

Kein eigenes Terminraster auf der Seite. Ein Knopf, ein Kalender — der, den
Tobias ohnehin pflegt. Entsprechend gibt es im Redaktionsbereich **keine
Anfragenverwaltung**: Ein eigener Posteingang wäre technisch machbar, wäre aber
ein zweites Postfach, das gepflegt werden müsste. Der Redaktionsbereich kann
darum genau eines: die Texte der Webseite ändern.

> **Vor dem Start einsetzen:** die echte Calendly-Adresse. Im Entwurf steht
> überall `https://calendly.com/` als Platzhalter.

## Bewegung

Zwölf Stellen sind im PDF (Seiten 11 und 12) mit goldenen Marken direkt im
Layout ausgewiesen — vom gestaffelten Einsteigen der Überschrift bis zum Balken,
der auf 70 zu 30 wächst, sobald er ins Bild kommt. Wer im Betriebssystem
„Bewegung reduzieren“ eingestellt hat, bekommt die Seite vollständig ohne
Animation.

---

## Inhalt des Repos

```
Novera-Studio_Webkonzept_Finanzberatung-Rieken.pdf   Präsentation, 23 Seiten
mockup/
  site/index.html            Die Webseite — lauffähig, responsiv, ohne Framework
  site/styles.css            Design-System
  site/script.js             Sparsame Bewegung (Scrollspy, Balken, Einsteigen)
  site/admin/login.html      Redaktionsbereich — Anmeldung mit eigenem Signet
  site/admin/panel.html      Redaktionsbereich — Übersicht
  brand/apps.html            Markenanwendungen (Visitenkarte, Briefbogen, Signatur …)
  presentation/deck.html     Quelle des PDF
  assets/logo/               Signet TR — drei Entwürfe, hell und invers (SVG)
  assets/novera/             Marke Novera Studio (Wortmarke, Emblem, Schriften)
  assets/fonts/              Playfair Display und Inter (SIL OFL, Lizenztexte liegen bei)
  tools/                     Generatoren, Bildstrecke, Animationsmarken, PDF-Bau
  build/shots/               Alle Bildschirmabzüge
```

Das **Präsentationsdeck** ist in der Hausmarke von Novera Studio gesetzt:
Tiefschwarz `#08090B`, Chromverlauf, Instrument Serif und Inter, Wortmarke und
Emblem aus `clarknissen-lab/noverastudio`. Der Rahmen gehört dem Studio, die
blau-warme Welt der vorgestellten Marke.

## Selbst bauen

```bash
cd mockup
npm install                    # Playwright + Schriften
python3 tools/gen-logo.py      # Signet-Entwürfe erzeugen
node tools/shoot.mjs           # Webseite abfotografieren (Desktop + Mobil)
node tools/shoot-admin.mjs     # Redaktionsbereich
node tools/shoot-brand.mjs     # Markenanwendungen
node tools/shoot-motion.mjs    # Animationsmarken setzen
node tools/build-pdf.mjs       # PDF bauen
```

Die Webseite selbst braucht keinen Build — `mockup/site/index.html` direkt im
Browser öffnen. Kein Framework, keine externen Aufrufe, alle Mittel liegen im Repo.

---

## Inhaltliche Grundlage

Die Originalseite `finanzberatung-rieken.com` war aus dieser Arbeitsumgebung
**nicht abrufbar** (die Domain wird von der Netzwerk-Richtlinie der Sitzung
geblockt). Die Inhalte stammen deshalb aus öffentlich auffindbaren Quellen zum
Unternehmen — Wortlaut der Startseite, Leistungen, Zielgruppe, Anschrift,
Zulassung, Registernummer und die ProvenExpert-Bewertung.

Offen vor der Umsetzung:

- **Calendly-Adresse** (überall Platzhalter)
- **Logo-Entwurf wählen** — A, B oder C
- **Portraitfoto** (im Entwurf als gestalteter Platzhalter angelegt)
- Vollständige Leistungsliste und Rechtstexte
- Weitere Kundenstimmen

Beispielhafte Angaben sind im Entwurf als solche gekennzeichnet
(Vorher/Nachher, Beihilfe-Rechenbeispiel, Zahlen im Redaktionsbereich).
