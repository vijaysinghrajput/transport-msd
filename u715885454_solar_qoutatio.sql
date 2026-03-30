-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 01, 2025 at 10:16 AM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u715885454_solar_qoutatio`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_content_templates`
--

CREATE TABLE `ai_content_templates` (
  `id` int(11) NOT NULL,
  `system_type_id` int(11) DEFAULT NULL,
  `sector_id` int(11) DEFAULT NULL,
  `content_type` enum('introduction','benefits','technical_specs','warranty','conclusion') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variables`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ai_product_content`
--

CREATE TABLE `ai_product_content` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `category_name` varchar(100) DEFAULT NULL,
  `brand_name` varchar(100) DEFAULT NULL,
  `detailed_description` text DEFAULT NULL,
  `technical_specifications` text DEFAULT NULL,
  `key_features` text DEFAULT NULL,
  `benefits_advantages` text DEFAULT NULL,
  `usage_applications` text DEFAULT NULL,
  `installation_guide` text DEFAULT NULL,
  `maintenance_tips` text DEFAULT NULL,
  `warranty_information` text DEFAULT NULL,
  `compatibility_info` text DEFAULT NULL,
  `performance_metrics` text DEFAULT NULL,
  `energy_efficiency` text DEFAULT NULL,
  `environmental_impact` text DEFAULT NULL,
  `cost_effectiveness` text DEFAULT NULL,
  `comparison_analysis` text DEFAULT NULL,
  `customer_testimonials` text DEFAULT NULL,
  `language` varchar(10) DEFAULT 'hi',
  `content_version` int(11) DEFAULT 1,
  `ai_model_used` varchar(50) DEFAULT 'deepseek',
  `generation_date` timestamp NULL DEFAULT current_timestamp(),
  `last_updated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ai_quotation_content`
--

CREATE TABLE `ai_quotation_content` (
  `id` int(11) NOT NULL,
  `quotation_id` int(11) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `sector_type` varchar(100) DEFAULT NULL,
  `system_type` varchar(100) DEFAULT NULL,
  `system_capacity` decimal(10,2) DEFAULT NULL,
  `panel_specifications` text DEFAULT NULL,
  `inverter_specifications` text DEFAULT NULL,
  `battery_specifications` text DEFAULT NULL,
  `mounting_structure_details` text DEFAULT NULL,
  `electrical_components` text DEFAULT NULL,
  `product_descriptions` text DEFAULT NULL,
  `technical_specifications` text DEFAULT NULL,
  `warranty_details` text DEFAULT NULL,
  `package_cost_breakdown` text DEFAULT NULL,
  `installation_cost_details` text DEFAULT NULL,
  `other_charges_breakdown` text DEFAULT NULL,
  `tax_calculations` text DEFAULT NULL,
  `total_investment` text DEFAULT NULL,
  `loan_eligibility` text DEFAULT NULL,
  `emi_calculations` text DEFAULT NULL,
  `interest_rates` text DEFAULT NULL,
  `loan_tenure_options` text DEFAULT NULL,
  `subsidy_eligibility` text DEFAULT NULL,
  `subsidy_amount` text DEFAULT NULL,
  `subsidy_process` text DEFAULT NULL,
  `government_schemes` text DEFAULT NULL,
  `electricity_generation` text DEFAULT NULL,
  `monthly_savings` text DEFAULT NULL,
  `yearly_savings` text DEFAULT NULL,
  `payback_period` text DEFAULT NULL,
  `environmental_benefits` text DEFAULT NULL,
  `working_explanation` text DEFAULT NULL,
  `customized_suggestions` text DEFAULT NULL,
  `maintenance_tips` text DEFAULT NULL,
  `performance_optimization` text DEFAULT NULL,
  `terms_and_conditions` text DEFAULT NULL,
  `installation_timeline` text DEFAULT NULL,
  `after_sales_service` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `email`, `phone`, `address`, `city`, `state`, `postal_code`, `created_at`, `updated_at`) VALUES
(72, 'Vijay Singh', 'iamvijaysinghrajput@gmail.com', '8052553000', '281 B Bhardwajpuram\nRustampur', 'Gorakhpur', 'Uttar Pradesh', '', '2025-09-20 08:57:35', '2025-09-20 08:57:35'),
(73, 'Abhay', 'sharmaabhi2533@gmail.com', '9005003123', 'Khalilabad', 'Sant Kabir nagar', 'Uttar Pradesh', '', '2025-09-29 08:22:26', '2025-09-29 08:22:26'),
(74, 'Sonu chaudhary', 'Sonuchaudharyrundhir@gimill.com', '9120011506', 'Khalilabad', 'Sant kabir nagar', 'Uttar pradesh', '272175', '2025-09-29 08:23:27', '2025-09-29 08:23:27'),
(78, 'Abhay', '', '7080956573', '', 'Khalilabad', 'Uttar pradesh', '', '2025-09-29 08:31:16', '2025-09-29 08:31:16'),
(82, 'Ragnee', 'ragnee9867@gmail.com', '9848654576', 'Islampur post chai kala ', 'Khalilabad ', 'Uttar Pradesh ', '272175', '2025-09-29 09:06:47', '2025-09-29 09:06:47'),
(92, 'Abhi', 'aasifzayn216@gmail.com', '7080956572', '', 'Khalilabad', 'Uttar pradesh', '272175', '2025-09-29 09:13:20', '2025-09-29 09:13:20'),
(94, 'Jaya ', 'kumarimuskan03738@gmail.com', '7054021593', 'Khalilabad ', 'Sant Kabir Nagar ', 'Uttar Pradesh ', '272175', '2025-09-29 09:13:53', '2025-09-29 09:13:53'),
(97, 'Reeshu', 'reeshu6307', '6307260929', 'Islampur post chai kala ', 'Khalilabad ', 'Uttar Pradesh ', '272175', '2025-09-29 09:17:30', '2025-09-29 09:17:30'),
(98, 'Sipali ', 'sipali 98675@gmail.com', '9856357576', 'Khalilabad ', 'Sant kabir nagar ', 'Uttar Pradesh ', '272175', '2025-09-29 09:19:31', '2025-09-29 09:19:31'),
(100, 'Reeshu', 'reeshu9984@gmail.com', '6307260929', 'Islampur post chai kala', 'Khalilabad', 'Uttar Pradesh', '', '2025-09-29 09:23:03', '2025-09-29 09:23:03'),
(101, 'Sarfaraz khan', 'khansarfaraz97548@gmail.com', '7317560210', 'Pachpokhri ', 'Sant Kabir Nagar ', 'Uttar Pradesh ', '272125', '2025-09-29 13:13:47', '2025-09-29 13:13:47'),
(105, 'Manish Kumar Gupta', 'manishgupta216@gmail.com', '8896546565', '', 'Deoriya', 'Uttar Pradesh', '274404', '2025-10-01 06:45:40', '2025-10-01 06:45:40'),
(106, 'Vijay', 'natkhatdaida@gmail.com', '7398179977', 'Gdfh', 'Kld', 'Up', '272175', '2025-10-01 13:19:22', '2025-10-01 13:19:22'),
(107, 'Shri', 'shrikrishna1780@gmail.com', '9492135554', 'Wahid chak', 'Basti', 'Up', '', '2025-10-02 05:29:30', '2025-10-02 05:29:30'),
(108, 'Praveen Kumar Tripathi ', 'praveenkumartripathi123@gmail.com', '8840709090', 'Lakshapur amawakhurd bhadohi sant Ravidas Nagar ', 'Sant Ravidas Nagar ', 'Uttar Pradesh ', '221402', '2025-10-03 06:39:07', '2025-10-03 06:39:07'),
(109, 'Ram swarth ', 'ramswarth123@gmail.com', '9918215032', 'Belhar kalan', 'Sant kabir nagar ', 'Uttar Pradesh ', '272270', '2025-10-03 07:28:08', '2025-10-03 07:28:08'),
(112, 'Ganga ram', 'rt5722095@gmail.com', '9555960876', 'Hariharpur', 'Khalilabaad', 'Uttar Pradesh', '272175', '2025-10-04 11:43:28', '2025-10-04 11:43:28'),
(118, 'Satish Chandra', 'satish@gmail.com', '9125585584', 'Devariya', 'Tarkulhi', 'Uttar Pradesh', '', '2025-10-06 12:20:34', '2025-10-06 12:20:34'),
(121, 'Bechu Prasad', 'godkrishnav923@gmail.com', '8808430172', '', 'Deoria', '', '', '2025-10-06 14:07:23', '2025-10-06 14:07:23'),
(122, 'Surjeet singh', 'surjeetsingh10605@gmail.com', '6388182073', 'Basti', 'Basti', 'Uttar Pradesh', '', '2025-10-07 10:00:19', '2025-10-07 10:00:19'),
(123, 'Akhilesh Tiwari', 'akhileshtowari@gmail.com', '9974029573', 'Devriya', 'Devariya', 'Uttar Pradesh', '', '2025-10-07 10:27:11', '2025-10-07 10:27:11'),
(126, 'Abc', 'abckldgh@gmail.com', '8888526958', '', 'Kld', '', '', '2025-10-07 14:12:16', '2025-10-07 14:12:16'),
(129, 'yusuf', 'yusuf1234@gmail.com', '7988569478', '', 'maghar', 'uttar pradesh', '', '2025-10-07 14:13:03', '2025-10-07 14:13:03'),
(130, 'Raju', 'raju45@gmail.com', '+917719762645', 'JHANSI', 'JHANSI', 'Uttar Pradesh', '', '2025-10-08 05:34:58', '2025-10-08 05:34:58'),
(131, 'Raju bhai', 'rajubhai12345@gmail.com', '+7719762645', 'jhasi', 'Jhasi', '', '', '2025-10-08 05:39:00', '2025-10-08 05:39:00'),
(132, 'Raja', 'raja@gmail.com', '6776349164', 'Jhansi', 'Jhansi', 'Uttar Pradesh', '', '2025-10-08 05:55:05', '2025-10-08 05:55:05'),
(133, 'Aman Rai', 'amanrai@gmail.com', '+91 92084 62004', 'Devriya', 'Devriya', 'Uttar Pradesh', '', '2025-10-09 08:02:19', '2025-10-09 08:02:19'),
(135, 'Jitendra Yadav', 'jitendrayadav123@gmail.com', '9892930913', 'Jaunpur', 'Jaunpur', 'Jaunpur', '', '2025-10-10 07:53:15', '2025-10-10 07:53:15'),
(136, 'Vinod yadav', 'vinod123@gmail.com', '97928 76234', 'Dewaria', 'Dewaria', 'Uttar Pradesh', '', '2025-10-10 08:28:17', '2025-10-10 08:28:17'),
(137, 'Krishn Mohan Gupta ', 'krishnmohan123@gmail.com', '9935928922', 'Khalilabad ', 'Khalilabad ', 'Uttar Pradesh ', '272127', '2025-10-10 08:48:28', '2025-10-10 08:48:28'),
(140, 'Dev Sahani', 'devsahani123@gmail.com', '6306733048', 'Srinagar', 'Srinagar', 'Srinagar', '', '2025-10-10 08:57:28', '2025-10-10 08:57:28'),
(142, 'Vinod Yadav', 'vinod12345@gmail.com', '9792876234', 'Pasiya Basi Deoria pincode:264509', 'Deoria', 'Uttar Pradesh', '', '2025-10-10 09:13:11', '2025-10-10 09:13:11'),
(144, 'Rajat Pandey', 'rajatpandey12345@gmail.com', '9005000182', 'Gorakhpur', 'Gorakhpur', 'Uttar Pradesh', '', '2025-10-10 10:05:24', '2025-10-10 10:05:24'),
(154, 'Amrendra Yadav ', 'Amrendrayadav00@gmail.com', '7081130490', 'Kushinagar ', 'Kushinagar ', 'Uttar Pradesh', '', '2025-10-11 09:10:12', '2025-10-11 09:10:12'),
(155, 'Ved prakash', 'ved446626@gmail.com', '6393170663', 'Lalpur', 'Basti', 'Uttar Pradesh', '', '2025-10-11 09:34:57', '2025-10-11 09:34:57'),
(156, 'Bhim', 'bhimkumar134@gmail.com', '7317249656', 'hata', 'Hata', 'Hata', '', '2025-10-13 10:52:45', '2025-10-13 10:52:45'),
(157, 'Gopi yadav ', 'gopiyadav123@gmail.com', '9838004045', 'Sant kabir nagar ', 'Sant kabir nagar ', 'Uttar Pradesh ', '272175', '2025-10-14 06:19:45', '2025-10-14 06:19:45'),
(159, 'Vivek kumar', 'vivekkumar01@gmail.com', '6391246141', 'Kuraha patti', 'Basti', 'Uttar Pradesh', '', '2025-10-21 10:07:49', '2025-10-21 10:07:49'),
(160, 'RAMNATH YADAV', 'ramnathyadav@gmail.com', '7390041436', 'khujura', 'sant kabir nagar', 'utter pradesh', '', '2025-10-21 10:26:11', '2025-10-21 10:26:11'),
(161, 'Sandeep kumar', 'sandeepkumar1234@gmail.com', '7307986567,983868842', 'Siddharth Nagar', 'Siddharth Nagar', 'Uttar Pradesh', '', '2025-10-24 12:19:44', '2025-10-24 12:19:44'),
(162, 'Ramesh', 'rrgroups@gmail.com', '', '', '', '', '', '2025-10-25 12:40:34', '2025-10-25 12:40:34'),
(163, 'Ram', 'dfghhh5@gamil.com', '7054021593', 'Gzhajkan', 'Vdhsjk', 'Ubshsjaj', '', '2025-10-29 08:27:38', '2025-10-29 08:27:38'),
(167, 'Bhupendar singh', 'Bhupendar9935@gmail.com', '9235646099', 'Kauriram', 'Gorakhpur', 'Uttar Pradesh', '', '2025-10-31 06:01:16', '2025-10-31 06:01:16'),
(168, 'Yashwant Kumar Yadav', 'yashwantkumaryadav1234@gmail.com', '8423566866', 'Maharajganj', 'Gorakhpur', 'Uttar Pradesh', '', '2025-10-31 06:54:02', '2025-10-31 06:54:02');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `vendor_code` varchar(50) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_holder` varchar(255) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `branch_name` varchar(255) DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `signature_path` varchar(255) DEFAULT NULL,
  `stamp_path` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`, `address`, `city`, `state`, `postal_code`, `phone`, `email`, `website`, `gst_number`, `vendor_code`, `bank_name`, `account_holder`, `account_number`, `ifsc_code`, `branch_name`, `logo_path`, `signature_path`, `stamp_path`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
(66, 'R.N. TRADERS', '0 Baitalpur Men Road, Baitalpur\n', 'Deoria', 'UTTAR PRADESH', '274201', '7080956572', 'rntradersbaitalpur@gmail.com', '', '09AJFPY0130M2ZW', 'DEO2410051321', 'AXIX BANK', '{Sudeep Yadav} R.N. TRADERS[UPNEDAVENDOR CODE- DEO2410051321]', '924020040193820', 'UTIB0000331', 'AXIX BANK, GORAKHPUR', 'https://quotation.sarkarisolarseva.com/assets/img/rn-logo.png', 'https://quotation.sarkarisolarseva.com/assets/img/rn-signeture.png', 'https://quotation.sarkarisolarseva.com/assets/img/rn-stamp.png', 1, 1, '2025-09-20 08:57:22', '2025-10-03 13:51:47'),
(67, 'Sarkari Solar Seva', '', 'Gorakhpur', 'Uttar Pradesh', '', '7080956572', '', 'sarkarisolarseva.com', '', '', '', '', '', '', '', '', '', '', 1, 0, '2025-10-03 13:54:07', '2025-10-03 13:54:07'),
(68, 'Mudrabase Sales &amp; Distribution Pvt ltd', 'Golghar\nGolghar', 'Gorakhpur', 'Uttar Pradesh', '273017', '7080956572', 'contact@mudrabase.in', 'www.mudrabase.in', '09AATCM1567C1Z7', '', 'Axix Bank', 'Mudrabase Sales &amp; Distribution Pvt ltd', '925020002278344', 'UTIB0003373', 'BATIAHATA BRANCH', '', '', '', 1, 0, '2025-10-09 15:05:26', '2025-10-09 15:05:26');

-- --------------------------------------------------------

--
-- Table structure for table `package_components`
--

CREATE TABLE `package_components` (
  `id` int(11) NOT NULL,
  `package_id` int(11) DEFAULT NULL,
  `component_name` varchar(255) NOT NULL,
  `component_type` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `total_price` decimal(12,2) DEFAULT NULL,
  `specifications` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `package_items`
--

CREATE TABLE `package_items` (
  `id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 1.00,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `package_items`
--

INSERT INTO `package_items` (`id`, `package_id`, `product_id`, `quantity`, `unit_price`, `total_price`, `created_at`) VALUES
(1936, 305, 723, 6.00, 21000.00, 126000.00, '2025-09-25 10:20:32'),
(1937, 305, 725, 1.00, 31900.00, 31900.00, '2025-09-25 10:20:32'),
(1938, 305, 726, 1.00, 25680.00, 25680.00, '2025-09-25 10:20:32'),
(1942, 308, 729, 1.00, 16500.00, 16500.00, '2025-09-25 10:29:03'),
(1943, 308, 730, 1.00, 42800.00, 42800.00, '2025-09-25 10:29:03'),
(1944, 308, 723, 10.00, 21000.00, 210000.00, '2025-09-25 10:29:03'),
(1945, 309, 732, 1.00, 51360.00, 51360.00, '2025-09-25 10:33:10'),
(1946, 309, 723, 12.00, 21000.00, 252000.00, '2025-09-25 10:33:10'),
(1947, 309, 731, 1.00, 68800.00, 68800.00, '2025-09-25 10:33:10'),
(1948, 310, 734, 1.00, 59920.00, 59920.00, '2025-09-25 10:34:25'),
(1949, 310, 733, 1.00, 69100.00, 69100.00, '2025-09-25 10:34:25'),
(1950, 310, 723, 14.00, 21000.00, 294000.00, '2025-09-25 10:34:25'),
(1951, 311, 735, 1.00, 88400.00, 88400.00, '2025-09-25 10:36:05'),
(1952, 311, 723, 16.00, 21000.00, 336000.00, '2025-09-25 10:36:05'),
(1953, 311, 736, 1.00, 68480.00, 68480.00, '2025-09-25 10:36:05'),
(1954, 312, 738, 1.00, 85600.00, 85600.00, '2025-09-25 10:39:50'),
(1955, 312, 723, 20.00, 21000.00, 420000.00, '2025-09-25 10:39:50'),
(1956, 312, 737, 1.00, 80000.00, 80000.00, '2025-09-25 10:39:50'),
(1957, 313, 723, 4.00, 21000.00, 84000.00, '2025-09-25 10:48:59'),
(1958, 313, 740, 1.00, 65600.00, 65600.00, '2025-09-25 10:48:59'),
(1959, 313, 718, 4.00, 16000.00, 64000.00, '2025-09-25 10:48:59'),
(1960, 313, 724, 1.00, 17120.00, 17120.00, '2025-09-25 10:48:59'),
(1961, 314, 718, 4.00, 16000.00, 64000.00, '2025-09-27 06:55:52'),
(1962, 314, 723, 4.00, 21000.00, 84000.00, '2025-09-27 06:55:52'),
(1963, 314, 724, 1.00, 17120.00, 17120.00, '2025-09-27 06:55:52'),
(1964, 314, 740, 1.00, 65600.00, 65600.00, '2025-09-27 06:55:52'),
(1965, 315, 723, 6.00, 21000.00, 126000.00, '2025-09-27 06:58:10'),
(1966, 315, 741, 1.00, 49900.00, 49900.00, '2025-09-27 06:58:10'),
(1967, 315, 726, 1.00, 25680.00, 25680.00, '2025-09-27 06:58:10'),
(1968, 315, 718, 2.00, 16000.00, 32000.00, '2025-09-27 06:58:10'),
(1969, 316, 723, 6.00, 21000.00, 126000.00, '2025-09-27 07:01:58'),
(1970, 316, 743, 1.00, 52900.00, 52900.00, '2025-09-27 07:01:58'),
(1971, 316, 718, 4.00, 16000.00, 64000.00, '2025-09-27 07:01:58'),
(1972, 316, 726, 1.00, 25680.00, 25680.00, '2025-09-27 07:01:58'),
(1973, 317, 743, 1.00, 52900.00, 52900.00, '2025-09-27 07:01:58'),
(1974, 317, 723, 6.00, 21000.00, 126000.00, '2025-09-27 07:01:58'),
(1975, 317, 726, 1.00, 25680.00, 25680.00, '2025-09-27 07:01:58'),
(1976, 317, 718, 4.00, 16000.00, 64000.00, '2025-09-27 07:01:58'),
(1977, 318, 728, 1.00, 39200.00, 39200.00, '2025-09-27 07:10:23'),
(1978, 318, 723, 8.00, 21000.00, 168000.00, '2025-09-27 07:10:23'),
(1979, 318, 744, 1.00, 65160.00, 65160.00, '2025-09-27 07:10:23'),
(1980, 319, 718, 4.00, 16000.00, 64000.00, '2025-09-27 07:10:23'),
(1981, 319, 728, 1.00, 39200.00, 39200.00, '2025-09-27 07:10:23'),
(1982, 318, 718, 4.00, 16000.00, 64000.00, '2025-09-27 07:10:23'),
(1983, 319, 744, 1.00, 65160.00, 65160.00, '2025-09-27 07:10:23'),
(1984, 319, 723, 8.00, 21000.00, 168000.00, '2025-09-27 07:10:23'),
(1985, 320, 723, 10.00, 21000.00, 210000.00, '2025-09-27 07:15:06'),
(1986, 320, 745, 1.00, 72500.00, 72500.00, '2025-09-27 07:15:06'),
(1987, 320, 718, 4.00, 16000.00, 64000.00, '2025-09-27 07:15:06'),
(1988, 320, 730, 1.00, 42800.00, 42800.00, '2025-09-27 07:15:06'),
(1989, 321, 746, 1.00, 95556.00, 95556.00, '2025-09-27 07:26:24'),
(1990, 321, 723, 12.00, 21000.00, 252000.00, '2025-09-27 07:26:24'),
(1991, 321, 718, 8.00, 16000.00, 128000.00, '2025-09-27 07:26:24'),
(1992, 321, 732, 1.00, 51360.00, 51360.00, '2025-09-27 07:26:24'),
(1993, 322, 747, 1.00, 95500.00, 95500.00, '2025-09-27 07:34:21'),
(1994, 323, 734, 1.00, 59920.00, 59920.00, '2025-09-27 07:34:21'),
(1995, 322, 718, 8.00, 16000.00, 128000.00, '2025-09-27 07:34:21'),
(1996, 322, 723, 14.00, 21000.00, 294000.00, '2025-09-27 07:34:21'),
(1997, 323, 747, 1.00, 95500.00, 95500.00, '2025-09-27 07:34:21'),
(1998, 323, 723, 14.00, 21000.00, 294000.00, '2025-09-27 07:34:21'),
(1999, 323, 718, 8.00, 16000.00, 128000.00, '2025-09-27 07:34:21'),
(2000, 322, 734, 1.00, 59920.00, 59920.00, '2025-09-27 07:34:21'),
(2001, 324, 723, 16.00, 21000.00, 336000.00, '2025-09-27 07:39:43'),
(2002, 324, 748, 1.00, 98000.00, 98000.00, '2025-09-27 07:39:43'),
(2003, 324, 736, 1.00, 68480.00, 68480.00, '2025-09-27 07:39:43'),
(2004, 324, 718, 10.00, 16000.00, 160000.00, '2025-09-27 07:39:43'),
(2005, 325, 723, 20.00, 21000.00, 420000.00, '2025-09-27 08:01:37'),
(2006, 325, 749, 1.00, 120000.00, 120000.00, '2025-09-27 08:01:37'),
(2007, 325, 738, 1.00, 85600.00, 85600.00, '2025-09-27 08:01:37'),
(2008, 325, 718, 10.00, 16000.00, 160000.00, '2025-09-27 08:01:37'),
(2009, 326, 752, 1.00, 34100.00, 34100.00, '2025-09-28 09:00:25'),
(2010, 326, 716, 6.00, 14750.00, 88500.00, '2025-09-28 09:00:25'),
(2011, 326, 753, 1.00, 35400.00, 35400.00, '2025-09-28 09:00:25'),
(2012, 326, 718, 2.00, 16000.00, 32000.00, '2025-09-28 09:00:25'),
(2013, 327, 716, 8.00, 14750.00, 118000.00, '2025-09-28 09:06:08'),
(2014, 327, 718, 4.00, 16000.00, 64000.00, '2025-09-28 09:06:08'),
(2015, 327, 755, 1.00, 20800.00, 20800.00, '2025-09-28 09:06:08'),
(2016, 327, 756, 1.00, 47200.00, 47200.00, '2025-09-28 09:06:08'),
(2017, 328, 716, 10.00, 14750.00, 147500.00, '2025-09-28 09:08:15'),
(2018, 328, 757, 1.00, 24500.00, 24500.00, '2025-09-28 09:08:15'),
(2019, 329, 716, 10.00, 14750.00, 147500.00, '2025-09-28 09:08:15'),
(2020, 328, 718, 4.00, 16000.00, 64000.00, '2025-09-28 09:08:15'),
(2021, 328, 758, 1.00, 59000.00, 59000.00, '2025-09-28 09:08:15'),
(2022, 329, 757, 1.00, 24500.00, 24500.00, '2025-09-28 09:08:15'),
(2023, 329, 758, 1.00, 59000.00, 59000.00, '2025-09-28 09:08:15'),
(2024, 329, 718, 4.00, 16000.00, 64000.00, '2025-09-28 09:08:15'),
(2025, 330, 716, 12.00, 14750.00, 177000.00, '2025-09-28 09:10:32'),
(2026, 330, 760, 1.00, 52400.00, 52400.00, '2025-09-28 09:10:32'),
(2027, 330, 761, 1.00, 70800.00, 70800.00, '2025-09-28 09:10:32'),
(2028, 330, 718, 8.00, 16000.00, 128000.00, '2025-09-28 09:10:32'),
(2029, 331, 716, 14.00, 14750.00, 206500.00, '2025-09-28 09:13:44'),
(2030, 331, 718, 8.00, 16000.00, 128000.00, '2025-09-28 09:13:44'),
(2031, 331, 759, 1.00, 52400.00, 52400.00, '2025-09-28 09:13:44'),
(2032, 331, 762, 1.00, 82600.00, 82600.00, '2025-09-28 09:13:44'),
(2033, 332, 718, 10.00, 16000.00, 160000.00, '2025-09-28 09:17:43'),
(2034, 332, 716, 14.00, 14750.00, 206500.00, '2025-09-28 09:17:43'),
(2035, 332, 768, 1.00, 78600.00, 78600.00, '2025-09-28 09:17:43'),
(2036, 332, 779, 1.00, 94400.00, 94400.00, '2025-09-28 09:17:43'),
(2037, 333, 716, 18.00, 14750.00, 265500.00, '2025-09-28 09:20:33'),
(2038, 333, 781, 1.00, 118000.00, 118000.00, '2025-09-28 09:20:33'),
(2039, 333, 718, 10.00, 16000.00, 160000.00, '2025-09-28 09:20:33'),
(2040, 333, 780, 1.00, 97800.00, 97800.00, '2025-09-28 09:20:33'),
(2041, 334, 716, 20.00, 14750.00, 295000.00, '2025-09-28 09:22:58'),
(2042, 334, 783, 1.00, 129800.00, 129800.00, '2025-09-28 09:22:58'),
(2043, 334, 718, 15.00, 16000.00, 240000.00, '2025-09-28 09:22:58'),
(2044, 334, 782, 1.00, 155400.00, 155400.00, '2025-09-28 09:22:58'),
(2045, 335, 716, 22.00, 14750.00, 324500.00, '2025-09-28 09:30:00'),
(2046, 335, 784, 1.00, 141600.00, 141600.00, '2025-09-28 09:30:00'),
(2047, 335, 718, 15.00, 16000.00, 240000.00, '2025-09-28 09:30:00'),
(2048, 335, 782, 1.00, 155400.00, 155400.00, '2025-09-28 09:30:00'),
(2049, 336, 716, 26.00, 14750.00, 383500.00, '2025-09-28 09:32:19'),
(2050, 336, 782, 1.00, 155400.00, 155400.00, '2025-09-28 09:32:19'),
(2051, 336, 785, 1.00, 153400.00, 153400.00, '2025-09-28 09:32:19'),
(2052, 336, 718, 15.00, 16000.00, 240000.00, '2025-09-28 09:32:19'),
(2053, 337, 782, 1.00, 155400.00, 155400.00, '2025-09-28 09:36:11'),
(2054, 337, 786, 1.00, 165200.00, 165200.00, '2025-09-28 09:36:11'),
(2055, 337, 716, 24.00, 14750.00, 354000.00, '2025-09-28 09:36:11'),
(2056, 337, 718, 15.00, 16000.00, 240000.00, '2025-09-28 09:36:11'),
(2057, 338, 718, 15.00, 16000.00, 240000.00, '2025-09-28 09:38:15'),
(2058, 338, 788, 1.00, 175600.00, 175600.00, '2025-09-28 09:38:15'),
(2059, 338, 716, 27.00, 14750.00, 398250.00, '2025-09-28 09:38:15'),
(2060, 338, 787, 1.00, 177000.00, 177000.00, '2025-09-28 09:38:15'),
(2061, 339, 789, 16.00, 10620.00, 169920.00, '2025-10-09 15:28:19'),
(2062, 339, 790, 1.00, 30000.00, 30000.00, '2025-10-09 15:28:19'),
(2063, 339, 795, 1.00, 75520.00, 75520.00, '2025-10-09 15:28:19'),
(2064, 339, 794, 1.00, 10000.00, 10000.00, '2025-10-09 15:28:19'),
(2065, 340, 789, 32.00, 10620.00, 339840.00, '2025-10-09 15:31:54'),
(2066, 340, 791, 1.00, 52000.00, 52000.00, '2025-10-09 15:31:54'),
(2067, 340, 796, 1.00, 151040.00, 151040.00, '2025-10-09 15:31:54'),
(2068, 341, 797, 1.00, 265500.00, 265500.00, '2025-10-09 15:36:33'),
(2069, 341, 792, 1.00, 72000.00, 72000.00, '2025-10-09 15:36:33'),
(2070, 341, 789, 45.00, 10620.00, 477900.00, '2025-10-09 15:36:33'),
(2071, 342, 797, 1.00, 265500.00, 265500.00, '2025-10-09 15:36:33'),
(2072, 342, 789, 45.00, 10620.00, 477900.00, '2025-10-09 15:36:33'),
(2073, 342, 792, 1.00, 72000.00, 72000.00, '2025-10-09 15:36:33'),
(2074, 343, 789, 60.00, 10620.00, 637200.00, '2025-10-09 15:39:44'),
(2075, 343, 793, 1.00, 95000.00, 95000.00, '2025-10-09 15:39:44'),
(2076, 343, 798, 1.00, 354000.00, 354000.00, '2025-10-09 15:39:44');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `unit` varchar(50) NOT NULL DEFAULT 'piece',
  `price` decimal(10,2) NOT NULL,
  `warranty_years` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `brand`, `description`, `unit`, `price`, `warranty_years`, `is_active`, `created_at`, `updated_at`, `category_id`, `brand_id`) VALUES
(716, 'Non DCR Bifacial Panels 590W', NULL, NULL, '', 'piece', 14750.00, 25, 1, '2025-09-20 08:34:02', '2025-09-20 08:34:02', 186, 1),
(717, 'Gamma + Solar Inverter (2kW / 24V)', NULL, NULL, '', 'piece', 19000.00, 5, 1, '2025-09-20 08:34:51', '2025-09-20 08:34:51', 187, 1),
(718, 'Lithium Battery 12V', '', '', '', 'piece', 16000.00, 5, 1, '2025-09-20 08:36:57', '2025-09-20 08:45:55', 188, 1),
(719, 'Structure + Wiring Kit — 2 kW off grid', '', '', '', 'set', 21100.00, 25, 1, '2025-09-20 08:42:11', '2025-09-21 11:56:09', 192, 1),
(720, 'Structure + Wiring Kit — 2 kW off-grid', NULL, NULL, '', 'set', 17600.00, 5, 0, '2025-09-20 08:42:11', '2025-09-20 08:42:14', 192, 1),
(721, 'Accessories (ACDB + DCDB Box &amp;amp; Earthing Kit)  2 kW off-grid', '', '', '', 'set', 12900.00, 5, 1, '2025-09-20 08:45:41', '2025-09-20 08:53:48', 209, 1),
(722, 'Ongrid Inverter 2kw', NULL, NULL, '', 'piece', 44600.00, 10, 1, '2025-09-21 11:46:54', '2025-09-21 11:46:54', 187, 1),
(723, '550wt DCR TOPCON PANEL', NULL, NULL, '.', 'piece', 21000.00, 25, 1, '2025-09-21 11:49:04', '2025-09-21 11:49:04', 186, 1),
(724, 'Structure+Kit Ongrid 2kw ongrid/Hybrid', '', '', '', 'set', 17120.00, 25, 1, '2025-09-21 11:58:35', '2025-09-21 13:24:41', 192, 1),
(725, 'Ongrid Inverter 3kw', '', '', '', 'piece', 31900.00, 10, 1, '2025-09-21 12:46:07', '2025-09-21 12:46:44', 187, 1),
(726, 'Structure+Kit 3kw ongrid/Hybrid', '', '', '', 'piece', 25680.00, 25, 1, '2025-09-21 12:47:47', '2025-09-21 13:24:21', 192, 1),
(727, 'Ongrid Inverter 4kw', '', '', '', 'piece', 39200.00, 10, 1, '2025-09-21 12:49:04', '2025-09-21 13:15:06', 187, 1),
(728, 'Structure+Wire 4kw ongrid/Hybrid', '', '', '', 'set', 39200.00, 25, 1, '2025-09-21 12:50:17', '2025-09-21 13:24:04', 192, 1),
(729, 'Ongrid Inverter 5kw', '', '', '', 'piece', 16500.00, 10, 1, '2025-09-21 12:51:18', '2025-09-21 13:13:35', 187, 1),
(730, 'Structure+wire 5kw ongrid/Hybrid', '', '', '', 'set', 42800.00, 25, 1, '2025-09-21 12:52:08', '2025-09-21 13:23:41', 192, 1),
(731, '6kw Ongrid Inverter', NULL, NULL, '', 'piece', 68800.00, 10, 1, '2025-09-21 12:55:09', '2025-09-21 12:55:09', 187, 1),
(732, 'Sturture+Wire 6kw ongrid/Hybrid', '', '', '', 'piece', 51360.00, 25, 1, '2025-09-21 12:56:30', '2025-09-21 13:23:15', 192, 1),
(733, '7kw Ongrid Inverter', NULL, NULL, '', 'piece', 69100.00, 10, 1, '2025-09-21 12:57:36', '2025-09-21 12:57:36', 187, 1),
(734, 'Structure+Wire Kit 7kw ongrid/Hybrid', '', '', '', 'set', 59920.00, 25, 1, '2025-09-21 12:58:34', '2025-09-21 13:22:55', 192, 1),
(735, '8kw Ongrid Inverter', NULL, NULL, '', 'piece', 88400.00, 10, 1, '2025-09-21 12:59:24', '2025-09-21 12:59:24', 187, 1),
(736, 'Structure+Wire Kit 8kw ongrid/Hybrid', '', '', '', 'set', 68480.00, 25, 1, '2025-09-21 13:00:31', '2025-09-21 13:22:24', 192, 1),
(737, '10kw Ongrid inverter', NULL, NULL, '', 'piece', 80000.00, 10, 1, '2025-09-21 13:01:52', '2025-09-21 13:01:52', 187, 1),
(738, 'Structure+wire kit 10kw ongrid/hybrid', '', '', '', 'piece', 85600.00, 25, 1, '2025-09-21 13:02:41', '2025-09-21 13:22:05', 192, 1),
(739, '2kw/48V Sigma pro Hybrid Inverter', NULL, NULL, '', 'piece', 67600.00, 10, 1, '2025-09-21 13:26:56', '2025-09-21 13:26:56', 187, 1),
(740, '2kw/48v Sigma Pro Hybrid Inverter', NULL, NULL, '', 'piece', 65600.00, 10, 1, '2025-09-21 13:29:39', '2025-09-21 13:29:39', 187, 1),
(741, '3kw/24v Sigma Pro Hybrid Inverter', NULL, NULL, '', 'piece', 49900.00, 10, 1, '2025-09-21 13:30:53', '2025-09-21 13:30:53', 187, 1),
(742, '3kw/24v Sigma Pro Hybrid Inverter', NULL, NULL, '', 'piece', 49900.00, 10, 1, '2025-09-21 13:30:53', '2025-09-21 13:30:53', 187, 1),
(743, '3kw/48v Sigma Pro Hybrid Inverter', NULL, NULL, '', 'piece', 52900.00, 10, 1, '2025-09-21 13:31:45', '2025-09-21 13:31:45', 187, 1),
(744, '4kw/48v Sigma Pro Hybrid Inverter', NULL, NULL, '', 'piece', 65160.00, 10, 1, '2025-09-21 13:32:50', '2025-09-21 13:32:50', 187, 1),
(745, '5kw/48v Sigma Pro Hybrid Inverter', NULL, NULL, '', 'piece', 72500.00, 10, 1, '2025-09-21 13:33:41', '2025-09-21 13:33:41', 187, 1),
(746, '6kw/96v Sigma Pro Hybrid Inverter', NULL, NULL, '', 'piece', 95556.00, 10, 1, '2025-09-21 13:34:26', '2025-09-21 13:34:26', 187, 1),
(747, '7.5kw/96v Sigma Pro Inverter', NULL, NULL, '', 'piece', 95500.00, 10, 1, '2025-09-21 13:36:35', '2025-09-21 13:36:35', 187, 1),
(748, '7.5kw/96v Sigma Pro Inverter', NULL, NULL, '', 'piece', 98000.00, 10, 1, '2025-09-21 13:37:15', '2025-09-21 13:37:15', 187, 1),
(749, '10kw/120v Sigma Pro Inverter', NULL, NULL, '', 'piece', 120000.00, 10, 1, '2025-09-21 13:39:33', '2025-09-21 13:39:33', 187, 1),
(750, 'Alpha Pro Inerter 2kw/24v', NULL, NULL, '', 'piece', 19000.00, 10, 1, '2025-09-28 08:00:17', '2025-09-28 08:00:17', 187, 1),
(751, 'Alpha Pro Inerter 2kw/24v', NULL, NULL, '', 'piece', 19000.00, 10, 0, '2025-09-28 08:00:20', '2025-09-28 08:01:13', 187, 1),
(752, 'Alpha Pro Inerter 3kw/48v', NULL, NULL, '', 'piece', 34100.00, 10, 1, '2025-09-28 08:20:50', '2025-09-28 08:20:50', 187, 1),
(753, 'Structure+wire kit 3kw off grid', NULL, NULL, '', 'piece', 35400.00, 25, 1, '2025-09-28 08:22:10', '2025-09-28 08:22:10', 192, 1),
(754, 'Structure+wire kit 3kw off grid', NULL, NULL, '', 'piece', 35400.00, 25, 0, '2025-09-28 08:22:10', '2025-09-28 08:22:18', 192, 1),
(755, 'Alpha Pro Inerter 5kw/48v', NULL, NULL, '', 'piece', 20800.00, 10, 1, '2025-09-28 08:23:15', '2025-09-28 08:23:15', 187, 1),
(756, 'Structure+wire kit 4kw off grid', NULL, NULL, '', 'piece', 47200.00, 25, 1, '2025-09-28 08:24:23', '2025-09-28 08:24:23', 192, 1),
(757, 'Alpha Pro Inerter 5kww/48v', NULL, NULL, '', 'piece', 24500.00, 10, 1, '2025-09-28 08:26:07', '2025-09-28 08:26:07', 187, 1),
(758, 'Structure+wire kit 5kw off grid', NULL, NULL, '', 'piece', 59000.00, 25, 1, '2025-09-28 08:26:56', '2025-09-28 08:26:56', 192, 1),
(759, 'Alpha Pro Inerter 7.5kw/96v', NULL, NULL, '', 'piece', 52400.00, 10, 1, '2025-09-28 08:28:21', '2025-09-28 08:28:21', 187, 1),
(760, 'Alpha Pro Inerter 7.5kw/96v', NULL, NULL, '', 'piece', 52400.00, 10, 1, '2025-09-28 08:28:21', '2025-09-28 08:28:21', 187, 1),
(761, 'Structure+wire kit 6kw off grid', NULL, NULL, '', 'piece', 70800.00, 25, 1, '2025-09-28 08:29:04', '2025-09-28 08:29:04', 192, 1),
(762, 'Structure+wire kit 7kw off grid', NULL, NULL, '', 'piece', 82600.00, 25, 1, '2025-09-28 08:31:54', '2025-09-28 08:31:54', 192, 1),
(763, 'Structure+wire kit 7kw off grid', NULL, NULL, '', 'piece', 82600.00, 25, 1, '2025-09-28 08:31:54', '2025-09-28 08:31:54', 192, 1),
(764, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:14', '2025-09-28 08:35:07', 187, 1),
(765, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:14', '2025-09-28 08:35:09', 187, 1),
(766, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:14', '2025-09-28 08:35:14', 187, 1),
(767, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 1, '2025-09-28 08:34:14', '2025-09-28 08:34:14', 187, 1),
(768, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:14', '2025-09-28 08:34:53', 187, 1),
(769, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:14', '2025-09-28 08:35:00', 187, 1),
(770, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:14', '2025-09-28 08:35:03', 187, 1),
(771, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:16', '2025-09-28 08:34:22', 187, 1),
(772, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:16', '2025-09-28 08:34:26', 187, 1),
(773, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:16', '2025-09-28 08:34:31', 187, 1),
(774, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:16', '2025-09-28 08:34:36', 187, 1),
(775, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:16', '2025-09-28 08:34:38', 187, 1),
(776, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:16', '2025-09-28 08:34:41', 187, 1),
(777, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:16', '2025-09-28 08:34:47', 187, 1),
(778, 'Alpha Pro Inerter 8kw/120v', NULL, NULL, '', 'piece', 78600.00, 10, 0, '2025-09-28 08:34:16', '2025-09-28 08:34:51', 187, 1),
(779, 'Structure+wire kit 8kw off grid', '', '', '', 'piece', 94400.00, 25, 1, '2025-09-28 08:41:44', '2025-09-28 08:42:03', 192, 1),
(780, 'Alpha Pro Inerter 10kw/120v', NULL, NULL, '', 'piece', 97800.00, 10, 1, '2025-09-28 08:42:48', '2025-09-28 08:42:48', 187, 1),
(781, 'Structure+wire kit 10kw off grid', NULL, NULL, '', 'piece', 118000.00, 10, 1, '2025-09-28 08:43:25', '2025-09-28 08:43:25', 187, 1),
(782, 'Alpha Pro Inerter 15kw/120v', NULL, NULL, '', 'piece', 155400.00, 10, 1, '2025-09-28 08:45:04', '2025-09-28 08:45:04', 187, 1),
(783, 'Structure+wire kit 11kw off grid', NULL, NULL, '', 'piece', 129800.00, 25, 1, '2025-09-28 08:45:50', '2025-09-28 08:45:50', 187, 1),
(784, 'Structure+wire kit 12kw off grid', NULL, NULL, '', 'piece', 141600.00, 25, 1, '2025-09-28 08:47:11', '2025-09-28 08:47:11', 192, 1),
(785, 'Structure+wire kit 13kw off grid', NULL, NULL, '', 'piece', 153400.00, 25, 1, '2025-09-28 08:48:02', '2025-09-28 08:48:02', 187, 1),
(786, 'Structure+wire kit 14kw off grid', NULL, NULL, '', 'piece', 165200.00, 25, 1, '2025-09-28 08:48:41', '2025-09-28 08:48:41', 192, 1),
(787, 'Structure+wire kit 15kw off grid', NULL, NULL, '', 'piece', 177000.00, 25, 1, '2025-09-28 08:49:13', '2025-09-28 08:49:13', 192, 1),
(788, 'Alpha Pro Inerter 15kw/15kw120v', NULL, NULL, '', 'piece', 175600.00, 10, 1, '2025-09-28 08:50:16', '2025-09-28 08:50:16', 187, 1),
(789, '590WT-PANEL HP', '', '', '', 'piece', 10620.00, 25, 1, '2025-10-09 15:16:19', '2025-10-09 15:17:24', 186, 1),
(790, '10 HP- VFD INVERTER', NULL, NULL, '', 'piece', 30000.00, 10, 1, '2025-10-09 15:18:31', '2025-10-09 15:18:31', 187, 1),
(791, '20 HP- VFD INVERTER', NULL, NULL, '', 'piece', 52000.00, 10, 1, '2025-10-09 15:19:27', '2025-10-09 15:19:27', 187, 1),
(792, '30 HP- VFD INVERTER', NULL, NULL, '', 'piece', 72000.00, 10, 1, '2025-10-09 15:20:09', '2025-10-09 15:20:09', 187, 1),
(793, '40 HP- VFD INVERTER', NULL, NULL, '', 'piece', 95000.00, 10, 1, '2025-10-09 15:20:29', '2025-10-09 15:20:29', 187, 1),
(794, 'DCD BOX', NULL, NULL, '', 'piece', 10000.00, 10, 1, '2025-10-09 15:21:11', '2025-10-09 15:21:11', 187, 1),
(795, 'Structure+Wire Kit 5HP', NULL, NULL, '', 'piece', 75520.00, 25, 1, '2025-10-09 15:22:22', '2025-10-09 15:22:22', 192, 1),
(796, 'Structure+Wire Kit 10HP', '', '', '', 'piece', 151040.00, 25, 1, '2025-10-09 15:23:50', '2025-10-09 15:30:36', 192, 1),
(797, 'Structure+Wire Kit 15HP', '', '', '', 'piece', 265500.00, 25, 1, '2025-10-09 15:24:30', '2025-10-09 15:34:20', 192, 1),
(798, 'Structure+Wire Kit 20HP', '', '', '', 'piece', 354000.00, 25, 1, '2025-10-09 15:24:57', '2025-10-09 15:38:27', 192, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_brands`
--

CREATE TABLE `product_brands` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_brands`
--

INSERT INTO `product_brands` (`id`, `name`, `description`, `website`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'UTL', 'UTL Solar: Panels, inverters, batteries, charge controllers, EPC solutions.', 'https://www.utlups.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(2, 'Luminous', 'Luminous: Solar inverters, batteries, and power solutions.', 'https://www.luminousindia.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(3, 'Waaree', 'Waaree Energies: Largest Indian manufacturer of PV modules.', 'https://www.waaree.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(4, 'Vikram Solar', 'Vikram Solar: Tier-1 Indian solar panel manufacturer.', 'https://www.vikramsolar.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(5, 'Tata Power Solar', 'Tata Power Solar: Panels, EPC, rooftop & utility solutions.', 'https://www.tatapowersolar.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(6, 'Adani Solar', 'Adani Solar: Large scale solar panels and EPC projects.', 'https://www.adanisolar.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(7, 'RenewSys', 'RenewSys: India’s first integrated solar cell & module manufacturer.', 'https://www.renewsysworld.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(8, 'Goldi Solar', 'Goldi Solar: Indian manufacturer of PV modules.', 'https://www.goldi-solar.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(9, 'Jakson Solar', 'Jakson Solar: EPC, modules, and energy storage solutions.', 'https://www.jakson.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(10, 'Havells Solar', 'Havells: Solar inverters, wires, and BOS components.', 'https://www.havells.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(11, 'Su-Kam', 'Su-Kam: Solar inverters and power backup solutions.', 'https://www.su-kam.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(12, 'Exide Solar', 'Exide: Batteries, hybrid systems, and solar storage.', 'https://www.exideindustries.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(13, 'Microtek Solar', 'Microtek: Inverters, UPS, and solar solutions.', 'https://www.microtekdirect.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(14, 'Okaya Solar', 'Okaya: Batteries and solar solutions.', 'https://www.okayapower.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(15, 'Patanjali Solar', 'Patanjali Renewable Energy: Panels, inverters, EPC solutions.', 'https://patanjali.in/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(16, 'Servotech Power', 'Servotech: EV chargers, solar solutions, and inverters.', 'https://www.servotech.in/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(17, 'Indosolar', 'Indosolar: Solar PV cell and panel manufacturer.', 'http://www.indosolar.co.in/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(18, 'Premier Solar', 'Premier Solar: EPC and module manufacturer.', 'https://www.premiersolar.co.in/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(19, 'Saatvik Green', 'Saatvik Green Energy: PV modules and EPC.', 'https://saatvikgroup.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(20, 'Navitas Solar', 'Navitas Solar: Panels and rooftop solutions.', 'https://www.navitassolar.in/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(21, 'Canadian Solar', 'Canadian Solar: Tier-1 global PV manufacturer.', 'https://www.canadiansolar.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(22, 'Trina Solar', 'Trina Solar: Chinese Tier-1 solar panel giant.', 'https://www.trinasolar.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(23, 'JA Solar', 'JA Solar: Global PV panel and cell supplier.', 'https://www.jasolar.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(24, 'Jinko Solar', 'Jinko Solar: Largest global solar panel manufacturer.', 'https://www.jinkosolar.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(25, 'LONGi Solar', 'LONGi: World’s largest monocrystalline solar panel supplier.', 'https://www.longi.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(26, 'REC Solar', 'REC Group: Premium quality solar panels (Norwegian).', 'https://www.recgroup.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(27, 'Q CELLS', 'Hanwha Q Cells: German-origin solar panel maker.', 'https://www.q-cells.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(28, 'First Solar', 'First Solar: Thin-film solar panel leader (USA).', 'https://www.firstsolar.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(29, 'SunPower', 'SunPower: Premium high-efficiency solar panels (USA).', 'https://us.sunpower.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(30, 'LG Solar', 'LG: High-quality solar panels, now legacy brand.', 'https://www.lg.com/global/business/solar', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(31, 'SMA Solar', 'SMA: German solar inverter leader.', 'https://www.sma.de/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(32, 'Fronius', 'Fronius: Austrian premium solar inverter manufacturer.', 'https://www.fronius.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(33, 'Huawei Solar', 'Huawei: Smart solar inverters and optimizers.', 'https://solar.huawei.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(34, 'Sungrow', 'Sungrow: World’s second largest inverter brand.', 'https://en.sungrowpower.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(35, 'Growatt', 'Growatt: Hybrid inverters and storage solutions.', 'https://www.growatt.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(36, 'Delta Electronics', 'Delta: Taiwan-based solar inverter maker.', 'https://www.deltaww.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(37, 'Kaco New Energy', 'Kaco: German inverter manufacturer.', 'https://www.kaco-newenergy.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(38, 'GoodWe', 'GoodWe: Hybrid & string inverters from China.', 'https://www.goodwe.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(39, 'SolarEdge', 'SolarEdge: Israel-based inverter and optimizer brand.', 'https://www.solaredge.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(40, 'Enphase Energy', 'Enphase: US-based microinverter company.', 'https://enphase.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(41, 'Tesla Powerwall', 'Tesla: Premium energy storage system.', 'https://www.tesla.com/powerwall', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(42, 'Panasonic Solar', 'Panasonic: Solar panels and battery storage.', 'https://na.panasonic.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(43, 'BYD', 'BYD: Chinese EV and battery storage company.', 'https://www.byd.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(44, 'LG Chem', 'LG Chem: Lithium-ion solar batteries.', 'https://www.lgchem.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(45, 'Samsung SDI', 'Samsung: Energy storage and lithium battery.', 'https://www.samsungsdi.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(46, 'Amaron Solar', 'Amaron: Lead-acid and tubular solar batteries.', 'https://www.amaron.in/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(47, 'Eastman', 'Eastman: Indian brand for batteries and solar products.', 'https://eastman.co.in/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(48, 'Base Batteries', 'Base: Batteries for solar and UPS.', 'https://www.basebatteries.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(49, 'Relicell', 'Relicell: Deep cycle batteries for solar use.', 'https://relicellbattery.com/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27'),
(50, 'HBL Power', 'HBL: Batteries for renewable energy.', 'https://www.hbl.in/', 1, '2025-09-18 10:51:27', '2025-09-18 10:51:27');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(186, 'Solar Panels', 'Photovoltaic (PV) modules including monocrystalline, polycrystalline, bifacial, and thin-film panels.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(187, 'Inverters', 'On-grid, off-grid, and hybrid inverters for converting DC to AC power.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(188, 'Batteries & Storage', 'Energy storage solutions including lithium-ion, lead-acid, and advanced battery packs.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(189, 'Charge Controllers', 'PWM and MPPT charge controllers for regulating solar charging.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(190, 'Mounting Structures', 'Roof-top, ground-mounted, and solar tracking mounting structures.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(191, 'Solar Trackers', 'Single-axis and dual-axis trackers for optimizing solar panel efficiency.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(192, 'Cables & Wiring', 'Solar DC cables, AC cables, earthing wires, and connectors.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(193, 'Connectors & Junction Boxes', 'MC4 connectors, junction boxes, and DC distribution components.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(194, 'Safety & Protection Devices', 'Surge protectors, MCBs, fuses, breakers, and lightning arrestors.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(195, 'Meters & Monitoring Systems', 'Net meters, smart meters, IoT-based monitoring, and data loggers.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(196, 'Solar Pumps', 'Solar-powered pumping systems for agriculture and irrigation.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(197, 'Solar Street Lights', 'Integrated and standalone solar-powered street lighting systems.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(198, 'Solar Water Heaters', 'Flat plate and evacuated tube collectors for solar water heating.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(199, 'Solar Cookers', 'Solar-powered cooking devices for households and institutions.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(200, 'Solar Cold Storage', 'Cold storage and refrigeration units powered by solar energy.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(201, 'Solar Desalination Systems', 'Solar-driven water purification and desalination equipment.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(202, 'Portable Solar Kits & Lanterns', 'Small solar kits, lanterns, and home lighting systems.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(203, 'EV Charging Solutions', 'Solar-integrated charging stations for electric vehicles.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(204, 'Floating Solar Equipment', 'Solar panels and structures designed for installation on water bodies.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(205, 'Utility Scale Equipment', 'High-capacity inverters, transformers, and switchgear for solar farms.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(206, 'Hybrid Systems', 'Solar + Wind + Battery integrated hybrid solutions.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(207, 'Tools & Installation Kits', 'Crimping tools, testers, and installation toolkits for solar technicians.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(208, 'Monitoring & IoT Devices', 'Energy monitoring devices, IoT modules, and software for solar analytics.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12'),
(209, 'Spare Parts & Accessories', 'Gears, clamps, bearings, fasteners, and other spare parts.', 1, '2025-09-18 10:48:12', '2025-09-18 10:48:12');

-- --------------------------------------------------------

--
-- Table structure for table `quotations`
--

CREATE TABLE `quotations` (
  `id` int(11) NOT NULL,
  `quotation_number` varchar(50) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `package_id` int(11) DEFAULT NULL,
  `sector` varchar(50) DEFAULT NULL,
  `system_type` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `system_size_kw` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `discount_percentage` decimal(5,2) DEFAULT 0.00,
  `discount_amount` decimal(12,2) DEFAULT 0.00,
  `final_amount` decimal(12,2) NOT NULL,
  `tax_percentage` decimal(5,2) DEFAULT 18.00,
  `tax_enabled` tinyint(1) DEFAULT 1,
  `tax_amount` decimal(12,2) DEFAULT 0.00,
  `grand_total` decimal(12,2) NOT NULL,
  `status` enum('draft','sent','accepted','rejected','expired') DEFAULT 'draft',
  `valid_until` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `quotations`
--

INSERT INTO `quotations` (`id`, `quotation_number`, `client_id`, `company_id`, `package_id`, `sector`, `system_type`, `quantity`, `system_size_kw`, `subtotal`, `discount_percentage`, `discount_amount`, `final_amount`, `tax_percentage`, `tax_enabled`, `tax_amount`, `grand_total`, `status`, `valid_until`, `notes`, `created_at`, `updated_at`) VALUES
(34, 'SQ2025090003', 72, 66, NULL, '102', '141', 1, 0.00, 144000.00, 0.00, 0.00, 144000.00, 0.00, 0, 0.00, 144000.00, 'draft', '2025-10-20', '', '2025-09-20 09:04:35', '2025-09-25 10:16:58'),
(35, 'SQ2025090004', 72, 66, NULL, '102', '141', 1, 0.00, 144000.00, 0.00, 0.00, 144000.00, 0.00, 0, 0.00, 144000.00, 'draft', '2025-10-21', '', '2025-09-21 09:30:47', '2025-09-25 10:16:58'),
(36, 'SQ2025090005', 72, 66, NULL, '101', '140', 1, 0.00, 145720.00, 0.00, 0.00, 145720.00, 0.00, 0, 0.00, 145720.00, 'draft', '2025-10-21', '', '2025-09-21 12:16:34', '2025-09-22 07:12:47'),
(37, 'SQ2025090006', 72, 66, NULL, '101', '140', 1, 0.00, 145720.00, 0.00, 0.00, 145720.00, 0.00, 0, 0.00, 145720.00, 'draft', '2025-10-21', '', '2025-09-21 12:29:45', '2025-09-22 07:12:44'),
(38, 'SQ2025090007', 72, 66, 325, '101', '142', 1, 0.00, 785600.00, 0.00, 0.00, 785600.00, 0.00, 0, 0.00, 785600.00, 'draft', '2025-10-27', '', '2025-09-27 08:19:50', '2025-09-27 08:19:50'),
(39, 'SQ2025090008', 72, 66, 315, '101', '142', 1, 0.00, 233580.00, 0.00, 0.00, 233580.00, 0.00, 0, 0.00, 233580.00, 'draft', '2025-10-29', '', '2025-09-29 07:49:38', '2025-09-29 07:49:38'),
(43, 'SQ2025090009', 74, 66, 326, '102', '141', 1, 0.00, 190000.00, 0.00, 0.00, 190000.00, 0.00, 0, 0.00, 190000.00, 'draft', '2025-10-29', '', '2025-09-29 08:28:03', '2025-09-29 08:28:03'),
(44, 'SQ2025090010', 78, 66, 316, '101', '142', 1, 0.00, 268580.00, 0.00, 0.00, 268580.00, 0.00, 1, 0.00, 268580.00, 'draft', '2025-10-29', '', '2025-09-29 08:31:52', '2025-09-29 08:31:52'),
(45, 'SQ2025090011', 82, 66, 307, '101', '140', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 0.00, 0.00, 'draft', '2025-10-29', '', '2025-09-29 09:11:45', '2025-09-29 09:11:45'),
(46, 'SQ2025090012', 78, 66, 332, '102', '141', 1, 0.00, 539500.00, 0.00, 0.00, 539500.00, 0.00, 1, 0.00, 539500.00, 'draft', '2025-10-29', '', '2025-09-29 09:15:50', '2025-09-29 09:15:50'),
(47, 'SQ2025090013', 94, 66, 315, '101', '142', 1, 0.00, 233580.00, 0.00, 0.00, 233580.00, 0.00, 1, 0.00, 233580.00, 'draft', '2025-10-29', '', '2025-09-29 09:18:50', '2025-09-29 09:18:50'),
(48, 'SQ2025090014', 98, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 0, 0.00, 183580.00, 'draft', '2025-10-29', '', '2025-09-29 09:21:05', '2025-09-29 09:21:05'),
(49, 'SQ2025090015', 98, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 0, 0.00, 183580.00, 'draft', '2025-10-29', '', '2025-09-29 09:23:03', '2025-09-29 09:23:03'),
(50, 'SQ2025090016', 100, 66, 307, '101', '140', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 0.00, 0.00, 'draft', '2025-10-29', '', '2025-09-29 09:25:33', '2025-09-29 09:25:33'),
(51, 'SQ2025100001', 105, 66, 316, '101', '142', 1, 0.00, 268580.00, 0.00, 0.00, 268580.00, 0.00, 1, 0.00, 268580.00, 'draft', '2025-10-31', '', '2025-10-01 06:46:25', '2025-10-01 06:46:25'),
(52, 'SQ2025100002', 106, 66, 334, '102', '141', 1, 0.00, 820200.00, 0.00, 0.00, 820200.00, 0.00, 1, 0.00, 820200.00, 'draft', '2025-10-31', '', '2025-10-01 13:20:27', '2025-10-01 13:20:27'),
(53, 'SQ2025100003', 107, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-01', '', '2025-10-02 05:32:05', '2025-10-02 05:32:05'),
(54, 'SQ2025100004', 107, 66, 328, '102', '141', 1, 0.00, 295000.00, 0.00, 0.00, 295000.00, 0.00, 1, 0.00, 295000.00, 'draft', '2025-11-01', '', '2025-10-02 08:09:58', '2025-10-02 08:09:58'),
(55, 'SQ2025100005', 107, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-01', '', '2025-10-02 10:13:19', '2025-10-02 10:13:19'),
(56, 'SQ2025100006', 107, 66, 315, '101', '142', 1, 0.00, 233580.00, 0.00, 0.00, 233580.00, 0.00, 1, 0.00, 233580.00, 'draft', '2025-11-02', '', '2025-10-03 06:29:03', '2025-10-03 06:29:03'),
(57, 'SQ2025100007', 107, 66, 326, '102', '141', 1, 0.00, 190000.00, 0.00, 0.00, 190000.00, 0.00, 1, 0.00, 190000.00, 'draft', '2025-11-02', '', '2025-10-03 06:36:59', '2025-10-03 06:36:59'),
(58, 'SQ2025100008', 108, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-02', '', '2025-10-03 06:41:52', '2025-10-03 06:41:52'),
(61, 'SQ2025100009', 109, 66, 313, '101', '142', 1, 0.00, 230720.00, 0.00, 0.00, 230720.00, 0.00, 1, 0.00, 230720.00, 'draft', '2025-11-02', '', '2025-10-03 13:35:15', '2025-10-03 13:35:15'),
(62, 'SQ2025100010', 109, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-02', '', '2025-10-03 13:38:00', '2025-10-03 13:38:00'),
(63, 'SQ2025100011', 109, 66, 327, '101', '141', 1, 0.00, 250000.00, 0.00, 0.00, 250000.00, 0.00, 1, 0.00, 250000.00, 'draft', '2025-11-03', '', '2025-10-04 06:35:28', '2025-10-04 06:35:28'),
(64, 'SQ2025100012', 109, 66, 307, '101', '140', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 0.00, 0.00, 'draft', '2025-11-03', '', '2025-10-04 06:37:33', '2025-10-04 06:37:33'),
(65, 'SQ2025100013', 112, 66, 320, '101', '142', 1, 0.00, 389300.00, 0.00, 0.00, 389300.00, 0.00, 0, 0.00, 389300.00, 'draft', '2025-10-04', '', '2025-10-04 11:46:15', '2025-10-04 11:46:15'),
(66, 'SQ2025100014', 112, 66, 320, '101', '142', 1, 0.00, 389300.00, 0.00, 0.00, 389300.00, 0.00, 1, 0.00, 389300.00, 'draft', '2025-11-03', '', '2025-10-04 12:59:12', '2025-10-04 12:59:12'),
(67, 'SQ2025100015', 72, 66, 313, '101', '142', 1, 0.00, 230720.00, 0.00, 0.00, 230720.00, 0.00, 0, 0.00, 230720.00, 'draft', '2025-11-03', '', '2025-10-04 14:08:54', '2025-10-04 14:08:54'),
(68, 'SQ2025100016', 112, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-04', '', '2025-10-05 09:28:20', '2025-10-05 09:28:20'),
(69, 'SQ2025100017', 73, 66, 334, '102', '150', 1, 0.00, 820200.00, 0.00, 0.00, 820200.00, 0.00, 0, 0.00, 820200.00, 'draft', '2025-11-04', '', '2025-10-05 14:08:12', '2025-10-05 14:08:12'),
(70, 'SQ2025100018', 112, 67, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-04', '', '2025-10-05 16:06:42', '2025-10-05 16:06:42'),
(71, 'SQ2025100019', 112, 66, 320, '102', '142', 1, 0.00, 389300.00, 0.00, 0.00, 389300.00, 0.00, 1, 0.00, 389300.00, 'draft', '2025-11-05', '', '2025-10-06 08:46:10', '2025-10-06 08:46:10'),
(72, 'SQ2025100020', 112, 66, 316, '102', '142', 1, 0.00, 268580.00, 0.00, 0.00, 268580.00, 0.00, 1, 0.00, 268580.00, 'draft', '2025-11-05', '', '2025-10-06 09:01:52', '2025-10-06 09:01:52'),
(73, 'SQ2025100021', 118, 66, 314, '101', '142', 1, 0.00, 230720.00, 0.00, 0.00, 230720.00, 0.00, 0, 0.00, 230720.00, 'draft', '2025-11-05', '', '2025-10-06 12:22:09', '2025-10-06 12:22:09'),
(74, 'SQ2025100022', 121, 67, 317, '101', '142', 1, 0.00, 268580.00, 0.00, 0.00, 268580.00, 0.00, 0, 0.00, 268580.00, 'draft', '2025-11-05', '', '2025-10-06 14:08:49', '2025-10-06 14:08:49'),
(75, 'SQ2025100023', 121, 66, 315, '101', '142', 1, 0.00, 233580.00, 0.00, 0.00, 233580.00, 0.00, 1, 0.00, 233580.00, 'draft', '2025-11-06', '', '2025-10-07 06:56:20', '2025-10-07 06:56:20'),
(76, 'SQ2025100024', 121, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-06', '', '2025-10-07 08:46:41', '2025-10-07 08:46:41'),
(77, 'SQ2025100025', 118, 66, 307, '101', '140', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 0.00, 0.00, 'draft', '2025-11-06', '', '2025-10-07 08:49:44', '2025-10-07 08:49:44'),
(78, 'SQ2025100026', 122, 66, 330, '102', '150', 1, 0.00, 428200.00, 0.00, 0.00, 428200.00, 0.00, 1, 0.00, 428200.00, 'draft', '2025-11-06', '', '2025-10-07 10:01:04', '2025-10-07 10:01:04'),
(79, 'SQ2025100027', 122, 66, 324, '101', '150', 1, 0.00, 662480.00, 0.00, 0.00, 662480.00, 0.00, 1, 0.00, 662480.00, 'draft', '2025-11-06', '', '2025-10-07 10:06:32', '2025-10-07 10:06:32'),
(80, 'SQ2025100028', 122, 66, 313, '101', '142', 1, 0.00, 230720.00, 0.00, 0.00, 230720.00, 0.00, 1, 0.00, 230720.00, 'draft', '2025-11-06', '', '2025-10-07 10:09:54', '2025-10-07 10:09:54'),
(81, 'SQ2025100029', 123, 66, 320, '101', '142', 1, 0.00, 389300.00, 0.00, 0.00, 389300.00, 0.00, 0, 0.00, 389300.00, 'draft', '2025-11-06', '', '2025-10-07 10:27:58', '2025-10-07 10:27:58'),
(82, 'SQ2025100030', 123, 66, 312, '101', '150', 1, 0.00, 585600.00, 0.00, 0.00, 585600.00, 0.00, 1, 0.00, 585600.00, 'draft', '2025-11-06', '', '2025-10-07 12:25:45', '2025-10-07 12:25:45'),
(83, 'SQ2025100031', 130, 66, 320, '101', '142', 1, 0.00, 389300.00, 0.00, 0.00, 389300.00, 0.00, 0, 0.00, 389300.00, 'draft', '2025-11-07', '', '2025-10-08 05:36:13', '2025-10-08 05:36:13'),
(84, 'SQ2025100032', 131, 66, 308, '101', '140', 1, 0.00, 269300.00, 0.00, 0.00, 269300.00, 18.00, 1, 48474.00, 317774.00, 'draft', '2025-11-07', '', '2025-10-08 05:39:59', '2025-10-08 05:39:59'),
(87, 'SQ2025100033', 132, 66, 308, '101', '140', 1, 0.00, 269300.00, 0.00, 0.00, 269300.00, 0.00, 0, 0.00, 269300.00, 'draft', '2025-11-07', '', '2025-10-08 05:58:49', '2025-10-08 05:58:49'),
(88, 'SQ2025100034', 132, 66, 312, '102', '140', 1, 0.00, 585600.00, 0.00, 0.00, 585600.00, 0.00, 1, 0.00, 585600.00, 'draft', '2025-11-07', '', '2025-10-08 06:51:05', '2025-10-08 06:51:05'),
(89, 'SQ2025100035', 133, 66, 307, '101', '140', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00, 0.00, 'draft', '2025-11-08', '', '2025-10-09 08:02:53', '2025-10-09 08:02:53'),
(90, 'SQ2025100036', 133, 66, 318, '101', '142', 1, 0.00, 336360.00, 0.00, 0.00, 336360.00, 0.00, 0, 0.00, 336360.00, 'draft', '2025-11-08', '', '2025-10-09 08:04:34', '2025-10-09 08:04:34'),
(91, 'SQ2025100037', 133, 66, 307, '101', '140', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00, 0.00, 'draft', '2025-11-08', '', '2025-10-09 08:07:34', '2025-10-09 08:07:34'),
(92, 'SQ2025100038', 132, 68, 340, '102', '150', 1, 0.00, 542880.00, 0.00, 0.00, 542880.00, 0.00, 1, 0.00, 542880.00, 'draft', '2025-11-08', '', '2025-10-09 15:42:14', '2025-10-09 15:42:14'),
(93, 'SQ2025100039', 133, 66, 328, '102', '141', 1, 0.00, 295000.00, 0.00, 0.00, 295000.00, 0.00, 1, 0.00, 295000.00, 'draft', '2025-11-09', '', '2025-10-10 02:56:48', '2025-10-10 02:56:48'),
(94, 'SQ2025100040', 133, 66, 320, '101', '142', 1, 0.00, 389300.00, 0.00, 0.00, 389300.00, 0.00, 1, 0.00, 389300.00, 'draft', '2025-11-09', '', '2025-10-10 02:59:40', '2025-10-10 02:59:40'),
(95, 'SQ2025100041', 133, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 0, 0.00, 183580.00, 'draft', '2025-11-09', '', '2025-10-10 04:46:57', '2025-10-10 04:46:57'),
(96, 'SQ2025100042', 135, 66, 328, '102', '141', 1, 0.00, 295000.00, 0.00, 0.00, 295000.00, 0.00, 0, 0.00, 295000.00, 'draft', '2025-11-09', '', '2025-10-10 07:54:55', '2025-10-10 07:54:55'),
(97, 'SQ2025100043', 136, 66, 325, '101', '142', 1, 0.00, 785600.00, 0.00, 0.00, 785600.00, 0.00, 0, 0.00, 785600.00, 'draft', '2025-11-09', '', '2025-10-10 08:30:57', '2025-10-10 08:30:57'),
(98, 'SQ2025100044', 136, 66, 335, '101', '141', 1, 0.00, 861500.00, 0.00, 0.00, 861500.00, 0.00, 1, 0.00, 861500.00, 'draft', '2025-11-09', '', '2025-10-10 08:56:19', '2025-10-10 08:56:19'),
(99, 'SQ2025100045', 140, 66, 328, '102', '150', 1, 0.00, 295000.00, 0.00, 0.00, 295000.00, 0.00, 0, 0.00, 295000.00, 'draft', '2025-11-09', '', '2025-10-10 08:59:20', '2025-10-10 08:59:20'),
(104, 'SQ2025100046', 144, 66, 307, '101', '140', 1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0.00, 0.00, 'draft', '2025-11-09', '', '2025-10-10 10:31:30', '2025-10-10 10:31:30'),
(105, 'SQ2025100047', 144, 66, 312, '101', '150', 1, 0.00, 585600.00, 0.00, 0.00, 585600.00, 0.00, 0, 0.00, 585600.00, 'draft', '2025-11-10', '', '2025-10-11 07:28:25', '2025-10-11 07:28:25'),
(106, 'SQ2025100048', 144, 66, 312, '101', '150', 1, 0.00, 585600.00, 0.00, 0.00, 585600.00, 0.00, 1, 0.00, 585600.00, 'draft', '2025-11-10', '', '2025-10-11 08:25:01', '2025-10-11 08:25:01'),
(107, 'SQ2025100049', 140, 68, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-10', '', '2025-10-11 08:59:31', '2025-10-11 08:59:31'),
(108, 'SQ2025100050', 154, 68, 340, '102', '150', 1, 0.00, 542880.00, 0.00, 0.00, 542880.00, 0.00, 1, 0.00, 542880.00, 'draft', '2025-11-10', '', '2025-10-11 09:11:14', '2025-10-11 09:11:14'),
(109, 'SQ2025100051', 155, 66, 316, '101', '142', 1, 0.00, 268580.00, 0.00, 0.00, 268580.00, 0.00, 1, 0.00, 268580.00, 'draft', '2025-11-10', '', '2025-10-11 09:35:34', '2025-10-11 09:35:34'),
(110, 'SQ2025100052', 155, 66, 315, '101', '142', 1, 0.00, 233580.00, 0.00, 0.00, 233580.00, 0.00, 1, 0.00, 233580.00, 'draft', '2025-11-10', '', '2025-10-11 09:44:23', '2025-10-11 09:44:23'),
(111, 'SQ2025100053', 155, 66, 315, '101', '142', 1, 0.00, 233580.00, 0.00, 0.00, 233580.00, 0.00, 1, 0.00, 233580.00, 'draft', '2025-11-10', '', '2025-10-11 09:52:07', '2025-10-11 09:52:07'),
(112, 'SQ2025100054', 155, 66, 320, '101', '142', 1, 0.00, 389300.00, 0.00, 0.00, 389300.00, 0.00, 1, 0.00, 389300.00, 'draft', '2025-11-10', '', '2025-10-11 10:28:34', '2025-10-11 10:28:34'),
(113, 'SQ2025100055', 154, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-10', '', '2025-10-11 10:40:28', '2025-10-11 10:40:28'),
(114, 'SQ2025100056', 155, 66, 320, '102', '142', 1, 0.00, 389300.00, 0.00, 0.00, 389300.00, 0.00, 1, 0.00, 389300.00, 'draft', '2025-11-10', '', '2025-10-11 10:46:00', '2025-10-11 10:46:00'),
(115, 'SQ2025100057', 154, 68, 341, '102', '150', 1, 0.00, 815400.00, 0.00, 0.00, 815400.00, 0.00, 1, 0.00, 815400.00, 'draft', '2025-11-10', '', '2025-10-11 11:25:57', '2025-10-11 11:25:57'),
(116, 'SQ2025100058', 155, 68, 340, '101', '150', 1, 0.00, 542880.00, 0.00, 0.00, 542880.00, 0.00, 1, 0.00, 542880.00, 'draft', '2025-11-10', '', '2025-10-11 13:49:50', '2025-10-11 13:49:50'),
(117, 'SQ2025100059', 155, 67, 340, '102', '150', 1, 0.00, 542880.00, 0.00, 0.00, 542880.00, 0.00, 1, 0.00, 542880.00, 'draft', '2025-11-10', '', '2025-10-11 14:56:38', '2025-10-11 14:56:38'),
(118, 'SQ2025100060', 155, 66, 334, '102', '150', 1, 0.00, 820200.00, 0.00, 0.00, 820200.00, 0.00, 1, 0.00, 820200.00, 'draft', '2025-11-11', '', '2025-10-12 08:36:39', '2025-10-12 08:36:39'),
(119, 'SQ2025100061', 155, 68, 342, '102', '150', 1, 0.00, 815400.00, 0.00, 0.00, 815400.00, 0.00, 1, 0.00, 815400.00, 'draft', '2025-11-11', '', '2025-10-12 08:38:32', '2025-10-12 08:38:32'),
(120, 'SQ2025100062', 155, 68, 318, '102', '142', 1, 0.00, 336360.00, 0.00, 0.00, 336360.00, 0.00, 1, 0.00, 336360.00, 'draft', '2025-11-12', '', '2025-10-13 07:14:12', '2025-10-13 07:14:12'),
(121, 'SQ2025100063', 156, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 0, 0.00, 183580.00, 'draft', '2025-11-12', '', '2025-10-13 10:55:54', '2025-10-13 10:55:54'),
(122, 'SQ2025100064', 157, 66, 340, '101', '150', 1, 0.00, 542880.00, 0.00, 0.00, 542880.00, 0.00, 1, 0.00, 542880.00, 'draft', '2025-11-16', 'Basti ', '2025-10-16 11:16:16', '2025-10-16 11:16:16'),
(123, 'SQ2025100065', 157, 68, 330, '102', '150', 1, 0.00, 428200.00, 0.00, 0.00, 428200.00, 0.00, 0, 0.00, 428200.00, 'draft', '2025-11-16', '', '2025-10-17 05:50:49', '2025-10-17 05:50:49'),
(124, 'SQ2025100066', 72, 68, 308, '101', '140', 1, 0.00, 269300.00, 0.00, 0.00, 269300.00, 0.00, 0, 0.00, 269300.00, 'draft', '2025-11-16', '', '2025-10-17 11:15:05', '2025-10-17 11:15:05'),
(125, 'SQ2025100067', 157, 68, 330, '102', '150', 1, 0.00, 428200.00, 0.00, 0.00, 428200.00, 0.00, 1, 0.00, 428200.00, 'draft', '2025-11-20', '', '2025-10-21 07:11:22', '2025-10-21 07:11:22'),
(126, 'SQ2025100068', 157, 68, 339, '102', '150', 1, 0.00, 285440.00, 0.00, 0.00, 285440.00, 0.00, 1, 0.00, 285440.00, 'draft', '2025-11-20', '', '2025-10-21 07:14:53', '2025-10-21 07:14:53'),
(127, 'SQ2025100069', 159, 68, 329, '102', '150', 1, 0.00, 295000.00, 0.00, 0.00, 295000.00, 0.00, 1, 0.00, 295000.00, 'draft', '2025-11-20', '', '2025-10-21 10:09:45', '2025-10-21 10:09:45'),
(128, 'SQ2025100070', 159, 68, 339, '101', '150', 1, 0.00, 285440.00, 0.00, 0.00, 285440.00, 0.00, 1, 0.00, 285440.00, 'draft', '2025-11-20', 'Basti ', '2025-10-21 10:15:58', '2025-10-21 10:15:58'),
(129, 'SQ2025100071', 160, 68, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-20', '', '2025-10-21 10:27:06', '2025-10-21 10:27:06'),
(130, 'SQ2025100072', 160, 68, 312, '101', '140', 1, 0.00, 585600.00, 0.00, 0.00, 585600.00, 0.00, 0, 0.00, 585600.00, 'draft', '2025-11-22', '', '2025-10-23 11:20:20', '2025-10-23 11:20:20'),
(131, 'SQ2025100073', 162, 68, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 1, 0.00, 183580.00, 'draft', '2025-11-24', '', '2025-10-25 12:41:46', '2025-10-25 12:41:46'),
(132, 'SQ2025100074', 163, 66, 305, '101', '140', 1, 0.00, 183580.00, 0.00, 0.00, 183580.00, 0.00, 0, 0.00, 183580.00, '', '2025-11-28', '', '2025-10-29 08:29:55', '2025-10-29 08:29:55'),
(135, 'SQ2025100075', 168, 68, 308, '101', '140', 1, 0.00, 269300.00, 0.00, 0.00, 269300.00, 0.00, 1, 0.00, 269300.00, 'draft', '2025-11-30', '', '2025-10-31 06:56:18', '2025-10-31 06:56:18'),
(136, 'SQ2025100076', 161, 68, 317, '101', '142', 1, 0.00, 268580.00, 0.00, 0.00, 268580.00, 0.00, 1, 0.00, 268580.00, 'draft', '2025-11-30', '', '2025-10-31 08:17:16', '2025-10-31 08:17:16');

-- --------------------------------------------------------

--
-- Table structure for table `quotation_content`
--

CREATE TABLE `quotation_content` (
  `id` int(11) NOT NULL,
  `quotation_id` int(11) NOT NULL,
  `content_type` enum('introduction','benefits','technical_specs','warranty','conclusion') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_ai_generated` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quotation_items`
--

CREATE TABLE `quotation_items` (
  `id` int(11) NOT NULL,
  `quotation_id` int(11) DEFAULT NULL,
  `item_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quote_items`
--

CREATE TABLE `quote_items` (
  `id` int(11) NOT NULL,
  `quotation_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `unit` varchar(50) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `quote_items`
--

INSERT INTO `quote_items` (`id`, `quotation_id`, `product_name`, `description`, `unit`, `quantity`, `unit_price`, `total_price`, `created_at`) VALUES
(63, 34, 'Accessories (ACDB + DCDB Box &amp;amp; Earthing Kit)  2 kW off-grid', '', 'set', 1.00, 12900.00, 12900.00, '2025-09-20 09:04:35'),
(64, 34, 'Non DCR Bifacial Panels 590W', '', 'piece', 4.00, 14750.00, 59000.00, '2025-09-20 09:04:35'),
(65, 34, 'Structure + Wiring Kit — 2 kW off-grid', '', 'set', 1.00, 21100.00, 21100.00, '2025-09-20 09:04:35'),
(66, 34, 'Gamma + Solar Inverter (2kW / 24V)', '', 'piece', 1.00, 19000.00, 19000.00, '2025-09-20 09:04:35'),
(67, 34, 'Lithium Battery 12V', '', 'piece', 2.00, 16000.00, 32000.00, '2025-09-20 09:04:35'),
(68, 35, 'Accessories (ACDB + DCDB Box &amp;amp; Earthing Kit)  2 kW off-grid', '', 'set', 1.00, 12900.00, 12900.00, '2025-09-21 09:30:47'),
(69, 35, 'Non DCR Bifacial Panels 590W', '', 'piece', 4.00, 14750.00, 59000.00, '2025-09-21 09:30:47'),
(70, 35, 'Structure + Wiring Kit — 2 kW off-grid', '', 'set', 1.00, 21100.00, 21100.00, '2025-09-21 09:30:47'),
(71, 35, 'Gamma + Solar Inverter (2kW / 24V)', '', 'piece', 1.00, 19000.00, 19000.00, '2025-09-21 09:30:47'),
(72, 35, 'Lithium Battery 12V', '', 'piece', 2.00, 16000.00, 32000.00, '2025-09-21 09:30:47'),
(73, 36, '550wt DCR TOPCON PANEL', '.', 'piece', 4.00, 21000.00, 84000.00, '2025-09-21 12:16:34'),
(74, 36, 'Ongrid Inverter 2kw', '', 'piece', 1.00, 44600.00, 44600.00, '2025-09-21 12:16:34'),
(75, 36, 'Structure+Kit ', '', 'set', 1.00, 17120.00, 17120.00, '2025-09-21 12:16:34'),
(76, 37, 'Structure+Kit ', '', 'set', 1.00, 17120.00, 17120.00, '2025-09-21 12:29:45'),
(77, 37, 'Ongrid Inverter 2kw', '', 'piece', 1.00, 44600.00, 44600.00, '2025-09-21 12:29:45'),
(78, 37, '550wt DCR TOPCON PANEL', '.', 'piece', 4.00, 21000.00, 84000.00, '2025-09-21 12:29:45'),
(79, 38, '550wt DCR TOPCON PANEL', '.', 'piece', 20.00, 21000.00, 420000.00, '2025-09-27 08:19:50'),
(80, 38, '10kw/120v Sigma Pro Inverter', '', 'piece', 1.00, 120000.00, 120000.00, '2025-09-27 08:19:50'),
(81, 38, 'Structure+wire kit 10kw ongrid/hybrid', '', 'piece', 1.00, 85600.00, 85600.00, '2025-09-27 08:19:50'),
(82, 38, 'Lithium Battery 12V', '', 'piece', 10.00, 16000.00, 160000.00, '2025-09-27 08:19:50'),
(83, 39, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-09-29 07:49:38'),
(84, 39, '3kw/24v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 49900.00, 49900.00, '2025-09-29 07:49:38'),
(85, 39, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-09-29 07:49:38'),
(86, 39, 'Lithium Battery 12V', '', 'piece', 2.00, 16000.00, 32000.00, '2025-09-29 07:49:38'),
(87, 43, 'Alpha Pro Inerter 3kw/48v', '', 'piece', 1.00, 34100.00, 34100.00, '2025-09-29 08:28:03'),
(88, 43, 'Non DCR Bifacial Panels 590W', '', 'piece', 6.00, 14750.00, 88500.00, '2025-09-29 08:28:03'),
(89, 43, 'Structure+wire kit 3kw off grid', '', 'piece', 1.00, 35400.00, 35400.00, '2025-09-29 08:28:03'),
(90, 43, 'Lithium Battery 12V', '', 'piece', 2.00, 16000.00, 32000.00, '2025-09-29 08:28:03'),
(91, 44, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-09-29 08:31:52'),
(92, 44, '3kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 52900.00, 52900.00, '2025-09-29 08:31:52'),
(93, 44, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-09-29 08:31:52'),
(94, 44, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-09-29 08:31:52'),
(95, 46, 'Lithium Battery 12V', '', 'piece', 10.00, 16000.00, 160000.00, '2025-09-29 09:15:50'),
(96, 46, 'Non DCR Bifacial Panels 590W', '', 'piece', 14.00, 14750.00, 206500.00, '2025-09-29 09:15:50'),
(97, 46, 'Alpha Pro Inerter 8kw/120v', '', 'piece', 1.00, 78600.00, 78600.00, '2025-09-29 09:15:50'),
(98, 46, 'Structure+wire kit 8kw off grid', '', 'piece', 1.00, 94400.00, 94400.00, '2025-09-29 09:15:50'),
(99, 47, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-09-29 09:18:50'),
(100, 47, '3kw/24v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 49900.00, 49900.00, '2025-09-29 09:18:50'),
(101, 47, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-09-29 09:18:50'),
(102, 47, 'Lithium Battery 12V', '', 'piece', 2.00, 16000.00, 32000.00, '2025-09-29 09:18:50'),
(103, 48, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-09-29 09:21:05'),
(104, 48, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-09-29 09:21:05'),
(105, 48, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-09-29 09:21:05'),
(106, 49, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-09-29 09:23:03'),
(107, 49, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-09-29 09:23:03'),
(108, 49, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-09-29 09:23:03'),
(109, 51, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-01 06:46:25'),
(110, 51, '3kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 52900.00, 52900.00, '2025-10-01 06:46:25'),
(111, 51, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-01 06:46:25'),
(112, 51, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-01 06:46:25'),
(113, 52, 'Non DCR Bifacial Panels 590W', '', 'piece', 20.00, 14750.00, 295000.00, '2025-10-01 13:20:27'),
(114, 52, 'Structure+wire kit 11kw off grid', '', 'piece', 1.00, 129800.00, 129800.00, '2025-10-01 13:20:27'),
(115, 52, 'Lithium Battery 12V', '', 'piece', 15.00, 16000.00, 240000.00, '2025-10-01 13:20:27'),
(116, 52, 'Alpha Pro Inerter 15kw/120v', '', 'piece', 1.00, 155400.00, 155400.00, '2025-10-01 13:20:27'),
(117, 53, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-02 05:32:05'),
(118, 53, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-02 05:32:05'),
(119, 53, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-02 05:32:05'),
(120, 54, 'Non DCR Bifacial Panels 590W', '', 'piece', 10.00, 14750.00, 147500.00, '2025-10-02 08:09:58'),
(121, 54, 'Alpha Pro Inerter 5kww/48v', '', 'piece', 1.00, 24500.00, 24500.00, '2025-10-02 08:09:58'),
(122, 54, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-02 08:09:58'),
(123, 54, 'Structure+wire kit 5kw off grid', '', 'piece', 1.00, 59000.00, 59000.00, '2025-10-02 08:09:58'),
(124, 55, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-02 10:13:19'),
(125, 55, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-02 10:13:19'),
(126, 55, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-02 10:13:19'),
(127, 56, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-03 06:29:03'),
(128, 56, '3kw/24v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 49900.00, 49900.00, '2025-10-03 06:29:03'),
(129, 56, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-03 06:29:03'),
(130, 56, 'Lithium Battery 12V', '', 'piece', 2.00, 16000.00, 32000.00, '2025-10-03 06:29:03'),
(131, 57, 'Alpha Pro Inerter 3kw/48v', '', 'piece', 1.00, 34100.00, 34100.00, '2025-10-03 06:36:59'),
(132, 57, 'Non DCR Bifacial Panels 590W', '', 'piece', 6.00, 14750.00, 88500.00, '2025-10-03 06:36:59'),
(133, 57, 'Structure+wire kit 3kw off grid', '', 'piece', 1.00, 35400.00, 35400.00, '2025-10-03 06:36:59'),
(134, 57, 'Lithium Battery 12V', '', 'piece', 2.00, 16000.00, 32000.00, '2025-10-03 06:36:59'),
(135, 58, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-03 06:41:52'),
(136, 58, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-03 06:41:52'),
(137, 58, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-03 06:41:52'),
(145, 61, '550wt DCR TOPCON PANEL', '.', 'piece', 4.00, 21000.00, 84000.00, '2025-10-03 13:35:15'),
(146, 61, '2kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 65600.00, 65600.00, '2025-10-03 13:35:15'),
(147, 61, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-03 13:35:15'),
(148, 61, 'Structure+Kit Ongrid 2kw ongrid/Hybrid', '', 'set', 1.00, 17120.00, 17120.00, '2025-10-03 13:35:15'),
(149, 62, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-03 13:38:00'),
(150, 62, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-03 13:38:00'),
(151, 62, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-03 13:38:00'),
(152, 63, 'Non DCR Bifacial Panels 590W', '', 'piece', 8.00, 14750.00, 118000.00, '2025-10-04 06:35:28'),
(153, 63, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-04 06:35:28'),
(154, 63, 'Alpha Pro Inerter 5kw/48v', '', 'piece', 1.00, 20800.00, 20800.00, '2025-10-04 06:35:28'),
(155, 63, 'Structure+wire kit 4kw off grid', '', 'piece', 1.00, 47200.00, 47200.00, '2025-10-04 06:35:28'),
(156, 65, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-04 11:46:15'),
(157, 65, '5kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 72500.00, 72500.00, '2025-10-04 11:46:15'),
(158, 65, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-04 11:46:15'),
(159, 65, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-04 11:46:15'),
(160, 66, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-04 12:59:12'),
(161, 66, '5kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 72500.00, 72500.00, '2025-10-04 12:59:12'),
(162, 66, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-04 12:59:12'),
(163, 66, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-04 12:59:12'),
(164, 67, '550wt DCR TOPCON PANEL', '.', 'piece', 4.00, 21000.00, 84000.00, '2025-10-04 14:08:54'),
(165, 67, '2kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 65600.00, 65600.00, '2025-10-04 14:08:54'),
(166, 67, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-04 14:08:54'),
(167, 67, 'Structure+Kit Ongrid 2kw ongrid/Hybrid', '', 'set', 1.00, 17120.00, 17120.00, '2025-10-04 14:08:54'),
(168, 68, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-05 09:28:20'),
(169, 68, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-05 09:28:20'),
(170, 68, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-05 09:28:20'),
(171, 69, 'Non DCR Bifacial Panels 590W', '', 'piece', 20.00, 14750.00, 295000.00, '2025-10-05 14:08:12'),
(172, 69, 'Structure+wire kit 11kw off grid', '', 'piece', 1.00, 129800.00, 129800.00, '2025-10-05 14:08:12'),
(173, 69, 'Lithium Battery 12V', '', 'piece', 15.00, 16000.00, 240000.00, '2025-10-05 14:08:12'),
(174, 69, 'Alpha Pro Inerter 15kw/120v', '', 'piece', 1.00, 155400.00, 155400.00, '2025-10-05 14:08:12'),
(175, 70, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-05 16:06:42'),
(176, 70, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-05 16:06:42'),
(177, 70, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-05 16:06:42'),
(178, 71, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-06 08:46:10'),
(179, 71, '5kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 72500.00, 72500.00, '2025-10-06 08:46:10'),
(180, 71, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-06 08:46:10'),
(181, 71, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-06 08:46:10'),
(182, 72, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-06 09:01:52'),
(183, 72, '3kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 52900.00, 52900.00, '2025-10-06 09:01:52'),
(184, 72, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-06 09:01:52'),
(185, 72, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-06 09:01:52'),
(186, 73, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-06 12:22:09'),
(187, 73, '550wt DCR TOPCON PANEL', '.', 'piece', 4.00, 21000.00, 84000.00, '2025-10-06 12:22:09'),
(188, 73, 'Structure+Kit Ongrid 2kw ongrid/Hybrid', '', 'set', 1.00, 17120.00, 17120.00, '2025-10-06 12:22:09'),
(189, 73, '2kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 65600.00, 65600.00, '2025-10-06 12:22:09'),
(190, 74, '3kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 52900.00, 52900.00, '2025-10-06 14:08:49'),
(191, 74, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-06 14:08:49'),
(192, 74, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-06 14:08:49'),
(193, 74, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-06 14:08:49'),
(194, 75, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-07 06:56:20'),
(195, 75, '3kw/24v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 49900.00, 49900.00, '2025-10-07 06:56:20'),
(196, 75, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-07 06:56:20'),
(197, 75, 'Lithium Battery 12V', '', 'piece', 2.00, 16000.00, 32000.00, '2025-10-07 06:56:20'),
(198, 76, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-07 08:46:41'),
(199, 76, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-07 08:46:41'),
(200, 76, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-07 08:46:41'),
(201, 78, 'Non DCR Bifacial Panels 590W', '', 'piece', 12.00, 14750.00, 177000.00, '2025-10-07 10:01:04'),
(202, 78, 'Alpha Pro Inerter 7.5kw/96v', '', 'piece', 1.00, 52400.00, 52400.00, '2025-10-07 10:01:04'),
(203, 78, 'Structure+wire kit 6kw off grid', '', 'piece', 1.00, 70800.00, 70800.00, '2025-10-07 10:01:04'),
(204, 78, 'Lithium Battery 12V', '', 'piece', 8.00, 16000.00, 128000.00, '2025-10-07 10:01:04'),
(205, 79, '550wt DCR TOPCON PANEL', '.', 'piece', 16.00, 21000.00, 336000.00, '2025-10-07 10:06:32'),
(206, 79, '7.5kw/96v Sigma Pro Inverter', '', 'piece', 1.00, 98000.00, 98000.00, '2025-10-07 10:06:32'),
(207, 79, 'Structure+Wire Kit 8kw ongrid/Hybrid', '', 'set', 1.00, 68480.00, 68480.00, '2025-10-07 10:06:32'),
(208, 79, 'Lithium Battery 12V', '', 'piece', 10.00, 16000.00, 160000.00, '2025-10-07 10:06:32'),
(209, 80, '550wt DCR TOPCON PANEL', '.', 'piece', 4.00, 21000.00, 84000.00, '2025-10-07 10:09:54'),
(210, 80, '2kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 65600.00, 65600.00, '2025-10-07 10:09:54'),
(211, 80, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-07 10:09:54'),
(212, 80, 'Structure+Kit Ongrid 2kw ongrid/Hybrid', '', 'set', 1.00, 17120.00, 17120.00, '2025-10-07 10:09:54'),
(213, 81, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-07 10:27:58'),
(214, 81, '5kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 72500.00, 72500.00, '2025-10-07 10:27:58'),
(215, 81, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-07 10:27:58'),
(216, 81, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-07 10:27:58'),
(217, 82, 'Structure+wire kit 10kw ongrid/hybrid', '', 'piece', 1.00, 85600.00, 85600.00, '2025-10-07 12:25:45'),
(218, 82, '550wt DCR TOPCON PANEL', '.', 'piece', 20.00, 21000.00, 420000.00, '2025-10-07 12:25:45'),
(219, 82, '10kw Ongrid inverter', '', 'piece', 1.00, 80000.00, 80000.00, '2025-10-07 12:25:45'),
(220, 83, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-08 05:36:13'),
(221, 83, '5kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 72500.00, 72500.00, '2025-10-08 05:36:13'),
(222, 83, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-08 05:36:13'),
(223, 83, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-08 05:36:13'),
(224, 84, 'Ongrid Inverter 5kw', '', 'piece', 1.00, 16500.00, 16500.00, '2025-10-08 05:39:59'),
(225, 84, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-08 05:39:59'),
(226, 84, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-08 05:39:59'),
(227, 87, 'Ongrid Inverter 5kw', '', 'piece', 1.00, 16500.00, 16500.00, '2025-10-08 05:58:49'),
(228, 87, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-08 05:58:49'),
(229, 87, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-08 05:58:49'),
(230, 88, 'Structure+wire kit 10kw ongrid/hybrid', '', 'piece', 1.00, 85600.00, 85600.00, '2025-10-08 06:51:05'),
(231, 88, '550wt DCR TOPCON PANEL', '.', 'piece', 20.00, 21000.00, 420000.00, '2025-10-08 06:51:05'),
(232, 88, '10kw Ongrid inverter', '', 'piece', 1.00, 80000.00, 80000.00, '2025-10-08 06:51:05'),
(233, 90, 'Structure+Wire 4kw ongrid/Hybrid', '', 'set', 1.00, 39200.00, 39200.00, '2025-10-09 08:04:34'),
(234, 90, '550wt DCR TOPCON PANEL', '.', 'piece', 8.00, 21000.00, 168000.00, '2025-10-09 08:04:34'),
(235, 90, '4kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 65160.00, 65160.00, '2025-10-09 08:04:34'),
(236, 90, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-09 08:04:34'),
(237, 92, '590WT-PANEL HP', '', 'piece', 32.00, 10620.00, 339840.00, '2025-10-09 15:42:14'),
(238, 92, '20 HP- VFD INVERTER', '', 'piece', 1.00, 52000.00, 52000.00, '2025-10-09 15:42:14'),
(239, 92, 'Structure+Wire Kit 10HP', '', 'piece', 1.00, 151040.00, 151040.00, '2025-10-09 15:42:14'),
(240, 93, 'Non DCR Bifacial Panels 590W', '', 'piece', 10.00, 14750.00, 147500.00, '2025-10-10 02:56:48'),
(241, 93, 'Alpha Pro Inerter 5kww/48v', '', 'piece', 1.00, 24500.00, 24500.00, '2025-10-10 02:56:48'),
(242, 93, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-10 02:56:48'),
(243, 93, 'Structure+wire kit 5kw off grid', '', 'piece', 1.00, 59000.00, 59000.00, '2025-10-10 02:56:48'),
(244, 94, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-10 02:59:40'),
(245, 94, '5kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 72500.00, 72500.00, '2025-10-10 02:59:40'),
(246, 94, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-10 02:59:40'),
(247, 94, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-10 02:59:40'),
(248, 95, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-10 04:46:57'),
(249, 95, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-10 04:46:57'),
(250, 95, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-10 04:46:57'),
(251, 96, 'Non DCR Bifacial Panels 590W', '', 'piece', 10.00, 14750.00, 147500.00, '2025-10-10 07:54:55'),
(252, 96, 'Alpha Pro Inerter 5kww/48v', '', 'piece', 1.00, 24500.00, 24500.00, '2025-10-10 07:54:55'),
(253, 96, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-10 07:54:55'),
(254, 96, 'Structure+wire kit 5kw off grid', '', 'piece', 1.00, 59000.00, 59000.00, '2025-10-10 07:54:55'),
(255, 97, '550wt DCR TOPCON PANEL', '.', 'piece', 20.00, 21000.00, 420000.00, '2025-10-10 08:30:57'),
(256, 97, '10kw/120v Sigma Pro Inverter', '', 'piece', 1.00, 120000.00, 120000.00, '2025-10-10 08:30:57'),
(257, 97, 'Structure+wire kit 10kw ongrid/hybrid', '', 'piece', 1.00, 85600.00, 85600.00, '2025-10-10 08:30:57'),
(258, 97, 'Lithium Battery 12V', '', 'piece', 10.00, 16000.00, 160000.00, '2025-10-10 08:30:57'),
(259, 98, 'Non DCR Bifacial Panels 590W', '', 'piece', 22.00, 14750.00, 324500.00, '2025-10-10 08:56:19'),
(260, 98, 'Structure+wire kit 12kw off grid', '', 'piece', 1.00, 141600.00, 141600.00, '2025-10-10 08:56:19'),
(261, 98, 'Lithium Battery 12V', '', 'piece', 15.00, 16000.00, 240000.00, '2025-10-10 08:56:19'),
(262, 98, 'Alpha Pro Inerter 15kw/120v', '', 'piece', 1.00, 155400.00, 155400.00, '2025-10-10 08:56:19'),
(263, 99, 'Non DCR Bifacial Panels 590W', '', 'piece', 10.00, 14750.00, 147500.00, '2025-10-10 08:59:20'),
(264, 99, 'Alpha Pro Inerter 5kww/48v', '', 'piece', 1.00, 24500.00, 24500.00, '2025-10-10 08:59:20'),
(265, 99, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-10 08:59:20'),
(266, 99, 'Structure+wire kit 5kw off grid', '', 'piece', 1.00, 59000.00, 59000.00, '2025-10-10 08:59:20'),
(267, 105, 'Structure+wire kit 10kw ongrid/hybrid', '', 'piece', 1.00, 85600.00, 85600.00, '2025-10-11 07:28:25'),
(268, 105, '550wt DCR TOPCON PANEL', '.', 'piece', 20.00, 21000.00, 420000.00, '2025-10-11 07:28:25'),
(269, 105, '10kw Ongrid inverter', '', 'piece', 1.00, 80000.00, 80000.00, '2025-10-11 07:28:25'),
(270, 106, 'Structure+wire kit 10kw ongrid/hybrid', '', 'piece', 1.00, 85600.00, 85600.00, '2025-10-11 08:25:01'),
(271, 106, '550wt DCR TOPCON PANEL', '.', 'piece', 20.00, 21000.00, 420000.00, '2025-10-11 08:25:01'),
(272, 106, '10kw Ongrid inverter', '', 'piece', 1.00, 80000.00, 80000.00, '2025-10-11 08:25:01'),
(273, 107, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-11 08:59:31'),
(274, 107, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-11 08:59:31'),
(275, 107, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-11 08:59:31'),
(276, 108, '590WT-PANEL HP', '', 'piece', 32.00, 10620.00, 339840.00, '2025-10-11 09:11:14'),
(277, 108, '20 HP- VFD INVERTER', '', 'piece', 1.00, 52000.00, 52000.00, '2025-10-11 09:11:14'),
(278, 108, 'Structure+Wire Kit 10HP', '', 'piece', 1.00, 151040.00, 151040.00, '2025-10-11 09:11:14'),
(279, 109, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-11 09:35:34'),
(280, 109, '3kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 52900.00, 52900.00, '2025-10-11 09:35:34'),
(281, 109, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-11 09:35:34'),
(282, 109, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-11 09:35:34'),
(283, 110, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-11 09:44:23'),
(284, 110, '3kw/24v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 49900.00, 49900.00, '2025-10-11 09:44:23'),
(285, 110, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-11 09:44:23'),
(286, 110, 'Lithium Battery 12V', '', 'piece', 2.00, 16000.00, 32000.00, '2025-10-11 09:44:23'),
(287, 111, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-11 09:52:07'),
(288, 111, '3kw/24v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 49900.00, 49900.00, '2025-10-11 09:52:07'),
(289, 111, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-11 09:52:07'),
(290, 111, 'Lithium Battery 12V', '', 'piece', 2.00, 16000.00, 32000.00, '2025-10-11 09:52:07'),
(291, 112, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-11 10:28:34'),
(292, 112, '5kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 72500.00, 72500.00, '2025-10-11 10:28:34'),
(293, 112, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-11 10:28:34'),
(294, 112, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-11 10:28:34'),
(295, 113, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-11 10:40:28'),
(296, 113, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-11 10:40:28'),
(297, 113, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-11 10:40:28'),
(298, 114, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-11 10:46:00'),
(299, 114, '5kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 72500.00, 72500.00, '2025-10-11 10:46:00'),
(300, 114, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-11 10:46:00'),
(301, 114, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-11 10:46:00'),
(302, 115, 'Structure+Wire Kit 15HP', '', 'piece', 1.00, 265500.00, 265500.00, '2025-10-11 11:25:57'),
(303, 115, '30 HP- VFD INVERTER', '', 'piece', 1.00, 72000.00, 72000.00, '2025-10-11 11:25:57'),
(304, 115, '590WT-PANEL HP', '', 'piece', 45.00, 10620.00, 477900.00, '2025-10-11 11:25:57'),
(305, 116, '590WT-PANEL HP', '', 'piece', 32.00, 10620.00, 339840.00, '2025-10-11 13:49:50'),
(306, 116, '20 HP- VFD INVERTER', '', 'piece', 1.00, 52000.00, 52000.00, '2025-10-11 13:49:50'),
(307, 116, 'Structure+Wire Kit 10HP', '', 'piece', 1.00, 151040.00, 151040.00, '2025-10-11 13:49:50'),
(308, 117, '590WT-PANEL HP', '', 'piece', 32.00, 10620.00, 339840.00, '2025-10-11 14:56:38'),
(309, 117, '20 HP- VFD INVERTER', '', 'piece', 1.00, 52000.00, 52000.00, '2025-10-11 14:56:38'),
(310, 117, 'Structure+Wire Kit 10HP', '', 'piece', 1.00, 151040.00, 151040.00, '2025-10-11 14:56:38'),
(311, 118, 'Non DCR Bifacial Panels 590W', '', 'piece', 20.00, 14750.00, 295000.00, '2025-10-12 08:36:39'),
(312, 118, 'Structure+wire kit 11kw off grid', '', 'piece', 1.00, 129800.00, 129800.00, '2025-10-12 08:36:39'),
(313, 118, 'Lithium Battery 12V', '', 'piece', 15.00, 16000.00, 240000.00, '2025-10-12 08:36:39'),
(314, 118, 'Alpha Pro Inerter 15kw/120v', '', 'piece', 1.00, 155400.00, 155400.00, '2025-10-12 08:36:39'),
(315, 119, 'Structure+Wire Kit 15HP', '', 'piece', 1.00, 265500.00, 265500.00, '2025-10-12 08:38:32'),
(316, 119, '590WT-PANEL HP', '', 'piece', 45.00, 10620.00, 477900.00, '2025-10-12 08:38:32'),
(317, 119, '30 HP- VFD INVERTER', '', 'piece', 1.00, 72000.00, 72000.00, '2025-10-12 08:38:32'),
(318, 120, 'Structure+Wire 4kw ongrid/Hybrid', '', 'set', 1.00, 39200.00, 39200.00, '2025-10-13 07:14:12'),
(319, 120, '550wt DCR TOPCON PANEL', '.', 'piece', 8.00, 21000.00, 168000.00, '2025-10-13 07:14:12'),
(320, 120, '4kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 65160.00, 65160.00, '2025-10-13 07:14:12'),
(321, 120, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-13 07:14:12'),
(322, 121, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-13 10:55:54'),
(323, 121, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-13 10:55:54'),
(324, 121, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-13 10:55:54'),
(325, 122, '590WT-PANEL HP', '', 'piece', 32.00, 10620.00, 339840.00, '2025-10-16 11:16:16'),
(326, 122, '20 HP- VFD INVERTER', '', 'piece', 1.00, 52000.00, 52000.00, '2025-10-16 11:16:16'),
(327, 122, 'Structure+Wire Kit 10HP', '', 'piece', 1.00, 151040.00, 151040.00, '2025-10-16 11:16:16'),
(328, 123, 'Non DCR Bifacial Panels 590W', '', 'piece', 12.00, 14750.00, 177000.00, '2025-10-17 05:50:49'),
(329, 123, 'Alpha Pro Inerter 7.5kw/96v', '', 'piece', 1.00, 52400.00, 52400.00, '2025-10-17 05:50:49'),
(330, 123, 'Structure+wire kit 6kw off grid', '', 'piece', 1.00, 70800.00, 70800.00, '2025-10-17 05:50:49'),
(331, 123, 'Lithium Battery 12V', '', 'piece', 8.00, 16000.00, 128000.00, '2025-10-17 05:50:49'),
(332, 124, 'Ongrid Inverter 5kw', '', 'piece', 1.00, 16500.00, 16500.00, '2025-10-17 11:15:05'),
(333, 124, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-17 11:15:05'),
(334, 124, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-17 11:15:05'),
(335, 125, 'Non DCR Bifacial Panels 590W', '', 'piece', 12.00, 14750.00, 177000.00, '2025-10-21 07:11:22'),
(336, 125, 'Alpha Pro Inerter 7.5kw/96v', '', 'piece', 1.00, 52400.00, 52400.00, '2025-10-21 07:11:22'),
(337, 125, 'Structure+wire kit 6kw off grid', '', 'piece', 1.00, 70800.00, 70800.00, '2025-10-21 07:11:22'),
(338, 125, 'Lithium Battery 12V', '', 'piece', 8.00, 16000.00, 128000.00, '2025-10-21 07:11:22'),
(339, 126, '590WT-PANEL HP', '', 'piece', 16.00, 10620.00, 169920.00, '2025-10-21 07:14:53'),
(340, 126, '10 HP- VFD INVERTER', '', 'piece', 1.00, 30000.00, 30000.00, '2025-10-21 07:14:53'),
(341, 126, 'Structure+Wire Kit 5HP', '', 'piece', 1.00, 75520.00, 75520.00, '2025-10-21 07:14:53'),
(342, 126, 'DCD BOX', '', 'piece', 1.00, 10000.00, 10000.00, '2025-10-21 07:14:53'),
(343, 127, 'Non DCR Bifacial Panels 590W', '', 'piece', 10.00, 14750.00, 147500.00, '2025-10-21 10:09:45'),
(344, 127, 'Alpha Pro Inerter 5kww/48v', '', 'piece', 1.00, 24500.00, 24500.00, '2025-10-21 10:09:45'),
(345, 127, 'Structure+wire kit 5kw off grid', '', 'piece', 1.00, 59000.00, 59000.00, '2025-10-21 10:09:45'),
(346, 127, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-21 10:09:45'),
(347, 128, '590WT-PANEL HP', '', 'piece', 16.00, 10620.00, 169920.00, '2025-10-21 10:15:58'),
(348, 128, '10 HP- VFD INVERTER', '', 'piece', 1.00, 30000.00, 30000.00, '2025-10-21 10:15:58'),
(349, 128, 'Structure+Wire Kit 5HP', '', 'piece', 1.00, 75520.00, 75520.00, '2025-10-21 10:15:58'),
(350, 128, 'DCD BOX', '', 'piece', 1.00, 10000.00, 10000.00, '2025-10-21 10:15:58'),
(351, 129, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-21 10:27:06'),
(352, 129, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-21 10:27:06'),
(353, 129, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-21 10:27:06'),
(354, 130, 'Structure+wire kit 10kw ongrid/hybrid', '', 'piece', 1.00, 85600.00, 85600.00, '2025-10-23 11:20:20'),
(355, 130, '550wt DCR TOPCON PANEL', '.', 'piece', 20.00, 21000.00, 420000.00, '2025-10-23 11:20:20'),
(356, 130, '10kw Ongrid inverter', '', 'piece', 1.00, 80000.00, 80000.00, '2025-10-23 11:20:20'),
(357, 131, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-25 12:41:46'),
(358, 131, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-25 12:41:46'),
(359, 131, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-25 12:41:46'),
(360, 132, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-29 08:29:55'),
(361, 132, 'Ongrid Inverter 3kw', '', 'piece', 1.00, 31900.00, 31900.00, '2025-10-29 08:29:55'),
(362, 132, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-29 08:29:55'),
(363, 135, 'Ongrid Inverter 5kw', '', 'piece', 1.00, 16500.00, 16500.00, '2025-10-31 06:56:18'),
(364, 135, 'Structure+wire 5kw ongrid/Hybrid', '', 'set', 1.00, 42800.00, 42800.00, '2025-10-31 06:56:18'),
(365, 135, '550wt DCR TOPCON PANEL', '.', 'piece', 10.00, 21000.00, 210000.00, '2025-10-31 06:56:18'),
(366, 136, '3kw/48v Sigma Pro Hybrid Inverter', '', 'piece', 1.00, 52900.00, 52900.00, '2025-10-31 08:17:16'),
(367, 136, '550wt DCR TOPCON PANEL', '.', 'piece', 6.00, 21000.00, 126000.00, '2025-10-31 08:17:16'),
(368, 136, 'Structure+Kit 3kw ongrid/Hybrid', '', 'piece', 1.00, 25680.00, 25680.00, '2025-10-31 08:17:16'),
(369, 136, 'Lithium Battery 12V', '', 'piece', 4.00, 16000.00, 64000.00, '2025-10-31 08:17:16');

-- --------------------------------------------------------

--
-- Table structure for table `sectors`
--

CREATE TABLE `sectors` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sectors`
--

INSERT INTO `sectors` (`id`, `name`, `description`, `created_at`) VALUES
(101, 'Residential Solar', 'Solar rooftop systems for houses, apartments, and housing societies to reduce electricity bills.', '2025-09-18 10:45:12'),
(102, 'Commercial Solar', 'Solar installations for shops, offices, schools, hospitals, and other commercial buildings.', '2025-09-18 10:45:12');

-- --------------------------------------------------------

--
-- Table structure for table `solar_packages`
--

CREATE TABLE `solar_packages` (
  `id` int(11) NOT NULL,
  `system_type_id` int(11) DEFAULT NULL,
  `sector_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `capacity_kw` decimal(10,2) DEFAULT NULL,
  `panel_count` int(11) DEFAULT NULL,
  `panel_wattage` int(11) DEFAULT NULL,
  `panel_type` enum('DCR','Non-DCR') DEFAULT NULL,
  `hp_system` decimal(10,2) DEFAULT NULL,
  `inverter_type` varchar(100) DEFAULT NULL,
  `battery_capacity_kwh` decimal(10,2) DEFAULT NULL,
  `base_price` decimal(12,2) NOT NULL,
  `installation_cost` decimal(12,2) DEFAULT 0.00,
  `other_costs` decimal(12,2) DEFAULT 0.00,
  `warranty_years` int(11) DEFAULT 25,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `solar_packages`
--

INSERT INTO `solar_packages` (`id`, `system_type_id`, `sector_id`, `name`, `description`, `capacity_kw`, `panel_count`, `panel_wattage`, `panel_type`, `hp_system`, `inverter_type`, `battery_capacity_kwh`, `base_price`, `installation_cost`, `other_costs`, `warranty_years`, `is_active`, `created_at`, `updated_at`) VALUES
(305, 140, 101, '3.3 kW On-Grid Solar DCR 4.4 HP for Residential Solar', '', 3.30, 6, 550, 'DCR', 4.40, '', 0.00, 183580.00, 6420.00, 0.00, 25, 1, '2025-09-25 10:20:32', '2025-09-25 10:20:32'),
(307, 140, 101, '4.4 kW On-Grid Solar DCR 5.9 HP for Residential Solar', '', 4.40, 8, 550, 'DCR', 5.90, '', 5.00, 246400.00, 3600.00, 0.00, 25, 1, '2025-09-25 10:26:54', '2025-09-25 10:26:54'),
(308, 140, 101, '5.5 kW On-Grid Solar DCR 7.4 HP for Residential Solar', '', 5.50, 10, 550, 'DCR', 7.40, '', 0.00, 269300.00, 10700.00, 0.00, 25, 1, '2025-09-25 10:29:02', '2025-09-25 10:29:02'),
(309, 140, 101, '6.6 kW On-Grid Solar DCR 8.9 HP for Residential Solar', '', 6.60, 12, 550, 'DCR', 8.90, '', 0.00, 372160.00, 12840.00, 0.00, 25, 1, '2025-09-25 10:33:09', '2025-09-25 10:33:09'),
(310, 140, 101, '7.7 kW On-Grid Solar DCR 10.3 HP for Residential Solar', '', 7.70, 14, 550, 'DCR', 10.30, '', 0.00, 423020.00, 14980.00, 0.00, 25, 1, '2025-09-25 10:34:24', '2025-09-25 10:34:24'),
(311, 140, 101, '8.8 kW On-Grid Solar DCR 11.8 HP for Residential Solar', '', 8.80, 16, 550, 'DCR', 11.80, '', 0.00, 492880.00, 17120.00, 0.00, 25, 1, '2025-09-25 10:36:04', '2025-09-25 10:36:04'),
(312, 140, 101, '11 kW On-Grid Solar DCR 14.8 HP for Residential Solar', '', 11.00, 20, 550, 'DCR', 14.80, '', 0.00, 585600.00, 29400.00, 0.00, 25, 1, '2025-09-25 10:39:50', '2025-09-25 10:39:50'),
(313, 142, 101, '2.2 kW Hybrid Solar DCR 3 HP for Residential Solar', '', 2.20, 4, 550, 'DCR', 3.00, '', 0.00, 230720.00, 4280.00, 0.00, 25, 1, '2025-09-25 10:48:59', '2025-09-25 10:48:59'),
(314, 142, 101, '2.2 kW Hybrid Solar DCR 3 HP for Residential Solar', '', 2.20, 550, 4, 'DCR', 3.00, '', 0.00, 230720.00, 4280.00, 0.00, 25, 1, '2025-09-27 06:55:51', '2025-09-27 06:55:51'),
(315, 142, 101, '3.3 kW Hybrid Solar DCR 4.4 HP for Residential Solar', '', 3.30, 6, 550, 'DCR', 4.40, '', 0.00, 233580.00, 6420.00, 0.00, 25, 1, '2025-09-27 06:58:10', '2025-09-27 06:58:10'),
(316, 142, 101, '3.3 kW Hybrid Solar DCR 4.4 HP for Residential Solar', '', 3.30, 6, 550, 'DCR', 4.40, '', 0.00, 268580.00, 6420.00, 0.00, 25, 1, '2025-09-27 07:01:58', '2025-09-27 07:01:58'),
(317, 142, 101, '3.3 kW Hybrid Solar DCR 4.4 HP for Residential Solar', '', 3.30, 6, 550, 'DCR', 4.40, '', 0.00, 268580.00, 6420.00, 0.00, 25, 1, '2025-09-27 07:01:58', '2025-09-27 07:01:58'),
(318, 142, 101, '4.4 kW Hybrid Solar DCR 5.9 HP for Residential Solar', '', 4.40, 8, 550, 'DCR', 5.90, '', 0.00, 336360.00, 3640.00, 0.00, 25, 1, '2025-09-27 07:10:23', '2025-09-27 07:10:23'),
(319, 142, 101, '4.4 kW Hybrid Solar DCR 5.9 HP for Residential Solar', '', 4.40, 8, 550, 'DCR', 5.90, '', 0.00, 336360.00, 3640.00, 0.00, 25, 1, '2025-09-27 07:10:23', '2025-09-27 07:10:23'),
(320, 142, 101, '5.5 kW Hybrid Solar DCR 7.4 HP for Residential Solar', '', 5.50, 10, 550, 'DCR', 7.40, '', 0.00, 389300.00, 10700.00, 0.00, 25, 1, '2025-09-27 07:15:06', '2025-09-27 07:15:06'),
(321, 142, 101, '6.6 kW Hybrid Solar DCR 8.9 HP for Residential Solar', '', 6.60, 12, 550, 'DCR', 8.90, '', 0.00, 526916.00, 17084.00, 0.00, 25, 1, '2025-09-27 07:26:23', '2025-09-27 07:26:23'),
(322, 142, 101, '7.7 kW Hybrid Solar DCR 10.3 HP for Residential Solar', '', 7.70, 14, 550, 'DCR', 10.30, '', 0.00, 577420.00, 20580.00, 0.00, 25, 1, '2025-09-27 07:34:20', '2025-09-27 07:34:20'),
(323, 142, 101, '7.7 kW Hybrid Solar DCR 10.3 HP for Residential Solar', '', 7.70, 14, 550, 'DCR', 10.30, '', 0.00, 577420.00, 20580.00, 0.00, 25, 1, '2025-09-27 07:34:20', '2025-09-27 07:34:20'),
(324, 142, 101, '8.8 kW Hybrid Solar DCR 11.8 HP for Residential Solar', '', 8.80, 16, 550, 'DCR', 11.80, '', 0.00, 662480.00, 17520.00, 0.00, 25, 1, '2025-09-27 07:39:42', '2025-09-27 07:39:42'),
(325, 142, 101, '11 kW Hybrid Solar DCR 14.8 HP for Residential Solar', '', 11.00, 20, 550, 'DCR', 14.80, '', 0.00, 785600.00, 14400.00, 0.00, 25, 1, '2025-09-27 08:01:36', '2025-09-27 08:01:36'),
(326, 141, 102, '3.5 kW Off-Grid Solar Non-DCR 4.7 HP for Commercial Solar', '', 3.50, 6, 590, 'Non-DCR', 4.70, '', 0.00, 190000.00, 0.00, 0.00, 25, 1, '2025-09-28 09:00:24', '2025-09-28 09:00:24'),
(327, 141, 102, '4.7 kW Off-Grid Solar Non-DCR 6.3 HP for Commercial Solar', '', 4.70, 8, 590, 'Non-DCR', 6.30, '', 0.00, 250000.00, 0.00, 0.00, 25, 1, '2025-09-28 09:06:07', '2025-09-28 09:06:07'),
(328, 141, 102, '5.9 kW Off-Grid Solar Non-DCR 7.9 HP for Commercial Solar', '', 5.90, 10, 590, 'Non-DCR', 7.90, '', 0.00, 295000.00, 0.00, 0.00, 25, 1, '2025-09-28 09:08:14', '2025-09-28 09:08:14'),
(329, 141, 102, '5.9 kW Off-Grid Solar Non-DCR 7.9 HP for Commercial Solar', '', 5.90, 10, 590, 'Non-DCR', 7.90, '', 0.00, 295000.00, 0.00, 0.00, 25, 1, '2025-09-28 09:08:14', '2025-09-28 09:08:14'),
(330, 141, 102, '7.1 kW Off-Grid Solar Non-DCR 9.5 HP for Commercial Solar', '', 7.10, 12, 590, 'Non-DCR', 9.50, '', 0.00, 428200.00, 0.00, 0.00, 25, 1, '2025-09-28 09:10:31', '2025-09-28 09:10:31'),
(331, 141, 102, '8.3 kW Off-Grid Solar Non-DCR 11.1 HP for Commercial Solar', '', 8.30, 14, 590, 'Non-DCR', 11.10, '', 0.00, 469500.00, 0.00, 0.00, 25, 1, '2025-09-28 09:13:43', '2025-09-28 09:13:43'),
(332, 141, 102, '9.4 kW Off-Grid Solar Non-DCR 12.7 HP for Commercial Solar', '', 9.40, 16, 590, 'Non-DCR', 12.70, '', 0.00, 539500.00, 0.00, 0.00, 25, 1, '2025-09-28 09:17:42', '2025-09-28 09:17:42'),
(333, 141, 102, '11.8 kW Off-Grid Solar Non-DCR 15.8 HP for Commercial Solar', '', 11.80, 20, 590, 'Non-DCR', 15.80, '', 0.00, 641300.00, 0.00, 0.00, 25, 1, '2025-09-28 09:20:33', '2025-09-28 09:20:33'),
(334, 141, 102, '11.6 kW Off-Grid Solar Non-DCR 15.6 HP for Commercial Solar', '', 11.60, 20, 580, 'Non-DCR', 15.60, '', 0.00, 820200.00, 0.00, 0.00, 25, 1, '2025-09-28 09:22:58', '2025-09-28 09:22:58'),
(335, 141, 102, '13 kW Off-Grid Solar Non-DCR 17.4 HP for Commercial Solar', '', 13.00, 22, 590, 'Non-DCR', 17.40, '', 0.00, 861500.00, 0.00, 0.00, 25, 1, '2025-09-28 09:30:00', '2025-09-28 09:30:00'),
(336, 141, 102, '14.2 kW Off-Grid Solar Non-DCR 19 HP for Commercial Solar', '', 14.20, 24, 590, 'Non-DCR', 19.00, '', 0.00, 932300.00, 0.00, 0.00, 25, 1, '2025-09-28 09:32:19', '2025-09-28 09:32:19'),
(337, 141, 102, '16.5 kW Off-Grid Solar Non-DCR 22.2 HP for Commercial Solar', '', 16.50, 28, 590, 'Non-DCR', 22.20, '', 0.00, 914600.00, 10000.00, 0.00, 25, 1, '2025-09-28 09:36:11', '2025-09-28 09:36:11'),
(338, 141, 102, '17.7 kW Off-Grid Solar Non-DCR 23.7 HP for Commercial Solar', '', 17.70, 30, 590, 'Non-DCR', 23.70, '', 0.00, 990850.00, 0.00, 0.00, 25, 1, '2025-09-28 09:38:14', '2025-09-28 09:38:14'),
(339, 150, 102, '9.4 kW Atta Chakki Non-DCR 12.7 HP for Commercial Solar', '', 9.40, 16, 590, 'Non-DCR', 12.70, '', 0.00, 285440.00, 0.00, 0.00, 25, 1, '2025-10-09 15:28:19', '2025-10-09 15:28:19'),
(340, 150, 102, '18.9 kW Atta Chakki Non-DCR 25.3 HP for Commercial Solar', '', 18.90, 32, 590, 'Non-DCR', 25.30, '', 0.00, 542880.00, 0.00, 0.00, 25, 1, '2025-10-09 15:31:54', '2025-10-09 15:31:54'),
(341, 150, 102, '26.6 kW Atta Chakki Non-DCR 35.6 HP for Commercial Solar', '', 26.60, 45, 590, 'Non-DCR', 35.60, '', 0.00, 815400.00, 0.00, 0.00, 25, 1, '2025-10-09 15:36:32', '2025-10-09 15:36:32'),
(342, 150, 102, '26.6 kW Atta Chakki Non-DCR 35.6 HP for Commercial Solar', '', 26.60, 45, 590, 'Non-DCR', 35.60, '', 0.00, 815400.00, 0.00, 0.00, 25, 1, '2025-10-09 15:36:32', '2025-10-09 15:36:32'),
(343, 150, 102, '35.4 kW Atta Chakki Non-DCR 47.5 HP for Commercial Solar', '', 35.40, 60, 590, 'Non-DCR', 47.50, '', 0.00, 1086200.00, 0.00, 0.00, 25, 1, '2025-10-09 15:39:44', '2025-10-09 15:39:44');

-- --------------------------------------------------------

--
-- Table structure for table `system_types`
--

CREATE TABLE `system_types` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `system_types`
--

INSERT INTO `system_types` (`id`, `name`, `description`, `created_at`) VALUES
(140, 'On-Grid Solar', 'Grid-tied solar system without batteries, excess power is exported to the grid.', '2025-09-18 10:45:35'),
(141, 'Off-Grid Solar', 'Standalone solar system with battery backup, suitable for remote and rural areas.', '2025-09-18 10:45:35'),
(142, 'Hybrid Solar', 'Combination of solar with grid and batteries, ensures uninterrupted power supply.', '2025-09-18 10:45:35'),
(150, 'Atta Chakki', 'Atta Chakki', '2025-09-29 07:56:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_content_templates`
--
ALTER TABLE `ai_content_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `system_type_id` (`system_type_id`),
  ADD KEY `sector_id` (`sector_id`);

--
-- Indexes for table `ai_product_content`
--
ALTER TABLE `ai_product_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_id` (`product_id`),
  ADD KEY `idx_language` (`language`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `ai_quotation_content`
--
ALTER TABLE `ai_quotation_content`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_quotation` (`quotation_id`),
  ADD KEY `idx_quotation_id` (`quotation_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_clients_email` (`email`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_companies_vendor_code` (`vendor_code`),
  ADD KEY `idx_companies_gst_number` (`gst_number`);

--
-- Indexes for table `package_components`
--
ALTER TABLE `package_components`
  ADD PRIMARY KEY (`id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `package_items`
--
ALTER TABLE `package_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `package_id` (`package_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_brands`
--
ALTER TABLE `product_brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `quotations`
--
ALTER TABLE `quotations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `quotation_number` (`quotation_number`),
  ADD KEY `package_id` (`package_id`),
  ADD KEY `idx_quotations_client` (`client_id`),
  ADD KEY `idx_quotations_status` (`status`),
  ADD KEY `idx_quotations_date` (`created_at`);

--
-- Indexes for table `quotation_content`
--
ALTER TABLE `quotation_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quotation_id` (`quotation_id`);

--
-- Indexes for table `quotation_items`
--
ALTER TABLE `quotation_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quotation_id` (`quotation_id`);

--
-- Indexes for table `quote_items`
--
ALTER TABLE `quote_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quotation_id` (`quotation_id`);

--
-- Indexes for table `sectors`
--
ALTER TABLE `sectors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `solar_packages`
--
ALTER TABLE `solar_packages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sector_id` (`sector_id`),
  ADD KEY `idx_packages_system_type` (`system_type_id`),
  ADD KEY `idx_packages_active` (`is_active`);

--
-- Indexes for table `system_types`
--
ALTER TABLE `system_types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_content_templates`
--
ALTER TABLE `ai_content_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ai_product_content`
--
ALTER TABLE `ai_product_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ai_quotation_content`
--
ALTER TABLE `ai_quotation_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `package_components`
--
ALTER TABLE `package_components`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `package_items`
--
ALTER TABLE `package_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2077;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=799;

--
-- AUTO_INCREMENT for table `product_brands`
--
ALTER TABLE `product_brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=334;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=210;

--
-- AUTO_INCREMENT for table `quotations`
--
ALTER TABLE `quotations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT for table `quotation_content`
--
ALTER TABLE `quotation_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quotation_items`
--
ALTER TABLE `quotation_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quote_items`
--
ALTER TABLE `quote_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=370;

--
-- AUTO_INCREMENT for table `sectors`
--
ALTER TABLE `sectors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `solar_packages`
--
ALTER TABLE `solar_packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=344;

--
-- AUTO_INCREMENT for table `system_types`
--
ALTER TABLE `system_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_content_templates`
--
ALTER TABLE `ai_content_templates`
  ADD CONSTRAINT `ai_content_templates_ibfk_1` FOREIGN KEY (`system_type_id`) REFERENCES `system_types` (`id`),
  ADD CONSTRAINT `ai_content_templates_ibfk_2` FOREIGN KEY (`sector_id`) REFERENCES `sectors` (`id`);

--
-- Constraints for table `ai_product_content`
--
ALTER TABLE `ai_product_content`
  ADD CONSTRAINT `ai_product_content_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ai_quotation_content`
--
ALTER TABLE `ai_quotation_content`
  ADD CONSTRAINT `ai_quotation_content_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `package_components`
--
ALTER TABLE `package_components`
  ADD CONSTRAINT `package_components_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `solar_packages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `package_items`
--
ALTER TABLE `package_items`
  ADD CONSTRAINT `package_items_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `solar_packages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `package_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `quotations`
--
ALTER TABLE `quotations`
  ADD CONSTRAINT `quotations_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `quotations_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `solar_packages` (`id`);

--
-- Constraints for table `quotation_content`
--
ALTER TABLE `quotation_content`
  ADD CONSTRAINT `quotation_content_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quotation_items`
--
ALTER TABLE `quotation_items`
  ADD CONSTRAINT `quotation_items_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quote_items`
--
ALTER TABLE `quote_items`
  ADD CONSTRAINT `quote_items_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `solar_packages`
--
ALTER TABLE `solar_packages`
  ADD CONSTRAINT `solar_packages_ibfk_1` FOREIGN KEY (`system_type_id`) REFERENCES `system_types` (`id`),
  ADD CONSTRAINT `solar_packages_ibfk_2` FOREIGN KEY (`sector_id`) REFERENCES `sectors` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
