import { createPublicClient, http, parseEther, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import { toast } from 'sonner';

// ERC20 Token ABI for approvals and balance checks
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  }
] as const;

// ETH as primary payment token, USDC for display
export const PRIMARY_PAYMENT_TOKEN = {
  symbol: 'ETH',
  address: '0x0000000000000000000000000000000000000000',
  decimals: 18,
  name: 'Ethereum',
  logo: '🔷'
} as const;

export const DISPLAY_TOKEN = {
  symbol: 'USDC',
  address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  decimals: 6,
  name: 'USD Coin',
  logo: '💙'
} as const;

// Supported tokens for reference (ETH is primary)
export const SUPPORTED_TOKENS = [
  PRIMARY_PAYMENT_TOKEN,
  DISPLAY_TOKEN,
  { 
    symbol: 'DAI', 
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 
    decimals: 18,
    name: 'Dai Stablecoin',
    logo: '🟡'
  },
  { 
    symbol: 'LINK', 
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', 
    decimals: 18,
    name: 'Chainlink',
    logo: '🔗'
  },
  { 
    symbol: 'USDT', 
    address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0', 
    decimals: 6,
    name: 'Tether USD',
    logo: '💚'
  },
] as const;

// Viem client for blockchain interactions
const client = createPublicClient({
  chain: sepolia,
  transport: http()
});

export interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
  logo: string;
}

export interface PaymentStatus {
  canPay: boolean;
  needsApproval: boolean;
  currentBalance: bigint;
  requiredAmount: bigint;
  allowance: bigint;
  error?: string;
}

// Mock ETH to USDC conversion rate (in real app, this would come from price oracle)
const ETH_TO_USDC_RATE = 2500; // 1 ETH = 2500 USDC

/**
 * Convert ETH amount to USDC display amount
 */
export function ethToUsdcDisplay(ethAmount: string): string {
  const ethValue = parseFloat(ethAmount);
  const usdcValue = ethValue * ETH_TO_USDC_RATE;
  return usdcValue.toFixed(2);
}

/**
 * Convert USDC display amount to ETH amount
 */
export function usdcToEthAmount(usdcAmount: string): string {
  const usdcValue = parseFloat(usdcAmount);
  const ethValue = usdcValue / ETH_TO_USDC_RATE;
  return ethValue.toFixed(6);
}

/**
 * Format price for display (shows USDC equivalent)
 */
export function formatPriceForDisplay(ethAmount: string): string {
  const usdcDisplay = ethToUsdcDisplay(ethAmount);
  return `${ethAmount} ETH (≈ $${usdcDisplay})`;
}

/**
 * Check if user has sufficient balance for ETH payment
 */
export async function checkPaymentStatus(
  tokenAddress: string,
  userAddress: string,
  requiredAmount: bigint
): Promise<PaymentStatus> {
  try {
    // Only support ETH payments
    if (tokenAddress !== PRIMARY_PAYMENT_TOKEN.address) {
      return {
        canPay: false,
        needsApproval: false,
        currentBalance: 0n,
        requiredAmount,
        allowance: 0n,
        error: 'Only ETH payments are supported'
      };
    }

    const balance = await client.getBalance({ address: userAddress as `0x${string}` });
    return {
      canPay: balance >= requiredAmount,
      needsApproval: false,
      currentBalance: balance,
      requiredAmount,
      allowance: 0n,
      error: balance < requiredAmount ? 'Insufficient ETH balance' : undefined
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      canPay: false,
      needsApproval: false,
      currentBalance: 0n,
      requiredAmount,
      allowance: 0n,
      error: 'Failed to check payment status'
    };
  }
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  
  if (fraction === 0n) {
    return whole.toString();
  }
  
  const fractionStr = fraction.toString().padStart(decimals, '0');
  const trimmedFraction = fractionStr.replace(/0+$/, '');
  
  return `${whole}.${trimmedFraction}`;
}

/**
 * Parse token amount from string to bigint
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [whole, fraction = '0'] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

/**
 * Get token info by address
 */
export function getTokenInfo(tokenAddress: string): TokenInfo | undefined {
  return SUPPORTED_TOKENS.find(token => token.address.toLowerCase() === tokenAddress.toLowerCase());
}

/**
 * Get token info by symbol
 */
export function getTokenBySymbol(symbol: string): TokenInfo | undefined {
  return SUPPORTED_TOKENS.find(token => token.symbol.toLowerCase() === symbol.toLowerCase());
}

/**
 * Estimate gas for token approval
 */
export async function estimateApprovalGas(
  tokenAddress: string,
  userAddress: string,
  amount: bigint
): Promise<bigint> {
  try {
    // For ETH, no approval needed
    if (tokenAddress === PRIMARY_PAYMENT_TOKEN.address) {
      return 0n;
    }

    const gasEstimate = await client.estimateContractGas({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: ['0x62de4E3f5C9D2AB9C085053c22AcAee2ca877ee8' as `0x${string}`, amount],
      account: userAddress as `0x${string}`
    });

    return gasEstimate;
  } catch (error) {
    console.error('Error estimating approval gas:', error);
    return 50000n; // Default estimate
  }
}

/**
 * Validate payment amount
 */
export function validatePaymentAmount(amount: string, tokenInfo: TokenInfo): string | null {
  if (!amount || amount === '0') {
    return 'Amount must be greater than 0';
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return 'Invalid amount';
  }

  // For ETH, check reasonable limits
  if (tokenInfo.symbol === 'ETH') {
    if (numAmount > 10) {
      return 'Amount too high (max 10 ETH)';
    }
    if (numAmount < 0.001) {
      return 'Amount too low (min 0.001 ETH)';
    }
  }

  return null;
}

/**
 * Get payment summary with USDC equivalent
 */
export function getPaymentSummary(
  amount: string,
  tokenInfo: TokenInfo,
  paymentStatus: PaymentStatus
) {
  const usdcEquivalent = ethToUsdcDisplay(amount);
  
  return {
    amount,
    tokenSymbol: tokenInfo.symbol,
    usdcEquivalent,
    canPay: paymentStatus.canPay,
    error: paymentStatus.error,
    displayText: `${amount} ${tokenInfo.symbol} (≈ $${usdcEquivalent})`
  };
} 