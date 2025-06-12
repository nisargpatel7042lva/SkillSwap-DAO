import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, Clock, DollarSign } from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  illustration_url: string;
  user_id: string;
  created_at: string;
  user: {
    username: string;
    avatar_url: string;
    reputation: number;
  };
}

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    requirements: "",
    budget: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data, error } = await supabase
          .from("skills")
          .select(`
            *,
            user:users(username, avatar_url, reputation)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id]);

  const handleBooking = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!service) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert([
        {
          skill_id: service.id,
          requester_id: address,
          requirements: booking.requirements,
          status: "pending",
          payment_status: "unpaid",
        },
      ]);

      if (error) throw error;

      toast.success("Booking request sent successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (!service) {
    return <div className="container mx-auto p-8">Service not found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{service.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={service.user.avatar_url} />
                  <AvatarFallback>{service.user.username?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{service.user.username}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{service.user.reputation}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>${service.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(service.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{service.category}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Book this Service</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Requirements</label>
                <Textarea
                  value={booking.requirements}
                  onChange={(e) => setBooking({ ...booking, requirements: e.target.value })}
                  placeholder="Describe your requirements..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget (Optional)</label>
                <Input
                  type="number"
                  value={booking.budget}
                  onChange={(e) => setBooking({ ...booking, budget: e.target.value })}
                  placeholder="Enter your budget"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !isConnected}
              >
                {submitting ? "Processing..." : "Book Now"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceDetail;
