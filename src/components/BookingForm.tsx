import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAccount, useWriteContract } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SKILL_EXCHANGE_ADDRESS, SKILL_EXCHANGE_ABI } from '@/lib/SkillExchange';
import { sepolia } from 'wagmi/chains';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Info } from "lucide-react";

interface BookingFormProps {
  skill: {
    id: string;
    title: string;
    price: string;
    provider: {
      name: string;
      avatar: string;
    };
  };
  onClose: () => void;
  onBookingCreated: () => void;
}

const SUPPORTED_TOKENS = [
  { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
  { symbol: 'USDC', address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', decimals: 6 },
  { symbol: 'DAI', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18 },
  { symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18 },
  { symbol: 'USDT', address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0', decimals: 6 },
];

export const BookingForm = ({ skill, onClose, onBookingCreated }: BookingFormProps) => {
  const { address, isConnected } = useAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
  const { writeContract, isPending, isSuccess, error, data } = useWriteContract();
  const [showInfo, setShowInfo] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'awaiting_wallet' | 'pending' | 'confirmed' | 'error'>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowInfo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showInfo) setShowInfo(false);
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }
    setIsSubmitting(true);
    setTxStatus('awaiting_wallet');
    setTxHash(null);
    try {
      // 1. Call contract to request service (escrow payment)
      const price = BigInt(skill.price);
      const args = [parseInt(skill.id), ""];
      const txResult = await writeContract({
        address: SKILL_EXCHANGE_ADDRESS,
        abi: SKILL_EXCHANGE_ABI,
        functionName: 'requestService',
        args,
        account: address,
        chain: sepolia,
        value: selectedToken.symbol === 'ETH' ? price : 0n,
      });
      setTxStatus('pending');
      if (typeof txResult === 'string') {
        setTxHash(txResult);
      } else {
        setTxHash(null);
      }
      toast.success('Transaction sent! Waiting for confirmation...');
      // 2. On success, create booking in Supabase
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("address", address)
        .single();
      if (userError || !user) {
        const { data: newUser, error: createUserError } = await supabase
          .from("users")
          .insert({ address })
          .select("id")
          .single();
        if (createUserError || !newUser) {
          toast.error("Failed to create user profile");
          setTxStatus('error');
          return;
        }
      }
      const { error: bookingError } = await supabase
        .from("bookings")
        .insert({
          skill_id: parseInt(skill.id),
          requester_id: user?.id,
          requirements: "",
          status: "pending",
          payment_status: "escrowed",
          token_address: selectedToken.address,
          tx_hash: txHash,
        });
      if (bookingError) {
        toast.error("Failed to create booking");
        setTxStatus('error');
        return;
      }
      setTxStatus('confirmed');
      toast.success("Booking request sent successfully!");
      onBookingCreated();
      onClose();
    } catch (error: unknown) {
      let message = "An error occurred while creating the booking";
      if (typeof error === "object" && error && "message" in error) {
        const err = error as { message?: string };
        if (typeof err.message === "string") {
          message = err.message;
        }
      }
      setTxStatus('error');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-dashed border-gray-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          Book Service
          <button type="button" onClick={() => setShowInfo(true)} className="ml-2 text-blue-500 hover:text-blue-700" aria-label="How it works">
            <Info className="w-5 h-5" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{skill.title}</h3>
            <Badge variant="outline" className="mt-1">{skill.price}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <img 
              src={skill.provider.avatar} 
              alt={skill.provider.name}
              className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300"
            />
            <span className="text-sm text-gray-600">Provider: {skill.provider.name}</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payment Token</label>
              <select
                value={selectedToken.symbol}
                onChange={e => setSelectedToken(SUPPORTED_TOKENS.find(t => t.symbol === e.target.value) || SUPPORTED_TOKENS[0])}
                className="w-full border-2 border-dashed border-gray-300 rounded px-2 py-1"
              >
                {SUPPORTED_TOKENS.map(token => (
                  <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isSubmitting || isPending}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {isSubmitting || isPending ? "Booking..." : "Book Now"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-2 border-dashed border-gray-300"
              >
                Cancel
              </Button>
            </div>
            {/* Transaction UI feedback */}
            {txStatus !== 'idle' && (
              <div className="mt-4">
                {txStatus === 'awaiting_wallet' && <div className="text-blue-600">Awaiting wallet confirmation...</div>}
                {txStatus === 'pending' && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <span className="loader spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-yellow-400 border-t-transparent" />
                    Transaction pending... <a href={txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : '#'} target="_blank" rel="noopener noreferrer" className="underline">View on Etherscan</a>
                  </div>
                )}
                {txStatus === 'confirmed' && (
                  <div className="text-green-600">Booking confirmed! <a href={txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : '#'} target="_blank" rel="noopener noreferrer" className="underline">View on Etherscan</a></div>
                )}
                {txStatus === 'error' && <div className="text-red-600">Transaction failed. Please try again.</div>}
              </div>
            )}
          </form>
        </div>
      </CardContent>
      <AlertDialog open={showInfo} onOpenChange={setShowInfo}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>How Booking & Escrow Works</AlertDialogTitle>
            <AlertDialogDescription>
              <ul className="list-disc pl-5 space-y-2 text-left">
                <li><strong>Escrowed Payment:</strong> When you book, your payment is securely held in a smart contract until the service is completed.</li>
                <li><strong>Trust & Safety:</strong> The provider only receives payment after you confirm the service is delivered as agreed.</li>
                <li><strong>Decentralized:</strong> No middlemen. All transactions are on-chain and transparent.</li>
                <li><strong>Refunds:</strong> If the service is not delivered, your funds remain safe and can be refunded.</li>
                <li><strong>Supported Tokens:</strong> You can pay with ETH or supported ERC-20 tokens. For tokens, you may need to approve the contract first.</li>
                <li><strong>Next Steps:</strong> After booking, track your order in the dashboard. Release payment only when satisfied.</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowInfo(false)}>Got it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
