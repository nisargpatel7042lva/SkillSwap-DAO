import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  ExternalLink,
  Shield,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { 
  SUPPORTED_TOKENS, 
  checkPaymentStatus, 
  formatTokenAmount,
  parseTokenAmount,
  getTokenInfo,
  estimateApprovalGas,
  type TokenInfo,
  type PaymentStatus
} from '@/lib/paymentUtils';
import { SKILL_EXCHANGE_ADDRESS, SKILL_EXCHANGE_ABI } from '@/lib/SkillExchange';

// ERC20 ABI for approvals
const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  }
] as const;

interface PaymentProcessorProps {
  skillId: string;
  skillPrice: string;
  skillTitle: string;
  requirements: string;
  onPaymentSuccess: (txHash: string) => void;
  onPaymentError: (error: string) => void;
  onClose: () => void;
}

type PaymentStep = 'checking' | 'approving' | 'paying' | 'success' | 'error';

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  skillId,
  skillPrice,
  skillTitle,
  requirements,
  onPaymentSuccess,
  onPaymentError,
  onClose
}) => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(SUPPORTED_TOKENS[0]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [currentStep, setCurrentStep] = useState<PaymentStep>('checking');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<bigint>(0n);

  // Check payment status when component mounts or token changes
  useEffect(() => {
    if (isConnected && address && selectedToken) {
      checkPayment();
    }
  }, [isConnected, address, selectedToken, skillPrice]);

  const checkPayment = async () => {
    if (!address || !selectedToken) return;

    setCurrentStep('checking');
    const requiredAmount = parseTokenAmount(skillPrice, selectedToken.decimals);
    
    try {
      const status = await checkPaymentStatus(
        selectedToken.address,
        address,
        requiredAmount
      );
      setPaymentStatus(status);

      // Estimate gas for approval if needed
      if (status.needsApproval && selectedToken.symbol !== 'ETH') {
        const gasEst = await estimateApprovalGas(
          selectedToken.address,
          address,
          requiredAmount
        );
        setGasEstimate(gasEst);
      }

      setCurrentStep(status.canPay ? 'paying' : 'approving');
    } catch (error) {
      console.error('Error checking payment status:', error);
      setCurrentStep('error');
      onPaymentError('Failed to check payment status');
    }
  };

  const handleTokenApproval = async () => {
    if (!address || !selectedToken || !paymentStatus) return;

    setIsProcessing(true);
    setCurrentStep('approving');

    try {
      const requiredAmount = parseTokenAmount(skillPrice, selectedToken.decimals);
      
      const result = await writeContractAsync({
        address: selectedToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [SKILL_EXCHANGE_ADDRESS as `0x${string}`, requiredAmount],
        account: address,
      });

      toast.success('Token approval successful!');
      setCurrentStep('paying');
      
      // Recheck payment status after approval
      await checkPayment();
    } catch (error) {
      console.error('Approval error:', error);
      setCurrentStep('error');
      onPaymentError('Token approval failed');
      toast.error('Token approval failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!address || !selectedToken || !paymentStatus) return;

    setIsProcessing(true);
    setCurrentStep('paying');

    try {
      const requiredAmount = parseTokenAmount(skillPrice, selectedToken.decimals);
      
      const result = await writeContractAsync({
        address: SKILL_EXCHANGE_ADDRESS as `0x${string}`,
        abi: SKILL_EXCHANGE_ABI,
        functionName: 'requestService',
        args: [parseInt(skillId), requirements],
        account: address,
        value: selectedToken.symbol === 'ETH' ? requiredAmount : 0n,
      });

      setTxHash(result);
      setCurrentStep('success');
      toast.success('Payment successful! Service request created.');
      onPaymentSuccess(result);
    } catch (error) {
      console.error('Payment error:', error);
      setCurrentStep('error');
      onPaymentError('Payment failed');
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepIcon = (step: PaymentStep) => {
    switch (step) {
      case 'checking':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'approving':
        return <Shield className="w-5 h-5" />;
      case 'paying':
        return <Zap className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getStepTitle = (step: PaymentStep) => {
    switch (step) {
      case 'checking':
        return 'Checking Payment Status';
      case 'approving':
        return 'Approve Token Spending';
      case 'paying':
        return 'Processing Payment';
      case 'success':
        return 'Payment Successful';
      case 'error':
        return 'Payment Failed';
      default:
        return 'Payment Processor';
    }
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
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to proceed with payment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStepIcon(currentStep)}
          {getStepTitle(currentStep)}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Service Details */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700">{skillTitle}</h4>
          <p className="text-xs text-gray-500 mt-1">{requirements}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium">
              {formatTokenAmount(parseTokenAmount(skillPrice, selectedToken.decimals), selectedToken.decimals)} {selectedToken.symbol}
            </span>
            <Badge variant="outline" className="text-xs">
              {selectedToken.logo} {selectedToken.name}
            </Badge>
          </div>
        </div>

        {/* Token Selection */}
        {currentStep === 'checking' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_TOKENS.map((token) => (
                <Button
                  key={token.symbol}
                  variant={selectedToken.symbol === token.symbol ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedToken(token)}
                  className="justify-start"
                >
                  <span className="mr-2">{token.logo}</span>
                  {token.symbol}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Payment Status */}
        {paymentStatus && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your Balance:</span>
              <span className="font-medium">
                {formatTokenAmount(paymentStatus.currentBalance, selectedToken.decimals)} {selectedToken.symbol}
              </span>
            </div>
            
            {paymentStatus.error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{paymentStatus.error}</AlertDescription>
              </Alert>
            )}

            {paymentStatus.needsApproval && selectedToken.symbol !== 'ETH' && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  You need to approve {selectedToken.symbol} spending before payment.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <Progress 
          value={
            currentStep === 'checking' ? 25 :
            currentStep === 'approving' ? 50 :
            currentStep === 'paying' ? 75 :
            currentStep === 'success' ? 100 : 0
          } 
          className="w-full"
        />

        {/* Action Buttons */}
        <div className="flex gap-2">
          {currentStep === 'approving' && paymentStatus?.needsApproval && (
            <Button
              onClick={handleTokenApproval}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Approve {selectedToken.symbol}
                </>
              )}
            </Button>
          )}

          {currentStep === 'paying' && paymentStatus?.canPay && (
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Pay {formatTokenAmount(parseTokenAmount(skillPrice, selectedToken.decimals), selectedToken.decimals)} {selectedToken.symbol}
                </>
              )}
            </Button>
          )}

          {currentStep === 'success' && txHash && (
            <Button
              onClick={() => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank')}
              variant="outline"
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Transaction
            </Button>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            disabled={isProcessing}
          >
            {currentStep === 'success' ? 'Done' : 'Cancel'}
          </Button>
        </div>

        {/* Gas Estimate */}
        {gasEstimate > 0n && currentStep === 'approving' && (
          <div className="text-xs text-gray-500 text-center">
            Estimated gas: {gasEstimate.toString()} wei
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 