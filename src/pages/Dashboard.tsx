import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { ProjectForm } from "@/components/ProjectForm";
import BookingManagement from "@/components/BookingManagement";
import { RatingSystem } from "@/components/RatingSystem";
import { SkillForm } from "@/components/SkillForm";
import React from "react";
import SkillCard from "@/components/SkillCard";
import type { Tables } from "@/integrations/supabase/types";

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
}

interface Booking {
  id: string;
  requirements: string;
  status: string;
  payment_status: string;
  created_at: string;
  skills: {
    title: string;
    price: number;
  };
  role?: 'requester' | 'provider';
}

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const [projects, setProjects] = useState<Project[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [mySkills, setMySkills] = useState<Tables<'skills'>[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  useEffect(() => {
    if (!address) return;
    fetchProjects();
    fetchBookings();
    fetchMySkills(address, setMySkills, setLoadingSkills);
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

  const fetchBookings = async () => {
    if (!address) return;
    
    try {
      // Get user's bookings as requester
      const { data: requesterBookings, error: requesterError } = await supabase
        .from("bookings")
        .select(`
          id,
          requirements,
          status,
          payment_status,
          created_at,
          skills (
            title,
            price
          )
        `)
        .eq("requester_id", address)
        .order("created_at", { ascending: false });

      if (requesterError) {
        console.error("Error fetching requester bookings:", requesterError);
        return;
      }

      // Get user's bookings as provider (through skills)
      const { data: providerBookings, error: providerError } = await supabase
        .from("bookings")
        .select(`
          id,
          requirements,
          status,
          payment_status,
          created_at,
          skills!inner (
            title,
            price,
            user_id
          )
        `)
        .eq("skills.user_id", address)
        .order("created_at", { ascending: false });

      if (providerError) {
        console.error("Error fetching provider bookings:", providerError);
        return;
      }

      // Combine and transform bookings
      const allBookings = [
        ...(requesterBookings || []).map(b => ({ 
          ...b, 
          role: 'requester' as const,
          skills: Array.isArray(b.skills) ? b.skills[0] : b.skills
        })),
        ...(providerBookings || []).map(b => ({ 
          ...b, 
          role: 'provider' as const,
          skills: Array.isArray(b.skills) ? b.skills[0] : b.skills
        }))
      ];

      setBookings(allBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
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

  // Calculate stats from bookings instead of projects
  const activeBookings = bookings.filter(b => b.status === "in_progress" || b.status === "accepted").length;
  const completedBookings = bookings.filter(b => b.status === "completed").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const totalBookings = bookings.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
      </div>
      {/* Action Buttons Row */}
      <div className="flex justify-end gap-2 mb-6">
        <Button
          onClick={() => setShowSkillForm(!showSkillForm)}
          className="border-2 border-dashed border-green-400 bg-green-500 hover:bg-green-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          List Skill
        </Button>
        <Button
          onClick={() => setShowNewProjectForm(!showNewProjectForm)}
          className="border-2 border-dashed border-blue-400 bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
      {showSkillForm && (
        <div className="mb-6">
          <SkillForm
            onSkillCreated={() => {
              setShowSkillForm(false);
              fetchMySkills(address, setMySkills, setLoadingSkills);
            }}
            onCancel={() => setShowSkillForm(false)}
          />
        </div>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50 transform rotate-1">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-700">{activeBookings}</div>
            <div className="text-sm text-blue-600">Active Projects</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-dashed border-green-300 bg-green-50 transform -rotate-1">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-700">{completedBookings}</div>
            <div className="text-sm text-green-600">Completed</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-dashed border-purple-300 bg-purple-50 transform rotate-1">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-700">{pendingBookings}</div>
            <div className="text-sm text-purple-600">Planning</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-dashed border-orange-300 bg-orange-50 transform -rotate-1">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-orange-700">{totalBookings}</div>
            <div className="text-sm text-orange-600">Total Projects</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-dashed border-pink-300 bg-pink-50 transform rotate-1">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-pink-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-pink-700">{mySkills.length}</div>
            <div className="text-sm text-pink-600">Listed Skills</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 border-2 border-dashed border-gray-300">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="skills">Listed Skills</TabsTrigger>
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

        <TabsContent value="skills">
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">My Listed Skills</h2>
            {loadingSkills ? (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">Loading your skills...</p>
                </CardContent>
              </Card>
            ) : mySkills.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">You haven't listed any skills yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    id={String(skill.id)}
                    title={skill.title}
                    description={skill.description}
                    price={skill.price + " ETH"}
                    provider={{ name: "You", avatar: skill.illustration_url || "/placeholder-avatar.jpg", rating: 0 }}
                    category={skill.category || "Other"}
                    image={skill.illustration_url || undefined}
                    viewMode="grid"
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const fetchMySkills = async (
  address: string,
  setMySkills: React.Dispatch<React.SetStateAction<Tables<'skills'>[]>>,
  setLoadingSkills: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!address) return;
  setLoadingSkills(true);
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", address)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching skills:", error);
      setMySkills([]);
      return;
    }
    setMySkills(data || []);
  } catch (error) {
    console.error("Error fetching skills:", error);
    setMySkills([]);
  } finally {
    setLoadingSkills(false);
  }
};

export default Dashboard;
