<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'session_config.php';

require_once 'db.php';
require_once 'csrf.php';

function ensurePaymentSchema(PDO $pdo): void
{
    $pdo->exec("
        ALTER TABLE payments
        MODIFY method ENUM('cash_on_delivery','cash','gcash','online_payment') NOT NULL DEFAULT 'cash_on_delivery'
    ");
    $pdo->exec("
        ALTER TABLE payments
        MODIFY status ENUM('active','paid','unpaid','refunded','pending') NOT NULL DEFAULT 'unpaid'
    ");

    $columns = $pdo->query("SHOW COLUMNS FROM payments")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('receipt_info', $columns, true)) {
        $pdo->exec("ALTER TABLE payments ADD COLUMN receipt_info VARCHAR(255) DEFAULT NULL AFTER status");
    }
    if (!in_array('gcash_reference', $columns, true)) {
        $pdo->exec("ALTER TABLE payments ADD COLUMN gcash_reference VARCHAR(100) DEFAULT NULL AFTER receipt_info");
    }
    if (!in_array('gcash_mobile', $columns, true)) {
        $pdo->exec("ALTER TABLE payments ADD COLUMN gcash_mobile VARCHAR(30) DEFAULT NULL AFTER gcash_reference");
    }
}

try {
    ensurePaymentSchema($pdo);

    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        throw new Exception('Invalid request payload.');
    }

    $user_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;

    if (!$user_id) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'You must be logged in to place an order.']);
        exit;
    }

    requireCsrfToken($data['csrf_token'] ?? null);

    $order_type = $data['order_type'] ?? 'dine-in';
    $payment_method = $data['payment_method'] ?? 'cash_on_delivery';
    if ($payment_method === 'online_payment') {
        $payment_method = 'gcash';
    }
    $delivery_address_id = isset($data['delivery_address_id']) ? (int)$data['delivery_address_id'] : null;
    $gcash_reference = trim((string)($data['gcash_reference'] ?? ''));
    $gcash_mobile = trim((string)($data['gcash_mobile'] ?? ''));
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
    if (!in_array($payment_method, ['cash_on_delivery', 'cash', 'gcash'])) {
        $payment_method = 'cash_on_delivery';
    }

    if ($order_type === 'delivery') {
        if (!$delivery_address_id) {
            throw new Exception('Please select a saved delivery address before placing a delivery order.');
        }

        $addressStmt = $pdo->prepare("SELECT address_details_id FROM address_details WHERE address_details_id = :address_id AND user_id = :user_id");
        $addressStmt->execute(['address_id' => $delivery_address_id, 'user_id' => $user_id]);
        if (!$addressStmt->fetchColumn()) {
            throw new Exception('Selected delivery address is invalid.');
        }
    }

    if ($payment_method === 'gcash' && $gcash_reference === '') {
        throw new Exception('Please enter your GCash reference number.');
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

    $payment_status = 'unpaid';
    $receipt_info = null;
    if ($payment_method === 'cash') {
        $receipt_info = 'No receipt yet';
    } elseif ($payment_method === 'cash_on_delivery') {
        $receipt_info = 'Unofficial receipt pending';
    } elseif ($payment_method === 'gcash') {
        $receipt_info = 'Awaiting payment';
    }

    // Insert into payments
    $stmt = $pdo->prepare("
        INSERT INTO payments (order_id, amount, method, status, receipt_info, gcash_reference, gcash_mobile)
        VALUES (:order_id, :amount, :method, :status, :receipt_info, :gcash_reference, :gcash_mobile)
    ");
    $stmt->execute([
        'order_id' => $order_id,
        'amount'   => $total_amount,
        'method'   => $payment_method,
        'status'   => $payment_status,
        'receipt_info' => $receipt_info,
        'gcash_reference' => $gcash_reference !== '' ? $gcash_reference : null,
        'gcash_mobile' => $gcash_mobile !== '' ? $gcash_mobile : null
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
