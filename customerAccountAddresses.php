<?php
require_once 'account-common.php';
$activePage = 'addresses';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Addresses | Yas Milktea House</title>
    <link rel="icon" type="image/png" href="images/footer_logo.png">
    <link rel="stylesheet" href="style.css?v=account-v1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
</head>
<body class="customer-account-page account-addresses-page">
    <?php include 'account-sidebar.php'; ?>

                <section class="ACCOUNT-MODULE" id="addresses-module">
                    <h2>Your Addresses</h2>
                    <button class="btn primary" id="addAddressBtn" style="margin-bottom: 20px;">+ Add New Address</button>
                    <div id="addressesList">
                        <div style="text-align: center; padding: 40px;">
                            <p>No addresses found.</p>
                        </div>
                    </div>

                    <div id="addressModal" class="address-modal-overlay">
                        <div class="address-modal-inner">
                            <h3 id="addressModalTitle">Add New Address</h3>
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
                                    <label for="addressLine">Address <span style="color: #ff4da6;">*</span></label>
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
