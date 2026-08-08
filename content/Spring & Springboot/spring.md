## Introduction to Spring Framework

Spring is a comprehensive application framework for Java that provides infrastructure support for building enterprise applications. Its core innovation is Inversion of Control (IoC) via Dependency Injection, which decouples components and makes applications easier to test, maintain, and extend.

### Why Choose Spring?

- **Dependency Injection**: Decouples object creation from business logic
- **Modular**: Use only the modules you need — Core, MVC, Data, Security, and more
- **Aspect-Oriented Programming**: Cleanly separate cross-cutting concerns like logging and transactions
- **Extensive Integration**: First-class support for databases, messaging, caching, and more
- **Testability**: DI makes mocking and unit testing straightforward
- **Industry Standard**: The dominant framework for enterprise Java applications

### Key Features

- **IoC Container**: Manages object creation and lifecycle (beans)
- **Dependency Injection**: Constructor, setter, or field-based injection of dependencies
- **AOP (Aspect-Oriented Programming)**: Cross-cutting concerns like logging, security, transactions
- **Spring MVC**: Web framework for building REST APIs and web apps
- **Spring Data**: Simplified data access across SQL, NoSQL, and more
- **Spring Security**: Comprehensive authentication and authorization framework

## Installation

### Setting Up a Spring Project

```bash
# Using Spring Initializr (recommended) — generates a project with dependencies
# Visit https://start.spring.io or use curl:
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,security \
  -d javaVersion=21 \
  -d type=maven-project \
  -o my-app.zip

unzip my-app.zip -d my-app
cd my-app

# Build and run
./mvnw spring-boot:run
```

### Manual Maven Dependency

```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-context</artifactId>
  <version>6.1.0</version>
</dependency>
```

## Core Concepts: IoC and Dependency Injection

```java
// A plain Java class managed by Spring — a "bean"
@Component
public class EmailService {
    public void send(String to, String message) {
        System.out.println("Sending to " + to + ": " + message);
    }
}

// Constructor injection (recommended approach)
@Component
public class NotificationService {
    private final EmailService emailService;

    public NotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void notifyUser(String email) {
        emailService.send(email, "You have a new notification");
    }
}
```

### Configuration Classes

```java
@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper().registerModule(new JavaTimeModule());
    }
}
```

### Component Scanning

```java
@Configuration
@ComponentScan(basePackages = "com.example.app")
public class AppConfig {
}

// Stereotype annotations Spring scans for:
// @Component  - generic bean
// @Service    - business logic layer
// @Repository - data access layer (also translates exceptions)
// @Controller - web layer (MVC)
```

## Dependency Injection Patterns

```java
// Field injection (works, but harder to test — avoid in new code)
@Component
public class OrderService {
    @Autowired
    private PaymentService paymentService;
}

// Setter injection
@Component
public class OrderService {
    private PaymentService paymentService;

    @Autowired
    public void setPaymentService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}

// Constructor injection (preferred — enables immutability and easy testing)
@Component
public class OrderService {
    private final PaymentService paymentService;

    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}

// Qualifying between multiple implementations
@Component
public class OrderService {
    private final PaymentService paymentService;

    public OrderService(@Qualifier("stripePaymentService") PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```

## Bean Scopes and Lifecycle

```java
@Component
@Scope("singleton") // default — one instance per container
public class ConfigService {}

@Component
@Scope("prototype") // new instance every time it's requested
public class RequestHandler {}

@Component
public class DatabaseConnection {

    @PostConstruct
    public void init() {
        System.out.println("Connection established");
    }

    @PreDestroy
    public void cleanup() {
        System.out.println("Connection closed");
    }
}
```

## Aspect-Oriented Programming (AOP)

```java
@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.example.app.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("Calling: " + joinPoint.getSignature().getName());
    }

    @Around("@annotation(com.example.app.Timed)")
    public Object logExecutionTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();
        System.out.println("Took " + (System.currentTimeMillis() - start) + "ms");
        return result;
    }
}
```

## Spring MVC (Web Layer)

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User create(@Valid @RequestBody CreateUserRequest request) {
        return userService.create(request);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return userService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

### Request Handling Details

```java
@RestController
public class SearchController {

    @GetMapping("/search")
    public List<Result> search(
        @RequestParam String query,
        @RequestParam(defaultValue = "1") int page,
        @RequestHeader("X-Client-Version") String clientVersion
    ) {
        return searchService.search(query, page);
    }
}

// Global exception handling
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
}
```

## Spring Data JPA

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String name;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;

    // getters and setters
}

// Repository interface — Spring generates the implementation
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String name);

    @Query("SELECT u FROM User u WHERE u.orders.size > :minOrders")
    List<User> findFrequentBuyers(@Param("minOrders") int minOrders);
}
```

```java
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User create(CreateUserRequest request) {
        User user = new User();
        user.setEmail(request.email());
        user.setName(request.name());
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
```

## Transactions

```java
@Service
public class TransferService {

    @Transactional
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        Account from = accountRepository.findById(fromId).orElseThrow();
        Account to = accountRepository.findById(toId).orElseThrow();

        from.withdraw(amount);
        to.deposit(amount);

        accountRepository.save(from);
        accountRepository.save(to);
        // If any exception is thrown, the entire transaction rolls back
    }

    @Transactional(readOnly = true)
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
}
```

## Spring Security Basics

```java
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
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## Testing

```java
@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Test
    void findsUserById() {
        User mockUser = new User(1L, "jane@example.com", "Jane");
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        Optional<User> result = userService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Jane", result.get().getName());
    }
}

// Web layer test (only loads MVC infrastructure, not the full context)
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void getAllReturnsUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk());
    }
}
```

## Best Practices

- **Prefer constructor injection** over field injection — it makes dependencies explicit and testable
- **Keep controllers thin** — delegate business logic to service classes
- **Use `@Transactional` at the service layer**, not the repository or controller layer
- **Program to interfaces** for repositories and services to keep implementations swappable
- **Use DTOs for request/response bodies** rather than exposing JPA entities directly
- **Centralize exception handling** with `@RestControllerAdvice`
- **Write slice tests** (`@WebMvcTest`, `@DataJpaTest`) for faster, focused test feedback

## Resources

- **Official Documentation**: [Spring Framework Docs](https://docs.spring.io/spring-framework/reference/)
- **Spring Initializr**: [start.spring.io](https://start.spring.io/)
- **Spring Guides**: [spring.io/guides](https://spring.io/guides)
- **Baeldung Spring Tutorials**: [baeldung.com/spring-tutorial](https://www.baeldung.com/spring-tutorial)

## Summary

Spring is the foundational framework for enterprise Java development:

✅ Dependency Injection decouples and simplifies application design
✅ Modular architecture — use only what you need
✅ AOP handles cross-cutting concerns cleanly
✅ Deep integration with data access, security, and messaging
✅ Excellent testability through DI and mocking support
✅ The backbone underneath Spring Boot's rapid development model

Master Spring to build well-structured, testable, and maintainable Java applications!
