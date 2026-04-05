@echo off
REM ============================================================
REM Smart Assistant - Automated Setup Script (Windows)
REM ============================================================

setlocal enabledelayedexpansion

REM Colors (Windows 10+)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM ============================================================
REM Helper Functions
REM ============================================================

:print_header
echo.
echo %BLUE%╔════════════════════════════════════════════════════════════╗%NC%
echo %BLUE%║%NC% %~1
echo %BLUE%╚════════════════════════════════════════════════════════════╝%NC%
echo.
exit /b

:print_success
echo %GREEN%✅ %~1%NC%
exit /b

:print_error
echo %RED%❌ %~1%NC%
exit /b

:print_warning
echo %YELLOW%⚠️  %~1%NC%
exit /b

:print_info
echo %BLUE%ℹ️  %~1%NC%
exit /b

REM ============================================================
REM Check Prerequisites
REM ============================================================

call :print_header "Checking Prerequisites"

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
  call :print_error "Node.js is not installed"
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
call :print_success "Node.js installed: %NODE_VERSION%"

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
  call :print_error "npm is not installed"
  pause
  exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
call :print_success "npm installed: %NPM_VERSION%"

REM Check Git
where git >nul 2>nul
if %errorlevel% neq 0 (
  call :print_error "Git is not installed"
  echo Please install Git from https://git-scm.com/
  pause
  exit /b 1
)
for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
call :print_success "Git installed: %GIT_VERSION%"

REM ============================================================
REM Setup Backend
REM ============================================================

call :print_header "Setting Up Backend"

cd backend

call :print_info "Installing backend dependencies..."
call npm install
if %errorlevel% neq 0 (
  call :print_error "Failed to install backend dependencies"
  pause
  exit /b 1
)
call :print_success "Backend dependencies installed"

REM Create .env file if it doesn't exist
if not exist .env (
  call :print_info "Creating .env file from .env.example..."
  copy .env.example .env >nul
  call :print_warning "Please edit backend\.env with your MongoDB URI and other credentials"
) else (
  call :print_success ".env file already exists"
)

cd ..

REM ============================================================
REM Setup Frontend
REM ============================================================

call :print_header "Setting Up Frontend"

cd frontend

call :print_info "Installing frontend dependencies..."
call npm install
if %errorlevel% neq 0 (
  call :print_error "Failed to install frontend dependencies"
  pause
  exit /b 1
)
call :print_success "Frontend dependencies installed"

REM Create .env file if it doesn't exist
if not exist .env (
  call :print_info "Creating .env file from .env.example..."
  copy .env.example .env >nul
  call :print_success ".env file created with default values"
) else (
  call :print_success ".env file already exists"
)

cd ..

REM ============================================================
REM Setup Complete
REM ============================================================

call :print_header "Setup Complete! 🎉"

echo %GREEN%Both frontend and backend are ready to run!%NC%
echo.

echo %YELLOW%Next Steps:%NC%
echo 1. %BLUE%Edit backend\.env%NC% with your MongoDB URI
echo 2. %BLUE%Open two terminals%NC% in VS Code
echo 3. %BLUE%Terminal 1:%NC% cd backend ^&^& npm start
echo 4. %BLUE%Terminal 2:%NC% cd frontend ^&^& npm start
echo 5. %BLUE%Open browser:%NC% http://localhost:3000
echo.

echo %YELLOW%Or use the workspace file:%NC%
echo    %BLUE%code smart-assistant.code-workspace%NC%
echo.

echo %YELLOW%Documentation:%NC%
echo    - Quick Start: %BLUE%QUICK_START.md%NC%
echo    - Full Setup: %BLUE%SETUP_GUIDE.md%NC%
echo    - API Docs: %BLUE%API_DOCUMENTATION.md%NC%
echo    - Deployment: %BLUE%DEPLOYMENT.md%NC%
echo.

call :print_success "Happy coding! 🚀"

pause
