<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $status  = isset($_GET['status'])  ? $_GET['status']          : null;
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

    $sql = "
        SELECT o.*, u.username, u.email,
               COUNT(oi.order_item_id) as item_count
        FROM Orders o
        LEFT JOIN Users u  ON o.user_id  = u.user_id
        LEFT JOIN Order_Items oi ON o.order_id = oi.order_id
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

    $sql .= " GROUP BY o.order_id ORDER BY o.order_date DESC";

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
