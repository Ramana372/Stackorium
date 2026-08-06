# GitHub

## Overview

GitHub is a cloud-based platform for version control and collaboration built on Git. It provides code hosting, pull requests, issues tracking, project management, CI/CD with GitHub Actions, and social coding features for teams and open-source projects.

**Key Features:**
- Public and private repositories
- Pull requests and code reviews
- Issues and project boards
- GitHub Actions (CI/CD automation)
- GitHub Pages (static site hosting)
- Security scanning and Dependabot
- Package registry and wikis

## Getting Started

**Configure Git:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**SSH Authentication:**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key and add to GitHub Settings > SSH Keys
cat ~/.ssh/id_ed25519.pub

# Test connection
ssh -T git@github.com
```

## Repositories

**Create repository:**
```bash
# Using GitHub CLI
gh repo create my-project --public --clone

# Or manually
git init
git add README.md
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:username/my-project.git
git push -u origin main
```

**Clone repository:**
```bash
git clone git@github.com:username/repository.git
git clone -b branch-name git@github.com:username/repository.git
```

## Pull Requests

**Create pull request:**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add feature"
git push -u origin feature/new-feature

# Create PR
gh pr create --title "Add feature" --body "Description"
```

**PR Template:**
```markdown
## Description
What changes were made

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change

## Testing
- [ ] Tests pass
- [ ] Manual testing done
```

**Review and merge:**
```bash
# List PRs
gh pr list

# Checkout PR locally
gh pr checkout 123

# Merge PR
gh pr merge 123 --squash --delete-branch
```

## Issues

**Create and manage issues:**
```bash
# Create issue
gh issue create --title "Bug report" --body "Description"

# List issues
gh issue list --label bug

# View issue
gh issue view 123

# Close issue
gh issue close 123
```

## GitHub CLI

**Common commands:**
```bash
# Authentication
gh auth login

# Repositories
gh repo create my-project --public
gh repo clone owner/repo
gh repo fork owner/repo

# Pull requests
gh pr create
gh pr list
gh pr checkout 123
gh pr merge 123 --squash

# Issues
gh issue create
gh issue list
gh issue close 123

# Workflows
gh workflow list
gh workflow run ci.yml
gh run list
```

## Fork Workflow

```bash
# Fork on GitHub, then clone
git clone git@github.com:yourname/project.git
cd project

# Add upstream remote
git remote add upstream git@github.com:original/project.git

# Create feature branch
git checkout -b feature/my-feature

# Push to your fork
git push origin feature/my-feature

# Create PR to upstream
gh pr create --repo original/project

# Keep fork updated
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## GitHub Pages

**Deploy static site:**
```yaml
# .github/workflows/deploy.yml
name: Deploy Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Enable in Settings:**
- Go to Repository Settings > Pages
- Select source branch (main or gh-pages)
- Access at `https://username.github.io/repository`

## Security

**Dependabot configuration:**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

**Branch protection rules:**
- Settings > Branches > Add rule
- Require pull request reviews
- Require status checks to pass
- Require conversation resolution
- Require signed commits
- Enable Dependabot alerts
- Code scanning with CodeQL

**Security features:**
- Secret scanning for API keys and tokens
- Dependabot security updates
- Code scanning with CodeQL
- Dependency vulnerability alerts

## Projects & Milestones

**Project boards:**
- Create projects with Table, Board, or Roadmap views
- Add issues and pull requests as cards
- Track progress with custom fields
- Automate workflows with built-in triggers

**Milestones:**
- Group issues and PRs by version or sprint
- Track completion percentage
- Set due dates for releases

## Best Practices

**Repository setup:**
- Add descriptive README.md
- Include LICENSE file
- Create CONTRIBUTING.md
- Add .gitignore file
- Set up CODEOWNERS

**Commit messages:**
```
type(scope): subject

Examples:
feat(auth): add OAuth login
fix(api): resolve timeout issue
docs(readme): update installation
```

**Branch strategy:**
- `main` - production-ready code
- `feature/*` - new features
- `bugfix/*` - bug fixes
- `hotfix/*` - urgent production fixes

**Security:**
- Enable two-factor authentication
- Use SSH keys or Personal Access Tokens
- Never commit secrets or API keys
- Enable Dependabot alerts
- Protect main branch

## Troubleshooting

**Authentication issues:**
```bash
# Test SSH connection
ssh -T git@github.com

# Update remote URL
git remote set-url origin git@github.com:username/repo.git
```

**Push rejected:**
```bash
# Pull latest changes
git pull --rebase origin main

# Force push (use carefully)
git push --force-with-lease
```

**Merge conflicts:**
```bash
# View conflicted files
git status

# Resolve conflicts in editor
# Then add and commit
git add resolved-file
git commit
```

## Quick Reference

**Essential commands:**
```bash
# Clone repository
git clone git@github.com:user/repo.git

# Create and switch to branch
git checkout -b feature-name

# Commit changes
git add .
git commit -m "message"

# Push to GitHub
git push origin feature-name

# Create pull request
gh pr create

# Update from main
git fetch origin
git rebase origin/main

# Merge PR
gh pr merge --squash
```

**GitHub URLs:**
- Repository: `github.com/user/repo`
- Issues: `github.com/user/repo/issues`
- Pull requests: `github.com/user/repo/pulls`
- Actions: `github.com/user/repo/actions`

## Learning Resources

- [GitHub Docs](https://docs.github.com) - Official documentation
- [GitHub Skills](https://skills.github.com) - Interactive tutorials
- [GitHub CLI Manual](https://cli.github.com/manual/) - Command reference
- [GitHub Community](https://github.community) - Support forum
- [GitHub Blog](https://github.blog) - Updates and best practices
