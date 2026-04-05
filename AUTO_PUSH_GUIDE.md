# 🚀 Auto-Push to Git Guide

This guide explains how to set up automatic Git pushes after every commit.

## Quick Setup

### Step 1: Run the Setup Script

```bash
chmod +x setup-git-hooks.sh
./setup-git-hooks.sh
```

This will:
- Create `.githooks` directory
- Configure Git to use custom hooks
- Enable auto-push on every commit

### Step 2: Verify Setup

```bash
git config core.hooksPath
# Should output: .githooks
```

## How It Works

When you commit changes:

```bash
git add .
git commit -m "Your commit message"
```

The post-commit hook automatically runs and pushes to GitHub:

```bash
git push origin main
```

## What Gets Pushed

- ✅ All staged changes
- ✅ Commit message
- ✅ Branch history
- ✅ Tags (if any)

## Disable Auto-Push (If Needed)

```bash
git config core.hooksPath ''
```

## Re-Enable Auto-Push

```bash
git config core.hooksPath .githooks
```

## Troubleshooting

### Push fails due to network issues
- The hook will show a warning but won't block the commit
- You can manually push later with: `git push origin main`

### Push fails due to conflicts
- Resolve conflicts locally first
- Then manually push: `git push origin main`

### Hook not executing
- Verify setup: `git config core.hooksPath`
- Check permissions: `ls -la .githooks/post-commit`
- Should show: `-rwxr-xr-x` (executable)

## Manual Push (If Needed)

If auto-push fails, manually push with:

```bash
git push origin main
```

## View Push History

```bash
git log --oneline -10
```

## Check Remote Status

```bash
git status
```

## Force Push (Use Carefully!)

```bash
git push origin main --force
```

⚠️ **Warning**: Only use force push if you know what you're doing!

---

## Git Workflow with Auto-Push

### 1. Make Changes
```bash
# Edit files
nano src/App.js
```

### 2. Stage Changes
```bash
git add .
# or specific files:
git add src/App.js
```

### 3. Commit (Auto-Push Happens Here!)
```bash
git commit -m "Update App component"
# ✅ Changes automatically pushed to GitHub
```

### 4. Verify on GitHub
```bash
# Check GitHub to confirm push was successful
# https://github.com/naveediqbal4765/smart-assistant-senior-citizens
```

---

## Best Practices

### ✅ DO:
- Commit frequently with clear messages
- Push after every meaningful change
- Keep commits small and focused
- Use descriptive commit messages

### ❌ DON'T:
- Commit large files (use .gitignore)
- Commit sensitive data (API keys, passwords)
- Force push to main branch
- Commit broken code

## Commit Message Examples

```bash
# Good
git commit -m "Add tag-based medical conditions input"
git commit -m "Fix responsive header collision on zoom"
git commit -m "Update deployment configuration"

# Bad
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

---

## Monitoring Auto-Push

### Check Last Push
```bash
git log -1 --format="%H %s" origin/main
```

### View Push History
```bash
git reflog
```

### Check Remote Branches
```bash
git branch -r
```

---

## Integration with CI/CD

Once auto-push is enabled, you can set up:

1. **GitHub Actions** - Automated testing on push
2. **Vercel** - Auto-deploy on push
3. **Railway** - Auto-deploy on push
4. **Sentry** - Error tracking on push

---

## Disable for Specific Commits

If you need to commit without pushing:

```bash
# Temporarily disable hook
git config core.hooksPath ''

# Make your commit
git commit -m "Work in progress"

# Re-enable hook
git config core.hooksPath .githooks

# Push manually when ready
git push origin main
```

---

## Advanced: Custom Hook Behavior

Edit `.githooks/post-commit` to customize behavior:

```bash
#!/bin/bash

# Add custom logic here
echo "Running tests before push..."
npm test

# Only push if tests pass
if [ $? -eq 0 ]; then
    git push origin main
    echo "✅ Tests passed and pushed to GitHub"
else
    echo "❌ Tests failed - not pushing"
    exit 1
fi
```

---

## Support

For issues with Git hooks:
- Check `.githooks/post-commit` permissions
- Verify Git version (2.9+)
- Check network connectivity
- Review Git configuration: `git config --list`

---

**Last Updated**: April 5, 2026  
**Version**: 1.0.0
