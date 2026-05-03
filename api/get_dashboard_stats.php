<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $stmt = $pdo->prepare("
        SELECT COUNT(*) AS customer_count
        FROM users
        WHERE role = :role
    ");
    $stmt->execute(['role' => 'customer']);
    $stats = $stmt->fetch();

    echo json_encode([
        'success' => true,
        'customer_count' => (int) ($stats['customer_count'] ?? 0),
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching dashboard stats: ' . $e->getMessage(),
    ]);
}
?>
