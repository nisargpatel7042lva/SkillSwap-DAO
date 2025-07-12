# 🚀 SkillSwap DAO - Web3 Skill Marketplace

A decentralized skill marketplace built on Ethereum, enabling users to buy and sell services using cryptocurrency with built-in escrow, dispute resolution, and satisfaction guarantees.

## ✨ Features

### 🎯 Core Features
- **Skill Marketplace**: Browse and list skills with detailed profiles
- **Web3 Payments**: Support for ETH and multiple ERC20 tokens (USDC, DAI, LINK, USDT)
- **Escrow System**: Secure payment escrow with automatic release
- **Dispute Resolution**: Built-in dispute system with arbitration
- **Satisfaction Guarantee**: Money-back guarantee for unsatisfied customers
- **Rating System**: Comprehensive rating and review system
- **Provider Verification**: Reputation-based provider verification

### 🔧 Technical Features
- **Smart Contracts**: Solidity contracts with comprehensive security features
- **Frontend**: React + TypeScript + Vite with modern UI
- **Database**: Supabase with real-time capabilities
- **Authentication**: Web3 wallet integration (MetaMask, WalletConnect)
- **Storage**: Decentralized file storage for images
- **Responsive Design**: Mobile-first responsive design

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Blockchain**: Ethereum (Sepolia testnet), Hardhat, Viem, Wagmi
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: RainbowKit, Web3 wallets
- **Deployment**: Vercel/Netlify ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/bun
- MetaMask or other Web3 wallet
- Supabase account
- Ethereum testnet (Sepolia) for testing

### 1. Clone and Install

```bash
git clone https://github.com/your-username/skillswap-dao.git
cd skillswap-dao
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Blockchain Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Contract Addresses (will be updated after deployment)
VITE_SKILL_EXCHANGE_ADDRESS=0x0000000000000000000000000000000000000000

# App Configuration
VITE_APP_NAME=SkillSwap DAO
VITE_APP_URL=http://localhost:5173
```

### 3. Deploy Smart Contracts

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.cjs --network sepolia

# Or deploy locally for testing
npx hardhat run scripts/deploy.cjs --network localhost
```

### 4. Setup Database

```bash
# Setup Supabase database and storage
node scripts/setup-database.js

# Optional: Create sample data
CREATE_SAMPLE_DATA=true node scripts/setup-database.js
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📋 Complete Setup Guide

### Smart Contract Deployment

1. **Get Testnet ETH**: Use a faucet to get Sepolia ETH
2. **Configure RPC**: Set up your Infura/Alchemy RPC URL
3. **Deploy Contracts**: Run the deployment script
4. **Verify Contracts**: Contracts are automatically verified on Etherscan

### Supabase Setup

1. **Create Project**: Create a new Supabase project
2. **Get Credentials**: Copy your project URL and anon key
3. **Run Setup Script**: Execute the database setup script
4. **Configure Storage**: Storage buckets are created automatically

### Frontend Configuration

1. **Environment Variables**: Set all required environment variables
2. **Contract Address**: Update with deployed contract address
3. **Build & Deploy**: Ready for production deployment

## ��️ Project Structure

```
skillswap-dao/
├── contracts/                 # Smart contracts
│   ├── SkillExchange.sol     # Main marketplace contract
│   └── Lock.sol              # Example contract
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── SkillCard.tsx    # Skill display component
│   │   ├── PaymentProcessor.tsx # Payment handling
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Marketplace.tsx  # Skill marketplace
│   │   ├── Dashboard.tsx    # User dashboard
│   │   └── ...
│   ├── lib/                 # Utilities and configurations
│   │   ├── SkillExchange.ts # Contract configuration
│   │   └── paymentUtils.ts  # Payment utilities
│   └── integrations/        # External integrations
│       └── supabase/        # Supabase client
├── supabase/                # Database schema and migrations
├── scripts/                 # Deployment and setup scripts
└── public/                  # Static assets
```

## 🔐 Security Features

- **Reentrancy Protection**: All contract functions protected
- **Access Control**: Role-based access control
- **Input Validation**: Comprehensive input validation
- **Escrow System**: Secure payment escrow
- **Dispute Resolution**: Fair dispute handling
- **Rate Limiting**: Protection against spam
- **Gas Optimization**: Efficient contract design

## 💰 Payment System

### Supported Tokens
- **ETH**: Native Ethereum
- **USDC**: USD Coin (6 decimals)
- **DAI**: Dai Stablecoin (18 decimals)
- **LINK**: Chainlink (18 decimals)
- **USDT**: Tether USD (6 decimals)

### Payment Flow
1. User selects a service and payment token
2. Payment is held in escrow
3. Provider completes the service
4. User verifies completion
5. Payment is automatically released after dispute window
6. Optional: User can release payment early

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Built-in dark mode support
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant design
- **Loading States**: Comprehensive loading indicators
- **Error Handling**: User-friendly error messages

## 🚀 Deployment

### Frontend Deployment

#### Vercel
```bash
npm run build
vercel --prod
```

#### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Smart Contract Deployment

```bash
# Deploy to mainnet (after thorough testing)
npx hardhat run scripts/deploy.cjs --network mainnet
```

## 🧪 Testing

```bash
# Run smart contract tests
npm run test

# Run frontend tests
npm run test:frontend

# Run all tests with coverage
npm run test:coverage
```

## 📊 Monitoring

- **Contract Events**: All important events are logged
- **Transaction Tracking**: Complete transaction history
- **Error Monitoring**: Comprehensive error tracking
- **Performance Metrics**: Application performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join our community discussions
- **Email**: support@skillswap-dao.com

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core marketplace functionality
- ✅ Payment system
- ✅ Dispute resolution
- ✅ Basic UI/UX

### Phase 2 (Next)
- 🔄 Advanced search and filtering
- 🔄 Chat/messaging system
- 🔄 Mobile app
- 🔄 Advanced analytics

### Phase 3 (Future)
- 📋 AI-powered matching
- 📋 Multi-chain support
- 📋 DAO governance
- 📋 Advanced reputation system

---

**Built with ❤️ by the SkillSwap DAO team**
