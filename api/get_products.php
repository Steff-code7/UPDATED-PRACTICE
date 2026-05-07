<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;
    $status = isset($_GET['status']) ? strtolower(trim($_GET['status'])) : 'active';
    $status = $status === 'archive' || $status === 'archived' ? 'archive' : 'active';

    if ($categoryId) {
        if ($status === 'active') {
            $stmt = $pdo->prepare("
                SELECT p.*, c.category_name
                FROM Products p
                JOIN Categories c ON p.category_id = c.category_id
                WHERE p.category_id = :category_id AND p.status = :status
                ORDER BY p.product_name
            ");
            $stmt->execute(['category_id' => $categoryId, 'status' => $status]);
        } else {
            $stmt = $pdo->prepare("
                SELECT p.*, c.category_name
                FROM Products p
                JOIN Categories c ON p.category_id = c.category_id
                WHERE p.category_id = :category_id AND p.status = 'archive'
                ORDER BY p.product_name
            ");
            $stmt->execute(['category_id' => $categoryId]);
        }
    } else {
        if ($status === 'active') {
            $stmt = $pdo->prepare("
                SELECT p.*, c.category_name
                FROM Products p
                JOIN Categories c ON p.category_id = c.category_id
                WHERE p.status = :status
                ORDER BY c.category_id, p.product_name
            ");
            $stmt->execute(['status' => $status]);
        } else {
            $stmt = $pdo->query("
                SELECT p.*, c.category_name
                FROM Products p
                JOIN Categories c ON p.category_id = c.category_id
                WHERE p.status = 'archive'
                ORDER BY c.category_id, p.product_name
            ");
        }
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
