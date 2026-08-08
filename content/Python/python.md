## Introduction to Python

Python is a high-level, interpreted programming language known for its readable syntax and versatility. It's used across web development, data science, automation, machine learning, and scripting, with a philosophy that emphasizes code readability and developer productivity.

### Why Choose Python?

- **Readable Syntax**: Clean, English-like code that's easy to learn and maintain
- **Versatile**: Web backends, data science, automation, ML/AI, and scripting all in one language
- **Massive Ecosystem**: PyPI hosts hundreds of thousands of packages
- **Batteries Included**: A rich standard library covers most common tasks out of the box
- **Strong Community**: Extensive documentation, tutorials, and support
- **Dominant in Data & AI**: The default language for machine learning and data analysis

### Key Features

- **Dynamic Typing**: No need to declare variable types explicitly
- **Interpreted**: Runs directly without a separate compilation step
- **Multi-Paradigm**: Supports procedural, object-oriented, and functional styles
- **Extensive Standard Library**: File I/O, networking, JSON, regex, and more built in
- **List/Dict Comprehensions**: Concise, expressive syntax for building collections
- **Strong Package Ecosystem**: NumPy, Django, FastAPI, pandas, and thousands more

## Installation

### Windows Installation

```bash
# Download from https://python.org or use winget
winget install Python.Python.3.12

# Or using Chocolatey
choco install python

# Verify installation
python --version
pip --version
```

### macOS Installation

```bash
# Using Homebrew
brew install python@3.12

# Verify installation
python3 --version
pip3 --version
```

### Linux (Ubuntu/Debian) Installation

```bash
# Update package list
sudo apt update

# Install Python 3
sudo apt install python3 python3-pip python3-venv

# Verify installation
python3 --version
pip3 --version
```

## Getting Started

```bash
# Run a script
python3 app.py

# Start the interactive REPL
python3

# Create a virtual environment (isolate project dependencies)
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install packages
pip install requests

# Freeze dependencies
pip freeze > requirements.txt
pip install -r requirements.txt
```

```python
# hello.py
print("Hello, World!")
```

## Variables and Data Types

```python
# Basic types
name = "Alice"          # str
age = 30                 # int
price = 19.99            # float
is_active = True         # bool
nothing = None            # NoneType

# Collections
numbers = [1, 2, 3]              # list (mutable)
coordinates = (10, 20)           # tuple (immutable)
unique_ids = {1, 2, 3}           # set
user = {"name": "Alice", "age": 30}  # dict

# Type hints (optional but recommended)
def greet(name: str) -> str:
    return f"Hello, {name}!"

count: int = 0
items: list[str] = []
```

## Control Flow

```python
# Conditionals
age = 20
if age < 13:
    category = "child"
elif age < 20:
    category = "teen"
else:
    category = "adult"

# Loops
for i in range(5):
    print(i)

for item in ["a", "b", "c"]:
    print(item)

while count < 10:
    count += 1

# List comprehensions
squares = [x ** 2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# Dict comprehensions
squared_map = {x: x ** 2 for x in range(5)}
```

## Functions

```python
def add(a, b):
    return a + b

# Default arguments
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# Variable arguments
def sum_all(*args):
    return sum(args)

def build_config(**kwargs):
    return kwargs

# Type-hinted function
def calculate_total(items: list[float], tax_rate: float = 0.08) -> float:
    subtotal = sum(items)
    return subtotal * (1 + tax_rate)

# Lambda functions
square = lambda x: x ** 2

# Higher-order functions
numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
```

## Classes and Objects

```python
class Animal:
    def __init__(self, name: str, sound: str):
        self.name = name
        self.sound = sound

    def make_sound(self) -> str:
        return f"{self.name} says {self.sound}"

    def __str__(self):
        return f"Animal({self.name})"


class Dog(Animal):
    def __init__(self, name: str):
        super().__init__(name, "Woof")

    def fetch(self) -> str:
        return f"{self.name} fetches the ball!"


rex = Dog("Rex")
print(rex.make_sound())

# Dataclasses — reduce boilerplate for data-holding classes
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

    def distance_from_origin(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5

p = Point(3, 4)
print(p.distance_from_origin())  # 5.0
```

## Modules and Packages

```python
# math_utils.py
def add(a, b):
    return a + b

PI = 3.14159
```

```python
# app.py
import math_utils
from math_utils import add, PI

print(math_utils.add(2, 3))
print(add(2, 3))

# Standard library modules
import os
import json
import re
from datetime import datetime, timedelta
from pathlib import Path
```

