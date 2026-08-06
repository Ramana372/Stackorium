# Kubernetes

## Overview

Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. It provides a framework to run distributed systems resiliently, handling scaling and failover for your applications.

**Core Benefits:**
- **Automated Deployment**: Self-healing, auto-scaling, and load balancing
- **Service Discovery**: Built-in DNS and service mesh capabilities
- **Storage Orchestration**: Automatic mounting of storage systems
- **Declarative Configuration**: Define desired state, K8s maintains it
- **Multi-Cloud Support**: Run anywhere - cloud, on-premises, hybrid

**Architecture Components:**
- **Control Plane**: API Server, Scheduler, Controller Manager, etcd
- **Worker Nodes**: Kubelet, Container Runtime, Kube Proxy
- **Pods**: Smallest deployable units containing one or more containers

## Installation & Setup

**Install kubectl (CLI tool):**
```bash
# Windows (Chocolatey)
choco install kubernetes-cli

# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

**Local Development Clusters:**
```bash
# Minikube (recommended for learning)
# Windows
choco install minikube

# macOS
brew install minikube

# Start cluster
minikube start
minikube status

# Kind (Kubernetes in Docker)
brew install kind
kind create cluster --name dev-cluster

# Docker Desktop (enable in settings)
# Docker Desktop > Settings > Kubernetes > Enable Kubernetes
```

**Connect to cluster:**
```bash
# View current context
kubectl config current-context

# List all contexts
kubectl config get-contexts

# Switch context
kubectl config use-context minikube

# View cluster info
kubectl cluster-info
kubectl get nodes
```

## Core Concepts

**Pod** - Smallest deployable unit:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.21
    ports:
    - containerPort: 80
```

**Deployment** - Manages replica sets and pods:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

**Service** - Exposes pods to network:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

**Namespace** - Virtual clusters for resource isolation:
```bash
# Create namespace
kubectl create namespace dev

# List namespaces
kubectl get namespaces

# Set default namespace
kubectl config set-context --current --namespace=dev
```

## Working with Pods

**Create and manage pods:**
```bash
# Create pod from YAML
kubectl apply -f pod.yaml

# Create pod directly
kubectl run nginx --image=nginx:1.21 --port=80

# List pods
kubectl get pods
kubectl get pods -o wide  # More details
kubectl get pods -n dev   # In specific namespace
kubectl get pods --all-namespaces

# Describe pod (detailed info)
kubectl describe pod nginx-pod

# Delete pod
kubectl delete pod nginx-pod
kubectl delete -f pod.yaml
```

**Pod operations:**
```bash
# View logs
kubectl logs nginx-pod
kubectl logs nginx-pod -f  # Follow logs
kubectl logs nginx-pod -c container-name  # Multi-container pod

# Execute commands in pod
kubectl exec -it nginx-pod -- /bin/bash
kubectl exec nginx-pod -- ls /app

# Port forwarding (local access)
kubectl port-forward pod/nginx-pod 8080:80
# Access at http://localhost:8080

# Copy files
kubectl cp nginx-pod:/app/file.txt ./file.txt
kubectl cp ./file.txt nginx-pod:/app/
```

## Deployments

**Create deployment:**
```bash
# From YAML
kubectl apply -f deployment.yaml

# Imperative command
kubectl create deployment nginx --image=nginx:1.21 --replicas=3

# List deployments
kubectl get deployments
kubectl get deploy nginx -o yaml  # View full definition
```

**Update deployment:**
```bash
# Update image
kubectl set image deployment/nginx nginx=nginx:1.22

# Edit deployment
kubectl edit deployment nginx

# Scale deployment
kubectl scale deployment nginx --replicas=5

# Autoscale
kubectl autoscale deployment nginx --min=2 --max=10 --cpu-percent=80
```

**Rollout management:**
```bash
# View rollout status
kubectl rollout status deployment/nginx

# View rollout history
kubectl rollout history deployment/nginx

# Rollback to previous version
kubectl rollout undo deployment/nginx

# Rollback to specific revision
kubectl rollout undo deployment/nginx --to-revision=2

# Pause/resume rollout
kubectl rollout pause deployment/nginx
kubectl rollout resume deployment/nginx
```

