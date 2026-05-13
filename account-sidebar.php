<?php
if (!isset($activePage)) {
    $activePage = 'overview';
}
?>
<script>window.__CSRF_TOKEN__ = "<?php echo htmlspecialchars($csrfToken, ENT_QUOTES); ?>";</script>
<header class="navbar">
    <div class="logo">
        <a href="customerHomePage.html"><img src="images/yas_logo.png" alt="YAS logo"></a>
    </div>
    <nav class="nav-links">
        <a href="customerHomePage.html">home</a>
        <a href="customerAboutUs.html">about</a>
        <a href="customerMenu.php">menu</a>
    </nav>
    <div class="CUSTOMER-NAV-ACTIONS">
        <a class="CUSTOMER-CART-BUTTON" href="addToCart.html" aria-label="Open cart">
            <i class="fa-solid fa-cart-shopping"></i>
        </a>
        <div class="CUSTOMER-USER-BUTTON">
            <span class="CUSTOMER-USER-INFO">
                <span class="CUSTOMER-USER-ICON">
                    <img id="navProfilePic" class="ACCOUNT-NAV-AVATAR" src="<?php echo htmlspecialchars($profilePicture); ?>" alt="Profile">
                </span>
                <span class="CUSTOMER-USER-LABEL" id="navUsername"><?php echo htmlspecialchars($user['username']); ?></span>
            </span>
            <a class="CUSTOMER-USER-ARROW-LINK" href="#" aria-label="Open user menu" id="userMenuToggle">
                <i class="fa-solid fa-chevron-down CUSTOMER-USER-CHEVRON"></i>
            </a>
            <div class="CUSTOMER-USER-DROPDOWN" id="userDropdown">
                <a href="customerAccount.php">Account</a>
                <a href="index.html">Log Out</a>
            </div>
        </div>
    </div>
    <button type="button" class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">&#9776;</button>
</header>

<main class="ACCOUNT-PAGE">
    <div class="ACCOUNT-GRID">
        <aside class="ACCOUNT-SIDEBAR">
            <div class="ACCOUNT-SIDEBAR-HEADER">
                <h2>Overview</h2>
                <p>Manage your profile, orders, and saved details from one place.</p>
            </div>
            <nav class="ACCOUNT-SIDEBAR-NAV" aria-label="Account navigation">
                <a class="module-link <?php echo $activePage === 'overview' ? 'active' : ''; ?>" href="customerAccount.php">Overview</a>
                <a class="module-link <?php echo $activePage === 'my-profile' ? 'active' : ''; ?>" href="customerAccountProfile.php">My Profile</a>
                <a class="module-link <?php echo $activePage === 'personal-details' ? 'active' : ''; ?>" href="customerAccountPersonal.php">Personal Details</a>
                <a class="module-link <?php echo $activePage === 'order-history' ? 'active' : ''; ?>" href="customerAccountOrders.php">Order History</a>
                <a class="module-link <?php echo $activePage === 'addresses' ? 'active' : ''; ?>" href="customerAccountAddresses.php">Addresses</a>
                <a class="module-link <?php echo $activePage === 'payment-methods' ? 'active' : ''; ?>" href="customerAccountPayments.php">Payment Methods</a>
                <a class="module-link logout-link" href="index.html">Log Out</a>
            </nav>
            <div class="ACCOUNT-SIDEBAR-HELP">
                <span>Need help?</span>
                <p>We're here for you!</p>
                <a class="btn outline" id="contactSupportBtn" href="mailto:yasmilkteahouse@gmail.com">CONTACT SUPPORT</a>
            </div>
        </aside>

        <section class="ACCOUNT-MAIN">

