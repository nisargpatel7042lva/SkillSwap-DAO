# SkillSwap DAO Payment System

## Overview

The SkillSwap DAO payment system is a comprehensive blockchain-based escrow system that enables secure, transparent payments for skill exchange services. The system supports multiple tokens (ETH, USDC, DAI, LINK, USDT) and provides a complete payment lifecycle from booking to completion.

## Architecture

### Smart Contract Layer
- **SkillExchange.sol**: Main escrow contract handling payments, service requests, and fund releases
- **ERC20 Support**: Full support for ERC20 tokens with approval mechanisms
- **Escrow Logic**: Funds are held in escrow until service completion

### Frontend Components
- **PaymentProcessor**: Handles payment flow, token approvals, and transaction processing
- **PaymentHistory**: Displays transaction history and payment statistics
- **PaymentDashboard**: Comprehensive dashboard for payment management
- **BookingManagement**: Manages booking status and payment releases

### Backend Services
- **PaymentService**: Handles payment-related database operations
- **paymentUtils**: Utility functions for token operations and formatting
- **Database Schema**: Extended schema for payment tracking

## Key Features

### 🔒 Secure Escrow System
- All payments are held in smart contract escrow
- Funds are only released after service completion
- No central authority controls funds
- Transparent and auditable transactions

### 💰 Multi-Token Support
- **ETH**: Native Ethereum payments
- **USDC**: USD Coin stablecoin
- **DAI**: Decentralized stablecoin
- **LINK**: Chainlink token
- **USDT**: Tether USD

### 📊 Comprehensive Tracking
- Transaction history with blockchain verification
- Payment statistics and analytics
- Escrow event logging
- Real-time status updates

### 🎯 User Experience
- Intuitive payment flow
- Real-time balance checking
- Gas estimation for approvals
- Transaction status tracking

## Payment Flow

### 1. Service Booking
```
User → Selects Service → Enters Requirements → PaymentProcessor
```

### 2. Payment Processing
```
PaymentProcessor → Check Balance → Token Approval (if needed) → Contract Call
```

### 3. Escrow Creation
```
Contract → Validates Payment → Creates Escrow → Emits Event → Updates Database
```

### 4. Service Completion
```
Provider → Marks Complete → Requester → Reviews → Releases Payment
```

### 5. Payment Release
```
Requester → Release Payment → Contract → Transfers Funds → Updates Status
```

## Components

### PaymentProcessor
Handles the complete payment flow including:
- Token selection and balance checking
- ERC20 token approvals
- Payment transaction processing
- Progress tracking and user feedback

**Key Features:**
- Multi-token support
- Real-time balance validation
- Gas estimation
- Transaction status tracking
- Error handling and recovery

### PaymentHistory
Displays comprehensive payment information:
- Transaction history with details
- Payment statistics
- Status tracking
- Blockchain verification links

**Key Features:**
- Filterable transaction list
- Detailed transaction information
- Payment analytics
- Export capabilities

### PaymentDashboard
Comprehensive dashboard for payment management:
- Payment overview and statistics
- Recent activity feed
- Quick actions
- Settings management

**Key Features:**
- Real-time statistics
- Activity timeline
- Payment insights
- User preferences

## Database Schema

### Core Tables
```sql
-- Extended bookings table with payment fields
CREATE TABLE bookings (
  id serial PRIMARY KEY,
  skill_id integer REFERENCES skills(id),
  requester_id uuid REFERENCES users(id),
  requirements text,
  status text DEFAULT 'pending',
  payment_status text DEFAULT 'unpaid',
  tx_hash text,
  token_address text DEFAULT '0x0000000000000000000000000000000000000000',
  amount numeric,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Payment transactions tracking
CREATE TABLE payment_transactions (
  id serial PRIMARY KEY,
  booking_id integer REFERENCES bookings(id),
  tx_hash text UNIQUE NOT NULL,
  from_address text NOT NULL,
  to_address text NOT NULL,
  amount numeric NOT NULL,
  token_address text NOT NULL,
  gas_used numeric,
  gas_price numeric,
  status text DEFAULT 'pending',
  block_number integer,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Escrow events logging
CREATE TABLE escrow_events (
  id serial PRIMARY KEY,
  booking_id integer REFERENCES bookings(id),
  event_type text NOT NULL,
  amount numeric NOT NULL,
  token_address text NOT NULL,
  tx_hash text,
  triggered_by text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
```

## API Endpoints

