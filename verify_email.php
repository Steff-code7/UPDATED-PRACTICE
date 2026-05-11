<?php
require_once 'api/session_config.php';
require_once 'api/db.php';

$token = isset($_GET['token']) ? trim($_GET['token']) : '';
if (empty($token)) {
    http_response_code(400);
    echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invalid Link</title></head><body><h1>Invalid verification link.</h1><p>Please check your email and try again.</p></body></html>';
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT user_id, username, role, status FROM users WHERE verification_token = :token LIMIT 1');
    $stmt->execute(['token' => $token]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Link Not Found</title></head><body><h1>Verification failed.</h1><p>The link is invalid or expired.</p></body></html>';
        exit;
    }

    if ($user['status'] === 'active') {
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        $redirect = $user['role'] === 'admin' ? 'adminDashboard.html' : 'customerHomePage.html';
        header('Location: ' . $redirect);
        exit;
    }

    $stmt = $pdo->prepare('UPDATE users SET status = :activeStatus, email_verified = 1, verification_token = NULL, verified_at = NOW() WHERE user_id = :user_id');
    $stmt->execute([
        'activeStatus' => 'active',
        'user_id' => $user['user_id'],
    ]);

    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];

    $redirect = $user['role'] === 'admin' ? 'adminDashboard.html' : 'customerHomePage.html';
    header('Location: ' . $redirect);
    exit;
} catch (PDOException $e) {
    http_response_code(500);
    echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Error</title></head><body><h1>Server error.</h1><p>Please try again later.</p></body></html>';
    exit;
}
