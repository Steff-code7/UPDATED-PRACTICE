<?php
$conn = new mysqli("localhost", "root", "", "yas_milktea_house");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM categories";
$result = $conn->query($sql);

$productByCategory = [];

$products = $conn->query("
    SELECT p.*, c.category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
");

while ($row = $products->fetch_assoc()) {
    $productByCategory[$row['category_slug']][] = $row;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu | Yas Milktea House</title>
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="menu-page home-page">
    <a id="top"></a>




<!-- ========================= NAVBAR ========================= -->
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
                        <i class="fa-regular fa-user"></i>
                    </span>
                    <span class="CUSTOMER-USER-LABEL">user</span>
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




<!-- ======================= MENU HERO ======================= -->
    <section id="about" class="about">
        <!-- ======================= HERO TITLE ======================= -->
        <div class="ABOUT-US-TEXT">
            <h1>YAS MENU.</h1>
        </div>




<!-- ======================= HERO IMAGE ======================= -->
        <div class="ABOUT-HERO-CONTAINER">
            <img src="images/about_us_banner.jpg" alt="YAS Milktea menu banner" class="YASBIGPIC" id="ABOUT-HERO-IMG">
            <div class="overlay" id="ABOUT-OVERLAY"></div>
        </div>




<!-- ====================== HERO OVERLAY ====================== -->
        <div class="GLOBAL-PAGE-OVERLAY"></div>




<!-- ====================== HERO DIVIDERS ===================== -->
        <div class="custom-shape-divider-top-1764244138">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
            </svg>
        </div>




<div class="custom-shape-divider-bottom-1764244576" id="ABOUT-BOTTOM">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
            </svg>
        </div>
    </section>




<!-- ====================== MENU INTRO ======================= -->
    <section class="ABOUT-CONTENT-SECTION" id="MENU-INTRO1">
        <div class="ABOUT-CONTENT-TEXTS" id="MENU-INTO2">
            <!-- ====================== INTRO HEADING ====================== -->
            <h1><i>Taste the Moment: Discover What We Serve</i></h1>




<div class="underline3"></div>




<!-- ===================== FILTER CONTROLS ===================== -->
            <div class="MENU-3-NAVIGATIONS">
                <!-- ==================== CATEGORY FILTER ==================== -->
                <div class="DROPDOWN-CATEGORIES menu-dropdown">
                    <div class="dropdown-selected" id="dropdown-selected" role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">
                        <span class="dropdown-label">Select Category</span>
                        <img src="images/sort-down-solid.png" id="DROPDOWN" alt="">
                    </div>
<ul class="dropdown-options" id="dropdown-options" role="listbox">

    <li data-category="all-categories" role="option">All Categories</li>

    <?php while($row = $result->fetch_assoc()): ?>
        <li 
            data-category="<?= $row['category_slug'] ?>" 
            role="option">
            <?= $row['category_name'] ?>
        </li>
    <?php endwhile; ?>

</ul>
                </div>




<!-- ====================== SEARCH INPUT ===================== -->
                <label class="SEARCH-BAR" for="menu-search">
                    <img src="images/magnifying-glass-solid.png" id="SEARCH-ICON" alt="">
                    <input id="menu-search" type="search" placeholder="Search menu items..." autocomplete="off">
                </label>




<!-- ======================= SORT BUTTON ===================== -->
                <button class="SORT-FILTER" id="menu-sort" type="button" aria-label="Sort menu cards">
                    <img src="images/sort-solid.png" id="FILTER-ICON" alt="Default sort" title="Sort">
                    <span>Default</span>
                </button>
            </div>
        </div>
    </section>




<!-- ===================== EMPTY STATE ====================== -->
    <section class="MENU-EMPTY-STATE" id="menu-empty-state" aria-live="polite" hidden>
        <div class="MENU-EMPTY-CONTENT">
            <h2>Nothing matched your search.</h2>
            <p>Try a different flavor or browse all categories to see what Yas Milktea House has available.</p>
        </div>
    </section>




<!-- ===================== DRINKS HEADER ===================== -->
    <section class="MENU-GROUP-HEADER" id="DRINK-LINE-UP" data-group-header="drinks">
        <div class="MENU-GROUP-CONTENT">
            <p>Menu Lineup</p>
            <h2>DRINKS</h2>
        </div>
    </section>




<!-- =================== CLASSIC MILKTEA ===================== -->
    <section class="CLASS-MILKTEA menu-section show" id="classic-milktea" data-menu-section data-menu-group="drinks">
        <div class="CLASSIC-MILKTEA-CONTENTS">
            <h1>CLASSIC MILKTEA</h1>




<!-- ===================== CLASSIC ITEMS ====================== -->
<div class="CLASSIC-MENU menu-cards-grid">

<?php if (!empty($productByCategory['classic-milktea'])): ?>
    <?php foreach ($productByCategory['classic-milktea'] as $product): ?>

        <div class="menu-drink-card" data-name="<?= htmlspecialchars($product['product_name']) ?>" data-product-id="<?= (int)$product['product_id'] ?>">

            <div class="menu-card-pic"
                 style="background-image: url('<?= htmlspecialchars($product['image']) ?>'); background-position: center;">
            </div>

            <div class="menu-card-text">
                <h2><?= htmlspecialchars($product['product_name']) ?></h2>
                <p><?= htmlspecialchars($product['description']) ?></p>
            </div>

        </div>

    <?php endforeach; ?>
<?php endif; ?>

</div>
        </div>
    </section>




<!-- =================== PREMIUM MILKTEA ===================== -->
    <section class="PREMIUM-MILKTEA menu-section show" id="premium-milktea" data-menu-section data-menu-group="drinks">
        <div class="PREMIUM-MILKTEA-CONTENTS">
            <h1>PREMIUM MILKTEA</h1>




<!-- ===================== PREMIUM ITEMS ====================== -->
<div class="PREMIUM-MENU menu-cards-grid">

<?php if (!empty($productByCategory['premium-milktea'])): ?>
    <?php foreach ($productByCategory['premium-milktea'] as $product): ?>

        <div class="menu-drink-card" data-name="<?= htmlspecialchars($product['product_name']) ?>" data-product-id="<?= (int)$product['product_id'] ?>">

            <div class="menu-card-pic"
                 style="background-image: url('<?= htmlspecialchars($product['image']) ?>'); background-position: center;">
            </div>

            <div class="menu-card-text">
                <h2><?= htmlspecialchars($product['product_name']) ?></h2>
                <p><?= htmlspecialchars($product['description']) ?></p>
            </div>

        </div>

    <?php endforeach; ?>
<?php endif; ?>

</div>
        </div>
    </section>




<!-- ================= CREAM CHEESE SERIES =================== -->
    <section class="CREAM-CHEESE-SERIES menu-section show" id="cream-cheese" data-menu-section data-menu-group="drinks">
        <div class="CREAM-CHEESE-CONTENTS">
            <h1>CREAM CHEESE SERIES</h1>




<!-- ================== CREAM CHEESE ITEMS =================== -->
<div class="CREAM-CHEESE-MENU menu-cards-grid">

<?php if (!empty($productByCategory['cream-cheese'])): ?>
    <?php foreach ($productByCategory['cream-cheese'] as $product): ?>

        <div class="menu-drink-card" data-name="<?= htmlspecialchars($product['product_name']) ?>" data-product-id="<?= (int)$product['product_id'] ?>">

            <div class="menu-card-pic"
                 style="background-image: url('<?= htmlspecialchars($product['image']) ?>'); background-position: center;">
            </div>

            <div class="menu-card-text">
                <h2><?= htmlspecialchars($product['product_name']) ?></h2>
                <p><?= htmlspecialchars($product['description']) ?></p>
            </div>

        </div>

    <?php endforeach; ?>
<?php endif; ?>

</div>
        </div>
    </section>



<!-- ====================== FRUIT MILK ======================= -->
    <section class="FRUIT-MILK menu-section show" id="fruit-milk" data-menu-section data-menu-group="drinks">
        <div class="FRUIT-MILK-CONTENTS">
            <h1>FRUIT MILK</h1>

<!-- ===================== FRUIT MILK ITEMS ==================== -->
            <div class="FRUIT-MILK-MENU menu-cards-grid">

                <?php if (!empty($productByCategory['fruit-milk'])): ?>
                    <?php foreach ($productByCategory['fruit-milk'] as $product): ?>
                        <div class="menu-drink-card" data-name="<?= htmlspecialchars($product['product_name']) ?>" data-product-id="<?= (int)$product['product_id'] ?>">
                            <div class="menu-card-pic"
                                 style="background-image: url('<?= htmlspecialchars($product['image']) ?>'); background-position: center;">
                            </div>
                            <div class="menu-card-text">
                                <h2><?= htmlspecialchars($product['product_name']) ?></h2>
                                <p><?= htmlspecialchars($product['description']) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

            </div>
        </div>
    </section>




<!-- ======================= FRUIT TEA ======================= -->
    <section class="FRUIT-TEA menu-section show" id="fruit-tea" data-menu-section data-menu-group="drinks">
        <div class="FRUIT-TEA-CONTENTS">
            <h1>FRUIT TEA</h1>

<!-- ====================== FRUIT TEA ITEMS ==================== -->
            <div class="FRUIT-TEA-MENU menu-cards-grid">

                <?php if (!empty($productByCategory['fruit-tea'])): ?>
                    <?php foreach ($productByCategory['fruit-tea'] as $product): ?>
                        <div class="menu-drink-card" data-name="<?= htmlspecialchars($product['product_name']) ?>" data-product-id="<?= (int)$product['product_id'] ?>">
                            <div class="menu-card-pic"
                                 style="background-image: url('<?= htmlspecialchars($product['image']) ?>'); background-position: center;">
                            </div>
                            <div class="menu-card-text">
                                <h2><?= htmlspecialchars($product['product_name']) ?></h2>
                                <p><?= htmlspecialchars($product['description']) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

            </div>
        </div>
    </section>




<!-- ===================== SNACKS HEADER ===================== -->
    <section class="MENU-GROUP-HEADER" id="SNACKS-LINE-UP" data-group-header="snacks">
        <div class="MENU-GROUP-CONTENT">
            <p>Freshly Served</p>
            <h2>SNACKS</h2>
        </div>
    </section>




<!-- ======================== TAKOYAKI ======================== -->
    <section class="TAKOYAKI menu-section show" id="takoyaki" data-menu-section data-menu-group="snacks">
        <div class="TAKOYAKI-CONTENTS">
            <h1>TAKOYAKI</h1>

<!-- ===================== TAKOYAKI ITEMS ===================== -->
            <div class="TAKOYAKI-MENU menu-cards-grid">

                <?php if (!empty($productByCategory['takoyaki'])): ?>
                    <?php foreach ($productByCategory['takoyaki'] as $product): ?>
                        <div class="menu-drink-card" data-name="<?= htmlspecialchars($product['product_name']) ?>" data-product-id="<?= (int)$product['product_id'] ?>">
                            <div class="menu-card-pic"
                                 style="background-image: url('<?= htmlspecialchars($product['image']) ?>'); background-position: center;">
                            </div>
                            <div class="menu-card-text">
                                <h2><?= htmlspecialchars($product['product_name']) ?></h2>
                                <p><?= htmlspecialchars($product['description']) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

            </div>
        </div>
    </section>




<!-- ======================== SHAWARMA ======================== -->
    <section class="SHAWARMA menu-section show" id="shawarma" data-menu-section data-menu-group="snacks">
        <div class="SHAWARMA-CONTENTS">
            <h1>SHAWARMA</h1>

<!-- ===================== SHAWARMA ITEMS ===================== -->
            <div class="SHAWARMA-MENU menu-cards-grid">

                <?php if (!empty($productByCategory['shawarma'])): ?>
                    <?php foreach ($productByCategory['shawarma'] as $product): ?>
                        <div class="menu-drink-card" data-name="<?= htmlspecialchars($product['product_name']) ?>" data-product-id="<?= (int)$product['product_id'] ?>">
                            <div class="menu-card-pic"
                                 style="background-image: url('<?= htmlspecialchars($product['image']) ?>'); background-position: center;">
                            </div>
                            <div class="menu-card-text">
                                <h2><?= htmlspecialchars($product['product_name']) ?></h2>
                                <p><?= htmlspecialchars($product['description']) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

            </div>
        </div>
    </section>




<!-- ================= CHICKEN WINGS + FRIES ================= -->
    <section class="CHICKEN-WINGS menu-section show" id="chicken-wings-fries" data-menu-section data-menu-group="snacks">
        <div class="CHICKEN-WINGS-CONTENTS">
            <h1>CHICKEN WINGS + FRIES</h1>

<!-- ================= CHICKEN WINGS ITEMS ================= -->
            <div class="CHICKEN-WINGS-MENU menu-cards-grid">

                <?php if (!empty($productByCategory['chicken-wings-fries'])): ?>
                    <?php foreach ($productByCategory['chicken-wings-fries'] as $product): ?>
                        <div class="menu-drink-card" data-name="<?= htmlspecialchars($product['product_name']) ?>" data-product-id="<?= (int)$product['product_id'] ?>">
                            <div class="menu-card-pic"
                                 style="background-image: url('<?= htmlspecialchars($product['image']) ?>'); background-position: center;">
                            </div>
                            <div class="menu-card-text">
                                <h2><?= htmlspecialchars($product['product_name']) ?></h2>
                                <p><?= htmlspecialchars($product['description']) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

            </div>
        </div>
    </section>




<!-- ========================= BURGER ======================== -->
    <section class="BURGER menu-section show" id="burger" data-menu-section data-menu-group="snacks">
        <div class="BURGER-CONTENTS">
            <h1>BURGER</h1>

<!-- ====================== BURGER ITEMS ====================== -->
            <div class="BURGER-MENU menu-cards-grid">

                <?php if (!empty($productByCategory['burger'])): ?>
                    <?php foreach ($productByCategory['burger'] as $product): ?>
                        <div class="menu-drink-card" data-name="<?= htmlspecialchars($product['product_name']) ?>" data-product-id="<?= (int)$product['product_id'] ?>">
                            <div class="menu-card-pic"
                                 style="background-image: url('<?= htmlspecialchars($product['image']) ?>'); background-position: center;">
                            </div>
                            <div class="menu-card-text">
                                <h2><?= htmlspecialchars($product['product_name']) ?></h2>
                                <p><?= htmlspecialchars($product['description']) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

            </div>
        </div>
    </section>




<!-- ========================== FRIES ========================= -->
    <section class="FRIES menu-section show" id="fries" data-menu-section data-menu-group="snacks">
        <div class="FRIES-CONTENTS">
            <h1>FRIES</h1>

<!-- ======================= FRIES ITEMS ====================== -->
            <div class="FRIES-MENU menu-cards-grid">

                <?php if (!empty($productByCategory['fries'])): ?>
                    <?php foreach ($productByCategory['fries'] as $product): ?>
                        <div class="menu-drink-card" data-name="<?= htmlspecialchars($product['product_name']) ?>" data-product-id="<?= (int)$product['product_id'] ?>">
                            <div class="menu-card-pic"
                                 style="background-image: url('<?= htmlspecialchars($product['image']) ?>'); background-position: center;">
                            </div>
                            <div class="menu-card-text">
                                <h2><?= htmlspecialchars($product['product_name']) ?></h2>
                                <p><?= htmlspecialchars($product['description']) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>

            </div>
        </div>
    </section>




<!-- ======================== FOOTER ========================= -->
    <footer id="footer">
        <div class="FOOTER-CONTAINER">
            <!-- ======================= FOOTER LOGO ======================= -->
            <div class="FOOTER-IMG-CONTAINER">
                <img src="images/footer_logo.png" alt="YAS footer logo">
            </div>




<!-- ====================== FOOTER DETAILS ===================== -->
            <div class="FOOTER-TEXTS">
                <p>
                    Born to serve sweet vibes and tasty drinks.<br>
                    Your local spot for milk teas and savory snacks.<br>
                    Fresh flavors, good company, and a touch of fun in every cup.
                </p>




<!-- ====================== FOOTER ICONS ====================== -->
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




<!-- ==================== BACK TO TOP ======================== -->
    <div class="BACK-TO-TOP" id="back-to-top" role="button" tabindex="0" aria-label="Back to top" title="Go to top">
        <i class="fa-solid fa-circle-chevron-up" style="color: #ff5eb3;"></i>
    </div>




<!-- ===================== PAGE SCRIPT ======================= -->
    <script src="script.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('.menu-drink-card').forEach(function (card) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function () {
                    const productId   = card.getAttribute('data-product-id');
                    const productName = card.getAttribute('data-name');
                    const section     = card.closest('[data-menu-section]');
                    const category    = section ? section.id : '';
                    const picEl       = card.querySelector('.menu-card-pic');
                    const bgStyle     = picEl ? picEl.style.backgroundImage : '';
                    const imageMatch  = bgStyle.match(/url\(['"]?(.*?)['"]?\)/);
                    const image       = imageMatch ? imageMatch[1] : '';

                    if (productId) {
                        // Save to sessionStorage as backup
                        sessionStorage.setItem('currentProductId', productId);

                        window.location.href = 'customerItems.html?product_id=' + productId
                            + '&item='     + encodeURIComponent(productName)
                            + '&category=' + encodeURIComponent(category)
                            + '&image='    + encodeURIComponent(image);
                    }
                });
            });
        });
    </script>
</body>
</html>



