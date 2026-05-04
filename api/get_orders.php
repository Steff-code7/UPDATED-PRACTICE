<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $status  = isset($_GET['status'])  ? $_GET['status']          : null;
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

    $sql = "
        SELECT o.order_id, o.total_amount, o.status, o.order_date,
               COALESCE(u.username, 'Guest') AS username,
               COALESCE(
                   GROUP_CONCAT(
                       DISTINCT p.product_name
                       ORDER BY p.product_name ASC
                       SEPARATOR ', '
                   ),
                   'No items'
               ) AS items,
               COUNT(DISTINCT oi.order_item_id) AS item_count
        FROM orders o
        LEFT JOIN users u  ON o.user_id  = u.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
    ";

    $conditions = [];
    $params     = [];

    if ($status) {
        $conditions[] = "o.status = :status";
        $params['status'] = $status;
    }

    if ($user_id) {
        $conditions[] = "o.user_id = :user_id";
        $params['user_id'] = $user_id;
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $sql .= " GROUP BY o.order_id, o.total_amount, o.status, o.order_date, u.username ORDER BY o.order_date DESC, o.order_id DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data'    => $orders
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching orders: ' . $e->getMessage()
    ]);
}
?>
