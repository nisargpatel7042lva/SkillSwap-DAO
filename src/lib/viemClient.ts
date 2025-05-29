import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

export const client = createPublicClient({
  chain: sepolia,
  transport: http("https://eth-sepolia.g.alchemy.com/v2/wWOTNAheWQ2OZVpM3zyqk"),
}); 