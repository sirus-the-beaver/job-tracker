CREATE TABLE IF NOT EXISTS users (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(250) NOT NULL,
    `email` VARCHAR(250) UNIQUE NOT NULL,
    `password` CHAR(60) NOT NULL,
    PRIMARY KEY (`user_id`)
);