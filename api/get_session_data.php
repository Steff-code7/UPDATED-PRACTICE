<?php
header('Content-Type: application/json');
session_start();

// Debug: Log session state
error_log("Session data: " . print_r($_SESSION, true));

// Return session data directly without complex validation
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'user' => [
            'user_id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'] ?? 'Unknown',
            'full_name' => $_SESSION['full_name'] ?? $_SESSION['username'] ?? 'Unknown',
            'role' => $_SESSION['role'] ?? 'unknown',
            'profile_picture' => $_SESSION['profile_picture'] ?? null,
            'email' => $_SESSION['email'] ?? ''
        ],
        'debug' => [
            'session_id' => session_id(),
            'session_keys' => array_keys($_SESSION)
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No session found',
        'debug' => [
            'session_id' => session_id(),
            'session_keys' => array_keys($_SESSION)
        ]
    ]);
}
?>
