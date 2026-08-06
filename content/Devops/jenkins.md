# Jenkins

## Overview

Jenkins is an open-source automation server that enables developers to build, test, and deploy software reliably. It's the leading tool for continuous integration and continuous delivery (CI/CD), with over 1,800 plugins supporting virtually any tool in the software development lifecycle.

**Core Benefits:**
- **Extensible**: 1,800+ plugins for integration with any tool
- **Distributed**: Master-agent architecture for scalable builds
- **Open Source**: Free with active community support
- **Platform Agnostic**: Runs on Windows, Linux, macOS, Docker
- **Pipeline as Code**: Define CI/CD pipelines in version control

**Key Features:**
- Continuous Integration/Continuous Delivery
- Declarative and Scripted Pipelines
- Distributed builds across multiple machines
- Extensive plugin ecosystem
- Built-in security and access control
- RESTful API for automation

## Installation

**Prerequisites:**
- Java 11 or Java 17 (LTS versions)
- 256 MB RAM minimum (1 GB+ recommended)
- 10 GB disk space

**Install on Windows:**
```bash
# Using Chocolatey
choco install jenkins

# Or download installer from jenkins.io
# Download jenkins.msi and run installer

# Start Jenkins service
net start jenkins

# Access at http://localhost:8080
```

**Install on macOS:**
```bash
# Using Homebrew
brew install jenkins-lts

# Start Jenkins
brew services start jenkins-lts

# Access at http://localhost:8080
```

**Install on Linux (Ubuntu/Debian):**
```bash
# Add Jenkins repository
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Java
sudo apt update
sudo apt install fontconfig openjdk-17-jre

# Install Jenkins
sudo apt install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Check status
sudo systemctl status jenkins
```

**Docker installation:**
```bash
# Run Jenkins in Docker
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  --name jenkins \
  jenkins/jenkins:lts

# View initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Access at http://localhost:8080
```

**Initial setup:**
```bash
# 1. Get initial admin password
# Linux/Mac:
sudo cat /var/jenkins_home/secrets/initialAdminPassword

# Windows:
type C:\Program Files\Jenkins\secrets\initialAdminPassword

# 2. Open http://localhost:8080
# 3. Enter admin password
# 4. Install suggested plugins
# 5. Create admin user
# 6. Configure Jenkins URL
```

## Jenkins Architecture

**Master-Agent Architecture:**
```
Jenkins Master (Controller)
├── Schedules builds
├── Monitors agents
├── Records and presents results
└── Serves HTTP requests

Jenkins Agent (Node)
├── Executes builds
├── Runs on remote machines
└── Reports back to master
```

**Key components:**
- **Jobs/Projects**: Build configurations
- **Builds**: Execution instances of jobs
- **Workspace**: Working directory for builds
- **Plugins**: Extend Jenkins functionality
- **Credentials**: Secure storage for secrets
- **Nodes**: Master and agent machines

## Creating Jobs

**Freestyle Project:**
```
1. Dashboard > New Item
2. Enter job name
3. Select "Freestyle project"
4. Configure:
   - Source Code Management (Git)
   - Build Triggers
   - Build Environment
   - Build Steps
   - Post-build Actions
5. Save
```

**Example Freestyle Job Configuration:**
```
Source Code Management:
├── Git
├── Repository URL: https://github.com/user/repo.git
├── Credentials: (select or add)
└── Branch: */main

Build Triggers:
├── Poll SCM: H/5 * * * *  (every 5 minutes)
└── GitHub hook trigger

Build Steps:
├── Execute shell:
    npm install
    npm test
    npm run build

Post-build Actions:
├── Archive artifacts: dist/**/*
└── Publish JUnit test results: test-results/*.xml
```

**Pipeline Project:**
```
1. New Item > Pipeline
2. Pipeline Definition:
   - Pipeline script (inline)
   - Pipeline script from SCM (Jenkinsfile in repo)
3. Configure pipeline code
4. Save and run
```

## Jenkins Pipeline (Declarative)

**Basic pipeline structure:**
```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Testing...'
                sh 'npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh './deploy.sh'
            }
        }
    }
}
```

