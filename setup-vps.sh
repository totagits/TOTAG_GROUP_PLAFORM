#!/bin/bash
set -e

echo "========================================================"
echo "🚀 STARTING TOTAG ENTERPRISE VPS AUTOMATED DEPLOYMENT"
echo "========================================================"

# 1. Enable Password Authentication in SSH for future access
echo "🔑 Enabling SSH Password Authentication..."
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
echo "PasswordAuthentication yes" > /etc/ssh/sshd_config.d/99-custom.conf
echo "PermitRootLogin yes" >> /etc/ssh/sshd_config.d/99-custom.conf
systemctl restart ssh || systemctl restart sshd || true

# 2. Update Ubuntu system packages & install Node.js 18 + PostgreSQL + Nginx
echo "📦 Installing Node.js 18, PostgreSQL, Nginx, and PM2..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git nginx postgresql postgresql-contrib build-essential ufw

curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install -g pm2

# 3. Configure PostgreSQL Database & Permissions
echo "🗄️ Configuring PostgreSQL Database 'totaggroup'..."
sudo -u postgres psql -c "CREATE DATABASE totaggroup;" || true
sudo -u postgres psql -c "CREATE USER totaguser WITH ENCRYPTED PASSWORD 'Zwedru4@gedeh';" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE totaggroup TO totaguser;" || true
sudo -u postgres psql -c "ALTER USER totaguser WITH SUPERUSER;" || true

# 4. Clone / Fetch latest application repository
echo "📥 Fetching TOTAG Enterprise Digital Ecosystem Codebase..."
mkdir -p /var/www
if [ -d "/var/www/totag" ]; then
  cd /var/www/totag
  git reset --hard
  git pull origin master
else
  git clone https://github.com/totagits/TOTAG_GROUP_PLAFORM.git /var/www/totag
  cd /var/www/totag
fi

# 5. Write Production Environment Configuration
echo "⚙️ Setting up Production Environment Variables..."
cat << 'EOF' > /var/www/totag/.env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://totaguser:Zwedru4@gedeh@localhost:5432/totaggroup
SESSION_SECRET=totag-enterprise-super-secret-key-2026
EOF

# 6. Install Dependencies & Build Production Bundles
echo "🔨 Building Full-Stack Express Server & Vite Frontend..."
cd /var/www/totag
npm install
npm run build

# 7. Apply PostgreSQL Database Migrations
echo "🌱 Migrating PostgreSQL Database Schema..."
DATABASE_URL=postgresql://totaguser:Zwedru4@gedeh@localhost:5432/totaggroup npm run db:push

# 8. Start Application Server via PM2
echo "⚡ Launching Express Server via PM2 Process Manager..."
pm2 delete totag-platform || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup || true

# 9. Configure Nginx Reverse Proxy
echo "🌐 Configuring Nginx Reverse Proxy..."
cat << 'EOF' > /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name totag.network www.totag.network srv1902704.hstgr.cloud 2.24.115.245;

    location / {
        proxy_pass http://127.0.0.1:3000;
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

systemctl restart nginx

echo "========================================================"
echo "✅ TOTAG ENTERPRISE PLATFORM DEPLOYED SUCCESSFULLY!"
echo "🌐 Live Server IP: http://2.24.115.245"
echo "🌐 Hostname: http://srv1902704.hstgr.cloud"
echo "========================================================"
