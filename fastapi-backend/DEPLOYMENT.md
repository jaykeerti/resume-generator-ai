# FastAPI Backend Deployment Guide

This guide covers deploying the FastAPI resume parser backend to various cloud platforms.

## Prerequisites

- FastAPI backend tested locally
- Environment variables configured
- Anthropic API key available

## Deployment Options

### Option 1: Railway (Recommended)

Railway provides easy Python deployments with automatic HTTPS.

#### Steps:

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Initialize Project**:
```bash
cd fastapi-backend
railway init
```

4. **Set Environment Variables**:
```bash
railway variables set ANTHROPIC_API_KEY=your_key_here
railway variables set PORT=8000
railway variables set NEXTJS_URL=https://your-nextjs-app.vercel.app
```

5. **Deploy**:
```bash
railway up
```

6. **Get Deployment URL**:
```bash
railway domain
# Save this URL - you'll need it for FASTAPI_URL in Vercel
```

#### Railway Configuration:

Railway should auto-detect the Python app. If not, add `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### Option 2: Render

Render offers free tier with automatic deploys from Git.

#### Steps:

1. **Create New Web Service** on Render dashboard
2. **Connect GitHub Repository**
3. **Configure Build Settings**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: `Python 3`

4. **Set Environment Variables** in Render dashboard:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
   - `NEXTJS_URL`: Your Next.js Vercel URL
   - `LOG_LEVEL`: INFO

5. **Deploy**: Render auto-deploys on git push

#### Render Configuration File:

Create `render.yaml` in `fastapi-backend/`:

```yaml
services:
  - type: web
    name: resume-parser-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: NEXTJS_URL
        sync: false
      - key: PORT
        value: 8000
```

---

### Option 3: DigitalOcean App Platform

DigitalOcean provides managed Python hosting.

#### Steps:

1. **Create App** on DigitalOcean dashboard
2. **Connect GitHub Repository**
3. **Select `fastapi-backend` directory** as source
4. **Configure App**:
   - **Type**: Web Service
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Run Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`

5. **Add Environment Variables**:
   - `ANTHROPIC_API_KEY`
   - `NEXTJS_URL`
   - `PORT=8000`

6. **Deploy**: Click "Create Resources"

---

### Option 4: Fly.io

Fly.io offers global edge deployment.

#### Steps:

1. **Install Fly CLI**:
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login**:
```bash
fly auth login
```

3. **Launch App**:
```bash
cd fastapi-backend
fly launch
```

4. **Set Secrets**:
```bash
fly secrets set ANTHROPIC_API_KEY=your_key_here
fly secrets set NEXTJS_URL=https://your-app.vercel.app
```

5. **Deploy**:
```bash
fly deploy
```

#### Fly Configuration:

Create `fly.toml`:

```toml
app = "resume-parser-api"
primary_region = "iad"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8000"

[[services]]
  internal_port = 8000
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

---

### Option 5: AWS Lambda (Serverless)

Use Mangum adapter for serverless deployment.

#### Steps:

1. **Install Dependencies**:
```bash
pip install mangum
```

2. **Update `main.py`**:
```python
from mangum import Mangum

# ... existing code ...

handler = Mangum(app)
```

3. **Deploy with Serverless Framework** or AWS SAM

---

## After Deployment

### 1. Update Vercel Environment Variables

In your Vercel project settings, update:
```
FASTAPI_URL=https://your-fastapi-deployment-url.com
```

### 2. Test the Connection

```bash
# Health check
curl https://your-fastapi-url.com/health

# Test via Next.js proxy
curl https://your-nextjs-app.vercel.app/api/parse-resume
```

### 3. Update CORS Settings

If needed, update `main.py` CORS allowed origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-nextjs-app.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
```

---

## Monitoring & Logs

### Railway:
```bash
railway logs
```

### Render:
Check logs in Render dashboard

### DigitalOcean:
View logs in App Platform console

### Fly.io:
```bash
fly logs
```

---

## Performance Optimization

### 1. Enable Caching

Consider adding Redis for caching parsed resumes:

```python
import redis

cache = redis.from_url(os.getenv("REDIS_URL"))
```

### 2. Connection Pooling

Use connection pooling for better performance:

```python
from anthropic import AsyncAnthropic

client = AsyncAnthropic(
    api_key=api_key,
    max_connections=10
)
```

### 3. Rate Limiting

Add rate limiting to prevent abuse:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

---

## Troubleshooting

### Build Failures

- Check Python version (requires 3.11+)
- Verify all dependencies in `requirements.txt`
- Check build logs for missing system packages

### Runtime Errors

- Verify environment variables are set
- Check Anthropic API key is valid
- Review application logs

### Connection Issues

- Ensure CORS is configured correctly
- Verify FASTAPI_URL in Vercel matches deployment URL
- Check firewall/security group settings

---

## Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] Anthropic API key is stored securely
- [ ] CORS is restricted to your Next.js domain
- [ ] HTTPS is enabled
- [ ] Rate limiting is configured
- [ ] Input validation is in place
- [ ] File size limits are enforced

---

## Cost Estimates

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| Railway | $5/month credit | $0.000463/GB-sec |
| Render | 750 hours/month | $7/month |
| DigitalOcean | N/A | $5/month |
| Fly.io | 3 VMs (256MB) | $1.94/month per VM |

**Recommendation**: Start with Railway or Render free tier, scale as needed.

---

## Next Steps

After deploying:
1. Monitor logs for errors
2. Test resume upload functionality end-to-end
3. Set up monitoring/alerts (Sentry, DataDog, etc.)
4. Configure backups if needed
5. Document your production URL in team wiki
