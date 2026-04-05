# 🚀 Deployment Guide - Smart Assistant for Senior Citizens

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment (Railway/Render)](#backend-deployment-railwayrender)
4. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All code committed to GitHub
- [ ] No console errors or warnings
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] API endpoints tested locally

### ✅ Security
- [ ] JWT secrets are strong and unique
- [ ] Database credentials are secure
- [ ] API keys are not hardcoded
- [ ] CORS is properly configured
- [ ] HTTPS is enforced

### ✅ Performance
- [ ] Frontend build is optimized
- [ ] Images are compressed
- [ ] Code splitting is implemented
- [ ] Database indexes are created
- [ ] Caching strategies are in place

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build/` folder.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using GitHub Integration (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as root directory
5. Add environment variables:
   - `REACT_APP_API_URL`: `https://api.smartassistant.com/api`
   - `REACT_APP_ENV`: `production`
6. Click "Deploy"

### Step 3: Configure Custom Domain

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain (e.g., `smartassistant.com`)
3. Update DNS records with Vercel's nameservers
4. SSL certificate is automatically provisioned

### Step 4: Verify Deployment

```bash
# Test the deployed frontend
curl https://smartassistant.com

# Check build status
vercel status
```

---

## Backend Deployment (Railway/Render)

### Option A: Deploy to Railway (Recommended)

#### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

#### Step 2: Connect GitHub Repository

1. Click "New" → "GitHub Repo"
2. Select your repository
3. Select the `backend` folder as root directory

#### Step 3: Configure Environment Variables

In Railway dashboard:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartassistant
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_secret_key
REFRESH_TOKEN_EXPIRE=30d
CORS_ORIGIN=https://smartassistant.com
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
GOOGLE_MAPS_API_KEY=your_google_maps_key
SOCKET_IO_CORS_ORIGIN=https://smartassistant.com
LOG_LEVEL=error
SENTRY_DSN=your_sentry_dsn
```

#### Step 4: Deploy

1. Railway automatically deploys on push to main
2. Monitor deployment in Railway dashboard
3. Get your API URL from Railway (e.g., `https://api-production-xxxx.railway.app`)

#### Step 5: Update Frontend API URL

Update `frontend/.env.production`:
```
REACT_APP_API_URL=https://api-production-xxxx.railway.app/api
```

### Option B: Deploy to Render

#### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create a new Web Service

#### Step 2: Connect Repository

1. Select your GitHub repository
2. Set root directory to `backend`
3. Set build command: `npm install`
4. Set start command: `npm start`

#### Step 3: Configure Environment Variables

Add all variables from the Railway section above.

#### Step 4: Deploy

1. Click "Create Web Service"
2. Render automatically deploys
3. Get your API URL from Render dashboard

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Wait for cluster to be ready (5-10 minutes)

### Step 2: Create Database User

1. Go to Database Access
2. Click "Add New Database User"
3. Create username and password
4. Set permissions to "Read and write to any database"

### Step 3: Get Connection String

1. Go to Clusters → Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>` and `<password>` with your credentials
5. Replace `<dbname>` with `smartassistant`

Example:
```
mongodb+srv://user:password@cluster.mongodb.net/smartassistant?retryWrites=true&w=majority
```

### Step 4: Create Indexes

Connect to your database and run:

```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phone: 1 });
db.users.createIndex({ role: 1 });

// Elder indexes
db.elders.createIndex({ userId: 1 }, { unique: true });
db.elders.createIndex({ location: "2dsphere" });

// Caregiver indexes
db.caregivers.createIndex({ userId: 1 }, { unique: true });
db.caregivers.createIndex({ assignedElders: 1 });

// Volunteer indexes
db.volunteers.createIndex({ userId: 1 }, { unique: true });
db.volunteers.createIndex({ location: "2dsphere" });
db.volunteers.createIndex({ skills: 1 });

// SOS indexes
db.sos.createIndex({ elderId: 1 });
db.sos.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

// Notification indexes
db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
```

---

## Environment Variables

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://api.smartassistant.com/api
REACT_APP_ENV=production
REACT_APP_VERSION=1.0.0
REACT_APP_LOG_LEVEL=error
```

### Backend (.env.production)

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartassistant

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
REFRESH_TOKEN_EXPIRE=30d

