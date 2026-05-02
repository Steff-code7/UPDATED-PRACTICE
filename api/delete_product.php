<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $data       = json_decode(file_get_contents('php://input'), true);
    $product_id = isset($data['product_id']) ? intval($data['product_id']) : 0;

    if ($product_id <= 0) throw new Exception('Valid product ID is required');

    $stmt = $pdo->prepare("DELETE FROM Products WHERE product_id = :product_id");
    $stmt->execute(['product_id' => $product_id]);

    if ($stmt->rowCount() === 0) throw new Exception('Product not found');

    echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
