<?php
/**
 * Anmeldung für die Redaktion.
 *
 * Bewusst klein gehalten, aber an den Stellen sorgfältig, an denen selbst
 * gebaute Anmeldungen üblicherweise aufgehen: Passwort nur als Hash,
 * Sitzungskennung nach dem Anmelden erneuern, CSRF-Marke bei jedem
 * Formular, und eine Sperre gegen automatisiertes Durchprobieren.
 */
declare(strict_types=1);
require_once __DIR__ . '/config.php';

function sitzung_starten(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $sicher = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,          // kein Zugriff über JavaScript
        'secure'   => $sicher,       // nur über HTTPS ausliefern
        'samesite' => 'Lax',         // schützt gegen fremde Formulare
    ]);
    session_name('rieken_redaktion');
    session_start();
}

function angemeldet(): bool
{
    sitzung_starten();
    return !empty($_SESSION['angemeldet']);
}

function anmeldung_verlangen(): void
{
    if (!angemeldet()) {
        header('Location: index.php?ziel=anmelden');
        exit;
    }
}

/* ── CSRF ─────────────────────────────────────────────────────────────── */

function csrf_marke(): string
{
    sitzung_starten();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_pruefen(?string $marke): bool
{
    sitzung_starten();
    return is_string($marke) && !empty($_SESSION['csrf'])
        && hash_equals($_SESSION['csrf'], $marke);
}

/* ── Sperre gegen Durchprobieren ──────────────────────────────────────── */

function versuche_lesen(): array
{
    if (!is_readable(SPERRE_DATEI)) return [];
    $d = json_decode((string)file_get_contents(SPERRE_DATEI), true);
    return is_array($d) ? $d : [];
}

function versuche_schreiben(array $d): void
{
    @file_put_contents(SPERRE_DATEI, json_encode($d), LOCK_EX);
}

/** Sekunden, die noch gesperrt sind. 0 = frei. */
function gesperrt_fuer(): int
{
    $d = versuche_lesen();
    $schluessel = kennung();
    $eintrag = $d[$schluessel] ?? null;
    if (!$eintrag || ($eintrag['anzahl'] ?? 0) < VERSUCHE_MAX) return 0;
    $frei = (int)($eintrag['zuletzt'] ?? 0) + SPERRE_MINUTEN * 60;
    return max(0, $frei - time());
}

function kennung(): string
{
    // Nur ein Hash der Adresse, nie die Adresse selbst.
    return substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '?') . '|rieken'), 0, 16);
}

function versuch_vermerken(bool $erfolg): void
{
    $d = versuche_lesen();
    $k = kennung();
    if ($erfolg) {
        unset($d[$k]);
    } else {
        $d[$k] = ['anzahl' => (int)($d[$k]['anzahl'] ?? 0) + 1, 'zuletzt' => time()];
    }
    // alte Einträge aufräumen
    foreach ($d as $key => $e) {
        if (time() - (int)($e['zuletzt'] ?? 0) > 86400) unset($d[$key]);
    }
    versuche_schreiben($d);
}

/* ── Anmelden und abmelden ────────────────────────────────────────────── */

function anmelden(string $benutzer, string $passwort): bool
{
    sitzung_starten();
    if (gesperrt_fuer() > 0) return false;

    // hash_equals auch beim Benutzernamen, damit die Laufzeit nichts verrät
    $nutzerOk = hash_equals(REDAKTION_BENUTZER, $benutzer);
    $passOk   = password_verify($passwort, REDAKTION_HASH);

    if ($nutzerOk && $passOk) {
        session_regenerate_id(true);      // gegen Session Fixation
        $_SESSION['angemeldet'] = true;
        $_SESSION['benutzer']   = $benutzer;
        $_SESSION['seit']       = time();
        versuch_vermerken(true);
        return true;
    }
    versuch_vermerken(false);
    return false;
}

function abmelden(): void
{
    sitzung_starten();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}
