## Introduction to Node.js and Express

Node.js is a JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript outside the browser — most commonly for building servers. Express is the most widely used web framework for Node.js, providing a minimal, unopinionated layer for building APIs and web applications on top of it.

### Why Choose Node.js + Express?

- **One Language, Full Stack**: Use JavaScript on both the frontend and backend
- **Non-Blocking I/O**: Node's event loop handles thousands of concurrent connections efficiently
- **Massive Ecosystem**: npm has a package for nearly anything you need
- **Minimal & Flexible**: Express doesn't force a specific project structure or ORM
- **Fast to Build With**: Get a REST API running in minutes
- **Battle-Tested**: Powers backends at Netflix, Uber, PayPal, and LinkedIn

### Key Features

- **Event Loop**: Single-threaded, non-blocking concurrency model
- **Middleware Pipeline**: Compose request handling from small, reusable functions
- **Routing**: Declarative mapping of HTTP methods and paths to handlers
- **Streams**: Efficient handling of large data without loading it all into memory
- **npm**: The largest package registry in the world
- **Built-in Modules**: `fs`, `http`, `path`, `crypto`, and more, no install required

## Installation

### Windows Installation

```bash
# Using Chocolatey
choco install nodejs-lts

# Verify installation
node --version
npm --version
```

### macOS Installation

```bash
# Using Homebrew
brew install node

# Or via nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts

# Verify installation
node --version
npm --version
```

### Linux (Ubuntu/Debian) Installation

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts

# Verify installation
node --version
npm --version
```

## Getting Started

```bash
# Initialize a new project
mkdir my-api && cd my-api
npm init -y

# Install Express
npm install express

# Install dev dependencies
npm install -D nodemon typescript @types/node @types/express

# Run a file
node server.js

# Run with auto-restart on changes (dev)
npx nodemon server.js
```

### Basic Server

```javascript
// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Node.js Fundamentals

### The Event Loop and Async Patterns

```javascript
// Callbacks (older pattern)
const fs = require('fs');
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// Promises with fs.promises
const fsPromises = require('fs').promises;
async function readData() {
  const data = await fsPromises.readFile('data.txt', 'utf8');
  console.log(data);
}

// Non-blocking nature
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');
// Output: 1, 3, 2
```

### Built-in Modules

```javascript
const path = require('path');
const crypto = require('crypto');
const os = require('os');

// path
path.join(__dirname, 'uploads', 'file.png');
path.extname('image.jpg'); // ".jpg"

// crypto
const hash = crypto.createHash('sha256').update('password').digest('hex');
const randomToken = crypto.randomBytes(32).toString('hex');

// os
os.cpus().length;
os.freemem();
```

### Environment Variables

```bash
# .env
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/mydb
JWT_SECRET=supersecret
```

```javascript
require('dotenv').config();
const port = process.env.PORT || 3000;
```

## Express Routing

```javascript
const express = require('express');
const app = express();

app.use(express.json()); // parse JSON request bodies

// Route parameters
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});

// Query parameters
app.get('/search', (req, res) => {
  const { q, page = 1 } = req.query;
  res.json({ query: q, page });
});

// HTTP methods
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: 1, name, email });
});

app.put('/users/:id', (req, res) => { /* update */ });
app.patch('/users/:id', (req, res) => { /* partial update */ });
app.delete('/users/:id', (req, res) => { /* delete */ });

// Router modules for organization
const usersRouter = express.Router();
usersRouter.get('/', (req, res) => res.json([]));
usersRouter.get('/:id', (req, res) => res.json({ id: req.params.id }));
app.use('/api/users', usersRouter);
```

## Middleware

```javascript
// Custom middleware
function logger(req, res, next) {
  console.log(`${req.method} ${req.path}`);
  next();
}

app.use(logger);

// Middleware for specific routes
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // verify token...
  next();
}

app.get('/dashboard', requireAuth, (req, res) => {
  res.json({ message: 'Protected data' });
});

// Common built-in and third-party middleware
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
```

## Error Handling

```javascript
// Async route wrapper to catch errors
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  res.json(user);
}));

// Centralized error-handling middleware (must have 4 params)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
```

## Connecting to a Database

```javascript
// Using Mongoose (MongoDB)
const mongoose = require('mongoose');
await mongoose.connect(process.env.DATABASE_URL);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
});
const User = mongoose.model('User', userSchema);

// Using Prisma (SQL databases)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Using node-postgres directly
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/users', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users');
  res.json(rows);
});
```

## Authentication

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register — hash the password
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  res.status(201).json({ id: user.id, email: user.email });
});

// Login — issue a JWT
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Protect routes with a middleware
function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

## Validation

```javascript
const { body, validationResult } = require('express-validator');

app.post(
  '/users',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password too short'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // proceed with valid data
  },
);
```

## File Uploads

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('avatar'), (req, res) => {
  res.json({ filename: req.file.filename });
});
```

## Streams

```javascript
const fs = require('fs');

// Streaming a large file to the response
app.get('/download', (req, res) => {
  const stream = fs.createReadStream('large-file.zip');
  stream.pipe(res);
});

// Piping between streams
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');
readStream.pipe(writeStream);
```

## Testing

```javascript
// Using Jest + Supertest
const request = require('supertest');
const app = require('../server');

describe('GET /users', () => {
  it('returns a list of users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

## Project Structure (Common Pattern)

```
src/
  controllers/    -> request handlers
  routes/         -> route definitions
  middleware/     -> custom middleware
  models/         -> database schemas/models
  services/       -> business logic
  utils/          -> helper functions
  config/         -> configuration and env loading
  app.js          -> Express app setup
  server.js       -> entry point (starts the server)
```

## Best Practices

- **Never block the event loop** — avoid synchronous, CPU-heavy operations on the main thread
- **Always handle promise rejections** in async route handlers, or wrap them with a helper
- **Validate and sanitize all input** — never trust client-supplied data
- **Use environment variables** for secrets and config, never hardcode them
- **Centralize error handling** with a single error-handling middleware
- **Use a process manager** (PM2) or container orchestrator in production, not `node server.js` directly
- **Log structured data** (JSON) in production for easier aggregation and querying

## Resources

- **Node.js Documentation**: [nodejs.org/docs](https://nodejs.org/docs/latest/api/)
- **Express Documentation**: [expressjs.com](https://expressjs.com/)
- **npm Registry**: [npmjs.com](https://www.npmjs.com/)
- **Node.js Best Practices**: [GitHub Guide](https://github.com/goldbergyoni/nodebestpractices)

## Summary

Node.js and Express are the standard toolkit for JavaScript backends:

✅ Non-blocking I/O built for high-concurrency workloads
✅ Minimal, flexible routing and middleware model
✅ Massive npm ecosystem for databases, auth, and utilities
✅ Same language as the frontend — shared types and logic
✅ Straightforward path from prototype to production API
✅ Backed by a mature, widely adopted community

Master Node.js and Express to build fast, scalable APIs and backend services in JavaScript!
