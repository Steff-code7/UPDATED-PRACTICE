<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $customerStmt = $pdo->prepare("
        SELECT COUNT(*) AS customer_count
        FROM users
        WHERE role = :role
    ");
    $customerStmt->execute(['role' => 'customer']);
    $customerStats = $customerStmt->fetch();

    $productCountStmt = $pdo->query("
        SELECT
            SUM(status = 'active') AS active_products,
            SUM(status = 'archive') AS archived_products
        FROM products
    ");
    $productCountStats = $productCountStmt->fetch();

    $orderCountStmt = $pdo->query("
        SELECT COUNT(*) AS total_orders
        FROM orders
    ");
    $orderCountStats = $orderCountStmt->fetch();

    $recentOrdersStmt = $pdo->query("
        SELECT
            o.order_id,
            o.total_amount,
            o.status,
            o.order_date,
            COALESCE(u.username, 'Guest') AS username,
            COALESCE(
                GROUP_CONCAT(
                    DISTINCT p.product_name
                    ORDER BY p.product_name ASC
                    SEPARATOR ', '
                ),
                'No items'
            ) AS items
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        GROUP BY o.order_id, o.total_amount, o.status, o.order_date, u.username
        ORDER BY o.order_date DESC, o.order_id DESC
        LIMIT 5
    ");
    $recentOrders = $recentOrdersStmt->fetchAll();

    echo json_encode([
        'success' => true,
        'product_count' => (int) ($productCountStats['active_products'] ?? 0) + (int) ($productCountStats['archived_products'] ?? 0),
        'active_product_count' => (int) ($productCountStats['active_products'] ?? 0),
        'archived_product_count' => (int) ($productCountStats['archived_products'] ?? 0),
        'customer_count' => (int) ($customerStats['customer_count'] ?? 0),
        'total_orders' => (int) ($orderCountStats['total_orders'] ?? 0),
        'recent_orders' => $recentOrders,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching dashboard stats: ' . $e->getMessage(),
    ]);
}
?>
