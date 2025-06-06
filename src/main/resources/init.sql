CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE IF NOT EXISTS books (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入一些示例数据
INSERT INTO books (title, author, isbn, available, description) VALUES
('Java编程思想', 'Bruce Eckel', '9787111213826', true, 'Java编程的经典著作'),
('深入理解Java虚拟机', '周志明', '9787111641247', true, 'JVM原理与优化'),
('算法导论', 'Thomas H. Cormen', '9787111407010', true, '计算机算法的经典教材'); 