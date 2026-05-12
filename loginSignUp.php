<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login/Sign up | Yas Milktea House</title>
    <link rel="icon" type="image/png" href="images/footer_logo.png">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="..." crossorigin="anonymous">
    <link rel="stylesheet" href="https://www.shapedivider.app">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Momo+Trust+Display&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>


<body class="auth-page">


<!-- NAVBAR -->
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


<!-- MAIN AUTH -->
<section class="AUTH-WRAP">


<!-- BACKGROUND -->
    <div class="AUTH-BG">
        <img src="images/Login_SignUp_bg.png" alt="YAS Login-Signup background" class="AUTH-BG-IMG">
    </div>


<!-- LEFT TEXT (SIGNUP STATE) -->
    <div class="AUTH-TEXT LEFT">
        <h1>Hello,<br><span>Customer!</span></h1>
        <p>Create an account to order your favorite milk tea and snacks anytime.</p>


<p class="switch-copy">Already have an account?</p>
        <button id="goLogin" class="AUTH-OUTLINE">LOGIN</button>
    </div>


<!-- RIGHT TEXT (LOGIN STATE) -->
    <div class="AUTH-TEXT RIGHT">
        <h1>Welcome<br><span>Back!</span></h1>
        <p>Sign in to continue ordering your favorite Yas Milktea drinks.</p>


<p class="switch-copy">Don't have an account yet?</p>
        <button id="goSignup" class="AUTH-OUTLINE">SIGN UP</button>
    </div>


<!-- SLIDING PANEL -->
    <div class="AUTH-PANEL" id="panel">


<!-- SIGNUP FORM -->
        <div class="FORM signup">
            <h2>Create Account</h2>


<div class="AUTH-INPUT">
                <i class="fa fa-user"></i>
                <input id="signupUsername" type="text" placeholder="Username">
            </div>


<div class="AUTH-INPUT">
                <i class="fa fa-at"></i>
                <input id="signupEmail" type="email" placeholder="Email">
            </div>


<div class="AUTH-INPUT">
                <i class="fa fa-key"></i>
                <input id="signupPassword" type="password" placeholder="Password">
                <button type="button" class="password-toggle" aria-label="Toggle password visibility" data-target="signupPassword"><i class="fa fa-eye"></i></button>
            </div>


<div class="AUTH-INPUT">
                <i class="fa fa-key"></i>
                <input id="signupConfirmPassword" type="password" placeholder="Confirm Password">
                <button type="button" class="password-toggle" aria-label="Toggle confirm password visibility" data-target="signupConfirmPassword"><i class="fa fa-eye"></i></button>
            </div>


<button class="AUTH-BUTTON" id="signupSubmit" type="button">SIGN UP</button>


<p class="AUTH-LOGIN-FEEDBACK" id="signupFeedback" aria-live="polite"></p>
        </div>


<!-- LOGIN FORM -->
        <div class="FORM login">
            <h2>Login</h2>


<div class="AUTH-INPUT">
                <i class="fa fa-at"></i>
                <input id="loginIdentifier" type="text" placeholder="Username or Email">
            </div>


<div class="AUTH-INPUT">
                <i class="fa fa-key"></i>
                <input id="loginPassword" type="password" placeholder="Password">
                <button type="button" class="password-toggle" aria-label="Toggle password visibility" data-target="loginPassword"><i class="fa fa-eye"></i></button>
            </div>


<button class="AUTH-BUTTON" id="loginSubmit" type="button">LOGIN</button>


<p class="AUTH-LOGIN-FEEDBACK" id="loginFeedback" aria-live="polite"></p>


<a href="index.html#footer" class="AUTH-FORGOT">Forgot Password</a>
        </div>


</div>


</section>

<!-- VERIFICATION SUCCESS MODAL -->
<div id="verificationModal" class="MODAL" hidden>
    <div class="MODAL-CONTENT">
        <div class="MODAL-HEADER">
            <h2>Check Your Email</h2>
            <button class="MODAL-CLOSE" type="button" data-close-verification aria-label="Close verification message">&times;</button>
        </div>
        <div class="MODAL-BODY">
            <div class="MODAL-ICON">
                <i class="fas fa-envelope-circle-check"></i>
            </div>
            <p class="MODAL-MESSAGE">
                Account created successfully!
            </p>
            <p class="MODAL-INSTRUCTION">
                Please check your email for a confirmation link to verify your account.
            </p>
        </div>
        <div class="MODAL-FOOTER">
            <button class="MODAL-BUTTON" type="button" data-close-verification>Got it</button>
        </div>
    </div>
</div>

</section>

