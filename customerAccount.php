<?php
header('Content-Type: text/html; charset=utf-8');
session_start();

require_once 'api/db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: loginSignUp.html');
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    // Get user data
    $stmt = $pdo->prepare("
        SELECT user_id, username, email, full_name, contact_number, date_of_birth, 
               profile_picture, created_at
        FROM users 
        WHERE user_id = :user_id
    ");
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch();

    if (!$user) {
        header('Location: loginSignUp.html');
        exit;
    }

    // Get primary address
    $stmt = $pdo->prepare("
        SELECT * FROM addresses 
        WHERE user_id = :user_id AND is_primary = TRUE LIMIT 1
    ");
    $stmt->execute(['user_id' => $user_id]);
    $primaryAddress = $stmt->fetch();

    // Get order stats
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_spent
        FROM orders WHERE user_id = :user_id
    ");
    $stmt->execute(['user_id' => $user_id]);
    $stats = $stmt->fetch();

    // Get recent orders
    $stmt = $pdo->prepare("
        SELECT o.order_id, o.order_date, o.total_amount, o.status,
               GROUP_CONCAT(CONCAT(p.product_name, ' (', oi.quantity, 'x)') SEPARATOR ', ') as items
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE o.user_id = :user_id AND o.order_date != '0000-00-00 00:00:00'
        GROUP BY o.order_id
        ORDER BY o.order_date DESC LIMIT 4
    ");
    $stmt->execute(['user_id' => $user_id]);
    $recentOrders = $stmt->fetchAll();

    $profilePicture = $user['profile_picture'] ?: 'images/default-avatar.png';
    $memberSince = date('F j, Y', strtotime($user['created_at']));
    
} catch (Exception $e) {
    header('Location: loginSignUp.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account | Yas Milktea House</title>
    <link rel="icon" type="image/png" href="images/footer_logo.png">
    <link rel="stylesheet" href="style.css?v=account-v1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
</head>
<body class="customer-account-page">
    <a id="top"></a>
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
                        <img id="navProfilePic" src="<?php echo htmlspecialchars($profilePicture); ?>" alt="Profile" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
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
        <div class="menu-toggle">&#9776;</div>
    </header>

    <main class="ACCOUNT-PAGE">
        <div class="ACCOUNT-GRID">
            <aside class="ACCOUNT-SIDEBAR">
                <div class="ACCOUNT-SIDEBAR-HEADER">
                    <h2>Overview</h2>
                    <p>Manage your profile, orders, and saved details from one place.</p>
                </div>
                <nav class="ACCOUNT-SIDEBAR-NAV" aria-label="Account navigation">
                    <a class="module-link active" href="#overview" data-module="overview">Overview</a>
                    <a class="module-link" href="#my-profile" data-module="my-profile">My Profile</a>
                    <a class="module-link" href="#personal-details" data-module="personal-details">Personal Details</a>
                    <a class="module-link" href="#order-history" data-module="order-history">Order History</a>
                    <a class="module-link" href="#addresses" data-module="addresses">Addresses</a>
                    <a class="module-link" href="#payment-methods" data-module="payment-methods">Payment Methods</a>
                    <a href="index.html">Log Out</a>
                </nav>
                <div class="ACCOUNT-SIDEBAR-HELP">
                    <span>Need help?</span>
                    <p>We're here for you!</p>
                    <a class="btn outline" id="contactSupportBtn">CONTACT SUPPORT</a>
                </div>
            </aside>

            <section class="ACCOUNT-MAIN">

                <!-- OVERVIEW MODULE -->
                <section class="ACCOUNT-MODULE" id="overview-module" data-module="overview">
                    <section class="ACCOUNT-HERO" id="overview">
                        <div class="ACCOUNT-HERO-IMAGE">
                            <img id="overviewProfilePic" src="<?php echo htmlspecialchars($profilePicture); ?>" alt="Account profile image" style="width: 200px; height: 200px; border-radius: 50%; object-fit: cover;">
                        </div>
                        <div class="ACCOUNT-HERO-CONTENT">
                            <h1>Hi, <span id="overviewUsername"><?php echo htmlspecialchars($user['username']); ?></span>! <span>👋</span></h1>
                            <p>Welcome back! Here's your account overview.</p>
                            <div class="ACCOUNT-STATS">
                                <div>
                                    <span>Member Since</span>
                                    <strong><?php echo $memberSince; ?></strong>
                                </div>
                                <div>
                                    <span>Total Orders</span>
                                    <strong id="totalOrdersOverview"><?php echo $stats['total_orders']; ?> Orders</strong>
                                </div>
                                <div>
                                    <span>Total Spent</span>
                                    <strong id="totalSpentOverview">₱<?php echo number_format($stats['total_spent'], 2); ?></strong>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="ACCOUNT-CARDS" id="details">
                        <article class="ACCOUNT-DETAIL-CARD">
                            <div class="ACCOUNT-CARD-HEADER">
                                <h3>Personal Details</h3>
                                <a class="btn outline module-link" href="#personal-details" data-module="personal-details">EDIT DETAILS</a>
                            </div>
                            <div class="ACCOUNT-CARD-BODY">
                                <div><span>Full Name</span><strong id="overviewFullName"><?php echo htmlspecialchars($user['full_name'] ?: 'Not set'); ?></strong></div>
                                <div><span>Email Address</span><strong id="overviewEmail"><?php echo htmlspecialchars($user['email']); ?></strong></div>
                                <div><span>Contact Number</span><strong id="overviewContact"><?php echo htmlspecialchars($user['contact_number'] ?: 'Not set'); ?></strong></div>
                                <div><span>Date of Birth</span><strong id="overviewDOB"><?php echo $user['date_of_birth'] ? date('M d, Y', strtotime($user['date_of_birth'])) : 'Not set'; ?></strong></div>
                            </div>
                        </article>

                        <article class="ACCOUNT-DETAIL-CARD">
                            <div class="ACCOUNT-CARD-HEADER">
                                <h3>Address</h3>
                                <a class="btn outline module-link" href="#addresses" data-module="addresses">EDIT ADDRESS</a>
                            </div>
                            <div class="ACCOUNT-CARD-BODY">
                                <?php if ($primaryAddress): ?>
                                    <div><span>Home Address</span><strong id="overviewAddress"><?php echo htmlspecialchars($primaryAddress['address_line']); ?></strong></div>
                                    <div><span>Landmark</span><strong id="overviewLandmark"><?php echo htmlspecialchars($primaryAddress['landmark'] ?: 'Not set'); ?></strong></div>
                                    <div><span>Delivery Instructions</span><strong id="overviewInstructions"><?php echo htmlspecialchars($primaryAddress['delivery_instructions'] ?: 'None'); ?></strong></div>
                                <?php else: ?>
                                    <div><span>No address set</span><strong>Please add an address in the Addresses section</strong></div>
                                <?php endif; ?>
                            </div>
                        </article>
                    </section>

                    <section class="ACCOUNT-ORDERS" id="orders">
                        <div class="ACCOUNT-ORDERS-HEADER">
                            <h3>Recent Orders</h3>
                            <a class="btn outline module-link" href="#order-history" data-module="order-history">VIEW ALL ORDERS</a>
                        </div>
                        <div class="ACCOUNT-ORDER-TABLE" id="recentOrdersTable">
                            <div class="ACCOUNT-ORDER-ROW ACCOUNT-ORDER-HEAD">
                                <span>ORDER ID</span>
                                <span>DATE</span>
                                <span>ITEMS</span>
                                <span>TOTAL</span>
                                <span>STATUS</span>
                            </div>
                            <?php foreach ($recentOrders as $order): ?>
                                <div class="ACCOUNT-ORDER-ROW">
                                    <span>#<?php echo date('Ymd', strtotime($order['order_date'])) . str_pad($order['order_id'], 5, '0', STR_PAD_LEFT); ?></span>
                                    <span><?php echo date('M d, Y', strtotime($order['order_date'])); ?></span>
                                    <span><?php echo htmlspecialchars(substr($order['items'] ?? 'N/A', 0, 30)); ?>...</span>
                                    <span>₱<?php echo number_format($order['total_amount'], 2); ?></span>
                                    <span class="ACCOUNT-STATUS <?php echo strtolower($order['status']); ?>"><?php echo ucfirst($order['status']); ?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </section>
                </section>

                <!-- MY PROFILE MODULE -->
                <section class="ACCOUNT-MODULE" id="my-profile-module" data-module="my-profile" style="display: none;">
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
                                <button type="button" id="removeProfilePicBtn" class="btn outline" style="margin: 0;">
                                    REMOVE PICTURE
                                </button>
                            </div>
                            <small style="display: block; margin-top: 10px; color: #666;">JPG, PNG, GIF, or WebP (Max 5MB)</small>
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

                <!-- PERSONAL DETAILS MODULE -->
                <section class="ACCOUNT-MODULE" id="personal-details-module" data-module="personal-details" style="display: none;">
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
                                    <label for="email">Email Address <span style="color: red;">*</span></label>
                                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
                                    <small style="color: #999;">You'll need to use the new email to log in if changed</small>
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

                <!-- ORDER HISTORY MODULE -->
                <section class="ACCOUNT-MODULE" id="order-history-module" data-module="order-history" style="display: none;">
                    <h2>Order History</h2>
                    
                    <div id="ordersContainer">
                        <div style="text-align: center; padding: 40px;">
                            <p>Loading orders...</p>
                        </div>
                    </div>
                </section>

                <!-- ADDRESSES MODULE -->
                <section class="ACCOUNT-MODULE" id="addresses-module" data-module="addresses" style="display: none;">
                    <h2>Your Addresses</h2>
                    
                    <button class="btn primary" id="addAddressBtn" style="margin-bottom: 20px;">+ Add New Address</button>

                    <div id="addressesList">
                        <div style="text-align: center; padding: 40px;">
                            <p>Loading addresses...</p>
                        </div>
                    </div>

                    <!-- Add/Edit Address Modal -->
                    <div id="addressModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; padding: 20px; overflow-y: auto;">
                        <div style="background: white; max-width: 500px; margin: 50px auto; border-radius: 10px; padding: 30px;">
                            <h3 style="margin-top: 0;" id="addressModalTitle">Add New Address</h3>
                            <form id="addressForm">
                                <input type="hidden" id="addressId" name="address_id" value="">
                                <div class="form-group">
                                    <label for="addressType">Address Type</label>
                                    <select id="addressType" name="address_type">
                                        <option value="home">Home</option>
                                        <option value="office">Office</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="addressLine">Address <span style="color: red;">*</span></label>
                                    <input type="text" id="addressLine" name="address_line" required placeholder="House number, street name">
                                </div>
                                <div class="form-group">
                                    <label for="landmark">Landmark</label>
                                    <input type="text" id="landmark" name="landmark" placeholder="Nearby landmark or reference">
                                </div>
                                <div class="form-group">
                                    <label for="deliveryInstructions">Delivery Instructions</label>
                                    <textarea id="deliveryInstructions" name="delivery_instructions" placeholder="Any special delivery instructions" rows="3"></textarea>
                                </div>
                                <div class="form-group">
                                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                        <input type="checkbox" id="isPrimary" name="is_primary">
                                        <span>Set as primary address</span>
                                    </label>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button type="submit" class="btn primary">Save Address</button>
                                    <button type="button" class="btn outline" id="closeAddressModal">Cancel</button>
                                    <button type="button" class="btn danger" id="deleteAddressBtn" style="display: none; margin-left: auto;">Delete</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                <!-- PAYMENT METHODS MODULE -->
                <section class="ACCOUNT-MODULE" id="payment-methods-module" data-module="payment-methods" style="display: none;">
                    <h2>Payment Methods</h2>
                    
                    <article class="ACCOUNT-DETAIL-CARD">
                        <div class="ACCOUNT-CARD-BODY" style="text-align: center; padding: 60px 20px;">
                            <i class="fa-solid fa-wrench" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                            <h3>Payment Methods</h3>
                            <p style="color: #999;">This feature is currently under development. Check back soon!</p>
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
            <p>&copy; 2020 Yas Milktea House</p>
        </div>
    </footer>

    <div class="BACK-TO-TOP" id="back-to-top" role="button" tabindex="0" aria-label="Back to top" title="Go to top">
        <i class="fa-solid fa-circle-chevron-up" style="color: #ff5eb3;"></i>
    </div>

    <script src="script.js?v=account-v1"></script>
    <script src="account-module.js?v=account-v1"></script>
</body>
</html>
