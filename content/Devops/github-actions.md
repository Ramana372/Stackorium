# GitHub Actions

## Overview

GitHub Actions is a CI/CD platform integrated directly into GitHub repositories. Automate build, test, and deployment workflows using YAML configuration files triggered by GitHub events like pushes, pull requests, or scheduled intervals.

**Key Features:**
- Event-driven automation (push, PR, schedule, manual)
- Matrix builds for multiple OS/versions
- Reusable workflows and actions
- Secrets management
- Parallel and sequential job execution
- Extensive marketplace of pre-built actions
- Self-hosted and GitHub-hosted runners

## Getting Started

**Create workflow file:**
```bash
# Create workflow directory
mkdir -p .github/workflows

# Create workflow file
touch .github/workflows/ci.yml
```

**Basic workflow structure:**
```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
```

## Workflow Syntax

**Complete workflow example:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
```

## Triggers

**Push events:**
```yaml
on:
  push:
    branches:
      - main
      - 'release/**'
    paths:
      - 'src/**'
      - '!docs/**'
    tags:
      - 'v*'
```

**Pull request events:**
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [ main ]
```

**Scheduled events:**
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
    - cron: '0 0 * * 0'  # Weekly on Sunday
```

**Manual trigger:**
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        type: choice
        options:
          - staging
          - production
      debug:
        description: 'Enable debug mode'
        required: false
        type: boolean
```

**Multiple triggers:**
```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'
  workflow_dispatch:
```

## Jobs

**Single job:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
```

**Multiple jobs with dependencies:**
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build
  
  deploy:
    needs: [test, build]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy to production"
```

**Matrix builds:**
```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

## Common Actions

**Checkout code:**
```yaml
- uses: actions/checkout@v3
  with:
    fetch-depth: 0  # Full history
    submodules: true
```

**Setup environments:**
```yaml
# Node.js
- uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: 'npm'

# Python
- uses: actions/setup-python@v4
  with:
    python-version: '3.11'
    cache: 'pip'

# Java
- uses: actions/setup-java@v3
  with:
    distribution: 'temurin'
    java-version: '17'
    cache: 'maven'
```

**Cache dependencies:**
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**Upload/Download artifacts:**
```yaml
# Upload
- uses: actions/upload-artifact@v3
  with:
    name: build-files
    path: dist/

# Download
- uses: actions/download-artifact@v3
  with:
    name: build-files
    path: dist/
```

## Secrets & Environment Variables

**Using secrets:**
```yaml
steps:
  - name: Deploy
    run: ./deploy.sh
    env:
      API_KEY: ${{ secrets.API_KEY }}
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
```

**Environment variables:**
```yaml
env:
  NODE_ENV: production
  API_URL: https://api.example.com

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      BUILD_VERSION: 1.0.0
    steps:
      - run: echo $NODE_ENV
      - run: echo $BUILD_VERSION
```

**GitHub context:**
```yaml
- name: Show context
  run: |
    echo "Repository: ${{ github.repository }}"
    echo "Branch: ${{ github.ref }}"
    echo "Commit: ${{ github.sha }}"
    echo "Actor: ${{ github.actor }}"
```

## Docker Workflows

**Build and push Docker image:**
```yaml
name: Docker Build

on:
  push:
    branches: [ main ]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: username/app:latest
```

## Deployment Examples

**Deploy to AWS:**
```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to S3
        run: aws s3 sync ./dist s3://my-bucket
```

**Deploy to Heroku:**
```yaml
- name: Deploy to Heroku
  uses: akhileshns/heroku-deploy@v3.12.14
  with:
    heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
    heroku_app_name: my-app
    heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

**Deploy to GitHub Pages:**
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

## Conditional Execution

**Run on specific conditions:**
```yaml
steps:
  - name: Deploy to production
    if: github.ref == 'refs/heads/main'
    run: ./deploy-prod.sh
  
  - name: Deploy to staging
    if: github.ref == 'refs/heads/develop'
    run: ./deploy-staging.sh
  
  - name: Run on success
    if: success()
    run: echo "Previous steps succeeded"
  
  - name: Run on failure
    if: failure()
    run: echo "A previous step failed"
```

## Reusable Workflows

**Define reusable workflow:**
```yaml
# .github/workflows/reusable-test.yml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm test
```

**Call reusable workflow:**
```yaml
# .github/workflows/ci.yml
jobs:
  test-node-18:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '18'
```

## Best Practices

**Workflow organization:**
- One workflow per purpose (CI, CD, release)
- Use meaningful job and step names
- Keep workflows DRY with reusable workflows
- Use workflow templates for consistency

**Performance optimization:**
- Cache dependencies
- Use matrix builds efficiently
- Parallelize independent jobs
- Skip unnecessary workflow runs with path filters

**Security:**
- Store sensitive data in GitHub Secrets
- Use environment protection rules
- Review third-party actions before use
- Pin actions to specific commits or tags
- Use `GITHUB_TOKEN` with minimal permissions

**Example security:**
```yaml
permissions:
  contents: read
  pull-requests: write

steps:
  - uses: actions/checkout@v3  # Good
  - uses: actions/checkout@8e5e7e5ab8b370d6c329ec480221332ada57f0ab  # Better (pinned)
```

## Monitoring & Debugging

**View workflow runs:**
- Go to Actions tab in repository
- Click on workflow name
- View job logs and timings

**Debug mode:**
```yaml
- name: Debug
  run: echo "Debug info"
  env:
    ACTIONS_STEP_DEBUG: true
```

**Enable debug logging:**
- Repository Settings > Secrets
- Add `ACTIONS_STEP_DEBUG` = `true`
- Add `ACTIONS_RUNNER_DEBUG` = `true`

## Common Workflows

**Node.js CI:**
```yaml
name: Node.js CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

**Python CI:**
```yaml
name: Python CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest
```

**Release automation:**
```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build
      - uses: softprops/action-gh-release@v1
        with:
          files: dist/*
```

## Troubleshooting

**Common issues:**

**Workflow not triggering:**
- Check trigger configuration (on:)
- Verify branch names match
- Check path filters aren't too restrictive
- Ensure workflow file is in `.github/workflows/`

**Permission errors:**
```yaml
permissions:
  contents: write
  pull-requests: write
```

**Timeout issues:**
```yaml
jobs:
  build:
    timeout-minutes: 30  # Default is 360
```

**Cancel in-progress runs:**
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Quick Reference

**Essential syntax:**
```yaml
name: Workflow Name
on: [push, pull_request]
jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: command
```

**Common runners:**
- `ubuntu-latest` - Ubuntu Linux
- `windows-latest` - Windows Server
- `macos-latest` - macOS

**Useful expressions:**
- `${{ secrets.SECRET_NAME }}`
- `${{ github.repository }}`
- `${{ github.ref }}`
- `${{ runner.os }}`
- `${{ matrix.version }}`

## Learning Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions) - Official documentation
- [Actions Marketplace](https://github.com/marketplace?type=actions) - Pre-built actions
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions) - Complete syntax reference
- [GitHub Skills](https://skills.github.com) - Interactive learning
- [Awesome Actions](https://github.com/sdras/awesome-actions) - Curated list of actions
