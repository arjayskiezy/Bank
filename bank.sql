-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2024 at 04:10 AM
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
-- Database: `signup`
--

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `bank_id` int(6) UNSIGNED DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT 0,
  `PhoneNumber` varchar(11) NOT NULL,
  `pin` decimal(6,0) DEFAULT NULL,
  `qr_code_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `name`, `email`, `password`, `balance`, `bank_id`, `disabled`, `PhoneNumber`, `pin`, `qr_code_path`) VALUES
(88, 'Renz', 'arjay.alanano23@gmail.com', '$2b$10$g1smnYzJ1ttt4vshTnyPD.GzaXqEDolOc7tf8prNj9efz3JwdssYy', 116687.00, 240087, 0, '09157425471', 123456, '/images/240087.png'),
(90, 'Sir Ted', 'tedelricot@gmail.com', '$2b$10$MZinuk5vKZckDFgjcGNzleWjn/YktQd/fJ3RBAHWzfPXHSvrit6DG', 92947.00, 777196, 0, '09069352363', 123456, '/images/777196.png'),
(91, 'Rolind', 'josediegoalanano712@gmail.com', '$2b$10$3gsXBDUaxGbZML2GDrOo3OIDUSx5kQeuNdusopissLYYXWfHRk0Oi', 123333.00, 424523, 0, '09157425472', 123456, '/images/424523.png');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `text` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `name`, `text`, `created_at`) VALUES
(102, 'Rolind', 'hi', '2024-06-23 03:37:11'),
(103, 'Sir Ted', 'congrats rolind', '2024-06-23 03:37:26');

-- --------------------------------------------------------

--
-- Table structure for table `payment_requests`
--

CREATE TABLE `payment_requests` (
  `id` int(11) NOT NULL,
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `debtorId` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salessummary`
--

CREATE TABLE `salessummary` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `sale_date` date NOT NULL,
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salessummary`
--

INSERT INTO `salessummary` (`item_id`, `item_name`, `total_amount`, `sale_date`) VALUES
(38, 'GIGA STUDY PRO 199', 218.00, '2024-06-23');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `email` varchar(30) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('WITHDRAW','DEPOSIT','SHARE','SHOP','LOAD','REQUEST') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `PhoneNumber` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `email`, `date`, `type`, `amount`, `PhoneNumber`) VALUES
(929, 'arjay.alanano23@gmail.com', '2024-06-21 03:59:16', 'DEPOSIT', 2.00, ''),
(930, 'tedelricot@gmail.com', '2024-06-22 14:35:41', 'WITHDRAW', 200.00, ''),
(931, 'tedelricot@gmail.com', '2024-06-22 14:38:23', 'WITHDRAW', 500.00, ''),
(932, 'tedelricot@gmail.com', '2024-06-22 14:38:49', 'WITHDRAW', 200.00, ''),
(933, 'tedelricot@gmail.com', '2024-06-22 14:39:04', 'DEPOSIT', 200.00, ''),
(934, 'tedelricot@gmail.com', '2024-06-22 14:44:42', 'DEPOSIT', 2.00, ''),
(935, 'arjay.alanano23@gmail.com', '2024-06-22 14:50:30', 'DEPOSIT', 2.00, ''),
(936, 'arjay.alanano23@gmail.com', '2024-06-22 15:43:35', 'DEPOSIT', 2.00, ''),
(937, 'arjay.alanano23@gmail.com', '2024-06-22 15:43:44', 'SHARE', 12.00, ''),
(938, 'tedelricot@gmail.com', '2024-06-22 15:48:06', 'SHARE', 12.00, ''),
(939, 'tedelricot@gmail.com', '2024-06-22 15:51:29', 'REQUEST', 32.00, ''),
(940, 'tedelricot@gmail.com', '2024-06-22 15:51:30', 'REQUEST', 12.00, ''),
(941, 'tedelricot@gmail.com', '2024-06-22 15:51:36', 'REQUEST', 32.00, ''),
(942, 'tedelricot@gmail.com', '2024-06-23 11:17:09', 'SHOP', 999.00, ''),
(943, 'tedelricot@gmail.com', '2024-06-23 11:17:09', 'SHOP', 999.00, ''),
(944, 'tedelricot@gmail.com', '2024-06-23 11:17:10', 'SHOP', 999.00, ''),
(945, 'tedelricot@gmail.com', '2024-06-23 11:18:35', 'SHOP', 999.00, ''),
(946, 'tedelricot@gmail.com', '2024-06-23 11:27:13', 'WITHDRAW', 2.00, ''),
(947, 'josediegoalanano712@gmail.com', '2024-06-23 11:35:18', 'REQUEST', 123.00, ''),
(948, 'tedelricot@gmail.com', '2024-06-23 11:38:01', 'SHOP', 2998.00, ''),
(949, 'tedelricot@gmail.com', '2024-06-23 11:38:01', 'SHOP', 2998.00, ''),
(950, 'tedelricot@gmail.com', '2024-06-23 11:38:02', 'SHOP', 2998.00, ''),
(951, 'tedelricot@gmail.com', '2024-06-23 11:38:02', 'SHOP', 2998.00, ''),
(952, 'tedelricot@gmail.com', '2024-06-23 11:38:02', 'SHOP', 2998.00, ''),
(953, 'tedelricot@gmail.com', '2024-06-23 11:38:03', 'SHOP', 2998.00, ''),
(954, 'tedelricot@gmail.com', '2024-06-23 11:38:03', 'SHOP', 2998.00, ''),
(955, 'tedelricot@gmail.com', '2024-06-23 11:38:04', 'SHOP', 2998.00, ''),
(956, 'tedelricot@gmail.com', '2024-06-23 11:39:59', 'LOAD', 218.00, '09069352363'),
(957, 'tedelricot@gmail.com', '2024-06-23 11:46:46', 'WITHDRAW', 1000.00, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_requests`
--
ALTER TABLE `payment_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salessummary`
--
ALTER TABLE `salessummary`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `payment_requests`
--
ALTER TABLE `payment_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `salessummary`
--
ALTER TABLE `salessummary`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=958;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
