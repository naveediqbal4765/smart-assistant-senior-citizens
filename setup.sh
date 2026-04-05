#!/bin/bash

# ============================================================
# Smart Assistant - Automated Setup Script
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================
# Helper Functions
# ============================================================

print_header() {
  echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║${NC} $1"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

# ============================================================
# Check Prerequisites
# ============================================================

print_header "Checking Prerequisites"

# Check Node.js
if ! command -v node &> /dev/null; then
  print_error "Node.js is not installed"
  echo "Please install Node.js from https://nodejs.org/"
  exit 1
fi
NODE_VERSION=$(node --version)
print_success "Node.js installed: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
  print_error "npm is not installed"
  exit 1
fi
NPM_VERSION=$(npm --version)
print_success "npm installed: $NPM_VERSION"

# Check Git
if ! command -v git &> /dev/null; then
  print_error "Git is not installed"
  echo "Please install Git from https://git-scm.com/"
  exit 1
fi
GIT_VERSION=$(git --version)
print_success "Git installed: $GIT_VERSION"

# ============================================================
# Setup Backend
# ============================================================

print_header "Setting Up Backend"

cd backend

print_info "Installing backend dependencies..."
npm install
print_success "Backend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  print_info "Creating .env file from .env.example..."
  cp .env.example .env
  print_warning "Please edit backend/.env with your MongoDB URI and other credentials"
else
  print_success ".env file already exists"
fi

cd ..

# ============================================================
# Setup Frontend
# ============================================================

print_header "Setting Up Frontend"

cd frontend

print_info "Installing frontend dependencies..."
npm install
print_success "Frontend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  print_info "Creating .env file from .env.example..."
  cp .env.example .env
  print_success ".env file created with default values"
else
  print_success ".env file already exists"
fi

cd ..

# ============================================================
# Setup Complete
# ============================================================

print_header "Setup Complete! 🎉"

echo -e "${GREEN}Both frontend and backend are ready to run!${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. ${BLUE}Edit backend/.env${NC} with your MongoDB URI"
echo -e "2. ${BLUE}Open two terminals${NC} in VS Code"
echo -e "3. ${BLUE}Terminal 1:${NC} cd backend && npm start"
echo -e "4. ${BLUE}Terminal 2:${NC} cd frontend && npm start"
echo -e "5. ${BLUE}Open browser:${NC} http://localhost:3000\n"

echo -e "${YELLOW}Or use the workspace file:${NC}"
echo -e "   ${BLUE}code smart-assistant.code-workspace${NC}\n"

echo -e "${YELLOW}Documentation:${NC}"
echo -e "   - Quick Start: ${BLUE}QUICK_START.md${NC}"
echo -e "   - Full Setup: ${BLUE}SETUP_GUIDE.md${NC}"
echo -e "   - API Docs: ${BLUE}API_DOCUMENTATION.md${NC}"
echo -e "   - Deployment: ${BLUE}DEPLOYMENT.md${NC}\n"

print_success "Happy coding! 🚀"
