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

// Supported tokens on Sepolia - USDC first as default
export const SUPPORTED_TOKENS = [
  { 
    symbol: 'USDC', 
    address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', 
    decimals: 6,
    name: 'USD Coin',
    logo: '💙'
  },
  { 
    symbol: 'ETH', 
    address: '0x0000000000000000000000000000000000000000', 
    decimals: 18,
    name: 'Ethereum',
    logo: '🔷'
  },
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

/**
 * Check if user has sufficient balance and allowance for a token payment
 */
export async function checkPaymentStatus(
  tokenAddress: string,
  userAddress: string,
  requiredAmount: bigint
): Promise<PaymentStatus> {
  try {
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      // ETH payment
      const balance = await client.getBalance({ address: userAddress as `0x${string}` });
      return {
        canPay: balance >= requiredAmount,
        needsApproval: false,
        currentBalance: balance,
        requiredAmount,
        allowance: 0n,
        error: balance < requiredAmount ? 'Insufficient ETH balance' : undefined
      };
    } else {
      // ERC20 token payment
      const [balance, allowance] = await Promise.all([
        client.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [userAddress as `0x${string}`]
        }) as Promise<bigint>,
        client.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'allowance',
          args: [userAddress as `0x${string}`, '0x62de4E3f5C9D2AB9C085053c22AcAee2ca877ee8' as `0x${string}`]
        }) as Promise<bigint>
      ]);

      const needsApproval = allowance < requiredAmount;
      const canPay = balance >= requiredAmount && !needsApproval;

      return {
        canPay,
        needsApproval,
        currentBalance: balance,
        requiredAmount,
        allowance,
        error: balance < requiredAmount ? 'Insufficient token balance' : 
               needsApproval ? 'Token approval required' : undefined
      };
    }
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
  return SUPPORTED_TOKENS.find(token => token.symbol.toUpperCase() === symbol.toUpperCase());
}

/**
 * Calculate gas estimate for token approval
 */
export async function estimateApprovalGas(
  tokenAddress: string,
  userAddress: string,
  amount: bigint
): Promise<bigint> {
  try {
    // For now, return a reasonable gas estimate
    // In a production environment, you would use client.estimateContractGas
    return 100000n; // Fallback gas estimate
  } catch (error) {
    console.error('Error estimating approval gas:', error);
    return 100000n; // Fallback gas estimate
  }
}

/**
 * Validate payment amount
 */
export function validatePaymentAmount(amount: string, tokenInfo: TokenInfo): string | null {
  if (!amount || amount === '0') {
    return 'Amount must be greater than 0';
  }

  try {
    const parsedAmount = parseTokenAmount(amount, tokenInfo.decimals);
    if (parsedAmount === 0n) {
      return 'Amount must be greater than 0';
    }
  } catch (error) {
    return 'Invalid amount format';
  }

  return null;
}

/**
 * Get payment summary for display
 */
export function getPaymentSummary(
  amount: string,
  tokenInfo: TokenInfo,
  paymentStatus: PaymentStatus
) {
  const formattedAmount = formatTokenAmount(paymentStatus.requiredAmount, tokenInfo.decimals);
  const formattedBalance = formatTokenAmount(paymentStatus.currentBalance, tokenInfo.decimals);
  
  return {
    amount: formattedAmount,
    balance: formattedBalance,
    symbol: tokenInfo.symbol,
    canPay: paymentStatus.canPay,
    needsApproval: paymentStatus.needsApproval,
    error: paymentStatus.error
  };
} 