<?php
require_once 'account-common.php';
$activePage = 'order-history';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order History | Yas Milktea House</title>
    <link rel="icon" type="image/png" href="images/footer_logo.png">
    <link rel="stylesheet" href="style.css?v=account-v1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
</head>
<body class="customer-account-page account-orders-page">
    <?php include 'account-sidebar.php'; ?>

                <section class="ACCOUNT-MODULE" id="order-history-module">
                    <h2>Order History</h2>
                    <div id="ordersContainer">
                        <div class="empty-state">
                            <p>Loading orders...</p>
                        </div>
                    </div>
                </section>

            </section>
        </div>
    </main>

    <!-- ===================== ORDER DETAIL MODAL ===================== -->
    <div class="ORDER-DETAIL-OVERLAY" id="order-detail-modal" hidden aria-modal="true" role="dialog" aria-labelledby="order-detail-title">
        <div class="ORDER-DETAIL-DIALOG">
            <div class="ORDER-DETAIL-HEADER">
                <h3 id="order-detail-title">Order Details</h3>
                <button type="button" class="ORDER-DETAIL-CLOSE" id="order-detail-close" aria-label="Close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="ORDER-DETAIL-BODY" id="order-detail-body"></div>
            <div class="ORDER-DETAIL-FOOTER">
                <button type="button" class="ORDER-DETAIL-CANCEL-BTN" id="order-detail-cancel-btn" hidden>
                    Cancel Order
                </button>
                <button type="button" class="ORDER-DETAIL-CLOSE-BTN" id="order-detail-close-btn">
                    Close
                </button>
            </div>
        </div>
    </div>

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
            <p>&copy; 2020 Yas Milktea House &nbsp;|&nbsp; <a href="customerThref="T&C.html"C.html">Terms &amp; Conditions</a> &nbsp;|&nbsp; <a href="customerPrivacyPolicy.html">Privacy Policy</a></p>
        </div>
    </footer>

    <div class="BACK-TO-TOP" id="back-to-top" role="button" tabindex="0" aria-label="Back to top" title="Go to top">
        <i class="fa-solid fa-circle-chevron-up"></i>
    </div>

    <script src="script.js?v=account-v1"></script>
    <script src="account-module.js?v=account-v1"></script>
</body>
</html>
