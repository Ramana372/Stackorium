## Introduction to MongoDB

MongoDB is a leading NoSQL document-oriented database designed for ease of development and scaling. Unlike traditional relational databases, MongoDB stores data in flexible, JSON-like documents, making it ideal for modern application development where data structures may evolve over time.

### Why Choose MongoDB?

- **Flexible Schema**: No rigid table structures - documents can have different fields
- **Scalability**: Built-in horizontal scaling with sharding
- **High Performance**: Optimized for read/write operations with indexing
- **Rich Query Language**: Powerful query capabilities including aggregation
- **Document Model**: Maps naturally to objects in programming languages
- **High Availability**: Automatic replication and failover

### Key Features

- **Document-Oriented Storage**: Store data as BSON (Binary JSON) documents
- **Dynamic Schema**: Add fields on the fly without downtime
- **Aggregation Framework**: Powerful data processing pipelines
- **Indexing**: Support for various index types including compound, geospatial, text
- **Replication**: Automatic data replication with replica sets
- **Sharding**: Horizontal scaling across multiple servers
- **Ad Hoc Queries**: Query documents without predefined schemas
- **GridFS**: Store and retrieve large files efficiently

## Installation

### Windows Installation

```bash
# Download MongoDB Community Server from:
# https://www.mongodb.com/try/download/community

# Or using Chocolatey:
choco install mongodb

# Or using winget:
winget install MongoDB.Server

# Verify installation
mongod --version
mongo --version

# Start MongoDB service
net start MongoDB

# Connect to MongoDB
mongosh
```

### macOS Installation

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf

# Connect to MongoDB
mongosh

# Check status
brew services list
```

### Linux (Ubuntu/Debian) Installation

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Enable auto-start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod

# Connect to MongoDB
mongosh
```

## Getting Started

### MongoDB Shell (mongosh)

```bash
# Connect to local MongoDB
mongosh

# Connect to specific database
mongosh mongodb://localhost:27017/my_database

# Connect with authentication
mongosh "mongodb://username:password@localhost:27017/database?authSource=admin"

# Connect to MongoDB Atlas (cloud)
mongosh "mongodb+srv://cluster.mongodb.net/database" --username user
```

### MongoDB Compass (GUI Tool)

```bash
# Download from https://www.mongodb.com/try/download/compass

# Windows
choco install mongodb-compass

# macOS
brew install --cask mongodb-compass

# Linux - Download .deb or .rpm from website
```

## Database Operations

### Creating and Managing Databases

```javascript
// Show all databases
show dbs

// Switch to database (creates if doesn't exist)
use my_database

// Show current database
db

// Get database stats
db.stats()

// Drop database
db.dropDatabase()
```

### Collections (Similar to Tables)

```javascript
// Create collection explicitly
db.createCollection("users")

// Create collection with options
db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["username", "email"],
            properties: {
                username: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    pattern: "^.+@.+$",
                    description: "must be a valid email"
                },
                age: {
                    bsonType: "int",
                    minimum: 0,
                    maximum: 150
                }
            }
        }
    }
})

// Show all collections
show collections

// Drop collection
db.users.drop()

// Rename collection
db.users.renameCollection("customers")
```

## CRUD Operations

### Insert Documents

```javascript
// Insert single document
db.users.insertOne({
    username: "john_doe",
    email: "john@example.com",
    age: 30,
    interests: ["coding", "reading"],
    address: {
        city: "New York",
        country: "USA"
    },
    createdAt: new Date()
})

// Insert multiple documents
db.users.insertMany([
    {
        username: "jane_smith",
        email: "jane@example.com",
        age: 28,
        interests: ["music", "travel"]
    },
    {
        username: "bob_wilson",
        email: "bob@example.com",
        age: 35,
        interests: ["sports", "cooking"]
    }
])

// Insert with custom _id
db.users.insertOne({
    _id: "custom_id_123",
    username: "alice_brown",
    email: "alice@example.com"
})
```

### Find Documents

