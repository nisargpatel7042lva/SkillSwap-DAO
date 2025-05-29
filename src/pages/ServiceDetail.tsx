
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUp, Check, Clock, Star, Users } from "lucide-react";

const ServiceDetail = () => {
  const { id } = useParams();

  // Mock data for the service
  const service = {
    id: "1",
    title: "React Development Bootcamp",
    description: "Master modern React development with this comprehensive bootcamp. You'll learn everything from basic components to advanced patterns like custom hooks, context API, and performance optimization. This course includes hands-on projects, code reviews, and personalized mentorship.",
    fullDescription: `
      This intensive React development bootcamp is designed for both beginners and intermediate developers who want to master modern React development. Over the course of 8 weeks, you'll build real-world applications and learn industry best practices.

      What you'll learn:
      • React fundamentals and modern hooks
      • State management with Context API and Redux
      • Component composition and reusability
      • Performance optimization techniques
      • Testing with Jest and React Testing Library
      • Deployment strategies and CI/CD

      This bootcamp includes:
      • 24 hours of live instruction
      • Code reviews and personalized feedback
      • Access to exclusive Discord community
      • Certificate of completion
      • 3 months of post-bootcamp support
    `,
    price: "50 SKILL",
    provider: {
      name: "Alex Chen",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.9,
      reviewCount: 127,
      completedProjects: 89,
      yearsExperience: 6,
      bio: "Senior Frontend Developer at a Fortune 500 company with 6+ years of experience in React ecosystem. Passionate about teaching and helping developers grow their skills."
    },
    category: "Programming",
    duration: "8 weeks",
    level: "Beginner to Intermediate",
    studentsEnrolled: 45,
    maxStudents: 60,
    features: [
      "Live interactive sessions",
      "1-on-1 mentorship",
      "Code review included",
      "Project portfolio building",
      "Job placement assistance",
      "Lifetime community access"
    ],
    reviews: [
      {
        name: "Sarah M.",
        rating: 5,
        comment: "Absolutely fantastic! Alex's teaching style is clear and engaging. I landed my first React job thanks to this bootcamp.",
        date: "2 weeks ago"
      },
      {
        name: "David L.",
        rating: 5,
        comment: "Best investment I've made in my career. The hands-on projects really helped solidify my understanding.",
        date: "1 month ago"
      },
      {
        name: "Maria G.",
        rating: 4,
        comment: "Great content and support. Would recommend to anyone serious about learning React.",
        date: "2 months ago"
      }
    ]
  };

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
              <CardTitle className="text-3xl font-bold text-primary">{service.price}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full py-3 rounded-xl text-lg">
                Enroll Now
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
                    <span>{service.studentsEnrolled}/{service.maxStudents}</span>
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
