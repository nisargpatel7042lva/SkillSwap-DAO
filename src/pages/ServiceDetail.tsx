import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, Clock, DollarSign, Wallet, Shield, Zap } from "lucide-react";
import { PaymentProcessor } from "@/components/PaymentProcessor";

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
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  const [requirements, setRequirements] = useState("");

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

  const handleBookService = () => {
    if (!isConnected) {
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
          skill_id: service!.id,
          requester_id: userId,
          requirements: requirements.trim(),
          status: "pending",
          payment_status: "escrowed",
          tx_hash: txHash,
          amount: service!.price.toString(),
        });

      if (bookingError) {
        console.error("Booking creation error:", bookingError);
        toast.error("Payment successful but failed to create booking record");
        return;
      }

      toast.success("Service booked successfully!");
      setShowPaymentProcessor(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking record");
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Service not found</h3>
          <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/marketplace")} variant="outline">
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate("/marketplace")} 
            variant="outline" 
            className="mb-4"
          >
            ← Back to Marketplace
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{service.title}</h1>
          <p className="text-gray-600">Service details and booking information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Service Card */}
            <Card className="border-2 border-dashed border-gray-300 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="border-dashed">
                        {service.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(service.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-dashed border-green-200">
                      {service.price} SKILL
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Service Image */}
                {service.illustration_url && (
                  <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-lg border-2 border-dashed border-gray-200">
                    <img 
                      src={service.illustration_url} 
                      alt={service.title}
                      className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-gray-300"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Service Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{service.description}</p>
                </div>

                {/* Provider Info */}
                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Service Provider
                  </h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-dashed border-gray-300">
                      <AvatarImage src={service.user.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700">
                        {service.user.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{service.user.username || "Unknown Provider"}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{service.user.reputation || 0} rating</span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Verified Provider
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Section */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card className="border-2 border-dashed border-gray-300 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {service.price} SKILL
                  </div>
                  <p className="text-sm text-gray-600">Fixed price for this service</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure escrow payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>24/7 support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card className="border-2 border-dashed border-gray-300 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  Book This Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Requirements
                  </label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Describe what you need from this service..."
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none resize-none"
                    rows={4}
                    required
                  />
                </div>

                <Button
                  onClick={handleBookService}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                  disabled={!isConnected || !requirements.trim()}
                >
                  {!isConnected ? (
                    <>
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Wallet to Book
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Book Now - {service.price} SKILL
                    </>
                  )}
                </Button>

                {!isConnected && (
                  <p className="text-sm text-gray-500 text-center">
                    Please connect your wallet to book this service
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Processor Dialog */}
      <Dialog open={showPaymentProcessor} onOpenChange={setShowPaymentProcessor}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <PaymentProcessor
            skillId={service.id.toString()}
            skillPrice={service.price.toString()}
            skillTitle={service.title}
            requirements={requirements}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onClose={() => setShowPaymentProcessor(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDetail;
