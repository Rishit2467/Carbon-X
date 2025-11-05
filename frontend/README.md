# 🌳 Carbon-X Frontend

A modern, responsive web application for interacting with the Carbon-X smart contract on the Stellar blockchain. Built with Next.js, React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Wallet Integration**: Connect with Freighter wallet for Stellar blockchain
- **Carbon Credit Marketplace**: Browse, search, and purchase verified carbon credits
- **Credit Registry**: Register new carbon credit batches (for authorized verifiers)
- **Portfolio Management**: View and manage your owned carbon credits
- **Retirement System**: Permanently retire credits to offset carbon footprint
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Modern UI**: Responsive design with Tailwind CSS and dark mode support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Freighter Wallet browser extension ([Install here](https://www.freighter.app/))
- Access to Stellar testnet or mainnet

### Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your contract details:
   ```env
   NEXT_PUBLIC_CONTRACT_ID=your_deployed_contract_id
   NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
   NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
   NEXT_PUBLIC_STELLAR_NETWORK=testnet
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── marketplace/        # Marketplace page
│   │   ├── registry/           # Credit registration page
│   │   ├── my-credits/         # User portfolio page
│   │   └── retire/             # Credit retirement page
│   ├── components/             # Reusable React components
│   │   ├── Navigation.tsx      # Header navigation
│   │   ├── Hero.tsx            # Landing page hero
│   │   ├── StatsOverview.tsx   # Statistics dashboard
│   │   ├── FeaturedCredits.tsx # Featured credits display
│   │   ├── CreditCard.tsx      # Credit display card
│   │   └── Providers.tsx       # App providers (React Query, etc.)
│   ├── hooks/                  # Custom React hooks
│   │   └── useWallet.ts        # Wallet connection hook
│   ├── services/               # API and contract services
│   │   └── carbonx.ts          # Carbon-X contract interface
│   └── types/                  # TypeScript type definitions
│       └── contract.ts         # Contract types and config
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Key Pages

### Home (`/`)
- Hero section with project overview
- Key features showcase
- Statistics overview
- Featured carbon credits

### Marketplace (`/marketplace`)
- Browse available carbon credits
- Search and filter functionality
- View detailed credit information
- Purchase credits with XLM

### Registry (`/registry`)
- Register new carbon credit batches
- Only for authorized verifiers
- Form validation and submission

### My Credits (`/my-credits`)
- View owned carbon credits
- List credits for sale
- Track credit status

### Retire (`/retire`)
- Permanently retire carbon credits
- View retirement history
- On-chain proof of retirement

## 🔧 Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Blockchain**: Stellar SDK
- **Wallet**: Freighter API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🔗 Integration with Smart Contract

The frontend integrates with the Carbon-X Soroban smart contract through the `CarbonXService` class in `src/services/carbonx.ts`. Key functions include:

- `initialize()` - Initialize contract
- `registerCredit()` - Register new carbon credits
- `verifyCredit()` - Verify registered credits
- `listForSale()` - List credits on marketplace
- `buyCredit()` - Purchase listed credits
- `retireCredit()` - Permanently retire credits
- `getCredit()` - Fetch credit details
- `getListing()` - Fetch listing details

## 🌐 Wallet Connection

The app uses Freighter wallet for Stellar blockchain interactions:

1. Users click "Connect Wallet"
2. Freighter extension prompts for approval
3. App receives user's Stellar address
4. Users can interact with the contract

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CONTRACT_ID` | Deployed contract ID | `CXXXX...` |
| `NEXT_PUBLIC_NETWORK_PASSPHRASE` | Stellar network passphrase | `Test SDF Network ; September 2015` |
| `NEXT_PUBLIC_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Network type | `testnet` or `mainnet` |

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker

## 🔐 Security Considerations

- Never commit `.env.local` to version control
- Validate all user inputs before sending to smart contract
- Use proper error handling for wallet interactions
- Implement rate limiting for API calls
- Always verify transaction details before signing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review smart contract documentation

## 🙏 Acknowledgments

- Built on Stellar Soroban platform
- Powered by Freighter wallet
- UI inspired by modern Web3 applications

---

**Built with ❤️ for a sustainable future on Stellar**