## Services & Networking

**Service types:**
```yaml
# ClusterIP (internal only)
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
  - port: 8080
    targetPort: 8080

---
# NodePort (external access via node IP)
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080

---
# LoadBalancer (cloud load balancer)
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 8080
```

**Service operations:**
```bash
# Create service
kubectl apply -f service.yaml
kubectl expose deployment nginx --port=80 --type=LoadBalancer

# List services
kubectl get services
kubectl get svc -o wide

# Describe service
kubectl describe service nginx-service

# Get service endpoints
kubectl get endpoints nginx-service

# Delete service
kubectl delete service nginx-service
```

**Ingress for HTTP routing:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8080
```

## ConfigMaps & Secrets

**ConfigMap for configuration:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgres://db:5432"
  log_level: "info"
  config.json: |
    {
      "feature_flags": {
        "new_ui": true
      }
    }
```

```bash
# Create ConfigMap
kubectl create configmap app-config --from-literal=key=value
kubectl create configmap app-config --from-file=config.json
kubectl apply -f configmap.yaml

# Use in Pod
# As environment variables or volume mounts
```

**Secrets for sensitive data:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  # Base64 encoded values
  username: YWRtaW4=
  password: cGFzc3dvcmQxMjM=
```

```bash
# Create secret
kubectl create secret generic app-secrets \
  --from-literal=username=admin \
  --from-literal=password=password123

kubectl create secret docker-registry regcred \
  --docker-server=docker.io \
  --docker-username=user \
  --docker-password=pass

# View secrets
kubectl get secrets
kubectl describe secret app-secrets

# Use in pod spec
# envFrom, env, or volumes
```

**Using ConfigMaps and Secrets:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    # Environment variables from ConfigMap
    envFrom:
    - configMapRef:
        name: app-config
    # Specific env from Secret
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: password
    # Mount as volume
    volumeMounts:
    - name: config-volume
      mountPath: /config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
```

## Persistent Storage

**PersistentVolume (PV):**
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-storage
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: "/mnt/data"
```

**PersistentVolumeClaim (PVC):**
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-storage
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: manual
```

**Using volumes in pods:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-storage
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: storage
      mountPath: /data
  volumes:
  - name: storage
    persistentVolumeClaim:
      claimName: pvc-storage
```

```bash
# List PV and PVC
kubectl get pv
kubectl get pvc

# Describe storage
kubectl describe pv pv-storage
kubectl describe pvc pvc-storage
```

## Resource Management

**Resource requests and limits:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: app
    image: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

**ResourceQuota for namespace:**
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: dev
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    pods: "50"
```

**LimitRange for default limits:**
```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: limit-range
  namespace: dev
spec:
  limits:
  - default:
      cpu: 500m
      memory: 512Mi
    defaultRequest:
      cpu: 200m
      memory: 256Mi
    type: Container
```

```bash
# View resource usage
kubectl top nodes
kubectl top pods
kubectl top pods -n dev --containers

# View quotas
kubectl get resourcequota -n dev
kubectl describe quota compute-quota -n dev
```

## Health Checks

**Liveness probe (restart if unhealthy):**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: liveness-demo
spec:
  containers:
  - name: app
    image: myapp:1.0
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 15
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
```

**Readiness probe (remove from service if not ready):**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: readiness-demo
spec:
  containers:
  - name: app
    image: myapp:1.0
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
```

**Startup probe (for slow-starting containers):**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: startup-demo
spec:
  containers:
  - name: app
    image: myapp:1.0
    startupProbe:
      httpGet:
        path: /startup
        port: 8080
      failureThreshold: 30
      periodSeconds: 10
```

**Probe types:**
```yaml
# HTTP GET
httpGet:
  path: /health
  port: 8080

# TCP Socket
tcpSocket:
  port: 8080

