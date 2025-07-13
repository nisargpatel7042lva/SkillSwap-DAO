# SkillSwap DAO - Setup Instructions

## 🚀 Quick Start

This guide will help you set up and run the SkillSwap DAO project locally.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MetaMask or another Web3 wallet
- Some test ETH on Sepolia testnet

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillSwap-DAO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Smart Contract (will be filled after deployment)
   VITE_SKILL_EXCHANGE_ADDRESS=your_deployed_contract_address
   
   # Hardhat Configuration
   PRIVATE_KEY=your_wallet_private_key
   SEPOLIA_RPC_URL=your_sepolia_rpc_url
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

## 🗄️ Database Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Set up the database**
   ```bash
   npm run setup:database
   ```

   This will:
   - Create all necessary tables
   - Insert sample data
   - Set up proper relationships

## 🔗 Smart Contract Deployment

1. **Deploy to Sepolia testnet**
   ```bash
   npm run deploy:contracts
   ```

2. **Update your .env file**
   Copy the deployed contract address and add it to your `.env` file:
   ```env
   VITE_SKILL_EXCHANGE_ADDRESS=0x... # Your deployed contract address
   ```

## 🎯 Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:5173`

3. **Connect your wallet**
   - Make sure you're connected to Sepolia testnet
   - Connect your MetaMask wallet

## 🧪 Testing the Application

### As a Skill Provider:
1. Click "List Skill" on the dashboard
2. Fill in skill details (title, description, price in ETH)
3. Submit the form
4. Your skill will appear in the marketplace

### As a Skill Requester:
1. Browse the marketplace
2. Click on a skill to view details
3. Click "Apply" to request the service
4. Pay the required ETH amount
5. Wait for the provider to complete the work

### Payment Flow:
1. **Escrow**: Payment is held in smart contract escrow
2. **Work**: Provider completes the work and submits evidence
3. **Verification**: Requester verifies the work
4. **Release**: Payment is automatically released to provider

## 🔧 Key Features Implemented

### ✅ Completed Features:
- **Dashboard**: Shows active projects, completed projects, and statistics
- **Booking Management**: Filtered by user (requester/provider)
- **Payment System**: ETH-only payments with USDC price display
- **Smart Contracts**: Full escrow and dispute resolution system
- **Database**: Proper user, skill, and booking management
- **UI/UX**: Modern, responsive design with proper error handling

### 🎯 Payment System:
- **Primary Currency**: ETH for all transactions
- **Price Display**: Shows ETH amount with USDC equivalent
- **Escrow**: Secure payment holding until work completion
- **Automatic Release**: Payments released after verification

### 📊 Dashboard Counts:
- **Active Projects**: Counts bookings with status "in_progress" or "accepted"
- **Completed Projects**: Counts bookings with status "completed"
- **Total Projects**: Shows all user bookings (as requester or provider)
- **Listed Skills**: Shows user's listed skills

## 🐛 Troubleshooting

### Common Issues:

1. **Supabase Connection Error**
   - Check your environment variables
   - Ensure your Supabase project is active
   - Run `npm run setup:database` again

2. **Contract Deployment Failed**
   - Check your private key and RPC URL
   - Ensure you have enough ETH for gas fees
   - Try deploying to a different network

3. **Wallet Connection Issues**
   - Make sure you're on Sepolia testnet
   - Check if MetaMask is unlocked
   - Try refreshing the page

4. **Payment Issues**
   - Ensure you have enough ETH for the payment + gas
   - Check if the contract address is correct
   - Verify you're on the correct network

## 📁 Project Structure

```
SkillSwap-DAO/
├── contracts/           # Smart contracts
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and configurations
│   └── integrations/   # External service integrations
├── supabase/           # Database schema and setup
└── scripts/            # Deployment and setup scripts
```

## 🚀 Deployment

### Frontend Deployment:
1. Build the project: `npm run build`
2. Deploy to your preferred hosting service (Vercel, Netlify, etc.)

### Smart Contract Deployment:
1. Deploy to mainnet: `npm run deploy:contracts --network mainnet`
2. Update environment variables with mainnet addresses
3. Update frontend configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console for error messages
3. Check the browser's network tab for failed requests
4. Create an issue in the repository

---

**Happy coding! 🚀** 