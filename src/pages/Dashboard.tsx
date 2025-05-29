
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Clock, Wallet, Calendar, ArrowUp } from "lucide-react";

const Dashboard = () => {
  const dashboardData = {
    stats: {
      totalEarnings: 450,
      activeServices: 5,
      totalStudents: 73,
      avgRating: 4.9
    },
    recentEarnings: [
      { date: "Today", amount: 25, service: "React Bootcamp" },
      { date: "Yesterday", amount: 50, service: "TypeScript Fundamentals" },
      { date: "2 days ago", amount: 35, service: "React Bootcamp" },
      { date: "3 days ago", amount: 40, service: "Code Review Session" }
    ],
    activeServices: [
      {
        title: "React Development Bootcamp",
        students: 45,
        nextSession: "Today, 2:00 PM",
        status: "active",
        earnings: "200 SKILL"
      },
      {
        title: "TypeScript Fundamentals",
        students: 28,
        nextSession: "Tomorrow, 10:00 AM",
        status: "active",
        earnings: "150 SKILL"
      },
      {
        title: "Code Review Sessions",
        students: 12,
        nextSession: "Friday, 3:00 PM",
        status: "active",
        earnings: "100 SKILL"
      }
    ],
    upcomingSessions: [
      {
        title: "React Bootcamp - Week 3",
        time: "Today, 2:00 PM",
        duration: "2 hours",
        students: 45,
        type: "Group Session"
      },
      {
        title: "1-on-1 Code Review",
        time: "Tomorrow, 10:00 AM",
        duration: "1 hour", 
        students: 1,
        type: "Individual"
      },
      {
        title: "TypeScript Q&A",
        time: "Thursday, 4:00 PM",
        duration: "1.5 hours",
        students: 28,
        type: "Group Session"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-xl text-gray-600">Welcome back! Here's your teaching overview.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="sketch-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-primary">{dashboardData.stats.totalEarnings}</p>
                <p className="text-xs text-gray-500">SKILL tokens</p>
              </div>
              <div className="w-12 h-12 bg-sketch-green rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sketch-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Services</p>
                <p className="text-3xl font-bold text-primary">{dashboardData.stats.activeServices}</p>
                <p className="text-xs text-gray-500">Currently teaching</p>
              </div>
              <div className="w-12 h-12 bg-sketch-blue rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sketch-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-primary">{dashboardData.stats.totalStudents}</p>
                <p className="text-xs text-gray-500">Across all services</p>
              </div>
              <div className="w-12 h-12 bg-sketch-green rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sketch-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                <p className="text-3xl font-bold text-primary">{dashboardData.stats.avgRating}</p>
                <p className="text-xs text-gray-500">⭐ from students</p>
              </div>
              <div className="w-12 h-12 bg-sketch-blue rounded-2xl flex items-center justify-center">
                <ArrowUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Earnings */}
        <Card className="sketch-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Recent Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentEarnings.map((earning, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-sketch-gray rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">{earning.service}</p>
                  <p className="text-sm text-gray-500">{earning.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">+{earning.amount} SKILL</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full rounded-xl border-2">
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Active Services */}
        <Card className="sketch-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Active Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.activeServices.map((service, index) => (
                <div key={index} className="p-4 border-2 border-gray-200 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{service.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {service.students} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.nextSession}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-sketch-green text-gray-700 mb-2">
                        {service.status}
                      </Badge>
                      <p className="text-sm font-medium text-primary">{service.earnings}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl">
                      Manage
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card className="sketch-border mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.upcomingSessions.map((session, index) => (
              <div key={index} className="p-4 bg-sketch-gray rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{session.title}</h3>
                    <p className="text-sm text-gray-600">{session.time}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {session.type}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p>Duration: {session.duration}</p>
                  <p>Students: {session.students}</p>
                </div>
                
                <Button size="sm" className="w-full rounded-xl">
                  Join Session
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
