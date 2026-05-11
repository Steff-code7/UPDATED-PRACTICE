<?php
header('Content-Type: application/json');
session_start();

require_once 'db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];

    // Get user basic info
    $stmt = $pdo->prepare("
        SELECT 
            user_id, username, email, full_name, contact_number, date_of_birth, 
            profile_picture, role, created_at
        FROM users 
        WHERE user_id = :user_id
    ");
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['message' => 'User not found']);
        exit;
    }

    // Get user's primary address
    $stmt = $pdo->prepare("
        SELECT * FROM addresses 
        WHERE user_id = :user_id AND is_primary = TRUE
        LIMIT 1
    ");
    $stmt->execute(['user_id' => $user_id]);
    $primaryAddress = $stmt->fetch();

    // Get all user addresses
    $stmt = $pdo->prepare("
        SELECT * FROM addresses 
        WHERE user_id = :user_id
        ORDER BY is_primary DESC, updated_at DESC
    ");
    $stmt->execute(['user_id' => $user_id]);
    $allAddresses = $stmt->fetchAll();

    // Get order statistics
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(*) as total_orders,
            COALESCE(SUM(total_amount), 0) as total_spent
        FROM orders 
        WHERE user_id = :user_id
    ");
    $stmt->execute(['user_id' => $user_id]);
    $stats = $stmt->fetch();

    // Calculate member duration
    $createdDate = new DateTime($user['created_at']);
    $today = new DateTime();
    $memberSince = $createdDate->format('F j, Y');

    echo json_encode([
        'success' => true,
        'user' => $user,
        'primaryAddress' => $primaryAddress,
        'addresses' => $allAddresses,
        'stats' => $stats,
        'memberSince' => $memberSince
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>
