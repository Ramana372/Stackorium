## Introduction to PostgreSQL

PostgreSQL is a powerful, open-source object-relational database system with over 35 years of active development. Known for its proven architecture, reliability, data integrity, robust feature set, and extensibility, PostgreSQL has earned a strong reputation for being standards-compliant and feature-rich.

### Why Choose PostgreSQL?

- **Advanced Features**: Support for JSON, arrays, hstore, and custom data types
- **ACID Compliance**: Strong data integrity with full ACID compliance
- **Extensibility**: Create custom functions, data types, and operators
- **Standards Compliant**: Excellent SQL standards compliance
- **Open Source**: Free and open-source with permissive license
- **Scalability**: Handles workloads from single machines to data warehouses

### Key Features

- **Advanced Data Types**: JSON/JSONB, arrays, hstore, geometric types, network addresses
- **Full-Text Search**: Built-in powerful text search capabilities
- **Foreign Data Wrappers**: Query external data sources as if they were PostgreSQL tables
- **Table Inheritance**: Object-oriented database features
- **Point-in-Time Recovery**: Advanced backup and recovery options
- **Multi-Version Concurrency Control (MVCC)**: High concurrency without read locks
- **Parallel Query Execution**: Utilize multiple CPU cores for queries
- **Advanced Indexing**: B-tree, Hash, GiST, SP-GiST, GIN, and BRIN indexes

## Installation

### Windows Installation

```bash
# Download from https://www.postgresql.org/download/windows/
# Run the installer and follow the wizard

# Or using Chocolatey:
choco install postgresql

# Verify installation
psql --version

# Start PostgreSQL service
net start postgresql-x64-15

# Access PostgreSQL
psql -U postgres
```

### macOS Installation

```bash
# Using Homebrew
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Or start manually
pg_ctl -D /usr/local/var/postgres start

# Create database for your user
createdb `whoami`

# Connect to PostgreSQL
psql postgres
```

### Linux (Ubuntu/Debian) Installation

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql

# Switch to postgres user
sudo -i -u postgres

# Access PostgreSQL
psql
```

## Getting Started

### Connecting to PostgreSQL

```bash
# Connect as postgres user
sudo -u postgres psql

# Connect to specific database
psql -d database_name -U username

# Connect to remote server
psql -h hostname -d database_name -U username -p 5432

# Connect with all options
psql postgresql://username:password@hostname:5432/database_name
```

### pgAdmin (GUI Tool)

```bash
# Download from https://www.pgadmin.org/download/
# Or install via package manager:

# Windows
choco install pgadmin4

# macOS
brew install --cask pgadmin4

# Linux
sudo apt install pgadmin4
```

## Database Operations

### Creating and Managing Databases

```sql
-- List all databases
\l
-- or
SELECT datname FROM pg_database;

-- Create database
CREATE DATABASE my_database;

-- Create database with encoding
CREATE DATABASE my_database
WITH ENCODING 'UTF8'
LC_COLLATE='en_US.UTF-8'
LC_CTYPE='en_US.UTF-8'
TEMPLATE=template0;

-- Connect to database
\c my_database

-- Show current database
SELECT current_database();

-- Drop database
DROP DATABASE my_database;
```

### Creating Tables

```sql
-- Create simple table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table with foreign key
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table with CHECK constraint
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    category VARCHAR(50),
    metadata JSONB
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_users_email ON users(email);
```

### Advanced Data Types

```sql
-- Array type
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    tag_list TEXT[]
);

-- JSON/JSONB type
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    settings JSONB,
    preferences JSON
);

-- hstore (key-value pairs)
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE TABLE product_attributes (
    id SERIAL PRIMARY KEY,
    product_id INTEGER,
    attributes hstore
);

-- Enum type
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status order_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- UUID type
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE
);
```

## CRUD Operations

### Insert Data

```sql
-- Insert single row
INSERT INTO users (username, email, password)
VALUES ('john_doe', 'john@example.com', 'hashed_password');

-- Insert and return inserted data
INSERT INTO users (username, email, password)
VALUES ('jane_smith', 'jane@example.com', 'hashed_password')
RETURNING id, username, created_at;

-- Insert multiple rows
INSERT INTO users (username, email, password) VALUES
('bob_wilson', 'bob@example.com', 'hashed_password'),
('alice_brown', 'alice@example.com', 'hashed_password')
RETURNING *;

-- Insert from select
INSERT INTO archived_users (username, email, archived_at)
SELECT username, email, CURRENT_TIMESTAMP
FROM users
WHERE created_at < '2020-01-01';

-- Insert with conflict handling (UPSERT)
INSERT INTO users (username, email, password)
VALUES ('john_doe', 'john@example.com', 'new_password')
ON CONFLICT (username)
DO UPDATE SET email = EXCLUDED.email, password = EXCLUDED.password;
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

-- Select with limit and offset
SELECT * FROM users LIMIT 10 OFFSET 20;

-- Select distinct values
SELECT DISTINCT category FROM products;

-- Select with aggregation
SELECT COUNT(*) as total_users FROM users;
SELECT AVG(price) as avg_price FROM products;
SELECT array_agg(username) FROM users;

