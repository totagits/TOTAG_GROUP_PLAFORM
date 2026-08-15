# TOTAG Group Platform - Production Deployment Guide

## Overview
This guide covers deploying the TOTAG Group comprehensive business platform to production environments using Docker, traditional hosting, or cloud platforms.

## Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL 15+
- Docker and Docker Compose (for containerized deployment)
- SSL certificates (for HTTPS)
- Domain pointing to your server

## Quick Start with Docker

### 1. Environment Setup
```bash
# Copy environment template
cp env.production.template .env.production

# Edit with your actual values
nano .env.production
```

### 2. Deploy with Docker
```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## Manual Deployment

### 1. Server Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 4GB+ recommended  
- **Storage**: 20GB+ available space
- **OS**: Ubuntu 20.04+ or similar Linux distribution

### 2. Install Dependencies
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

### 3. Database Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE totaggroup;
CREATE USER totaguser WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE totaggroup TO totaguser;
\q
```

### 4. Application Setup
```bash
# Clone/upload your application files
cd /var/www/totaggroup

# Install dependencies
npm install

# Build the application
npm run build

# Set up environment variables
cp env.production.template .env.production
# Edit .env.production with your actual values

# Run database migrations
npm run db:push

# Seed initial data
npm run seed
```

### 5. Process Management with PM2
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'totag-platform',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Start the application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Nginx Configuration
```bash
# Install Nginx
sudo apt install nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/totaggroup
```

Add the nginx configuration from `nginx.conf`, then:
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/totaggroup /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL Setup with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d totaggroup.com -d www.totaggroup.com
```

## Cloud Platform Deployment

### Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create totag-platform

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secure-session-secret
heroku config:set RESEND_API_KEY=your-resend-api-key

# Deploy
git push heroku main
```

### DigitalOcean App Platform
1. Connect your GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. Add environment variables in the dashboard
4. Add PostgreSQL database component

### AWS EC2 + RDS
1. Launch EC2 instance (t3.medium recommended)
2. Create RDS PostgreSQL instance
3. Follow manual deployment steps above
4. Configure security groups for ports 22, 80, 443

## Environment Variables

### Required Variables
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@host:5432/database
SESSION_SECRET=your-super-secure-session-secret-min-32-chars
```

### Optional Variables
```bash
RESEND_API_KEY=your-resend-api-key-for-email
POSTGRES_PASSWORD=database-password-for-docker
SSL_CERT_PATH=/path/to/ssl/cert.pem
SSL_KEY_PATH=/path/to/ssl/key.pem
```

## Post-Deployment Checklist

### 1. Verify Services
```bash
# Check application status
curl http://localhost:3000/api/services

# Check database connection
npm run db:studio

# Check logs
tail -f logs/combined.log
```

### 2. Test Core Features
- [ ] Homepage loads correctly
- [ ] Service pages accessible
- [ ] Admin login works (admin/admin123)
- [ ] Product catalog displays
- [ ] Shopping cart functions
- [ ] Order processing works
- [ ] Email system operational

### 3. Performance Optimization
```bash
# Enable gzip compression (Nginx)
# Configure database connection pooling
# Set up CDN for static assets
# Configure monitoring (optional)
```

### 4. Security Checklist
- [ ] SSL certificate installed and working
- [ ] Firewall configured (UFW or similar)
- [ ] Database access restricted
- [ ] Regular backups scheduled
- [ ] Security headers configured
- [ ] Rate limiting enabled

## Monitoring and Maintenance

### Log Files
- Application: `logs/combined.log`
- Nginx: `/var/log/nginx/access.log`
- PostgreSQL: `/var/log/postgresql/`

### Backup Strategy
```bash
# Database backup
pg_dump -h localhost -U totaguser totaggroup > backup_$(date +%Y%m%d).sql

# Application backup
tar -czf app_backup_$(date +%Y%m%d).tar.gz /var/www/totaggroup
```

### Updates
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Rebuild application  
npm run build

# Restart services
pm2 restart totag-platform
```

## Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT in .env.production
2. **Database connection fails**: Check DATABASE_URL format
3. **SSL certificate issues**: Verify domain DNS and certificate paths
4. **Memory issues**: Increase server RAM or optimize queries

### Support
For deployment support, check the application logs and verify all environment variables are correctly set.

## Production URLs
- **Main Site**: https://totaggroup.com
- **Admin Panel**: https://totaggroup.com/admin-login  
- **Staff Login**: https://totaggroup.com/merchant-login
- **API Health**: https://totaggroup.com/api/services