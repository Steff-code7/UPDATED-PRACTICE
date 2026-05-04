<?php
require_once 'api/db.php';
try {
    $pdo->exec("ALTER TABLE users MODIFY COLUMN profile_picture VARCHAR(255) DEFAULT 'images/yas_logo.png'");
    echo 'Default updated successfully.';
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
?>