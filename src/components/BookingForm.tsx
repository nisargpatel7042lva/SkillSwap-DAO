
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookingConfirmationDialog } from "./BookingConfirmationDialog";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!requirements.trim()) {
      toast.error("Please describe your requirements");
      return;
    }

    // Check if user has disabled the confirmation dialog
    const hideDialog = localStorage.getItem('hideBookingConfirmDialog') === 'true';
    if (hideDialog) {
      handleBookingSubmit();
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);

    try {
      // Get or create user
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("address", address)
        .single();

      if (userError || !user) {
        // Create user if doesn't exist
        const { data: newUser, error: createUserError } = await supabase
          .from("users")
          .insert({ address })
          .select("id")
          .single();

        if (createUserError || !newUser) {
          toast.error("Failed to create user profile");
          return;
        }
      }

      // Create booking
      const { error: bookingError } = await supabase
        .from("bookings")
        .insert({
          skill_id: parseInt(skill.id),
          requester_id: user?.id,
          requirements,
          status: "pending",
          payment_status: "unpaid"
        });

      if (bookingError) {
        toast.error("Failed to create booking");
        return;
      }

      toast.success("Booking request sent successfully!");
      onBookingCreated();
      onClose();
    } catch (error) {
      toast.error("An error occurred while creating the booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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

      <BookingConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleBookingSubmit}
        serviceName={skill.title}
        providerName={skill.provider.name}
        price={skill.price}
      />
    </>
  );
};
