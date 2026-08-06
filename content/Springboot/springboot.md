## Introduction to Spring Boot

Spring Boot is a powerful framework for building production-ready Spring-based applications with minimal configuration. It simplifies the development of stand-alone, production-grade applications by providing a convention-over-configuration approach, embedded servers, and auto-configuration capabilities.

### Why Choose Spring Boot?

- **Rapid Development**: Get started quickly with minimal configuration
- **Production-Ready**: Built-in features for monitoring, health checks, and metrics
- **Microservices**: Perfect for building microservices architectures
- **Auto-Configuration**: Automatically configures Spring application based on dependencies
- **Embedded Servers**: Run applications without external server deployment
- **Spring Ecosystem**: Full access to Spring Framework features and libraries

### Key Features

- **Starter Dependencies**: Pre-configured dependency sets for common use cases
- **Embedded Servers**: Tomcat, Jetty, or Undertow embedded by default
- **Auto-Configuration**: Automatic configuration based on classpath
- **Actuator**: Production-ready features for monitoring and management
- **Spring Boot CLI**: Command-line tool for rapid prototyping
- **DevTools**: Development-time features like automatic restart and live reload
- **Externalized Configuration**: Configure applications via properties or YAML
- **Spring Data Integration**: Simplified database access and ORM

## Installation

### Prerequisites

```bash
# Check Java version (requires Java 17 or later)
java -version

# Install Java if needed
# Windows (using Chocolatey)
choco install openjdk17

# macOS (using Homebrew)
brew install openjdk@17

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install openjdk-17-jdk
```

### Spring Boot CLI Installation

```bash
# Windows (using Chocolatey)
choco install springboot

# macOS (using Homebrew)
brew tap spring-io/tap
brew install spring-boot

# Linux (using SDKMAN)
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install springboot

# Verify installation
spring --version
```

### IDE Setup

**IntelliJ IDEA:**
- Download from https://www.jetbrains.com/idea/
- Spring Boot plugin included by default
- Ultimate Edition recommended for full Spring support

**Visual Studio Code:**
```bash
# Install VS Code
# Add Spring Boot Extension Pack from marketplace
# Extensions: Spring Boot Tools, Spring Initializr, Spring Boot Dashboard
```

**Eclipse STS (Spring Tool Suite):**
- Download from https://spring.io/tools
- Pre-configured with Spring Boot support

## Creating a Spring Boot Project

### Using Spring Initializr (Recommended)

**Web Interface:**
1. Visit https://start.spring.io/
2. Configure project:
   - Project: Maven or Gradle
   - Language: Java
   - Spring Boot Version: 3.2.x (latest stable)
   - Group: com.example
   - Artifact: demo
   - Packaging: Jar
   - Java Version: 17 or 21
3. Add Dependencies (e.g., Spring Web, Spring Data JPA)
4. Generate and download the project

**Command Line:**
```bash
# Using Spring Boot CLI
spring init --dependencies=web,data-jpa,mysql my-app
cd my-app

# Using curl
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,mysql \
  -d name=my-app \
  -d packageName=com.example.myapp \
  -o my-app.zip
unzip my-app.zip
cd my-app
```

### Maven Project Structure

```
my-app/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── myapp/
│   │   │               ├── MyAppApplication.java
│   │   │               ├── controller/
│   │   │               ├── service/
│   │   │               ├── repository/
│   │   │               └── model/
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/
├── pom.xml
└── mvnw (Maven Wrapper)
```

## Basic Spring Boot Application

### Main Application Class

```java
package com.example.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyAppApplication.class, args);
    }
}
```

### Simple REST Controller

```java
package com.example.myapp.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HelloController {
    
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, Spring Boot!";
    }
    
    @GetMapping("/hello/{name}")
    public String sayHelloToName(@PathVariable String name) {
        return "Hello, " + name + "!";
    }
    
    @PostMapping("/greet")
    public String greet(@RequestBody GreetingRequest request) {
        return "Hello, " + request.getName() + "! Welcome!";
    }
}

// Request DTO
class GreetingRequest {
    private String name;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

### Running the Application

```bash
# Using Maven
./mvnw spring-boot:run

# Or using Gradle
./gradlew bootRun

# Or run the JAR
./mvnw clean package
java -jar target/my-app-0.0.1-SNAPSHOT.jar

# Application runs on http://localhost:8080
```

## Configuration

### application.properties

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Application Name
spring.application.name=my-app

# Database Configuration (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.root=INFO
logging.level.com.example.myapp=DEBUG
logging.file.name=logs/application.log

# Actuator
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

### application.yml (Alternative)

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: my-app
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true

logging:
  level:
    root: INFO
    com.example.myapp: DEBUG
  file:
    name: logs/application.log
```

