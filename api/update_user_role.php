<?php
declare(strict_types=1);

header('Content-Type: application/json');
require_once 'session_config.php';

require_once 'db.php';
require_once 'csrf.php';
require_once 'send_welcome_email.php';

try {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['message' => 'Only admins can update user roles.']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    requireCsrfToken($data['csrf_token'] ?? null);

    $userId = isset($data['user_id']) ? (int) $data['user_id'] : 0;
    $newRole = isset($data['role']) ? strtolower(trim((string) $data['role'])) : '';

    if ($userId <= 0 || !in_array($newRole, ['customer', 'admin'], true)) {
        http_response_code(400);
        echo json_encode(['message' => 'Please provide a valid user and role.']);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT user_id, username, email, role
        FROM users
        WHERE user_id = :user_id
        LIMIT 1
    ");
    $stmt->execute(['user_id' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['message' => 'User not found.']);
        exit;
    }

    $oldRole = $user['role'];

    if ($oldRole === $newRole) {
        echo json_encode(['message' => 'User role is already set to ' . $newRole . '.']);
        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE users
        SET role = :role
        WHERE user_id = :user_id
    ");
    $stmt->execute([
        'role' => $newRole,
        'user_id' => $userId,
    ]);

    $emailSent = false;
    if ($oldRole === 'customer' && $newRole === 'admin') {
        $emailSent = sendAdminRoleEmail($user['username'], $user['email']);
    }

    echo json_encode([
        'message' => 'User role updated successfully.',
        'email_sent' => $emailSent,
    ]);
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error. Please try again.']);
}
