## Introduction to CI/CD

CI/CD (Continuous Integration / Continuous Delivery or Deployment) is a set of practices that automate the building, testing, and delivery of software. Continuous Integration ensures code changes are automatically built and tested as soon as they're merged; Continuous Delivery/Deployment automates getting those changes into staging or production reliably and quickly.

### Why Adopt CI/CD?

- **Faster Feedback**: Catch bugs within minutes of a commit, not days later
- **Reduced Risk**: Small, frequent releases are easier to debug than big-bang deployments
- **Consistency**: The same automated pipeline runs every time — no manual, error-prone steps
- **Confidence**: Automated tests and checks gate every merge and deploy
- **Faster Delivery**: Ship features and fixes to users continuously, not on a quarterly cycle

### Key Concepts

- **Continuous Integration (CI)**: Automatically build and test every code change
- **Continuous Delivery**: Automatically prepare every change for release, with a manual approval gate
- **Continuous Deployment**: Automatically release every change that passes the pipeline, with no manual gate
- **Pipeline**: An ordered sequence of automated stages (build, test, deploy)
- **Artifact**: A build output (binary, container image, package) produced by the pipeline
- **Runner/Agent**: The machine or container that executes pipeline jobs

## Popular CI/CD Platforms

```
GitHub Actions   -> Native to GitHub, YAML-based, huge marketplace of actions
GitLab CI/CD     -> Native to GitLab, YAML-based, tightly integrated with GitLab features
Jenkins          -> Self-hosted, highly extensible via plugins, Groovy-based pipelines
CircleCI         -> Cloud-native, fast parallel execution, YAML config
Travis CI        -> One of the earliest hosted CI tools, simple YAML config
Azure Pipelines  -> Native to Azure DevOps, supports many languages and platforms
```

## GitHub Actions

### Basic Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

### Matrix Builds

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]

    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci && npm test
```

### Deployment Workflow with Environments

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Log in to registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/myorg/myapp:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: |
          kubectl set image deployment/web-app \
            web-app=ghcr.io/myorg/myapp:${{ github.sha }}
```

### Secrets and Caching

```yaml
steps:
  - name: Use a secret
    env:
      API_KEY: ${{ secrets.API_KEY }}
    run: ./deploy.sh

  - name: Cache dependencies
    uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  NODE_ENV: "production"

build:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    - npm test

deploy_production:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying to production..."
    - ./deploy.sh
  only:
    - main
  environment:
    name: production
    url: https://app.example.com
```

## Jenkins

```groovy
// Jenkinsfile (declarative pipeline)
pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh './deploy.sh'
            }
        }
    }

    post {
        failure {
            mail to: 'team@example.com',
                 subject: "Build Failed: ${env.JOB_NAME}",
                 body: "Check console output at ${env.BUILD_URL}"
        }
    }
}
```

## Pipeline Design Patterns

### Build Once, Deploy Many

```yaml
# Build a single artifact, promote it through environments
jobs:
  build:
    steps:
      - run: docker build -t myapp:${{ github.sha }} .
      - run: docker push myregistry.com/myapp:${{ github.sha }}

  deploy-staging:
    needs: build
    steps:
      - run: kubectl set image deployment/app app=myregistry.com/myapp:${{ github.sha }} -n staging

  deploy-production:
    needs: deploy-staging
    environment: production  # requires manual approval
    steps:
      - run: kubectl set image deployment/app app=myregistry.com/myapp:${{ github.sha }} -n production
```

### Fail Fast

```yaml
# Run cheapest/fastest checks first
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

## Deployment Strategies

```
Rolling Deployment    -> Gradually replace old instances with new ones
Blue-Green Deployment -> Run two identical environments; switch traffic instantly
Canary Deployment     -> Release to a small subset of users before full rollout
Recreate Deployment   -> Stop all old instances, then start new ones (brief downtime)
```

```yaml
# Example: canary deployment step gate in a pipeline
deploy-canary:
  steps:
    - run: kubectl apply -f canary-deployment.yaml   # 10% of traffic
    - run: ./run-smoke-tests.sh
    - run: ./check-error-rate.sh --threshold=1%

promote-full:
  needs: deploy-canary
  steps:
    - run: kubectl apply -f production-deployment.yaml  # 100% of traffic
```

## Testing in the Pipeline

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Unit tests
        run: npm run test:unit

      - name: Integration tests
        run: npm run test:integration

      - name: End-to-end tests
        run: npm run test:e2e

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
```

## Infrastructure Automation in Pipelines

```yaml
# Running Terraform in CI
jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        run: terraform init

      - name: Terraform Plan
        run: terraform plan -out=tfplan

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve tfplan
```

## Notifications

```yaml
steps:
  - name: Notify Slack on failure
    if: failure()
    uses: slackapi/slack-github-action@v1
    with:
      payload: |
        {
          "text": "Build failed on ${{ github.ref }}: ${{ github.event.head_commit.message }}"
        }
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Best Practices

- **Keep pipelines fast** — parallelize independent jobs and fail fast on cheap checks first
- **Build artifacts once and promote them** through environments rather than rebuilding per stage
- **Never store secrets in pipeline YAML** — use the platform's secrets manager
- **Require passing checks before merge** via branch protection rules
- **Automate rollback** — a failed deployment should be able to revert automatically or with one click
- **Cache dependencies** between runs to reduce build time
- **Treat pipeline config as code** — review it in pull requests just like application code

## Resources

- **GitHub Actions Docs**: [GitHub Actions](https://docs.github.com/en/actions)
- **GitLab CI/CD Docs**: [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- **Jenkins Docs**: [Jenkins Documentation](https://www.jenkins.io/doc/)
- **The Twelve-Factor App**: [12factor.net](https://12factor.net/)

## Summary

CI/CD is the automation backbone of modern software delivery:

✅ Automatic build and test on every code change
✅ Fast feedback loops that catch bugs early
✅ Repeatable, low-risk deployments
✅ Multiple deployment strategies for safer releases
✅ Infrastructure and application changes flow through the same discipline
✅ Foundation for shipping software continuously and confidently

Master CI/CD to move from manual, risky releases to fast, reliable, automated delivery!
