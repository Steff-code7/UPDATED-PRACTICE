<?php
/**
 * Central session configuration.
 * Include this file INSTEAD of calling session_start() directly.
 * Handles: cookie security flags, strict mode, timeout enforcement.
 */

if (session_status() !== PHP_SESSION_NONE) {
    return; // Session already started, skip
}

const SESSION_TIMEOUT = 1800; // 30 minutes in seconds

// ── Cookie security flags ──────────────────────────────────────────────────
ini_set('session.cookie_httponly', '1');   // Block JS from reading the cookie
ini_set('session.use_strict_mode',  '1'); // Reject unrecognised session IDs
ini_set('session.cookie_samesite',  'Lax'); // Mitigate CSRF via cookie policy

// cookie_secure: on only when the request came in over HTTPS
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        || (!empty($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443);

ini_set('session.cookie_secure', $isHttps ? '1' : '0');

session_start();

// ── Session timeout enforcement ────────────────────────────────────────────
if (isset($_SESSION['user_id'])) {
    $lastActivity = $_SESSION['last_activity'] ?? null;

    if ($lastActivity !== null && (time() - $lastActivity) > SESSION_TIMEOUT) {
        // Session has expired — destroy it and signal the client
        session_unset();
        session_destroy();
        if (!headers_sent()) {
            http_response_code(401);
            header('Content-Type: application/json');
        }
        echo json_encode([
            'success'  => false,
            'message'  => 'Session expired. Please log in again.',
            'redirect' => 'loginSignUp.php',
        ]);
        exit;
    }

    // Refresh the activity timestamp on every valid request
    $_SESSION['last_activity'] = time();
}
?>
