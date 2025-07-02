# RNC Malaysia Website - Deployment Guide

## 1. Environment Configuration

Create a `.env` file in the root directory with the following variables (fill in your own values):

```
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Connection
MONGODB_URI_PRODUCTION=mongodb+srv://<username>:<password>@cluster.mongodb.net/refugee-network

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_key_for_production
JWT_EXPIRE=30d

# Email Configuration (for password reset, notifications)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-production-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@rncmalaysia.com
```

## 2. Frontend Production Build

To create an optimized production build of the React frontend:

```bash
# Navigate to client directory
cd client

# Install dependencies (if not already installed)
npm install

# Create production build
npm run build
```

## 3. Backend Preparation

Ensure all backend dependencies are installed:

```bash
# From project root
npm install
```

## 4. Deployment Options

### Option 1: Heroku Deployment

1. Create a Heroku account and install the Heroku CLI
2. Create a new Heroku app: `heroku create rncmalaysia`
3. Add MongoDB add-on or use MongoDB Atlas connection string in `.env`
4. Add your environment variables to Heroku: `heroku config:set KEY=VALUE`
5. Deploy your app: `git push heroku master`

### Option 2: Vercel Deployment

1. Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/build/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/build/index.html"
    }
  ]
}
```

2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Option 3: Netlify (Frontend) + Render (Backend)

#### Frontend (Netlify):
1. Create a `netlify.toml` file in your project root:

```toml
[build]
  base = "client/"
  publish = "build/"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Connect your GitHub repository to Netlify
3. Configure build settings

#### Backend (Render):
1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set the build command: `npm install`
4. Set the start command: `node server.js`
5. Add environment variables

## 5. Domain Configuration

After deployment, you can configure a custom domain (e.g., rncmalaysia.org) through your deployment provider's dashboard.

## 6. SSL Configuration

Enable SSL/HTTPS through your deployment provider (most offer free SSL certificates).

## 7. Continuous Integration/Deployment

Set up GitHub Actions for automated testing and deployment:

1. Create `.github/workflows/deploy.yml` file
2. Configure workflow for automated deployments

## 8. Monitoring and Maintenance

Consider adding:
- Application monitoring with New Relic or Sentry
- Regular database backups
- Security scanning
