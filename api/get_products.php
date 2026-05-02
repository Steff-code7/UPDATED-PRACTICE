<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;

    if ($categoryId) {
        $stmt = $pdo->prepare("
            SELECT p.*, c.category_name
            FROM Products p
            JOIN Categories c ON p.category_id = c.category_id
            WHERE p.category_id = :category_id
            ORDER BY p.product_name
        ");
        $stmt->execute(['category_id' => $categoryId]);
    } else {
        $stmt = $pdo->query("
            SELECT p.*, c.category_name
            FROM Products p
            JOIN Categories c ON p.category_id = c.category_id
            ORDER BY c.category_id, p.product_name
        ");
    }

    $products = $stmt->fetchAll();

    echo json_encode([
        'success'  => true,
        'products' => $products
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching products: ' . $e->getMessage()
    ]);
}
?>
