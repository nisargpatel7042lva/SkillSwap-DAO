
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { ProjectForm } from "@/components/ProjectForm";
import { BookingManagement } from "@/components/BookingManagement";
import { RatingSystem } from "@/components/RatingSystem";

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
}

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    fetchProjects();
  }, [address]);

  const fetchProjects = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", address)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = () => {
    setShowNewProjectForm(false);
    fetchProjects();
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

  const activeProjects = projects.filter(p => p.status === "In Progress").length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const pendingProjects = projects.filter(p => p.status === "Planning").length;

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
            <div className="text-2xl font-bold text-blue-700">{activeProjects}</div>
            <div className="text-sm text-blue-600">Active Projects</div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-dashed border-green-300 bg-green-50 transform -rotate-1">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-700">{completedProjects}</div>
            <div className="text-sm text-green-600">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-dashed border-purple-300 bg-purple-50 transform rotate-1">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-700">{pendingProjects}</div>
            <div className="text-sm text-purple-600">Planning</div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-dashed border-orange-300 bg-orange-50 transform -rotate-1">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-orange-700">{projects.length}</div>
            <div className="text-sm text-orange-600">Total Projects</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 border-2 border-dashed border-gray-300">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="ratings">Rate Services</TabsTrigger>
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
            <div className="mb-6">
              <ProjectForm 
                onProjectCreated={handleProjectCreated}
                onCancel={() => setShowNewProjectForm(false)}
              />
            </div>
          )}

          {loading ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Loading projects...</p>
              </CardContent>
            </Card>
          ) : projects.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No projects yet. Create your first project!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
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
                        Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : "No due date"}
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
          )}
        </TabsContent>

        <TabsContent value="bookings">
          <BookingManagement />
        </TabsContent>

        <TabsContent value="ratings">
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">Rate completed services here</p>
              <p className="text-sm text-gray-500">Complete a service booking to see rating options</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
