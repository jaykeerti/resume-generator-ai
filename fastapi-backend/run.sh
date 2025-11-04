#!/bin/bash

# FastAPI Development Server Startup Script

echo "Starting FastAPI Resume Parser Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "Please edit .env with your actual API keys before continuing."
    read -p "Press enter when ready to continue..."
fi

# Start the server
echo "Starting uvicorn server on port ${PORT:-8000}..."
python main.py
