<?php
header('Content-Type: application/json');
session_start();

require_once 'api/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    $identifier = isset($data['identifier']) ? trim($data['identifier']) : '';
    $password   = isset($data['password'])   ? $data['password']          : '';

    if (empty($identifier) || empty($password)) {
        http_response_code(400);
        echo json_encode(['message' => 'Please enter your login details.']);
        exit;
    }

    // Find user by username OR email
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :identifier OR email = :identifier LIMIT 1");
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
    $_SESSION['user_id']  = $user['user_id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role']     = $user['role'];

    // Redirect based on role
    $redirect = $user['role'] === 'admin' ? 'adminDashboard.html' : 'customerHomePage.html';

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
