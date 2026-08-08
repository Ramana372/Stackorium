## Introduction to Spring Boot

Spring Boot is an opinionated extension of the Spring Framework that eliminates boilerplate configuration and lets you build production-ready applications with minimal setup. With auto-configuration, embedded servers, and starter dependencies, you can go from zero to a running REST API in minutes.

### Why Choose Spring Boot?

- **Auto-Configuration**: Sensible defaults configure Spring based on the dependencies on your classpath
- **Embedded Servers**: Ship a runnable JAR with Tomcat/Netty built in — no external server needed
- **Starter Dependencies**: Curated dependency bundles (`spring-boot-starter-web`, etc.) simplify Maven/Gradle setup
- **Production-Ready**: Built-in health checks, metrics, and monitoring via Actuator
- **Convention Over Configuration**: Minimal XML, mostly annotations and application properties
- **Massive Community**: The default choice for building Java microservices

### Key Features

- **Spring Boot Starters**: Pre-packaged dependency sets for common use cases
- **Auto-Configuration**: Automatically configures beans based on classpath contents
- **Embedded Servlet Containers**: Tomcat, Jetty, or Undertow bundled into the app
- **Spring Boot Actuator**: Production monitoring endpoints out of the box
- **Externalized Configuration**: `application.properties`/`application.yml`, profiles, environment variables
- **DevTools**: Automatic restarts and live reload during development

## Installation

### Creating a New Project

```bash
# Using Spring Initializr via curl
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,postgresql,validation,actuator \
  -d javaVersion=21 \
  -d type=maven-project \
  -d name=my-app \
  -o my-app.zip

unzip my-app.zip -d my-app
cd my-app

# Or use https://start.spring.io in a browser

# Run the application
./mvnw spring-boot:run
```

### Requirements

```bash
# Verify Java is installed (Spring Boot 3.x requires Java 17+)
java --version

# Verify Maven wrapper works
./mvnw --version
```

## Getting Started

```java
// Application.java — the entry point
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

```java
// A minimal REST controller
@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }
}
```

```bash
# Run the app
./mvnw spring-boot:run

# Build an executable JAR
./mvnw clean package
java -jar target/my-app-0.0.1-SNAPSHOT.jar
```

## Project Structure

```
src/
  main/
    java/com/example/app/
      Application.java         -> entry point
      controller/              -> REST controllers
      service/                 -> business logic
      repository/               -> data access layer
      model/                   -> entities/domain objects
      dto/                     -> request/response objects
      config/                  -> configuration classes
      exception/                -> custom exceptions & handlers
    resources/
      application.yml          -> configuration
      static/                  -> static web assets
      templates/                -> server-rendered templates
  test/
    java/com/example/app/      -> tests
```

## Starter Dependencies

```xml
<!-- pom.xml -->
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>
```

## Configuration

### application.yml

```yaml
spring:
  application:
    name: my-app

  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:postgres}

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

server:
  port: 8080

logging:
  level:
    root: INFO
    com.example.app: DEBUG
```

### Profiles

```yaml
# application-dev.yml
spring:
  jpa:
    show-sql: true

# application-prod.yml
spring:
  jpa:
    show-sql: false
logging:
  level:
    root: WARN
```

```bash
# Activate a profile
java -jar app.jar --spring.profiles.active=prod

# Or via environment variable
export SPRING_PROFILES_ACTIVE=prod
```

### Type-Safe Configuration Properties

```java
@ConfigurationProperties(prefix = "app.mail")
public record MailProperties(String host, int port, String username) {}
```

```yaml
app:
  mail:
    host: smtp.example.com
    port: 587
    username: notifications@example.com
```

```java
@SpringBootApplication
@EnableConfigurationProperties(MailProperties.class)
public class Application { }
```

## Building a REST API

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Page<Product> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return productService.findAll(PageRequest.of(page, size));
    }

    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody ProductRequest request) {
        Product created = productService.create(request);
        return ResponseEntity
            .created(URI.create("/api/products/" + created.getId()))
            .body(created);
    }
}
```

```java
public record ProductRequest(
    @NotBlank String name,
    @Positive BigDecimal price,
    @Min(0) Integer stock
) {}
```

## Data Access with Spring Data JPA

```java
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private BigDecimal price;
    private Integer stock;

    // constructors, getters, setters
}

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStockGreaterThan(int minStock);
    boolean existsByName(String name);
}
```

