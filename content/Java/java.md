## Introduction to Java

Java is a statically-typed, object-oriented programming language designed to run anywhere via the "write once, run anywhere" philosophy. Code compiles to bytecode that runs on the Java Virtual Machine (JVM), giving Java portability across operating systems along with strong performance and a massive enterprise ecosystem.

### Why Choose Java?

- **Platform Independent**: The JVM runs compiled bytecode on any OS
- **Strongly Typed**: Compile-time type checking catches many bugs before runtime
- **Mature Ecosystem**: Decades of libraries, frameworks, and enterprise tooling
- **Performance**: JIT compilation gives near-native execution speed
- **Backward Compatible**: Code written decades ago often still runs on modern JVMs
- **Enterprise Standard**: Powers banking systems, Android apps, and large-scale backends

### Key Features

- **Object-Oriented**: Classes, interfaces, inheritance, and polymorphism
- **Automatic Memory Management**: Garbage collection handles memory cleanup
- **Rich Standard Library**: Collections, streams, concurrency utilities, and I/O built in
- **Strong Typing**: Generics and compile-time checks reduce runtime errors
- **Multithreading**: Built-in support for concurrent programming
- **Massive Build Ecosystem**: Maven and Gradle for dependency management and builds

## Installation

### Windows Installation

```bash
# Using Chocolatey
choco install openjdk

# Or download from https://adoptium.net (Eclipse Temurin)

# Verify installation
java --version
javac --version
```

### macOS Installation

```bash
# Using Homebrew
brew install openjdk

# Link it so the system finds it
sudo ln -sfn /opt/homebrew/opt/openjdk/libexec/openjdk.jdk \
  /Library/Java/JavaVirtualMachines/openjdk.jdk

# Verify installation
java --version
javac --version
```

### Linux (Ubuntu/Debian) Installation

```bash
# Update package list
sudo apt update

# Install OpenJDK (LTS version)
sudo apt install openjdk-21-jdk

# Verify installation
java --version
javac --version

# Set JAVA_HOME if needed
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which javac))))
```

## Getting Started

```java
// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

```bash
# Compile
javac HelloWorld.java

# Run
java HelloWorld

# Or run directly with the newer single-file launch (Java 11+)
java HelloWorld.java
```

## Variables and Data Types

```java
// Primitive types
int age = 30;
long population = 8_000_000_000L;
double price = 19.99;
float rate = 3.5f;
boolean isActive = true;
char grade = 'A';
byte small = 127;
short medium = 32000;

// Reference types
String name = "Alice";
Integer boxedInt = 42; // wrapper class

// Type inference (Java 10+)
var total = 100;
var message = "Inferred as String";

// Constants
final double PI = 3.14159;
```

## Classes and Objects

```java
public class Person {
    // Fields
    private String name;
    private int age;

    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Methods
    public String greet() {
        return "Hello, I'm " + name;
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}

// Usage
Person alice = new Person("Alice", 30);
System.out.println(alice.greet());
```

## Inheritance and Polymorphism

```java
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public abstract String makeSound();

    public String describe() {
        return name + " says " + makeSound();
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }

    @Override
    public String makeSound() {
        return "Woof";
    }
}

public class Cat extends Animal {
    public Cat(String name) {
        super(name);
    }

    @Override
    public String makeSound() {
        return "Meow";
    }
}

// Polymorphism in action
List<Animal> animals = List.of(new Dog("Rex"), new Cat("Whiskers"));
for (Animal animal : animals) {
    System.out.println(animal.describe());
}
```

## Interfaces

```java
public interface Shape {
    double area();
    double perimeter();

    // Default method (Java 8+)
    default String describe() {
        return "Area: " + area() + ", Perimeter: " + perimeter();
    }
}

public class Circle implements Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public double perimeter() {
        return 2 * Math.PI * radius;
    }
}
```

## Collections Framework

```java
import java.util.*;

// List
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.get(0);
names.remove("Bob");

// Set
Set<Integer> uniqueNumbers = new HashSet<>(List.of(1, 2, 2, 3));

// Map
Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 30);
ages.get("Alice");
ages.getOrDefault("Bob", 0);

