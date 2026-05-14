<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';
require_once 'csrf.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    requireCsrfToken($data['csrf_token'] ?? null);
    
    if (!isset($data['order_id']) || !isset($data['status'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Order ID and status are required.'
        ]);
        exit;
    }

    $order_id = intval($data['order_id']);
    $new_status = strtolower(trim($data['status']));

    // Valid statuses
    $valid_statuses = ['pending', 'preparing', 'completed', 'cancelled', 'refunded'];
    if (!in_array($new_status, $valid_statuses)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid status provided.'
        ]);
        exit;
    }

    // Get current order status
    $stmt = $pdo->prepare("SELECT status FROM orders WHERE order_id = :order_id");
    $stmt->execute(['order_id' => $order_id]);
    $order = $stmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Order not found.'
        ]);
        exit;
    }

    $current_status = strtolower(trim($order['status']));

    // Validate status transitions
    $valid_transitions = [
        'pending' => ['preparing', 'cancelled'],
        'preparing' => ['completed'],
        'completed' => ['refunded'],
        'cancelled' => [],
        'refunded' => []
    ];

    if (!in_array($new_status, $valid_transitions[$current_status])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "Cannot transition from '$current_status' to '$new_status'."
        ]);
        exit;
    }

    // Update order status
    $stmt = $pdo->prepare("UPDATE orders SET status = :status WHERE order_id = :order_id");
    $stmt->execute([
        'status' => $new_status,
        'order_id' => $order_id
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Order status updated successfully.',
        'order_id' => $order_id,
        'new_status' => $new_status
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error updating order status: ' . $e->getMessage()
    ]);
}
?>
