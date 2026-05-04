<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_start();

require_once 'db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        throw new Exception('Invalid request payload.');
    }

    $user_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 1;
    $order_type = $data['order_type'] ?? 'dine-in';
    $payment_method = $data['payment_method'] ?? 'cash_on_delivery';
    $items = $data['items'] ?? [];
    $delivery_fee = isset($data['delivery_fee']) ? (float)$data['delivery_fee'] : 0.0;

    if (empty($items)) {
        throw new Exception('No items in order.');
    }

    // Validate order type against schema enum
    if (!in_array($order_type, ['dine-in', 'to-go', 'delivery'])) {
        $order_type = 'dine-in';
    }

    // Validate payment method against schema enum
    if (!in_array($payment_method, ['cash_on_delivery', 'online_payment'])) {
        $payment_method = 'cash_on_delivery';
    }

    $pdo->beginTransaction();

    // Calculate subtotal from item unit prices * quantity.
    $subtotal_amount = 0.0;
    $normalized_items = [];

    $findProductStmt = $pdo->prepare("
        SELECT product_id
        FROM products
        WHERE product_name = :product_name
        LIMIT 1
    ");

    foreach ($items as $item) {
        $qty = (int)($item['quantity'] ?? $item['qty'] ?? 1);
        $qty = max(1, $qty);
        $unit_price = (float)($item['price'] ?? 0);

        $product_id = (int)($item['product_id'] ?? $item['productId'] ?? 0);
        if ($product_id <= 0) {
            $product_name = trim((string)($item['product_name'] ?? $item['name'] ?? ''));
            if ($product_name !== '') {
                $findProductStmt->execute(['product_name' => $product_name]);
                $resolved_id = $findProductStmt->fetchColumn();
                if ($resolved_id) {
                    $product_id = (int)$resolved_id;
                }
            }
        }

        if ($product_id <= 0) {
            throw new Exception('Unable to resolve product ID for one or more order items.');
        }

        $location = trim((string)($item['location'] ?? 'Dine In'));
        if ($location === '') {
            $location = 'Dine In';
        }

        $normalized_items[] = [
            'product_id' => $product_id,
            'location' => $location,
            'size' => !empty($item['size']) ? (string)$item['size'] : null,
            'sugar_level' => !empty($item['sugar_level']) ? (string)$item['sugar_level'] : (!empty($item['sugarLevel']) ? (string)$item['sugarLevel'] : null),
            'addons' => !empty($item['addons']) ? (string)$item['addons'] : null,
            'flavor' => !empty($item['flavor']) ? (string)$item['flavor'] : null,
            'pieces_per_box' => !empty($item['pieces_per_box']) ? (string)$item['pieces_per_box'] : (!empty($item['piecesPerBox']) ? (string)$item['piecesPerBox'] : null),
            'serving' => !empty($item['serving']) ? (string)$item['serving'] : null,
            'quantity' => $qty,
            'price' => $unit_price,
        ];

        $subtotal_amount += $unit_price * $qty;
    }
    $total_amount = $subtotal_amount + max(0, $delivery_fee);

    // Insert into orders
    $stmt = $pdo->prepare("
        INSERT INTO orders (user_id, order_date, order_type, total_amount, status)
        VALUES (:user_id, NOW(), :order_type, :total_amount, 'pending')
    ");
    $stmt->execute([
        'user_id' => $user_id,
        'order_type' => $order_type,
        'total_amount' => $total_amount
    ]);
    $order_id = $pdo->lastInsertId();

    // Insert into order_items
    $stmt = $pdo->prepare("
        INSERT INTO order_items (
            order_id, product_id, location, size, sugar_level, addons, flavor, pieces_per_box, serving, quantity, price
        )
        VALUES (
            :order_id, :product_id, :location, :size, :sugar_level, :addons, :flavor, :pieces_per_box, :serving, :quantity, :price
        )
    ");

    foreach ($normalized_items as $item) {
        $stmt->execute([
            'order_id' => $order_id,
            'product_id' => $item['product_id'],
            'location' => $item['location'],
            'size' => $item['size'],
            'sugar_level' => $item['sugar_level'],
            'addons' => $item['addons'],
            'flavor' => $item['flavor'],
            'pieces_per_box' => $item['pieces_per_box'],
            'serving' => $item['serving'],
            'quantity' => $item['quantity'],
            'price' => $item['price']
        ]);
    }

    // Insert into payments
    $stmt = $pdo->prepare("
        INSERT INTO payments (order_id, amount, method, status)
        VALUES (:order_id, :amount, :method, 'pending')
    ");
    $stmt->execute([
        'order_id' => $order_id,
        'amount'   => $total_amount,
        'method'   => $payment_method
    ]);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully',
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
