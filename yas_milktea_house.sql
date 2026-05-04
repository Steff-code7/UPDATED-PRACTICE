-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2026 at 09:03 AM
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
(1, 1, 'Matcha', 0.00, 0.00, 'Smooth and earthy with a comforting green tea taste.', 100, 'images/mt_matcha.jpg'),
(2, 1, 'Okinawa', 0.00, 0.00, 'Caramel-like brown sugar milk tea that feels warm and cozy.', 100, 'images/mt_okinawa.jpg'),
(3, 1, 'Red Velvet', 0.00, 0.00, 'Sweet, creamy, and cake-like with a hint of cocoa.', 100, 'images/mt_redvelvet.jpg'),
(4, 1, 'Wintermelon', 0.00, 0.00, 'Light, sweet, and refreshing with a mellow honey vibe.', 100, 'images/mt_wintermelon.jpg'),
(5, 1, 'Taro', 0.00, 0.00, 'Soft, nutty, and sweet with that classic purple flavor.', 100, 'images/mt_taro.jpg'),
(6, 1, 'Hokkaido', 0.00, 0.00, 'Rich, creamy, and buttery with a deep caramel taste.', 100, 'images/mt_hokkaido.jpg'),
(7, 2, 'Black Sugar', 0.00, 0.00, 'Sweet, smoky caramel flavor with a rich milk base.', 100, 'images/pmt_blacksugar.jpg'),
(8, 2, 'Lava Latte', 0.00, 0.00, 'Bold coffee flavor with a creamy, milky finish.', 100, 'images/pmt_lavalatte.jpg'),
(9, 2, 'Cookies n\' Cream', 0.00, 0.00, 'Creamy blend with crushed cookies in every sip.', 100, 'images/pmt_cookiesncream.jpg'),
(10, 2, 'Dark Chocolate', 0.00, 0.00, 'Deep, bittersweet cocoa for chocolate lovers.', 100, 'images/pmt_darkchoco.jpg'),
(11, 2, 'Nutella', 0.00, 0.00, 'Smooth chocolate-hazelnut drink that feels like dessert.', 100, 'images/pmt_nutella.jpg'),
(12, 2, 'Matcha Oreo', 0.00, 0.00, 'Earthy matcha mixed with crunchy, sweet Oreo goodness.', 100, 'images/pmt_matchaoreo.jpg'),
(13, 2, 'Black Forest', 0.00, 0.00, 'Chocolatey drink with a hint of cherry sweetness.', 100, 'images/pmt_blackforest.jpg'),
(14, 3, 'Choco Hazelnut', 0.00, 0.00, 'Creamy chocolate-hazelnut drink topped with silky cream cheese.', 100, 'images/cc_chocohazelnut.jpg'),
(15, 3, 'Matcha Cream Cheese', 0.00, 0.00, 'Earthy matcha paired with a salty-sweet cream cheese topping.', 100, 'images/cc_matcha.jpg'),
(16, 3, 'Fuji Chocolate', 0.00, 0.00, 'Smooth, premium chocolate flavor with a rich cream cheese finish.', 100, 'images/cc_fujichocolate.jpg'),
(17, 3, 'Okinawa Cream Chees', 0.00, 0.00, 'Brown sugar milk tea topped with creamy, fluffy cheese foam.', 100, 'images/cc_okinawa.jpg'),
(18, 3, 'Red Velvet Royale', 0.00, 0.00, 'Sweet red velvet blend made extra luxurious with cream cheese foam.', 100, 'images/cc_redvelvetroyale.jpg'),
(19, 3, 'Oreo Cream Cheese', 0.00, 0.00, 'Crushed Oreo in a creamy drink finished with thick cream cheese.', 100, 'images/cc_oreo.jpg'),
(20, 4, 'Strawberry', 0.00, 0.00, 'Creamy milk with a fresh, juicy strawberry taste.', 100, 'images/fm_strawberry.jpg'),
(21, 4, 'Kiwi Fruit', 0.00, 0.00, 'Light, tangy kiwi mixed with smooth, sweet milk.', 100, 'images/fm_kiwi.jpg'),
(22, 4, 'Blueberry', 0.00, 0.00, 'Smooth and milky with a soft, berry sweetness.', 100, 'images/fm_blueberry.jpg'),
(23, 4, 'Honey Peach', 0.00, 0.00, 'Soft peach flavor with a gentle honey-like sweetness.', 100, 'images/fm_honeypeach.jpg'),
(24, 4, 'Mango', 0.00, 0.00, 'Rich, tropical mango flavor blended with creamy milk.', 100, 'images/fm_mango.jpg'),
(25, 4, 'Grape Fruit', 0.00, 0.00, 'Sweet, fruity grape taste blended into creamy milk.', 100, 'images/fm_grape.jpg'),
(26, 5, 'Blueberry', 0.00, 0.00, 'Bright, sweet blueberry flavor with a crisp tea base.', 100, 'images/ft_blueberry.jpg'),
(27, 5, 'Lychee', 0.00, 0.00, 'Soft, floral lychee flavor with a refreshing finish.', 100, 'images/ft_lychee.jpg'),
(28, 5, 'Blue Lemonade', 0.00, 0.00, 'Cool, citrusy blend with a splash of blue lemonade tang.', 100, 'images/ft_bluelemonade.jpg'),
(29, 5, 'Four Seasons', 0.00, 0.00, 'Fruity mix of citrus and tropical flavors in one cup.', 100, 'images/ft_fourseasons.jpg'),
(30, 5, 'Strawberry', 0.00, 0.00, 'Light tea mixed with fresh, juicy strawberry sweetness.', 100, 'images/ft_strawberry.jpg'),
(31, 5, 'Green Apple', 0.00, 0.00, 'Crisp, tart green apple blended with smooth tea.', 100, 'images/ft_greenapple.jpg'),
(32, 6, 'Takoyaki', 0.00, 0.00, 'A snack favorite with crispy bites, savory toppings, and placeholder flavor notes for now.', 100, 'images/takoyaki.jpg'),
(33, 7, 'Shawarma', 0.00, 0.00, 'Warm wraps with savory fillings and placeholder flavor details while you build the final snack copy.', 100, 'images/shawarma-original.png'),
(34, 8, 'Hickory Barbecue', 0.00, 0.00, 'Smoky chicken wings with fries and a placeholder description for your final menu wording.', 100, 'images/cwf-hickorybarbeque.png'),
(35, 8, 'Sriracha', 0.00, 0.00, 'Spicy wings and fries with a bold kick and placeholder description text for now.', 100, 'images/cwf-sriracha.png'),
(36, 8, 'Yangneom (Korean Flavor)', 0.00, 0.00, 'Sweet and spicy Korean-style wings paired with fries and placeholder menu copy.', 100, 'images/cwf-yangneom.png'),
(37, 8, 'Honey Mustard', 0.00, 0.00, 'Tangy-sweet wings with fries and a placeholder description until you add the final version.', 100, 'images/cwf-honeymustard.png'),
(38, 8, 'Lemon Glazed', 0.00, 0.00, 'Zesty glazed wings with fries and placeholder copy to keep the layout ready.', 100, 'images/cwf-lemonglazed.png'),
(39, 8, 'Buffalo', 0.00, 0.00, 'Classic buffalo wings and fries with placeholder details while the menu text is still in progress.', 100, 'images/cwf-buffalo.png'),
(40, 8, 'Soy Garlic', 0.00, 0.00, 'Garlicky glazed wings with fries and placeholder flavor notes for the final write-up.', 100, 'images/cwf-soygarlic.png'),
(41, 9, 'Plain Burger', 0.00, 0.00, 'A simple savory burger with placeholder description text until you add the final copy.', 100, 'images/b-plain.png'),
(42, 9, 'Egg and Cheese Burger', 0.00, 0.00, 'A richer burger combo with placeholder wording so the section stays complete for now.', 100, 'images/b-eggcheese.png'),
(43, 9, 'Double Burger', 0.00, 0.00, 'A bigger burger option with placeholder menu copy while you finish the descriptions.', 100, 'images/b-double.png'),
(44, 9, 'Special Burger', 0.00, 0.00, 'A loaded burger pick with placeholder notes that you can replace with your final text later.', 100, 'images/b-special.png'),
(45, 10, 'Fries', 0.00, 0.00, 'Crispy fries with placeholder description text while the final details are still being prepared.', 100, 'images/f-medium.png');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `role`, `status`, `created_at`) VALUES
(21, 'Stef', 'marekeyks101@gmail.com', '$2y$10$46yj/F93p7Gf3eJ0gEtOG.bYAkSg62LkejbqvkwW.4/4BpSXeLA6O', 'admin', 'active', '2026-05-01 19:36:27'),
(22, 'StefAhkjsa', 'sidney.baltazarduh@gmail.com', '$2y$10$yO06lnn3lI8yM.lt6fGsXuj6mXvk.JWj3hxgGjwrzkWyDaniNMrSO', 'customer', 'active', '2026-05-02 04:26:40'),
(26, 'someone', 'Kirigato.07@gmail.com', '$2y$10$ECOsuBdi4QUeb2WvZ94R/.3v3Lx/nGQijc32apxwgxofgqotMQkhG', 'customer', 'active', '2026-05-04 06:55:01');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

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
