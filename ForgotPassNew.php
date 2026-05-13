<?php
$resetToken = isset($_GET['token']) ? trim($_GET['token']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Set New Password | Yas Milktea House</title>
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
            <h2>New Password</h2>

            <div class="AUTH-INPUT">
                <i class="fa fa-key"></i>
                <input id="newPassword" type="password" placeholder="New Password">
                <button type="button" class="password-toggle" aria-label="Toggle password visibility" data-target="newPassword"><i class="fa fa-eye"></i></button>
            </div>

            <div class="AUTH-INPUT">
                <i class="fa fa-key"></i>
                <input id="confirmNewPassword" type="password" placeholder="Confirm New Password">
                <button type="button" class="password-toggle" aria-label="Toggle confirm password visibility" data-target="confirmNewPassword"><i class="fa fa-eye"></i></button>
            </div>

            <button class="AUTH-BUTTON" id="newPasswordSubmit" type="button">SAVE PASSWORD</button>
            <p class="AUTH-LOGIN-FEEDBACK" id="newPasswordFeedback" aria-live="polite"></p>
            <a href="loginSignUp.php" class="AUTH-FORGOT">Back to Login</a>
        </div>
    </div>
</section>

<script>
    const resetToken = <?php echo json_encode($resetToken); ?>;
    const newPassword = document.getElementById("newPassword");
    const confirmNewPassword = document.getElementById("confirmNewPassword");
    const newPasswordSubmit = document.getElementById("newPasswordSubmit");
    const newPasswordFeedback = document.getElementById("newPasswordFeedback");

    const setButtonState = (button, isLoading, defaultText, loadingText) => {
        button.disabled = isLoading;
        button.textContent = isLoading ? loadingText : defaultText;
    };

    const validatePasswords = () => {
        if (!newPassword.value || !confirmNewPassword.value) {
            return false;
        }
        if (newPassword.value.length < 8) {
            newPasswordFeedback.textContent = "Password must be at least 8 characters.";
            return false;
        }
        if (newPassword.value !== confirmNewPassword.value) {
            newPasswordFeedback.textContent = "Passwords do not match.";
            return false;
        }
        newPasswordFeedback.textContent = "";
        return true;
    };

    const saveNewPassword = async () => {
        if (!resetToken) {
            newPasswordFeedback.textContent = "Invalid reset session.";
            return;
        }
        if (!validatePasswords()) {
            if (!newPasswordFeedback.textContent) {
                newPasswordFeedback.textContent = "Please complete both password fields.";
            }
            return;
        }

        setButtonState(newPasswordSubmit, true, "SAVE PASSWORD", "SAVING...");

        try {
            const tokenRes = await fetch("api/get_csrf_token.php");
            const tokenData = await tokenRes.json();
            const csrfToken = tokenData.csrf_token || "";

            const response = await fetch("api/reset_password.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: resetToken,
                    password: newPassword.value,
                    confirm_password: confirmNewPassword.value,
                    csrf_token: csrfToken,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                newPasswordFeedback.textContent = result.message || "Unable to reset password.";
                return;
            }

            newPasswordFeedback.textContent = result.message || "Password updated. Redirecting...";
            setTimeout(() => {
                window.location.href = result.redirect || "loginSignUp.php";
            }, 1200);
        } catch (error) {
            newPasswordFeedback.textContent = "Unable to connect to the server.";
        } finally {
            setButtonState(newPasswordSubmit, false, "SAVE PASSWORD", "SAVING...");
        }
    };

    newPassword.addEventListener("input", validatePasswords);
    confirmNewPassword.addEventListener("input", validatePasswords);
    newPasswordSubmit.addEventListener("click", saveNewPassword);
    [newPassword, confirmNewPassword].forEach((input) => {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                saveNewPassword();
            }
        });
    });

    document.querySelectorAll(".password-toggle").forEach((btn) => {
        const input = document.getElementById(btn.dataset.target);
        input.addEventListener("input", () => {
            const hasValue = input.value.length > 0;
            btn.classList.toggle("visible", hasValue);
            if (!hasValue) {
                input.type = "password";
                btn.querySelector("i").className = "fa fa-eye";
            }
        });
        btn.addEventListener("click", () => {
            const icon = btn.querySelector("i");
            if (input.type === "password") {
                input.type = "text";
                icon.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    });
</script>
</body>
</html>
