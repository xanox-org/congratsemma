#!/bin/bash

# Docker Host Setup Script for congratsemma deployment
# This script helps prepare a Docker host for automated deployment

set -e

echo "🐳 Setting up Docker host for congratsemma deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "   sudo sh get-docker.sh"
    exit 1
fi

echo "✅ Docker is installed"

# Check if Docker Compose is installed
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is available"
    COMPOSE_AVAILABLE=true
else
    echo "⚠️  Docker Compose not found. Using direct Docker deployment."
    COMPOSE_AVAILABLE=false
fi

# Ensure Docker service is running
if ! sudo systemctl is-active --quiet docker; then
    echo "🔄 Starting Docker service..."
    sudo systemctl start docker
    sudo systemctl enable docker
fi

echo "✅ Docker service is running"

# Check if current user is in docker group
if ! groups $USER | grep -q '\bdocker\b'; then
    echo "🔄 Adding user to docker group..."
    sudo usermod -aG docker $USER
    echo "⚠️  You need to log out and back in for group changes to take effect"
    echo "   Or run: newgrp docker"
fi

# Create deployment directory
DEPLOY_DIR="$HOME/congratsemma-deployment"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Download docker-compose.yml if available
if [ "$COMPOSE_AVAILABLE" = true ]; then
    echo "📥 Setting up Docker Compose configuration..."
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  congratsemma:
    image: ghcr.io/xanox-org/congratsemma:latest
    container_name: congratsemma
    restart: unless-stopped
    ports:
      - "${APP_PORT:-8080}:80"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80"]
      timeout: 10s
      interval: 30s
      retries: 3
      start_period: 40s
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
    networks:
      - web

networks:
  web:
    external: false
EOF
    
    # Create .env file
    cat > .env << EOF
# Application port (change as needed)
APP_PORT=8080
EOF
    
    echo "✅ Docker Compose configuration created in $DEPLOY_DIR"
    echo "   Edit .env file to customize settings"
fi

# Test Docker access
echo "🧪 Testing Docker access..."
if docker ps >/dev/null 2>&1; then
    echo "✅ Docker access test passed"
else
    echo "❌ Docker access test failed. You may need to:"
    echo "   1. Log out and back in (for group changes)"
    echo "   2. Run: newgrp docker"
    echo "   3. Or use sudo with Docker commands"
fi

echo ""
echo "🎉 Docker host setup completed!"
echo ""
echo "Next steps:"
echo "1. Configure GitHub organization secrets:"
echo "   - SSH_HOST: $(hostname -I | awk '{print $1}')"
echo "   - SSH_USER: $USER"
echo "   - SSH_PRIVATE_KEY: (your private SSH key)"
echo "   - DOCKER_PORT: 22 (or your SSH port)"
echo "   - DOCKER_APP_PORT: 8080 (or desired port)"
echo ""
echo "2. Test manual deployment:"
echo "   docker run -d --name congratsemma --restart unless-stopped -p 8080:80 ghcr.io/xanox-org/congratsemma:latest"
echo ""

if [ "$COMPOSE_AVAILABLE" = true ]; then
    echo "3. Or use Docker Compose:"
    echo "   cd $DEPLOY_DIR"
    echo "   docker-compose up -d"
    echo ""
fi

echo "4. Verify deployment:"
echo "   curl http://localhost:8080"
echo ""
echo "🚀 Ready for automated deployment!"