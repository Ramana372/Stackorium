# Git - Distributed Version Control System

## Overview
Git is a free and open-source distributed version control system designed to handle everything from small to very large projects with speed and efficiency. Created by Linus Torvalds in 2005, Git is the foundation of modern collaborative software development.

**Key Benefits:**
- Every developer has a full copy of the repository
- Fast local operations
- Powerful branching and merging
- Complete history tracking
- Free and open source

**Initial Setup:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
```

---

## Workflow Basics

**The Four Areas:**
1. **Working Directory** - Your actual files
2. **Staging Area** - Files ready to commit
3. **Local Repository** - Your committed history
4. **Remote Repository** - Shared repository (GitHub, GitLab, etc.)

```bash
# Check current status
git status
```

---

## Starting a Repository

**Create New Repository:**
```bash
mkdir my-project
cd my-project
git init
```

**Clone Existing Repository:**
```bash
# HTTPS
git clone https://github.com/username/repo.git

# SSH
git clone git@github.com:username/repo.git
```

---

## Making Changes

**Stage Files:**
```bash
# Stage specific file
git add filename.txt

# Stage all changes
git add .

# Stage multiple files
git add file1.txt file2.txt
```

**Unstage Files:**
```bash
git reset HEAD filename.txt
```

**Commit Changes:**
```bash
# Commit with message
git commit -m "Add feature description"

# Add and commit tracked files
git commit -am "Update documentation"

# Amend last commit
git commit --amend -m "Corrected commit message"
```

**Good Commit Messages:**
```
feat: Add user authentication
fix: Resolve login bug
docs: Update README
refactor: Simplify database query
test: Add unit tests for API
```

---

## Viewing History

```bash
# View commit log
git log

# Compact view
git log --oneline

# Last 5 commits
git log -5

# Visual graph
git log --graph --oneline --all

# See who modified each line
git blame filename.txt

# Search commits
git log --grep="bug fix"
```

---

## Branching

**Why Branches?**
- Isolate features in development
- Work on multiple features simultaneously
- Experiment without breaking main code
- Easy collaboration

**Branch Commands:**
```bash
# List branches
git branch

# Create new branch
git branch feature-name

# Switch to branch
git checkout feature-name

# Create and switch (one command)
git checkout -b feature-name

# Modern syntax
git switch feature-name
git switch -c feature-name

# Rename branch
git branch -m new-name

# Delete branch
git branch -d feature-name
```

---

## Merging

**Merge a Branch:**
```bash
# Switch to target branch
git checkout main

# Merge feature branch
git merge feature-name
```

**Handle Merge Conflicts:**
```bash
# When conflict occurs, edit the file to resolve
# File will show:
# <<<<<<< HEAD
# Your changes
# =======
# Their changes
# >>>>>>> branch-name

# After resolving
git add resolved-file.txt
git commit -m "Resolve merge conflict"

# Abort merge if needed
git merge --abort
```

---

## Working with Remotes

**Add Remote:**
```bash
git remote add origin https://github.com/username/repo.git

# View remotes
git remote -v
```

**Fetch vs Pull:**
```bash
# Fetch - download without merging
git fetch origin

# Pull - fetch and merge
git pull origin main

# Pull with rebase
git pull --rebase origin main
```

**Push Changes:**
```bash
# Push to remote
git push origin main

# Set upstream and push
git push -u origin feature-name

# Push all branches
git push --all
```

---

## Stashing

Save work in progress without committing:

```bash
# Stash changes
git stash

# Stash with message
git stash save "Work in progress"

# List stashes
git stash list

# Apply latest stash
git stash apply

# Apply and remove from list
git stash pop

# Drop specific stash
git stash drop stash@{0}
```

---

## Undoing Changes

**Discard Working Changes:**
```bash
# Discard changes in file
git checkout -- filename.txt

# Modern way
git restore filename.txt

# Discard all changes
git restore .
```

**Undo Commits:**
```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Undo last commit, keep changes unstaged
git reset HEAD~1

# Undo last commit, discard changes (CAREFUL!)
git reset --hard HEAD~1

# Create new commit that undoes previous
git revert HEAD
```

---

## Quick Reference

**Daily Commands:**
```bash
git status              # Check status
git add .               # Stage all changes
git commit -m "msg"     # Commit
git push                # Push to remote
git pull                # Pull from remote
git log --oneline       # View history
git diff                # View changes
```

**Branch Commands:**
```bash
git branch              # List branches
git checkout -b name    # Create and switch
git merge branch        # Merge branch
git branch -d name      # Delete branch
```

**Emergency Commands:**
```bash
git stash               # Save work temporarily
git reset --hard        # Discard all changes
git reflog              # Find lost commits
git revert HEAD         # Undo last commit safely
git merge --abort       # Cancel merge
```

---

## Common Workflows

**Feature Development:**
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push to remote
git push -u origin feature/new-feature

# 4. Create pull request on GitHub

# 5. After merge, update main
git checkout main
git pull origin main

# 6. Delete feature branch
git branch -d feature/new-feature
```

**Fix a Bug:**
```bash
# 1. Create bugfix branch
git checkout -b bugfix/fix-login

# 2. Fix and commit
git add .
git commit -m "fix: Resolve login issue"

# 3. Push and create PR
git push -u origin bugfix/fix-login
```

---

## Comparing Changes

```bash
# Compare working directory with staging
git diff

# Compare staging with last commit
git diff --staged

# Compare two branches
git diff main..feature-branch

# Show files changed
git diff --name-only
```

---

## Best Practices

**Commit Often:**
- Make small, focused commits
- Each commit should be a logical unit
- Commit working code

**Write Clear Messages:**
- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Follow team conventions

**Branch Naming:**
```bash
feature/user-authentication
bugfix/login-error
hotfix/security-patch
docs/api-update
```

**Keep Main Clean:**
- Never commit directly to main
- Always use feature branches
- Review before merging

**Stay Updated:**
```bash
# Frequently pull latest changes
git checkout main
git pull origin main

# Update your feature branch
git checkout feature/my-work
git merge main
```

---

## Troubleshooting

**Accidentally Committed to Wrong Branch:**
```bash
# Undo commit but keep changes
git reset HEAD~1 --soft

# Switch to correct branch
git checkout correct-branch

# Commit there
git commit -m "Message"
```

**Lost Commits:**
```bash
# Show all actions
git reflog

# Recover lost commit
git checkout <commit-hash>
git checkout -b recovery-branch
```

**Undo Public Commit:**
```bash
# Don't use reset on pushed commits!
# Use revert instead
git revert <commit-hash>
git push origin main
```

---

## Learning Resources

- **Official Docs**: [git-scm.com](https://git-scm.com)
- **Interactive**: [learngitbranching.js.org](https://learngitbranching.js.org)
- **GitHub Guide**: [guides.github.com](https://guides.github.com)
- **Cheat Sheet**: [GitHub Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
