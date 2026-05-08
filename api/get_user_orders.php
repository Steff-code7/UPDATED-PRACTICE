<?php
header('Content-Type: application/json');
session_start();

require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];

    // Get user's orders with items
    $stmt = $pdo->prepare("
        SELECT 
            o.order_id,
            o.order_date,
            o.total_amount,
            o.status,
            GROUP_CONCAT(
                CONCAT(p.product_name, ' (', oi.quantity, 'x) - ', oi.size)
                SEPARATOR ', '
            ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE o.user_id = :user_id
        GROUP BY o.order_id
        ORDER BY o.order_date DESC
    ");
    $stmt->execute(['user_id' => $user_id]);
    $orders = $stmt->fetchAll();

    // Format order IDs
    foreach ($orders as &$order) {
        if (!$order['order_id'] || !$order['order_date'] || $order['order_date'] === '0000-00-00 00:00:00') {
            continue;
        }
        $order['order_display_id'] = '#ORD-' . str_pad($order['order_id'], 4, '0', STR_PAD_LEFT);
        $order['formatted_date'] = date('M d, Y g:i A', strtotime($order['order_date']));
    }

    echo json_encode([
        'success' => true,
        'orders' => $orders
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>
