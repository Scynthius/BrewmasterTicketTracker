-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 04, 2020 at 05:00 PM
-- Server version: 10.4.13-MariaDB-log
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_frymanj`
--

-- --------------------------------------------------------

--
-- Table structure for table `Assignments`
--
DROP TABLE IF EXISTS Assignments, BusinessTypes, Categories, Clients, ClientTypes, Employees, Tickets;
CREATE TABLE `Assignments` (
  `AssignmentID` int(11) NOT NULL,
  `EmployeeID` int(11) NOT NULL,
  `TicketID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Assignments`
--

INSERT INTO `Assignments` (`AssignmentID`, `EmployeeID`, `TicketID`) VALUES
(2, 4, 2),
(3, 5, 3),
(4, 6, 3),
(5, 3, 4),
(6, 2, 4),
(7, 1, 4),
(8, 1, 2),
(12, 7, 2),
(18, 1, 3),
(58, 5, 16),
(59, 2, 16),
(60, 4, 16);

-- --------------------------------------------------------

--
-- Table structure for table `BusinessTypes`
--

CREATE TABLE `BusinessTypes` (
  `TypeID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `CreatedDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `BusinessTypes`
--

INSERT INTO `BusinessTypes` (`TypeID`, `Name`, `CreatedDate`) VALUES
(1, 'Brewery', '2020-06-30'),
(2, 'Retailer', '2020-06-30'),
(3, 'Distributor', '2020-06-30'),
(4, 'Taphouse', '2020-08-03');

-- --------------------------------------------------------

--
-- Table structure for table `Categories`
--

CREATE TABLE `Categories` (
  `CategoryID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `CreatedDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Categories`
--

INSERT INTO `Categories` (`CategoryID`, `Name`, `CreatedDate`) VALUES
(1, 'Mishandled Product', '2020-07-19'),
(2, 'Incorrect Shipment', '2020-07-19'),
(4, 'New Product Request', '2020-07-01'),
(5, 'Late Shipment', '2020-07-01'),
(6, 'Order Modification', '2020-07-01'),
(7, 'a', '2020-07-23'),
(8, 'Missing Product', '2020-07-28');

-- --------------------------------------------------------

--
-- Table structure for table `Clients`
--

