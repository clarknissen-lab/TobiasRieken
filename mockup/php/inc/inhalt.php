<?php
/**
 * Inhalte laden, ausgeben und speichern.
 *
 * Die Texte liegen in daten/inhalte.json — eine einzige Datei, keine
 * Datenbank. Für eine Seite mit einer Redakteurin ist das genau richtig:
 * nichts kann sich verklemmen, eine Sicherung ist eine Kopie der Datei.
 */
declare(strict_types=1);
require_once __DIR__ . '/config.php';

/** Alle Inhalte als Feld. */
function inhalte(): array
{
    static $cache = null;
    if ($cache !== null) return $cache;
    if (!is_readable(INHALT_DATEI)) {
        throw new RuntimeException('daten/inhalte.json fehlt oder ist nicht lesbar.');
    }
    $roh = json_decode((string)file_get_contents(INHALT_DATEI), true);
    if (!is_array($roh)) {
        throw new RuntimeException('daten/inhalte.json ist beschädigt.');
    }
    return $cache = $roh;
}

/**
 * Einen Wert über einen Pfad holen: t('auftakt.ueberschrift')
 * oder t('leistungen.eintraege.0.titel').
 */
function t(string $pfad, string $ersatz = ''): string
{
    $wert = inhalte();
    foreach (explode('.', $pfad) as $teil) {
        if (is_array($wert) && array_key_exists($teil, $wert)) {
            $wert = $wert[$teil];
        } else {
            return $ersatz;
        }
    }
    return is_scalar($wert) ? (string)$wert : $ersatz;
}

/** Eine Liste holen. */
function liste(string $pfad): array
{
    $wert = inhalte();
    foreach (explode('.', $pfad) as $teil) {
        if (is_array($wert) && array_key_exists($teil, $wert)) {
            $wert = $wert[$teil];
        } else {
            return [];
        }
    }
    return is_array($wert) ? $wert : [];
}

/** Text sicher ausgeben. Nichts anderes darf je direkt ins HTML. */
function h(?string $s): string
{
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Kleine, absichtlich winzige Auszeichnungssprache für die Redaktion:
 *   *Wort*   wird kursiv hervorgehoben
 *   **Wort** wird fett
 *   |        erzwingt einen Zeilenumbruch
 * Alles andere wird maskiert — es gibt also keine Lücke für fremdes HTML.
 */
function tx(string $pfad, string $ersatz = ''): string
{
    $s = h(t($pfad, $ersatz));
    $s = preg_replace('/\*\*(.+?)\*\*/u', '<strong>$1</strong>', $s);
    $s = preg_replace('/\*(.+?)\*/u', '<span class="serif-em">$1</span>', $s);
    return str_replace('|', '<br>', (string)$s);
}

/** Dasselbe für einen Wert, der schon als Zeichenkette vorliegt. */
function txs(string $s): string
{
    $s = h($s);
    $s = preg_replace('/\*\*(.+?)\*\*/u', '<strong>$1</strong>', $s);
    $s = preg_replace('/\*(.+?)\*/u', '<span class="serif-em">$1</span>', $s);
    return str_replace('|', '<br>', (string)$s);
}

/**
 * Inhalte speichern. Vorher wird eine Sicherung angelegt, geschrieben wird
 * über eine temporäre Datei und rename() — so bleibt die Datei auch dann
 * heil, wenn der Vorgang mittendrin abbricht.
 */
function inhalte_speichern(array $neu): void
{
    if (!is_dir(SICHERUNG_PFAD)) {
        @mkdir(SICHERUNG_PFAD, 0775, true);
    }
    if (is_readable(INHALT_DATEI)) {
        @copy(INHALT_DATEI, SICHERUNG_PFAD . '/inhalte-' . date('Ymd-His') . '.json');
        $alte = glob(SICHERUNG_PFAD . '/inhalte-*.json') ?: [];
        sort($alte);
        foreach (array_slice($alte, 0, max(0, count($alte) - SICHERUNGEN_MAX)) as $weg) {
            @unlink($weg);
        }
    }
    $json = json_encode($neu, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        throw new RuntimeException('Inhalte liessen sich nicht umwandeln.');
    }
    $tmp = INHALT_DATEI . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, INHALT_DATEI)) {
        throw new RuntimeException('Schreiben fehlgeschlagen — Schreibrechte auf daten/ prüfen.');
    }
}
