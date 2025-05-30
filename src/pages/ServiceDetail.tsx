import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUp, Check, Clock, Star, Users } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "wagmi";
import { toast } from "sonner";

const skills = [
  {
    id: "1",
    title: "React Development Bootcamp",
    description: "Learn modern React development with hooks, context, and best practices. Perfect for beginners and intermediate developers.",
    price: "50 SKILL",
    provider: {
      name: "Alex Chen",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.9
    },
    category: "Programming"
  },
  {
    id: "2",
    title: "UI/UX Design Fundamentals",
    description: "Master the principles of user interface and user experience design. Create beautiful, functional designs that users love.",
    price: "40 SKILL",
    provider: {
      name: "Sarah Wilson",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.8
    },
    category: "Design"
  },
  {
    id: "3",
    title: "Digital Marketing Strategy",
    description: "Build comprehensive marketing campaigns that drive results. Learn SEO, social media, and content marketing strategies.",
    price: "45 SKILL",
    provider: {
      name: "Mike Johnson",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.7
    },
    category: "Marketing"
  },
  {
    id: "4",
    title: "Creative Writing Workshop",
    description: "Develop your storytelling skills and find your unique voice. Perfect for aspiring authors and content creators.",
    price: "30 SKILL",
    provider: {
      name: "Emma Davis",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.9
    },
    category: "Writing"
  },
  {
    id: "5",
    title: "Spanish Conversation Practice",
    description: "Improve your Spanish speaking skills through interactive conversations and cultural immersion.",
    price: "25 SKILL",
    provider: {
      name: "Carlos Rodriguez",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.8
    },
    category: "Languages"
  },
  {
    id: "6",
    title: "Photography Masterclass",
    description: "Learn professional photography techniques, from composition to post-processing. Includes hands-on practice sessions.",
    price: "55 SKILL",
    provider: {
      name: "Lisa Zhang",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.9
    },
    category: "Design"
  },
  {
    id: "101",
    title: "Web3 Smart Contract Bootcamp",
    description: "Learn to write, deploy, and audit smart contracts on Ethereum using Solidity and Hardhat.",
    price: "100 SKILL",
    provider: {
      name: "Priya Sharma",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.9
    },
    category: "Programming"
  },
  {
    id: "102",
    title: "Cartoon Sketching for Beginners",
    description: "Master the basics of cartoon sketching and character design with fun, hands-on lessons.",
    price: "30 SKILL",
    provider: {
      name: "Ravi Patel",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.8
    },
    category: "Design"
  },
  {
    id: "103",
    title: "Digital Marketing 101",
    description: "Kickstart your marketing career with SEO, social media, and content strategy essentials.",
    price: "50 SKILL",
    provider: {
      name: "Aisha Khan",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.7
    },
    category: "Marketing"
  },
  {
    id: "104",
    title: "Creative Writing Workshop",
    description: "Unlock your creativity and learn storytelling techniques from published authors.",
    price: "40 SKILL",
    provider: {
      name: "John Lee",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.9
    },
    category: "Writing"
  }
];

const ServiceDetail = () => {
  const { id } = useParams();
  const { address, isConnected } = useAccount();
  const [service, setService] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [studentsEnrolled, setStudentsEnrolled] = useState(0);
  const [maxStudents, setMaxStudents] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const skill = useMemo(() => skills.find((s) => s.id === id), [id]);

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

  const handleDemoEnroll = () => {
    setEnrolled(true);
    toast.success('Enrolled! (Demo action)');
  };

  if (!skill) return <div className="p-8 text-center">Skill not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/marketplace">
        <Button className="mb-4">&larr; Back to Marketplace</Button>
      </Link>
      <Card className="sketch-border bg-white p-6 max-w-xl mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">{skill.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{skill.description}</p>
          <Badge className="mb-2">{skill.category}</Badge>
          <div className="mt-4 font-bold text-green-600">{skill.price}</div>
          <div className="mt-4 flex items-center gap-3">
            <img src={skill.provider.avatar} alt={skill.provider.name} className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300" />
            <div>
              <div className="font-medium text-gray-700">{skill.provider.name}</div>
              <div className="text-xs text-gray-500">Rating: {skill.provider.rating}</div>
            </div>
          </div>
          <Button className="mt-6 w-full bg-blue-500 text-white rounded-xl" onClick={handleDemoEnroll} disabled={enrolled}>
            {enrolled ? 'Enrolled!' : 'Enroll Now'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceDetail;