CREATE TABLE `Clients` (
  `ClientID` int(11) NOT NULL,
  `ClientName` varchar(255) NOT NULL,
  `PrimaryContact` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Phone` varchar(14) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Clients`
--

INSERT INTO `Clients` (`ClientID`, `ClientName`, `PrimaryContact`, `Email`, `Phone`) VALUES
(1, 'Betty\'s Brewhaus', 'Betty Bard', 'betty@bettysbrewhaus.com', '555-444-3333'),
(2, 'Last Whistle Brewing', 'Mike Hunt', 'mike.hunt@lastwhistle.com', '555-253-1212'),
(3, 'Steel Beam Brewing', 'Jerry Smith', 'picklerick@steelbeam.com', '555-253-9455'),
(4, 'Dominion Beverage Co', 'Tom Green', 'greent@dominion.com', '555-221-2343'),
(5, 'Bertie Botts Every Flavor Beer', 'Carl Sugarplum', 'urawzrd@bbotts.com', '555-233-5555'),
(6, 'Bluegrass Beverage Barn', 'Ben Price', 'ben.price@bbbarn.com', '555-555-1111'),
(7, 'Barrage Fermentary', 'Margaret Lewis', 'mlewis@barrage.com', '555-121-5554'),
(8, 'The Hop of the Hour Brewing Company', 'Henrietta Thompson', 'thompsh@hophour.com', '555-253-4324'),
(11, 'Frewn\'s Brews', 'Aebard Frewn', 'aebard@frewns.com', '(555) 123-4567'),
(12, 'The Half-Shell Pizza and Beer', 'Leonardo', 'leo@turtlepower.com', '(555) 147-4992');

-- --------------------------------------------------------

--
-- Table structure for table `ClientTypes`
--

CREATE TABLE `ClientTypes` (
  `DescriptorID` int(11) NOT NULL,
  `ClientID` int(11) NOT NULL,
  `TypeID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ClientTypes`
--

INSERT INTO `ClientTypes` (`DescriptorID`, `ClientID`, `TypeID`) VALUES
(25, 6, 2),
(26, 6, 3),
(27, 2, 1),
(28, 3, 1),
(29, 4, 1),
(30, 4, 3),
(31, 5, 1),
(32, 7, 1),
(33, 5, 2),
(34, 7, 2),
(35, 8, 1),
(36, 8, 2),
(37, 1, 1),
(38, 11, 2),
(39, 11, 3),
(40, 11, 1),
(41, 12, 2),
(42, 12, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Employees`
--

CREATE TABLE `Employees` (
  `EmployeeID` int(11) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `AccessLevel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Employees`
--

INSERT INTO `Employees` (`EmployeeID`, `FirstName`, `LastName`, `Email`, `AccessLevel`) VALUES
(1, 'Jonathan', 'Spears', 'jon.spears@brewmasters.com', 1),
(2, 'Sarah', 'Brown', 'sarah.brown@brewmasters.com', 1),
(3, 'Erin', 'Potts', 'erin.potts@brewmasters.com', 2),
(4, 'Jing', 'Yu', 'jing.yu@brewmasters.com', 2),
(5, 'Thomas', 'Cobbler', 'thomas.cobbler@brewmasters.com', 3),
(6, 'Georgia', 'Young', 'georgia.young@brewmasters.com', 3),
(7, 'Jon', 'Brown', 'fdsafd@fdaf.com', 2),
(8, 'Phillip', 'Fry', 'phillip.fry@brewmasters.com', 2);

-- --------------------------------------------------------

--
-- Table structure for table `Tickets`
--

CREATE TABLE `Tickets` (
  `TicketID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` longtext NOT NULL,
  `ClientID` int(11) NOT NULL,
  `CategoryID` int(11) NOT NULL,
  `Status` varchar(255) NOT NULL,
  `SubmitDate` date NOT NULL,
  `ModifiedDate` date DEFAULT NULL,
  `CloseDate` date DEFAULT NULL,
  `Resolution` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Tickets`
--

INSERT INTO `Tickets` (`TicketID`, `Title`, `Description`, `ClientID`, `CategoryID`, `Status`, `SubmitDate`, `ModifiedDate`, `CloseDate`, `Resolution`) VALUES
(1, 'New product - Two Hearted', 'Client has requested a shipment of Two Hearted Beer from Bells Brewery.', 6, 4, 'Assigned', '2020-07-01', '2020-07-28', NULL, ''),
(2, 'Late Shipment to Last Whistle', 'A shipment was delayed and arrived 2 days late. Partial refund is requested.', 2, 5, 'Assigned', '2020-03-21', '2020-07-28', '0000-00-00', ''),
(3, 'Damaged Product - Barrage Fermentary', 'A case of RockBuster Ale arrived with 10 broken bottles. Inspection of the packaging seems to indicate forklift damage. Refund for the damaged products plus replacement is requested.', 7, 1, 'Assigned', '2020-04-15', NULL, NULL, NULL),
(4, 'Excess items in shipment - Steel Beam', 'Client received an additional case of LeafLover Pilsner with their monthly order.', 3, 2, 'Closed', '2020-02-28', '2020-03-15', '2020-07-24', 'Client shipped the excess product back to our local distribution facility and was refunded the shipping and handling.'),
(11, 'New Product - Spotted Cow', 'Client wants 4 cases of New Glarus Spotted Cow added to regular order.', 6, 4, 'Unassigned', '2020-07-28', NULL, NULL, NULL),
(16, 'New Test Ticket', 'This is a new Test Ticket', 12, 1, 'Assigned', '2020-07-28', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Assignments`
--
ALTER TABLE `Assignments`
  ADD PRIMARY KEY (`AssignmentID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `TicketID` (`TicketID`);

--
-- Indexes for table `BusinessTypes`
--
ALTER TABLE `BusinessTypes`
  ADD PRIMARY KEY (`TypeID`);

--
-- Indexes for table `Categories`
--
ALTER TABLE `Categories`
  ADD PRIMARY KEY (`CategoryID`),
  ADD UNIQUE KEY `Name` (`Name`);

--
-- Indexes for table `Clients`
--
ALTER TABLE `Clients`
  ADD PRIMARY KEY (`ClientID`);

--
-- Indexes for table `ClientTypes`
--
ALTER TABLE `ClientTypes`
  ADD PRIMARY KEY (`DescriptorID`),
  ADD KEY `ClientID` (`ClientID`),
  ADD KEY `TypeID` (`TypeID`);

--
-- Indexes for table `Employees`
--
ALTER TABLE `Employees`
  ADD PRIMARY KEY (`EmployeeID`),
  ADD UNIQUE KEY `FirstName` (`FirstName`,`LastName`);

--
-- Indexes for table `Tickets`
--
ALTER TABLE `Tickets`
  ADD PRIMARY KEY (`TicketID`),
  ADD KEY `ClientID` (`ClientID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Assignments`
--
ALTER TABLE `Assignments`
  MODIFY `AssignmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `BusinessTypes`
--
ALTER TABLE `BusinessTypes`
  MODIFY `TypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Categories`
--
ALTER TABLE `Categories`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Clients`
--
ALTER TABLE `Clients`
  MODIFY `ClientID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `ClientTypes`
--
ALTER TABLE `ClientTypes`
  MODIFY `DescriptorID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `Employees`
--
ALTER TABLE `Employees`
  MODIFY `EmployeeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Tickets`
--
ALTER TABLE `Tickets`
  MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Assignments`
--
ALTER TABLE `Assignments`
  ADD CONSTRAINT `Assignments_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `Employees` (`EmployeeID`),
  ADD CONSTRAINT `Assignments_ibfk_2` FOREIGN KEY (`TicketID`) REFERENCES `Tickets` (`TicketID`);

--
-- Constraints for table `ClientTypes`
--
ALTER TABLE `ClientTypes`
  ADD CONSTRAINT `ClientTypes_ibfk_1` FOREIGN KEY (`ClientID`) REFERENCES `Clients` (`ClientID`),
  ADD CONSTRAINT `ClientTypes_ibfk_2` FOREIGN KEY (`TypeID`) REFERENCES `BusinessTypes` (`TypeID`);

--
-- Constraints for table `Tickets`
--
ALTER TABLE `Tickets`
  ADD CONSTRAINT `Tickets_ibfk_1` FOREIGN KEY (`ClientID`) REFERENCES `Clients` (`ClientID`),
  ADD CONSTRAINT `Tickets_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `Categories` (`CategoryID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
