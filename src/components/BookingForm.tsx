
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
  const { writeContract } = useWriteContract();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0]);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'confirmed' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showInfo) setShowInfo(false);
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!requirements.trim()) {
      toast.error("Please describe your requirements");
      return;
    }

    setIsSubmitting(true);

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
          requirements: requirements,
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
      <CardHeader>
        <CardTitle className="text-xl">Book Service</CardTitle>
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

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe your requirements *
              </label>
              <Textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Please describe what you need, timeline, specific requirements..."
                rows={4}
                className="border-2 border-dashed border-gray-300"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {isSubmitting ? "Submitting..." : "Send Booking Request"}
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
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
