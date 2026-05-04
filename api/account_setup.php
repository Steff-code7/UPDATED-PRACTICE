<?php
/**
 * Database schema updates for account functionality
 * Run this file ONCE to update the database structure
 * Delete this file after running or add a check to prevent re-running
 */

header('Content-Type: application/json');
session_start();

require_once 'db.php';

try {
    // Check if schema update already done
    $checkColumn = $pdo->query("SHOW COLUMNS FROM users LIKE 'full_name'")->fetch();
    
    if (!$checkColumn) {
        // Alter users table
        $pdo->exec("
            ALTER TABLE users ADD COLUMN (
                full_name VARCHAR(150),
                contact_number VARCHAR(20),
                date_of_birth DATE,
                profile_picture VARCHAR(255) DEFAULT 'images/yas_logo.png',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ");
    }

    // Create addresses table if it doesn't exist
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS addresses (
            address_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            user_id INT UNSIGNED NOT NULL,
            address_type ENUM('home', 'office', 'other') DEFAULT 'home',
            address_line VARCHAR(255) NOT NULL,
            landmark VARCHAR(255),
            delivery_instructions TEXT,
            is_primary BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )
    ");

    echo json_encode(['message' => 'Database schema updated successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
}
?>
