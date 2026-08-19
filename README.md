# Finanzberatung Rieken — Webseiten-Konzept

Entwurf von **Novera Studio** für Tobias Rieken, Versicherungsmakler in Hannover.
Onepager, Markenpaket und Redaktionsbereich.

**Ergebnis:** [`Novera-Studio_Webkonzept_Finanzberatung-Rieken.pdf`](Novera-Studio_Webkonzept_Finanzberatung-Rieken.pdf)
— 19 Seiten, 16:9, bildgeführt.

---

## Gestalterische Leitidee — „Akte statt App“

Versicherung, Police, Urkunde, Wertpapier: Auf genau diesen Dokumenten sitzt seit
jeher die **Guilloche**, das gestochene Sicherheitsmuster. Sie trägt hier die
gesamte Bildsprache — als Signet, als Trennband, als Flächengravur. Damit hat die
Marke einen eigenen, inhaltlich begründeten Charakter statt Stock-Motiven.

Dazu ein Papierton als Grund, Tiefdruckgrün für die Ankerflächen und Messing als
einziger Signalton. Kein Blau, keine Verläufe, keine Glaseffekte, kein Kachelraster.

| | |
|---|---|
| **Papier** | `#F2EDE4` · `#E9E2D5` |
| **Tanne** | `#14332C` · `#0C201C` |
| **Messing** | `#A9722A` |
| **Tinte** | `#14171A` |
| **Schrift** | Newsreader (Auszeichnung) · Archivo (Lesetext) · IBM Plex Mono (Register) — alle SIL OFL |

### Was bewusst anders gelöst ist

| Standardmuster | Hier stattdessen |
|---|---|
| Hero: Text links, Bild rechts | Typografischer Auftakt, Headline als Treppe, Gravur angeschnitten |
| Leistungen als 3-Spalten-Karten | Leistungs**verzeichnis** im Dokumentsatz, sechs Zeilen |
| Prozess als gleich hohe Kreise | Vier Stufen auf wechselnder Tiefe an einer Messinglinie |
| Dekorative Statistikzahlen | Belegbare Angaben: § 34d, Registernummer, ProvenExpert-Bewertung |
| Icon-Reihen | Zwei erklärende Grafiken mit echtem Nutzen (Vertragsspiegel, Beihilfelücke) |
| Mobil = geschrumpfter Desktop | Eigene Fassung mit dauerhafter Aktionsleiste am Fuß |

---

## Inhalt des Repos

```
Novera-Studio_Webkonzept_Finanzberatung-Rieken.pdf   Präsentation, 19 Seiten
mockup/
  site/index.html            Die Webseite — lauffähig, responsiv, ohne Framework
  site/styles.css            Design-System
  site/script.js            Sparsame Interaktion (Scrollspy, Terminraster)
  site/admin/login.html      Redaktionsbereich — Anmeldung mit eigenem Signet
  site/admin/panel.html      Redaktionsbereich — Übersicht
  brand/apps.html            Markenanwendungen (Visitenkarte, Briefbogen, Signatur …)
  presentation/deck.html     Quelle des PDF
  assets/logo/               Signet in fünf Fassungen (SVG)
  assets/art/                Guilloche-Gravuren (SVG, generiert)
  assets/novera/             Signet Novera Studio
  assets/fonts/              Schriften (SIL OFL, Lizenztexte liegen bei)
  tools/                     Generatoren und Bildstrecke
  build/shots/               Alle Bildschirmabzüge
```

## Selbst bauen

```bash
cd mockup
npm install                    # Playwright + Schriften
python3 tools/gen-art.py       # Guilloche-Gravuren erzeugen
python3 tools/gen-logo.py      # Signet erzeugen
node tools/shoot.mjs           # Webseite abfotografieren (Desktop + Mobil)
node tools/shoot-admin.mjs     # Redaktionsbereich
node tools/shoot-brand.mjs     # Markenanwendungen
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

Vor der Umsetzung abzugleichen:

- Farbwelt und Schriften der bestehenden Seite (Screenshot genügt — die Palette
  liegt als CSS-Variablen vor und ist in einem Durchgang austauschbar)
- Portraitfoto (im Entwurf als gestalteter Platzhalter mit Passermarken angelegt)
- Vollständige Leistungsliste und Rechtstexte
- Weitere Kundenstimmen

Beispielhafte Angaben sind im Entwurf als solche gekennzeichnet
(Vertragsspiegel, Terminraster, Zahlen im Redaktionsbereich).
