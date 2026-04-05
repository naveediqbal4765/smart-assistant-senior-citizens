#!/bin/bash

# 🚀 Smart Assistant - Production Deployment Script
# This script automates the deployment process

set -e

echo "================================"
echo "🚀 Smart Assistant Deployment"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Verify Git Status
echo -e "${YELLOW}Step 1: Verifying Git Status...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Working directory is not clean. Please commit all changes.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git status is clean${NC}"
echo ""

# Step 2: Build Frontend
echo -e "${YELLOW}Step 2: Building Frontend...${NC}"
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
cd ..
echo ""

# Step 3: Verify Backend
echo -e "${YELLOW}Step 3: Verifying Backend...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Backend dependency installation failed${NC}"
    exit 1
fi
cd ..
echo ""

# Step 4: Push to GitHub
echo -e "${YELLOW}Step 4: Pushing to GitHub...${NC}"
git add -A
git commit -m "Production deployment - $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
git push origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
else
    echo -e "${RED}❌ Git push failed${NC}"
    exit 1
fi
echo ""

# Step 5: Deployment Instructions
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Deployment Preparation Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "📱 Frontend Deployment (Vercel):"
echo "  1. Go to https://vercel.com"
echo "  2. Import your GitHub repository"
echo "  3. Set root directory to 'frontend'"
echo "  4. Add environment variables from .env.production"
echo "  5. Click Deploy"
echo ""
echo "🔧 Backend Deployment (Railway):"
echo "  1. Go to https://railway.app"
echo "  2. Create new project from GitHub"
echo "  3. Set root directory to 'backend'"
echo "  4. Add environment variables from .env.production"
echo "  5. Railway will auto-deploy"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "  - Update environment variables with real values"
echo "  - Set up MongoDB Atlas cluster"
echo "  - Configure email and SMS services"
echo "  - Set up error tracking (Sentry)"
echo ""
