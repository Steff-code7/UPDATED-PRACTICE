<?php
declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

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

    $stmt = $pdo->query("
        SELECT
            p.payment_id,
            p.order_id,
            o.user_id,
            p.amount,
            p.method,
            p.status,
            p.receipt_info,
            p.gcash_reference,
            p.gcash_mobile,
            p.payment_date
        FROM payments p
        LEFT JOIN orders o ON p.order_id = o.order_id
        ORDER BY p.payment_date DESC, p.payment_id DESC
    ");

    echo json_encode([
        'success' => true,
        'payments' => $stmt->fetchAll(),
    ]);
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching payments: ' . $exception->getMessage(),
    ]);
}