## File Handling

```python
# Reading a file
with open("data.txt", "r") as f:
    content = f.read()

# Writing a file
with open("output.txt", "w") as f:
    f.write("Hello, file!")

# Reading line by line
with open("data.txt") as f:
    for line in f:
        print(line.strip())

# Working with JSON
import json

with open("config.json") as f:
    config = json.load(f)

with open("output.json", "w") as f:
    json.dump({"key": "value"}, f, indent=2)
```

## Exception Handling

```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
except (TypeError, ValueError) as e:
    print(f"Invalid input: {e}")
else:
    print("No exceptions occurred")
finally:
    print("Cleanup runs regardless")

# Custom exceptions
class InsufficientFundsError(Exception):
    def __init__(self, message: str, balance: float):
        super().__init__(message)
        self.balance = balance

def withdraw(balance: float, amount: float) -> float:
    if amount > balance:
        raise InsufficientFundsError("Not enough funds", balance)
    return balance - amount
```

## Iterators and Generators

```python
# Generator function — lazily produces values
def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

for num in count_up_to(5):
    print(num)

# Generator expressions (memory-efficient alternative to list comprehensions)
sum_of_squares = sum(x ** 2 for x in range(1000000))

# Custom iterator class
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1
```

## Decorators

```python
import functools
import time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time() - start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)

# Decorator with arguments
def retry(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == times - 1:
                        raise
                    print(f"Retry {attempt + 1}/{times}: {e}")
        return wrapper
    return decorator

@retry(times=3)
def fetch_data():
    ...
```

## Context Managers

```python
class DatabaseConnection:
    def __enter__(self):
        print("Opening connection")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print("Closing connection")

with DatabaseConnection() as conn:
    print("Using connection")

# Using contextlib for simpler cases
from contextlib import contextmanager

@contextmanager
def open_resource():
    print("Acquiring")
    yield "resource"
    print("Releasing")

with open_resource() as res:
    print(f"Using {res}")
```

## Async Programming

```python
import asyncio

async def fetch_data(id: int) -> dict:
    await asyncio.sleep(1)  # simulate I/O
    return {"id": id, "data": "example"}

async def main():
    # Run concurrently
    results = await asyncio.gather(
        fetch_data(1),
        fetch_data(2),
        fetch_data(3),
    )
    print(results)

asyncio.run(main())
```

## Working with pip and Virtual Environments

```bash
# Create an isolated environment per project
python3 -m venv .venv
source .venv/bin/activate

# Install and manage dependencies
pip install fastapi uvicorn
pip install -r requirements.txt
pip list --outdated
pip uninstall requests

# Using pyproject.toml with modern tools (Poetry, uv, pip-tools)
```

## Testing

```python
# Using pytest
import pytest

def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -1) == -2

@pytest.fixture
def sample_data():
    return {"name": "Alice", "age": 30}

def test_with_fixture(sample_data):
    assert sample_data["name"] == "Alice"

@pytest.mark.parametrize("a,b,expected", [(1, 2, 3), (0, 0, 0), (-1, 1, 0)])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected
```

```bash
# Run tests
pytest
pytest -v
pytest test_math.py::test_add
```

## Best Practices

- **Follow PEP 8** for consistent, readable code style
- **Use type hints** for better tooling support and self-documenting code
- **Prefer list/dict comprehensions** over manual loops when they improve clarity, but don't over-nest them
- **Always use virtual environments** to isolate project dependencies
- **Use `with` statements** for resource management (files, connections) instead of manual close calls
- **Write docstrings** for public functions, classes, and modules
- **Handle specific exceptions**, not a bare `except:` clause, to avoid masking bugs

## Resources

- **Official Documentation**: [docs.python.org](https://docs.python.org/3/)
- **PEP 8 Style Guide**: [PEP 8](https://peps.python.org/pep-0008/)
- **PyPI**: [pypi.org](https://pypi.org/)
- **Real Python**: [realpython.com](https://realpython.com/)

## Summary

Python's readability and versatility make it a top choice across domains:

✅ Clean, expressive syntax that's fast to learn and read
✅ Massive ecosystem spanning web, data, ML, and automation
✅ Rich standard library covering most everyday tasks
✅ Strong async support for I/O-bound concurrency
✅ Excellent tooling for testing, typing, and packaging
✅ The dominant language in data science and machine learning

Master Python to move fluidly between scripting, web backends, and data-driven applications!
