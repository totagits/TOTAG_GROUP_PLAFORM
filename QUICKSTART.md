# TOTAG Group Platform - Quick Deployment Guide

## 🚀 One-Click Deployment Options

### Option 1: Heroku (Recommended for beginners)
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

1. Click the button above
2. Fill in app name: `your-app-name`
3. Set `SESSION_SECRET` (generate a random 32+ character string)
4. Optionally add `RESEND_API_KEY` for email functionality
5. Click "Deploy app"

**Your app will be live at:** `https://your-app-name.herokuapp.com`

### Option 2: Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. Connect your GitHub account
2. Fork this repository
3. Deploy from Railway dashboard
4. Add environment variables in Railway dashboard

### Option 3: Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Connect GitHub and select this repository
2. Choose "Web Service"
3. Add environment variables from template

### Option 4: Coolify (Self-Hosted)
🚀 **Perfect for self-hosting!**

1. Access your Coolify dashboard
2. Create **New Resource** → **Docker Compose**
3. Connect your Git repository
4. Use `coolify-docker-compose.yml` as compose file
5. Set environment variables and domain
6. Deploy!

📖 **See [COOLIFY-DEPLOYMENT.md](COOLIFY-DEPLOYMENT.md) for detailed instructions**

## 🏠 Self-Hosted Deployment

### Docker (Easiest self-hosted option)
```bash
# 1. Clone repository
git clone <your-repo-url>
cd totag-platform

# 2. Set up environment
cp env.production.template .env.production
# Edit .env.production with your database details

# 3. Deploy with Docker
chmod +x deploy.sh
./deploy.sh
```

**Your app will be running at:** `http://localhost`

### Manual Server Setup
```bash
# 1. Install Node.js 18+ and PostgreSQL
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql

# 2. Setup database
sudo -u postgres createdb totaggroup

# 3. Build and run
npm install
npm run build
npm start
```

## ⚙️ Required Environment Variables

Create `.env.production` file:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/totaggroup
SESSION_SECRET=your-very-secure-random-string-at-least-32-characters
```

## 🧪 Test Your Deployment

After deployment, test these URLs:
- **Homepage**: `https://your-domain.com`
- **Admin Login**: `https://your-domain.com/admin-login` 
- **Staff Dashboard**: `https://your-domain.com/merchant-login`
- **API Health**: `https://your-domain.com/api/services`

### Default Login Credentials
- **Admin**: `admin` / `admin123`
- **Staff**: `warehouse1` / `warehouse123`

## 🔧 Post-Deployment Setup

1. **Change default passwords** in admin dashboard
2. **Configure email** (add RESEND_API_KEY for notifications)
3. **Add your products** via CMS at `/merchant-login`
4. **Test order processing** and payments
5. **Set up SSL certificate** for production domains

## 📞 Support

If you encounter issues:
1. Check application logs
2. Verify all environment variables are set
3. Ensure database is accessible
4. Test API endpoints manually

## 🎯 What's Included

This platform includes:
- **7 Business Service Pages** (IT Services, Catering, General Merchandise, etc.)
- **E-commerce Storefront** with shopping cart and mobile money payments
- **Admin Dashboard** with user management
- **Content Management System** for products and content
- **Staff Management System** (HRMIS) with role-based access
- **Order Tracking** and delivery management
- **Email Communication** system

**Ready to serve customers immediately after deployment!**