**Complete pipeline example:**
```groovy
pipeline {
    agent any
    
    environment {
        NODE_ENV = 'production'
        APP_NAME = 'my-app'
        DOCKER_IMAGE = 'myapp:${BUILD_NUMBER}'
    }
    
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'production'], description: 'Deploy environment')
        booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run tests')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/user/repo.git',
                    credentialsId: 'github-credentials'
            }
        }
        
        stage('Build') {
            steps {
                script {
                    echo "Building ${APP_NAME}..."
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Test') {
            when {
                expression { params.RUN_TESTS == true }
            }
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit 'test-results/*.xml'
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "Deploying to ${params.ENVIRONMENT}"
                    sh "./deploy.sh ${params.ENVIRONMENT}"
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded!'
            emailext(
                subject: "Success: ${currentBuild.fullDisplayName}",
                body: "Build succeeded: ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
        failure {
            echo 'Pipeline failed!'
            emailext(
                subject: "Failed: ${currentBuild.fullDisplayName}",
                body: "Build failed: ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
        always {
            cleanWs()
        }
    }
}
```

## Scripted Pipeline

**Basic scripted pipeline:**
```groovy
node {
    stage('Checkout') {
        checkout scm
    }
    
    stage('Build') {
        sh 'npm install'
        sh 'npm run build'
    }
    
    stage('Test') {
        sh 'npm test'
    }
    
    stage('Deploy') {
        if (env.BRANCH_NAME == 'main') {
            sh './deploy.sh'
        }
    }
}
```

**Advanced scripted pipeline:**
```groovy
node('linux') {
    try {
        stage('Checkout') {
            git branch: 'main',
                url: 'https://github.com/user/repo.git'
        }
        
        stage('Build') {
            sh '''
                npm ci
                npm run build
            '''
        }
        
        stage('Test') {
            parallel(
                'Unit Tests': {
                    sh 'npm run test:unit'
                },
                'Integration Tests': {
                    sh 'npm run test:integration'
                },
                'E2E Tests': {
                    sh 'npm run test:e2e'
                }
            )
        }
        
        stage('Docker') {
            docker.withRegistry('https://registry.example.com', 'docker-credentials') {
                def image = docker.build("myapp:${env.BUILD_NUMBER}")
                image.push()
                image.push('latest')
            }
        }
        
        stage('Deploy') {
            if (env.BRANCH_NAME == 'main') {
                timeout(time: 5, unit: 'MINUTES') {
                    input message: 'Deploy to production?', ok: 'Deploy'
                }
                sh 'kubectl apply -f k8s/'
            }
        }
        
        currentBuild.result = 'SUCCESS'
    } catch (Exception e) {
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        stage('Cleanup') {
            cleanWs()
            emailext(
                subject: "${currentBuild.result}: ${env.JOB_NAME}",
                body: "Build ${env.BUILD_NUMBER}: ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
    }
}
```

## Agents & Nodes

**Agent types:**
```groovy
// Any available agent
agent any

// Specific label
agent {
    label 'linux'
}

// Docker agent
agent {
    docker {
        image 'node:18'
        args '-v /tmp:/tmp'
    }
}

// Dockerfile
agent {
    dockerfile {
        filename 'Dockerfile.build'
        args '-v /tmp:/tmp'
    }
}

// Kubernetes pod
agent {
    kubernetes {
        yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:18
    command: ['cat']
    tty: true
'''
    }
}

// No agent (define per stage)
agent none
```

**Add agent node:**
```
1. Manage Jenkins > Nodes
2. New Node
3. Configure:
   - Name: agent-1
   - Remote root directory: /var/jenkins
   - Labels: linux docker
   - Launch method: SSH
   - Host: agent-ip
   - Credentials: SSH key
4. Save
5. Launch agent
```

## Environment Variables

**Built-in variables:**
```groovy
pipeline {
    agent any
    
    stages {
        stage('Print Variables') {
            steps {
                echo "Job: ${env.JOB_NAME}"
                echo "Build Number: ${env.BUILD_NUMBER}"
                echo "Build ID: ${env.BUILD_ID}"
                echo "Build URL: ${env.BUILD_URL}"
                echo "Workspace: ${env.WORKSPACE}"
                echo "Branch: ${env.BRANCH_NAME}"
                echo "Git Commit: ${env.GIT_COMMIT}"
                echo "Git Branch: ${env.GIT_BRANCH}"
                echo "Jenkins Home: ${env.JENKINS_HOME}"
                echo "Node Name: ${env.NODE_NAME}"
            }
        }
    }
}
```

