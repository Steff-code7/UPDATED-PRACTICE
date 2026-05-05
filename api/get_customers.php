<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $customersStmt = $pdo->prepare("
        SELECT 
            u.user_id,
            u.full_name,
            u.email,
            u.status,
            COUNT(o.order_id) AS total_orders
        FROM users u
        LEFT JOIN orders o ON u.user_id = o.user_id
        WHERE u.role = :role
        GROUP BY u.user_id, u.full_name, u.email, u.status
        ORDER BY u.full_name ASC
    ");
    
    $customersStmt->execute(['role' => 'customer']);
    $customers = $customersStmt->fetchAll();

    echo json_encode([
        'success' => true,
        'customers' => $customers,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching customers: ' . $e->getMessage(),
    ]);
}
?>
