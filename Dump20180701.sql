-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: yogurt
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can add permission',2,'add_permission'),(5,'Can change permission',2,'change_permission'),(6,'Can delete permission',2,'delete_permission'),(7,'Can add group',3,'add_group'),(8,'Can change group',3,'change_group'),(9,'Can delete group',3,'delete_group'),(10,'Can add user',4,'add_user'),(11,'Can change user',4,'change_user'),(12,'Can delete user',4,'delete_user'),(13,'Can add content type',5,'add_contenttype'),(14,'Can change content type',5,'change_contenttype'),(15,'Can delete content type',5,'delete_contenttype'),(16,'Can add session',6,'add_session'),(17,'Can change session',6,'change_session'),(18,'Can delete session',6,'delete_session');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `department` (
  `id` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `group` varchar(45) NOT NULL,
  `mainproject` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES ('AD0000','Administration Department','1',NULL),('FN4012','Finance Department','2',NULL),('HR2210','Human Resources Department','3',NULL),('MK3578','Marketing Department','4',NULL),('OP1101','Operations Department','5',NULL);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2018-06-25 02:19:03.374669'),(2,'auth','0001_initial','2018-06-25 02:19:09.813510'),(3,'admin','0001_initial','2018-06-25 02:19:11.519986'),(4,'admin','0002_logentry_remove_auto_add','2018-06-25 02:19:11.554993'),(5,'contenttypes','0002_remove_content_type_name','2018-06-25 02:19:12.829022'),(6,'auth','0002_alter_permission_name_max_length','2018-06-25 02:19:13.318300'),(7,'auth','0003_alter_user_email_max_length','2018-06-25 02:19:13.396350'),(8,'auth','0004_alter_user_username_opts','2018-06-25 02:19:13.427617'),(9,'auth','0005_alter_user_last_login_null','2018-06-25 02:19:13.861970'),(10,'auth','0006_require_contenttypes_0002','2018-06-25 02:19:13.893252'),(11,'auth','0007_alter_validators_add_error_messages','2018-06-25 02:19:13.938559'),(12,'auth','0008_alter_user_username_max_length','2018-06-25 02:19:14.441658'),(13,'auth','0009_alter_user_last_name_max_length','2018-06-25 02:19:15.152418'),(14,'sessions','0001_initial','2018-06-25 02:19:15.569712');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivelesscar`
--

DROP TABLE IF EXISTS `drivelesscar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `drivelesscar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carid` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL,
  `battery` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivelesscar`
--

