<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {
    $customersStmt = $pdo->prepare("
        SELECT 
            u.user_id,
            u.username,
            u.full_name,
            u.email,
            u.role,
            u.status,
            u.email_verified,
            u.contact_number,
            u.profile_picture,
            u.created_at,
            COALESCE(os.total_orders, 0) AS total_orders,
            COALESCE(os.total_spent, 0) AS total_spent,
            COALESCE(al.addresses, '') AS addresses
        FROM users u
        LEFT JOIN (
            SELECT
                user_id,
                COUNT(order_id) AS total_orders,
                COALESCE(SUM(CASE WHEN status <> 'cancelled' THEN total_amount ELSE 0 END), 0) AS total_spent
            FROM orders
            GROUP BY user_id
        ) os ON u.user_id = os.user_id
        LEFT JOIN (
            SELECT
                user_id,
                GROUP_CONCAT(
                    CONCAT_WS(
                        ' ',
                        NULLIF(address_type, ''),
                        NULLIF(house_no, ''),
                        NULLIF(street, ''),
                        NULLIF(barangay, ''),
                        NULLIF(city, ''),
                        NULLIF(province, ''),
                        NULLIF(address_line, '')
                    )
                    ORDER BY is_primary DESC, created_at DESC
                    SEPARATOR '||'
                ) AS addresses
            FROM addresses
            GROUP BY user_id
        ) al ON u.user_id = al.user_id
        ORDER BY u.created_at DESC
    ");
    
    $customersStmt->execute();
    $customers = $customersStmt->fetchAll();

    echo json_encode([
        'success' => true,
        'users' => $customers,
        'customers' => $customers,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching customers: ' . $e->getMessage(),
    ]);
}
?>
