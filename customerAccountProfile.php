<?php
require_once 'account-common.php';
$activePage = 'my-profile';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile | Yas Milktea House</title>
    <link rel="icon" type="image/png" href="images/footer_logo.png">
    <link rel="stylesheet" href="style.css?v=account-v1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
</head>
<body class="customer-account-page account-profile-page">
    <?php include 'account-sidebar.php'; ?>

                <section class="ACCOUNT-MODULE" id="my-profile-module">
                    <h2>My Profile</h2>
                    <article class="ACCOUNT-DETAIL-CARD">
                        <div class="ACCOUNT-CARD-HEADER">
                            <h3>Profile Picture</h3>
                        </div>
                        <div class="ACCOUNT-CARD-BODY" style="text-align: center;">
                            <img id="profilePicPreview" src="<?php echo htmlspecialchars($profilePicture); ?>" alt="Profile Picture" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;">
                            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                                <label class="btn outline" style="cursor: pointer; margin: 0;">
                                    UPLOAD NEW PICTURE
                                    <input type="file" id="profilePictureInput" accept="image/*" style="display: none;">
                                </label>
                                <button type="button" id="removeProfilePicBtn" class="btn outline" style="margin: 0;">REMOVE PICTURE</button>
                            </div>
                            <small style="display: block; margin-top: 10px; color: #999;">JPG, PNG, GIF, or WebP (Max 5MB)</small>
                        </div>
                    </article>

                    <article class="ACCOUNT-DETAIL-CARD">
                        <div class="ACCOUNT-CARD-HEADER">
                            <h3>Username</h3>
                        </div>
                        <div class="ACCOUNT-CARD-BODY">
                            <form id="usernameForm">
                                <div class="form-group">
                                    <label for="username">Current Username</label>
                                    <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($user['username']); ?>" required>
                                </div>
                                <button type="submit" class="btn primary">Update Username</button>
                            </form>
                        </div>
                    </article>

                    <article class="ACCOUNT-DETAIL-CARD">
                        <div class="ACCOUNT-CARD-HEADER">
                            <h3>Change Password</h3>
                        </div>
                        <div class="ACCOUNT-CARD-BODY">
                            <form id="passwordForm">
                                <div class="form-group">
                                    <label for="oldPassword">Current Password</label>
                                    <input type="password" id="oldPassword" name="old_password" required>
                                </div>
                                <div class="form-group">
                                    <label for="newPassword">New Password</label>
                                    <input type="password" id="newPassword" name="new_password" required>
                                </div>
                                <div class="form-group">
                                    <label for="confirmPassword">Confirm New Password</label>
                                    <input type="password" id="confirmPassword" name="confirm_password" required>
                                </div>
                                <button type="submit" class="btn primary">Change Password</button>
                            </form>
                        </div>
                    </article>
                </section>

            </section>
        </div>
    </main>

    <footer id="footer">
        <div class="FOOTER-CONTAINER">
            <div class="FOOTER-IMG-CONTAINER">
                <img src="images/footer_logo.png" alt="YAS footer logo">
            </div>
            <div class="FOOTER-TEXTS">
                <p>
                    Born to serve sweet vibes and tasty drinks.<br>
                    Your local spot for milk teas and savory snacks.<br>
                    Fresh flavors, good company, and a touch of fun in every cup.
                </p>
                <div class="FOOTER-ICONS">
                    <div>
                        <a href="https://maps.app.goo.gl/Uss4LnWw9EJKj2gQ9" target="_blank">
                            <i class="fa-solid fa-location-dot"></i>
                        </a>
                    </div>
                    <div>
                        <a href="tel:+639073954150">
                            <i class="fa-solid fa-phone"></i>
                        </a>
                    </div>
                    <div>
                        <a href="https://www.facebook.com/yas.elizalde.7" target="_blank">
                            <i class="fa-brands fa-square-facebook"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="FOOTER-COPYRIGHT">
            <p>&copy; 2020 Yas Milktea House &nbsp;|&nbsp; <a href="T&C.html">Terms &amp; Conditions</a> &nbsp;|&nbsp; <a href="PrivacyPolicy.html">Privacy Policy</a></p>
        </div>
    </footer>

    <div class="BACK-TO-TOP" id="back-to-top" role="button" tabindex="0" aria-label="Back to top" title="Go to top">
        <i class="fa-solid fa-circle-chevron-up" style="color: #ff5eb3;"></i>
    </div>

    <script src="script.js?v=account-v1"></script>
    <script src="account-module.js?v=account-v1"></script>
</body>
</html>
