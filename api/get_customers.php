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
            (u.verified_at IS NOT NULL) AS email_verified,
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
                ad.user_id,
                GROUP_CONCAT(
                    CONCAT_WS(
                        ' ',
                        NULLIF(ad.address_type, ''),
                        NULLIF(al.house_no, ''),
                        NULLIF(al.street, ''),
                        NULLIF(al.barangay, ''),
                        NULLIF(al.city, ''),
                        NULLIF(al.province, ''),
                        NULLIF(al.address_line, '')
                    )
                    ORDER BY ad.is_primary DESC, ad.created_at DESC
                    SEPARATOR '||'
                ) AS addresses
            FROM address_details ad
            JOIN address_locations al ON ad.location_id = al.location_id
            GROUP BY ad.user_id
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
