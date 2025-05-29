
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Star, TrendingUp, User, Award, Calendar } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const user = {
    name: "Alex Chen",
    avatar: "/placeholder-avatar.jpg",
    bio: "Full-stack developer passionate about teaching React and modern web development. Love helping others build amazing projects!",
    rating: 4.9,
    totalEarnings: "2,450 SKILL",
    completedServices: 127,
    joinDate: "March 2023",
    skills: [
      { name: "React Development", level: "Expert", earnings: "1,200 SKILL" },
      { name: "UI/UX Design", level: "Advanced", earnings: "800 SKILL" },
      { name: "Node.js", level: "Intermediate", earnings: "450 SKILL" }
    ],
    badges: [
      { name: "Top Instructor", icon: "🏆", description: "Top 1% of instructors" },
      { name: "Quick Responder", icon: "⚡", description: "Responds within 1 hour" },
      { name: "Community Helper", icon: "🤝", description: "Helped 100+ students" }
    ],
    recentActivity: [
      { type: "service", title: "React Bootcamp completed", date: "2 days ago", earnings: "+50 SKILL" },
      { type: "review", title: "5-star review received", date: "3 days ago", earnings: null },
      { type: "service", title: "UI Design consultation", date: "1 week ago", earnings: "+30 SKILL" }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8 border-2 border-dashed border-gray-300 bg-white shadow-lg transform rotate-1">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center transform -rotate-2">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-200 rounded-full border-2 border-gray-400 flex items-center justify-center transform rotate-12">
                <span className="text-sm">✨</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{user.rating}</span>
                    </div>
                    <Badge variant="outline" className="border-dashed border-2">
                      {user.completedServices} services completed
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-2 border-dashed border-gray-400 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              <p className="text-gray-600 mb-4 max-w-2xl">{user.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-dashed border-green-200">
                  <div className="text-2xl font-bold text-green-600">{user.totalEarnings}</div>
                  <div className="text-sm text-gray-600">Total Earned</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{user.completedServices}</div>
                  <div className="text-sm text-gray-600">Services</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-dashed border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{user.joinDate}</div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 border-2 border-dashed border-gray-300">
          <TabsTrigger value="skills" className="data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-dashed data-[state=active]:border-gray-400">My Skills</TabsTrigger>
          <TabsTrigger value="badges" className="data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-dashed data-[state=active]:border-gray-400">Badges</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-dashed data-[state=active]:border-gray-400">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.skills.map((skill, index) => (
              <Card key={skill.name} className={`border-2 border-dashed border-gray-300 bg-white transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {skill.level}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-600">{skill.earnings}</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-dashed">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.badges.map((badge, index) => (
              <Card key={badge.name} className={`border-2 border-dashed border-gray-300 bg-white text-center p-6 transform ${index % 3 === 0 ? 'rotate-2' : index % 3 === 1 ? '-rotate-1' : 'rotate-1'}`}>
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{badge.name}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-2 border-dashed border-gray-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <div>
                      <p className="font-medium text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    {activity.earnings && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        {activity.earnings}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
