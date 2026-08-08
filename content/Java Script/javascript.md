## Introduction to JavaScript

JavaScript is a high-level, dynamically-typed programming language that powers interactive behavior on the web. Originally built for browsers, it now runs everywhere — servers (Node.js), mobile apps, desktop apps, and even embedded devices — making it one of the most widely used languages in the world.

### Why Choose JavaScript?

- **Ubiquitous**: Runs natively in every web browser with no installation required
- **Full-Stack**: The same language powers frontend, backend (Node.js), and mobile (React Native)
- **Huge Ecosystem**: npm hosts millions of open-source packages
- **Event-Driven & Asynchronous**: Built for non-blocking I/O and responsive UIs
- **Flexible**: Supports object-oriented, functional, and procedural styles
- **Constantly Evolving**: Yearly ECMAScript releases bring modern language features

### Key Features

- **Dynamic Typing**: Variables aren't bound to a fixed type
- **First-Class Functions**: Functions are values — pass them, return them, store them
- **Closures**: Functions retain access to their defining scope
- **Prototypal Inheritance**: Objects inherit directly from other objects
- **Async/Await**: Clean syntax for asynchronous code built on Promises
- **Modules (ESM)**: Native `import`/`export` for organizing code

## Installation

### Windows Installation

```bash
# Install Node.js (includes npm) to run JS outside the browser
# Download from https://nodejs.org or use a version manager:
choco install nodejs-lts

# Verify installation
node --version
npm --version
```

### macOS Installation

```bash
# Using Homebrew
brew install node

# Or use nvm (Node Version Manager) — recommended
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts

# Verify installation
node --version
npm --version
```

### Linux (Ubuntu/Debian) Installation

```bash
# Using nvm (recommended for version flexibility)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts

# Or via apt
sudo apt update
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

## Getting Started

```bash
# Run a JS file with Node.js
node app.js

# Start an interactive REPL
node

# Run JS directly in a browser console (no install needed)
# Open DevTools -> Console tab
```

```javascript
// hello.js
console.log("Hello, World!");
```

## Variables and Data Types

```javascript
// Variable declarations
let count = 0;          // block-scoped, reassignable
const name = "Alice";   // block-scoped, cannot be reassigned
var legacy = "avoid";   // function-scoped, avoid in modern code

// Primitive types
const str = "text";
const num = 42;
const float = 3.14;
const bool = true;
const nothing = null;
const notDefined = undefined;
const big = 9007199254740993n; // BigInt
const sym = Symbol("id");

// Reference types
const arr = [1, 2, 3];
const obj = { key: "value" };
const func = function () {};

// Type checking
typeof num;        // "number"
Array.isArray(arr); // true
```

## Functions

```javascript
// Function declaration
function add(a, b) {
  return a + b;
}

// Function expression
const subtract = function (a, b) {
  return a - b;
};

// Arrow functions
const multiply = (a, b) => a * b;
const square = (n) => {
  return n * n;
};

// Default parameters
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

// Higher-order functions
function withLogging(fn) {
  return (...args) => {
    console.log("Calling with:", args);
    return fn(...args);
  };
}
```

## Closures and Scope

```javascript
function makeCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
console.log(counter.value()); // 2
```

## Objects and Classes

```javascript
// Object literals
const user = {
  name: "Jane",
  age: 30,
  greet() {
    return `Hi, I'm ${this.name}`;
  },
};

// Destructuring
const { name, age } = user;

// Spread operator
const updatedUser = { ...user, age: 31 };

// Classes
class Animal {
  #privateField; // private field

  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
    this.#privateField = "hidden";
  }

  makeSound() {
    return `${this.name} says ${this.sound}`;
  }

  static create(name) {
    return new Animal(name, "...");
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, "Woof");
  }

  fetch() {
    return `${this.name} fetches the ball!`;
  }
}

const rex = new Dog("Rex");
console.log(rex.makeSound());
```

## Arrays and Iteration

```javascript
const numbers = [1, 2, 3, 4, 5];

// Common array methods
numbers.map((n) => n * 2);
numbers.filter((n) => n % 2 === 0);
numbers.reduce((sum, n) => sum + n, 0);
numbers.find((n) => n > 3);
numbers.some((n) => n > 4);
numbers.every((n) => n > 0);
numbers.forEach((n) => console.log(n));
numbers.sort((a, b) => b - a);

// Spread and destructuring
const [first, second, ...rest] = numbers;
const combined = [...numbers, 6, 7];

// for...of loop
for (const n of numbers) {
  console.log(n);
}
```

## Asynchronous JavaScript

### Promises

```javascript
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: "User " + id });
      else reject(new Error("Invalid ID"));
    }, 1000);
  });
}

fetchUser(1)
  .then((user) => console.log(user))
  .catch((err) => console.error(err))
  .finally(() => console.log("Done"));

// Combining promises
Promise.all([fetchUser(1), fetchUser(2)]).then((users) => console.log(users));
Promise.race([fetchUser(1), fetchUser(2)]).then((first) => console.log(first));
```

### Async/Await

```javascript
async function getUser(id) {
  try {
    const user = await fetchUser(id);
    console.log(user);
    return user;
  } catch (err) {
    console.error("Failed to fetch user:", err.message);
  }
}

// Using fetch with async/await
async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

## Modules (ES Modules)

```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;

export default function multiply(a, b) {
  return a * b;
}
```

```javascript
// app.js
import multiply, { add, PI } from "./math.js";
import * as MathUtils from "./math.js";

console.log(add(2, 3));
console.log(multiply(4, 5));
```

## Error Handling

```javascript
try {
  JSON.parse("{invalid json}");
} catch (error) {
  console.error("Parse error:", error.message);
} finally {
  console.log("Cleanup");
}

// Custom errors
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function validateAge(age) {
  if (age < 0) throw new ValidationError("Age cannot be negative", "age");
}
```

## Modern ES Features

```javascript
// Optional chaining
const city = user?.address?.city ?? "Unknown";

// Nullish coalescing
const port = process.env.PORT ?? 3000;

// Template literals
const message = `Welcome, ${user.name}! You have ${count} items.`;

// Array/object destructuring with defaults
const { theme = "light", locale = "en" } = settings;

// Map and Set
const map = new Map([["a", 1], ["b", 2]]);
const set = new Set([1, 2, 2, 3]);

// Structured cloning
const copy = structuredClone(originalObject);
```

## Best Practices

- **Use `const` by default, `let` when reassignment is needed, avoid `var`**
- **Prefer strict equality (`===`)** over loose equality (`==`) to avoid type coercion bugs
- **Handle promise rejections** — unhandled rejections crash Node processes in newer versions
- **Use `async/await` over chained `.then()`** for readability in complex flows
- **Avoid global variables** — use modules to encapsulate state
- **Use linting (ESLint) and formatting (Prettier)** to enforce consistent style across a team

## Resources

- **MDN Web Docs**: [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **ECMAScript Specification**: [TC39 Proposals](https://tc39.es/)
- **Node.js Docs**: [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- **JavaScript.info**: [The Modern JavaScript Tutorial](https://javascript.info/)

## Summary

JavaScript is the language that runs the modern web:

✅ Runs natively in every browser and on the server via Node.js
✅ First-class functions and closures enable powerful functional patterns
✅ Native async/await for clean asynchronous code
✅ Massive npm ecosystem for nearly any use case
✅ Continuously evolving language with yearly feature releases
✅ One language across frontend, backend, and mobile

Master JavaScript as the foundation for React, Node.js, and virtually every modern web stack!
