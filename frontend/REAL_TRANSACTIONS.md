# Real XLM Transaction Guide

## 🚀 How It Works Now

The frontend now supports **real XLM token transactions** via Freighter wallet!

## 📋 Prerequisites

1. **Freighter Wallet Extension**
   - Install from: https://www.freighter.app/
   - Create/Import your Stellar testnet account
   - Make sure you have testnet XLM (get from friendbot)

2. **Get Testnet XLM**
   - Visit: https://laboratory.stellar.org/#account-creator?network=test
   - Paste your Freighter address
   - Click "Get test network lumens"

## 🔄 Two Connection Methods

### Method 1: Freighter (Recommended)
- Click **"Freighter"** button
- Approve connection in extension
- Wallet automatically connected with signing capability

### Method 2: Manual Paste
- Click **"Manual"** button
- Paste your Stellar address (G...)
- ⚠️ Can view but cannot sign transactions

## 💰 Buying Carbon Credits

1. **Connect via Freighter** (must use Freighter for transactions!)
2. Browse marketplace and click **"Buy Credit"**
3. Freighter popup will appear asking to approve transaction
4. Review:
   - Amount: Price in XLM
   - Destination: Seller's address
   - Fee: 0.001 XLM (network fee)
5. Click **"Approve"** in Freighter
6. XLM is sent directly from your wallet to seller
7. Success toast confirms payment

## 🔐 What Happens Behind the Scenes

```typescript
1. Build payment transaction with Stellar SDK
2. Request signature from Freighter wallet
3. User approves in Freighter popup
4. Signed transaction submitted to Stellar network
5. XLM deducted from buyer, credited to seller
6. Transaction hash returned
```

## 🎯 Real vs Simulation

| Feature | Before | After |
|---------|--------|-------|
| Wallet Connection | Manual paste only | Freighter + Manual |
| Purchase Flow | Simulated with timeout | Real Stellar transaction |
| XLM Deduction | Toast notification only | Actual blockchain transfer |
| Transaction Signing | None | Freighter signature required |
| Network Submission | Skipped | Submitted to Stellar testnet |

## 🧪 Testing Real Transactions

1. **Connect Freighter Wallet**
   ```
   - Open Freighter extension
   - Unlock wallet
   - Click "Freighter" on Carbon-X
   - Approve connection
   ```

2. **Check Balance**
   ```
   - Freighter shows your XLM balance
   - Ensure you have enough XLM + 0.001 fee
   ```

3. **Buy a Credit**
   ```
   - Go to Marketplace
   - Click "Buy Credit" on any listing
   - Approve transaction in Freighter popup
   - Wait for confirmation (2-5 seconds)
   ```

4. **Verify Transaction**
   ```
   - Check Freighter - balance should decrease
   - Copy transaction hash from console
   - Verify on: https://stellar.expert/explorer/testnet
   ```

## 🔍 Transaction Details

**Payment Structure:**
- **From:** Your Freighter wallet address
- **To:** Seller's address (from listing)
- **Asset:** Native XLM
- **Amount:** Credit price (e.g., 5.5 XLM)
- **Fee:** 0.001 XLM (network fee)
- **Network:** Stellar Testnet

## ⚠️ Important Notes

1. **Freighter Required for Purchases**
   - Manual paste can only VIEW data
   - BUYING requires Freighter signature

2. **Testnet Only (For Now)**
   - All transactions on Stellar testnet
   - Switch to mainnet in production

3. **Seller Address**
   - Currently uses demo seller address
   - In production, would fetch from smart contract

4. **Transaction Approval**
   - Always review in Freighter before approving
   - Check amount, destination, and fee

## 🚨 Troubleshooting

**"Please install Freighter wallet"**
- Install extension from https://www.freighter.app/
- Reload page after installation

**"Transaction cancelled"**
- You clicked "Reject" in Freighter
- Try again and click "Approve"

**"Insufficient balance"**
- Get testnet XLM from friendbot
- Ensure balance > (credit price + 0.001 XLM fee)

**"Please unlock Freighter wallet"**
- Open Freighter extension
- Enter password to unlock

## 📊 Next Steps

To fully integrate with your smart contract:

1. **Fetch real listings** from contract
2. **Use actual seller addresses** from listings
3. **Call contract's buy_credit()** after payment
4. **Verify ownership** updated on-chain
5. **Add transaction history** view

## 🎉 You're Now Trading Real XLM!

The Carbon-X marketplace now executes actual blockchain transactions. Every purchase sends real XLM from buyer to seller on the Stellar network!
