import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import SkillExchangeABI from "./SkillExchangeABI.json";

// Get contract address from environment variable
export const SKILL_EXCHANGE_ADDRESS = import.meta.env.VITE_SKILL_EXCHANGE_ADDRESS as `0x${string}` || "0x62de4E3f5C9D2AB9C085053c22AcAee2ca877ee8";
export const SKILL_EXCHANGE_ABI = SkillExchangeABI.abi;

// Create public client with fallback RPC
const getRpcUrl = () => {
  const envUrl = import.meta.env.VITE_SEPOLIA_RPC_URL;
  if (envUrl) return envUrl;
  
  // Fallback to public RPCs (no API keys)
  const publicRpcs = [
    'https://rpc.sepolia.org',
    'https://sepolia.drpc.org',
    'https://eth-sepolia.g.alchemy.com/v2/demo'
  ];
  return publicRpcs[Math.floor(Math.random() * publicRpcs.length)];
};

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(getRpcUrl())
});

// Contract configuration
export const CONTRACT_CONFIG = {
  address: SKILL_EXCHANGE_ADDRESS,
  abi: SKILL_EXCHANGE_ABI,
  chain: sepolia,
} as const;
