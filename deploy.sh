#!/bin/bash

# TOTAG Group Platform Deployment Script
echo "🚀 Starting TOTAG Group Platform Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found!"
    echo "📋 Please copy env.production.template to .env.production and configure your environment variables."
    exit 1
fi

# Create necessary directories
mkdir -p ssl
mkdir -p logs

echo "📦 Building Docker images..."
docker-compose build

echo "🗄️  Setting up database..."
docker-compose up -d postgres

# Wait for postgres to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🌱 Running database migrations..."
docker-compose exec -T postgres psql -U postgres -d totaggroup < init.sql

echo "🚀 Starting all services..."
docker-compose up -d

echo "✅ Deployment complete!"
echo "🌐 Your application should be available at:"
echo "   - HTTP: http://localhost"
echo "   - HTTPS: https://totaggroup.com (if SSL configured)"
echo ""
echo "📊 To check service status:"
echo "   docker-compose ps"
echo ""
echo "📋 To view logs:"
echo "   docker-compose logs -f"