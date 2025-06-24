import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import SkillExchangeABI from "./SkillExchangeABI.json";

export const SKILL_EXCHANGE_ADDRESS = "0x62de4E3f5C9D2AB9C085053c22AcAee2ca877ee8";
export const SKILL_EXCHANGE_ABI = SkillExchangeABI.abi;

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});
