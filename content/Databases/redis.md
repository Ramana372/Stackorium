## Introduction to Redis

Redis (REmote DIctionary Server) is an open-source, in-memory data structure store used as a database, cache, message broker, and streaming engine. Its data is held primarily in RAM, which makes it exceptionally fast for read and write operations, often serving sub-millisecond responses at massive scale.

### Why Choose Redis?

- **Blazing Fast**: In-memory storage delivers sub-millisecond latency for most operations
- **Rich Data Structures**: Native support for strings, hashes, lists, sets, sorted sets, streams, and more
- **Atomic Operations**: Every command is atomic, simplifying concurrent access
- **Versatile**: Works as a cache, session store, message broker, rate limiter, and leaderboard engine
- **Persistence Options**: Choose between snapshotting, append-only logs, or pure in-memory
- **Battle-Tested**: Powers caching layers at Twitter, GitHub, Snapchat, and StackOverflow

### Key Features

- **Data Structures**: Strings, Lists, Hashes, Sets, Sorted Sets, Bitmaps, HyperLogLogs, Streams, Geospatial indexes
- **Pub/Sub Messaging**: Built-in publish/subscribe for real-time messaging
- **Lua Scripting**: Server-side scripting for complex atomic operations
- **Replication**: Master-replica replication for read scaling and failover
- **Clustering**: Redis Cluster for horizontal scaling and automatic sharding
- **Persistence**: RDB snapshots and AOF (Append Only File) logging
- **Expiration & Eviction**: TTL-based key expiry and configurable eviction policies

## Installation

### Windows Installation

```bash
# Redis isn't officially supported on Windows — use WSL2 or Memurai
# Via WSL2 (recommended):
wsl --install
sudo apt update
sudo apt install redis-server

# Or using Chocolatey with Memurai (Redis-compatible):
choco install memurai-developer

# Verify installation
redis-cli --version
```

### macOS Installation

```bash
# Using Homebrew
brew install redis

# Start Redis service
brew services start redis

# Or start manually in foreground
redis-server /usr/local/etc/redis.conf

# Verify it's running
redis-cli ping
# PONG
```

### Linux (Ubuntu/Debian) Installation

```bash
# Update package list
sudo apt update

# Install Redis
sudo apt install redis-server

# Enable Redis to start on boot
sudo systemctl enable redis-server

# Start Redis
sudo systemctl start redis-server

# Check status
sudo systemctl status redis-server

# Verify installation
redis-cli ping
# PONG
```

## Getting Started

### Connecting to Redis

```bash
# Connect to local instance
redis-cli

# Connect to remote instance
redis-cli -h hostname -p 6379

# Connect with authentication
redis-cli -h hostname -p 6379 -a password

# Connect to specific database (0-15 by default)
redis-cli -n 1

# Test connection
redis-cli ping
```

### RedisInsight (GUI Tool)

```bash
# Download from https://redis.io/insight/
# Or run via Docker
docker run -d --name redisinsight -p 5540:5540 redis/redisinsight:latest

# Access at http://localhost:5540
```

## Data Structures

### Strings

```bash
# Set and get a value
SET user:1:name "John Doe"
GET user:1:name

# Set with expiration (seconds)
SET session:abc123 "active" EX 3600

# Increment/decrement counters
SET pageviews 0
INCR pageviews
INCRBY pageviews 10
DECR pageviews

# Set multiple keys at once
MSET key1 "value1" key2 "value2"
MGET key1 key2

# Append to a string
APPEND user:1:name " Jr."
```

### Hashes

```bash
# Store an object as a hash
HSET user:1 name "John Doe" email "john@example.com" age 30

# Get a single field
HGET user:1 name

# Get all fields
HGETALL user:1

# Increment a numeric field
HINCRBY user:1 age 1

# Check if field exists
HEXISTS user:1 email

# Delete a field
HDEL user:1 age
```

### Lists

```bash
# Push elements (left/right)
LPUSH recent_activity "logged in"
RPUSH recent_activity "viewed dashboard"

# Get a range of elements
LRANGE recent_activity 0 -1

# Pop elements
LPOP recent_activity
RPOP recent_activity

# Get list length
LLEN recent_activity

# Trim a list to a range (useful for capped logs)
LTRIM recent_activity 0 99
```

### Sets

```bash
# Add members to a set
SADD tags:post:1 "redis" "database" "caching"

# Check membership
SISMEMBER tags:post:1 "redis"

# Get all members
SMEMBERS tags:post:1

# Set operations
SADD tags:post:2 "redis" "nosql"
SINTER tags:post:1 tags:post:2
SUNION tags:post:1 tags:post:2
SDIFF tags:post:1 tags:post:2
```

### Sorted Sets

```bash
# Add members with scores (great for leaderboards)
ZADD leaderboard 100 "player1"
ZADD leaderboard 250 "player2"
ZADD leaderboard 175 "player3"

# Get ranked range (ascending)
ZRANGE leaderboard 0 -1 WITHSCORES

# Get ranked range (descending)
ZREVRANGE leaderboard 0 2 WITHSCORES

# Get a member's rank
ZRANK leaderboard "player1"

# Increment a score
ZINCRBY leaderboard 50 "player1"

# Get members within a score range
ZRANGEBYSCORE leaderboard 100 200
```

## Key Management

```bash
# Check if a key exists
EXISTS user:1

# Delete a key
DEL user:1

# Set expiration on an existing key
EXPIRE session:abc123 1800

# Check remaining TTL
TTL session:abc123

# Remove expiration
PERSIST session:abc123

# Rename a key
RENAME old_key new_key

# Find keys matching a pattern (avoid in production — use SCAN instead)
KEYS user:*

# Iterate keys safely without blocking
SCAN 0 MATCH user:* COUNT 100

# Get the type of a key
TYPE user:1
```

