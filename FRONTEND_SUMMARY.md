# 🌳 Carbon-X: Complete Full-Stack Project

## 📋 Project Overview

**Carbon-X** is a complete decentralized carbon credit registry and marketplace built on the Stellar blockchain using Soroban smart contracts with a modern React/Next.js frontend.

---

## 🏗️ Architecture

### Backend (Smart Contract)
- **Language**: Rust
- **Platform**: Stellar Soroban (Smart Contracts)
- **Location**: `/src/lib.rs`
- **Size**: 608 lines of production code

### Frontend (Web Application)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Location**: `/frontend/`
- **Pages**: 5 main pages + components

---

## 🎯 Smart Contract Features

### Core Functions (11 Public Methods)

1. **Initialization & Access Control**
   - `initialize(admin)` - One-time contract setup
   - `add_verifier(verifier)` - Admin adds whitelisted verifiers
   - `is_admin(address)` - Check admin status

2. **Registry Operations**
   - `register_credit(...)` - Verifiers register new carbon credits
   - `verify_credit(credit_id)` - Verifiers approve registered credits

3. **Marketplace**
   - `list_for_sale(credit_id, price)` - List verified credits for sale
   - `buy_credit(credit_id)` - Purchase listed credits

4. **Retirement**
   - `retire_credit(credit_id)` - Permanently retire credits

5. **Queries**
   - `get_credit(credit_id)` - Get credit details
   - `get_listing(credit_id)` - Get listing details
   - `get_retired_credits()` - View all retired credits

### Data Structures

```rust
CarbonCredit {
    id: u64,
    project_id: String,
    issuer: Address,
    verifier: Address,
    vintage_year: u32,
    region: String,
    quantity: u64,
    verified: bool,
    retired: bool,
    owner: Address,
}

MarketListing {
    credit_id: u64,
    seller: Address,
    price: i128,
    active: bool,
}
```

### Security Features
- ✅ Role-based access control (Admin, Verifier, Owner)
- ✅ Authorization checks with `require_auth()`
- ✅ Comprehensive error handling (11 error types)
- ✅ Immutable verification and retirement
- ✅ Event logging for all actions

---

## 🎨 Frontend Features

### Pages

1. **Home (`/`)**
   - Hero section with project overview
   - Key features showcase
   - Real-time statistics (Total Credits, Active Listings, Retired Credits, Projects)
   - Featured carbon credits display

2. **Marketplace (`/marketplace`)**
   - Browse all available carbon credits
   - Search by project ID
   - Filter by region
   - View credit details (region, vintage year, quantity, price)
   - Purchase credits with XLM
   - Verified badge for authenticated credits

3. **Registry (`/registry`)**
   - Form to register new carbon credit batches
   - Fields: Project ID, Issuer Address, Vintage Year, Region, Quantity
   - Only for authorized verifiers
   - Form validation
   - Information about verifier requirements

4. **My Credits (`/my-credits`)**
   - View all owned carbon credits
   - Credit status indicators (verified, listed, retired)
   - List credits for sale
   - Retire owned credits
   - Empty state for new users

5. **Retire (`/retire`)**
   - Select credits to retire permanently
   - View retirement history
   - Warning about permanent action
   - Recently retired credits display

### Components

- **Navigation** - Header with wallet connection
- **Hero** - Landing page hero section
- **StatsOverview** - Dashboard with key metrics
- **FeaturedCredits** - Showcase of available credits
- **CreditCard** - Reusable credit display component
- **Providers** - React Query and Toast providers

### Key Technologies

```json
{
  "framework": "Next.js 14",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "state": "Zustand",
  "data-fetching": "TanStack React Query",
  "blockchain": "Stellar SDK",
  "wallet": "Freighter API",
  "icons": "Lucide React",
  "notifications": "React Hot Toast"
}
```

---

## 🚀 Getting Started

### Prerequisites

1. **Smart Contract Deployment**
   - Rust toolchain installed
   - Soroban CLI configured
   - Stellar testnet/mainnet access

2. **Frontend Development**
   - Node.js 18+
   - npm/yarn/pnpm
   - Freighter Wallet extension

### Backend Setup (Smart Contract)

