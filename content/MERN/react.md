## Introduction to React

React is a declarative, component-based JavaScript library for building user interfaces, created and maintained by Meta. Instead of manually manipulating the DOM, you describe what the UI should look like for a given state, and React efficiently updates the DOM when that state changes.

### Why Choose React?

- **Component-Based**: Build encapsulated components that manage their own state, then compose them
- **Declarative**: Describe the desired UI; React handles the DOM updates
- **Virtual DOM**: Efficient diffing minimizes expensive real DOM operations
- **Huge Ecosystem**: Massive library of tools, UI kits, and community support
- **Learn Once, Write Anywhere**: React Native brings the same model to mobile apps
- **Strong Tooling**: Excellent dev tools, fast refresh, and mature build pipelines (Vite, Next.js)

### Key Features

- **JSX**: Write markup directly in JavaScript for a familiar, expressive syntax
- **Hooks**: Functions like `useState` and `useEffect` bring state and lifecycle to function components
- **Unidirectional Data Flow**: Props flow down, events flow up — predictable state management
- **Component Composition**: Build complex UIs from small, reusable pieces
- **Concurrent Rendering**: React 18+ can interrupt and prioritize rendering work
- **Server Components**: Render components on the server with frameworks like Next.js

## Installation

### Setting Up a New Project

```bash
# Using Vite (recommended, fast)
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev

# Using Next.js (full-stack framework with React)
npx create-next-app@latest my-app
cd my-app
npm run dev

# Verify installation
npm list react
```

### Adding React to an Existing Project

```bash
npm install react react-dom

# TypeScript types
npm install -D @types/react @types/react-dom
```

## Getting Started

```jsx
// App.jsx
function App() {
  return (
    <div>
      <h1>Hello, React!</h1>
    </div>
  );
}

export default App;
```

```jsx
// main.jsx
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(<App />);
```

## JSX Basics

```jsx
function Greeting({ name, isLoggedIn }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      {isLoggedIn ? <p>Welcome back</p> : <p>Please log in</p>}
      {isLoggedIn && <button>Log out</button>}
    </div>
  );
}

// Lists require a unique "key" prop
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

## Components and Props

```jsx
// Function component with props
function Button({ label, onClick, variant = 'primary' }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}

// Usage
function App() {
  return <Button label="Save" onClick={() => console.log('Saved!')} variant="success" />;
}

// Children prop for composition
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Card title="Profile">
      <p>Name: Jane Doe</p>
    </Card>
  );
}
```

## State with useState

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount((prev) => prev - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Object/array state updates should create new references
function TodoApp() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, done: false }]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  return null; // render UI using todos, addTodo, toggleTodo
}
```

## Effects with useEffect

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      });

    // Cleanup function — runs before re-run or unmount
    return () => {
      cancelled = true;
    };
  }, [userId]); // dependency array — effect re-runs when userId changes

  if (loading) return <p>Loading...</p>;
  return <p>{user.name}</p>;
}

// Effect that runs once on mount (empty dependency array)
useEffect(() => {
  console.log('Component mounted');
}, []);
```

## Other Built-In Hooks

```jsx
import { useRef, useMemo, useCallback, useContext, useReducer } from 'react';

// useRef — persist a mutable value without triggering re-renders
function TextInput() {
  const inputRef = useRef(null);
  const focusInput = () => inputRef.current.focus();
  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}

// useMemo — memoize expensive computations
function ExpensiveList({ items, filter }) {
  const filtered = useMemo(
    () => items.filter((i) => i.category === filter),
    [items, filter],
  );
  return <ul>{filtered.map((i) => <li key={i.id}>{i.name}</li>)}</ul>;
}

// useCallback — memoize function references
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  return <Child onClick={handleClick} />;
}

// useReducer — for complex state logic
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error('Unknown action');
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```

## Context API

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(undefined);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

function ThemedButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current theme: {theme}</button>;
}
```

## Custom Hooks

```jsx
// Reusable logic extracted into a custom hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

## Forms

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Log In</button>
    </form>
  );
}
```

## Conditional Rendering and Lists

```jsx
function StatusBadge({ status }) {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <ErrorMessage />;
  return <SuccessIcon />;
}

function ProductGrid({ products }) {
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Performance Optimization

```jsx
import { memo } from 'react';

// Prevent re-renders when props haven't changed
const ProductCard = memo(function ProductCard({ product }) {
  return <div>{product.name}</div>;
});

// Lazy loading components
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <Dashboard />
    </Suspense>
  );
}
```

## React Router (Common Companion Library)

```bash
npm install react-router-dom
```

```jsx
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

function AppRouter() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <button onClick={() => navigate('/')}>Back home ({id})</button>;
}
```

## Best Practices

- **Keep components small and focused** — one responsibility per component
- **Lift state up** only as far as necessary; avoid unnecessary global state
- **Always provide a stable `key`** when rendering lists — avoid array index for dynamic lists
- **Extract reusable logic into custom hooks** rather than duplicating it across components
- **Avoid unnecessary `useEffect`** — derive values during render when possible instead of syncing state
- **Memoize expensive computations and callbacks** only when profiling shows it matters
- **Colocate state with the components that use it** to minimize re-render scope

## Resources

- **Official Documentation**: [react.dev](https://react.dev/)
- **React Router**: [React Router Docs](https://reactrouter.com/)
- **Next.js**: [Next.js Docs](https://nextjs.org/docs)
- **React DevTools**: [Browser Extension](https://react.dev/learn/react-developer-tools)

## Summary

React is the dominant library for building modern, interactive UIs:

✅ Declarative, component-based architecture
✅ Powerful hooks for state, effects, and reusable logic
✅ Efficient rendering via the virtual DOM
✅ Massive ecosystem — routing, state management, frameworks
✅ Transfers directly to mobile via React Native
✅ Backed by a huge community and continuous innovation

Master React to build fast, maintainable, component-driven user interfaces!
