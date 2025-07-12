CREATE TABLE IF NOT EXISTS users (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(250) UNIQUE NOT NULL,
    `password` CHAR(60) NOT NULL,
    PRIMARY KEY (`user_id`)
);