#!/bin/bash

# Setup Git Hooks for Auto-Push
# This script configures Git to automatically push changes after every commit

echo "================================"
echo "🔧 Setting up Git Auto-Push Hooks"
echo "================================"
echo ""

# Create .githooks directory if it doesn't exist
mkdir -p .githooks

# Make the post-commit hook executable
chmod +x .githooks/post-commit

# Configure Git to use our custom hooks directory
git config core.hooksPath .githooks

echo "✅ Git hooks configured successfully!"
echo ""
echo "From now on, every commit will automatically push to GitHub."
echo ""
echo "To disable auto-push, run:"
echo "  git config core.hooksPath ''"
echo ""
echo "To re-enable auto-push, run:"
echo "  git config core.hooksPath .githooks"
echo ""
