-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2026 at 06:25 AM
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
  `address_line` varchar(255) NOT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `delivery_instructions` text DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(13, 29, '2026-05-05 12:22:50', 'delivery', 690.00, 'pending');

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
(6, 13, 42, 'To Go', 'N/A', NULL, 'None', NULL, NULL, NULL, 1, 45.00),
(7, 13, 33, 'Delivery', 'All Meat', NULL, 'None', 'All Meat', NULL, NULL, 1, 80.00),
(8, 13, 10, 'Dine In', '16oz', '75%', 'Whip (₱25)', NULL, NULL, NULL, 3, 120.00),
(9, 13, 1, 'Delivery', '22oz', '100%', 'Whip (₱25), White Pearl (₱20)', NULL, NULL, NULL, 1, 155.00);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `method` enum('cash_on_delivery','online_payment') NOT NULL DEFAULT 'cash_on_delivery',
  `status` enum('paid','refunded','pending') NOT NULL DEFAULT 'pending',
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `order_id`, `amount`, `method`, `status`, `payment_date`) VALUES
(6, 13, 690.00, 'cash_on_delivery', 'pending', '2026-05-05 04:22:50');

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
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `price_16`, `price_22`, `description`, `stock`, `image`) VALUES
(1, 1, 'Matcha', 90.00, 110.00, 'Smooth and earthy with a comforting green tea taste.', 100, 'images/mt_matcha.jpg'),
(2, 1, 'Okinawa', 90.00, 110.00, 'Caramel-like brown sugar milk tea that feels warm and cozy.', 100, 'images/mt_okinawa.jpg'),
(3, 1, 'Red Velvet', 90.00, 110.00, 'Sweet, creamy, and cake-like with a hint of cocoa.', 100, 'images/mt_redvelvet.jpg'),
(4, 1, 'Wintermelon', 90.00, 110.00, 'Light, sweet, and refreshing with a mellow honey vibe.', 100, 'images/mt_wintermelon.jpg'),
(5, 1, 'Taro', 90.00, 110.00, 'Soft, nutty, and sweet with that classic purple flavor.', 100, 'images/mt_taro.jpg'),
(6, 1, 'Hokkaido', 90.00, 110.00, 'Rich, creamy, and buttery with a deep caramel taste.', 100, 'images/mt_hokkaido.jpg'),
(7, 2, 'Black Sugar', 95.00, 120.00, 'Sweet, smoky caramel flavor with a rich milk base.', 100, 'images/pmt_blacksugar.jpg'),
(8, 2, 'Lava Latte', 95.00, 120.00, 'Bold coffee flavor with a creamy, milky finish.', 100, 'images/pmt_lavalatte.jpg'),
(9, 2, 'Cookies n\' Cream', 95.00, 120.00, 'Creamy blend with crushed cookies in every sip.', 100, 'images/pmt_cookiesncream.jpg'),
(10, 2, 'Dark Chocolate', 95.00, 120.00, 'Deep, bittersweet cocoa for chocolate lovers.', 100, 'images/pmt_darkchoco.jpg'),
(11, 2, 'Nutella', 95.00, 120.00, 'Smooth chocolate-hazelnut drink that feels like dessert.', 100, 'images/pmt_nutella.jpg'),
(12, 2, 'Matcha Oreo', 95.00, 120.00, 'Earthy matcha mixed with crunchy, sweet Oreo goodness.', 100, 'images/pmt_matchaoreo.jpg'),
(13, 2, 'Black Forest', 95.00, 120.00, 'Chocolatey drink with a hint of cherry sweetness.', 100, 'images/pmt_blackforest.jpg'),
(14, 3, 'Choco Hazelnut', 99.00, 130.00, 'Creamy chocolate-hazelnut drink topped with silky cream cheese.', 100, 'images/cc_chocohazelnut.jpg'),
(15, 3, 'Matcha Cream Cheese', 99.00, 130.00, 'Earthy matcha paired with a salty-sweet cream cheese topping.', 100, 'images/cc_matcha.jpg'),
(16, 3, 'Fuji Chocolate', 95.00, 125.00, 'Smooth, premium chocolate flavor with a rich cream cheese finish.', 100, 'images/cc_fujichocolate.jpg'),
(17, 3, 'Okinawa Cream Chees', 95.00, 125.00, 'Brown sugar milk tea topped with creamy, fluffy cheese foam.', 100, 'images/cc_okinawa.jpg'),
(18, 3, 'Red Velvet Royale', 95.00, 125.00, 'Sweet red velvet blend made extra luxurious with cream cheese foam.', 100, 'images/cc_redvelvetroyale.jpg'),
(19, 3, 'Oreo Cream Cheese', 99.00, 130.00, 'Crushed Oreo in a creamy drink finished with thick cream cheese.', 100, 'images/cc_oreo.jpg'),
(20, 4, 'Strawberry', 74.00, 95.00, 'Creamy milk with a fresh, juicy strawberry taste.', 100, 'images/fm_strawberry.jpg'),
(21, 4, 'Kiwi Fruit', 74.00, 95.00, 'Light, tangy kiwi mixed with smooth, sweet milk.', 100, 'images/fm_kiwi.jpg'),
(22, 4, 'Blueberry', 74.00, 95.00, 'Smooth and milky with a soft, berry sweetness.', 100, 'images/fm_blueberry.jpg'),
(23, 4, 'Honey Peach', 74.00, 95.00, 'Soft peach flavor with a gentle honey-like sweetness.', 100, 'images/fm_honeypeach.jpg'),
(24, 4, 'Mango', 74.00, 95.00, 'Rich, tropical mango flavor blended with creamy milk.', 100, 'images/fm_mango.jpg'),
(25, 4, 'Grape Fruit', 74.00, 95.00, 'Sweet, fruity grape taste blended into creamy milk.', 100, 'images/fm_grape.jpg'),
(26, 5, 'Blueberry', 65.00, 90.00, 'Bright, sweet blueberry flavor with a crisp tea base.', 100, 'images/ft_blueberry.jpg'),
(27, 5, 'Lychee', 65.00, 90.00, 'Soft, floral lychee flavor with a refreshing finish.', 100, 'images/ft_lychee.jpg'),
(28, 5, 'Blue Lemonade', 65.00, 90.00, 'Cool, citrusy blend with a splash of blue lemonade tang.', 100, 'images/ft_bluelemonade.jpg'),
(29, 5, 'Four Seasons', 65.00, 90.00, 'Fruity mix of citrus and tropical flavors in one cup.', 100, 'images/ft_fourseasons.jpg'),
(30, 5, 'Strawberry', 65.00, 90.00, 'Light tea mixed with fresh, juicy strawberry sweetness.', 100, 'images/ft_strawberry.jpg'),
(31, 5, 'Green Apple', 65.00, 90.00, 'Crisp, tart green apple blended with smooth tea.', 100, 'images/ft_greenapple.jpg'),
(32, 6, 'Takoyaki', 60.00, 120.00, 'A snack favorite with crispy bites, savory toppings, and placeholder flavor notes for now.', 100, 'images/takoyaki.jpg'),
(33, 7, 'Shawarma', 60.00, 90.00, 'Warm wraps with savory fillings and placeholder flavor details while you build the final snack copy.', 100, 'images/shawarma-original.png'),
(34, 8, 'Hickory Barbecue', 95.00, 180.00, 'Smoky chicken wings with fries and a placeholder description for your final menu wording.', 100, 'images/cwf-hickorybarbeque.png'),
(35, 8, 'Sriracha', 95.00, 180.00, 'Spicy wings and fries with a bold kick and placeholder description text for now.', 100, 'images/cwf-sriracha.png'),
(36, 8, 'Yangneom (Korean Flavor)', 95.00, 180.00, 'Sweet and spicy Korean-style wings paired with fries and placeholder menu copy.', 100, 'images/cwf-yangneom.png'),
(37, 8, 'Honey Mustard', 95.00, 180.00, 'Tangy-sweet wings with fries and a placeholder description until you add the final version.', 100, 'images/cwf-honeymustard.png'),
(38, 8, 'Lemon Glazed', 95.00, 180.00, 'Zesty glazed wings with fries and placeholder copy to keep the layout ready.', 100, 'images/cwf-lemonglazed.png'),
(39, 8, 'Buffalo', 95.00, 180.00, 'Classic buffalo wings and fries with placeholder details while the menu text is still in progress.', 100, 'images/cwf-buffalo.png'),
(40, 8, 'Soy Garlic', 95.00, 180.00, 'Garlicky glazed wings with fries and placeholder flavor notes for the final write-up.', 100, 'images/cwf-soygarlic.png'),
(41, 9, 'Plain Burger', 35.00, 0.00, 'A simple savory burger with placeholder description text until you add the final copy.', 100, 'images/b-plain.png'),
(42, 9, 'Egg and Cheese Burger', 45.00, 0.00, 'A richer burger combo with placeholder wording so the section stays complete for now.', 100, 'images/b-eggcheese.png'),
(43, 9, 'Double Burger', 75.00, 0.00, 'A bigger burger option with placeholder menu copy while you finish the descriptions.', 100, 'images/b-double.png'),
(44, 9, 'Special Burger', 80.00, 0.00, 'A loaded burger pick with placeholder notes that you can replace with your final text later.', 100, 'images/b-special.png'),
(45, 10, 'Fries', 30.00, 100.00, 'Crispy fries with placeholder description text while the final details are still being prepared.', 100, 'images/f-medium.png');

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
  `role` enum('admin','customer') NOT NULL,
  `status` enum('active','inactive') NOT NULL,
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

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `role`, `status`, `created_at`, `full_name`, `contact_number`, `date_of_birth`, `profile_picture`, `updated_at`) VALUES
(21, 'Stef', 'marekeyks101@gmail.com', '$2y$10$46yj/F93p7Gf3eJ0gEtOG.bYAkSg62LkejbqvkwW.4/4BpSXeLA6O', 'admin', 'active', '2026-05-01 19:36:27', NULL, NULL, NULL, 'images/yas_logo.png', '2026-05-04 16:16:21'),
(27, 'testuser456', 'testuser456@example.com', '$2y$10$94OqRBmJyUjqWW5I69r.leBf7jwvCRpIxzS7Z.TnVtav/LbMewEe6', 'customer', 'active', '2026-05-04 16:03:10', NULL, NULL, NULL, 'images/yas_logo.png', '2026-05-04 16:16:21'),
(28, 'krisha_customer', 'narcisokrishaaudrey@gmail.com', '$2y$10$awo1Y7BwclbQEA0vQnJB3.ispUVF1lSKSZO1o9gkvZQWlrK8iXyNW', 'customer', 'active', '2026-05-04 16:11:03', NULL, NULL, NULL, 'images/yas_logo.png', '2026-05-04 16:16:21'),
(29, 'Stephanie', 'Kirigato.07@gmail.com', '$2y$10$GbGHscfNMwNfvG8uVCa/xeayz4j6Txq9Ox/AR96DHed0Q4MSp7AjC', 'customer', 'active', '2026-05-04 16:43:23', NULL, NULL, NULL, 'images/profile_29_1777913079.jpg', '2026-05-04 16:44:39');

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
  ADD PRIMARY KEY (`category_id`);

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
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`reward_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `address_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `reward_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
