-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2026 at 01:49 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yas_milktea_house`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `address_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `address_type` enum('home','office','other') DEFAULT 'home',
  `house_no` varchar(50) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `barangay` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `address_line` varchar(255) NOT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `delivery_instructions` text DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`address_id`, `user_id`, `address_type`, `house_no`, `street`, `barangay`, `city`, `province`, `address_line`, `landmark`, `delivery_instructions`, `is_primary`, `created_at`, `updated_at`) VALUES
(25, 28, 'home', '143', 'Yas', 'Tina', 'San Miguel', 'Surigao del Sur', '143 Yas street, Barangay Tina, San Miguel, Surigao del Sur', 'Sa Puso Mo', 'Kiss sa cheeks', 1, '2026-05-08 15:43:34', '2026-05-08 15:43:34'),
(28, 37, 'home', 'blk 51 lot 10', 'duhat', 'Mahayag (Maitum)', 'San Miguel', 'Surigao del Sur', 'blk 51 lot 10 duhat street, Barangay Mahayag (Maitum), San Miguel, Surigao del Sur', 'near laundry shop', '', 0, '2026-05-11 17:50:11', '2026-05-11 17:50:11');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(10) UNSIGNED NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `category_slug`) VALUES
(1, 'Classic Milktea', 'classic-milktea'),
(2, 'Premium Milktea', 'premium-milktea'),
(3, 'Cream Cheese Series', 'cream-cheese'),
(4, 'Fruit Milk', 'fruit-milk'),
(5, 'Fruit Tea', 'fruit-tea'),
(6, 'Takoyaki', 'takoyaki'),
(7, 'Shawarma', 'shawarma'),
(8, 'Chicken Wings + Fries', 'chicken-wings-fries'),
(9, 'Burger', 'burger'),
(10, 'Fries', 'fries');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `order_date` datetime NOT NULL,
  `order_type` enum('dine-in','to-go','delivery') NOT NULL DEFAULT 'to-go',
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','preparing','completed','cancelled') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `order_date`, `order_type`, `total_amount`, `status`) VALUES
(14, 28, '2026-05-05 13:28:19', 'delivery', 260.00, 'completed'),
(26, 38, '2026-05-11 18:50:34', 'delivery', 245.00, 'pending'),
(27, 28, '2026-05-11 22:46:34', 'delivery', 335.00, 'completed'),
(28, 28, '2026-05-11 23:05:58', 'dine-in', 170.00, 'pending'),
(29, 37, '2026-05-11 23:20:34', 'dine-in', 120.00, 'pending'),
(30, 37, '2026-05-12 01:29:44', 'delivery', 115.00, 'pending'),
(31, 37, '2026-05-12 01:30:05', 'dine-in', 125.00, 'completed'),
(32, 37, '2026-05-12 01:52:08', 'dine-in', 90.00, 'preparing');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `location` varchar(20) NOT NULL,
  `size` varchar(20) DEFAULT NULL,
  `sugar_level` varchar(10) DEFAULT NULL,
  `addons` text DEFAULT NULL,
  `flavor` varchar(50) DEFAULT NULL,
  `pieces_per_box` varchar(20) DEFAULT NULL,
  `serving` varchar(30) DEFAULT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `location`, `size`, `sugar_level`, `addons`, `flavor`, `pieces_per_box`, `serving`, `quantity`, `price`) VALUES