**Custom environment variables:**
```groovy
pipeline {
    agent any
    
    environment {
        // Global variables
        APP_NAME = 'my-app'
        VERSION = '1.0.0'
        DOCKER_REGISTRY = 'registry.example.com'
        
        // Credentials
        DOCKER_CREDS = credentials('docker-credentials')
        AWS_CREDS = credentials('aws-credentials')
    }
    
    stages {
        stage('Build') {
            environment {
                // Stage-specific variables
                BUILD_ENV = 'production'
            }
            steps {
                echo "Building ${APP_NAME} version ${VERSION}"
                echo "Environment: ${BUILD_ENV}"
            }
        }
    }
}
```

## Credentials Management

**Add credentials:**
```
1. Manage Jenkins > Credentials
2. Select domain (global)
3. Add Credentials
4. Types:
   - Username with password
   - SSH Username with private key
   - Secret text
   - Secret file
   - Certificate
5. ID: unique identifier
6. Save
```

**Use credentials in pipeline:**
```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                // Username/password
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh 'echo $USERNAME'
                    // PASSWORD is masked in logs
                }
                
                // Secret text
                withCredentials([string(
                    credentialsId: 'api-token',
                    variable: 'API_TOKEN'
                )]) {
                    sh 'curl -H "Authorization: Bearer $API_TOKEN" api.example.com'
                }
                
                // SSH key
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ssh-key',
                    keyFileVariable: 'SSH_KEY'
                )]) {
                    sh 'ssh -i $SSH_KEY user@server "deploy.sh"'
                }
            }
        }
    }
}
```

## Essential Plugins

**Must-have plugins:**
- **Pipeline**: Pipeline as code support
- **Git**: Git integration
- **Docker Pipeline**: Docker support in pipelines
- **Credentials Binding**: Secure credentials handling
- **Email Extension**: Advanced email notifications
- **Blue Ocean**: Modern UI for pipelines
- **Kubernetes**: Deploy to Kubernetes
- **AWS Steps**: AWS integration
- **Slack Notification**: Slack integration

**Install plugins:**
```
1. Manage Jenkins > Plugin Manager
2. Available tab
3. Search for plugin
4. Check checkbox
5. Install without restart (or Download and install after restart)
```

**Plugin pipeline examples:**
```groovy
// Docker
stage('Docker') {
    steps {
        script {
            docker.build("myapp:${BUILD_NUMBER}").push()
        }
    }
}

// Kubernetes
stage('Deploy to K8s') {
    steps {
        kubernetesDeploy(
            configs: 'k8s/*.yaml',
            kubeconfigId: 'kubeconfig'
        )
    }
}

// Slack
post {
    success {
        slackSend(
            color: 'good',
            message: "Build succeeded: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        )
    }
}

// AWS S3
stage('Upload to S3') {
    steps {
        withAWS(credentials: 'aws-credentials', region: 'us-east-1') {
            s3Upload(bucket: 'my-bucket', path: 'builds/', includePathPattern: '**/*.zip')
        }
    }
}
```

## Build Triggers

**Configure triggers:**
```groovy
pipeline {
    agent any
    
    triggers {
        // Poll SCM every 5 minutes
        pollSCM('H/5 * * * *')
        
        // Cron schedule (daily at 2 AM)
        cron('0 2 * * *')
        
        // Upstream projects
        upstream(
            upstreamProjects: 'project-1,project-2',
            threshold: hudson.model.Result.SUCCESS
        )
    }
    
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
    }
}
```

**GitHub webhook:**
```
1. Jenkins: Install GitHub plugin
2. Job > Configure > Build Triggers
3. Check "GitHub hook trigger for GITScm polling"
4. GitHub: Settings > Webhooks > Add webhook
5. Payload URL: http://jenkins-url/github-webhook/
6. Content type: application/json
7. Events: Push events
```

## Jenkinsfile Examples

**Node.js application:**
```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit 'test-results/*.xml'
                    publishHTML([
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }
    }
}
```

**Java Maven application:**
```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven-3.9'
        jdk 'JDK-17'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/user/java-app.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'mvn deploy'
            }
        }
    }
}
```

## Best Practices

**Pipeline design:**
- Store Jenkinsfile in version control
- Use declarative syntax when possible
- Define agent at stage level for efficiency
- Use shared libraries for common code
- Implement proper error handling
- Set timeouts to prevent hung builds
- Clean workspace after build