```javascript
// Find all documents
db.users.find()

// Find with pretty formatting
db.users.find().pretty()

// Find one document
db.users.findOne()

// Find with filter
db.users.find({ username: "john_doe" })

// Find with multiple conditions
db.users.find({
    age: { $gte: 25 },
    "address.country": "USA"
})

// Find with projection (select specific fields)
db.users.find(
    { age: { $gte: 25 } },
    { username: 1, email: 1, _id: 0 }
)

// Find with operators
db.users.find({ age: { $gt: 25, $lt: 40 } })  // greater than, less than
db.users.find({ interests: { $in: ["coding", "music"] } })  // in array
db.users.find({ username: { $regex: /^john/ } })  // regex pattern

// Find with sort
db.users.find().sort({ age: -1 })  // descending
db.users.find().sort({ username: 1 })  // ascending

// Find with limit and skip
db.users.find().limit(10)
db.users.find().skip(20).limit(10)  // pagination

// Count documents
db.users.countDocuments()
db.users.countDocuments({ age: { $gte: 25 } })
```

### Update Documents

```javascript
// Update one document
db.users.updateOne(
    { username: "john_doe" },
    { $set: { email: "newemail@example.com" } }
)

// Update multiple documents
db.users.updateMany(
    { age: { $lt: 25 } },
    { $set: { status: "young" } }
)

// Replace entire document
db.users.replaceOne(
    { username: "john_doe" },
    {
        username: "john_doe",
        email: "john@example.com",
        age: 31
    }
)

// Update with operators
db.users.updateOne(
    { username: "john_doe" },
    {
        $set: { email: "new@example.com" },
        $inc: { age: 1 },  // increment
        $push: { interests: "gaming" },  // add to array
        $currentDate: { lastModified: true }  // set current date
    }
)

// Update array elements
db.users.updateOne(
    { username: "john_doe" },
    { $pull: { interests: "coding" } }  // remove from array
)

// Upsert (update or insert)
db.users.updateOne(
    { username: "new_user" },
    { $set: { email: "new@example.com", age: 25 } },
    { upsert: true }
)
```

### Delete Documents

```javascript
// Delete one document
db.users.deleteOne({ username: "john_doe" })

// Delete multiple documents
db.users.deleteMany({ age: { $lt: 18 } })

// Delete all documents (keep collection)
db.users.deleteMany({})

// Find and delete
db.users.findOneAndDelete({ username: "john_doe" })
```

## Advanced Queries

### Query Operators

```javascript
// Comparison operators
db.products.find({ price: { $eq: 100 } })  // equal
db.products.find({ price: { $ne: 100 } })  // not equal
db.products.find({ price: { $gt: 50 } })   // greater than
db.products.find({ price: { $gte: 50 } })  // greater than or equal
db.products.find({ price: { $lt: 100 } })  // less than
db.products.find({ price: { $lte: 100 } }) // less than or equal
db.products.find({ category: { $in: ["Electronics", "Books"] } })
db.products.find({ category: { $nin: ["Toys"] } })

// Logical operators
db.products.find({
    $and: [
        { price: { $gte: 50 } },
        { price: { $lte: 100 } }
    ]
})

db.products.find({
    $or: [
        { category: "Electronics" },
        { category: "Computers" }
    ]
})

db.products.find({
    $nor: [
        { price: { $lt: 10 } },
        { stock: 0 }
    ]
})

db.products.find({ price: { $not: { $gt: 100 } } })

// Element operators
db.products.find({ discount: { $exists: true } })
db.products.find({ category: { $type: "string" } })

// Array operators
db.users.find({ interests: { $all: ["coding", "reading"] } })
db.users.find({ "tags.0": "featured" })  // first element
db.users.find({ tags: { $size: 3 } })  // array size
db.users.find({ interests: { $elemMatch: { $in: ["coding", "music"] } } })
```

### Aggregation Pipeline

