import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUp, Check, Clock, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "wagmi";

const ServiceDetail = () => {
  const { id } = useParams();
  const { address, isConnected } = useAccount();
  const [service, setService] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [studentsEnrolled, setStudentsEnrolled] = useState(0);
  const [maxStudents, setMaxStudents] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  // Fetch service and enrollment data
  useEffect(() => {
    if (!id) return;
    setLoaded(false);
    // Fetch service details
    supabase
      .from("skills")
      .select("*, user_id")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setService(data || null);
        setLoaded(true);
        if (data) {
          setMaxStudents(data.max_students || 60);
        }
      });
    // Fetch enrollments count
    supabase
      .from("bookings")
      .select("id", { count: "exact" })
      .eq("skill_id", id)
      .then(({ count }) => {
        setStudentsEnrolled(count || 0);
      });
    // Check if user already enrolled
    if (address) {
      supabase
        .from("users")
        .select("id")
        .eq("address", address)
        .single()
        .then(({ data: user }) => {
          if (user) {
            supabase
              .from("bookings")
              .select("id")
              .eq("skill_id", id)
              .eq("requester_id", user.id)
              .then(({ data }) => {
                setAlreadyEnrolled(!!data && data.length > 0);
              });
          }
        });
    }

    // Real-time subscription for bookings
    const channel = supabase
      .channel('realtime:bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `skill_id=eq.${id}` }, (payload) => {
        // Refetch enrollments count on any change
        supabase
          .from("bookings")
          .select("id", { count: "exact" })
          .eq("skill_id", id)
          .then(({ count }) => {
            setStudentsEnrolled(count || 0);
          });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // Enroll handler
  const handleEnroll = async () => {
    if (!isConnected || enrolling || alreadyEnrolled) return;
    setEnrolling(true);
    // Get user id
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("address", address)
      .single();
    if (!user) {
      setEnrolling(false);
      return;
    }
    // Insert booking
    const { error } = await supabase.from("bookings").insert({
      skill_id: id,
      requester_id: user.id,
      status: "pending",
      payment_status: "unpaid",
    });
    if (!error) {
      setAlreadyEnrolled(true);
      setStudentsEnrolled((n) => n + 1);
    }
    setEnrolling(false);
  };

  if (!service && loaded) return (
    <div className="p-8 text-center text-gray-500">
      <div className="mb-4">Service not found.</div>
      <Link to="/marketplace">
        <Button className="bg-blue-500 text-white px-6 py-2 rounded-xl">Back to Marketplace</Button>
      </Link>
    </div>
  );
  if (!service) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service Header */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-sketch-gray">
                {service.category}
              </Badge>
              <Badge variant="outline" className="border-primary text-primary">
                {service.level}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{service.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{service.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{service.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{service.studentsEnrolled}/{service.maxStudents} enrolled</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{service.provider.rating} ({service.provider.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detailed Description */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Bootcamp</h2>
            <div className="prose max-w-none">
              {service.fullDescription.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <Separator />

          {/* What's Included */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Reviews</h2>
            <div className="space-y-6">
              {service.reviews.map((review, index) => (
                <Card key={index} className="sketch-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{review.name}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="sketch-border sticky top-24">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">{service.price} SKILL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full py-3 rounded-xl text-lg" onClick={handleEnroll} disabled={enrolling || alreadyEnrolled || studentsEnrolled >= maxStudents}>
                {alreadyEnrolled ? "Enrolled" : enrolling ? "Enrolling..." : studentsEnrolled >= maxStudents ? "Full" : "Enroll Now"}
              </Button>
              <Button variant="outline" className="w-full py-3 rounded-xl border-2">
                Add to Wishlist
              </Button>
              
              <div className="pt-4 border-t-2 border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-3">Quick Info</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level:</span>
                    <span>{service.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span>{studentsEnrolled}/{maxStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{service.category}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Card */}
          <Card className="sketch-border">
            <CardHeader>
              <CardTitle className="text-lg">Meet Your Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sketch-blue rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold">{service.provider.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{service.provider.name}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">{service.provider.rating}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{service.provider.bio}</p>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-primary">{service.provider.completedProjects}</div>
                  <div className="text-xs text-gray-500">Projects Completed</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-primary">{service.provider.yearsExperience}+</div>
                  <div className="text-xs text-gray-500">Years Experience</div>
                </div>
              </div>
              
              <Link to="/profile" className="block mt-4">
                <Button variant="outline" className="w-full rounded-xl border-2">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
