### Introduction to MySQL

MySQL is the world's most popular open-source relational database management system (RDBMS). Developed by Oracle Corporation, MySQL is renowned for its reliability, ease of use, and excellent performance. It powers countless web applications, from small projects to enterprise-level systems.

### Why Choose MySQL?

- **Industry Standard**: Used by giants like Facebook, Twitter, YouTube, and WordPress
- **High Performance**: Optimized for speed with query caching and indexing
- **Scalability**: Handles databases ranging from small to petabyte-scale
- **ACID Compliance**: Ensures data integrity with transactional support
- **Cross-Platform**: Runs on Windows, Linux, macOS, and more
- **Rich Ecosystem**: Extensive tools, frameworks, and community support

### Key Features

- **Multiple Storage Engines**: InnoDB (default), MyISAM, Memory, CSV, and more
- **Replication**: Master-slave and master-master replication for high availability
- **Partitioning**: Table partitioning for better performance on large datasets
- **Stored Procedures**: Write complex business logic directly in the database
- **Triggers**: Automatic actions based on database events
- **Full-Text Search**: Built-in full-text indexing and search capabilities
- **JSON Support**: Store and query JSON documents natively
- **Security**: SSL connections, user authentication, and role-based access control

## Installation

### Windows Installation

**Download MySQL Installer:**
```bash
# Visit https://dev.mysql.com/downloads/installer/
# Download MySQL Installer (mysql-installer-community-8.0.x.msi)
# Run the installer and follow the wizard

# Or using Chocolatey:
choco install mysql

# Verify installation
mysql --version
```

**Configure MySQL:**
```bash
# Start MySQL service
net start MySQL

# Secure installation (set root password, remove anonymous users)
mysql_secure_installation
```

### macOS Installation

```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation
mysql_secure_installation

# Connect to MySQL
mysql -u root -p
```

### Linux (Ubuntu/Debian) Installation

```bash
# Update package index
sudo apt update

# Install MySQL Server
sudo apt install mysql-server

# Check MySQL status
sudo systemctl status mysql

# Secure installation
sudo mysql_secure_installation

# Start MySQL service
sudo systemctl start mysql

# Enable MySQL to start on boot
sudo systemctl enable mysql
```

## Getting Started

### Connecting to MySQL

```bash
# Connect as root user
mysql -u root -p

# Connect to specific database
mysql -u username -p database_name

# Connect to remote MySQL server
mysql -h hostname -u username -p database_name
```

### MySQL Workbench (GUI Tool)

```bash
# Download from https://dev.mysql.com/downloads/workbench/
# Or install via package manager:

# Windows
choco install mysql.workbench

# macOS
brew install --cask mysqlworkbench

# Linux
sudo apt install mysql-workbench
```

## Database Operations

### Creating and Managing Databases

```sql
-- Show all databases
SHOW DATABASES;

-- Create a new database
CREATE DATABASE my_database;

-- Create database with character set
CREATE DATABASE my_database 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use a database
USE my_database;

-- Show current database
SELECT DATABASE();

-- Drop database
DROP DATABASE my_database;
```

### Creating Tables

```sql
-- Create a simple table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table with foreign key
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create table with indexes
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    stock INT DEFAULT 0,
    INDEX idx_category (category),
    INDEX idx_price (price)
);
```

### Data Types

```sql
-- Numeric types
INT, BIGINT, SMALLINT, TINYINT          -- Integers
DECIMAL(10,2), NUMERIC(10,2)            -- Fixed-point
FLOAT, DOUBLE                            -- Floating-point

-- String types
CHAR(n)                                  -- Fixed-length
VARCHAR(n)                               -- Variable-length
TEXT, MEDIUMTEXT, LONGTEXT              -- Large text

-- Date and time
DATE                                     -- YYYY-MM-DD
TIME                                     -- HH:MM:SS
DATETIME                                 -- YYYY-MM-DD HH:MM:SS
TIMESTAMP                                -- Unix timestamp
YEAR                                     -- Year value

-- Other types
BOOLEAN                                  -- TRUE/FALSE
ENUM('value1', 'value2')                -- Enumeration
JSON                                     -- JSON documents
BLOB                                     -- Binary data
```

## CRUD Operations

### Insert Data

```sql
-- Insert single row
INSERT INTO users (username, email, password)
VALUES ('john_doe', 'john@example.com', 'hashed_password');

-- Insert multiple rows
INSERT INTO users (username, email, password) VALUES
('jane_smith', 'jane@example.com', 'hashed_password'),
('bob_wilson', 'bob@example.com', 'hashed_password'),
('alice_brown', 'alice@example.com', 'hashed_password');

-- Insert from another table
INSERT INTO archived_users (username, email)
SELECT username, email FROM users WHERE created_at < '2020-01-01';
```

### Select Data

```sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT username, email FROM users;

-- Select with WHERE clause
SELECT * FROM users WHERE username = 'john_doe';

-- Select with multiple conditions
SELECT * FROM users 
WHERE created_at >= '2024-01-01' 
AND email LIKE '%@example.com';

-- Select with ordering
SELECT * FROM users ORDER BY created_at DESC;

-- Select with limit
SELECT * FROM users LIMIT 10;

-- Select with offset (pagination)
SELECT * FROM users LIMIT 10 OFFSET 20;

-- Select distinct values
SELECT DISTINCT category FROM products;

-- Select with aggregation
SELECT COUNT(*) as total_users FROM users;
SELECT AVG(price) as avg_price FROM products;
SELECT SUM(stock) as total_stock FROM products;
SELECT MIN(price), MAX(price) FROM products;
```

### Update Data

```sql
-- Update single row
UPDATE users 
SET email = 'newemail@example.com' 
WHERE username = 'john_doe';

-- Update multiple columns
UPDATE users 
SET username = 'john_smith', email = 'john.smith@example.com'
WHERE id = 1;

-- Update with calculation
UPDATE products 
SET price = price * 1.1 
WHERE category = 'Electronics';

-- Update all rows (be careful!)
UPDATE users SET status = 'active';
```

### Delete Data

```sql
-- Delete specific rows
DELETE FROM users WHERE username = 'john_doe';

-- Delete with multiple conditions
DELETE FROM posts 
WHERE created_at < '2020-01-01' 
AND user_id IS NULL;

-- Delete all rows (be careful!)
DELETE FROM temp_table;

-- Truncate table (faster than DELETE, resets AUTO_INCREMENT)
TRUNCATE TABLE temp_table;
```

## Advanced Queries

### Joins

```sql
-- INNER JOIN (matching records from both tables)
SELECT users.username, posts.title
FROM users
INNER JOIN posts ON users.id = posts.user_id;

-- LEFT JOIN (all from left table, matching from right)
SELECT users.username, posts.title
FROM users
LEFT JOIN posts ON users.id = posts.user_id;

-- RIGHT JOIN (all from right table, matching from left)
SELECT users.username, posts.title
FROM users
RIGHT JOIN posts ON users.id = posts.user_id;

-- Multiple joins
SELECT u.username, p.title, c.comment_text
FROM users u
INNER JOIN posts p ON u.id = p.user_id
LEFT JOIN comments c ON p.id = c.post_id;
```

### Group By and Having

```sql
-- Group by with count
SELECT category, COUNT(*) as product_count
FROM products
GROUP BY category;

-- Group by with average
SELECT category, AVG(price) as avg_price
FROM products
GROUP BY category;

-- Group by with having (filter groups)
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
HAVING count > 10;

-- Multiple aggregations
SELECT 
    category,
    COUNT(*) as total,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products
GROUP BY category;
```

### Subqueries

```sql
-- Subquery in WHERE
SELECT username FROM users
WHERE id IN (SELECT DISTINCT user_id FROM posts);

-- Subquery in SELECT
SELECT 
    username,
    (SELECT COUNT(*) FROM posts WHERE user_id = users.id) as post_count
FROM users;

-- Subquery in FROM
SELECT avg_price_by_category.category
FROM (
    SELECT category, AVG(price) as avg_price
    FROM products
    GROUP BY category
) as avg_price_by_category
WHERE avg_price > 100;
```

## Indexes and Performance

### Creating Indexes

```sql
-- Create single column index
CREATE INDEX idx_username ON users(username);

-- Create unique index
CREATE UNIQUE INDEX idx_email ON users(email);

-- Create composite index
CREATE INDEX idx_name_category ON products(name, category);

-- Create full-text index
CREATE FULLTEXT INDEX idx_content ON posts(title, content);

-- Show indexes
SHOW INDEXES FROM users;

-- Drop index
DROP INDEX idx_username ON users;
```

### Query Optimization

```sql
-- Analyze query performance
EXPLAIN SELECT * FROM users WHERE username = 'john_doe';

-- Show query execution plan
EXPLAIN ANALYZE
SELECT u.username, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id;

-- Optimize table
OPTIMIZE TABLE users;

-- Analyze table for optimization
ANALYZE TABLE users;
```

## Transactions

```sql
-- Start transaction
START TRANSACTION;

-- Perform operations
INSERT INTO accounts (user_id, balance) VALUES (1, 1000);
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;

-- Commit transaction
COMMIT;

-- Or rollback if error
ROLLBACK;

-- Transaction with savepoint
START TRANSACTION;
INSERT INTO users (username, email) VALUES ('test', 'test@example.com');
SAVEPOINT sp1;
UPDATE users SET email = 'new@example.com' WHERE username = 'test';
ROLLBACK TO SAVEPOINT sp1;
COMMIT;
```

## Stored Procedures and Functions

### Stored Procedures

```sql
-- Create stored procedure
DELIMITER //
CREATE PROCEDURE GetUserPosts(IN userId INT)
BEGIN
    SELECT * FROM posts WHERE user_id = userId;
END //
DELIMITER ;

-- Call stored procedure
CALL GetUserPosts(1);

-- Procedure with OUT parameter
DELIMITER //
CREATE PROCEDURE GetUserCount(OUT userCount INT)
BEGIN
    SELECT COUNT(*) INTO userCount FROM users;
END //
DELIMITER ;

-- Call and get output
CALL GetUserCount(@count);
SELECT @count;

-- Drop procedure
DROP PROCEDURE IF EXISTS GetUserPosts;
```

