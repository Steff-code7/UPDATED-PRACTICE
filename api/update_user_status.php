<?php
declare(strict_types=1);

header('Content-Type: application/json');
require_once 'session_config.php';

require_once 'db.php';
require_once 'csrf.php';

try {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Only admins can update user status.',
        ]);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    requireCsrfToken($data['csrf_token'] ?? null);

    $userId = isset($data['user_id']) ? (int) $data['user_id'] : 0;
    $status = isset($data['status']) ? strtolower(trim((string) $data['status'])) : '';
    $validStatuses = ['active', 'inactive', 'pending'];

    if ($userId <= 0 || !in_array($status, $validStatuses, true)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please provide a valid user and status.',
        ]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT user_id FROM users WHERE user_id = :user_id LIMIT 1");
    $stmt->execute(['user_id' => $userId]);

    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'User not found.',
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE users
        SET status = :status
        WHERE user_id = :user_id
    ");
    $stmt->execute([
        'status' => $status,
        'user_id' => $userId,
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'User status updated successfully.',
        'status' => $status,
    ]);
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error. Please try again.',
    ]);
}
