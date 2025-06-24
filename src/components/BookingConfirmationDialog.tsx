
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle, Clock, CreditCard } from "lucide-react";

interface BookingConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  providerName: string;
  price: string;
}

export const BookingConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  providerName,
  price,
}: BookingConfirmationDialogProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if user has previously chosen to hide this dialog
    const hideBookingDialog = localStorage.getItem('hideBookingConfirmDialog');
    if (hideBookingDialog === 'true' && isOpen) {
      onConfirm();
    }
  }, [isOpen, onConfirm]);

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideBookingConfirmDialog', 'true');
    }
    onConfirm();
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideBookingConfirmDialog', 'true');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            Confirm Your Booking
          </DialogTitle>
          <DialogDescription>
            You're about to book "{serviceName}" with {providerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-blue-900">Here's what happens next:</h4>
            
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Booking Request Sent</p>
                  <p className="text-gray-600">Your request will be sent to {providerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-orange-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Provider Review</p>
                  <p className="text-gray-600">They'll review your requirements and respond</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-purple-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Payment & Start</p>
                  <p className="text-gray-600">Once accepted, you'll handle payment and begin the service</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Service Price:</span>
              <span className="text-lg font-bold text-green-600">{price}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dontShowAgain" 
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <label 
              htmlFor="dontShowAgain" 
              className="text-sm text-gray-600 cursor-pointer"
            >
              Don't show me this message again
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-blue-500 hover:bg-blue-600">
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