### Payment Service Methods
```typescript
// Create payment transaction
PaymentService.createPaymentTransaction(
  bookingId: string,
  txHash: string,
  fromAddress: string,
  toAddress: string,
  amount: string,
  tokenAddress: string
)

// Update transaction status
PaymentService.updateTransactionStatus(
  txHash: string,
  status: 'pending' | 'confirmed' | 'failed',
  blockNumber?: number,
  gasUsed?: string,
  gasPrice?: string
)

// Get user payment stats
PaymentService.getUserPaymentStats(userAddress: string)

// Get payment history
PaymentService.getUserPaymentHistory(userAddress: string)
```

## Smart Contract Functions

### Core Functions
```solidity
// Request a service (creates escrow)
function requestService(uint256 skillId, string memory requirements) 
    external payable nonReentrant

// Provider accepts request
function acceptRequest(uint256 requestId) external

// Provider marks service complete
function completeService(uint256 requestId) external

// Requester releases payment
function releasePayment(uint256 requestId) external nonReentrant

// Rate the service
function rateService(uint256 requestId, uint8 rating) external
```

## Security Features

### Smart Contract Security
- **Reentrancy Protection**: Prevents reentrancy attacks
- **Access Control**: Only authorized parties can perform actions
- **Input Validation**: All inputs are validated
- **Event Logging**: All actions are logged for transparency

### Frontend Security
- **Wallet Connection**: Secure wallet integration
- **Transaction Validation**: All transactions are validated before submission
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Validation**: Input validation and sanitization

## Usage Examples

### Basic Payment Flow
```typescript
// 1. User selects service and enters requirements
const requirements = "I need a React component built";

// 2. Payment processor handles the flow
<PaymentProcessor
  skillId="123"
  skillPrice="1000000000000000000" // 1 ETH in wei
  skillTitle="React Development"
  requirements={requirements}
  onPaymentSuccess={handleSuccess}
  onPaymentError={handleError}
/>

// 3. Payment is processed and escrow created
// 4. Service is completed and payment released
```

### Payment History
```typescript
// Display payment history
<PaymentHistory />

// Get payment statistics
const stats = await PaymentService.getUserPaymentStats(userAddress);
console.log(`Total spent: ${stats.totalSpent} ETH`);
```

## Configuration

### Supported Tokens
```typescript
const SUPPORTED_TOKENS = [
  { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
  { symbol: 'USDC', address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', decimals: 6 },
  { symbol: 'DAI', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18 },
  { symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18 },
  { symbol: 'USDT', address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0', decimals: 6 },
];
```

### Contract Addresses
```typescript
// Sepolia Testnet
export const SKILL_EXCHANGE_ADDRESS = "0x62de4E3f5C9D2AB9C085053c22AcAee2ca877ee8";
```

## Testing

### Smart Contract Tests
```bash
# Run contract tests
npm run test

# Deploy to testnet
npm run deploy:sepolia
```

### Frontend Tests
```bash
# Run component tests
npm run test:components

# Run integration tests
npm run test:integration
```

## Monitoring

### Transaction Monitoring
- All transactions are logged to the database
- Blockchain events are tracked
- Payment status is updated in real-time
- Failed transactions are handled gracefully

### Analytics
- Payment volume tracking
- User behavior analysis
- Token usage statistics
- Performance metrics

## Troubleshooting

### Common Issues

1. **Insufficient Balance**
   - Check wallet balance
   - Ensure sufficient gas for transaction
   - Verify token approval for ERC20 tokens

2. **Transaction Failed**
   - Check gas limit and price
   - Verify network connection
   - Ensure contract is deployed and accessible

3. **Payment Not Released**
   - Verify service completion status
   - Check if requester has released payment
   - Ensure all conditions are met

### Support
For technical support or questions about the payment system, please refer to the project documentation or contact the development team.

## Future Enhancements

### Planned Features
- **Multi-chain Support**: Support for other EVM-compatible chains
- **Advanced Analytics**: Enhanced payment analytics and reporting
- **Automated Payments**: Scheduled and recurring payments
- **Payment Splitting**: Support for multiple recipients
- **Dispute Resolution**: Built-in dispute resolution system
- **Mobile App**: Native mobile application for payments

### Technical Improvements
- **Gas Optimization**: Further gas optimization for contract functions
- **Batch Processing**: Support for batch payments and operations
- **API Enhancements**: RESTful API for payment operations
- **Webhook Support**: Real-time payment notifications
- **Advanced Security**: Additional security measures and audits 