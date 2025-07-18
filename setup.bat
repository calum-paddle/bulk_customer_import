@echo off
echo 🚀 Setting up Paddle Bulk Customer Importer...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 14 or higher.
    pause
    exit /b 1
)

echo ✅ Python and Node.js are installed

REM Install frontend dependencies
echo 📦 Installing frontend dependencies (npm install)...
npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

REM Create and setup Python virtual environment
echo 🐍 Setting up Python virtual environment...
if not exist "venv\Scripts\activate.bat" (
    echo 📁 Creating virtual environment...
    python -m venv venv
)

echo 🔧 Activating virtual environment and installing backend dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

echo 🎉 Setup complete!
echo 📝 To start the application, run: start.bat
pause 