## Pub/Sub Messaging

```bash
# Subscribe to a channel (in one client)
SUBSCRIBE notifications

# Publish a message (from another client)
PUBLISH notifications "New order received"

# Pattern-based subscription
PSUBSCRIBE news.*

# Publish to a matching channel
PUBLISH news.sports "Match update"
```

## Transactions

```bash
# Start a transaction
MULTI

# Queue commands
SET balance:1 100
DECRBY balance:1 20
INCRBY balance:2 20

# Execute all queued commands atomically
EXEC

# Discard a queued transaction
DISCARD

# Optimistic locking with WATCH
WATCH balance:1
MULTI
DECRBY balance:1 20
EXEC
# If balance:1 changed since WATCH, EXEC returns nil
```

## Lua Scripting

```bash
# Run an inline script
EVAL "return redis.call('SET', KEYS[1], ARGV[1])" 1 mykey myvalue

# Example: atomic increment with a cap
EVAL "
local current = tonumber(redis.call('GET', KEYS[1]) or '0')
if current < tonumber(ARGV[1]) then
  return redis.call('INCR', KEYS[1])
else
  return current
end
" 1 rate_limit:user:1 100

# Load a script and run by SHA (more efficient for repeated use)
SCRIPT LOAD "return redis.call('GET', KEYS[1])"
EVALSHA <sha1> 1 mykey
```

## Persistence

### RDB (Snapshotting)

```ini
# redis.conf — save snapshot every 900s if at least 1 key changed
save 900 1
save 300 10
save 60 10000

# Snapshot file location
dir /var/lib/redis
dbfilename dump.rdb
```

```bash
# Trigger a manual snapshot
SAVE
BGSAVE
```

### AOF (Append Only File)

```ini
# redis.conf — enable AOF
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
```

```bash
# Rewrite AOF to compact it
BGREWRITEAOF
```

## Replication

```bash
# On the replica, point to the master
REPLICAOF master_host 6379

# Check replication status
INFO replication

# Promote a replica to master (manual failover)
REPLICAOF NO ONE
```

```ini
# redis.conf on replica
replicaof master_host 6379
replica-read-only yes
```

## Redis Cluster

```bash
# Create a 6-node cluster (3 masters, 3 replicas)
redis-cli --cluster create \
  127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \
  127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
  --cluster-replicas 1

# Check cluster status
redis-cli -c -p 7000 cluster info

# Get cluster node list
redis-cli -c -p 7000 cluster nodes

# Connect with cluster support (-c flag follows redirects)
redis-cli -c -p 7000
```

## Eviction Policies

```ini
# redis.conf
maxmemory 256mb

# Eviction policy options:
# noeviction        - return errors when memory limit reached
# allkeys-lru        - evict least recently used keys
# volatile-lru       - evict LRU keys with an expiry set
# allkeys-lfu        - evict least frequently used keys
# volatile-lfu       - evict LFU keys with an expiry set
# allkeys-random     - evict random keys
# volatile-random    - evict random keys with an expiry set
# volatile-ttl       - evict keys with shortest TTL first

maxmemory-policy allkeys-lru
```

## Monitoring

```bash
# Real-time command monitor
MONITOR

# Server info and stats
INFO
INFO memory
INFO stats

# Check memory usage of a key
MEMORY USAGE user:1

# Slow query log
SLOWLOG GET 10
SLOWLOG RESET

# Client connections
CLIENT LIST
CLIENT INFO

# Latency diagnostics
LATENCY HISTORY event
LATENCY LATEST
```

## Common Use Cases

```bash
# Caching a database query result
SET cache:user:42 '{"id":42,"name":"Jane"}' EX 300

# Rate limiting (fixed window)
INCR rate_limit:user:42
EXPIRE rate_limit:user:42 60

# Session storage
HSET session:xyz789 user_id 42 role "admin"
EXPIRE session:xyz789 1800

# Distributed locking
SET lock:resource:1 "owner-id" NX EX 10

# Job queue with lists
LPUSH job_queue '{"type":"send_email","to":"user@example.com"}'
BRPOP job_queue 0
```

## Best Practices

- **Avoid `KEYS` in production** — it blocks the server; use `SCAN` for iteration instead
- **Set TTLs on cache entries** to prevent unbounded memory growth
- **Use pipelining** to batch multiple commands and reduce round-trip latency
- **Prefer hashes over many individual keys** for related fields — more memory-efficient
- **Monitor memory usage** and set `maxmemory` with an appropriate eviction policy
- **Use Redis Cluster** for datasets that exceed a single node's memory capacity
- **Secure your instance** — bind to specific interfaces, require a password, disable dangerous commands in production

## Resources

- **Official Documentation**: [Redis Docs](https://redis.io/docs/)
- **Command Reference**: [Redis Commands](https://redis.io/commands/)
- **RedisInsight**: [GUI Client](https://redis.io/insight/)
- **University**: [Redis University](https://university.redis.com/)
- **Community**: [Redis Discord](https://redis.io/community/)

## Summary

Redis is the go-to in-memory data store for applications that need speed at scale:

✅ Sub-millisecond read/write performance
✅ Rich, purpose-built data structures
✅ Built-in Pub/Sub messaging and Lua scripting
✅ Flexible persistence with RDB and AOF
✅ Horizontal scaling via Redis Cluster
✅ Battle-tested for caching, sessions, queues, and leaderboards

Master Redis to add a high-performance caching and real-time data layer to any stack!
