<?php
header('Content-Type: application/json');
session_start();

require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit;
}

try {
    $user_id = $_SESSION['user_id'];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Handle file upload
        if (!isset($_FILES['profile_picture'])) {
            http_response_code(400);
            echo json_encode(['message' => 'No file uploaded']);
            exit;
        }

        $file = $_FILES['profile_picture'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $maxSize = 5 * 1024 * 1024; // 5MB

        // Validate file
        if (!in_array($file['type'], $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid file type. Only JPG, PNG, GIF, and WebP allowed']);
            exit;
        }

        if ($file['size'] > $maxSize) {
            http_response_code(400);
            echo json_encode(['message' => 'File too large. Maximum 5MB']);
            exit;
        }

        // Create unique filename
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'profile_' . $user_id . '_' . time() . '.' . $ext;
        $uploadPath = dirname(__DIR__) . '/images/' . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to upload file']);
            exit;
        }

        // Update database
        $imagePath = 'images/' . $filename;
        $stmt = $pdo->prepare("UPDATE users SET profile_picture = :picture WHERE user_id = :user_id");
        $stmt->execute(['picture' => $imagePath, 'user_id' => $user_id]);

        echo json_encode([
            'success' => true,
            'message' => 'Profile picture updated',
            'profile_picture' => $imagePath
        ]);

    } else {
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
}
?>
