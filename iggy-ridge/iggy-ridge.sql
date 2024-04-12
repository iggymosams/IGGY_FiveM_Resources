CREATE TABLE IF NOT EXISTS `iggy_ridge_website` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL UNIQUE,
  `title` text NOT NULL,
  `template` text NOT NULL,
  `data` JSON,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

