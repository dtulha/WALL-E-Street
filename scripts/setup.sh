#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "Checking prerequisites..."

if ! command_exists node; then
    echo "Error: Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

if ! command_exists npm; then
    echo "Error: npm is not installed. Please install npm."
    exit 1
fi

if ! command_exists python3; then
    echo "Error: Python 3 is not installed. Please install Python 3.12 or higher."
    exit 1
fi

if ! command_exists pip3; then
    echo "Error: pip3 is not installed. Please install pip3."
    exit 1
fi

# Install npm dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Create and activate Python virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi
# Source the virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r src/backend/requirements.txt

echo "Setup complete! You can now run 'npm run dev' to start the development servers." 