**Security:**
- Enable security and authentication
- Use role-based access control (RBAC)
- Store secrets in credentials manager
- Use HTTPS for Jenkins URL
- Keep Jenkins and plugins updated
- Limit agent access
- Audit logs regularly

**Performance:**
```groovy
pipeline {
    options {
        // Keep only last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        
        // Disable concurrent builds
        disableConcurrentBuilds()
        
        // Set timeout
        timeout(time: 1, unit: 'HOURS')
        
        // Add timestamps to console output
        timestamps()
    }
}
```

**Parallel execution:**
```groovy
stage('Parallel Tests') {
    parallel {
        stage('Unit Tests') {
            steps {
                sh 'npm run test:unit'
            }
        }
        stage('Integration Tests') {
            steps {
                sh 'npm run test:integration'
            }
        }
        stage('E2E Tests') {
            steps {
                sh 'npm run test:e2e'
            }
        }
    }
}
```

## Monitoring & Maintenance

**Monitor Jenkins:**
```
Manage Jenkins > System Information
- JVM memory usage
- System properties
- Environment variables
- Plugin versions

Manage Jenkins > System Log
- View logs
- Filter by severity
- Create custom loggers
```

**Backup Jenkins:**
```bash
# Backup JENKINS_HOME directory
tar -czf jenkins-backup-$(date +%Y%m%d).tar.gz /var/lib/jenkins/

# Essential directories to backup:
# - jobs/
# - users/
# - credentials.xml
# - config.xml
# - plugins/
```

**Update Jenkins:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt upgrade jenkins

# Docker
docker pull jenkins/jenkins:lts
docker stop jenkins
docker rm jenkins
# Run new container with same volume
```

## Troubleshooting

**Common issues:**
```bash
# Jenkins won't start
# Check Java version
java -version

# Check logs
sudo journalctl -u jenkins -f

# Check port availability
netstat -an | grep 8080

# Permission issues
sudo chown -R jenkins:jenkins /var/lib/jenkins

# Out of memory
# Edit /etc/default/jenkins or systemd service
JAVA_ARGS="-Xms1024m -Xmx2048m"

# Plugin conflicts
# Safe mode: Start Jenkins without plugins
java -jar jenkins.war --disable-plugins

# Build stuck
# Kill build from Jenkins UI
# Or restart Jenkins service
```

**Debug pipeline:**
```groovy
pipeline {
    agent any
    
    stages {
        stage('Debug') {
            steps {
                // Print all environment variables
                sh 'printenv | sort'
                
                // Print workspace contents
                sh 'ls -la'
                
                // Debug mode
                echo "Debug: ${env}"
            }
        }
    }
}
```

## Quick Reference

**Essential commands:**
```bash
# Service management
sudo systemctl start jenkins
sudo systemctl stop jenkins
sudo systemctl restart jenkins
sudo systemctl status jenkins

# View logs
sudo journalctl -u jenkins -f
sudo tail -f /var/log/jenkins/jenkins.log

# Jenkins CLI
java -jar jenkins-cli.jar -s http://localhost:8080/ -auth user:token help
java -jar jenkins-cli.jar build job-name
java -jar jenkins-cli.jar list-jobs
```

**Pipeline syntax:**
```groovy
// Declarative
pipeline {
    agent any
    stages {
        stage('Stage') {
            steps {
                sh 'command'
            }
        }
    }
}

// Scripted
node {
    stage('Stage') {
        sh 'command'
    }
}
```

## Learning Resources

**Official Documentation:**
- [Jenkins Documentation](https://www.jenkins.io/doc/) - Complete guide
- [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/) - Reference
- [Plugin Index](https://plugins.jenkins.io/) - Browse plugins

**Tutorials:**
- [Jenkins Tutorial](https://www.jenkins.io/doc/tutorials/) - Step-by-step guides
- [Pipeline Examples](https://www.jenkins.io/doc/pipeline/examples/) - Sample code
- [Blue Ocean Documentation](https://www.jenkins.io/doc/book/blueocean/) - Modern UI

**Community:**
- [Jenkins Community](https://www.jenkins.io/participate/) - Get involved
- [Jenkins User Mailing List](https://www.jenkins.io/mailing-lists/)
- [Stack Overflow jenkins tag](https://stackoverflow.com/questions/tagged/jenkins)

**Books:**
- "Jenkins: The Definitive Guide" by John Ferguson Smart
- "Learning Continuous Integration with Jenkins" by Nikhil Pathania
