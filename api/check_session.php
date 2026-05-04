<?php
header('Content-Type: application/json');
session_start();

require_once 'db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Not logged in',
        'redirect' => 'loginSignUp.html'
    ]);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];
    
    // Verify user still exists in database
    $stmt = $pdo->prepare("SELECT user_id, username, profile_picture FROM users WHERE user_id = :user_id AND status = 'active'");
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch();
    
    if (!$user) {
        // User doesn't exist or is inactive, clear session
        session_destroy();
        echo json_encode([
            'success' => false,
            'message' => 'User not found or inactive',
            'redirect' => 'loginSignUp.html'
        ]);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'user' => $user
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'redirect' => 'loginSignUp.html'
    ]);
}
?>