# CORS
CORS_ORIGIN=https://smartassistant.com

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Socket.io
SOCKET_IO_CORS_ORIGIN=https://smartassistant.com

# Logging
LOG_LEVEL=error

# Error Tracking
SENTRY_DSN=your_sentry_dsn_for_error_tracking
```

---

## Post-Deployment Testing

### Step 1: Smoke Tests

```bash
# Test frontend is accessible
curl https://smartassistant.com

# Test API is accessible
curl https://api.smartassistant.com/api/health

# Test database connection
curl https://api.smartassistant.com/api/db-status
```

### Step 2: End-to-End Testing

1. **User Registration**
   - [ ] Sign up as Elder
   - [ ] Sign up as Caregiver
   - [ ] Sign up as Volunteer
   - [ ] Verify email OTP

2. **User Login**
   - [ ] Login with correct credentials
   - [ ] Verify JWT token is issued
   - [ ] Verify token is stored in localStorage

3. **Dashboard Access**
   - [ ] Elder can access elder dashboard
   - [ ] Caregiver can access caregiver dashboard
   - [ ] Volunteer can access volunteer dashboard

4. **Protected Routes**
   - [ ] Unauthenticated users cannot access dashboards
   - [ ] Users cannot access other roles' dashboards

### Step 3: Performance Testing

```bash
# Test API response time
time curl https://api.smartassistant.com/api/health

# Test frontend load time
# Use Chrome DevTools → Network tab
# Target: < 3 seconds for full page load
```

---

## Monitoring & Logging

### Step 1: Set Up Sentry (Error Tracking)

1. Go to [sentry.io](https://sentry.io)
2. Create a new project
3. Select React for frontend, Node.js for backend
4. Get your DSN
5. Add to environment variables

### Step 2: Configure Logging

**Backend logging:**
```javascript
const logger = require('./utils/logger');

logger.info('Application started');
logger.error('Error occurred', error);
logger.warn('Warning message');
```

**Frontend logging:**
```javascript
console.log('Development message');
// Production logs go to Sentry
```

### Step 3: Set Up Monitoring

**Railway/Render Dashboard:**
- Monitor CPU usage
- Monitor memory usage
- Monitor request count
- Monitor error rate

**Vercel Dashboard:**
- Monitor build times
- Monitor deployment status
- Monitor performance metrics

---

## Troubleshooting

### Frontend Issues

**Issue: Build fails with "out of memory"**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

**Issue: API calls return 404**
- Check `REACT_APP_API_URL` is correct
- Verify backend is deployed and running
- Check CORS configuration

**Issue: Styles not loading**
- Clear browser cache
- Verify CSS files are in build folder
- Check Vercel deployment logs

### Backend Issues

**Issue: Database connection fails**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Verify database user credentials

**Issue: JWT token errors**
- Verify JWT_SECRET is set
- Check token expiration time
- Verify token is being sent in Authorization header

**Issue: CORS errors**
- Verify CORS_ORIGIN matches frontend URL
- Check Access-Control headers are set
- Verify preflight requests are handled

### Database Issues

**Issue: Slow queries**
- Create indexes on frequently queried fields
- Use MongoDB Atlas Performance Advisor
- Optimize query patterns

**Issue: Connection pool exhausted**
- Increase connection pool size
- Close unused connections
- Monitor active connections

---

## Deployment Checklist

### Before Deployment
- [ ] All tests pass locally
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database is set up
- [ ] API keys are secure
- [ ] HTTPS is enabled
- [ ] CORS is configured

### During Deployment
- [ ] Monitor deployment logs
- [ ] Verify build succeeds
- [ ] Check for deployment errors
- [ ] Verify environment variables are set

### After Deployment
- [ ] Test all features work
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify database connectivity
- [ ] Test email notifications
- [ ] Test SMS notifications
- [ ] Verify location services

---

## Rollback Procedure

If something goes wrong:

### Vercel Rollback
1. Go to Vercel dashboard
2. Click on deployment
3. Click "Rollback"
4. Select previous deployment

### Railway/Render Rollback
1. Go to deployment history
2. Select previous deployment
3. Click "Redeploy"

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com
- **React Docs**: https://react.dev

---

**Last Updated**: April 2026
**Version**: 1.0.0
