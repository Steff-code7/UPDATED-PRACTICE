<?php
declare(strict_types=1);

header('Content-Type: application/json');
require_once 'session_config.php';
require_once 'db.php';
require_once 'csrf.php';
require_once 'password_reset_schema.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    requireCsrfToken($data['csrf_token'] ?? null);

    $token = isset($data['token']) ? trim((string) $data['token']) : '';
    $identifier = isset($data['identifier']) ? trim((string) $data['identifier']) : '';

    if ($token === '' || $identifier === '') {
        http_response_code(400);
        echo json_encode(['message' => 'Please complete the confirmation fields.']);
        exit;
    }

    ensurePasswordResetColumns($pdo);

    $stmt = $pdo->prepare("
        SELECT user_id, username, email
        FROM users
        WHERE password_reset_token = :token
          AND password_reset_expires_at > NOW()
          AND status = 'active'
        LIMIT 1
    ");
    $stmt->execute(['token' => $token]);
    $user = $stmt->fetch();

    if (!$user || !hash_equals(strtolower($user['username']), strtolower($identifier)) && !hash_equals(strtolower($user['email']), strtolower($identifier))) {
        http_response_code(400);
        echo json_encode(['message' => 'The reset link or account information is invalid.']);
        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE users
        SET password_reset_confirmed_at = NOW()
        WHERE user_id = :user_id
    ");
    $stmt->execute(['user_id' => $user['user_id']]);

    echo json_encode([
        'message' => 'Reset request confirmed.',
        'redirect' => 'ForgotPassNew.php?token=' . urlencode($token),
    ]);
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error. Please try again.']);
}