# Command execution
exec:
  command:
  - cat
  - /tmp/healthy
```

## StatefulSets

**For stateful applications:**
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: "postgres"
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

**Headless service for StatefulSet:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  clusterIP: None
  selector:
    app: postgres
  ports:
  - port: 5432
```

```bash
# Manage StatefulSet
kubectl get statefulsets
kubectl scale statefulset postgres --replicas=5

# Ordered pod names: postgres-0, postgres-1, postgres-2
kubectl get pods -l app=postgres
```

## DaemonSets & Jobs

**DaemonSet (one pod per node):**
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      containers:
      - name: node-exporter
        image: prom/node-exporter
        ports:
        - containerPort: 9100
```

**Job (run to completion):**
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-migration
spec:
  template:
    spec:
      containers:
      - name: migrator
        image: migration-tool:1.0
        command: ["python", "migrate.py"]
      restartPolicy: OnFailure
  backoffLimit: 4
  completions: 1
  parallelism: 1
```

**CronJob (scheduled jobs):**
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-job
spec:
  schedule: "0 2 * * *"  # 2 AM daily
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup-tool:1.0
            command: ["sh", "backup.sh"]
          restartPolicy: OnFailure
```

```bash
# Manage jobs
kubectl get jobs
kubectl get cronjobs
kubectl describe job data-migration

# View job logs
kubectl logs job/data-migration
```

## Monitoring & Debugging

**View cluster resources:**
```bash
# All resources in namespace
kubectl get all
kubectl get all -n dev

# Specific resource types
kubectl get pods,svc,deploy
kubectl get events --sort-by=.metadata.creationTimestamp

# Resource details
kubectl describe node node-1
kubectl describe pod nginx-pod

# YAML output
kubectl get deployment nginx -o yaml
kubectl get pod nginx-pod -o json
```

**Debugging commands:**
```bash
# Pod logs
kubectl logs pod-name
kubectl logs pod-name -c container-name --previous  # Previous container

# Follow logs
kubectl logs -f deployment/nginx

# Events
kubectl get events -n dev --watch

# Resource usage
kubectl top nodes
kubectl top pods --containers

# Debug with ephemeral container
kubectl debug pod-name -it --image=busybox

# Network debugging
kubectl run curl-test --image=curlimages/curl -i --rm --restart=Never -- curl http://service-name
```

**Troubleshooting checklist:**
```bash
# 1. Check pod status
kubectl get pods

# 2. Describe pod for events
kubectl describe pod pod-name

# 3. Check logs
kubectl logs pod-name

# 4. Check service endpoints
kubectl get endpoints service-name

# 5. Verify network connectivity
kubectl exec pod-name -- ping service-name

# 6. Check resource constraints
kubectl top pods
kubectl describe node

# 7. View all events
kubectl get events --sort-by=.metadata.creationTimestamp
```

## Best Practices

**Resource Management:**
- Always set resource requests and limits
- Use horizontal pod autoscaling for variable load
- Set appropriate health checks (liveness, readiness)
- Use namespace quotas to prevent resource exhaustion

**Security:**
- Use RBAC for access control
- Never run containers as root (set securityContext)
- Use Pod Security Standards/Policies
- Store sensitive data in Secrets, not ConfigMaps
- Scan images for vulnerabilities
- Use network policies for pod-to-pod communication

**Configuration:**
- Use declarative YAML manifests in version control
- Separate config from code (ConfigMaps, Secrets)
- Use labels and selectors consistently
- Version your container images (avoid :latest)
- Use namespaces for environment separation

**Deployment:**
```yaml
# Good deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: production-app
  labels:
    app: myapp
    version: v1.2.3
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        version: v1.2.3
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
      - name: app
        image: myapp:1.2.3
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: ENV
          value: "production"
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
```

## Common Workflows

**Deploy new application:**
```bash
# 1. Create namespace
kubectl create namespace myapp

# 2. Create ConfigMap and Secrets
kubectl create configmap app-config --from-file=config/ -n myapp
kubectl create secret generic app-secrets --from-env-file=.env -n myapp

