<?php
header('Content-Type: text/html; charset=utf-8');
session_start();

require_once 'api/db.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: loginSignUp.html');
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $pdo->prepare(
        "SELECT user_id, username, email, full_name, contact_number, date_of_birth, profile_picture, created_at FROM users WHERE user_id = :user_id"
    );
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch();

    if (!$user) {
        header('Location: loginSignUp.html');
        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT * FROM addresses WHERE user_id = :user_id AND is_primary = TRUE LIMIT 1"
    );
    $stmt->execute(['user_id' => $user_id]);
    $primaryAddress = $stmt->fetch();

    $stmt = $pdo->prepare(
        "SELECT COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_spent FROM orders WHERE user_id = :user_id"
    );
    $stmt->execute(['user_id' => $user_id]);
    $stats = $stmt->fetch();

    $stmt = $pdo->prepare(
        "SELECT o.order_id, o.order_date, o.total_amount, o.status,
                GROUP_CONCAT(CONCAT(p.product_name, ' (', oi.quantity, 'x)') SEPARATOR ', ') as items
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.product_id
            WHERE o.user_id = :user_id AND o.order_date != '0000-00-00 00:00:00'
            GROUP BY o.order_id
            ORDER BY o.order_date DESC LIMIT 4"
    );
    $stmt->execute(['user_id' => $user_id]);
    $recentOrders = $stmt->fetchAll();

    $profilePicture = $user['profile_picture'] ?: 'images/yas_logo.png';
    $memberSince = date('F j, Y', strtotime($user['created_at']));
} catch (Exception $e) {
    header('Location: loginSignUp.html');
    exit;
}
?>