<?php
require_once 'api/db.php';
try {
    $stmt = $pdo->prepare('UPDATE users SET profile_picture = ? WHERE profile_picture IS NULL');
    $stmt->execute(['images/yas_logo.png']);
    echo 'Updated ' . $stmt->rowCount() . ' users with default profile picture.';
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
?>