```java
@Service
@Transactional
public class ProductService {
    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Page<Product> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Product create(ProductRequest request) {
        if (repository.existsByName(request.name())) {
            throw new DuplicateProductException(request.name());
        }
        Product product = new Product(request.name(), request.price(), request.stock());
        return repository.save(product);
    }
}
```

## Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateProductException.class)
    public ResponseEntity<ApiError> handleDuplicate(DuplicateProductException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ApiError(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
        return ResponseEntity.badRequest().body(errors);
    }
}

public record ApiError(String message) {}
```

## Spring Boot Actuator

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, prometheus
  endpoint:
    health:
      show-details: always
```

```bash
# Health check
curl http://localhost:8080/actuator/health

# Application metrics
curl http://localhost:8080/actuator/metrics

# JVM memory metrics
curl http://localhost:8080/actuator/metrics/jvm.memory.used
```

## Scheduling and Async Tasks

```java
@SpringBootApplication
@EnableScheduling
@EnableAsync
public class Application { }

@Component
public class ReportScheduler {

    @Scheduled(cron = "0 0 2 * * *") // every day at 2 AM
    public void generateDailyReport() {
        System.out.println("Generating report...");
    }

    @Scheduled(fixedRate = 60000) // every 60 seconds
    public void healthPing() { }
}

@Service
public class NotificationService {

    @Async
    public CompletableFuture<Void> sendEmail(String to) {
        // long-running task runs on a separate thread
        return CompletableFuture.completedFuture(null);
    }
}
```

## Caching

```java
@SpringBootApplication
@EnableCaching
public class Application { }

@Service
public class ProductService {

    @Cacheable("products")
    public Product findById(Long id) {
        return repository.findById(id).orElseThrow();
    }

    @CacheEvict(value = "products", key = "#id")
    public void update(Long id, ProductRequest request) {
        // update logic
    }
}
```

## Testing

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProductControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void createsProduct() {
        ProductRequest request = new ProductRequest("Widget", new BigDecimal("9.99"), 100);

        ResponseEntity<Product> response = restTemplate.postForEntity(
            "/api/products", request, Product.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody().getId());
    }
}

@DataJpaTest
class ProductRepositoryTest {

    @Autowired
    private ProductRepository repository;

    @Test
    void findsProductsInStock() {
        repository.save(new Product("Widget", new BigDecimal("9.99"), 10));
        List<Product> results = repository.findByStockGreaterThan(5);
        assertEquals(1, results.size());
    }
}
```

## Building a Container Image

```dockerfile
# Multi-stage Dockerfile for a Spring Boot app
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
# Or use Spring Boot's built-in buildpacks support
./mvnw spring-boot:build-image
```

## Best Practices

- **Use starters instead of individual dependencies** to get compatible, tested version combinations
- **Externalize all environment-specific config** via `application-{profile}.yml` and environment variables
- **Enable Actuator health checks** for use with Kubernetes liveness/readiness probes
- **Use DTOs (records) for request/response payloads**, never expose JPA entities directly in APIs
- **Validate input with `@Valid` and Bean Validation annotations** at the controller boundary
- **Write both slice tests** (`@WebMvcTest`, `@DataJpaTest`) and full integration tests (`@SpringBootTest`)
- **Keep `ddl-auto` off `update`/`create` in production** — use a migration tool like Flyway or Liquibase instead

## Resources

- **Official Documentation**: [Spring Boot Docs](https://docs.spring.io/spring-boot/documentation.html)
- **Spring Initializr**: [start.spring.io](https://start.spring.io/)
- **Spring Boot Actuator Reference**: [Actuator Docs](https://docs.spring.io/spring-boot/reference/actuator/)
- **Baeldung Spring Boot Guides**: [baeldung.com/spring-boot](https://www.baeldung.com/spring-boot)

## Summary

Spring Boot is the fastest path from idea to production-ready Java service:

✅ Auto-configuration eliminates boilerplate setup
✅ Embedded servers produce a single runnable JAR
✅ Curated starters simplify dependency management
✅ Built-in observability via Actuator health and metrics
✅ Seamless integration with Spring Data, Security, and messaging
✅ The default choice for Java microservices and REST APIs

Master Spring Boot to ship production-ready Java backends with minimal ceremony!
