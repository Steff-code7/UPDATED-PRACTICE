<?php
header('Content-Type: application/json');
require_once 'session_config.php';

require_once 'db.php';
require_once 'csrf.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $data = json_decode(file_get_contents('php://input'), true);
    requireCsrfToken($data['csrf_token'] ?? null);

    // Get current profile picture path
    $stmt = $pdo->prepare("SELECT profile_picture FROM users WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    // Delete the file if it exists and is not the default
    if ($user['profile_picture'] && $user['profile_picture'] !== 'images/yas_logo.png') {
        $filePath = __DIR__ . '/../' . $user['profile_picture'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    // Reset to default
    $stmt = $pdo->prepare("UPDATE users SET profile_picture = 'images/yas_logo.png' WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $user_id]);

    echo json_encode([
        'success' => true,
        'message' => 'Profile picture removed',
        'profile_picture' => 'images/yas_logo.png'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
