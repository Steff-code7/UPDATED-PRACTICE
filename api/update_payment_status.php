<?php
declare(strict_types=1);

header('Content-Type: application/json');
session_start();

require_once 'db.php';

function ensurePaymentSchema(PDO $pdo): void
{
    $pdo->exec("
        ALTER TABLE payments
        MODIFY status ENUM('active','paid','unpaid','refunded','pending') NOT NULL DEFAULT 'unpaid'
    ");
}

try {
    ensurePaymentSchema($pdo);

    if (!isset($_SESSION['role']) || !in_array($_SESSION['role'], ['admin', 'staff'], true)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Only staff or admins can update payment status.',
        ]);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $paymentId = isset($data['payment_id']) ? (int)$data['payment_id'] : 0;
    $status = isset($data['status']) ? strtolower(trim((string)$data['status'])) : '';
    $validStatuses = ['active', 'paid', 'unpaid', 'refunded'];

    if ($paymentId <= 0 || !in_array($status, $validStatuses, true)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please provide a valid payment and status.',
        ]);
        exit;
    }

    $receiptInfo = null;
    if ($status === 'paid') {
        $receiptInfo = 'Payment verified';
    } elseif ($status === 'unpaid') {
        $receiptInfo = 'Awaiting payment';
    } elseif ($status === 'refunded') {
        $receiptInfo = 'Refunded';
    } elseif ($status === 'active') {
        $receiptInfo = 'Active';
    }

    $stmt = $pdo->prepare("
        UPDATE payments
        SET status = :status,
            receipt_info = COALESCE(:receipt_info, receipt_info)
        WHERE payment_id = :payment_id
    ");
    $stmt->execute([
        'status' => $status,
        'receipt_info' => $receiptInfo,
        'payment_id' => $paymentId,
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Payment not found.',
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Payment status updated successfully.',
        'status' => $status,
        'receipt_info' => $receiptInfo,
    ]);
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error. Please try again.',
    ]);
}
