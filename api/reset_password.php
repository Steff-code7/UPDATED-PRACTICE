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
    $password = isset($data['password']) ? (string) $data['password'] : '';
    $confirmPassword = isset($data['confirm_password']) ? (string) $data['confirm_password'] : '';

    if ($token === '' || $password === '' || $confirmPassword === '') {
        http_response_code(400);
        echo json_encode(['message' => 'Please complete all password fields.']);
        exit;
    }

    if (strlen($password) < 8) {
        http_response_code(400);
        echo json_encode(['message' => 'Password must be at least 8 characters.']);
        exit;
    }

    if ($password !== $confirmPassword) {
        http_response_code(400);
        echo json_encode(['message' => 'Passwords do not match.']);
        exit;
    }

    ensurePasswordResetColumns($pdo);

    $stmt = $pdo->prepare("
        SELECT user_id
        FROM users
        WHERE password_reset_token = :token
          AND password_reset_expires_at > NOW()
          AND password_reset_confirmed_at IS NOT NULL
          AND status = 'active'
        LIMIT 1
    ");
    $stmt->execute(['token' => $token]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(400);
        echo json_encode(['message' => 'This reset session is invalid or expired.']);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("
        UPDATE users
        SET password_hash = :password_hash,
            password_reset_token = NULL,
            password_reset_expires_at = NULL,
            password_reset_confirmed_at = NULL
        WHERE user_id = :user_id
    ");
    $stmt->execute([
        'password_hash' => $passwordHash,
        'user_id' => $user['user_id'],
    ]);

    echo json_encode([
        'message' => 'Password updated successfully. Please log in with your new password.',
        'redirect' => 'loginSignUp.php',
    ]);
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error. Please try again.']);
}
