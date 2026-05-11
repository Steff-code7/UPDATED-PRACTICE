<?php
require_once 'api/session_config.php';

// This file will be used to check and maintain session
header('Content-Type: application/json');

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    // Refresh session data from database to ensure it's current
    require_once 'api/db.php';
    
    try {
        $stmt = $pdo->prepare("
            SELECT user_id, username, email, full_name, role, profile_picture, contact_number
            FROM users 
            WHERE user_id = :user_id AND status = 'active'
        ");
        $stmt->execute(['user_id' => $_SESSION['user_id']]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Update session with fresh data
            $_SESSION['username'] = $user['username'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['profile_picture'] = $user['profile_picture'];
            $_SESSION['email'] = $user['email'];
            
            echo json_encode([
                'success' => true,
                'user' => [
                    'user_id' => $user['user_id'],
                    'username' => $user['username'],
                    'full_name' => $user['full_name'],
                    'role' => $user['role'],
                    'profile_picture' => $user['profile_picture'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            // User not found, clear session
            session_destroy();
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
}
?>
