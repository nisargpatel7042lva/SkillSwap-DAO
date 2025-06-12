
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, CheckCircle, XCircle, Star } from "lucide-react";

interface Booking {
  id: number;
  requirements: string;
  status: string;
  payment_status: string;
  created_at: string;
  skills: {
    title: string;
    price: number;
  } | null;
}

export const BookingManagement = () => {
  const { address, isConnected } = useAccount();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    fetchBookings();
  }, [address]);

  const fetchBookings = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("address", address)
        .single();

      if (!user) return;

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          requirements,
          status,
          payment_status,
          created_at,
          skills (
            title,
            price
          )
        `)
        .eq("requester_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch bookings");
        return;
      }

      setBookings(data || []);
    } catch (error) {
      toast.error("An error occurred while fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      toast.error("Failed to update booking status");
      return;
    }

    toast.success("Booking status updated");
    fetchBookings();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "completed":
        return <Star className="w-4 h-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "accepted": return "bg-green-100 text-green-700";
      case "completed": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (!isConnected) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Connect your wallet to view your bookings</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Loading bookings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Bookings</h2>
      {bookings.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No bookings yet. Start by booking a service!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-2 border-dashed border-gray-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{booking.skills?.title || "Unknown Service"}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600">{booking.requirements}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Created: {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-green-600">
                      {booking.skills?.price || 0} SKILL
                    </span>
                  </div>
                  {booking.status === "accepted" && (
                    <Button 
                      onClick={() => updateBookingStatus(booking.id, "completed")}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
