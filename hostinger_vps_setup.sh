#!/bin/bash
# Hostinger KVM VPS Automated Deployment Script for TOTAG OF COMPANIES LTD Platform
# Domain: totaggroup.com

set -e

echo "========================================================"
echo "🚀 TOTAG OF COMPANIES LTD — Hostinger KVM VPS Setup"
echo "   Target Domain: totaggroup.com"
echo "========================================================"

# Update system
echo "🔄 Updating package repositories..."
sudo apt update && sudo apt upgrade -y || sudo yum update -y

# Install Node.js 20 LTS & Build Tools
echo "📦 Installing Node.js 20 LTS, npm, git, curl, unzip, nginx, certbot..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git curl unzip nginx certbot python3-certbot-nginx || sudo yum install -y nodejs git curl unzip nginx certbot python3-certbot-nginx

# Install PM2 globally
echo "⚙️ Installing PM2 process manager..."
sudo npm install -g pm2

# Setup App Directory
echo "📁 Setting up /var/www/totaggroup directory..."
sudo mkdir -p /var/www/totaggroup
sudo chown -R $USER:$USER /var/www/totaggroup

# Clone or pull codebase
if [ -d "/var/www/totaggroup/.git" ]; then
    echo "🔄 Pulling latest code from GitHub..."
    cd /var/www/totaggroup
    git pull origin main
else
    echo "📥 Cloning TOTAG_GROUP_PLAFORM repository from GitHub..."
    git clone https://github.com/totagits/TOTAG_GROUP_PLAFORM.git /var/www/totaggroup
    cd /var/www/totaggroup
fi

# Install dependencies and build
echo "🔨 Installing npm dependencies..."
npm install --legacy-peer-deps

echo "🏗️ Building production distribution..."
npm run build

# Configure Nginx Reverse Proxy
echo "🌐 Configuring Nginx web server for totaggroup.com..."
sudo cat << 'EOF' > /etc/nginx/sites-available/totaggroup
server {
    listen 80;
    listen [::]:80;
    server_name totaggroup.com www.totaggroup.com;

    root /var/www/totaggroup/dist/public;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/totaggroup /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Start PM2 Cluster
echo "⚡ Starting PM2 cluster for Node.js backend..."
pm2 start ecosystem.config.js || pm2 start dist/index.js --name "totag-platform"
pm2 save
sudo pm2 startup systemd -u $USER --hp $HOME || true

# SSL Certificate Prompt
echo ""
echo "========================================================"
echo "✅ Deployment Successful!"
echo "🔒 To issue FREE SSL Certificate (HTTPS), run:"
echo "   sudo certbot --nginx -d totaggroup.com -d www.totaggroup.com"
echo "========================================================"
