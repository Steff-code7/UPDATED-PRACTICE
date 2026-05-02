<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_start();

require_once 'db.php';

try {
    $data           = json_decode(file_get_contents('php://input'), true);
    $user_id        = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 1;
    $order_type     = $data['order_type']     ?? 'dine-in';
    $payment_method = $data['payment_method'] ?? 'cash';
    $items          = $data['items']          ?? [];

    if (empty($items)) {
        throw new Exception('No items in order.');
    }

    // Validate order_type matches DB ENUM: 'dine-in', 'to-go', 'delivery'
    if (!in_array($order_type, ['dine-in', 'to-go', 'delivery'])) {
        $order_type = 'dine-in';
    }

    // Validate payment method matches DB ENUM: 'cash', 'online'
    if (!in_array($payment_method, ['cash', 'online'])) {
        $payment_method = 'cash';
    }

    $pdo->beginTransaction();

    // ── Calculate total ─────────────────────────────────────────────────
    $total_amount = 0;
    foreach ($items as $item) {
        $total_amount += floatval($item['price']) * intval($item['qty']);
    }
    if ($order_type === 'delivery') {
        $total_amount += 25;
    }

    // ── Insert into Orders ──────────────────────────────────────────────
    // Columns: user_id, order_date (auto), order_type, total_amount, status
    $stmt = $pdo->prepare("
        INSERT INTO Orders (user_id, order_type, total_amount, status)
        VALUES (:user_id, :order_type, :total_amount, 'pending')
    ");
    $stmt->execute([
        'user_id'      => $user_id,
        'order_type'   => $order_type,
        'total_amount' => $total_amount
    ]);
    $order_id = $pdo->lastInsertId();

    // ── Insert into Order_Items ─────────────────────────────────────────
    // Columns: order_id, product_id, size (16oz/22oz), sugar_level (25%/50%/75%/100%), quantity, price
    $stmt = $pdo->prepare("
        INSERT INTO Order_Items (order_id, product_id, size, sugar_level, quantity, price)
        VALUES (:order_id, :product_id, :size, :sugar_level, :quantity, :price)
    ");

    foreach ($items as $item) {
        $pid = (int)($item['product_id'] ?? 0);

        if ($pid <= 0) {
            throw new Exception('product_id is required.');
        }

        // Accept both 'sugar_level' and 'sugarLevel' from frontend
        $sugar_level = $item['sugar_level'] ?? $item['sugarLevel'] ?? null;

        $stmt->execute([
            'order_id'    => $order_id,
            'product_id'  => $pid,
            'size'        => !empty($item['size'])  ? $item['size']  : null,
            'sugar_level' => !empty($sugar_level)   ? $sugar_level   : null,
            'quantity'    => (int)$item['qty'],
            'price'       => (float)$item['price']
        ]);
    }

    // ── Insert into Payments ────────────────────────────────────────────
    // Columns: order_id, amount, method (cash/online), status, payment_date (auto)
    $stmt = $pdo->prepare("
        INSERT INTO Payments (order_id, amount, method, status)
        VALUES (:order_id, :amount, :method, 'pending')
    ");
    $stmt->execute([
        'order_id' => $order_id,
        'amount'   => $total_amount,
        'method'   => $payment_method
    ]);

    $pdo->commit();

    echo json_encode([
        'success'  => true,
        'message'  => 'Order placed successfully',
        'order_id' => $order_id
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
