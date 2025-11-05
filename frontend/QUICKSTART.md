# 🚀 Carbon-X Quick Start Guide

## Complete Setup in 5 Minutes

This guide will help you get the Carbon-X frontend up and running quickly.

---

## 📋 Prerequisites Checklist

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] npm, yarn, or pnpm package manager
- [ ] Freighter Wallet browser extension ([Install](https://www.freighter.app/))
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

---

## 🎯 Step 1: Install Dependencies

Open a terminal in the `frontend` directory:

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies (choose one)
npm install
# OR
yarn install
# OR
pnpm install
```

**Expected output**: Installation of ~20+ packages including Next.js, React, Tailwind CSS, etc.

---

## 🔧 Step 2: Configure Environment

Create your environment configuration:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` with your deployed contract details:

```env
# Required: Your deployed Carbon-X contract ID
NEXT_PUBLIC_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Network configuration (for testnet)
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK=testnet
```

### 🔍 Where to get your Contract ID?

If you haven't deployed the smart contract yet:

```bash
# In the root project directory (not frontend)
cd ..

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet (requires Soroban CLI)
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/carbon_x_.wasm \
  --network testnet

# Copy the returned contract ID to your .env.local
```

---

## 🚀 Step 3: Run Development Server

Start the Next.js development server:

```bash
# Make sure you're in the frontend directory
npm run dev
# OR
yarn dev
# OR
pnpm dev
```

**Expected output**:
```
▲ Next.js 14.0.3
- Local:        http://localhost:3000
- Ready in 2.5s
```

---

## 🌐 Step 4: Open in Browser

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. You should see the Carbon-X homepage with:
   - Hero section
   - Statistics overview
   - Featured carbon credits

---

## 👛 Step 5: Connect Freighter Wallet

### First-time setup:

1. **Install Freighter**:
   - Go to [freighter.app](https://www.freighter.app/)
   - Click "Install" for your browser
   - Follow the setup wizard

2. **Get Testnet XLM** (for testing):
   - Open Freighter wallet
   - Copy your address (starts with `G`)
   - Visit [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
   - Paste your address and click "Get test network lumens"

3. **Connect to Carbon-X**:
   - On the Carbon-X website, click "Connect Wallet"
   - Freighter will ask for permission
   - Click "Approve"
   - Your address will appear in the navigation bar

---

## ✅ Step 6: Verify Installation

Test the key features:

### ✓ Homepage
- [ ] Statistics cards display
- [ ] Featured credits show
- [ ] Navigation links work

### ✓ Marketplace (`/marketplace`)
- [ ] Credit cards display
- [ ] Search input works
- [ ] Filter dropdown works

### ✓ Registry (`/registry`)
- [ ] Form displays
- [ ] All input fields present
- [ ] Submit button shows correct state

### ✓ My Credits (`/my-credits`)
- [ ] Shows "Connect wallet" if not connected
- [ ] Shows credits after connecting (if any)

### ✓ Retire (`/retire`)
- [ ] Retirement form displays
- [ ] Warning message shows

---

## 🎨 Customization (Optional)

### Change Theme Colors

Edit `frontend/tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: '#22c55e',  // Change this
    600: '#16a34a',  // And this
    // ...
  },
}
```

### Update Logo

Replace the Leaf icon in `frontend/src/components/Navigation.tsx`:

```typescript
import { YourIcon } from 'lucide-react'

// Change from:
<Leaf className="w-8 h-8 text-primary-600" />
// To:
<YourIcon className="w-8 h-8 text-primary-600" />
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution**: 
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001
```

### Issue: Freighter wallet not detected

**Solution**:
1. Ensure Freighter extension is installed
2. Refresh the page
3. Check browser console for errors
4. Try clicking "Connect Wallet" again

### Issue: Environment variables not working

**Solution**:
1. Ensure file is named `.env.local` (not `.env`)
2. Restart the dev server
3. Check that variables start with `NEXT_PUBLIC_`

### Issue: Tailwind styles not applying

**Solution**:
```bash
# Clear Next.js cache and restart
rm -rf .next
npm run dev
```

---

## 📚 Next Steps

### For Development

1. **Explore the code**:
   - Start with `src/app/page.tsx` (homepage)
   - Check `src/components/` for reusable components
   - Review `src/services/carbonx.ts` for contract integration

2. **Make changes**:
   - Edit any file
   - Changes auto-reload in browser
   - Check terminal for errors

3. **Add features**:
   - Create new components in `src/components/`
   - Add new pages in `src/app/`
   - Update contract service in `src/services/`

### For Production

1. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Set environment variables** in your hosting platform

---

## 🎯 Quick Commands Reference

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Clear cache
rm -rf .next
```

---

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🆘 Getting Help

### 1. Check the README
- `frontend/README.md` - Frontend documentation
- `README.md` - Project overview
- `FRONTEND_SUMMARY.md` - Complete feature list

### 2. Common Issues
- Review the Troubleshooting section above
- Check browser console for errors
- Review terminal output

### 3. Community Support
- Open an issue on GitHub
- Check existing issues
- Review smart contract documentation

---

## ✅ Success Checklist

You're ready to go if:

- [ ] Dev server runs without errors
- [ ] Homepage loads at localhost:3000
- [ ] All pages are accessible
- [ ] Wallet connection works
- [ ] No console errors
- [ ] Styles display correctly

---

## 🎉 You're All Set!

Your Carbon-X frontend is now running! Here's what you can do:

1. **Browse** the marketplace
2. **Register** carbon credits (if you're a verifier)
3. **Purchase** credits
4. **Retire** credits to offset carbon
5. **Customize** the UI to your needs

**Happy coding! 🌳**

---

**Need help?** Check the documentation or open an issue on GitHub.

**Built with ❤️ for a sustainable future on Stellar**
