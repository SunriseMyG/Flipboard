CREATE TABLE IF NOT EXISTS `favorite` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `author` varchar(255) NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` text NOT NULL,
    `content` text NOT NULL,
    `url` varchar(255) NOT NULL,
    `urlToImage` varchar(255) NOT NULL,
    `published_at` datetime NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;