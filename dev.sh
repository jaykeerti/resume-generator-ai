#!/bin/bash

# Development startup script for both Next.js and FastAPI

echo "🚀 Starting Resume Generator AI Development Environment"
echo "================================================"

# Function to cleanup on exit
cleanup() {
    echo -e "\n🛑 Shutting down services..."
    kill $FASTAPI_PID $NEXTJS_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Start FastAPI backend
echo -e "\n📦 Starting FastAPI backend on port 8000..."
cd fastapi-backend

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate venv and install dependencies
source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Check for .env
if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please configure fastapi-backend/.env with your API keys"
fi

# Start FastAPI in background
python main.py > ../logs/fastapi.log 2>&1 &
FASTAPI_PID=$!
cd ..

# Wait for FastAPI to start
echo "Waiting for FastAPI to initialize..."
sleep 3

# Start Next.js frontend
echo -e "\n🎨 Starting Next.js frontend on port 3000..."

# Check for .env.local
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        echo "Creating .env.local from .env.example..."
        cp .env.example .env.local
        echo "⚠️  Please configure .env.local with your API keys"
    fi
fi

# Install npm dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Start Next.js in background
npm run dev > logs/nextjs.log 2>&1 &
NEXTJS_PID=$!

echo -e "\n✅ Development environment is running!"
echo "================================================"
echo "📱 Next.js Frontend:  http://localhost:3000"
echo "🔧 FastAPI Backend:   http://localhost:8000"
echo "📊 FastAPI Docs:      http://localhost:8000/docs"
echo "📝 Logs:"
echo "   - FastAPI: logs/fastapi.log"
echo "   - Next.js: logs/nextjs.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo "================================================"

# Wait for either process to exit
wait $FASTAPI_PID $NEXTJS_PID
