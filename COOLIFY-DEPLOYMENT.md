# TOTAG Group Platform - Coolify Deployment Guide

## Overview
Coolify is a self-hosted alternative to Heroku/Vercel that makes deploying applications simple. This guide shows you how to deploy the TOTAG Group platform on your Coolify instance.

## Prerequisites
- Running Coolify server (v4+)
- Domain pointing to your Coolify server
- Access to Coolify dashboard
- Git repository with this code

## Method 1: Docker Compose Deployment (Recommended)

### Step 1: Prepare Your Repository
Ensure your repository contains:
- `coolify-docker-compose.yml` (provided)
- `Dockerfile` (provided)
- All application code

### Step 2: Create New Resource in Coolify
1. Login to your Coolify dashboard
2. Go to **Projects** → **New Resource**
3. Select **Docker Compose**
4. Choose **From Git Repository**

### Step 3: Configure Git Repository
```bash
Repository URL: https://github.com/yourusername/totag-platform
Branch: main
Docker Compose File: coolify-docker-compose.yml
```

### Step 4: Set Environment Variables
In Coolify dashboard, add these environment variables:

**Required Variables:**
```
NODE_ENV=production
SESSION_SECRET=your-super-secure-session-secret-min-32-chars
POSTGRES_PASSWORD=your-secure-postgres-password
```

**Optional Variables:**
```
RESEND_API_KEY=your-resend-api-key-for-emails
```

### Step 5: Configure Domain
1. In **Domains** section, add your domain:
   ```
   totaggroup.yourdomain.com
   ```
2. Enable **HTTPS** and **Force HTTPS Redirect**
3. Coolify will automatically generate SSL certificates

### Step 6: Deploy
1. Click **Deploy**
2. Monitor deployment logs
3. Wait for all services to be ready

## Method 2: Simple Docker Application

### Step 1: Create New Application
1. Go to **Projects** → **New Resource**
2. Select **Application**
3. Choose **From Git Repository**

### Step 2: Configure Application
```bash
Repository URL: https://github.com/yourusername/totag-platform
Branch: main
Build Pack: Docker
Port: 3000
```

### Step 3: Add Database
1. Create **New Resource** → **Database** → **PostgreSQL**
2. Note the connection details provided by Coolify

### Step 4: Environment Variables
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@postgres-host:5432/database
SESSION_SECRET=your-super-secure-session-secret
RESEND_API_KEY=your-resend-api-key
```

### Step 5: Deploy Application
1. Click **Deploy**
2. Coolify will build and deploy your application

## Post-Deployment Configuration

### 1. Verify Deployment
Visit your domain to check:
- Homepage loads: `https://totaggroup.yourdomain.com`
- API works: `https://totaggroup.yourdomain.com/api/services`
- Admin access: `https://totaggroup.yourdomain.com/admin-login`

### 2. Initial Setup
**Default Login Credentials:**
- Admin: `admin` / `admin123`
- Staff: `warehouse1` / `warehouse123`

**Important:** Change these passwords immediately after deployment!

### 3. Database Migration
The application will automatically:
- Create database tables on first run
- Seed initial data
- Set up admin users

## Coolify-Specific Features

### Auto-Deploy on Git Push
Enable automatic deployment when you push to your repository:
1. Go to **Settings** → **Git**
2. Enable **Auto Deploy**
3. Set **Branch**: `main`

### SSL Certificate Management
Coolify automatically handles SSL certificates:
- Let's Encrypt integration
- Auto-renewal
- Force HTTPS redirect

### Monitoring and Logs
Access logs through Coolify dashboard:
- **Application Logs**: Real-time application output
- **Build Logs**: Deployment process logs
- **Container Logs**: Docker container logs

### Backup Configuration
Set up automatic backups:
1. Go to **Backups** section
2. Configure **Database Backups**
3. Set backup frequency (daily recommended)

## Environment Variables Reference

### Core Application
```bash
NODE_ENV=production                    # Application environment
PORT=3000                             # Application port
SESSION_SECRET=your-secure-secret     # Session encryption key
```

### Database Configuration
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db  # Database connection
POSTGRES_PASSWORD=secure-password                  # PostgreSQL password
```

### Optional Services
```bash
RESEND_API_KEY=re_xxxxx              # Email service (optional)
```

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
- Verify DATABASE_URL format
- Check PostgreSQL service is running
- Ensure network connectivity between services

**2. Application Won't Start**
- Check application logs in Coolify
- Verify all required environment variables are set
- Ensure port 3000 is correctly configured

**3. Domain Not Accessible**
- Verify DNS records point to Coolify server
- Check domain configuration in Coolify
- Ensure SSL certificate is generated

**4. Build Failures**
- Check build logs for errors
- Verify Dockerfile syntax
- Ensure all dependencies are available

### Getting Help
1. Check Coolify logs for detailed error messages
2. Review application logs for runtime issues
3. Verify environment variables are correctly set
4. Test database connectivity

## Scaling and Performance

### Resource Limits
Configure in Coolify dashboard:
- **CPU Limit**: 1-2 cores recommended
- **Memory Limit**: 1GB minimum, 2GB recommended
- **Storage**: 10GB+ for database and logs

### Performance Optimization
- Enable gzip compression (handled by Coolify)
- Configure database connection pooling
- Set up monitoring and alerting

## Backup and Maintenance

### Database Backups
```bash
# Automatic backups via Coolify dashboard
# Manual backup command (if needed):
docker exec coolify-postgres pg_dump -U postgres totaggroup > backup.sql
```

### Application Updates
1. Push code changes to your Git repository
2. Coolify will automatically rebuild and deploy
3. Monitor deployment logs for any issues

## Production Checklist

After deployment, verify:
- [ ] Application loads successfully
- [ ] Database is accessible and populated
- [ ] Admin login works with default credentials
- [ ] SSL certificate is active and valid
- [ ] All API endpoints respond correctly
- [ ] Email system is configured (if using Resend)
- [ ] Backups are configured and running
- [ ] Monitoring is set up
- [ ] Default passwords have been changed

## Support

Your TOTAG Group platform includes:
- **7 Business Service Pages**
- **E-commerce Storefront** with shopping cart
- **Admin Dashboard** with user management
- **Content Management System** for products
- **Staff Management System** (HRMIS)
- **Order Tracking** and delivery management
- **Email Communication** system

The platform is ready to serve customers immediately after deployment on Coolify!