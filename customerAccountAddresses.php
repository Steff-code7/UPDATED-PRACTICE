<?php
require_once 'account-common.php';
$activePage = 'addresses';

$barangayOptions = [
    'Bagyang',
    'Baras',
    'Bitaugan',
    'Bolhoon',
    'Calatngan',
    'Carromata',
    'Castillo',
    'Libas Gua / Libas de Arriba',
    'Libas Sud / Libas de Abajo',
    'Magroyong',
    'Mahayag (Maitum)',
    'Patong',
    'Poblacion (Town Center)',
    'Sagbayan',
    'San Roque',
    'Siagao',
    'Tina',
    'Umalag'
];

$addresses = [];
try {
    $stmt = $pdo->prepare(
        "SELECT
            ad.address_details_id AS address_id,
            ad.address_type,
            ad.landmark,
            ad.delivery_instructions,
            ad.is_primary,
            ad.updated_at,
            al.house_no,
            al.street,
            al.barangay,
            al.city,
            al.province,
            al.address_line
         FROM address_details ad
         JOIN address_locations al ON ad.location_id = al.location_id
         WHERE ad.user_id = :user_id
         ORDER BY ad.is_primary DESC, ad.updated_at DESC"
    );
    $stmt->execute(['user_id' => $user_id]);
    $addresses = $stmt->fetchAll();
} catch (Exception $e) {
    $addresses = [];
}
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
                    <button class="btn primary account-add-address-btn" id="addAddressBtn">+ Add New Address</button>
                    <div id="addressesList">
                        <?php if (empty($addresses)): ?>
                            <div class="empty-state">
                                <p>No addresses found.</p>
                            </div>
                        <?php else: ?>
                            <?php foreach ($addresses as $address): ?>
                                <article class="ACCOUNT-DETAIL-CARD">
                                    <div class="ACCOUNT-CARD-HEADER">
                                        <h4><?php echo htmlspecialchars(ucfirst($address['address_type'])); ?><?php echo $address['is_primary'] ? ' <span class="ACCOUNT-PRIMARY-LABEL">(Primary)</span>' : ''; ?></h4>
                                        <div class="ACCOUNT-CARD-HEADER-ACTIONS">
                                            <button type="button" class="btn outline small" data-address-action="edit" data-address-id="<?php echo intval($address['address_id']); ?>">EDIT</button>
                                            <?php if (!$address['is_primary']): ?>
                                                <button type="button" class="btn outline small" data-address-action="primary" data-address-id="<?php echo intval($address['address_id']); ?>">SET AS PRIMARY</button>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                    <div class="ACCOUNT-CARD-BODY">
                                        <?php
                                            $formattedAddress = '';
                                            if (!empty($address['house_no'])) $formattedAddress .= $address['house_no'];
                                            if (!empty($address['street']))   $formattedAddress .= ($formattedAddress ? ' ' : '') . $address['street'] . ' street';
                                            if (!empty($address['barangay'])) $formattedAddress .= ($formattedAddress ? ', ' : '') . 'Barangay ' . $address['barangay'];
                                            if (!empty($address['city']))     $formattedAddress .= ($formattedAddress ? ', ' : '') . $address['city'];
                                            if (!empty($address['province'])) $formattedAddress .= ($formattedAddress ? ', ' : '') . $address['province'];
                                            if (!$formattedAddress) $formattedAddress = $address['address_line'];
                                        ?>
                                        <div><span>Address</span><strong><?php echo htmlspecialchars($formattedAddress); ?></strong></div>
                                        <div><span>Landmark</span><strong><?php echo htmlspecialchars($address['landmark'] ?: 'Not set'); ?></strong></div>
                                        <div><span>Instructions</span><strong><?php echo htmlspecialchars($address['delivery_instructions'] ?: 'None'); ?></strong></div>
                                    </div>
                                </article>
                            <?php endforeach; ?>
                        <?php endif; ?>
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
                                <div class="address-fields-grid">
                                    <div class="form-group">
                                        <label for="houseNumber">House No. <span class="required">*</span></label>
                                        <input type="text" id="houseNumber" name="house_number" required placeholder="e.g. 143">
                                    </div>
                                    <div class="form-group">
                                        <label for="street">Street <span class="required">*</span></label>
                                        <input type="text" id="street" name="street" required placeholder="e.g. Yas Street">
                                    </div>
                                    <div class="form-group">
                                        <label for="barangay">Barangay <span class="required">*</span></label>
                                        <?php $selectedBarangay = $_POST['barangay'] ?? ''; ?>
                                        <select id="barangay" name="barangay" required>
                                            <option value="" disabled <?php echo $selectedBarangay === '' ? 'selected' : ''; ?>>Select Barangay</option>
                                            <?php foreach ($barangayOptions as $barangay): ?>
                                                <option value="<?php echo htmlspecialchars($barangay); ?>" <?php echo $selectedBarangay === $barangay ? 'selected' : ''; ?>><?php echo htmlspecialchars($barangay); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="city">City <span class="required">*</span></label>
                                        <input type="text" id="city" name="city" required value="San Miguel" readonly>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="province">Province <span class="required">*</span></label>
                                    <input type="text" id="province" name="province" required value="Surigao del Sur" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="completeAddress">Complete Address</label>
                                    <input type="text" id="completeAddress" name="complete_address" readonly placeholder="Displays formatted address">
                                </div>
                                <div class="form-group">
                                    <label for="landmark">Landmark</label>
                                    <input type="text" id="landmark" name="landmark" placeholder="e.g. Near Petron, Beside 7-Eleven">
                                </div>
                                <div class="form-group">
                                    <label for="deliveryInstructions">Delivery Instructions</label>
                                    <textarea id="deliveryInstructions" name="delivery_instructions" placeholder="e.g. Leave at the gate, Call upon arrival, etc." rows="4"></textarea>
                                </div>
                                <div class="form-group checkbox-group">
                                    <label>
                                        <input type="checkbox" id="isPrimary" name="is_primary">
                                        <span>Set as primary address</span>
                                    </label>
                                </div>
                                <p class="ACCOUNT-MODAL-NOTE">Delivery is limited to these areas only.</p>
                                <div class="form-actions">
                                    <button type="submit" class="btn primary">Save Address</button>
                                    <button type="button" class="btn outline" id="closeAddressModal">Cancel</button>
                                    <button type="button" class="btn danger is-hidden" id="deleteAddressBtn">Delete</button>
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
