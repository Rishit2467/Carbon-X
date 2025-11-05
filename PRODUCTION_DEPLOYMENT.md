# 🚀 Carbon-X Production Deployment Guide

## Prerequisites

Before deploying, ensure you have:

- ✅ Deployed Carbon-X smart contract on Stellar mainnet/testnet
- ✅ Contract ID from deployment
- ✅ GitHub repository with your code
- ✅ Vercel account (recommended) or other hosting platform

---

## Step 1: Prepare for Production Build

### 1.1 Update Environment Variables

Create a production `.env.production` file:

```bash
# Production Environment Variables
NEXT_PUBLIC_CONTRACT_ID=CBF27HVYQFOUSNBCA5I4ZZHKJ536WGMD7OYYTFU7FVIFJ3FC6TKEERRQ
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK=testnet

# For Mainnet, use these instead:
# NEXT_PUBLIC_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015
# NEXT_PUBLIC_RPC_URL=https://soroban-mainnet.stellar.org
# NEXT_PUBLIC_STELLAR_NETWORK=mainnet
```

### 1.2 Test Production Build Locally

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run start

# Open http://localhost:3000 to verify
```

---

## Step 2: Deploy to Vercel (Recommended)

### Option A: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your `Carbon-X` repository
   - Select the `frontend` directory as root

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables**
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_CONTRACT_ID=CBF27HVYQFOUSNBCA5I4ZZHKJ536WGMD7OYYTFU7FVIFJ3FC6TKEERRQ
   NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
   NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
   NEXT_PUBLIC_STELLAR_NETWORK=testnet
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Get your production URL: `https://carbon-x.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? carbon-x-frontend
# - Directory? ./
# - Override settings? No

# Production deployment
vercel --prod
```

---

## Step 3: Deploy to Netlify (Alternative)

### Via Netlify Dashboard

1. **Prepare netlify.toml**
   Create `frontend/netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
     base = "frontend"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Deploy**
   - Go to https://app.netlify.com
   - Click "Add new site"
   - Import from GitHub
   - Select Carbon-X repository
   - Configure build settings (auto-detected from netlify.toml)
   - Add environment variables
   - Click "Deploy"

### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
cd frontend
netlify init

# Deploy
netlify deploy --prod
```

---

## Step 4: Deploy to Custom Server (Docker)

### 4.1 Create Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 4.2 Create docker-compose.yml

```yaml
version: '3.8'

services:
  carbon-x-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_CONTRACT_ID=CBF27HVYQFOUSNBCA5I4ZZHKJ536WGMD7OYYTFU7FVIFJ3FC6TKEERRQ
      - NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
      - NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
      - NEXT_PUBLIC_STELLAR_NETWORK=testnet
    restart: unless-stopped
```

### 4.3 Deploy

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Step 5: Configure Custom Domain (Optional)

### For Vercel

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `carbonx.example.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

### For Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records
4. Enable HTTPS (automatic)

---

## Step 6: Post-Deployment Checklist

### ✅ Verify Deployment

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Wallet connection works
- [ ] Can view marketplace listings
- [ ] Can register credits (if verifier)
- [ ] Can purchase credits
- [ ] Can retire credits
- [ ] Mobile responsive design works
- [ ] Dark mode works
- [ ] All environment variables are set

### ✅ Performance Optimization

```bash
# Check Lighthouse scores
# In Chrome DevTools → Lighthouse → Generate Report

# Target scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 90+
```

### ✅ Security Checks

- [ ] Environment variables are not exposed in browser
- [ ] HTTPS is enabled
- [ ] No sensitive data in client-side code
- [ ] CSP headers configured (if needed)
- [ ] Rate limiting on API routes (if any)

---

## Step 7: Monitoring & Analytics (Optional)

### Add Vercel Analytics

```bash
npm install @vercel/analytics
```

Update `frontend/src/app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Add Error Monitoring (Sentry)

```bash
npm install @sentry/nextjs
```

---

## Step 8: Continuous Deployment

### GitHub Actions (Auto-deploy on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
        
      - name: Build
        working-directory: ./frontend
        run: npm run build
        env:
          NEXT_PUBLIC_CONTRACT_ID: ${{ secrets.CONTRACT_ID }}
          NEXT_PUBLIC_NETWORK_PASSPHRASE: ${{ secrets.NETWORK_PASSPHRASE }}
          NEXT_PUBLIC_RPC_URL: ${{ secrets.RPC_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

---

## Deployment Costs

### Vercel (Recommended)
- **Free Tier**: 
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic SSL
  - Good for testing/small projects

- **Pro Tier** ($20/month):
  - 1TB bandwidth
  - Commercial use
  - Advanced analytics

### Netlify
- **Free Tier**:
  - 100GB bandwidth/month
  - 300 build minutes/month
  
- **Pro Tier** ($19/month):
  - 400GB bandwidth
  - Unlimited build minutes

### Self-Hosted (VPS)
- **DigitalOcean/AWS/GCP**: $5-20/month
- Full control
- Requires DevOps knowledge

---

## Rollback Strategy

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Git-based
```bash
# Revert last commit
git revert HEAD
git push origin main

# Auto-redeploys previous version
```

---

## Support & Troubleshooting

### Build Errors
- Check build logs in Vercel/Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Runtime Errors
- Check browser console
- Check server logs in hosting dashboard
- Verify contract ID is correct
- Test wallet connection

### Performance Issues
- Enable Next.js Image Optimization
- Use CDN for static assets
- Enable caching headers
- Minimize JavaScript bundles

---

## 🎉 Deployment Complete!

Your Carbon-X frontend is now live! 

**Next Steps:**
1. Share your deployment URL
2. Test all features in production
3. Monitor error rates and performance
4. Gather user feedback
5. Iterate and improve

**Production URL Examples:**
- Vercel: `https://carbon-x.vercel.app`
- Netlify: `https://carbon-x.netlify.app`
- Custom: `https://carbonx.example.com`

---

**Built with ❤️ for a sustainable future on Stellar**