### Functions

```sql
-- Create function
DELIMITER //
CREATE FUNCTION CalculateDiscount(price DECIMAL(10,2), discount_percent INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN price - (price * discount_percent / 100);
END //
DELIMITER ;

-- Use function
SELECT name, price, CalculateDiscount(price, 10) as discounted_price
FROM products;
```

## Backup and Restore

### Backup Database

```bash
# Backup single database
mysqldump -u root -p database_name > backup.sql

# Backup all databases
mysqldump -u root -p --all-databases > all_databases_backup.sql

# Backup specific tables
mysqldump -u root -p database_name table1 table2 > tables_backup.sql

# Backup with compression
mysqldump -u root -p database_name | gzip > backup.sql.gz
```

### Restore Database

```bash
# Restore database
mysql -u root -p database_name < backup.sql

# Restore from compressed backup
gunzip < backup.sql.gz | mysql -u root -p database_name

# Restore all databases
mysql -u root -p < all_databases_backup.sql
```

## User Management

```sql
-- Create user
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';

-- Grant all privileges
GRANT ALL PRIVILEGES ON database_name.* TO 'newuser'@'localhost';

-- Grant specific privileges
GRANT SELECT, INSERT, UPDATE ON database_name.* TO 'newuser'@'localhost';

-- Grant privileges on specific table
GRANT SELECT ON database_name.users TO 'newuser'@'localhost';

-- Show user privileges
SHOW GRANTS FOR 'newuser'@'localhost';

-- Revoke privileges
REVOKE INSERT, UPDATE ON database_name.* FROM 'newuser'@'localhost';

-- Change password
ALTER USER 'newuser'@'localhost' IDENTIFIED BY 'new_password';

-- Delete user
DROP USER 'newuser'@'localhost';

-- Reload privileges
FLUSH PRIVILEGES;
```

## Best Practices

### Database Design

```sql
-- Use appropriate data types
-- Bad: VARCHAR(255) for everything
-- Good: INT for IDs, DECIMAL for money, DATE for dates

-- Use indexes wisely
-- Index foreign keys and frequently queried columns
CREATE INDEX idx_user_id ON posts(user_id);
CREATE INDEX idx_created_at ON posts(created_at);

-- Use ENUM for fixed sets of values
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    priority ENUM('low', 'medium', 'high')
);

-- Use constraints for data integrity
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT CHECK (age >= 18 AND age <= 100),
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

### Query Optimization Tips

```sql
-- Use LIMIT for large result sets
SELECT * FROM users LIMIT 100;

-- Use EXISTS instead of IN for subqueries
-- Better performance
SELECT * FROM users WHERE EXISTS (
    SELECT 1 FROM posts WHERE posts.user_id = users.id
);

-- Avoid SELECT *
-- Select only needed columns
SELECT id, username, email FROM users;

-- Use prepared statements to prevent SQL injection
PREPARE stmt FROM 'SELECT * FROM users WHERE username = ?';
SET @username = 'john_doe';
EXECUTE stmt USING @username;
```

## Common Configuration

### my.cnf / my.ini Configuration

```ini
[mysqld]
# Basic settings
port = 3306
datadir = /var/lib/mysql
socket = /var/lib/mysql/mysql.sock

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Performance settings
max_connections = 200
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
query_cache_size = 64M
tmp_table_size = 64M
max_heap_table_size = 64M

# Logging
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Binary logging (for replication)
log_bin = /var/log/mysql/mysql-bin.log
expire_logs_days = 10
max_binlog_size = 100M
```

## Monitoring and Maintenance

```sql
-- Show server status
SHOW STATUS;

-- Show running processes
SHOW PROCESSLIST;

-- Show table status
SHOW TABLE STATUS FROM database_name;

-- Check table for errors
CHECK TABLE users;

-- Repair table
REPAIR TABLE users;

-- Show database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema;

-- Show table sizes
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'database_name'
ORDER BY (data_length + index_length) DESC;
```

## Resources

- **Official Documentation**: [MySQL Documentation](https://dev.mysql.com/doc/)
- **MySQL Workbench**: [Download](https://dev.mysql.com/downloads/workbench/)
- **MySQL Community**: [Forums](https://forums.mysql.com/)
- **Online Learning**: [MySQL Tutorial](https://www.mysqltutorial.org/)
- **Performance Blog**: [MySQL Performance Blog](https://www.percona.com/blog/)

## Summary

MySQL is a powerful, reliable, and scalable relational database management system perfect for web applications and enterprise solutions. Master these concepts:

✅ Database and table creation
✅ CRUD operations
✅ Joins and advanced queries
✅ Indexes and optimization
✅ Transactions and data integrity
✅ Stored procedures and functions
✅ Backup and restore
✅ User management and security
✅ Performance tuning

Continue practicing with real projects to become proficient in MySQL database development!
