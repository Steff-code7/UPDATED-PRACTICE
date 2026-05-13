<?php
$resetToken = isset($_GET['token']) ? trim($_GET['token']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Password Reset | Yas Milktea House</title>
    <link rel="icon" type="image/png" href="images/footer_logo.png">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="..." crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Momo+Trust+Display&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="auth-page">
<header class="navbar">
    <div class="logo">
        <a href="index.html" class="auth-brand-link">
            <img src="images/yas_logo.png" alt="logo">
        </a>
        <a href="index.html" class="auth-brand-link">
            <span class="auth-brand-text">YAS Milktea House</span>
        </a>
    </div>
    <nav class="nav-links">
        <a href="index.html">home</a>
        <a href="aboutUs.html">about</a>
        <a href="menu.php">menu</a>
    </nav>
</header>

<section class="AUTH-WRAP">
    <div class="AUTH-BG">
        <img src="images/Login_SignUp_bg.png" alt="YAS Login-Signup background" class="AUTH-BG-IMG">
    </div>

    <div class="AUTH-PANEL forgot-panel">
        <div class="FORM forgot-form">
            <h2>Confirm Request</h2>

            <div class="AUTH-INPUT">
                <i class="fa fa-at"></i>
                <input id="confirmIdentifier" type="text" placeholder="Username or Email">
            </div>

            <button class="AUTH-BUTTON" id="confirmResetSubmit" type="button">CONFIRM RESET</button>
            <p class="AUTH-LOGIN-FEEDBACK" id="confirmResetFeedback" aria-live="polite"></p>
            <a href="ForgotPassword.php" class="AUTH-FORGOT">Request a new link</a>
        </div>
    </div>
</section>

<script>
    const resetToken = <?php echo json_encode($resetToken); ?>;
    const confirmIdentifier = document.getElementById("confirmIdentifier");
    const confirmResetSubmit = document.getElementById("confirmResetSubmit");
    const confirmResetFeedback = document.getElementById("confirmResetFeedback");

    const setButtonState = (button, isLoading, defaultText, loadingText) => {
        button.disabled = isLoading;
        button.textContent = isLoading ? loadingText : defaultText;
    };

    const confirmPasswordReset = async () => {
        const identifier = confirmIdentifier.value.trim();
        if (!resetToken) {
            confirmResetFeedback.textContent = "Invalid reset link.";
            return;
        }
        if (!identifier) {
            confirmResetFeedback.textContent = "Please enter your username or email.";
            return;
        }

        setButtonState(confirmResetSubmit, true, "CONFIRM RESET", "CHECKING...");
        confirmResetFeedback.textContent = "";

        try {
            const tokenRes = await fetch("api/get_csrf_token.php");
            const tokenData = await tokenRes.json();
            const csrfToken = tokenData.csrf_token || "";

            const response = await fetch("api/confirm_password_reset.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: resetToken, identifier, csrf_token: csrfToken }),
            });
            const result = await response.json();

            if (!response.ok) {
                confirmResetFeedback.textContent = result.message || "Unable to confirm reset request.";
                return;
            }

            window.location.href = result.redirect || "ForgotPassNew.php";
        } catch (error) {
            confirmResetFeedback.textContent = "Unable to connect to the server.";
        } finally {
            setButtonState(confirmResetSubmit, false, "CONFIRM RESET", "CHECKING...");
        }
    };

    confirmResetSubmit.addEventListener("click", confirmPasswordReset);
    confirmIdentifier.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            confirmPasswordReset();
        }
    });
</script>
</body>
</html>
