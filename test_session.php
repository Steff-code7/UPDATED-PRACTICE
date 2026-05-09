<?php
session_start();

// Simple session test
if (isset($_POST['username']) && isset($_POST['password'])) {
    // Simulate login
    $_SESSION['user_id'] = 21;
    $_SESSION['username'] = 'Stef';
    $_SESSION['full_name'] = 'Stef Admin';
    $_SESSION['role'] = 'admin';
    $_SESSION['profile_picture'] = 'images/yas_logo.png';
    $_SESSION['email'] = 'admin@test.com';
    
    echo json_encode(['success' => true, 'message' => 'Session created']);
    exit;
}

if (isset($_GET['check'])) {
    echo json_encode([
        'session_id' => session_id(),
        'session_data' => $_SESSION,
        'has_user_id' => isset($_SESSION['user_id'])
    ]);
    exit;
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Session Test</title>
</head>
<body>
    <h1>Session Test</h1>
    
    <form method="post">
        <input type="text" name="username" value="Stef" placeholder="Username">
        <input type="password" name="password" value="test" placeholder="Password">
        <button type="submit">Create Session</button>
    </form>
    
    <br><br>
    
    <a href="?check=1">Check Session</a>
    
    <br><br>
    
    <div id="result"></div>
    
    <script>
        document.querySelector('a').addEventListener('click', function(e) {
            e.preventDefault();
            fetch('?check=1')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                });
        });
    </script>
</body>
</html>