-- Select with JSON operations
SELECT 
    id,
    settings->>'theme' as theme,
    settings->'notifications'->>'email' as email_notifications
FROM user_profiles;
```

### Update Data

```sql
-- Update single row
UPDATE users 
SET email = 'newemail@example.com' 
WHERE username = 'john_doe';

-- Update with RETURNING
UPDATE users 
SET email = 'newemail@example.com' 
WHERE username = 'john_doe'
RETURNING *;

-- Update multiple columns
UPDATE products 
SET price = price * 1.1, 
    updated_at = CURRENT_TIMESTAMP
WHERE category = 'Electronics';

-- Update with subquery
UPDATE posts
SET user_id = (SELECT id FROM users WHERE username = 'admin')
WHERE user_id IS NULL;

-- Update JSON field
UPDATE user_profiles
SET settings = jsonb_set(settings, '{theme}', '"dark"')
WHERE user_id = 1;
```

### Delete Data

```sql
-- Delete specific rows
DELETE FROM users WHERE username = 'john_doe';

-- Delete with RETURNING
DELETE FROM users 
WHERE created_at < '2020-01-01'
RETURNING id, username;

-- Delete with subquery
DELETE FROM posts
WHERE user_id IN (SELECT id FROM users WHERE is_active = false);

-- Truncate table (faster, resets sequences)
TRUNCATE TABLE temp_table;

-- Truncate with cascade
TRUNCATE TABLE users CASCADE;
```

## Advanced Queries

### Joins

```sql
-- INNER JOIN
SELECT u.username, p.title
FROM users u
INNER JOIN posts p ON u.id = p.user_id;

-- LEFT JOIN
SELECT u.username, p.title
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;

-- RIGHT JOIN
SELECT u.username, p.title
FROM users u
RIGHT JOIN posts p ON u.id = p.user_id;

-- FULL OUTER JOIN
SELECT u.username, p.title
FROM users u
FULL OUTER JOIN posts p ON u.id = p.user_id;

-- Cross join
SELECT * FROM categories CROSS JOIN products;

-- Multiple joins with aliases
SELECT 
    u.username,
    p.title,
    c.comment_text,
    c.created_at
FROM users u
INNER JOIN posts p ON u.id = p.user_id
LEFT JOIN comments c ON p.id = c.post_id
ORDER BY p.created_at DESC;
```

### Common Table Expressions (CTEs)

```sql
-- Simple CTE
WITH active_users AS (
    SELECT * FROM users WHERE is_active = true
)
SELECT * FROM active_users WHERE created_at > '2024-01-01';

-- Multiple CTEs
WITH 
user_stats AS (
    SELECT user_id, COUNT(*) as post_count
    FROM posts
    GROUP BY user_id
),
top_users AS (
    SELECT * FROM user_stats WHERE post_count > 10
)
SELECT u.username, t.post_count
FROM users u
INNER JOIN top_users t ON u.id = t.user_id;

