
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export const SKILL_EXCHANGE_ADDRESS = '0x590D444e542EbD7489370AE057A8a03e6e638e1b' as const;

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});
