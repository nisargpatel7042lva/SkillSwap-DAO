import { client } from "./viemClient";
import abi from "./SkillExchangeABI.json";

export const SKILL_EXCHANGE_ADDRESS = "0x590D444e542EbD7489370AE057A8a03e6e638e1b";

// Read helper: Get skill count
export function getSkillCount() {
  return client.readContract({
    address: SKILL_EXCHANGE_ADDRESS,
    abi,
    functionName: "skillCount",
  });
}

// For write actions (transactions), use wagmi hooks or a wallet client in your React components.

// Example: List a skill (write)
export function listSkill({ title, description, price, category }: { title: string; description: string; price: bigint; category: string; }, account: `0x${string}`) {
  return client.writeContract({
    address: SKILL_EXCHANGE_ADDRESS,
    abi,
    functionName: "listSkill",
    args: [title, description, price, category],
    account,
  });
} 