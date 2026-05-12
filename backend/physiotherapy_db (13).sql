-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2026 at 04:09 PM
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
-- Database: `physiotherapy_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointement`
--

CREATE TABLE `appointement` (
  `idBooking` int(11) NOT NULL,
  `idpatient` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idAvailability` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','accepted','rejected','completed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointement`
--

INSERT INTO `appointement` (`idBooking`, `idpatient`, `idUser`, `idAvailability`, `created_at`, `status`) VALUES
(30, 12, 2, 66, '2026-05-01 03:33:04', 'accepted'),
(31, 12, 15, 69, '2026-05-01 04:00:33', 'rejected'),
(32, 14, 2, 77, '2026-05-01 14:20:53', 'accepted'),
(33, 16, 2, 79, '2026-05-01 14:22:03', 'accepted'),
(34, 15, 2, 82, '2026-05-08 08:59:38', 'rejected'),
(35, 13, 2, 96, '2026-05-09 05:37:55', 'rejected'),
(36, 13, 2, 97, '2026-05-09 05:42:50', 'rejected'),
(37, 13, 2, 97, '2026-05-09 06:20:32', 'rejected'),
(38, 15, 2, 105, '2026-05-12 09:27:51', 'accepted'),
(39, 13, 2, 106, '2026-05-12 09:46:21', 'accepted');

-- --------------------------------------------------------

--
-- Table structure for table `availability`
--

CREATE TABLE `availability` (
  `idAvailability` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `available_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('available','booked','unavailable') DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `availability`
--

INSERT INTO `availability` (`idAvailability`, `idUser`, `available_date`, `start_time`, `end_time`, `status`) VALUES
(34, 2, '2026-04-12', '11:00:00', '00:00:00', 'booked'),
(35, 2, '2026-04-12', '12:00:00', '00:00:00', 'booked'),
(44, 2, '2026-04-12', '09:00:00', '00:00:00', 'booked'),
(45, 2, '2026-04-13', '09:00:00', '00:00:00', 'booked'),
(46, 2, '2026-04-13', '10:00:00', '00:00:00', 'booked'),
(47, 2, '2026-04-13', '11:00:00', '00:00:00', 'booked'),
(48, 2, '2026-04-13', '12:00:00', '00:00:00', 'booked'),
(49, 2, '2026-04-13', '13:00:00', '00:00:00', 'booked'),
(50, 2, '2026-04-13', '14:00:00', '00:00:00', 'booked'),
(51, 2, '2026-04-27', '09:00:00', '00:00:00', 'booked'),
(52, 2, '2026-04-27', '10:00:00', '00:00:00', 'booked'),
(53, 2, '2026-04-27', '12:00:00', '00:00:00', 'available'),
(54, 2, '2026-04-27', '11:00:00', '00:00:00', 'available'),
(55, 2, '2026-04-27', '13:00:00', '00:00:00', 'available'),
(56, 2, '2026-04-28', '09:00:00', '00:00:00', 'booked'),
(57, 2, '2026-04-28', '10:00:00', '00:00:00', 'available'),
(58, 2, '2026-04-28', '11:00:00', '00:00:00', 'available'),
(59, 2, '2026-04-28', '12:00:00', '00:00:00', 'available'),
(60, 2, '2026-04-30', '09:00:00', '00:00:00', 'available'),
(61, 2, '2026-04-30', '10:00:00', '00:00:00', 'available'),
(62, 2, '2026-04-30', '11:00:00', '00:00:00', 'available'),
(63, 2, '2026-04-30', '12:00:00', '00:00:00', 'available'),
(64, 2, '2026-04-30', '13:00:00', '00:00:00', 'available'),
(66, 2, '2026-05-01', '11:00:00', '00:00:00', 'booked'),
(67, 15, '2026-04-30', '09:00:00', '00:00:00', 'booked'),
(68, 15, '2026-04-30', '10:00:00', '00:00:00', 'available'),
(69, 15, '2026-05-01', '09:00:00', '00:00:00', 'booked'),
(70, 15, '2026-05-01', '10:00:00', '00:00:00', 'available'),
(71, 15, '2026-05-01', '11:00:00', '00:00:00', 'available'),
(72, 15, '2026-05-01', '12:00:00', '00:00:00', 'available'),
(77, 2, '2026-05-01', '09:00:00', '00:00:00', 'booked'),
(79, 2, '2026-05-01', '09:30:00', '00:00:00', 'booked'),
(82, 2, '2026-05-08', '09:00:00', '00:00:00', 'booked'),
(83, 2, '2026-05-08', '09:30:00', '00:00:00', 'available'),
(84, 2, '2026-05-08', '10:00:00', '00:00:00', 'available'),
(85, 2, '2026-05-08', '10:30:00', '00:00:00', 'available'),
(86, 2, '2026-05-08', '11:30:00', '00:00:00', 'available'),
(87, 2, '2026-05-08', '11:00:00', '00:00:00', 'available'),
(88, 2, '2026-05-08', '12:00:00', '00:00:00', 'available'),
(89, 2, '2026-05-08', '12:30:00', '00:00:00', 'available'),
(90, 2, '2026-05-08', '13:00:00', '00:00:00', 'available'),
(91, 2, '2026-05-08', '13:30:00', '00:00:00', 'available'),
(92, 2, '2026-05-08', '14:00:00', '00:00:00', 'available'),
(93, 2, '2026-05-08', '14:30:00', '00:00:00', 'available'),
(94, 2, '2026-05-08', '15:00:00', '00:00:00', 'available'),
(95, 2, '2026-05-08', '15:30:00', '00:00:00', 'available'),
(96, 2, '2026-05-09', '09:00:00', '00:00:00', 'booked'),
(97, 2, '2026-05-09', '09:30:00', '00:00:00', 'available'),
(98, 2, '2026-05-09', '10:00:00', '00:00:00', 'available'),
(99, 2, '2026-05-09', '11:00:00', '00:00:00', 'available'),
(100, 2, '2026-05-09', '10:30:00', '00:00:00', 'available'),
(101, 2, '2026-05-09', '11:30:00', '00:00:00', 'available'),
(102, 2, '2026-05-09', '12:00:00', '00:00:00', 'available'),
(103, 2, '2026-05-09', '12:30:00', '00:00:00', 'available'),
(104, 2, '2026-05-09', '13:00:00', '00:00:00', 'available'),
(105, 2, '2026-05-12', '09:00:00', '00:00:00', 'booked'),
(106, 2, '2026-05-12', '09:30:00', '00:00:00', 'booked'),
(107, 2, '2026-05-12', '10:00:00', '00:00:00', 'available'),
(108, 2, '2026-05-12', '10:30:00', '00:00:00', 'available'),
(109, 2, '2026-05-12', '11:00:00', '00:00:00', 'available'),
(110, 2, '2026-05-12', '11:30:00', '00:00:00', 'available'),
(111, 2, '2026-05-12', '12:00:00', '00:00:00', 'available'),
(112, 2, '2026-05-12', '12:30:00', '00:00:00', 'available'),
(113, 2, '2026-05-11', '09:00:00', '00:00:00', 'available');

-- --------------------------------------------------------

--
-- Table structure for table `biomedical`
--

CREATE TABLE `biomedical` (
  `idbiomedical` int(11) NOT NULL,
  `idengineer` int(11) NOT NULL,
  `idphysiotherapist` int(11) DEFAULT NULL,
  `idpatient` int(11) NOT NULL,
  `biomedicaltestID` int(11) DEFAULT NULL,
  `visitdate` date NOT NULL,
  `testvalue` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `biomedicaltests`
--

CREATE TABLE `biomedicaltests` (
  `biomedicalTestsID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `biomedicaltests`
--

INSERT INTO `biomedicaltests` (`biomedicalTestsID`, `name`, `description`) VALUES
(1, '', 'EMG'),
(2, '', 'EEG'),
(3, '', 'ECG');

-- --------------------------------------------------------

--
-- Table structure for table `biomedical_files`
--

CREATE TABLE `biomedical_files` (
  `idfile` int(11) NOT NULL,
  `idbiomedical` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `filetype` enum('csv','image') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collaborations`
--

CREATE TABLE `collaborations` (
  `id_Biomedical_Engineer` int(11) NOT NULL,
  `id_Physiotherapist` int(11) NOT NULL,
  `start_date` date DEFAULT NULL,
  `Note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `collaborations`
--

INSERT INTO `collaborations` (`id_Biomedical_Engineer`, `id_Physiotherapist`, `start_date`, `Note`) VALUES
(3, 12, NULL, NULL),
(7, 2, NULL, NULL),
(13, 15, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `diagnostic`
--

CREATE TABLE `diagnostic` (
  `idDiagnostic` int(11) NOT NULL,
  `idpatient` int(11) NOT NULL,
  `diagnosis_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_diagnosed` date DEFAULT NULL,
  `idBooking` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `diagnostic`
--

INSERT INTO `diagnostic` (`idDiagnostic`, `idpatient`, `diagnosis_name`, `description`, `date_diagnosed`, `idBooking`) VALUES
(1, 13, 'ffdsd', 'fjksadfbjkhsdagujkd', '2026-04-29', 39);

-- --------------------------------------------------------

--
-- Table structure for table `evaluation`
--

CREATE TABLE `evaluation` (
  `id` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idpatient` int(11) NOT NULL,
  `rating` int(1) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluation`
--

INSERT INTO `evaluation` (`id`, `idUser`, `idpatient`, `rating`, `comment`, `created_at`) VALUES
(13, 2, 12, 4, 'good', '2026-05-09 07:40:21'),
(14, 2, 14, 5, 'good', '2026-05-09 09:17:40');

-- --------------------------------------------------------

--
-- Table structure for table `experiences`
--

CREATE TABLE `experiences` (
  `idExperience` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `experiences`
--

INSERT INTO `experiences` (`idExperience`, `idUser`, `title`, `company`, `start_date`, `end_date`, `description`) VALUES
(1, 2, 'back pain physiotherapist', 'beirut clinic', '2026-04-21', '2026-05-08', 'i worked on bones'),
(2, 2, 'sport injury', 'sport clinic', '2023-05-09', '2026-04-22', 'i fix many broken legs');

-- --------------------------------------------------------

--
-- Table structure for table `injury`
--

CREATE TABLE `injury` (
  `injury_id` int(11) NOT NULL,
  `idpatient` int(11) NOT NULL,
  `injury_name` varchar(255) NOT NULL,
  `injury_date` date NOT NULL,
  `Details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `injury`
--

INSERT INTO `injury` (`injury_id`, `idpatient`, `injury_name`, `injury_date`, `Details`) VALUES
(1, 12, 'on my back', '2026-03-30', NULL),
(3, 15, 'back broke', '2026-03-29', NULL),
(4, 12, 'in my leg', '2026-04-01', NULL),
(5, 12, 'ds', '2025-02-21', NULL),
(6, 12, 'back', '2026-04-08', NULL),
(7, 12, 'sds', '2026-04-08', NULL),
(8, 12, 'dss', '2026-04-22', NULL),
(9, 12, 'ds', '2026-04-28', NULL),
(10, 12, 'sas', '2026-04-21', NULL),
(11, 14, 'ds', '2026-04-28', NULL),
(12, 16, 'wd', '0000-00-00', NULL),
(13, 15, 'dsd', '2026-04-28', 'dsddsdzx'),
(17, 15, 'dsds', '2026-05-05', 'dsdhjksadgyjihuhsagdjhkasdbghjdfvgbasdhjfgbdashj'),
(18, 13, 'f sdanmfkjhsda', '2026-05-06', 'fasdnjkfhgdsauiktfhguiksdfjghfukjsdfg');

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `idInvoice` int(11) NOT NULL,
  `idBooking` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 120.00,
  `payment_method` enum('online','in-clinic') NOT NULL,
  `payment_status` enum('pending','paid') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`idInvoice`, `idBooking`, `amount`, `payment_method`, `payment_status`, `created_at`) VALUES
(28, 30, 120.00, 'in-clinic', 'pending', '2026-05-01 03:33:04'),
(29, 31, 120.00, 'in-clinic', 'pending', '2026-05-01 04:00:33'),
(30, 32, 120.00, 'in-clinic', 'pending', '2026-05-01 14:20:53'),
(31, 33, 120.00, 'in-clinic', 'pending', '2026-05-01 14:22:03'),
(32, 34, 120.00, 'online', 'paid', '2026-05-08 08:59:38'),
(33, 35, 120.00, 'in-clinic', 'pending', '2026-05-09 05:37:55'),
(34, 36, 200.00, 'in-clinic', 'pending', '2026-05-09 05:42:50'),
(35, 37, 200.00, 'in-clinic', 'pending', '2026-05-09 06:20:32'),
(36, 38, 100.00, 'in-clinic', 'pending', '2026-05-12 09:27:51'),
(37, 39, 100.00, 'in-clinic', 'pending', '2026-05-12 09:46:21');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_used`
--

CREATE TABLE `item_used` (
  `usage_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `idpatient` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `birthdate` date NOT NULL,
  `sexe` tinyint(4) NOT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`idpatient`, `name`, `birthdate`, `sexe`, `password`) VALUES
(1, 'sami baroudi', '2024-02-10', 1, NULL),
(7, 'hadi', '2026-02-08', 1, NULL),
(9, 'mohammad abdallah', '2005-02-09', 1, NULL),
(10, 'Mohamad Khalil', '2026-04-09', 1, '$2b$10$NYPAoA2peyiqW9jJQc0hZOvIYYFKG6qBBTyW7BNqnkZ8G185wVLOm'),
(11, 'mhd', '2026-04-01', 1, '$2b$10$gc8gFRZ6IMuBIWsFP3m2/eCTGLlkfJMMiIqKZpbo6VwgHxXmwax1W'),
(12, 'mohamad', '2026-04-01', 2, '$2b$10$2LMOSSpA5fwUOYohiC4InOqNIZ8wcqYOUo1PO0ERnFHLc2E1FTt0u'),
(13, 'khaled', '2026-04-01', 1, '$2b$10$aXwaaA/UumeayOCRQr.M8.46OpuiPpWbmPazIIeM3scSCl0z0yJ8i'),
(14, 'Dima', '2006-05-25', 2, '$2b$10$Wb4eL6jM2A7farvzc/bqtu9yqc3eilGUCesHjWITZXtSxUiAAAT1W'),
(15, 'kousay', '2026-02-16', 1, '$2b$10$gApW9ikCTImgomx8Jp0zk.biv3S9qZBRceBYvUCb6bqeOA3KdbOs.'),
(16, 'zelem', '2026-04-22', 1, '$2b$10$bPMhMES8iet9eG34Pyt81O9fiPc5HJt0Rf4k0vy/XVt4Esb32ciAa'),
(18, '123', '2026-04-28', 1, '$2b$10$n.cFDAK7EUYkHqO5g/.9m.gdo0aXyH42cspbwxRvMBnsiQZ137DSG');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `pay_id` int(11) NOT NULL,
  `idInvoice` int(11) DEFAULT NULL,
  `pay_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `physio_services`
--

CREATE TABLE `physio_services` (
  `idUser` int(11) NOT NULL,
  `idService` int(11) NOT NULL,
  `price` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `physio_services`
--

INSERT INTO `physio_services` (`idUser`, `idService`, `price`) VALUES
(2, 1, 100.00),
(2, 2, 200.00);

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `idProfile` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `bio` text DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`idProfile`, `idUser`, `bio`, `experience`, `image`, `rating`) VALUES
(121, 2, 'good', '2', '1778314002864-486881124.jpg', 4.50);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `idService` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `subDesc` varchar(255) DEFAULT NULL,
  `icon` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`idService`, `title`, `description`, `subDesc`, `icon`) VALUES
(1, 'Back Pain Relief', 'Targeted therapies for spinal and lumbar pain...', 'Relief & physical maneuvers...', '👤'),
(2, 'Sports Injury Rehab', 'Performance-focused programs for athletes...', 'Injury rehab for all...', '🏃'),
(3, 'Post-surgery Care', 'Personalized rehab plans after joint...', 'Post-surgery care for...', '🩹'),
(4, 'Orthopedic Therapy', 'Specialized care for musculoskeletal...', 'Specialized orthopedic...', '🦴');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `idsession` int(11) NOT NULL,
  `idphysiotherapist` int(11) NOT NULL,
  `idpatient` int(11) NOT NULL,
  `sessiondate` date NOT NULL,
  `test` varchar(200) NOT NULL,
  `protocol` varchar(300) NOT NULL,
  `remark` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`idsession`, `idphysiotherapist`, `idpatient`, `sessiondate`, `test`, `protocol`, `remark`) VALUES
(4, 2, 1, '2026-02-17', 'mmm', 'fdsf', 'dss'),
(5, 2, 1, '2026-02-17', 'csfsad', 'dsa', 'csadsa'),
(6, 2, 1, '2026-02-17', 'fdsf', 'cxz', 'fgretretret'),
(8, 2, 1, '2026-02-17', 'iiii', 'iiii', 'iiii'),
(10, 2, 6, '2026-02-18', 'xsadsa', 'dsad', 'xzcxz'),
(11, 11, 9, '2026-03-06', 'good muscles', 'all good', 'he is doing better'),
(15, 2, 14, '2026-04-13', 'dsd', 'ds', 'dsd'),
(16, 2, 14, '2026-04-13', 'dwd', 'sdw', '2dsd'),
(18, 2, 15, '2026-04-13', 'ds', 'dsds', 'dsds'),
(20, 2, 12, '2026-05-01', 'dd', 'sd', 'ds'),
(21, 2, 13, '2026-05-12', 'ds', 'ds', 'ds');

-- --------------------------------------------------------

--
-- Table structure for table `session_videos`
--

CREATE TABLE `session_videos` (
  `idvideo` int(11) NOT NULL,
  `idsession` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session_videos`
--

INSERT INTO `session_videos` (`idvideo`, `idsession`, `filename`) VALUES
(7, 4, '1771326098448-424147605.mp4'),
(8, 5, '1771326477080-217723696.mov'),
(9, 6, '1771326968666-212322553.mov'),
(12, 8, '1771406102473-83150340.mp4'),
(13, 8, '1771406103070-268901795.mp4'),
(16, 10, '1771446101887-40276873.mp4');

-- --------------------------------------------------------

--
-- Table structure for table `training`
--

CREATE TABLE `training` (
  `train_id` int(11) NOT NULL,
  `idsession` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sets` int(11) NOT NULL,
  `reps` varchar(50) NOT NULL,
  `frequency` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `assigned_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training`
--

INSERT INTO `training` (`train_id`, `idsession`, `name`, `sets`, `reps`, `frequency`, `image`, `assigned_date`) VALUES
(1, 20, 'Cat-Camel Stretch', 3, '12', 'Daily, Morning and Evening', 'cat_camel_stretch.jpg', '2026-05-12'),
(2, 20, 'Pelvic Tilts', 3, '15', 'Daily', 'pelvic_tilts.jpg', '2026-05-12');

-- --------------------------------------------------------

--
-- Table structure for table `treatment_plan`
--

CREATE TABLE `treatment_plan` (
  `idPlan` int(11) NOT NULL,
  `idpatient` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `plan_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','completed','cancelled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `treatment_plan`
--

INSERT INTO `treatment_plan` (`idPlan`, `idpatient`, `idUser`, `plan_name`, `description`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(1, 12, 2, 'mhd plan', 'he have a bone break and bla bla bla so we should sdsds', '2026-05-14', '2026-05-30', '', '2026-05-12 09:12:51'),
(2, 13, 2, 'dsdsad', 'fasdqfsad', '2026-05-12', '2026-05-18', '', '2026-05-12 10:03:35');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
  `fullname` varchar(200) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `email` varchar(200) NOT NULL,
  `telephone` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`idUser`, `fullname`, `birthdate`, `email`, `telephone`, `username`, `password`, `role`) VALUES
(2, 'mohamad halime', NULL, 'm@ul', '03124523', 'mohamad halimeh', '$2b$10$JjiEGJaUfy1o9o5di3aLfeJWxSlt2xDwlsk5gwtOjPZQdVlNLCw7i', 'physiotherapist'),
(3, 'ahmad diab', NULL, 'a@edsr', '1212', 'ahmad', '$2b$10$qfPmYUGfzRLQ5bs8BcXPVempCZmtLj1flCfC/HozY7Mjdk.rE/F2i', 'biomedical_engineer'),
(4, 'Mohamad Khalil', NULL, 'mohamad.khalil@ul.edu.lb', '123456', 'Mohamad Khalil', '$2b$10$UNSBAtSn4sUjKReQwBbIIOmb4vC5TY1nDsGOP41y9blA9L9vBx.NW', 'admin'),
(6, 'mirna', NULL, 'm@edst', '3213', 'mirna', '$2b$10$nGK1wkxYVXhjcVBD4XntHup8PxVHmRY.guyXzvSWR/XDHG5BZcZ2C', 'physiotherapist'),
(7, 'nadim', NULL, 'n@edst', '43243', 'nadim', '$2b$10$R3uB/eIagzSGxTUZXS1nleb2z9NAhFM3q2oZL9u8Scrzq5Bepn.Dy', 'biomedical_engineer'),
(10, 'mhd', NULL, 'dsds@ds', '43', 'mhd', '$2b$10$Ux0mTs.8yu29dECP0mNF/eH1swrnOp0pdyeHq7unD5EZblaVCVxRG', 'biomedical_engineer'),
(12, 'Mohammad', NULL, 'dsds@dsds.com', '2321', 'ziyad', '$2b$10$VrQjbDpWLj3YP..7R32rSOE2sin02fs2tjBAQHfmNGBqyk3hHzD3u', 'physiotherapist'),
(13, 'kamel', NULL, 'dsds@dsds.ds', '2323', 'kamel', '$2b$10$kyHXmN.kCkaU9YKJ7EcLBu7yzVn9P2t0eK5nhHaWB8H/Z5TC/zYRe', 'biomedical_engineer'),
(14, 'admin', NULL, 'dsds@dsds', 'ds', 'admin', '$2b$10$PnEHx/iV07OD3kWX9X.xNef1FF2CRtCf.F0RzHYUzMWRL4NEnZeJC', 'admin'),
(15, 'Abd', NULL, 'sds@ds', '70323223', 'abd', '$2b$10$ky3cBA7jik2jTOHTcCPOT.b8u30iwAghStGxStqQzXsF90aeLLieu', 'physiotherapist');

-- --------------------------------------------------------

--
-- Table structure for table `users_roles`
--

CREATE TABLE `users_roles` (
  `id` int(11) NOT NULL,
  `description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visit`
--

CREATE TABLE `visit` (
  `id_visit` int(11) NOT NULL,
  `idpatient` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `visit_date` datetime NOT NULL DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointement`
--
ALTER TABLE `appointement`
  ADD PRIMARY KEY (`idBooking`),
  ADD KEY `idpatient` (`idpatient`),
  ADD KEY `idUser` (`idUser`),
  ADD KEY `idAvailability` (`idAvailability`);

--
-- Indexes for table `availability`
--
ALTER TABLE `availability`
  ADD PRIMARY KEY (`idAvailability`),
  ADD UNIQUE KEY `user_time_slot` (`idUser`,`available_date`,`start_time`),
  ADD UNIQUE KEY `unique_booking_slot` (`idUser`,`available_date`,`start_time`);

--
-- Indexes for table `biomedical`
--
ALTER TABLE `biomedical`
  ADD PRIMARY KEY (`idbiomedical`),
  ADD KEY `idengineer` (`idengineer`),
  ADD KEY `idphysiotherapist` (`idphysiotherapist`),
  ADD KEY `idpatient` (`idpatient`),
  ADD KEY `fk_biomedical_test` (`biomedicaltestID`);

--
-- Indexes for table `biomedicaltests`
--
ALTER TABLE `biomedicaltests`
  ADD PRIMARY KEY (`biomedicalTestsID`);

--
-- Indexes for table `biomedical_files`
--
ALTER TABLE `biomedical_files`
  ADD PRIMARY KEY (`idfile`),
  ADD KEY `idbiomedical` (`idbiomedical`);

--
-- Indexes for table `collaborations`
--
ALTER TABLE `collaborations`
  ADD PRIMARY KEY (`id_Biomedical_Engineer`,`id_Physiotherapist`),
  ADD KEY `fk_collab_physio` (`id_Physiotherapist`);

--
-- Indexes for table `diagnostic`
--
ALTER TABLE `diagnostic`
  ADD PRIMARY KEY (`idDiagnostic`),
  ADD KEY `fk_diagnostic_patient` (`idpatient`),
  ADD KEY `fk_diagnostic_booking` (`idBooking`);

--
-- Indexes for table `evaluation`
--
ALTER TABLE `evaluation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rating` (`idUser`,`idpatient`),
  ADD KEY `fk_eval_patient` (`idpatient`);

--
-- Indexes for table `experiences`
--
ALTER TABLE `experiences`
  ADD PRIMARY KEY (`idExperience`),
  ADD KEY `fk_experience_user` (`idUser`);

--
-- Indexes for table `injury`
--
ALTER TABLE `injury`
  ADD PRIMARY KEY (`injury_id`),
  ADD KEY `idpatient` (`idpatient`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`idInvoice`),
  ADD KEY `fk_invoice_booking` (`idBooking`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `item_used`
--
ALTER TABLE `item_used`
  ADD PRIMARY KEY (`usage_id`),
  ADD KEY `fk_usage_item` (`item_id`),
  ADD KEY `fk_usage_session` (`session_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`idpatient`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`pay_id`),
  ADD KEY `fk_payment_invoice` (`idInvoice`);

--
-- Indexes for table `physio_services`
--
ALTER TABLE `physio_services`
  ADD PRIMARY KEY (`idUser`,`idService`),
  ADD KEY `idService` (`idService`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`idProfile`),
  ADD UNIQUE KEY `unique_user_profile` (`idUser`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`idService`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`idsession`);

--
-- Indexes for table `session_videos`
--
ALTER TABLE `session_videos`
  ADD PRIMARY KEY (`idvideo`),
  ADD KEY `idsession` (`idsession`);

--
-- Indexes for table `training`
--
ALTER TABLE `training`
  ADD PRIMARY KEY (`train_id`),
  ADD KEY `fk_training_session` (`idsession`);

--
-- Indexes for table `treatment_plan`
--
ALTER TABLE `treatment_plan`
  ADD PRIMARY KEY (`idPlan`),
  ADD KEY `fk_plan_patient` (`idpatient`),
  ADD KEY `fk_plan_physio` (`idUser`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`);

--
-- Indexes for table `users_roles`
--
ALTER TABLE `users_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visit`
--
ALTER TABLE `visit`
  ADD PRIMARY KEY (`id_visit`),
  ADD KEY `fk_visit_patient` (`idpatient`),
  ADD KEY `fk_visit_user` (`idUser`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointement`
--
ALTER TABLE `appointement`
  MODIFY `idBooking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `availability`
--
ALTER TABLE `availability`
  MODIFY `idAvailability` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `biomedical`
--
ALTER TABLE `biomedical`
  MODIFY `idbiomedical` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `biomedicaltests`
--
ALTER TABLE `biomedicaltests`
  MODIFY `biomedicalTestsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `biomedical_files`
--
ALTER TABLE `biomedical_files`
  MODIFY `idfile` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `diagnostic`
--
ALTER TABLE `diagnostic`
  MODIFY `idDiagnostic` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `evaluation`
--
ALTER TABLE `evaluation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `experiences`
--
ALTER TABLE `experiences`
  MODIFY `idExperience` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `injury`
--
ALTER TABLE `injury`
  MODIFY `injury_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `idInvoice` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item_used`
--
ALTER TABLE `item_used`
  MODIFY `usage_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `idpatient` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `pay_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `idProfile` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `idService` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `idsession` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `session_videos`
--
ALTER TABLE `session_videos`
  MODIFY `idvideo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `training`
--
ALTER TABLE `training`
  MODIFY `train_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `treatment_plan`
--
ALTER TABLE `treatment_plan`
  MODIFY `idPlan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users_roles`
--
ALTER TABLE `users_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `visit`
--
ALTER TABLE `visit`
  MODIFY `id_visit` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointement`
--
ALTER TABLE `appointement`
  ADD CONSTRAINT `appointement_ibfk_1` FOREIGN KEY (`idpatient`) REFERENCES `patients` (`idpatient`),
  ADD CONSTRAINT `appointement_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`),
  ADD CONSTRAINT `appointement_ibfk_3` FOREIGN KEY (`idAvailability`) REFERENCES `availability` (`idAvailability`);

--
-- Constraints for table `availability`
--
ALTER TABLE `availability`
  ADD CONSTRAINT `availability_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`);

--
-- Constraints for table `biomedical`
--
ALTER TABLE `biomedical`
  ADD CONSTRAINT `biomedical_ibfk_1` FOREIGN KEY (`idengineer`) REFERENCES `users` (`idUser`),
  ADD CONSTRAINT `biomedical_ibfk_2` FOREIGN KEY (`idphysiotherapist`) REFERENCES `users` (`idUser`),
  ADD CONSTRAINT `biomedical_ibfk_3` FOREIGN KEY (`idpatient`) REFERENCES `patients` (`idpatient`),
  ADD CONSTRAINT `fk_biomedical_test` FOREIGN KEY (`biomedicaltestID`) REFERENCES `biomedicaltests` (`biomedicalTestsID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `biomedical_files`
--
ALTER TABLE `biomedical_files`
  ADD CONSTRAINT `biomedical_files_ibfk_1` FOREIGN KEY (`idbiomedical`) REFERENCES `biomedical` (`idbiomedical`);

--
-- Constraints for table `collaborations`
--
ALTER TABLE `collaborations`
  ADD CONSTRAINT `fk_collab_engineer` FOREIGN KEY (`id_Biomedical_Engineer`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_collab_physio` FOREIGN KEY (`id_Physiotherapist`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `diagnostic`
--
ALTER TABLE `diagnostic`
  ADD CONSTRAINT `fk_diagnostic_booking` FOREIGN KEY (`idBooking`) REFERENCES `appointement` (`idBooking`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_diagnostic_patient` FOREIGN KEY (`idpatient`) REFERENCES `patients` (`idpatient`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `evaluation`
--
ALTER TABLE `evaluation`
  ADD CONSTRAINT `fk_eval_patient` FOREIGN KEY (`idpatient`) REFERENCES `patients` (`idpatient`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_eval_physio` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Constraints for table `experiences`
--
ALTER TABLE `experiences`
  ADD CONSTRAINT `fk_experience_user` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `injury`
--
ALTER TABLE `injury`
  ADD CONSTRAINT `fk_injury_patient` FOREIGN KEY (`idpatient`) REFERENCES `patients` (`idpatient`) ON DELETE CASCADE;

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `fk_invoice_booking` FOREIGN KEY (`idBooking`) REFERENCES `appointement` (`idBooking`) ON DELETE CASCADE;

--
-- Constraints for table `item_used`
--
ALTER TABLE `item_used`
  ADD CONSTRAINT `fk_usage_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_usage_session` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`idsession`) ON DELETE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_payment_invoice` FOREIGN KEY (`idInvoice`) REFERENCES `invoice` (`idInvoice`) ON DELETE SET NULL;

--
-- Constraints for table `physio_services`
--
ALTER TABLE `physio_services`
  ADD CONSTRAINT `physio_services_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`),
  ADD CONSTRAINT `physio_services_ibfk_2` FOREIGN KEY (`idService`) REFERENCES `services` (`idService`) ON DELETE CASCADE;

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `fk_profile_user` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`);

--
-- Constraints for table `session_videos`
--
ALTER TABLE `session_videos`
  ADD CONSTRAINT `session_videos_ibfk_1` FOREIGN KEY (`idsession`) REFERENCES `sessions` (`idsession`) ON DELETE CASCADE;

--
-- Constraints for table `training`
--
ALTER TABLE `training`
  ADD CONSTRAINT `fk_training_session` FOREIGN KEY (`idsession`) REFERENCES `sessions` (`idsession`) ON DELETE CASCADE;

--
-- Constraints for table `treatment_plan`
--
ALTER TABLE `treatment_plan`
  ADD CONSTRAINT `fk_plan_patient` FOREIGN KEY (`idpatient`) REFERENCES `patients` (`idpatient`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_plan_physio` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Constraints for table `visit`
--
ALTER TABLE `visit`
  ADD CONSTRAINT `fk_visit_patient` FOREIGN KEY (`idpatient`) REFERENCES `patients` (`idpatient`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_visit_user` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