## Spring Data JPA

### Entity Class

```java
package com.example.myapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String firstName;
    private String lastName;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### Repository Interface

```java
package com.example.myapp.repository;

import com.example.myapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Method naming convention queries
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByFirstNameContaining(String firstName);
    
    // Custom JPQL query
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> findUserByEmail(String email);
    
    // Native query
    @Query(value = "SELECT * FROM users WHERE username = :username", nativeQuery = true)
    Optional<User> findByUsernameNative(String username);
    
    // Check existence
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
```

### Service Layer

```java
package com.example.myapp.service;

import com.example.myapp.model.User;
import com.example.myapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
```

### REST Controller

```java
package com.example.myapp.controller;

import com.example.myapp.model.User;
import com.example.myapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

## Exception Handling

### Global Exception Handler

```java
package com.example.myapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {
        
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

// Custom exception
class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

// Error response model
class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private String path;
    
    // Constructor, getters, setters
    public ErrorResponse(LocalDateTime timestamp, int status, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.path = path;
    }
    
    // Getters and setters...
}
```

## Spring Security

### Security Configuration

```java
package com.example.myapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .httpBasic();
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## Testing

### Unit Test

```java
package com.example.myapp.service;

import com.example.myapp.model.User;
import com.example.myapp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void testGetUserById() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        Optional<User> result = userService.getUserById(1L);
        
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
        verify(userRepository, times(1)).findById(1L);
    }
}
```

### Integration Test

```java
package com.example.myapp.controller;

import com.example.myapp.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    void testCreateUser() throws Exception {
        User user = new User();
        user.setUsername("newuser");
        user.setEmail("newuser@example.com");
        user.setPassword("password123");
        
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("newuser"));
    }
}
```

## Spring Boot Actuator

### Add Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Actuator Endpoints

```properties
# Expose all actuator endpoints
management.endpoints.web.exposure.include=*

# Custom health indicators
management.endpoint.health.show-details=always
management.endpoint.health.show-components=always

# Custom application info
info.app.name=My Spring Boot App
info.app.description=A production-ready Spring Boot application
info.app.version=1.0.0
```

### Access Actuator Endpoints

```bash
# Health check
curl http://localhost:8080/actuator/health

# Application metrics
curl http://localhost:8080/actuator/metrics

# Environment properties
curl http://localhost:8080/actuator/env

# Application info
curl http://localhost:8080/actuator/info
```

## Deployment

### Create Executable JAR

```bash
# Maven
./mvnw clean package

# Gradle
./gradlew bootJar

# Run the JAR
java -jar target/my-app-0.0.1-SNAPSHOT.jar
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/my-app-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Build and Run:**
```bash
# Build Docker image
docker build -t my-spring-boot-app .

# Run container
docker run -p 8080:8080 my-spring-boot-app
```

## Best Practices

### Project Structure

```java
com.example.myapp
├── MyAppApplication.java
├── config/          // Configuration classes
├── controller/      // REST controllers
├── service/         // Business logic
├── repository/      // Data access layer
├── model/           // Entity classes
├── dto/             // Data Transfer Objects
├── exception/       // Custom exceptions
└── util/            // Utility classes
```

### Use DTOs

```java
// Request DTO
public class UserRequest {
    private String username;
    private String email;
    private String password;
    // Getters and setters
}

// Response DTO
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    // Getters and setters
}
```

### Validation

```java
import jakarta.validation.constraints.*;

public class UserRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20)
    private String username;
    
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}

// In controller
@PostMapping
public ResponseEntity<User> createUser(@Valid @RequestBody UserRequest request) {
    // ...
}
```

## Resources

- **Official Documentation**: [Spring Boot Docs](https://spring.io/projects/spring-boot)
- **Spring Initializr**: [start.spring.io](https://start.spring.io/)
- **Spring Guides**: [spring.io/guides](https://spring.io/guides)
- **Baeldung**: [baeldung.com/spring-boot](https://www.baeldung.com/spring-boot)
- **Spring Boot Reference**: [Spring Boot Reference Guide](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)

## Summary

Spring Boot simplifies Java application development with:

✅ Auto-configuration and starter dependencies
✅ Embedded servers (no external deployment needed)
✅ Production-ready features (Actuator)
✅ Easy database integration with Spring Data
✅ RESTful API development
✅ Security integration
✅ Comprehensive testing support
✅ Microservices architecture support

Master Spring Boot to build enterprise-grade Java applications quickly and efficiently!
