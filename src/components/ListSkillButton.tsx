
import { useWriteContract, useAccount } from 'wagmi';
import { SKILL_EXCHANGE_ADDRESS } from '@/lib/SkillExchange';
import { sepolia } from 'wagmi/chains';
import abi from '@/lib/SkillExchangeABI.json';

export function ListSkillButton() {
  const { writeContract, isPending, isSuccess, error, data } = useWriteContract();
  const { address } = useAccount();

  return (
    <div>
      <button
        onClick={() =>
          writeContract({
            address: SKILL_EXCHANGE_ADDRESS,
            abi,
            functionName: 'listSkill',
            args: [
              'Demo Skill',
              'This is a demo skill listed from the frontend!',
              1000000000000000000n, // 1 ETH in wei
              'Demo Category',
            ],
            account: address,
            chain: sepolia,
          })
        }
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        {isPending ? 'Listing Skill...' : 'List Demo Skill'}
      </button>
      {isSuccess && (
        <div className="text-green-600 mt-2">Skill listed! Tx: <a href={`https://sepolia.etherscan.io/tx/${data}`} target="_blank" rel="noopener noreferrer" className="underline">{data?.slice(0, 10)}...</a></div>
      )}
      {error && <div className="text-red-600 mt-2">Error: {error.message}</div>}
    </div>
  );
}
