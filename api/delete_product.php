<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';
require_once 'csrf.php';

try {
    $data       = json_decode(file_get_contents('php://input'), true);
    requireCsrfToken($data['csrf_token'] ?? null);

    $product_id = isset($data['product_id']) ? intval($data['product_id']) : 0;
    $status     = isset($data['status']) ? strtolower(trim($data['status'])) : 'archive';

    if ($product_id <= 0) throw new Exception('Valid product ID is required');

    if ($status === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM Products WHERE product_id = :product_id");
        $stmt->execute(['product_id' => $product_id]);

        if ($stmt->rowCount() === 0) {
            throw new Exception('Product not found');
        }

        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
        exit;
    }

    $status = $status === 'active' ? 'active' : 'archive';

    $stmt = $pdo->prepare("UPDATE Products SET status = :status WHERE product_id = :product_id");
    $stmt->execute(['product_id' => $product_id, 'status' => $status]);

    if ($stmt->rowCount() === 0) {
        throw new Exception('Product not found');
    }

    $message = $status === 'archive' ? 'Product archived successfully' : 'Product restored successfully';
    echo json_encode(['success' => true, 'message' => $message]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
