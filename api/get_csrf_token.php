<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once 'csrf.php';

echo json_encode([
    'success' => true,
    'csrf_token' => generateCsrfToken()
]);
?>
