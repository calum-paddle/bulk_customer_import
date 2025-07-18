@echo off
echo 🚀 Starting Paddle Bulk Customer Importer...

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

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo 🐍 Creating Python virtual environment...
    python -m venv venv
)

echo 🔧 Activating virtual environment and installing backend dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo 🔧 Starting Flask backend server on http://localhost:5000...
start "Flask Backend" cmd /k "call venv\Scripts\activate.bat && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo 🎨 Starting React frontend server on http://localhost:3000...
start "React Frontend" cmd /k "npm start"

echo ✅ Both servers are starting up!
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔧 Backend API will be available at: http://localhost:5000
echo.
echo Press any key to close this window (servers will continue running)...
pause >nul 