```javascript
// Simple aggregation
db.orders.aggregate([
    { $match: { status: "completed" } },
    { $group: {
        _id: "$customer_id",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
    }}
])

// Complex aggregation pipeline
db.orders.aggregate([
    // Stage 1: Filter documents
    { $match: { 
        orderDate: { 
            $gte: new Date("2024-01-01"),
            $lt: new Date("2024-12-31")
        }
    }},
    
    // Stage 2: Join with customers collection
    { $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customer"
    }},
    
    // Stage 3: Unwind array
    { $unwind: "$customer" },
    
    // Stage 4: Group and calculate
    { $group: {
        _id: "$customer.country",
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$amount" },
        avgOrderValue: { $avg: "$amount" }
    }},
    
    // Stage 5: Sort results
    { $sort: { totalRevenue: -1 } },
    
    // Stage 6: Limit results
    { $limit: 10 },
    
    // Stage 7: Project (select fields)
    { $project: {
        country: "$_id",
        totalOrders: 1,
        totalRevenue: { $round: ["$totalRevenue", 2] },
        avgOrderValue: { $round: ["$avgOrderValue", 2] },
        _id: 0
    }}
])

// Aggregation operators
db.sales.aggregate([
    { $group: {
        _id: "$product_id",
        total: { $sum: "$quantity" },
        avg: { $avg: "$price" },
        min: { $min: "$price" },
        max: { $max: "$price" },
        first: { $first: "$date" },
        last: { $last: "$date" }
    }}
])

// Array aggregation
db.users.aggregate([
    { $project: {
        username: 1,
        interestCount: { $size: "$interests" },
        hasEmail: { $cond: [{ $ifNull: ["$email", false] }, true, false] }
    }}
])
```

## Indexing

```javascript
// Create single field index
db.users.createIndex({ username: 1 })  // ascending
db.users.createIndex({ age: -1 })      // descending

// Create compound index
db.users.createIndex({ username: 1, email: 1 })

// Create unique index
db.users.createIndex({ email: 1 }, { unique: true })

// Create text index for full-text search
db.posts.createIndex({ title: "text", content: "text" })

// Create geospatial index
db.places.createIndex({ location: "2dsphere" })

// Create partial index
db.users.createIndex(
    { email: 1 },
    { partialFilterExpression: { age: { $gte: 18 } } }
)

// Create TTL index (time to live - auto-delete)
db.sessions.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3600 }  // 1 hour
)

// List all indexes
db.users.getIndexes()

// Drop index
db.users.dropIndex("username_1")

// Drop all indexes except _id
db.users.dropIndexes()

// Explain query (see index usage)
db.users.find({ username: "john_doe" }).explain("executionStats")
```

## Text Search

```javascript
// Create text index
db.posts.createIndex({ title: "text", content: "text" })

// Basic text search
db.posts.find({ $text: { $search: "mongodb tutorial" } })

// Search with phrase
db.posts.find({ $text: { $search: "\"nosql database\"" } })

// Search with exclusion
db.posts.find({ $text: { $search: "mongodb -sql" } })

// Search with score
db.posts.find(
    { $text: { $search: "mongodb" } },
    { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
```

## Transactions

```javascript
// Start session
const session = db.getMongo().startSession()

// Start transaction
session.startTransaction()

try {
    const accountsCollection = session.getDatabase("bank").accounts
    
    // Transfer money between accounts
    accountsCollection.updateOne(
        { accountId: "A123" },
        { $inc: { balance: -100 } },
        { session }
    )
    
    accountsCollection.updateOne(
        { accountId: "B456" },
        { $inc: { balance: 100 } },
        { session }
    )
    
    // Commit transaction
    session.commitTransaction()
} catch (error) {
    // Rollback on error
    session.abortTransaction()
    throw error
} finally {
    session.endSession()
}
```

## Replication

```javascript
// Initialize replica set
rs.initiate()

// Check replica set status
rs.status()

// Add member to replica set
rs.add("mongodb2.example.com:27017")

// Add arbiter
rs.addArb("mongodb-arbiter.example.com:27017")

// Remove member
rs.remove("mongodb2.example.com:27017")

// Step down primary
rs.stepDown()

// Check if master
db.isMaster()
```

## Backup and Restore

```bash
# Backup entire database
mongodump --db my_database --out /backup/

# Backup specific collection
mongodump --db my_database --collection users --out /backup/

# Backup with authentication
mongodump --uri="mongodb://username:password@localhost:27017/database" --out /backup/

# Backup and compress
mongodump --db my_database --gzip --out /backup/

# Restore database
mongorestore --db my_database /backup/my_database/

# Restore with drop (replace existing)
mongorestore --db my_database --drop /backup/my_database/

# Restore specific collection
mongorestore --db my_database --collection users /backup/my_database/users.bson

# Export to JSON
mongoexport --db my_database --collection users --out users.json

# Export to CSV
mongoexport --db my_database --collection users --type=csv --fields username,email --out users.csv

# Import from JSON
mongoimport --db my_database --collection users --file users.json

# Import from CSV
mongoimport --db my_database --collection users --type csv --headerline --file users.csv
```

## User Management

