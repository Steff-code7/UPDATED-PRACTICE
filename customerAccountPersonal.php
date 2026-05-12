<?php
require_once 'account-common.php';
$activePage = 'personal-details';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personal Details | Yas Milktea House</title>
    <link rel="icon" type="image/png" href="images/footer_logo.png">
    <link rel="stylesheet" href="style.css?v=account-v1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
</head>
<body class="customer-account-page account-personal-page">
    <?php include 'account-sidebar.php'; ?>

                <section class="ACCOUNT-MODULE" id="personal-details-module">
                    <h2>Personal Details</h2>
                    <article class="ACCOUNT-DETAIL-CARD">
                        <div class="ACCOUNT-CARD-HEADER">
                            <h3>Edit Your Information</h3>
                        </div>
                        <div class="ACCOUNT-CARD-BODY">
                            <form id="personalDetailsForm">
                                <div class="form-group">
                                    <label for="fullName">Full Name</label>
                                    <input type="text" id="fullName" name="full_name" value="<?php echo htmlspecialchars($user['full_name'] ?: ''); ?>">
                                </div>
                                <div class="form-group">
                                    <label for="email">Email Address <span class="required-mark">*</span></label>
                                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
                                    <small class="muted-copy">You'll need to log in again if you change your email.</small>
                                </div>
                                <div class="form-group">
                                    <label for="contactNumber">Contact Number</label>
                                    <input type="tel" id="contactNumber" name="contact_number" value="<?php echo htmlspecialchars($user['contact_number'] ?: ''); ?>">
                                </div>
                                <div class="form-group">
                                    <label for="dateOfBirth">Date of Birth</label>
                                    <input type="date" id="dateOfBirth" name="date_of_birth" value="<?php echo $user['date_of_birth'] ?: ''; ?>">
                                </div>
                                <button type="submit" class="btn primary">Save Changes</button>
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
        <i class="fa-solid fa-circle-chevron-up"></i>
    </div>

    <script src="script.js?v=account-v1"></script>
    <script src="account-module.js?v=account-v1"></script>
</body>
</html>
