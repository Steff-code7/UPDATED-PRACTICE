<?php
declare(strict_types=1);

header('Content-Type: application/json');
require_once 'session_config.php';
require_once 'db.php';
require_once 'csrf.php';
require_once 'password_reset_schema.php';
require_once 'send_welcome_email.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    requireCsrfToken($data['csrf_token'] ?? null);

    $identifier = isset($data['identifier']) ? trim((string) $data['identifier']) : '';

    if ($identifier === '') {
        http_response_code(400);
        echo json_encode(['message' => 'Please enter your username or email.']);
        exit;
    }

    ensurePasswordResetColumns($pdo);

    $stmt = $pdo->prepare("
        SELECT user_id, username, email, status
        FROM users
        WHERE username = :identifier OR email = :identifier
        LIMIT 1
    ");
    $stmt->execute(['identifier' => $identifier]);
    $user = $stmt->fetch();

    $genericMessage = 'If an account matches that username or email, a password reset link has been sent.';

    if (!$user || $user['status'] !== 'active') {
        echo json_encode(['message' => $genericMessage]);
        exit;
    }

    $resetToken = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("
        UPDATE users
        SET password_reset_token = :token,
            password_reset_expires_at = DATE_ADD(NOW(), INTERVAL 1 HOUR),
            password_reset_confirmed_at = NULL
        WHERE user_id = :user_id
    ");
    $stmt->execute([
        'token' => $resetToken,
        'user_id' => $user['user_id'],
    ]);

    sendPasswordResetEmail($user['username'], $user['email'], $resetToken);

    echo json_encode(['message' => $genericMessage]);
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error. Please try again.']);
}
