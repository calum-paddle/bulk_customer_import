#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Setting up Paddle Bulk Customer Importer...${NC}"

# Check if Python3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 14 or higher.${NC}"
    exit 1
fi

echo -e "${BLUE}✅ Python3 and Node.js are installed${NC}"

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies (npm install)...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

# Create and setup Python virtual environment
echo -e "${BLUE}🐍 Setting up Python virtual environment...${NC}"
if [ ! -f "venv/bin/activate" ]; then
    echo -e "${BLUE}📁 Creating virtual environment...${NC}"
    python3 -m venv venv
fi

echo -e "${BLUE}🔧 Activating virtual environment and installing backend dependencies...${NC}"
source venv/bin/activate
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo -e "${YELLOW}📝 To start the application, run: ./start.sh${NC}"
echo -e "${YELLOW}📝 Or on Windows: start.bat${NC}" 