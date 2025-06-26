import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PaymentProcessor } from "./PaymentProcessor";
import { Info, Wallet, AlertTriangle } from "lucide-react";

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

export const BookingForm = ({ skill, onClose, onBookingCreated }: BookingFormProps) => {
  const { address, isConnected } = useAccount();
  const [requirements, setRequirements] = useState("");
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
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

    setShowPaymentProcessor(true);
  };

  const handlePaymentSuccess = async (txHash: string) => {
    try {
      // Get or create user
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("address", address)
        .single();

      let userId = user?.id;
      
      if (userError || !user) {
        const { data: newUser, error: createUserError } = await supabase
          .from("users")
          .insert({ address })
          .select("id")
          .single();
        
        if (createUserError || !newUser) {
          toast.error("Failed to create user profile");
          return;
        }
        userId = newUser.id;
      }

      // Create booking record
      const { error: bookingError } = await supabase
        .from("bookings")
        .insert({
          skill_id: parseInt(skill.id),
          requester_id: userId,
          requirements: requirements.trim(),
          status: "pending",
          payment_status: "escrowed",
          tx_hash: txHash,
          amount: skill.price,
        });

      if (bookingError) {
        console.error("Booking creation error:", bookingError);
        toast.error("Payment successful but failed to create booking record");
        return;
      }

      toast.success("Booking created successfully!");
      onBookingCreated();
      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking record");
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Please connect your wallet to book this service.
            </p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Book Service</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Service Details */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-gray-700">{skill.title}</h4>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium">
                {parseFloat(skill.price) / 1e18} ETH
              </span>
              <Badge variant="outline" className="text-xs">
                🔷 Ethereum
              </Badge>
            </div>
          </div>

          {/* Info Panel */}
          {showInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">How it works:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Payment is held in escrow until service completion</li>
                    <li>• Funds are automatically released to the provider</li>
                    <li>• You can rate the service after payment release</li>
                    <li>• All transactions are recorded on the blockchain</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Requirements Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Service Requirements
              </label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe what you need from this service..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={!requirements.trim()}
              >
                Proceed to Payment
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Payment Processor Dialog */}
      <Dialog open={showPaymentProcessor} onOpenChange={setShowPaymentProcessor}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <PaymentProcessor
            skillId={skill.id}
            skillPrice={skill.price}
            skillTitle={skill.title}
            requirements={requirements}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onClose={() => setShowPaymentProcessor(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