(10, 14, 12, 'Delivery', '22oz', '25%', 'Whip (₱25)', NULL, NULL, NULL, 1, 145.00),
(11, 14, 3, 'Delivery', '16oz', '25%', 'None', NULL, NULL, NULL, 1, 90.00),
(29, 26, 1, 'Delivery', '16oz', '100%', 'Oreo (₱20)', NULL, NULL, NULL, 2, 110.00),
(30, 27, 11, 'Delivery', '22oz', '75%', 'Boba (₱15), Oreo (₱20)', NULL, NULL, NULL, 2, 155.00),
(31, 28, 3, 'Dine In', '22oz', '25%', 'Whip (₱25), White Pearl (₱20), Fruit Jelly (₱15)', NULL, NULL, NULL, 1, 170.00),
(32, 29, 22, 'Dine In', '16oz', '25%', 'Oreo (₱20), Nata (₱15), White Pearl (₱20)', NULL, NULL, NULL, 1, 120.00),
(33, 30, 3, 'Delivery', '16oz', '25%', 'None', NULL, NULL, NULL, 1, 90.00),
(34, 31, 1, 'Dine In', '16oz', '100%', 'White Pearl (₱20), Fruit Jelly (₱15)', NULL, NULL, NULL, 1, 125.00),
(35, 32, 53, 'Dine In', '16oz', '25%', 'None', NULL, NULL, NULL, 1, 90.00);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `method` enum('cash_on_delivery','cash','gcash','online_payment') NOT NULL DEFAULT 'cash_on_delivery',
  `status` enum('active','paid','unpaid','refunded','pending') NOT NULL DEFAULT 'unpaid',
  `receipt_info` varchar(255) DEFAULT NULL,
  `gcash_reference` varchar(100) DEFAULT NULL,
  `gcash_mobile` varchar(30) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `order_id`, `amount`, `method`, `status`, `receipt_info`, `gcash_reference`, `gcash_mobile`, `payment_date`) VALUES
(7, 14, 260.00, 'cash_on_delivery', 'unpaid', 'Unofficial receipt pending', NULL, NULL, '2026-05-05 05:28:19'),
(16, 26, 245.00, 'cash_on_delivery', 'unpaid', 'Unofficial receipt pending', NULL, NULL, '2026-05-11 10:50:34'),
(17, 27, 335.00, 'gcash', 'paid', NULL, '0123456789', '0999999999', '2026-05-11 14:46:34'),
(18, 28, 170.00, 'gcash', 'unpaid', 'Awaiting payment', '676767676767', '09671432026', '2026-05-11 15:05:58'),
(19, 29, 120.00, 'gcash', 'unpaid', 'Awaiting payment', 'xs', 'jhxs,a', '2026-05-11 15:20:34'),
(20, 30, 115.00, 'cash_on_delivery', 'unpaid', 'Unofficial receipt pending', NULL, NULL, '2026-05-11 17:29:45'),
(21, 31, 125.00, 'cash_on_delivery', 'paid', 'Payment verified', NULL, NULL, '2026-05-11 17:30:05'),
(22, 32, 90.00, 'gcash', 'unpaid', 'Awaiting payment', '1', '15', '2026-05-11 17:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `price_16` decimal(10,2) NOT NULL DEFAULT 0.00,
  `price_22` decimal(10,2) NOT NULL DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','archive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `price_16`, `price_22`, `description`, `stock`, `image`, `status`) VALUES
