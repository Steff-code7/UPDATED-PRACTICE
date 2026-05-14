<?php
/**
 * logout.php
 * Destroys the server-side session and redirects to the login page.
 * Linked to from all logout buttons across the app.
 */
require_once 'api/session_config.php';

// Remove all session variables
session_unset();

// Destroy the session on the server
session_destroy();

// Expire the session cookie in the browser immediately
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        $params['secure'],
        $params['httponly']
    );
}

// Clear any cached pages
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');

header('Location: loginSignUp.php');
exit;
?>