for (Map.Entry<String, Integer> entry : ages.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Immutable collections
List<String> immutableList = List.of("a", "b", "c");
```

## Streams API

```java
import java.util.stream.*;

List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Filter, map, collect
List<Integer> evenSquares = numbers.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .collect(Collectors.toList());

// Reduce
int sum = numbers.stream().reduce(0, Integer::sum);

// Grouping
List<String> words = List.of("apple", "banana", "avocado", "blueberry");
Map<Character, List<String>> grouped = words.stream()
    .collect(Collectors.groupingBy(w -> w.charAt(0)));

// Sorting
List<String> sorted = words.stream()
    .sorted(Comparator.reverseOrder())
    .toList();

// Parallel streams for large datasets
long count = numbers.parallelStream().filter(n -> n > 5).count();
```

## Exception Handling

```java
public class BankAccount {
    private double balance;

    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException("Not enough funds");
        }
        balance -= amount;
    }
}

// Custom checked exception
public class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

// Try-catch-finally
try {
    account.withdraw(1000);
} catch (InsufficientFundsException e) {
    System.err.println("Error: " + e.getMessage());
} finally {
    System.out.println("Transaction attempt complete");
}

// Try-with-resources (auto-closes resources)
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line = reader.readLine();
} catch (IOException e) {
    e.printStackTrace();
}
```

## Generics

```java
public class Box<T> {
    private T content;

    public void set(T content) {
        this.content = content;
    }

    public T get() {
        return content;
    }
}

Box<String> stringBox = new Box<>();
stringBox.set("Hello");

// Bounded type parameters
public static <T extends Comparable<T>> T max(List<T> items) {
    return items.stream().max(Comparable::compareTo).orElseThrow();
}
```

## Concurrency

```java
// Creating and running a thread
Thread thread = new Thread(() -> {
    System.out.println("Running in a separate thread");
});
thread.start();

// ExecutorService for managed thread pools
ExecutorService executor = Executors.newFixedThreadPool(4);
executor.submit(() -> System.out.println("Task executed"));
executor.shutdown();

// CompletableFuture for async composition
CompletableFuture<String> future = CompletableFuture
    .supplyAsync(() -> fetchData())
    .thenApply(data -> process(data));

// Synchronized blocks for thread safety
public synchronized void increment() {
    counter++;
}
```

## Records (Java 16+)

```java
// Immutable data carrier, auto-generates constructor, getters, equals, hashCode, toString
public record Point(int x, int y) {
    public double distanceFromOrigin() {
        return Math.sqrt(x * x + y * y);
    }
}

Point p = new Point(3, 4);
System.out.println(p.x()); // 3
System.out.println(p.distanceFromOrigin()); // 5.0
```

## Build Tools

### Maven

```xml
<!-- pom.xml -->
<project>
  <groupId>com.example</groupId>
  <artifactId>my-app</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.0</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

```bash
mvn compile
mvn test
mvn package
mvn clean install
```

### Gradle

```groovy
// build.gradle
plugins {
    id 'java'
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
}
```

```bash
./gradlew build
./gradlew test
./gradlew run
```

## Testing

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    @Test
    void addsTwoNumbers() {
        Calculator calc = new Calculator();
        assertEquals(5, calc.add(2, 3));
    }

    @Test
    void throwsOnDivideByZero() {
        Calculator calc = new Calculator();
        assertThrows(ArithmeticException.class, () -> calc.divide(1, 0));
    }
}
```

## Best Practices

- **Favor composition over inheritance** where possible to reduce coupling
- **Use interfaces to define contracts**, and program against them rather than concrete classes
- **Prefer immutable objects** (records, `final` fields) to reduce shared-state bugs
- **Use try-with-resources** for anything implementing `AutoCloseable`
- **Avoid checked exceptions for recoverable, expected conditions** — reserve them for truly exceptional cases
- **Use the Streams API for declarative collection processing** instead of manual loops where it improves clarity
- **Manage dependencies with Maven or Gradle**, never manual JARs, for reproducible builds

## Resources

- **Official Documentation**: [Oracle Java Docs](https://docs.oracle.com/en/java/)
- **OpenJDK**: [openjdk.org](https://openjdk.org/)
- **Baeldung**: [Java Tutorials](https://www.baeldung.com/)
- **Maven Central**: [search.maven.org](https://search.maven.org/)

## Summary

Java remains a cornerstone language for enterprise and large-scale software:

✅ Platform-independent execution via the JVM
✅ Strong static typing catches errors at compile time
✅ Mature, battle-tested standard library and ecosystem
✅ Modern features — records, streams, pattern matching, virtual threads
✅ Excellent concurrency support for high-throughput systems
✅ Foundation for Spring, Android, and countless enterprise platforms

Master Java to build robust, scalable, and portable applications!
