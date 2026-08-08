## Introduction to Docker

Docker is a platform for building, shipping, and running applications inside lightweight, portable containers. Containers package an application with everything it needs to run — code, runtime, libraries, and system tools — so it behaves identically across development, testing, and production environments.

### Why Choose Docker?

- **Consistency**: "Works on my machine" becomes "works everywhere"
- **Lightweight**: Containers share the host OS kernel, unlike full virtual machines
- **Fast Startup**: Containers start in seconds, not minutes
- **Portability**: Run the same image on a laptop, a CI server, or the cloud
- **Isolation**: Each container runs in its own isolated process space
- **Ecosystem**: Massive library of prebuilt images via Docker Hub

### Key Features

- **Images & Containers**: Immutable image layers and their running instances
- **Dockerfile**: Declarative build instructions for reproducible images
- **Docker Compose**: Multi-container application orchestration
- **Volumes**: Persistent storage that outlives a container's lifecycle
- **Networking**: Isolated virtual networks for container-to-container communication
- **Registries**: Docker Hub and private registries for storing and distributing images

**Core Benefits:**
- Package applications with all dependencies
- Consistent environment from dev to production
- Lightweight compared to virtual machines
- Fast startup and deployment
- Portable across different platforms

**Initial Setup:**
```bash
# Verify installation
docker --version

# Test Docker is working
docker run hello-world
```

---

## Core Concepts

**Container vs Virtual Machine:**
- **Containers**: Share host OS kernel, lightweight, fast startup
- **VMs**: Full OS per instance, heavier, slower startup

**Key Components:**
1. **Image** - Read-only template with application code
2. **Container** - Running instance of an image
3. **Dockerfile** - Instructions to build an image
4. **Registry** - Storage for Docker images (Docker Hub)

```bash
# Check Docker info
docker info
```

---

## Working with Images

**Pull Images:**
```bash
# Pull from Docker Hub
docker pull nginx

# Pull specific version
docker pull nginx:1.25

# Pull from different registry
docker pull gcr.io/project/image
```

**List Images:**
```bash
# List all images
docker images

# List with filters
docker images --filter "dangling=true"
```

**Remove Images:**
```bash
# Remove specific image
docker rmi nginx

# Remove by ID
docker rmi abc123

# Force remove
docker rmi -f nginx

# Remove all unused images
docker image prune -a
```

**Search Images:**
```bash
# Search Docker Hub
docker search nginx
```

---

## Running Containers

**Basic Run:**
```bash
# Run container
docker run nginx

# Run in background (detached)
docker run -d nginx

# Run with name
docker run -d --name my-nginx nginx

# Run and remove after stop
docker run --rm nginx
```

**Port Mapping:**
```bash
# Map port 80 to 8080
docker run -d -p 8080:80 nginx

# Map multiple ports
docker run -d -p 8080:80 -p 8443:443 nginx

# Map all ports
docker run -d -P nginx
```

**Environment Variables:**
```bash
# Set single variable
docker run -d -e DB_HOST=localhost mysql

# Set multiple variables
docker run -d -e DB_HOST=localhost -e DB_PORT=3306 mysql

# Load from file
docker run -d --env-file .env mysql
```

**Volume Mounting:**
```bash
# Mount host directory
docker run -d -v /host/path:/container/path nginx

# Create named volume
docker run -d -v mydata:/data mysql

# Read-only mount
docker run -d -v /host/path:/container/path:ro nginx
```

---

## Managing Containers

**List Containers:**
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# List with specific format
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
```

**Container Operations:**
```bash
# Stop container
docker stop container-name

# Start stopped container
docker start container-name

# Restart container
docker restart container-name

# Pause container
docker pause container-name

# Unpause container
docker unpause container-name
```

**Remove Containers:**
```bash
# Remove stopped container
docker rm container-name

# Force remove running container
docker rm -f container-name

# Remove all stopped containers
docker container prune
```

---

## Container Interaction

**Execute Commands:**
```bash
# Run command in running container
docker exec container-name ls -la

# Interactive shell
docker exec -it container-name bash

# Run as specific user
docker exec -u root container-name whoami
```

**View Logs:**
```bash
# View all logs
docker logs container-name

# Follow logs (live)
docker logs -f container-name

# Show last 100 lines
docker logs --tail 100 container-name

# Show with timestamps
docker logs -t container-name
```

**Inspect Container:**
```bash
# Full container details
docker inspect container-name

# Get specific info (IP address)
docker inspect -f '{{.NetworkSettings.IPAddress}}' container-name
```

**Copy Files:**
```bash
# Copy from container to host
docker cp container-name:/path/file.txt ./file.txt

# Copy from host to container
docker cp ./file.txt container-name:/path/file.txt
```

---

## Building Images

**Dockerfile Basics:**
```dockerfile
# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./

# Run commands
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Default command
CMD ["npm", "start"]
```

**Build Image:**
```bash
# Build from Dockerfile
docker build -t myapp:latest .

# Build with different Dockerfile
docker build -f Dockerfile.prod -t myapp:prod .