# 3. Apply deployment
kubectl apply -f deployment.yaml -n myapp

# 4. Create service
kubectl apply -f service.yaml -n myapp

# 5. Verify deployment
kubectl get all -n myapp
kubectl rollout status deployment/myapp -n myapp

# 6. Check logs
kubectl logs -f deployment/myapp -n myapp
```

**Update application:**
```bash
# 1. Update image
kubectl set image deployment/myapp app=myapp:2.0.0 -n myapp

# 2. Watch rollout
kubectl rollout status deployment/myapp -n myapp

# 3. If issues, rollback
kubectl rollout undo deployment/myapp -n myapp

# Or update via manifest
kubectl apply -f deployment.yaml -n myapp
```

**Scale application:**
```bash
# Manual scaling
kubectl scale deployment myapp --replicas=5 -n myapp

# Auto-scaling
kubectl autoscale deployment myapp --min=2 --max=10 --cpu-percent=70 -n myapp
kubectl get hpa -n myapp
```

**Clean up resources:**
```bash
# Delete specific resources
kubectl delete deployment myapp -n myapp
kubectl delete service myapp -n myapp

# Delete all in namespace
kubectl delete all --all -n myapp

# Delete namespace
kubectl delete namespace myapp
```

## Quick Reference

**Essential Commands:**
```bash
# Cluster
kubectl cluster-info
kubectl get nodes
kubectl top nodes

# Create resources
kubectl apply -f manifest.yaml
kubectl create deployment nginx --image=nginx

# View resources
kubectl get pods
kubectl get all
kubectl describe pod pod-name

# Update resources
kubectl edit deployment nginx
kubectl scale deployment nginx --replicas=5
kubectl set image deployment/nginx nginx=nginx:1.22

# Delete resources
kubectl delete pod pod-name
kubectl delete -f manifest.yaml

# Logs and exec
kubectl logs pod-name
kubectl logs -f deployment/nginx
kubectl exec -it pod-name -- bash

# Rollouts
kubectl rollout status deployment/nginx
kubectl rollout history deployment/nginx
kubectl rollout undo deployment/nginx

# Port forwarding
kubectl port-forward pod/nginx 8080:80
kubectl port-forward service/nginx 8080:80

# Config
kubectl config view
kubectl config get-contexts
kubectl config use-context minikube
```

**Resource Types (short names):**
```bash
pods (po)
services (svc)
deployments (deploy)
replicasets (rs)
statefulsets (sts)
daemonsets (ds)
jobs
cronjobs (cj)
configmaps (cm)
secrets
persistentvolumes (pv)
persistentvolumeclaims (pvc)
namespaces (ns)
nodes (no)
ingresses (ing)
```

## Learning Resources

**Official Documentation:**
- [Kubernetes Docs](https://kubernetes.io/docs/) - Complete official documentation
- [Kubernetes API Reference](https://kubernetes.io/docs/reference/) - API specifications
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) - Quick command reference

**Tutorials & Guides:**
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) - Interactive tutorial
- [Katacoda Kubernetes](https://www.katacoda.com/courses/kubernetes) - Interactive scenarios
- [Play with Kubernetes](https://labs.play-with-k8s.com/) - Browser-based playground

**Books:**
- "Kubernetes Up & Running" by Kelsey Hightower
- "The Kubernetes Book" by Nigel Poulton
- "Production Kubernetes" by Josh Rosso

**Practice & Certification:**
- [CKAD Certification](https://www.cncf.io/certification/ckad/) - Certified Kubernetes Application Developer
- [CKA Certification](https://www.cncf.io/certification/cka/) - Certified Kubernetes Administrator
- [Killer.sh](https://killer.sh/) - Practice exam environment

**Community:**
- [Kubernetes Slack](https://slack.k8s.io/) - Community chat
- [Stack Overflow kubernetes tag](https://stackoverflow.com/questions/tagged/kubernetes)
- [r/kubernetes](https://reddit.com/r/kubernetes) - Reddit community
