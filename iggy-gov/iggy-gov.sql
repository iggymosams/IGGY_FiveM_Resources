CREATE TABLE IF NOT EXISTS `iggy_gov_state_announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `message` text NOT NULL,
  `date` BIGINT NOT NULL,
  `deletedAt` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `iggy_gov_laws` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` text NOT NULL,
  `title` text NOT NULL,
  `html` LONGTEXT NOT NULL,
  `deletedAt` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;