# Build without cache
docker build --no-cache -t myapp .

# Build with arguments
docker build --build-arg VERSION=1.0 -t myapp .
```

**Multi-stage Builds:**
```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["node", "dist/index.js"]
```

---

## Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - api
    
  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=database
      - DB_PORT=5432
    depends_on:
      - database
    
  database:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

**Compose Commands:**
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# List running services
docker-compose ps

# Restart service
docker-compose restart web

# Build images
docker-compose build

# Scale service
docker-compose up -d --scale api=3
```

---

## Networks

**Network Commands:**
```bash
# List networks
docker network ls

# Create network
docker network create mynetwork

# Create with subnet
docker network create --subnet=172.18.0.0/16 mynetwork

# Connect container to network
docker network connect mynetwork container-name

# Disconnect from network
docker network disconnect mynetwork container-name

# Remove network
docker network rm mynetwork

# Inspect network
docker network inspect mynetwork
```

**Run with Network:**
```bash
# Create and use network
docker run -d --network mynetwork --name web nginx
docker run -d --network mynetwork --name api node-app
```

---

## Volumes

**Volume Commands:**
```bash
# List volumes
docker volume ls

# Create volume
docker volume create mydata

# Inspect volume
docker volume inspect mydata

# Remove volume
docker volume rm mydata

# Remove unused volumes
docker volume prune
```

**Volume Types:**
```bash
# Named volume
docker run -d -v mydata:/data nginx

# Bind mount (host path)
docker run -d -v /host/path:/container/path nginx

# Tmpfs mount (memory only)
docker run -d --tmpfs /tmp nginx
```

---

## Registry Operations

**Docker Hub:**
```bash
# Login to Docker Hub
docker login

# Tag image for push
docker tag myapp:latest username/myapp:latest

# Push to Docker Hub
docker push username/myapp:latest

# Pull from Docker Hub
docker pull username/myapp:latest

# Logout
docker logout
```

**Private Registry:**
```bash
# Tag for private registry
docker tag myapp:latest registry.example.com/myapp:latest

# Push to private registry
docker push registry.example.com/myapp:latest

# Pull from private registry
docker pull registry.example.com/myapp:latest
```

---

## Best Practices

**Dockerfile Optimization:**
- Use specific base image versions
- Minimize layers by combining RUN commands
- Use .dockerignore to exclude files
- Order commands from least to most frequently changing
- Use multi-stage builds for smaller images

**Example .dockerignore:**
```
node_modules
npm-debug.log
.git
.env
.DS_Store
```

**Security:**
```bash
# Don't run as root
FROM node:18
RUN useradd -m appuser
USER appuser

# Scan for vulnerabilities
docker scan myapp:latest
```

**Resource Limits:**
```bash
# Limit memory
docker run -d --memory="512m" nginx

# Limit CPU
docker run -d --cpus="1.5" nginx

# Limit both
docker run -d --memory="512m" --cpus="1.0" nginx
```

---

## Common Workflows

**Development Workflow:**
```bash
# 1. Create Dockerfile
cat > Dockerfile << EOF
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
EOF

# 2. Build image
docker build -t myapp-dev .

# 3. Run with volume for hot reload
docker run -d -p 3000:3000 -v $(pwd):/app myapp-dev

# 4. View logs
docker logs -f container-name
```

**Production Workflow:**
```bash
# 1. Build production image
docker build -t myapp:1.0.0 .

# 2. Tag for registry
docker tag myapp:1.0.0 username/myapp:1.0.0

# 3. Push to registry
docker push username/myapp:1.0.0

# 4. Deploy on server
docker pull username/myapp:1.0.0
docker run -d -p 80:3000 --name myapp username/myapp:1.0.0
```

---

## Troubleshooting

**Container Won't Start:**
```bash
# Check logs
docker logs container-name

# Inspect container
docker inspect container-name

# Check events
docker events
```

**Clean Up Resources:**
```bash
# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Remove all unused networks
docker network prune

# Clean everything
docker system prune -a --volumes
```

**Check Resource Usage:**
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Detailed disk usage
docker system df -v
```

---

## Quick Reference

**Essential Commands:**
```bash
docker pull image           # Download image
docker run image            # Create and start container
docker ps                   # List running containers
docker ps -a                # List all containers
docker stop container       # Stop container
docker start container      # Start container
docker rm container         # Remove container
docker images               # List images
docker rmi image            # Remove image
docker logs container       # View logs
docker exec -it container bash  # Interactive shell
```

**Cleanup Commands:**
```bash
docker system prune         # Remove unused data
docker container prune      # Remove stopped containers
docker image prune          # Remove dangling images
docker volume prune         # Remove unused volumes
```

---

## Learning Resources

- **Official Docs**: [docs.docker.com](https://docs.docker.com)
- **Docker Hub**: [hub.docker.com](https://hub.docker.com)
- **Play with Docker**: [labs.play-with-docker.com](https://labs.play-with-docker.com)
- **Best Practices**: [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
