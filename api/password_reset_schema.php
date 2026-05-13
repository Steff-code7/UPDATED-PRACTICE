<?php
declare(strict_types=1);

function ensurePasswordResetColumns(PDO $pdo): void
{
    $columns = [
        'password_reset_token' => "ALTER TABLE users ADD COLUMN password_reset_token varchar(255) DEFAULT NULL",
        'password_reset_expires_at' => "ALTER TABLE users ADD COLUMN password_reset_expires_at datetime DEFAULT NULL",
        'password_reset_confirmed_at' => "ALTER TABLE users ADD COLUMN password_reset_confirmed_at datetime DEFAULT NULL",
    ];

    foreach ($columns as $column => $alterSql) {
        $stmt = $pdo->prepare("
            SELECT COUNT(*) AS column_count
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'users'
              AND COLUMN_NAME = :column_name
        ");
        $stmt->execute(['column_name' => $column]);
        $exists = (int) ($stmt->fetch()['column_count'] ?? 0) > 0;

        if (!$exists) {
            $pdo->exec($alterSql);
        }
    }
}
