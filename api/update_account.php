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
    $method = $_SERVER['REQUEST_METHOD'];
    $data = json_decode(file_get_contents('php://input'), true);

    if ($method === 'POST') {
        requireCsrfToken($data['csrf_token'] ?? null);
        $action = $data['action'] ?? '';

        switch ($action) {
            case 'update_profile':
                // Update full name, contact number, date of birth
                $stmt = $pdo->prepare("
                    UPDATE users 
                    SET full_name = :full_name,
                        contact_number = :contact_number,
                        date_of_birth = :date_of_birth
                    WHERE user_id = :user_id
                ");
                $stmt->execute([
                    'full_name' => $data['full_name'] ?? null,
                    'contact_number' => $data['contact_number'] ?? null,
                    'date_of_birth' => $data['date_of_birth'] ?? null,
                    'user_id' => $user_id
                ]);
                echo json_encode(['success' => true, 'message' => 'Profile updated']);
                break;

            case 'update_email':
                // Update email
                $newEmail = $data['email'] ?? '';
                
                // Check if email already exists
                $checkEmail = $pdo->prepare("SELECT user_id FROM users WHERE email = :email AND user_id != :user_id");
                $checkEmail->execute(['email' => $newEmail, 'user_id' => $user_id]);
                
                if ($checkEmail->fetch()) {
                    http_response_code(400);
                    echo json_encode(['message' => 'Email already in use']);
                    exit;
                }

                $stmt = $pdo->prepare("UPDATE users SET email = :email WHERE user_id = :user_id");
                $stmt->execute(['email' => $newEmail, 'user_id' => $user_id]);
                echo json_encode(['success' => true, 'message' => 'Email updated. Please log in again with your new email.']);
                break;

            case 'change_password':
                $oldPassword = $data['old_password'] ?? '';
                $newPassword = $data['new_password'] ?? '';
                $confirmPassword = $data['confirm_password'] ?? '';

                // Get current password hash
                $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE user_id = :user_id");
                $stmt->execute(['user_id' => $user_id]);
                $user = $stmt->fetch();

                // Verify old password
                if (!password_verify($oldPassword, $user['password_hash'])) {
                    http_response_code(400);
                    echo json_encode(['message' => 'Current password is incorrect']);
                    exit;
                }

                // Verify new password matches confirm
                if ($newPassword !== $confirmPassword) {
                    http_response_code(400);
                    echo json_encode(['message' => 'New passwords do not match']);
                    exit;
                }

                // Update password
                $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
                $stmt = $pdo->prepare("UPDATE users SET password_hash = :password WHERE user_id = :user_id");
                $stmt->execute(['password' => $hashedPassword, 'user_id' => $user_id]);
                echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
                break;

            case 'update_username':
                $newUsername = $data['username'] ?? '';

                // Check if username already exists
                $checkUsername = $pdo->prepare("SELECT user_id FROM users WHERE username = :username AND user_id != :user_id");
                $checkUsername->execute(['username' => $newUsername, 'user_id' => $user_id]);

                if ($checkUsername->fetch()) {
                    http_response_code(400);
                    echo json_encode(['message' => 'Username already taken']);
                    exit;
                }

                $stmt = $pdo->prepare("UPDATE users SET username = :username WHERE user_id = :user_id");
                $stmt->execute(['username' => $newUsername, 'user_id' => $user_id]);
                $_SESSION['username'] = $newUsername;
                echo json_encode(['success' => true, 'message' => 'Username updated. Please log in again with your new username.']);
                break;

            default:
                http_response_code(400);
                echo json_encode(['message' => 'Invalid action']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>
