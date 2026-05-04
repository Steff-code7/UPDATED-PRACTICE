<?php
header('Content-Type: application/json');
session_start();

require_once 'api/db.php';
require_once 'api/send_welcome_email.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    $username = isset($data['username']) ? trim($data['username']) : '';
    $email    = isset($data['email'])    ? trim($data['email'])    : '';
    $password = isset($data['password']) ? $data['password']       : '';

    // Validation
    if (empty($username) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['message' => 'Please complete all signup fields.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['message' => 'Please enter a valid email address.']);
        exit;
    }

    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['message' => 'Password must be at least 6 characters.']);
        exit;
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT user_id FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['message' => 'Email is already registered.']);
        exit;
    }

    // Check if username already exists
    $stmt = $pdo->prepare("SELECT user_id FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['message' => 'Username is already taken.']);
        exit;
    }

    // Hash password and insert user
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("
        INSERT INTO users (username, email, password_hash, role, status)
        VALUES (:username, :email, :password_hash, 'customer', 'active')
    ");
    $stmt->execute([
        'username'      => $username,
        'email'         => $email,
        'password_hash' => $passwordHash
    ]);


    try {
        if (function_exists('sendWelcomeEmail')) {
            sendWelcomeEmail($username, $email);
        }
    } catch (Exception $e) {
        error_log('Signup email failed: ' . $e->getMessage());
    }

    echo json_encode(['message' => 'Account created successfully! You can now log in.']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error. Please try again.']);
}
?>
