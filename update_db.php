<?php
require_once 'api/db.php';
try {
    $pdo->exec("ALTER TABLE users MODIFY COLUMN role ENUM('admin','customer','staff') NOT NULL");
    echo "Database updated successfully. Role enum now includes 'staff'.\n";
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
}
?>