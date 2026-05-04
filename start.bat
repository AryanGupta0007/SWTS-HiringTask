@echo off
REM Delta Exchange Market Data App Startup Script for Windows

echo Starting Delta Exchange Market Data Application...

REM Check if Python virtual environment exists
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
)

REM Check if node_modules exists
if not exist "frontend\node_modules" (
    echo Installing Node.js dependencies...
    cd frontend
    npm install
    cd ..
)

REM Start backend
echo Starting Flask backend...
cd backend
call venv\Scripts\activate
start "Backend" python app.py
cd ..

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo Starting React frontend...
cd frontend
start "Frontend" npx serve -s build
cd ..

echo Application started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause
