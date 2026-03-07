# Deployment Guide

This guide covers deploying the Legal Data API to various cloud platforms.

## Table of Contents

- [Heroku](#heroku)
- [Railway](#railway)
- [Render](#render)
- [AWS](#aws)
- [Google Cloud Platform](#google-cloud-platform)
- [Azure](#azure)

---

## Heroku

### Prerequisites

- Heroku CLI installed
- Git repository initialized
- Heroku account

### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   heroku create legal-data-api
   ```

3. **Set environment variables (if needed)**
   ```bash
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Initial deploy"
   git push heroku main
   ```

5. **Scale dynos**
   ```bash
   heroku ps:scale web=1
   ```

6. **Open app**
   ```bash
   heroku open
   ```

7. **View logs**
   ```bash
   heroku logs --tail
   ```

### Heroku Configuration

Create a `Procfile` in the root directory:
```
web: node server.js
```

---

## Railway

### Prerequisites

- Railway CLI installed
- Railway account

### Steps

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize project**
   ```bash
   railway init
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Get domain**
   ```bash
   railway domain
   ```

### Environment Variables on Railway

Set via Railway dashboard or CLI:
```bash
railway variables set NODE_ENV=production
```

---

## Render

### Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deploy"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure service**
   - **Name**: `legal-data-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or paid

4. **Create Web Service**

5. **Verify deployment**
   - Wait for build to complete
   - Click on the URL provided

### Environment Variables on Render

Add in Render dashboard under "Environment":
```
NODE_ENV=production
```

---

## AWS (Elastic Beanstalk)

### Prerequisites

- AWS CLI installed and configured
- EB CLI installed

### Steps

1. **Initialize Elastic Beanstalk**
   ```bash
   eb init -p node.js legal-data-api
   ```

2. **Create environment and deploy**
   ```bash
   eb create legal-data-api-env
   ```

3. **Open application**
   ```bash
   eb open
   ```

4. **Deploy updates**
   ```bash
   eb deploy
   ```

### AWS Configuration

Create `.ebextensions/nodecommand.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

---

## Google Cloud Platform (App Engine)

### Prerequisites

- Google Cloud SDK installed
- GCP project created

### Steps

1. **Create app.yaml**
   ```yaml
   runtime: nodejs18
   env: standard
   
   handlers:
   - url: /.*
     script: auto
   
   env_variables:
     NODE_ENV: 'production'
   ```

2. **Deploy**
   ```bash
   gcloud app deploy
   ```

3. **View application**
   ```bash
   gcloud app browse
   ```

---

## Azure (App Service)

### Prerequisites

- Azure CLI installed
- Azure account

### Steps

1. **Login**
   ```bash
   az login
   ```

2. **Create resource group**
   ```bash
   az group create --name legalApiRG --location eastus
   ```

3. **Create App Service plan**
   ```bash
   az appservice plan create --name legalApiPlan --resource-group legalApiRG --sku FREE
   ```

4. **Create web app**
   ```bash
   az webapp create --name legal-data-api --resource-group legalApiRG --plan legalApiPlan --runtime "NODE|18-lts"
   ```

5. **Configure deployment from GitHub**
   - Go to Azure Portal
   - Navigate to your web app
   - Under "Deployment Center", connect to GitHub
   - Select your repository and branch

---

## Post-Deployment Checklist

- [ ] API responds to health check (`/`)
- [ ] All endpoints return correct data
- [ ] Rate limiting is active
- [ ] CORS is configured if needed
- [ ] Environment variables are set
- [ ] Logging is working
- [ ] Error handling is functioning

## Testing Your Deployed API

```bash
# Replace with your deployed URL
BASE_URL="https://your-app.herokuapp.com"

# Health check
curl $BASE_URL/

# Test endpoints
curl $BASE_URL/states
curl $BASE_URL/case-types
curl $BASE_URL/statute-of-limitations/CA/personal-injury
curl $BASE_URL/average-settlement/car-accident
```

## Troubleshooting

### Port Issues
Ensure your app uses `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Missing Dependencies
Run `npm install` locally to update `package-lock.json`, then commit it.

### Build Failures
Check Node.js version compatibility in `package.json`:
```json
"engines": {
  "node": ">=14.0.0"
}
```

### CORS Errors
CORS is pre-configured in `server.js`. If issues persist, check your client configuration.

---

For additional help, refer to your chosen platform's documentation.
