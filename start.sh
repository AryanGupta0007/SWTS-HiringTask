#!/bin/bash

# Delta Exchange Market Data App Startup Script

echo "Starting Delta Exchange Market Data Application..."

# Check if Python virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing Node.js dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start backend
echo "Starting Flask backend..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting React frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "Application started!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
