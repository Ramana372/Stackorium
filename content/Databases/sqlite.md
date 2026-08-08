## Introduction to SQLite

SQLite is a self-contained, serverless, zero-configuration, transactional SQL database engine. Unlike most databases, SQLite doesn't run as a separate server process — the entire database lives in a single cross-platform file, and the engine is compiled directly into the application that uses it.

### Why Choose SQLite?

- **Zero Configuration**: No server to install, configure, or manage
- **Single File Storage**: The entire database is one portable file
- **Serverless**: The library reads and writes directly to disk
- **Widely Deployed**: Ships inside browsers, phones, and countless applications — likely the most deployed database engine in the world
- **ACID Compliant**: Full transactional support despite its simplicity
- **Public Domain**: Free for any use, including commercial, with no licensing restrictions

### Key Features

- **Self-Contained**: A single library file with no external dependencies
- **Cross-Platform**: Database files work identically across operating systems
- **Dynamic Typing**: Flexible type system (with optional strict typing in modern versions)
- **Full-Text Search**: FTS5 extension for fast text search
- **JSON Support**: Built-in JSON functions for semi-structured data
- **Small Footprint**: The library is a few hundred KB
- **In-Memory Mode**: Can run entirely in RAM for testing or caching

## Installation

### Windows Installation

```bash
# Download precompiled binaries from https://www.sqlite.org/download.html
# Or using Chocolatey:
choco install sqlite

# Verify installation
sqlite3 --version
```

### macOS Installation

```bash
# SQLite ships with macOS by default, but to get the latest version:
brew install sqlite3

# Verify installation
sqlite3 --version
```

### Linux (Ubuntu/Debian) Installation

```bash
# Update package list
sudo apt update

# Install SQLite
sudo apt install sqlite3

# Verify installation
sqlite3 --version
```

## Getting Started

### Creating and Opening a Database

```bash
# Create/open a database file (creates it if it doesn't exist)
sqlite3 mydatabase.db

# Open an in-memory database (useful for testing)
sqlite3 :memory:

# Run a single command without an interactive shell
sqlite3 mydatabase.db "SELECT sqlite_version();"
```

### DB Browser for SQLite (GUI Tool)

```bash
# Download from https://sqlitebrowser.org/
# Or install via package manager:

# macOS
brew install --cask db-browser-for-sqlite

# Linux
sudo apt install sqlitebrowser
```

### Useful Dot Commands

```bash
.help              -- show all dot commands
.tables            -- list all tables
.schema users      -- show schema for a table
.mode column       -- format output as columns
.headers on        -- show column headers
.databases         -- list attached databases
.backup backup.db  -- backup the current database
.quit              -- exit the shell
```

## Database Operations

### Creating Tables

```sql
-- Create a simple table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create a table with a foreign key
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    user_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enable foreign key enforcement (off by default!)
PRAGMA foreign_keys = ON;

-- Create table with CHECK constraint
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL CHECK (price > 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0)
);

-- Create indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

### Data Types

```sql
-- SQLite uses dynamic typing with type affinity:
-- INTEGER, REAL, TEXT, BLOB, NUMERIC

-- STRICT tables (SQLite 3.37+) enforce declared types
CREATE TABLE inventory (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL
) STRICT;

-- Store JSON as TEXT and query it with JSON functions
CREATE TABLE settings (
    user_id INTEGER PRIMARY KEY,
    preferences TEXT -- JSON stored as text
);
```

## CRUD Operations

### Insert Data

```sql
-- Insert a single row
INSERT INTO users (username, email, password)
VALUES ('john_doe', 'john@example.com', 'hashed_password');

-- Insert multiple rows
INSERT INTO users (username, email, password) VALUES
('bob_wilson', 'bob@example.com', 'hashed_password'),
('alice_brown', 'alice@example.com', 'hashed_password');

-- Insert and get the last inserted row id
INSERT INTO users (username, email, password) VALUES ('jane', 'jane@example.com', 'pw');
SELECT last_insert_rowid();

-- Upsert (insert or update on conflict)
INSERT INTO users (username, email, password)
VALUES ('john_doe', 'john@example.com', 'new_password')
ON CONFLICT(username) DO UPDATE SET email = excluded.email;
```

### Select Data

```sql
-- Select all columns
SELECT * FROM users;

-- Select with conditions
SELECT * FROM users WHERE is_active = 1;

-- Select with ordering and limit
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- Aggregation
SELECT COUNT(*) AS total_users FROM users;
SELECT AVG(price) AS avg_price FROM products;

-- JSON queries
SELECT json_extract(preferences, '$.theme') AS theme FROM settings;
```

### Update Data

```sql
-- Update a row
UPDATE users SET email = 'newemail@example.com' WHERE username = 'john_doe';

-- Update with computed value
UPDATE products SET price = price * 1.1 WHERE stock > 0;

-- Update JSON field
UPDATE settings
SET preferences = json_set(preferences, '$.theme', 'dark')
WHERE user_id = 1;
```

### Delete Data

```sql
-- Delete specific rows
DELETE FROM users WHERE username = 'john_doe';

-- Delete all rows but keep the table
DELETE FROM users;

-- Delete and reclaim space immediately
DELETE FROM users WHERE created_at < '2020-01-01';
VACUUM;
```

## Advanced Queries

### Joins

```sql
-- Inner join
SELECT posts.title, users.username
FROM posts
JOIN users ON posts.user_id = users.id;

-- Left join
SELECT users.username, posts.title
FROM users
LEFT JOIN posts ON posts.user_id = users.id;
```

### Common Table Expressions (CTEs)

```sql
WITH active_users AS (
    SELECT * FROM users WHERE is_active = 1
)
SELECT * FROM active_users WHERE username LIKE 'j%';

-- Recursive CTE (e.g., generating a sequence)
WITH RECURSIVE counter(x) AS (
    SELECT 1
    UNION ALL
    SELECT x + 1 FROM counter WHERE x < 10
)
SELECT x FROM counter;
```

### Window Functions

```sql
SELECT
    name,
    price,
    RANK() OVER (ORDER BY price DESC) AS price_rank
FROM products;

SELECT
    date,
    amount,
    SUM(amount) OVER (ORDER BY date) AS running_total
FROM transactions;
```

## Full-Text Search (FTS5)

```sql
-- Create a virtual FTS5 table
CREATE VIRTUAL TABLE posts_fts USING fts5(title, content);

-- Populate it
INSERT INTO posts_fts (title, content)
SELECT title, content FROM posts;

-- Search
SELECT * FROM posts_fts WHERE posts_fts MATCH 'sqlite AND database';

-- Ranked search
SELECT title, rank FROM posts_fts WHERE posts_fts MATCH 'sqlite' ORDER BY rank;
```

## Transactions

```sql
-- Explicit transaction
BEGIN TRANSACTION;
INSERT INTO accounts (user_id, balance) VALUES (1, 1000);
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;
COMMIT;

-- Rollback on error
BEGIN TRANSACTION;
DELETE FROM users WHERE id = 1;
ROLLBACK;

-- Savepoints
BEGIN;
INSERT INTO users (username, email, password) VALUES ('test', 'test@example.com', 'pw');
SAVEPOINT sp1;
UPDATE users SET email = 'new@example.com' WHERE username = 'test';
ROLLBACK TO sp1;
COMMIT;
```

## Backup and Restore

```bash
# Dump database to a SQL text file
sqlite3 mydatabase.db .dump > backup.sql

# Restore from a SQL dump
sqlite3 newdatabase.db < backup.sql

# Backup using the .backup command (binary copy, safe for live DBs)
sqlite3 mydatabase.db ".backup backup.db"

# Backup a specific table
sqlite3 mydatabase.db ".dump users" > users_backup.sql

# Copy the file directly (only safe when no writes are in progress)
cp mydatabase.db mydatabase_copy.db
```

## Performance and Indexing

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_posts_user_date ON posts(user_id, created_at);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE is_active = 1;

-- Analyze query plan
EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'john@example.com';

-- Update table statistics for the query planner
ANALYZE;

-- Reclaim unused space and defragment
VACUUM;

-- Enable Write-Ahead Logging for better concurrency
PRAGMA journal_mode = WAL;
```

## Configuration (PRAGMAs)

```sql
-- Enable foreign key constraint enforcement
PRAGMA foreign_keys = ON;

-- Set journal mode (DELETE, WAL, MEMORY, OFF)
PRAGMA journal_mode = WAL;

-- Set synchronous mode for durability vs. speed tradeoff
PRAGMA synchronous = NORMAL;

-- Set cache size (in pages, negative = KB)
PRAGMA cache_size = -2000;

-- Check database integrity
PRAGMA integrity_check;

-- Show table schema info
PRAGMA table_info(users);
```

## Monitoring

```sql
-- Show all tables
SELECT name FROM sqlite_master WHERE type = 'table';

-- Show database file size
SELECT page_count * page_size AS size_bytes FROM pragma_page_count(), pragma_page_size();

-- Show index list for a table
PRAGMA index_list(users);

-- Show current journal mode
PRAGMA journal_mode;
```

## Best Practices

- **Enable foreign keys explicitly** — `PRAGMA foreign_keys = ON` is required per connection
- **Use WAL mode** for applications with concurrent readers and writers
- **Wrap multi-statement writes in transactions** to avoid partial updates and improve performance
- **Avoid SQLite for high-concurrency write workloads** — it's best suited for embedded, single-writer, or read-heavy scenarios
- **Run `VACUUM` periodically** on databases with heavy delete/update activity to reclaim space
- **Use parameterized queries** in application code to prevent SQL injection

## Resources

- **Official Documentation**: [SQLite Docs](https://www.sqlite.org/docs.html)
- **DB Browser**: [DB Browser for SQLite](https://sqlitebrowser.org/)
- **SQL Syntax Reference**: [SQLite Language](https://www.sqlite.org/lang.html)
- **PRAGMA Reference**: [PRAGMA Statements](https://www.sqlite.org/pragma.html)

## Summary

SQLite is the simplest path to a reliable, embedded SQL database:

✅ Zero-configuration, serverless architecture
✅ Entire database in a single portable file
✅ Full ACID transaction support
✅ Built-in full-text search and JSON functions
✅ Runs everywhere — mobile, desktop, browser, and embedded systems
✅ Public domain and completely free to use

Master SQLite for lightweight applications, local-first apps, prototypes, and embedded storage!