(1, 1, 'Matcha', 90.00, 110.00, 'Smooth and earthy with a comforting green tea taste.', 100, 'images/mt_matcha.jpg', 'active'),
(2, 1, 'Okinawa', 90.00, 110.00, 'Caramel-like brown sugar milk tea that feels warm and cozy.', 100, 'images/mt_okinawa.jpg', 'active'),
(3, 1, 'Red Velvet', 90.00, 110.00, 'Sweet, creamy, and cake-like with a hint of cocoa.', 100, 'images/mt_redvelvet.jpg', 'active'),
(4, 1, 'Wintermelon', 90.00, 110.00, 'Light, sweet, and refreshing with a mellow honey vibe.', 100, 'images/mt_wintermelon.jpg', 'active'),
(5, 1, 'Taro', 90.00, 110.00, 'Soft, nutty, and sweet with that classic purple flavor.', 100, 'images/mt_taro.jpg', 'active'),
(6, 1, 'Hokkaido', 90.00, 110.00, 'Rich, creamy, and buttery with a deep caramel taste.', 100, 'images/mt_hokkaido.jpg', 'active'),
(7, 2, 'Black Sugar', 95.00, 120.00, 'Sweet, smoky caramel flavor with a rich milk base.', 100, 'images/pmt_blacksugar.jpg', 'active'),
(8, 2, 'Lava Latte', 95.00, 120.00, 'Bold coffee flavor with a creamy, milky finish.', 100, 'images/pmt_lavalatte.jpg', 'active'),
(9, 2, 'Cookies n\' Cream', 95.00, 120.00, 'Creamy blend with crushed cookies in every sip.', 100, 'images/pmt_cookiesncream.jpg', 'active'),
(10, 2, 'Dark Chocolate', 95.00, 120.00, 'Deep, bittersweet cocoa for chocolate lovers.', 100, 'images/pmt_darkchoco.jpg', 'active'),
(11, 2, 'Nutella', 95.00, 120.00, 'Smooth chocolate-hazelnut drink that feels like dessert.', 100, 'images/pmt_nutella.jpg', 'active'),
(12, 2, 'Matcha Oreo', 95.00, 120.00, 'Earthy matcha mixed with crunchy, sweet Oreo goodness.', 100, 'images/pmt_matchaoreo.jpg', 'active'),
(13, 2, 'Black Forest', 95.00, 120.00, 'Chocolatey drink with a hint of cherry sweetness.', 100, 'images/pmt_blackforest.jpg', 'active'),
(14, 3, 'Choco Hazelnut', 99.00, 130.00, 'Creamy chocolate-hazelnut drink topped with silky cream cheese.', 100, 'images/cc_chocohazelnut.jpg', 'active'),
(15, 3, 'Matcha Cream Cheese', 99.00, 130.00, 'Earthy matcha paired with a salty-sweet cream cheese topping.', 100, 'images/cc_matcha.jpg', 'active'),
(16, 3, 'Fuji Chocolate', 95.00, 125.00, 'Smooth, premium chocolate flavor with a rich cream cheese finish.', 100, 'images/cc_fujichocolate.jpg', 'active'),
(17, 3, 'Okinawa Cream Cheese', 95.00, 125.00, 'Brown sugar milk tea topped with creamy, fluffy cheese foam.', 100, 'images/cc_okinawa.jpg', 'active'),
(18, 3, 'Red Velvet Royale', 95.00, 125.00, 'Sweet red velvet blend made extra luxurious with cream cheese foam.', 100, 'images/cc_redvelvetroyale.jpg', 'active'),
(19, 3, 'Oreo Cream Cheese', 99.00, 130.00, 'Crushed Oreo in a creamy drink finished with thick cream cheese.', 100, 'images/cc_oreo.jpg', 'active'),
(20, 4, 'Strawberry', 74.00, 95.00, 'Creamy milk with a fresh, juicy strawberry taste.', 100, 'images/fm_strawberry.jpg', 'active'),
(21, 4, 'Kiwi Fruit', 74.00, 95.00, 'Light, tangy kiwi mixed with smooth, sweet milk.', 100, 'images/fm_kiwi.jpg', 'active'),
(22, 4, 'Blueberry', 74.00, 95.00, 'Smooth and milky with a soft, berry sweetness.', 100, 'images/fm_blueberry.jpg', 'active'),
(23, 4, 'Honey Peach', 74.00, 95.00, 'Soft peach flavor with a gentle honey-like sweetness.', 100, 'images/fm_honeypeach.jpg', 'active'),
(24, 4, 'Mango', 74.00, 95.00, 'Rich, tropical mango flavor blended with creamy milk.', 100, 'images/fm_mango.jpg', 'active'),
(25, 4, 'Grape Fruit', 74.00, 95.00, 'Sweet, fruity grape taste blended into creamy milk.', 100, 'images/fm_grape.jpg', 'active'),
(26, 5, 'Blueberry', 65.00, 90.00, 'Bright, sweet blueberry flavor with a crisp tea base.', 100, 'images/ft_blueberry.jpg', 'active'),
(27, 5, 'Lychee', 65.00, 90.00, 'Soft, floral lychee flavor with a refreshing finish.', 100, 'images/ft_lychee.jpg', 'active'),
(28, 5, 'Blue Lemonade', 65.00, 90.00, 'Cool, citrusy blend with a splash of blue lemonade tang.', 100, 'images/ft_bluelemonade.jpg', 'active'),
(29, 5, 'Four Seasons', 65.00, 90.00, 'Fruity mix of citrus and tropical flavors in one cup.', 100, 'images/ft_fourseasons.jpg', 'active'),
(30, 5, 'Strawberry', 65.00, 90.00, 'Light tea mixed with fresh, juicy strawberry sweetness.', 100, 'images/ft_strawberry.jpg', 'active'),
(31, 5, 'Green Apple', 65.00, 90.00, 'Crisp, tart green apple blended with smooth tea.', 100, 'images/ft_greenapple.jpg', 'active'),
(32, 6, 'Takoyaki', 60.00, 120.00, 'A snack favorite with crispy bites, savory toppings, and placeholder flavor notes for now.', 100, 'images/takoyaki.jpg', 'active'),
(33, 7, 'Shawarma', 60.00, 90.00, 'Warm wraps with savory fillings and placeholder flavor details while you build the final snack copy.', 100, 'images/shawarma-original.png', 'active'),
(34, 8, 'Hickory Barbecue', 95.00, 180.00, 'Smoky chicken wings with fries and a placeholder description for your final menu wording.', 100, 'images/cwf-hickorybarbeque.png', 'active'),
(35, 8, 'Sriracha', 95.00, 180.00, 'Spicy wings and fries with a bold kick and placeholder description text for now.', 100, 'images/cwf-sriracha.png', 'active'),
(36, 8, 'Yangneom (Korean Flavor)', 95.00, 180.00, 'Sweet and spicy Korean-style wings paired with fries and placeholder menu copy.', 100, 'images/cwf-yangneom.png', 'active'),
(37, 8, 'Honey Mustard', 95.00, 180.00, 'Tangy-sweet wings with fries and a placeholder description until you add the final version.', 100, 'images/cwf-honeymustard.png', 'active'),
(38, 8, 'Lemon Glazed', 95.00, 180.00, 'Zesty glazed wings with fries and placeholder copy to keep the layout ready.', 100, 'images/cwf-lemonglazed.png', 'active'),
(39, 8, 'Buffalo', 95.00, 180.00, 'Classic buffalo wings and fries with placeholder details while the menu text is still in progress.', 100, 'images/cwf-buffalo.png', 'active'),
(40, 8, 'Soy Garlic', 95.00, 180.00, 'Garlicky glazed wings with fries and placeholder flavor notes for the final write-up.', 100, 'images/cwf-soygarlic.png', 'active'),
(41, 9, 'Plain Burger', 35.00, 0.00, 'A simple savory burger with placeholder description text until you add the final copy.', 100, 'images/b-plain.png', 'active'),
(42, 9, 'Egg and Cheese Burger', 45.00, 0.00, 'A richer burger combo with placeholder wording so the section stays complete for now.', 100, 'images/b-eggcheese.png', 'active'),
(43, 9, 'Double Burger', 75.00, 0.00, 'A bigger burger option with placeholder menu copy while you finish the descriptions.', 100, 'images/b-double.png', 'active'),
(44, 9, 'Special Burger', 80.00, 0.00, 'A loaded burger pick with placeholder notes that you can replace with your final text later.', 100, 'images/b-special.png', 'active'),
(45, 10, 'Fries', 30.00, 100.00, 'Crispy fries with placeholder description text while the final details are still being prepared.', 100, 'images/f-medium.png', 'active'),
(53, 1, 'agshjgas', 51.00, 562.00, 'csax', 100, 'https://wallup.net/wp-content/uploads/2018/10/06/708149-kittens-kitten-cat-cats-baby-cute-s.jpg', 'archive'),
(54, 1, 'agshjgasbvtrec', 51.00, 562.00, 'vcsxs', 100, 'https://tse1.mm.bing.net/th/id/OIP.OQ9bpEwoLCZvpwV7-XjZ9AHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'archive'),
(55, 1, 'ArchiveTest', 67.00, 67.00, 'vdc', 100, 'https://tse1.mm.bing.net/th/id/OIP.OQ9bpEwoLCZvpwV7-XjZ9AHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 'archive'),
(56, 2, 'Test Product', 1000.00, 5000.00, 'BARBEI', 100, 'https://i.pinimg.com/736x/59/b3/ac/59b3ac35dd06ede9530bcea7951e7f87.jpg', 'archive');

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `reward_id` int(10) UNSIGNED NOT NULL,
  `reward_name` varchar(150) NOT NULL,
  `points_required` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','customer','staff') NOT NULL,
  `status` enum('active','inactive','pending') NOT NULL DEFAULT 'pending',
  `verification_token` varchar(255) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `full_name` varchar(150) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT 'images/yas_logo.png',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `role`, `status`, `verification_token`, `verified_at`, `created_at`, `full_name`, `contact_number`, `date_of_birth`, `profile_picture`, `updated_at`) VALUES
(21, 'Stef_admin', 'marekeyks101@gmail.com', '$2y$10$46yj/F93p7Gf3eJ0gEtOG.bYAkSg62LkejbqvkwW.4/4BpSXeLA6O', 'admin', 'active', NULL, NULL, '2026-05-01 19:36:27', 'Stephanie Baltazar', NULL, NULL, 'images/profile_21_1778329893.jpg', '2026-05-09 12:31:33'),
(27, 'testuser456', 'testuser456@example.com', '$2y$10$94OqRBmJyUjqWW5I69r.leBf7jwvCRpIxzS7Z.TnVtav/LbMewEe6', 'customer', 'inactive', NULL, NULL, '2026-05-04 16:03:10', NULL, NULL, NULL, 'images/yas_logo.png', '2026-05-11 14:13:03'),
(28, 'krisha_customer', 'narcisokrishaaudrey@gmail.com', '$2y$10$awo1Y7BwclbQEA0vQnJB3.ispUVF1lSKSZO1o9gkvZQWlrK8iXyNW', 'customer', 'active', NULL, NULL, '2026-05-04 16:11:03', NULL, NULL, NULL, 'images/profile_28_1778251916.jpg', '2026-05-08 14:51:56'),
(37, 'kirii', 'Kirigato.07@gmail.com', '$2y$10$V9ZYg08SOrjkw3S40Vnwle7Rl2OjQk23JZLocjUrf/dELPIbp7oUS', 'customer', 'active', NULL, '2026-05-10 05:18:27', '2026-05-10 05:16:49', 'vkcd', '456', '2625-05-05', 'images/yas_logo.png', '2026-05-11 17:56:01'),
(38, 'ayokona', 'chescamanding5@gmail.com', '$2y$10$a7JLBZH2xSAkwwHUnpfML.Eg4Y0p/7lr2XsmtiynD17c0iC466ci2', 'customer', 'active', NULL, '2026-05-11 10:26:50', '2026-05-11 10:26:26', NULL, NULL, NULL, 'images/yas_logo.png', '2026-05-11 10:26:50'),
(39, 'Krisha_staff', 'crazyy.icecreamm@gmail.com', '$2y$10$jB8xfyjhj/fLGK9Jtxv7Bec7HjPjzyLdLRG8NU62mXCRMk1es4Npa', 'staff', 'active', NULL, '2026-05-11 11:34:59', '2026-05-11 11:33:46', 'Krisha Audrey Narciso', NULL, NULL, 'images/profile_39_1778508611.png', '2026-05-11 14:10:11'),
(42, 'YuraShirota', 'sbaltazar.1012@umak.edu.ph', '$2y$10$iUL1IOA/lWFwsdoLpBr4c.I/A95qEqz1MFWOCfqJ/LpVVILyd1CYG', 'customer', 'pending', 'b52345e1bd4006343575f0da9e90ef8e8f9071dade2f7c16125cdc330ca990aa', NULL, '2026-05-13 11:45:39', NULL, NULL, NULL, 'images/yas_logo.png', '2026-05-13 11:45:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`address_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `unique_category_name` (`category_name`),
  ADD UNIQUE KEY `unique_category_slug` (`category_slug`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `unique_order_payment` (`order_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_product_status` (`status`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`reward_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD UNIQUE KEY `unique_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `reward_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