```javascript
// Create admin user
use admin
db.createUser({
    user: "admin",
    pwd: "secure_password",
    roles: [
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" }
    ]
})

// Create database user
use my_database
db.createUser({
    user: "app_user",
    pwd: "password",
    roles: [
        { role: "readWrite", db: "my_database" }
    ]
})

// Create read-only user
db.createUser({
    user: "readonly_user",
    pwd: "password",
    roles: [
        { role: "read", db: "my_database" }
    ]
})

// Show users
db.getUsers()

// Update user password
db.changeUserPassword("app_user", "new_password")

// Grant additional roles
db.grantRolesToUser("app_user", [
    { role: "dbAdmin", db: "my_database" }
])

// Revoke roles
db.revokeRolesFromUser("app_user", [
    { role: "dbAdmin", db: "my_database" }
])

// Drop user
db.dropUser("app_user")
```

## Performance Optimization

```javascript
// Analyze query performance
db.users.find({ email: "john@example.com" }).explain("executionStats")

// Get collection statistics
db.users.stats()

// Get database statistics
db.stats()

// Compact collection (reclaim disk space)
db.runCommand({ compact: "users" })

// Validate collection
db.users.validate()

// Current operations
db.currentOp()

// Kill operation
db.killOp(operation_id)

// Get profiling level
db.getProfilingLevel()

// Enable profiling (0=off, 1=slow queries, 2=all)
db.setProfilingLevel(1, { slowms: 100 })

// View slow queries
db.system.profile.find().limit(10).sort({ ts: -1 }).pretty()
```

## MongoDB Configuration

### mongod.conf

```yaml
# Network settings
net:
  port: 27017
  bindIp: 127.0.0.1

# Storage
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

# Logging
systemLog:
  destination: file
  path: /var/log/mongodb/mongod.log
  logAppend: true

# Security
security:
  authorization: enabled

# Replication
replication:
  replSetName: "rs0"

# Sharding
sharding:
  clusterRole: configsvr
```

## Monitoring

```javascript
// Server status
db.serverStatus()

// Database statistics
db.stats()

// Collection statistics
db.users.stats()

// Check connection
db.runCommand({ ping: 1 })

// Get current operations
db.currentOp()

// Get replication info
rs.printReplicationInfo()

// Get database profiling data
db.system.profile.find().limit(5).sort({ ts: -1 })
```

## Best Practices

### Schema Design

```javascript
// Embed related data (denormalization)
{
    _id: ObjectId("..."),
    username: "john_doe",
    email: "john@example.com",
    address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001"
    },
    orders: [
        { orderId: 1, total: 100, date: new Date() },
        { orderId: 2, total: 150, date: new Date() }
    ]
}

// Reference for large or frequently changing data
{
    _id: ObjectId("..."),
    username: "john_doe",
    email: "john@example.com",
    order_ids: [ObjectId("..."), ObjectId("...")]
}
```

### Common Patterns

```javascript
// Bulk operations
const bulk = db.users.initializeUnorderedBulkOp()
bulk.insert({ username: "user1", email: "user1@example.com" })
bulk.insert({ username: "user2", email: "user2@example.com" })
bulk.find({ username: "old_user" }).update({ $set: { status: "inactive" } })
bulk.execute()

// Cursor processing
db.users.find().forEach(function(doc) {
    print(doc.username)
})

// Limit memory usage with cursor
const cursor = db.users.find().batchSize(100)
while (cursor.hasNext()) {
    const doc = cursor.next()
    // process document
}
```

## Resources

- **Official Documentation**: [MongoDB Manual](https://docs.mongodb.com/)
- **MongoDB University**: [Free Courses](https://university.mongodb.com/)
- **MongoDB Compass**: [Download GUI](https://www.mongodb.com/products/compass)
- **MongoDB Atlas**: [Cloud Database](https://www.mongodb.com/cloud/atlas)
- **Community**: [MongoDB Community Forums](https://www.mongodb.com/community/forums/)

## Summary

MongoDB is a powerful NoSQL database perfect for modern applications requiring flexibility and scalability:

✅ Flexible document-based data model
✅ Powerful aggregation framework
✅ Horizontal scaling with sharding
✅ High availability with replica sets
✅ Rich query capabilities
✅ Strong indexing support
✅ Built-in replication
✅ Easy integration with programming languages

Master MongoDB for building scalable, high-performance applications!
