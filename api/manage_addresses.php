<?php
header('Content-Type: application/json');
require_once 'session_config.php';
require_once 'db.php';
require_once 'csrf.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';

    if (in_array($action, ['add', 'update', 'delete', 'set_primary'])) {
        requireCsrfToken($data['csrf_token'] ?? null);
    }

    switch ($action) {

        case 'get_all':
            $stmt = $pdo->prepare("
                SELECT
                    ad.address_details_id AS address_id,
                    ad.user_id,
                    ad.address_type,
                    ad.landmark,
                    ad.delivery_instructions,
                    ad.is_primary,
                    ad.created_at,
                    ad.updated_at,
                    al.location_id,
                    al.house_no,
                    al.street,
                    al.barangay,
                    al.city,
                    al.province,
                    al.address_line
                FROM address_details ad
                JOIN address_locations al ON ad.location_id = al.location_id
                WHERE ad.user_id = :user_id
                ORDER BY ad.is_primary DESC, ad.updated_at DESC
            ");
            $stmt->execute(['user_id' => $user_id]);
            echo json_encode(['success' => true, 'addresses' => $stmt->fetchAll()]);
            break;

        case 'add':
            $houseNo     = $data['house_no']    ?? null;
            $street      = $data['street']      ?? null;
            $barangay    = $data['barangay']    ?? null;
            $city        = $data['city']        ?? null;
            $province    = $data['province']    ?? null;
            $addressLine = $data['address_line'] ?? '';

            // Reuse existing location if identical
            $locStmt = $pdo->prepare("
                SELECT location_id FROM address_locations
                WHERE LOWER(house_no) <=> LOWER(:house_no)
                  AND LOWER(street)   <=> LOWER(:street)
                  AND LOWER(barangay) <=> LOWER(:barangay)
                  AND LOWER(city)     <=> LOWER(:city)
                  AND LOWER(province) <=> LOWER(:province)
                LIMIT 1
            ");
            $locStmt->execute([
                'house_no' => $houseNo, 'street' => $street,
                'barangay' => $barangay, 'city' => $city, 'province' => $province,
            ]);
            $locationId = $locStmt->fetchColumn();

            if (!$locationId) {
                $pdo->prepare("
                    INSERT INTO address_locations (house_no, street, barangay, city, province, address_line)
                    VALUES (:house_no, :street, :barangay, :city, :province, :address_line)
                ")->execute([
                    'house_no' => $houseNo, 'street' => $street,
                    'barangay' => $barangay, 'city' => $city,
                    'province' => $province, 'address_line' => $addressLine,
                ]);
                $locationId = $pdo->lastInsertId();
            }

            $pdo->prepare("
                INSERT INTO address_details (user_id, location_id, address_type, landmark, delivery_instructions, is_primary)
                VALUES (:user_id, :location_id, :type, :landmark, :instructions, :is_primary)
            ")->execute([
                'user_id'      => $user_id,
                'location_id'  => $locationId,
                'type'         => $data['address_type'] ?? 'home',
                'landmark'     => $data['landmark'] ?? null,
                'instructions' => $data['delivery_instructions'] ?? null,
                'is_primary'   => $data['is_primary'] ?? 0,
            ]);
            $newId = $pdo->lastInsertId();

            if (!empty($data['is_primary'])) {
                $pdo->prepare("
                    UPDATE address_details SET is_primary = FALSE
                    WHERE user_id = :user_id AND address_details_id != :id
                ")->execute(['user_id' => $user_id, 'id' => $newId]);
            }

            echo json_encode(['success' => true, 'message' => 'Address added', 'address_id' => $newId]);
            break;

        case 'update':
            $addressId = $data['address_id'] ?? 0;

            $verify = $pdo->prepare("SELECT user_id FROM address_details WHERE address_details_id = :id");
            $verify->execute(['id' => $addressId]);
            $existing = $verify->fetch();

            if (!$existing || $existing['user_id'] != $user_id) {
                http_response_code(403);
                echo json_encode(['message' => 'Forbidden']);
                exit;
            }

            $houseNo     = $data['house_no']    ?? null;
            $street      = $data['street']      ?? null;
            $barangay    = $data['barangay']    ?? null;
            $city        = $data['city']        ?? null;
            $province    = $data['province']    ?? null;
            $addressLine = $data['address_line'] ?? '';

            $locStmt = $pdo->prepare("
                SELECT location_id FROM address_locations
                WHERE LOWER(house_no) <=> LOWER(:house_no)
                  AND LOWER(street)   <=> LOWER(:street)
                  AND LOWER(barangay) <=> LOWER(:barangay)
                  AND LOWER(city)     <=> LOWER(:city)
                  AND LOWER(province) <=> LOWER(:province)
                LIMIT 1
            ");
            $locStmt->execute([
                'house_no' => $houseNo, 'street' => $street,
                'barangay' => $barangay, 'city' => $city, 'province' => $province,
            ]);
            $locationId = $locStmt->fetchColumn();

            if (!$locationId) {
                $pdo->prepare("
                    INSERT INTO address_locations (house_no, street, barangay, city, province, address_line)
                    VALUES (:house_no, :street, :barangay, :city, :province, :address_line)
                ")->execute([
                    'house_no' => $houseNo, 'street' => $street,
                    'barangay' => $barangay, 'city' => $city,
                    'province' => $province, 'address_line' => $addressLine,
                ]);
                $locationId = $pdo->lastInsertId();
            }

            $pdo->prepare("
                UPDATE address_details
                SET location_id = :location_id,
                    address_type = :type,
                    landmark = :landmark,
                    delivery_instructions = :instructions,
                    is_primary = :is_primary
                WHERE address_details_id = :id
            ")->execute([
                'location_id'  => $locationId,
                'type'         => $data['address_type'] ?? 'home',
                'landmark'     => $data['landmark'] ?? null,
                'instructions' => $data['delivery_instructions'] ?? null,
                'is_primary'   => $data['is_primary'] ?? 0,
                'id'           => $addressId,
            ]);

            if (!empty($data['is_primary'])) {
                $pdo->prepare("
                    UPDATE address_details SET is_primary = FALSE
                    WHERE user_id = :user_id AND address_details_id != :id
                ")->execute(['user_id' => $user_id, 'id' => $addressId]);
            }

            echo json_encode(['success' => true, 'message' => 'Address updated']);
            break;

        case 'delete':
            $addressId = $data['address_id'] ?? 0;

            $verify = $pdo->prepare("SELECT user_id FROM address_details WHERE address_details_id = :id");
            $verify->execute(['id' => $addressId]);
            $existing = $verify->fetch();

            if (!$existing || $existing['user_id'] != $user_id) {
                http_response_code(403);
                echo json_encode(['message' => 'Forbidden']);
                exit;
            }

            $pdo->prepare("DELETE FROM address_details WHERE address_details_id = :id")
                ->execute(['id' => $addressId]);

            echo json_encode(['success' => true, 'message' => 'Address deleted']);
            break;

        case 'set_primary':
            $addressId = $data['address_id'] ?? 0;

            $verify = $pdo->prepare("SELECT user_id FROM address_details WHERE address_details_id = :id");
            $verify->execute(['id' => $addressId]);
            $existing = $verify->fetch();

            if (!$existing || $existing['user_id'] != $user_id) {
                http_response_code(403);
                echo json_encode(['message' => 'Forbidden']);
                exit;
            }

            $pdo->prepare("UPDATE address_details SET is_primary = FALSE WHERE user_id = :user_id")
                ->execute(['user_id' => $user_id]);

            $pdo->prepare("UPDATE address_details SET is_primary = TRUE WHERE address_details_id = :id")
                ->execute(['id' => $addressId]);

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
