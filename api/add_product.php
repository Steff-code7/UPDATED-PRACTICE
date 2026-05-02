<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $data         = json_decode(file_get_contents('php://input'), true);
    $category_id  = isset($data['category_id'])  ? intval($data['category_id'])   : 0;
    $product_name = isset($data['product_name']) ? trim($data['product_name'])     : '';
    $description  = isset($data['description'])  ? trim($data['description'])      : '';
    $price_16     = isset($data['price_16'])      ? floatval($data['price_16'])     : 0;
    $price_22     = isset($data['price_22'])      ? floatval($data['price_22'])     : null;
    $stock        = isset($data['stock'])         ? intval($data['stock'])          : 100;
    $image        = isset($data['image'])         ? trim($data['image'])            : '';

    if (empty($product_name)) throw new Exception('Product name is required');
    if ($category_id <= 0)    throw new Exception('Valid category is required');
    if ($price_16 <= 0)       throw new Exception('Price for 16oz is required');

    $stmt = $pdo->prepare("
        INSERT INTO Products (category_id, product_name, description, price_16, price_22, stock, image)
        VALUES (:category_id, :product_name, :description, :price_16, :price_22, :stock, :image)
    ");
    $stmt->execute([
        'category_id'  => $category_id,
        'product_name' => $product_name,
        'description'  => $description,
        'price_16'     => $price_16,
        'price_22'     => $price_22,
        'stock'        => $stock,
        'image'        => $image
    ]);

    echo json_encode([
        'success'    => true,
        'message'    => 'Product added successfully',
        'product_id' => $pdo->lastInsertId()
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
