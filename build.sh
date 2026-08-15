#!/bin/bash

# TOTAG Group Platform Build Script
echo "🏗️  Building TOTAG Group Platform for Production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
mkdir -p dist/public
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build client (frontend)
echo "🎨 Building frontend..."
npm run build:client

# Build server (backend)
echo "⚙️  Building backend..."
npm run build:server

# Copy static assets
echo "📁 Copying static assets..."
cp -r public/* dist/public/ 2>/dev/null || true
cp -r client/public/* dist/public/ 2>/dev/null || true

# Create production package info
echo "📋 Creating build info..."
cat > dist/build-info.json << EOF
{
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "environment": "production",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)"
}
EOF

# Set correct permissions
chmod +x dist/index.js

echo "✅ Build completed successfully!"
echo "📂 Output directory: ./dist/"
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "  - Copy .env.production with your environment variables"
echo "  - Run: npm start (or node dist/index.js)"
echo "  - Access your app at http://localhost:3000"