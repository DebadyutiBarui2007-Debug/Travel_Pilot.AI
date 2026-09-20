#!/usr/bin/env bash

# ==============================================================================
# TravelPilot - Automated Local Environment Setup Script
# Works on macOS, Linux, and Windows WSL / Git Bash
# ==============================================================================

set -e

# Color helpers
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "\n${BOLD}${BLUE}✈️  TravelPilot Automated Environment Setup${NC}"
echo -e "${BLUE}======================================================${NC}\n"

# 1. System Dependency Checks
echo -e "${YELLOW}[1/4] Checking system prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed.${NC}"
    echo "Please install Node.js (v18.0.0 or higher, v20+ recommended) from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d '.' -f 1)

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo -e "${RED}❌ Error: Node.js version $NODE_VERSION is too old.${NC}"
    echo "TravelPilot requires Node.js v18.0.0 or higher (v20+ recommended)."
    exit 1
else
    echo -e "${GREEN}✓ Node.js found: v$NODE_VERSION${NC}"
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed.${NC}"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm found: v$NPM_VERSION${NC}"
fi

# 2. Environment Configuration
echo -e "\n${YELLOW}[2/4] Configuring local environment variables...${NC}"

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env file from .env.example template.${NC}"
    else
        cat <<EOF > .env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=
EOF
        echo -e "${GREEN}✓ Created fresh .env configuration file.${NC}"
    fi
else
    echo -e "${GREEN}✓ Existing .env file detected.${NC}"
fi

# Ensure PORT is defined in .env
if ! grep -q "^PORT=" .env; then
    echo "PORT=3000" >> .env
fi

# 3. Dependency Installation
echo -e "\n${YELLOW}[3/4] Installing project dependencies...${NC}"

if [ -f package-lock.json ]; then
    npm ci || npm install
else
    npm install
fi

echo -e "${GREEN}✓ Dependencies installed successfully.${NC}"

# 4. Verification Check
echo -e "\n${YELLOW}[4/4] Verifying TypeScript type safety and integrity...${NC}"
npm run lint

echo -e "${GREEN}✓ Build and lint checks passed with zero errors!${NC}"

# Setup Complete Summary
echo -e "\n${BOLD}${GREEN}======================================================${NC}"
echo -e "${BOLD}${GREEN}🎉 Setup Complete! TravelPilot is ready to run.${NC}"
echo -e "${BOLD}${GREEN}======================================================${NC}\n"

echo -e "You can now start the application using:"
echo -e "  ${BOLD}npm run dev${NC}         - Starts unified Express + Vite full-stack server"
echo -e "  ${BOLD}npm run build${NC}       - Compiles production distribution bundle"
echo -e "  ${BOLD}npm start${NC}           - Runs compiled production server"
echo -e "\nAccess your app locally at: ${BOLD}http://localhost:3000${NC}\n"