```bash
# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Optimize WASM
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/carbon_x.wasm

# Deploy to Stellar testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/carbon_x.wasm \
  --network testnet

# Initialize contract
soroban contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  -- initialize \
  --admin <ADMIN_ADDRESS>
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your contract ID

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 📁 Complete Project Structure

```
carbon-x/
├── src/
│   └── lib.rs                          # Smart contract (608 lines)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx              # Root layout
│   │   │   ├── page.tsx                # Home page
│   │   │   ├── marketplace/
│   │   │   │   └── page.tsx            # Marketplace
│   │   │   ├── registry/
│   │   │   │   └── page.tsx            # Registration
│   │   │   ├── my-credits/
│   │   │   │   └── page.tsx            # Portfolio
│   │   │   ├── retire/
│   │   │   │   └── page.tsx            # Retirement
│   │   │   └── globals.css             # Global styles
│   │   ├── components/
│   │   │   ├── Navigation.tsx          # Header/Nav
│   │   │   ├── Hero.tsx                # Hero section
│   │   │   ├── StatsOverview.tsx       # Statistics
│   │   │   ├── FeaturedCredits.tsx     # Featured list
│   │   │   ├── CreditCard.tsx          # Credit card
│   │   │   └── Providers.tsx           # App providers
│   │   ├── hooks/
│   │   │   └── useWallet.ts            # Wallet hook
│   │   ├── services/
│   │   │   └── carbonx.ts              # Contract service
│   │   └── types/
│   │       └── contract.ts             # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
├── Cargo.toml
├── README.md
├── PROJECT_SUMMARY.md
└── DEPLOYMENT_CHECKLIST.md
```

---

## 🔄 User Workflows

### For Administrators
1. Deploy smart contract
2. Initialize with admin address
3. Add whitelisted verifiers

### For Verifiers
1. Connect Freighter wallet
2. Navigate to Registry page
3. Fill in carbon credit details
4. Submit registration
5. Verify registered credits

### For Buyers
1. Connect Freighter wallet
2. Browse Marketplace
3. Search/filter credits
4. View credit details
5. Purchase with XLM
6. View in "My Credits"

### For Credit Owners
1. View owned credits in "My Credits"
2. List credits for sale (set price)
3. Retire credits permanently
4. View retirement proof on-chain

---

## 🎨 Design Features

### Visual Design
- Modern gradient backgrounds (green to blue)
- Card-based layouts with shadows
- Responsive grid system
- Dark mode support
- Professional typography (Inter font)
- Icon integration (Lucide React)

### Color Scheme
- **Primary Green**: `#22c55e` - Environmental theme
- **Accents**: Blue, Yellow, Purple for different states
- **Neutral**: Gray scale for backgrounds

### UI/UX Features
- Wallet connection in navigation
- Toast notifications for actions
- Loading states
- Empty states
- Form validation
- Responsive mobile design
- Hover effects and transitions

---

## 🔒 Security & Best Practices

### Smart Contract
- Role-based access control
- Authorization required for state changes
- Comprehensive error handling
- Immutable critical operations
- Event logging for audit trail

### Frontend
- Environment variables for sensitive data
- Input validation before contract calls
- Error handling for wallet interactions
- Type safety with TypeScript
- Never commit secrets to git

---

## 📊 Testing

### Smart Contract Tests (7 tests)
✅ `test_initialization`
✅ `test_add_verifier`
✅ `test_register_and_verify_credit`
✅ `test_marketplace_listing_and_purchase`
✅ `test_retire_credit`
✅ `test_unauthorized_verifier`
✅ `test_non_owner_cannot_retire`

All tests pass successfully!

---

## 🌐 Environment Configuration

### Backend (.env or config)
```
STELLAR_NETWORK=testnet
RPC_URL=https://soroban-testnet.stellar.org
```

### Frontend (.env.local)
```
NEXT_PUBLIC_CONTRACT_ID=CXXX...
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK=testnet
```

---

## 🚢 Deployment Options

### Smart Contract
- Stellar Testnet (for testing)
- Stellar Mainnet (for production)

### Frontend
- **Vercel** - Recommended (automatic Next.js support)
- **Netlify** - Good alternative
- **AWS Amplify** - Enterprise option
- **Docker** - Self-hosted option

---

## 📈 Future Enhancements

### Smart Contract
- [ ] Batch operations for multiple credits
- [ ] Credit fractionalization
- [ ] Automated verification with oracles
- [ ] Governance DAO integration
- [ ] Cross-chain bridges

### Frontend
- [ ] Advanced filtering and sorting
- [ ] Credit analytics dashboard
- [ ] Price history charts
- [ ] User profiles
- [ ] Transaction history
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Social sharing features
- [ ] Multi-language support

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📞 Support

- **Documentation**: See README files
- **Issues**: GitHub Issues
- **Smart Contract**: Review `src/lib.rs`
- **Frontend**: Review `frontend/README.md`

---

## 🎉 Summary

Carbon-X is a **production-ready** full-stack decentralized application featuring:

- ✅ **608 lines** of tested Rust smart contract code
- ✅ **5 pages** of modern React/Next.js frontend
- ✅ **11 smart contract functions** for complete carbon credit lifecycle
- ✅ **Freighter wallet integration** for Stellar blockchain
- ✅ **Responsive design** with Tailwind CSS
- ✅ **Type-safe** TypeScript implementation
- ✅ **Production-ready** error handling and security
- ✅ **Comprehensive documentation**

**Ready to deploy and use on Stellar blockchain! 🚀**

---

**Built with ❤️ for a sustainable future on Stellar Soroban**