<!-- SCRIPT -->
<script>
    const panel = document.getElementById("panel");
    const goLogin = document.getElementById("goLogin");
    const goSignup = document.getElementById("goSignup");
    const signupUsername = document.getElementById("signupUsername");
    const signupEmail = document.getElementById("signupEmail");
    const signupPassword = document.getElementById("signupPassword");
    const signupConfirmPassword = document.getElementById("signupConfirmPassword");
    const signupSubmit = document.getElementById("signupSubmit");
    const signupFeedback = document.getElementById("signupFeedback");
    const loginIdentifier = document.getElementById("loginIdentifier");
    const loginPassword = document.getElementById("loginPassword");
    const loginSubmit = document.getElementById("loginSubmit");
    const loginFeedback = document.getElementById("loginFeedback");


goLogin.onclick = () => {
        panel.classList.add("active");
    };


goSignup.onclick = () => {
        panel.classList.remove("active");
    };


    const setButtonState = (button, isLoading, defaultText, loadingText) => {
        if (!button) return;
        button.disabled = isLoading;
        button.textContent = isLoading ? loadingText : defaultText;
    };

    const validatePasswordMatch = () => {
        const password = signupPassword.value;
        const confirmPassword = signupConfirmPassword.value;

        if (!confirmPassword) {
            signupFeedback.textContent = "";
            return true;
        }

        if (password !== confirmPassword) {
            signupFeedback.textContent = "Passwords do not match.";
            return false;
        }

        signupFeedback.textContent = "";
        return true;
    };

    signupPassword.addEventListener("input", validatePasswordMatch);
    signupConfirmPassword.addEventListener("input", validatePasswordMatch);

    const attemptSignup = async () => {
        const username = signupUsername.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const confirmPassword = signupConfirmPassword.value;


        if (!username || !email || !password || !confirmPassword) {
            signupFeedback.textContent = "Please complete all signup fields.";
            return;
        }

        if (!validatePasswordMatch()) {
            return;
        }


        setButtonState(signupSubmit, true, "SIGN UP", "CREATING...");
        signupFeedback.textContent = "";

        try {
            // Fetch CSRF token first
            const tokenRes = await fetch("api/get_csrf_token.php");
            const tokenData = await tokenRes.json();
            const csrfToken = tokenData.csrf_token || '';

            const response = await fetch("auth_signup.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password, csrf_token: csrfToken }),
            });


            const result = await response.json();


            if (!response.ok) {
                signupFeedback.textContent = result.message || "Signup failed.";
                return;
            }


            signupUsername.value = "";
            signupEmail.value = "";
            signupPassword.value = "";
            signupConfirmPassword.value = "";
            showVerificationModal();
        } catch (error) {
            signupFeedback.textContent = "Unable to connect to the server.";
        } finally {
            setButtonState(signupSubmit, false, "SIGN UP", "CREATING...");
        }
    };


    const attemptLogin = async () => {
        const identifier = loginIdentifier.value.trim();
        const password = loginPassword.value;


        if (!identifier || !password) {
            loginFeedback.textContent = "Please enter your login details.";
            return;
        }


        setButtonState(loginSubmit, true, "LOGIN", "CHECKING...");
        loginFeedback.textContent = "";

        try {
            // Fetch CSRF token first
            const tokenRes = await fetch("api/get_csrf_token.php");
            const tokenData = await tokenRes.json();
            const csrfToken = tokenData.csrf_token || '';

            const response = await fetch("auth_login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ identifier, password, csrf_token: csrfToken }),
            });


            const result = await response.json();


            if (!response.ok) {
                loginFeedback.textContent = result.message || "Invalid username or password.";
                return;
            }


            window.location.href = result.redirect || "customerHomePage.html";
        } catch (error) {
            loginFeedback.textContent = "Unable to connect to the server.";
        } finally {
            setButtonState(loginSubmit, false, "LOGIN", "CHECKING...");
        }
    };

    const showVerificationModal = () => {
        const modal = document.getElementById('verificationModal');
        modal.hidden = false;
    };

    const closeVerificationModal = () => {
        const modal = document.getElementById('verificationModal');
        modal.hidden = true;
    };

    signupSubmit.onclick = attemptSignup;
    loginSubmit.onclick = attemptLogin;
    document.querySelectorAll('[data-close-verification]').forEach((button) => {
        button.addEventListener('click', closeVerificationModal);
    });

    // Password show/hide toggles
    document.querySelectorAll('.password-toggle').forEach(btn => {
        const input = document.getElementById(btn.dataset.target);

        // Show toggle only when the field has a value
        input.addEventListener('input', () => {
            const hasValue = input.value.length > 0;
            btn.classList.toggle('visible', hasValue);
            // Reset to hidden state when field is cleared
            if (!hasValue) {
                input.type = 'password';
                btn.querySelector('i').className = 'fa fa-eye';
            }
        });

        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });


    [signupUsername, signupEmail, signupPassword, signupConfirmPassword, loginIdentifier, loginPassword].filter(Boolean).forEach((input) => {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                if (panel.classList.contains("active")) {
                    attemptLogin();
                } else {
                    attemptSignup();
                }
            }
        });
    });
</script>


</body>
</html>
