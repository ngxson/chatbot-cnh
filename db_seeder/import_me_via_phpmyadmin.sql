-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 14, 2017 at 04:47 AM
-- Server version: 5.7.19-0ubuntu0.16.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatbotdebug`
--

-- --------------------------------------------------------

--
-- Table structure for table `chatroom`
--

CREATE TABLE `chatroom` (
  `id1` bigint(20) NOT NULL,
  `id2` bigint(20) NOT NULL,
  `starttime` bigint(20) DEFAULT NULL,
  `char1` int(11) NOT NULL,
  `msg1` int(11) NOT NULL,
  `char2` int(11) NOT NULL,
  `msg2` int(11) NOT NULL,
  `genderok` tinyint(1) NOT NULL,
  `gamemode` bigint(20) NOT NULL DEFAULT '0',
  `gamedata` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `chatroom`
--

-- --------------------------------------------------------

--
-- Table structure for table `gender`
--

CREATE TABLE `gender` (
  `uid` bigint(20) NOT NULL,
  `gender` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `gender`
--

-- --------------------------------------------------------

--
-- Table structure for table `userdata`
--

CREATE TABLE `userdata` (
  `id` bigint(20) DEFAULT NULL,
  `tkb` varchar(20) DEFAULT NULL,
  `tkbsub` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `userdata`
--

-- --------------------------------------------------------

--
-- Table structure for table `waitroom`
--

CREATE TABLE `waitroom` (
  `uid` bigint(20) NOT NULL,
  `gender` int(11) NOT NULL,
  `time` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chatroom`
--
ALTER TABLE `chatroom`
  ADD UNIQUE KEY `id1` (`id1`);

--
-- Indexes for table `gender`
--
ALTER TABLE `gender`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `uid` (`uid`),
  ADD UNIQUE KEY `uid_2` (`uid`);

--
-- Indexes for table `userdata`
--
ALTER TABLE `userdata`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `waitroom`
--
ALTER TABLE `waitroom`
  ADD UNIQUE KEY `uid` (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--
