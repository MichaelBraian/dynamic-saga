#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Netlify deployment test...${NC}\n"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file with required environment variables"
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
required_vars=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}Error: $var is not set in .env${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✓ Environment variables check passed${NC}"

# Clean previous build
echo -e "\n${YELLOW}Cleaning previous build...${NC}"
rm -rf dist
rm -rf .netlify/cache

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed successfully${NC}"

# Type check
echo -e "\n${YELLOW}Running type check...${NC}"
npx tsc -p tsconfig.build.json --noEmit
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Type check failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Type check passed${NC}"

# Run build
echo -e "\n${YELLOW}Running build...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build completed successfully${NC}"

# Check for critical files in build output
echo -e "\n${YELLOW}Checking build output...${NC}"
required_files=(
    "dist/index.html"
    "dist/assets"
)

for file in "${required_files[@]}"; do
    if [ ! -e "$file" ]; then
        echo -e "${RED}Error: Required file/directory not found: $file${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✓ Build output verification passed${NC}"

# Check for Netlify configuration
echo -e "\n${YELLOW}Checking Netlify configuration...${NC}"
if [ ! -f netlify.toml ]; then
    echo -e "${RED}Error: netlify.toml not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Netlify configuration found${NC}"

# Verify redirects for SPA
echo -e "\n${YELLOW}Verifying SPA configuration...${NC}"
if ! grep -q "/*" netlify.toml; then
    echo -e "${YELLOW}Warning: SPA redirect rule not found in netlify.toml${NC}"
    echo "Consider adding:"
    echo "[[redirects]]"
    echo "  from = \"/*\""
    echo "  to = \"/index.html\""
    echo "  status = 200"
fi

# Check for build cache configuration
echo -e "\n${YELLOW}Checking build cache configuration...${NC}"
if ! grep -q "netlify-plugin-cache" netlify.toml; then
    echo -e "${YELLOW}Warning: Cache plugin not configured in netlify.toml${NC}"
    echo "Consider adding the cache plugin configuration"
fi

# Test preview server
echo -e "\n${YELLOW}Starting preview server...${NC}"
npm run preview &
PREVIEW_PID=$!

# Wait for server to start
sleep 5

# Check if preview server is running
if ! lsof -i :4173 > /dev/null; then
    echo -e "${RED}Error: Preview server failed to start${NC}"
    kill $PREVIEW_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✓ Preview server started successfully${NC}"

# Clean up
kill $PREVIEW_PID 2>/dev/null

echo -e "\n${GREEN}✅ Netlify deployment test completed successfully!${NC}"
echo -e "Your application should be compatible with Netlify deployment.\n"

# Additional recommendations
echo -e "${YELLOW}Recommendations:${NC}"
echo "1. Ensure all environment variables are configured in Netlify dashboard"
echo "2. Set up build hooks if needed"
echo "3. Configure custom domain settings"
echo "4. Set up branch deploys if required" 