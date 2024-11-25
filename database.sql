CREATE DATABASE visitor_db;
USE visitor_db;

CREATE TABLE visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_name VARCHAR(255) NOT NULL,
    status ENUM('in', 'out') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);