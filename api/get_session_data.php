<?php
header('Content-Type: application/json');
require_once 'session_config.php';

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
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No session found'
    ]);
}
?>
