<?php
header('Content-Type: application/json');
require_once 'session_config.php';

require_once 'db.php';

// Check if admin is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];

    // Get admin user full data
    $stmt = $pdo->prepare("
        SELECT 
            user_id, username, email, full_name, role, profile_picture, 
            contact_number, created_at
        FROM users 
        WHERE user_id = :user_id AND role IN ('admin', 'staff')
    ");
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Admin not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'user' => [
            'user_id'         => $user['user_id'],
            'username'        => $user['username'],
            'email'           => $user['email'],
            'full_name'       => $user['full_name'],
            'role'            => $user['role'],
            'profile_picture' => $user['profile_picture'],
            'contact_number'  => $user['contact_number'],
            'member_since'    => date('F j, Y', strtotime($user['created_at']))
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}
?>
