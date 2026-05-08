<?php
header('Content-Type: application/json');
session_start();

require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';

    switch ($action) {
        case 'get_all':
            // Get all addresses
            $stmt = $pdo->prepare("
                SELECT * FROM addresses 
                WHERE user_id = :user_id
                ORDER BY is_primary DESC, updated_at DESC
            ");
            $stmt->execute(['user_id' => $user_id]);
            echo json_encode([
                'success' => true,
                'addresses' => $stmt->fetchAll()
            ]);
            break;

        case 'add':
            // Add new address
            $stmt = $pdo->prepare("
                INSERT INTO addresses (user_id, address_type, house_no, street, barangay, city, province, address_line, landmark, delivery_instructions, is_primary)
                VALUES (:user_id, :type, :house_no, :street, :barangay, :city, :province, :address, :landmark, :instructions, :is_primary)
            ");
            $stmt->execute([
                'user_id' => $user_id,
                'type' => $data['address_type'] ?? 'home',
                'house_no' => $data['house_no'] ?? null,
                'street' => $data['street'] ?? null,
                'barangay' => $data['barangay'] ?? null,
                'city' => $data['city'] ?? null,
                'province' => $data['province'] ?? null,
                'address' => $data['address_line'] ?? '',
                'landmark' => $data['landmark'] ?? null,
                'instructions' => $data['delivery_instructions'] ?? null,
                'is_primary' => $data['is_primary'] ?? 0
            ]);
            
            // If this is primary, unset other addresses as primary
            if ($data['is_primary']) {
                $stmt = $pdo->prepare("
                    UPDATE addresses 
                    SET is_primary = FALSE 
                    WHERE user_id = :user_id AND address_id != LAST_INSERT_ID()
                ");
                $stmt->execute(['user_id' => $user_id]);
            }

            echo json_encode([
                'success' => true,
                'message' => 'Address added',
                'address_id' => $pdo->lastInsertId()
            ]);
            break;

        case 'update':
            // Update address
            $addressId = $data['address_id'] ?? 0;
            
            // Verify address belongs to user
            $verify = $pdo->prepare("SELECT user_id FROM addresses WHERE address_id = :id");
            $verify->execute(['id' => $addressId]);
            $address = $verify->fetch();

            if (!$address || $address['user_id'] != $user_id) {
                http_response_code(403);
                echo json_encode(['message' => 'Forbidden']);
                exit;
            }

            $stmt = $pdo->prepare("
                UPDATE addresses 
                SET address_type = :type,
                    house_no = :house_no,
                    street = :street,
                    barangay = :barangay,
                    city = :city,
                    province = :province,
                    address_line = :address,
                    landmark = :landmark,
                    delivery_instructions = :instructions,
                    is_primary = :is_primary
                WHERE address_id = :id
            ");
            $stmt->execute([
                'type' => $data['address_type'] ?? 'home',
                'house_no' => $data['house_no'] ?? null,
                'street' => $data['street'] ?? null,
                'barangay' => $data['barangay'] ?? null,
                'city' => $data['city'] ?? null,
                'province' => $data['province'] ?? null,
                'address' => $data['address_line'] ?? '',
                'landmark' => $data['landmark'] ?? null,
                'instructions' => $data['delivery_instructions'] ?? null,
                'is_primary' => $data['is_primary'] ?? 0,
                'id' => $addressId
            ]);

            // If this is primary, unset other addresses as primary
            if ($data['is_primary']) {
                $stmt = $pdo->prepare("
                    UPDATE addresses 
                    SET is_primary = FALSE 
                    WHERE user_id = :user_id AND address_id != :id
                ");
                $stmt->execute(['user_id' => $user_id, 'id' => $addressId]);
            }

            echo json_encode(['success' => true, 'message' => 'Address updated']);
            break;

        case 'delete':
            // Delete address
            $addressId = $data['address_id'] ?? 0;

            // Verify address belongs to user
            $verify = $pdo->prepare("SELECT user_id FROM addresses WHERE address_id = :id");
            $verify->execute(['id' => $addressId]);
            $address = $verify->fetch();

            if (!$address || $address['user_id'] != $user_id) {
                http_response_code(403);
                echo json_encode(['message' => 'Forbidden']);
                exit;
            }

            $stmt = $pdo->prepare("DELETE FROM addresses WHERE address_id = :id");
            $stmt->execute(['id' => $addressId]);
            echo json_encode(['success' => true, 'message' => 'Address deleted']);
            break;

        case 'set_primary':
            // Set as primary address
            $addressId = $data['address_id'] ?? 0;

            // Verify address belongs to user
            $verify = $pdo->prepare("SELECT user_id FROM addresses WHERE address_id = :id");
            $verify->execute(['id' => $addressId]);
            $address = $verify->fetch();

            if (!$address || $address['user_id'] != $user_id) {
                http_response_code(403);
                echo json_encode(['message' => 'Forbidden']);
                exit;
            }

            // Unset all other addresses as primary
            $stmt = $pdo->prepare("UPDATE addresses SET is_primary = FALSE WHERE user_id = :user_id");
            $stmt->execute(['user_id' => $user_id]);

            // Set this as primary
            $stmt = $pdo->prepare("UPDATE addresses SET is_primary = TRUE WHERE address_id = :id");
            $stmt->execute(['id' => $addressId]);

            echo json_encode(['success' => true, 'message' => 'Primary address set']);
            break;

        default:
            http_response_code(400);
            echo json_encode(['message' => 'Invalid action']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>
