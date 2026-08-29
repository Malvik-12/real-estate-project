-- MySQL dump 10.13  Distrib 9.6.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: real_estate
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '05a4c968-0f09-11f1-897c-08d40fcbd1b5:1-73';

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text,
  `property_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `inquiries_ibfk_1` (`property_id`),
  CONSTRAINT `inquiries_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
INSERT INTO `inquiries` VALUES (5,'Test User','user@example.com','9876543210','This is a test inquiry.',2021,'2026-08-28 16:00:08'),(6,'malvik ','heloo@gmail.com','98123712673123','ascasjfajoaf',2022,'2026-08-29 06:34:36'),(7,'malvik','asdasda@gmail.com','asdasdad','asdasdsa',2022,'2026-08-29 06:48:44'),(8,'sadadas','asda@gmail.com','asdasd','asdasdas',2022,'2026-08-29 06:52:39'),(9,'sadadas','asda@gmail.com','asdasd','asdasdas',2022,'2026-08-29 06:58:15');
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(12,2) DEFAULT NULL,
  `image_url` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `type` enum('home','land','forsale') NOT NULL DEFAULT 'home',
  `location` varchar(255) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `beds` int DEFAULT '0',
  `parking` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2023 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (11,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','land','Lubhu','2600sq',4,2),(12,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','land','Lubhu','2600sq',4,2),(15,'Lubhu Home','Very good home',12432131.00,'[\"/uploads/1772882703123.jpg\"]','2026-03-07 11:25:03','home','Lalitpur, Lubhu','4sq',4,1),(16,'Hattiban land','Good Location',134124124.00,'[\"/uploads/1772882851602.jpg\"]',NULL,'land','Chabel','56sq',0,0),(17,'The Weekend','Test ',1234124120.00,'[\"/uploads/1772882919518.jpg\"]','2026-03-07 11:28:39','forsale','Kathmandu','1212sq',5,0),(18,'IMadol Home','Imadol best homw',10000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-03-07 13:36:30','forsale','Imadol','2600sq',4,2),(19,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','land','Lubhu','2600sq',4,2),(20,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','land','Lubhu','2600sq',4,2),(22,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','land','Lubhu','2600sq',4,2),(31,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','home','Lubhu','2600sq',4,2),(32,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','home','Lubhu','2600sq',4,2),(33,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','home','Lubhu','2600sq',4,2),(34,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','home','Lubhu','2600sq',4,2),(35,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','home','Lubhu','2600sq',4,2),(36,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','home','Lubhu','2600sq',4,2),(37,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','forsale','Lubhu','2600sq',4,2),(38,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','forsale','Lubhu','2600sq',4,2),(39,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','forsale','Lubhu','2600sq',4,2),(2021,'Malvik Home','Malvik best home',90000000.00,'[\"/uploads/1772890590347.jpg\"]','2026-08-07 13:36:30','land','Lubhu','2600sq',4,2),(2022,'Very Good Property','This is an excellent property offering a great combination of location, comfort, convenience, and long-term value. Situated in a desirable and accessible area, the property is ideal for families, professionals, investors, or anyone looking for a secure and valuable place to live or invest. The surrounding neighborhood provides a peaceful and pleasant environment while maintaining convenient access to essential facilities and everyday services.\r\n\r\nThe property is well-planned and offers a practical layout designed to provide comfortable living and efficient use of space. The surrounding area is suitable for residential purposes and has good potential for future development and value appreciation. Its convenient location makes transportation and access to nearby schools, markets, hospitals, shopping areas, offices, restaurants, and other important amenities easy and hassle-free.\r\n\r\nOne of the major advantages of this property is its accessibility. The property can be easily reached by road and is located in an area with good connectivity to major roads and nearby communities. The neighborhood is developing steadily, making it an attractive choice for both homeowners and investors. Whether you are planning to build your dream home, purchase a ready-to-use residence, or invest for the future, this property provides a promising opportunity.\r\n\r\nThe property offers excellent potential for buyers who prioritize a good location, peaceful surroundings, accessibility, and future growth. It can serve as a comfortable family home while also providing an opportunity for long-term investment and capital appreciation.\r\n\r\nOverall, this is a very good property with strong potential and multiple advantages. Its combination of location, accessibility, surrounding environment, practical usability, and investment potential makes it a worthwhile option for anyone searching for a quality property. Interested buyers are encouraged to visit the property, inspect the surroundings, and evaluate its many benefits firsthand. This could be the ideal opportunity to secure a valuable property for your present needs and future plans.',900000.00,'[\"/uploads/1787976294861.png\", \"/uploads/1787976294868.png\", \"/uploads/1787976294872.png\", \"/uploads/1787976294873.jpg\", \"/uploads/1787976294874.jpg\"]','2026-08-29 04:04:54','home','Lalitpur','2000Sq',4,2);
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','superadmin') DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-29 12:52:10
