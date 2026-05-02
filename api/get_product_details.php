<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $product_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($product_id <= 0) {
        throw new Exception('Invalid product ID');
    }

    $stmt = $pdo->prepare("
        SELECT p.product_id, p.category_id, p.product_name, p.description,
               p.price_16, p.price_22, p.stock, p.image,
               c.category_name
        FROM Products p
        JOIN Categories c ON p.category_id = c.category_id
        WHERE p.product_id = :id
    ");
    $stmt->execute(['id' => $product_id]);
    $product = $stmt->fetch();

    if (!$product) {
        throw new Exception('Product not found');
    }

    echo json_encode([
        'success' => true,
        'data'    => $product
    ]);

} catch (Exception $e) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
