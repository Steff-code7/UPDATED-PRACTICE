<?php
require_once 'account-common.php';
$activePage = 'overview';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Overview | Yas Milktea House</title>
    <link rel="icon" type="image/png" href="images/footer_logo.png">
    <link rel="stylesheet" href="style.css?v=account-v1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
</head>
<body class="customer-account-page account-overview-page">
    <?php include 'account-sidebar.php'; ?>

                <section class="ACCOUNT-MODULE" id="overview-module">
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
                                <a class="btn outline" href="customerAccountPersonal.php">EDIT DETAILS</a>
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
                                <a class="btn outline" href="customerAccountAddresses.php">EDIT ADDRESS</a>
                            </div>
                            <div class="ACCOUNT-CARD-BODY">
                                <?php if ($primaryAddress): ?>
                                    <?php
                                        $formattedAddress = '';
                                        if (!empty($primaryAddress['house_no'])) $formattedAddress .= $primaryAddress['house_no'];
                                        if (!empty($primaryAddress['street']))   $formattedAddress .= ($formattedAddress ? ' ' : '') . $primaryAddress['street'] . ' street';
                                        if (!empty($primaryAddress['barangay'])) $formattedAddress .= ($formattedAddress ? ', ' : '') . 'Barangay ' . $primaryAddress['barangay'];
                                        if (!empty($primaryAddress['city']))     $formattedAddress .= ($formattedAddress ? ', ' : '') . $primaryAddress['city'];
                                        if (!empty($primaryAddress['province'])) $formattedAddress .= ($formattedAddress ? ', ' : '') . $primaryAddress['province'];
                                        if (!$formattedAddress) $formattedAddress = $primaryAddress['address_line'];
                                    ?>
                                    <div><span>Home Address</span><strong id="overviewAddress"><?php echo htmlspecialchars($formattedAddress); ?></strong></div>
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
                            <a class="btn outline" href="customerAccountOrders.php">VIEW ALL ORDERS</a>
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
                                    <span>#ORD-<?php echo str_pad($order['order_id'], 4, '0', STR_PAD_LEFT); ?></span>
                                    <span><?php echo date('M d, Y', strtotime($order['order_date'])); ?></span>
                                    <span><?php echo htmlspecialchars(substr($order['items'] ?? 'N/A', 0, 30)); ?>...</span>
                                    <span>₱<?php echo number_format($order['total_amount'], 2); ?></span>
                                    <span class="ACCOUNT-STATUS <?php echo strtolower($order['status']); ?>"><?php echo ucfirst($order['status']); ?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </section>
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
