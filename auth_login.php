<?php
header('Content-Type: application/json');
require_once 'api/session_config.php';

require_once 'api/db.php';
require_once 'api/csrf.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    requireCsrfToken($data['csrf_token'] ?? null);

    $identifier = isset($data['identifier']) ? trim($data['identifier']) : '';
    $password   = isset($data['password'])   ? $data['password']          : '';

    if (empty($identifier) || empty($password)) {
        http_response_code(400);
        echo json_encode(['message' => 'Please enter your login details.']);
        exit;
    }

    // Find user by username (case-sensitive) OR email (case-insensitive)
    $stmt = $pdo->prepare("SELECT * FROM users WHERE BINARY username = :identifier OR LOWER(email) = LOWER(:identifier) LIMIT 1");
    $stmt->execute(['identifier' => $identifier]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid username or password.']);
        exit;
    }

    if ($user['status'] !== 'active') {
        if ($user['status'] === 'pending') {
            http_response_code(403);
            echo json_encode(['message' => 'Please verify your email before logging in.']);
            exit;
        }

        http_response_code(403);
        echo json_encode(['message' => 'Your account is inactive. Contact support.']);
        exit;
    }

    // Save session
    session_regenerate_id(true);
    $_SESSION['user_id']          = $user['user_id'];
    $_SESSION['username']         = $user['username'];
    $_SESSION['role']             = $user['role'];
    $_SESSION['full_name']        = $user['full_name'];
    $_SESSION['profile_picture']  = $user['profile_picture'];
    $_SESSION['last_activity']    = time();

    // Redirect based on role
    $redirect = in_array($user['role'], ['admin', 'staff']) ? 'adminDashboard.html' : 'customerHomePage.html';

    echo json_encode([
        'message'  => 'Login successful.',
        'redirect' => $redirect,
        'role'     => $user['role'],
        'username' => $user['username']
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error. Please try again.']);
}
?>
