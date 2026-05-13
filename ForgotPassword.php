<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password | Yas Milktea House</title>
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
            <h2>Forgot Password</h2>

            <div class="AUTH-INPUT">
                <i class="fa fa-at"></i>
                <input id="resetIdentifier" type="text" placeholder="Username or Email">
            </div>

            <button class="AUTH-BUTTON" id="resetRequestSubmit" type="button">SEND RESET LINK</button>
            <p class="AUTH-LOGIN-FEEDBACK" id="resetRequestFeedback" aria-live="polite"></p>
            <a href="loginSignUp.php" class="AUTH-FORGOT">Back to Login</a>
        </div>
    </div>
</section>

<script>
    const resetIdentifier = document.getElementById("resetIdentifier");
    const resetRequestSubmit = document.getElementById("resetRequestSubmit");
    const resetRequestFeedback = document.getElementById("resetRequestFeedback");

    const setButtonState = (button, isLoading, defaultText, loadingText) => {
        button.disabled = isLoading;
        button.textContent = isLoading ? loadingText : defaultText;
    };

    const requestPasswordReset = async () => {
        const identifier = resetIdentifier.value.trim();
        if (!identifier) {
            resetRequestFeedback.textContent = "Please enter your username or email.";
            return;
        }

        setButtonState(resetRequestSubmit, true, "SEND RESET LINK", "SENDING...");
        resetRequestFeedback.textContent = "";

        try {
            const tokenRes = await fetch("api/get_csrf_token.php");
            const tokenData = await tokenRes.json();
            const csrfToken = tokenData.csrf_token || "";

            const response = await fetch("api/request_password_reset.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, csrf_token: csrfToken }),
            });
            const result = await response.json();
            resetRequestFeedback.textContent = result.message || "If the account exists, a reset email has been sent.";
        } catch (error) {
            resetRequestFeedback.textContent = "Unable to connect to the server.";
        } finally {
            setButtonState(resetRequestSubmit, false, "SEND RESET LINK", "SENDING...");
        }
    };

    resetRequestSubmit.addEventListener("click", requestPasswordReset);
    resetIdentifier.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            requestPasswordReset();
        }
    });
</script>
</body>
</html>
