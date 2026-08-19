<?php
/**
 * Finanzberatung Rieken — Grundeinstellungen
 * Gestaltung & Umsetzung: Novera Studio
 *
 * Diese Datei ist die einzige, die bei der Einrichtung angefasst werden muss.
 */
declare(strict_types=1);

/* Anmeldung ------------------------------------------------------------
   Das Passwort steht hier NICHT im Klartext, sondern als Hash.
   Einen neuen Hash erzeugen:
       php -r 'echo password_hash("MeinPasswort", PASSWORD_DEFAULT), "\n";'
   Der Vorgabewert unten gehört zum Passwort  rieken-demo-2026
   und muss vor dem Start ersetzt werden. */
const REDAKTION_BENUTZER = 'info@trieken.com';
const REDAKTION_HASH     = '$2y$12$197iCsllU60Kv7/KlrsjK.7qcUUsFLQU.j4bzlVf87auKUZ47epfC';

/* Ablage ---------------------------------------------------------------
   Sicherer ist es, DATEN_PFAD oberhalb des Webordners zu legen, z. B.
   __DIR__ . '/../../daten'. Dann kommt niemand über den Browser heran,
   auch wenn der Webserver .htaccess ignoriert. */
define('DATEN_PFAD', __DIR__ . '/../daten');
define('INHALT_DATEI', DATEN_PFAD . '/inhalte.json');
define('ZAEHLER_DATEI', DATEN_PFAD . '/zaehler.json');
define('SPERRE_DATEI', DATEN_PFAD . '/anmeldeversuche.json');
define('SICHERUNG_PFAD', DATEN_PFAD . '/sicherungen');

/* Wie viele Sicherungen aufgehoben werden */
const SICHERUNGEN_MAX = 30;

/* Anmeldesperre: nach so vielen Fehlversuchen wird für so viele Minuten
   gesperrt. Schützt gegen automatisiertes Durchprobieren. */
const VERSUCHE_MAX = 5;
const SPERRE_MINUTEN = 15;