-- Recursive CTE (tree structure)
WITH RECURSIVE category_tree AS (
    SELECT id, name, parent_id, 1 as level
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY level, name;
```

### Window Functions

```sql
-- Row number
SELECT 
    username,
    created_at,
    ROW_NUMBER() OVER (ORDER BY created_at) as row_num
FROM users;

-- Rank and Dense Rank
SELECT 
    name,
    price,
    RANK() OVER (ORDER BY price DESC) as price_rank,
    DENSE_RANK() OVER (ORDER BY price DESC) as dense_rank
FROM products;

-- Partition by
SELECT 
    category,
    name,
    price,
    AVG(price) OVER (PARTITION BY category) as avg_category_price
FROM products;

-- Running total
SELECT 
    date,
    amount,
    SUM(amount) OVER (ORDER BY date) as running_total
FROM transactions;

-- Lag and Lead
SELECT 
    date,
    sales,
    LAG(sales, 1) OVER (ORDER BY date) as previous_day_sales,
    LEAD(sales, 1) OVER (ORDER BY date) as next_day_sales
FROM daily_sales;
```

## Full-Text Search

```sql
-- Create tsvector column
ALTER TABLE posts ADD COLUMN search_vector tsvector;

-- Update search vector
UPDATE posts
SET search_vector = to_tsvector('english', title || ' ' || content);

-- Create GIN index for full-text search
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Full-text search query
SELECT title, content
FROM posts
WHERE search_vector @@ to_tsquery('english', 'postgresql & database');

-- Search with ranking
SELECT 
    title,
    ts_rank(search_vector, to_tsquery('english', 'postgresql')) as rank
FROM posts
WHERE search_vector @@ to_tsquery('english', 'postgresql')
ORDER BY rank DESC;

-- Automatic update trigger
CREATE FUNCTION posts_search_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', NEW.title || ' ' || NEW.content);
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_search_update 
BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION posts_search_trigger();
```

## Functions and Procedures

### Functions

```sql
-- Simple function
CREATE OR REPLACE FUNCTION get_user_post_count(user_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
    post_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO post_count
    FROM posts
    WHERE user_id = user_id_param;
    RETURN post_count;
END;
$$ LANGUAGE plpgsql;

-- Call function
SELECT get_user_post_count(1);

-- Function returning table
CREATE OR REPLACE FUNCTION get_active_users()
RETURNS TABLE(id INTEGER, username VARCHAR, email VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.username, u.email
    FROM users u
    WHERE u.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Call table-returning function
SELECT * FROM get_active_users();
```

### Stored Procedures

```sql
-- Create procedure
CREATE OR REPLACE PROCEDURE transfer_balance(
    from_account INTEGER,
    to_account INTEGER,
    amount NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE accounts SET balance = balance - amount WHERE id = from_account;
    UPDATE accounts SET balance = balance + amount WHERE id = to_account;
    COMMIT;
END;
$$;

-- Call procedure
CALL transfer_balance(1, 2, 100.00);
```

## Transactions

```sql
-- Begin transaction
BEGIN;

-- Perform operations
INSERT INTO accounts (user_id, balance) VALUES (1, 1000);
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;

-- Commit transaction
COMMIT;

-- Or rollback
ROLLBACK;

-- Savepoints
BEGIN;
INSERT INTO users (username, email) VALUES ('test', 'test@example.com');
SAVEPOINT sp1;
UPDATE users SET email = 'new@example.com' WHERE username = 'test';
ROLLBACK TO SAVEPOINT sp1;
COMMIT;

-- Transaction isolation levels
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- operations
COMMIT;
```

## Backup and Restore

```bash
# Backup single database
pg_dump database_name > backup.sql

# Backup with custom format (compressed)
pg_dump -Fc database_name > backup.dump

# Backup all databases
pg_dumpall > all_databases_backup.sql

# Backup specific table
pg_dump -t table_name database_name > table_backup.sql

# Backup with inserts (for compatibility)
pg_dump --inserts database_name > backup.sql

# Restore database
psql database_name < backup.sql

# Restore from custom format
pg_restore -d database_name backup.dump

# Restore all databases
psql -f all_databases_backup.sql postgres
```

## User Management

```sql
-- Create user
CREATE USER newuser WITH PASSWORD 'password';

-- Create user with options
CREATE USER admin WITH 
    PASSWORD 'password'
    CREATEDB
    CREATEROLE
    VALID UNTIL '2025-12-31';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE my_database TO newuser;
GRANT SELECT, INSERT, UPDATE ON TABLE users TO newuser;
GRANT USAGE ON SCHEMA public TO newuser;

-- Grant on all tables in schema
GRANT SELECT ON ALL TABLES IN SCHEMA public TO newuser;

-- Grant future privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO newuser;

-- Show user privileges
\du
-- or
SELECT * FROM pg_roles;

-- Revoke privileges
REVOKE INSERT, UPDATE ON TABLE users FROM newuser;

-- Change password
ALTER USER newuser WITH PASSWORD 'new_password';

-- Drop user
DROP USER newuser;
```

## Indexing and Performance

```sql
-- B-tree index (default)
CREATE INDEX idx_users_email ON users(email);

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- Expression index
CREATE INDEX idx_lower_username ON users(LOWER(username));

-- Composite index
CREATE INDEX idx_posts_user_date ON posts(user_id, created_at);

-- GIN index for JSONB
CREATE INDEX idx_settings_gin ON user_profiles USING GIN(settings);

-- GiST index for full-text search
CREATE INDEX idx_search_gist ON posts USING GiST(search_vector);

-- Show query execution plan
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';

-- Analyze query
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@example.com';

-- Vacuum and analyze
VACUUM ANALYZE users;

-- Reindex
REINDEX TABLE users;
```

## Configuration

### postgresql.conf

```ini
# Connection settings
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB

# Performance
work_mem = 4MB
maintenance_work_mem = 64MB
random_page_cost = 1.1

# WAL settings
wal_buffers = 16MB
checkpoint_completion_target = 0.9

# Logging
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'all'
log_duration = on
log_min_duration_statement = 1000

# Auto-vacuum
autovacuum = on
autovacuum_max_workers = 3
```

## Monitoring

```sql
-- Show active connections
SELECT * FROM pg_stat_activity;

-- Show database size
SELECT pg_size_pretty(pg_database_size('database_name'));

-- Show table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Show slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Show index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Resources

- **Official Documentation**: [PostgreSQL Docs](https://www.postgresql.org/docs/)
- **pgAdmin**: [pgAdmin 4](https://www.pgadmin.org/)
- **Community**: [PostgreSQL Mailing Lists](https://www.postgresql.org/list/)
- **Learning**: [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- **Performance**: [PostgreSQL Wiki](https://wiki.postgresql.org/)

## Summary

PostgreSQL is a feature-rich, standards-compliant database perfect for complex applications requiring advanced functionality:

✅ Advanced data types (JSON, arrays, custom types)
✅ Full-text search capabilities
✅ Window functions and CTEs
✅ Robust transaction support
✅ Powerful indexing options
✅ Extensibility with custom functions
✅ Strong community and ecosystem
✅ Excellent performance and scalability

Master PostgreSQL for building sophisticated, data-intensive applications!
