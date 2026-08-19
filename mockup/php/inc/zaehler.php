<?php
/**
 * Einfache Zählung der Seitenaufrufe.
 *
 * Ehrlich gesagt: das ist eine Strichliste, kein Analysewerkzeug. Gezählt
 * wird pro Tag, wie oft die Seite ausgeliefert wurde und wie oft jemand auf
 * "Termin buchen" geklickt hat. Es werden keine Adressen und keine Cookies
 * gespeichert — nur Zahlen. Wer echte Auswertungen braucht (Herkunft,
 * Endgeräte, Verweildauer), nimmt zusätzlich Plausible oder Matomo.
 */
declare(strict_types=1);
require_once __DIR__ . '/config.php';

function ist_bot(): bool
{
    $ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
    if ($ua === '') return true;
    foreach (['bot', 'crawl', 'spider', 'slurp', 'preview', 'fetch', 'monitor',
              'headless', 'python-requests', 'curl', 'wget'] as $muster) {
        if (str_contains($ua, $muster)) return true;
    }
    return false;
}

function zaehlen(string $ereignis = 'aufruf'): void
{
    if (ist_bot()) return;
    $tag = date('Y-m-d');
    $d = zaehler_lesen();
    $d[$tag][$ereignis] = (int)($d[$tag][$ereignis] ?? 0) + 1;

    // Nur die letzten 400 Tage behalten
    if (count($d) > 400) {
        ksort($d);
        $d = array_slice($d, -400, null, true);
    }
    @file_put_contents(ZAEHLER_DATEI, json_encode($d, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function zaehler_lesen(): array
{
    if (!is_readable(ZAEHLER_DATEI)) return [];
    $d = json_decode((string)file_get_contents(ZAEHLER_DATEI), true);
    return is_array($d) ? $d : [];
}

/** Summe eines Ereignisses über die letzten $tage Tage. */
function zaehler_summe(string $ereignis, int $tage = 30): int
{
    $d = zaehler_lesen();
    $ab = strtotime("-{$tage} days");
    $summe = 0;
    foreach ($d as $tag => $werte) {
        if (strtotime($tag) >= $ab) $summe += (int)($werte[$ereignis] ?? 0);
    }
    return $summe;
}

/** Werte der letzten $tage Tage als Liste — für die kleine Kurve. */
function zaehler_verlauf(string $ereignis, int $tage = 14): array
{
    $d = zaehler_lesen();
    $aus = [];
    for ($i = $tage - 1; $i >= 0; $i--) {
        $tag = date('Y-m-d', strtotime("-{$i} days"));
        $aus[$tag] = (int)($d[$tag][$ereignis] ?? 0);
    }
    return $aus;
}
