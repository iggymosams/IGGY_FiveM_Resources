CREATE TABLE IF NOT EXISTS `iggy_laptop_handle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `handle` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `handle` (`handle`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;