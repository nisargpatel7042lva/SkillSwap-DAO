
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

// Mock data - in a real app this would come from your backend
const mockProjects = [
  {
    id: 1,
    title: "E-commerce Website Redesign",
    description: "Complete overhaul of the company website with modern design and improved UX",
    status: "In Progress",
    dueDate: "2024-02-15"
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Native iOS and Android app for customer engagement",
    status: "Planning",
    dueDate: "2024-03-01"
  },
  {
    id: 3,
    title: "Brand Identity Package",
    description: "Logo design, brand guidelines, and marketing materials",
    status: "Completed",
    dueDate: "2024-01-20"
  }
];

const mockBookings = [
  {
    id: 1,
    skillTitle: "React Development Bootcamp",
    provider: "Alex Chen",
    status: "Confirmed",
    date: "2024-01-25"
  },
  {
    id: 2,
    skillTitle: "UI/UX Design Fundamentals",
    provider: "Sarah Wilson",
    status: "Pending",
    date: "2024-02-01"
  }
];

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: ""
  });
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  const handleCreateProject = () => {
    // In a real app, this would save to your backend
    console.log("Creating project:", newProject);
    setNewProject({ title: "", description: "", status: "" });
    setShowNewProjectForm(false);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="max-w-md mx-auto border-2 border-dashed border-gray-300">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-4">
              Please connect your wallet to access your dashboard and manage your projects.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50 transform rotate-1">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-700">12</div>
            <div className="text-sm text-blue-600">Active Projects</div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-dashed border-green-300 bg-green-50 transform -rotate-1">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-700">28</div>
            <div className="text-sm text-green-600">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-dashed border-purple-300 bg-purple-50 transform rotate-1">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-700">5</div>
            <div className="text-sm text-purple-600">Pending</div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-dashed border-orange-300 bg-orange-50 transform -rotate-1">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-orange-700">3</div>
            <div className="text-sm text-orange-600">Due Soon</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 border-2 border-dashed border-gray-300">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Projects</h2>
            <Button 
              onClick={() => setShowNewProjectForm(!showNewProjectForm)}
              className="border-2 border-dashed border-blue-400 bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          {showNewProjectForm && (
            <Card className="mb-6 border-2 border-dashed border-gray-300 bg-yellow-50">
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg"
                  />
                  <textarea
                    placeholder="Project Description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg h-24"
                  />
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg"
                  >
                    <option value="">Select Status</option>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                  </select>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateProject} className="bg-green-500 hover:bg-green-600">
                      Create Project
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowNewProjectForm(false)}
                      className="border-2 border-dashed border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project, index) => (
              <Card key={project.id} className={`border-2 border-dashed border-gray-300 bg-white transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant={
                      project.status === 'Completed' ? 'default' : 
                      project.status === 'In Progress' ? 'secondary' : 'outline'
                    }>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Due: {project.dueDate}
                    </div>
                    <Link to={`/project/${project.id}`}>
                      <Button variant="outline" size="sm" className="border-dashed">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <h2 className="text-2xl font-bold mb-6">My Skill Bookings</h2>
          <div className="space-y-4">
            {mockBookings.map((booking, index) => (
              <Card key={booking.id} className={`border-2 border-dashed border-gray-300 bg-white transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{booking.skillTitle}</h3>
                      <p className="text-gray-600 mb-2">Provider: {booking.provider}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {booking.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                      {booking.status === 'Pending' && (
                        <div className="mt-2">
                          <AlertCircle className="w-4 h-4 text-yellow-500 inline mr-1" />
                          <span className="text-xs text-yellow-600">Awaiting confirmation</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