LOCK TABLES `drivelesscar` WRITE;
/*!40000 ALTER TABLE `drivelesscar` DISABLE KEYS */;
INSERT INTO `drivelesscar` VALUES (1,'1號','待充電','0%'),(2,'2號','待充電','0%'),(3,'3號','休眠中','100%'),(4,'4號','休眠中','100%'),(5,'5號','待充電','0%'),(6,'6號','待充電','0%'),(7,'7號','休眠中','100%'),(8,'8號','維修中','100%'),(9,'9號','休眠中','100%'),(10,'10號','待充電','0%'),(11,'11號','休眠中','100%');
/*!40000 ALTER TABLE `drivelesscar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employees` (
  `EmployeeID` int(11) NOT NULL AUTO_INCREMENT,
  `LastName` varchar(20) NOT NULL,
  `FirstName` varchar(10) NOT NULL,
  `Title` varchar(30) DEFAULT NULL,
  `TitleOfCourtesy` varchar(25) DEFAULT NULL,
  `BirthDate` datetime DEFAULT NULL,
  `HireDate` datetime DEFAULT NULL,
  `Address` varchar(60) DEFAULT NULL,
  `City` varchar(15) DEFAULT NULL,
  `Region` varchar(15) DEFAULT NULL,
  `PostalCode` varchar(10) DEFAULT NULL,
  `Country` varchar(15) DEFAULT NULL,
  `HomePhone` varchar(24) DEFAULT NULL,
  `Extension` varchar(4) DEFAULT NULL,
  `Photo` varchar(255) DEFAULT NULL,
  `Notes` text,
  `ReportsTo` int(11) DEFAULT NULL,
  `PhotoPath` varchar(255) DEFAULT NULL,
  `Department` varchar(45) DEFAULT NULL,
  `Position` varchar(45) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`EmployeeID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Davolio','Nancy','Sales Representative','Ms.','1948-12-08 00:00:00','1992-05-01 00:00:00','507 - 20th Ave. E. Apt. 2A','Seattle','WA','98122','USA','(206) 555-9857','5467',NULL,'Andrew received his BTS commercial in 1974 and a Ph.D. in international marketing from the University of Dallas in 1981.  He is fluent in French and Italian and reads German.  He joined the company as a sales representative, was promoted to sales manager in January 1992 and to vice president of sales in March 1993.  Andrew is a member of the Sales Management Roundtable, the Seattle Chamber of Commerce, and the Pacific Rim Importers Association.',2,'https://www.presentermedia.com/files/animsp/00015000/15966/office_worker_hard_at_work_anim_md_wm.gif','Marketing','Manager','Davolio@yogurt.com'),(2,'Fuller','Andrew','Vice President, Sales','Dr.','1952-02-19 00:00:00','1992-08-14 00:00:00','908 W. Capital Way','Tacoma','WA','98401','USA','(206) 555-9482','3457',NULL,'Andrew received his BTS commercial in 1974 and a Ph.D. in international marketing from the University of Dallas in 1981.  He is fluent in French and Italian and reads German.  He joined the company as a sales representative, was promoted to sales manager in January 1992 and to vice president of sales in March 1993.  Andrew is a member of the Sales Management Roundtable, the Seattle Chamber of Commerce, and the Pacific Rim Importers Association.',NULL,'https://www.presentermedia.com/files/animsp/00013000/13061/boss_dangling_carrot_for_employee_anim_md_wm.gif',NULL,'CEO','Fuller@yogurt.com'),(3,'Leverling','Janet','Sales Representative','Ms.','1963-08-30 00:00:00','1992-04-01 00:00:00','722 Moss Bay Blvd.','Kirkland','WA','98033','USA','(206) 555-3412','3355',NULL,'Janet has a BS degree in chemistry from Boston College (1984).  She has also completed a certificate program in food retailing management.  Janet was hired as a sales associate in 1991 and promoted to sales representative in February 1992.',2,'https://3.bp.blogspot.com/-O-OysPmGAys/WRHkuWExPVI/AAAAAAAAABc/_tn_OZO71Rwqiv9m247WX7rG1Bxm-WfeQCLcB/s1600/businessman_multi_tasking.gif','Finance','Manager','Leverling@yogurt.com'),(4,'Peacock','Margaret','Sales Representative','Mrs.','1937-09-19 00:00:00','1993-05-03 00:00:00','4110 Old Redmond Rd.','Redmond','WA','98052','USA','(206) 555-8122','5176',NULL,'Margaret holds a BA in English literature from Concordia College (1958) and an MA from the American Institute of Culinary Arts (1966).  She was assigned to the London office temporarily from July through November 1992.',2,'https://www.presentermedia.com/files/animsp/00005000/5432/two_chatting_in_cubicle_md_wm_v2.gif','HRM','Manager','Peacock@yogurt.com'),(5,'Buchana','Steve','Sales Manager','Mr.','1955-03-04 00:00:00','1993-10-17 00:00:00','14 Garrett Hill','London',NULL,'SW1 8JR','UK','(71) 555-4848','3453',NULL,'Steven Buchanan graduated from St. Andrews University, Scotland, with a BSC degree in 1976.  Upon joining the company as a sales representative in 1992, he spent 6 months in an orientation program at the Seattle office and then returned to his permanent post in London.  He was promoted to sales manager in March 1993.  Mr. Buchanan has completed the courses \"Successful Telemarketing\" and \"International Sales Management.\"  He is fluent in French.',2,'https://www.presentermedia.com/files/animsp/00013000/13556/robot_arm_move_objects_md_wm.gif','Operatoins','Manager','Buchana@yogurt.com'),(6,'Suyama','Michael','Sales Representative','Mr.','1963-07-02 00:00:00','1993-10-17 00:00:00','Coventry House Miner Rd.','London',NULL,'EC2 7JR','UK','(71) 555-7773','428',NULL,'Michael is a graduate of Sussex University (MA, economics, 1983) and the University of California at Los Angeles (MBA, marketing, 1986).  He has also taken the courses \"Multi-Cultural Selling\" and \"Time Management for the Sales Professional.\"  He is fluent in Japanese and can read and write French, Portuguese, and Spanish.',5,'https://www.presentermedia.com/files/animsp/00013000/13556/robot_arm_move_objects_md_wm.gif','Operatoins','Operator','Suyama@yogurt.com'),(7,'King','Robert','Sales Representative','Mr.','1960-05-29 00:00:00','1994-01-02 00:00:00','Edgeham Hollow Winchester Way','London',NULL,'RG1 9SP','UK','(71) 555-5598','465',NULL,'Robert King served in the Peace Corps and traveled extensively before completing his degree in English at the University of Michigan in 1992, the year he joined the company.  After completing a course entitled \"Selling in Europe,\" he was transferred to the London office in March 1993.',5,'https://www.presentermedia.com/files/animsp/00013000/13556/robot_arm_move_objects_md_wm.gif','Operatoins','Operator','King@yogurt.com'),(8,'Callaha','Laura','Inside Sales Coordinator','Ms.','1958-01-09 00:00:00','1994-03-05 00:00:00','4726 - 11th Ave. N.E.','Seattle','WA','98105','USA','(206) 555-1189','2344',NULL,'Laura received a BA in psychology from the University of Washington.  She has also completed a course in business French.  She reads and writes French.',2,'https://www.presentermedia.com/files/animsp/00017000/17885/businesswoman_multi_tasking_md_wm_v2.gif',NULL,'Assistant ','Callaha@yogurt.com'),(9,'Dodsworth','Anne','Sales Representative','Ms.','1966-01-27 00:00:00','1994-11-15 00:00:00','7 Houndstooth Rd.','London',NULL,'WG2 7LT','UK','(71) 555-4444','452',NULL,'Anne has a BA degree in English from St. Lawrence College.  She is fluent in French and German.',5,'https://www.presentermedia.com/files/animsp/00013000/13556/robot_arm_move_objects_md_wm.gif','Operatoins','Operator','Dodsworth@yogurt.com');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employeestask`
--

DROP TABLE IF EXISTS `employeestask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employeestask` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employeeid` int(11) NOT NULL,
  `job` varchar(200) DEFAULT NULL,
  `dailyreport` varchar(200) DEFAULT NULL,
  `notes` varchar(200) DEFAULT NULL,
  `enduptime` datetime DEFAULT NULL,
  `employeestaskcol` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employeestask`
--

LOCK TABLES `employeestask` WRITE;
/*!40000 ALTER TABLE `employeestask` DISABLE KEYS */;
INSERT INTO `employeestask` VALUES (1,1,'','與Wos Burger簽下新合同， 供應優格做為其商品之一。',NULL,NULL,NULL),(2,1,'','受到國際貿易戰爭衝擊，部份輸出國家關稅增加。',NULL,NULL,NULL),(3,3,'','美元強勢看漲，建議增家公司現金分配比例。',NULL,NULL,NULL),(4,3,'','國X局正在找我們麻煩，要派特務出動嗎?',NULL,NULL,NULL),(5,4,'','亞太地區的招募計劃大成功，我們獲得了許多新鮮的livers.',NULL,NULL,NULL),(6,5,'','Distco的訂單已完成63%，應能如期交貨。',NULL,NULL,NULL),(7,5,NULL,'Carrefour的訂單已完成95%，應能如期交貨。',NULL,NULL,NULL),(8,5,NULL,'RT-Mart的訂單已完成52%，或能如期交貨。',NULL,NULL,NULL),(9,5,NULL,'廠區產能滿載，搬運人手不足，急需AGVs!!!',NULL,NULL,NULL),(10,1,'穿布偶服去街上發傳單',NULL,NULL,NULL,NULL),(11,1,'做一個觀看人數破百萬的youtube視頻',NULL,NULL,NULL,NULL),(12,1,'這季銷售再下滑全體睡公司',NULL,NULL,NULL,NULL),(13,3,'Save my money!!',NULL,NULL,NULL,NULL),(14,4,'尋找更新鮮的肝',NULL,NULL,NULL,NULL),(15,4,'向大專院校尋求建教合作，獲取勞力',NULL,NULL,NULL,NULL),(16,5,'生產Distco的訂單',NULL,NULL,NULL,NULL),(17,5,'生產Carrefour的訂單',NULL,NULL,NULL,NULL),(18,5,'生產RT-Mart的訂單',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `employeestask` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `OrderID` int(11) NOT NULL AUTO_INCREMENT,
  `CustomerName` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `OrderDate` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ShippedDate` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TotalPrice` int(11) NOT NULL,
  `Complete` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`OrderID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'Costco','06-20','06-26',5400,'完成'),(2,'Carrefour','06-26','06-30',3600,'完成'),(3,'Costco','06-30','07-03',1200,'完成'),(4,'Costco','06-27','06-30',3000,'完成'),(5,'RT-Mart','06-27','06-30',1800,'完成'),(6,'RT-Mart','06-27','07-01',2700,'完成'),(7,'Costco','06-30','07-03',3600,'完成'),(8,'Carrefour','06-27','07-03',9800,'完成'),(9,'Carrefour','06-28','07-03',5200,'完成'),(10,'Costco','06-28','07-02',4600,'完成'),(11,'Carrefour','06-28','07-05',10000,'完成'),(12,'RT-Mart','06-29','07-06',6000,'未完成'),(13,'Costco','06-29','07-06',14000,'未完成');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_detail`
--

DROP TABLE IF EXISTS `orders_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders_detail` (
  `DetailID` int(11) NOT NULL AUTO_INCREMENT,
  `OrderID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `ProductName` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `UnitPrice` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `SubtotalPrice` int(11) NOT NULL,
  `Status` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`DetailID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_detail`
--

LOCK TABLES `orders_detail` WRITE;
/*!40000 ALTER TABLE `orders_detail` DISABLE KEYS */;
INSERT INTO `orders_detail` VALUES (1,1,1,'Origin Yogurt',300,2,600,'Complete'),(2,1,3,'Grape Yogurt',1200,4,4800,'Complete'),(3,2,3,'Grape Yogurt',1200,3,3600,'Complete'),(4,3,3,'Grape Yogurt',1200,1,1200,'Complete'),(5,4,2,'Orange Yogurt',800,3,2400,'Complete'),(6,4,1,'Origin Yogurt',300,2,600,'Complete'),(7,5,1,'Origin Yogurt',300,2,600,'Complete'),(8,5,3,'Grape Yogurt',1200,1,1200,'Complete'),(9,6,2,'Orange Yogurt',800,2,1600,'Canceled'),(10,6,3,'Grape Yogurt',1200,1,1200,'Canceled'),(11,7,1,'Origin Yogurt',300,2,600,'Canceled'),(12,7,2,'Orange Yogurt',800,3,2400,'Complete'),(13,7,3,'Grape Yogurt',1200,1,1200,'Complete'),(14,6,1,'Origin Yogurt',300,1,300,'Complete'),(15,6,2,'Orange Yogurt',800,3,2400,'Complete'),(16,9,2,'Orange Yogurt',800,2,1600,'Complete'),(17,9,3,'Grape Yogurt',1200,3,3600,'Complete'),(18,8,2,'Orange Yogurt',800,10,8000,'Complete'),(19,8,1,'Origin Yogurt',300,6,1800,'Complete'),(20,10,2,'Orange Yogurt',800,2,1600,'Canceled'),(21,10,3,'Grape Yogurt',1200,3,3600,'Canceled'),(22,10,2,'Orange Yogurt',800,2,1600,'Complete'),(23,10,1,'Origin Yogurt',300,10,3000,'Complete'),(24,10,2,'Orange Yogurt',800,10,8000,'Canceled'),(25,11,2,'Orange Yogurt',800,5,4000,'Complete'),(26,11,3,'Grape Yogurt',1200,5,6000,'Complete'),(27,12,3,'Grape Yogurt',1200,5,6000,'onGoing'),(28,13,3,'Grape Yogurt',1200,5,6000,'onGoing'),(29,13,2,'Orange Yogurt',800,10,8000,'onGoing');
/*!40000 ALTER TABLE `orders_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `UnitPrice` int(11) NOT NULL,
  `Amount` int(11) NOT NULL,
  PRIMARY KEY (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Origin Yogurt',300,90),(2,'Orange Yogurt',800,81),(3,'Grape Yogurt',1200,92);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-07-01 22:33:11
