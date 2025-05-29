
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, MapPin, Calendar, Star, Award, BookUser } from "lucide-react";

const Profile = () => {
  const user = {
    name: "Alex Chen",
    avatar: "/placeholder-avatar.jpg",
    bio: "Senior Frontend Developer passionate about React, TypeScript, and building amazing user experiences. Always eager to share knowledge and learn from the community.",
    location: "San Francisco, CA",
    joinedDate: "January 2023",
    rating: 4.9,
    reviewCount: 127,
    skillsOffered: 5,
    skillsLearned: 12,
    tokensEarned: 450,
    badges: [
      { name: "Top Instructor", icon: "🏆", description: "Consistently high ratings" },
      { name: "Community Builder", icon: "🤝", description: "Active community member" },
      { name: "React Expert", icon: "⚛️", description: "React specialist" }
    ],
    skillsTeaching: [
      {
        id: "1",
        title: "React Development Bootcamp",
        category: "Programming",
        price: "50 SKILL",
        studentsEnrolled: 45,
        rating: 4.9
      },
      {
        id: "2",
        title: "TypeScript Fundamentals",
        category: "Programming", 
        price: "35 SKILL",
        studentsEnrolled: 28,
        rating: 4.8
      }
    ],
    skillsLearning: [
      {
        title: "UI/UX Design Principles",
        provider: "Sarah Wilson",
        progress: 75,
        status: "In Progress"
      },
      {
        title: "Advanced Node.js",
        provider: "Mike Johnson",
        progress: 100,
        status: "Completed"
      }
    ],
    recentReviews: [
      {
        skill: "React Development Bootcamp",
        reviewer: "Sarah M.",
        rating: 5,
        comment: "Absolutely fantastic instructor! Alex's teaching style is clear and engaging.",
        date: "2 weeks ago"
      },
      {
        skill: "TypeScript Fundamentals",
        reviewer: "David L.",
        rating: 5,
        comment: "Best TypeScript course I've taken. Very practical and well-structured.",
        date: "1 month ago"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="sketch-border">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-sketch-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">{user.name.charAt(0)}</span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h1>
              
              <div className="flex items-center justify-center gap-1 mb-3">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">{user.rating}</span>
                <span className="text-gray-500">({user.reviewCount} reviews)</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{user.bio}</p>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user.joinedDate}</span>
                </div>
              </div>
              
              <Button className="w-full rounded-xl">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="sketch-border">
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.skillsOffered}</div>
                <div className="text-sm text-gray-500">Skills Offered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.skillsLearned}</div>
                <div className="text-sm text-gray-500">Skills Learned</div>
              </div>
              <div className="text-center col-span-2">
                <div className="text-2xl font-bold text-primary">{user.tokensEarned}</div>
                <div className="text-sm text-gray-500">SKILL Tokens Earned</div>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="sketch-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-sketch-gray rounded-xl">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{badge.name}</div>
                    <div className="text-xs text-gray-500">{badge.description}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="teaching" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="teaching">Teaching</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="teaching" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">Skills I Teach</h2>
                <Button className="rounded-xl">
                  <BookUser className="w-4 h-4 mr-2" />
                  Add New Skill
                </Button>
              </div>
              
              <div className="grid gap-6">
                {user.skillsTeaching.map((skill) => (
                  <Card key={skill.id} className="sketch-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{skill.title}</h3>
                          <Badge variant="secondary" className="bg-sketch-gray">
                            {skill.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{skill.price}</div>
                          <div className="text-sm text-gray-500">per session</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{skill.studentsEnrolled} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{skill.rating} rating</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-3">
                        <Button variant="outline" size="sm" className="rounded-xl">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="learning" className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Skills I'm Learning</h2>
              
              <div className="grid gap-6">
                {user.skillsLearning.map((skill, index) => (
                  <Card key={index} className="sketch-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{skill.title}</h3>
                          <p className="text-gray-600">by {skill.provider}</p>
                        </div>
                        <Badge 
                          variant={skill.status === "Completed" ? "default" : "secondary"}
                          className={skill.status === "Completed" ? "bg-green-500" : "bg-sketch-gray"}
                        >
                          {skill.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{skill.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${skill.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl"
                        disabled={skill.status === "Completed"}
                      >
                        {skill.status === "Completed" ? "Completed" : "Continue Learning"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Recent Reviews</h2>
              
              <div className="space-y-6">
                {user.recentReviews.map((review, index) => (
                  <Card key={index} className="sketch-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{review.skill}</h4>
                          <p className="text-sm text-gray-600">by {review.reviewer}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
