import React, { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { SKILL_EXCHANGE_ADDRESS, SKILL_EXCHANGE_ABI } from '@/lib/SkillExchange';

interface DisputeResolutionProps {
  requestId: string;
  isCompleted: boolean;
  isPaymentReleased: boolean;
  isDisputed: boolean;
  autoReleaseTime?: number;
  onDisputeRaised?: () => void;
}

export const DisputeResolution: React.FC<DisputeResolutionProps> = ({
  requestId,
  isCompleted,
  isPaymentReleased,
  isDisputed,
  autoReleaseTime,
  onDisputeRaised
}) => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canRaiseDispute = isCompleted && !isPaymentReleased && !isDisputed;
  const disputeWindowExpired = autoReleaseTime && Date.now() / 1000 > autoReleaseTime;
  const timeUntilAutoRelease = autoReleaseTime ? Math.max(0, autoReleaseTime - Date.now() / 1000) : 0;

  const handleRaiseDispute = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!disputeReason.trim()) {
      toast.error("Please provide a reason for the dispute");
      return;
    }

    setIsSubmitting(true);
    try {
      await writeContractAsync({
        address: SKILL_EXCHANGE_ADDRESS as `0x${string}`,
        abi: SKILL_EXCHANGE_ABI,
        functionName: 'raiseDispute',
        args: [parseInt(requestId)],
        account: address,
        chain: sepolia,
      });

      toast.success("Dispute raised successfully! Our team will review your case.");
      setShowDisputeDialog(false);
      setDisputeReason('');
      onDisputeRaised?.();
    } catch (error) {
      console.error('Error raising dispute:', error);
      toast.error("Failed to raise dispute. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Money-Back Guarantee
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Money-back guarantee info */}
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>7-Day Money-Back Guarantee:</strong> If you're not satisfied with the service, 
            you can raise a dispute within 7 days of completion for a full refund.
          </AlertDescription>
        </Alert>

        {/* Current status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Service Status:</span>
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? "Completed" : "In Progress"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Payment Status:</span>
            <Badge variant={isPaymentReleased ? "default" : "outline"}>
              {isPaymentReleased ? "Released" : "Held in Escrow"}
            </Badge>
          </div>

          {isDisputed && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Dispute Status:</span>
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Under Review
              </Badge>
            </div>
          )}
        </div>

        {/* Dispute window countdown */}
        {isCompleted && !isPaymentReleased && !isDisputed && autoReleaseTime && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {disputeWindowExpired 
                  ? "Dispute window expired - payment will auto-release soon"
                  : `Dispute window: ${formatTimeRemaining(timeUntilAutoRelease)} remaining`
                }
              </span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2">
          {canRaiseDispute && !disputeWindowExpired && (
            <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Raise Dispute for Refund
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Raise Dispute</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reason for Dispute *
                    </label>
                    <Textarea
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      placeholder="Please describe why you're not satisfied with the service..."
                      rows={4}
                      className="border-2 border-dashed border-gray-300"
                    />
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTriangle className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Our team will review your dispute within 24-48 hours. 
                      You may be asked to provide additional evidence.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleRaiseDispute}
                      disabled={isSubmitting || !disputeReason.trim()}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Dispute"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDisputeDialog(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {isDisputed && (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Your dispute is under review. Our team will contact you within 24-48 hours 
                with a resolution. You can provide additional evidence by contacting support.
              </AlertDescription>
            </Alert>
          )}

          {disputeWindowExpired && !isPaymentReleased && (
            <Alert className="bg-gray-50 border-gray-200">
              <Clock className="w-4 h-4 text-gray-600" />
              <AlertDescription className="text-gray-800">
                The dispute window has expired. Payment will be automatically released to the provider soon.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Support information */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          Need help? Contact our support team for assistance with disputes and refunds.
        </div>
      </CardContent>
    </Card>
  );
}; 