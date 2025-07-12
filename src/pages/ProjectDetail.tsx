import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  FileText,
  Star,
  Edit,
  Send
} from "lucide-react";
import { DisputeResolution } from "@/components/DisputeResolution";
import { RatingForm } from "@/components/RatingForm";

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  due_date: string;
  created_at: string;
  user_id: string;
  skill_id: number;
  skill: {
    title: string;
    price: number;
    user: {
      username: string;
      avatar_url: string;
      reputation: number;
    };
  };
  booking?: {
    id: number;
    requirements: string;
    payment_status: string;
    tx_hash: string;
    amount: number;
  };
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(`
            *,
            skill:skills(
              title,
              price,
              user:users(username, avatar_url, reputation)
            ),
            booking:bookings(
              id,
              requirements,
              payment_status,
              tx_hash,
              amount
            )
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        setProject(data);
        
        // Check if current user is the provider
        if (data.skill?.user?.username && address) {
          const { data: userData } = await supabase
            .from("users")
            .select("username")
            .eq("address", address)
            .single();
          
          setIsProvider(userData?.username === data.skill.user.username);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id, address]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!project) return;

    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: newStatus })
        .eq("id", project.id);

      if (error) throw error;

      setProject(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Project status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      // In a real app, you'd have a messages table
      toast.success("Message sent successfully!");
      setMessage("");
      setShowMessageDialog(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'default';
      case 'in progress': return 'secondary';
      case 'planning': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Project not found</h3>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Back to Dashboard
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
            onClick={() => navigate("/dashboard")} 
            variant="outline" 
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{project.title}</h1>
              <p className="text-gray-600">Project details and management</p>
            </div>
            <Badge variant={getStatusColor(project.status)} className="text-lg px-4 py-2">
              {project.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details Card */}
            <Card className="border-2 border-dashed border-gray-300 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  {project.due_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Service Information */}
                {project.skill && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Related Service
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{project.skill.title}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{project.skill.user.reputation || 0} rating</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{project.skill.price} USDC</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Provider Information */}
            {project.skill && (
              <Card className="border-2 border-dashed border-gray-300 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Service Provider
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-dashed border-gray-300">
                      <AvatarImage src={project.skill.user.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700">
                        {project.skill.user.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{project.skill.user.username || "Unknown Provider"}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{project.skill.user.reputation || 0} rating</span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Verified Provider
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dispute Resolution */}
            {project.booking && (
              <DisputeResolution
                requestId={project.booking.id.toString()}
                isCompleted={project.status === "Completed"}
                isPaymentReleased={project.booking.payment_status === "paid"}
                isDisputed={false}
                autoReleaseTime={Date.now() / 1000 + 7 * 24 * 60 * 60} // 7 days from now
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card className="border-2 border-dashed border-gray-300 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-orange-600" />
                  Manage Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate("Planning")}
                  disabled={project.status === "Planning"}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Mark as Planning
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate("In Progress")}
                  disabled={project.status === "In Progress"}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Mark as In Progress
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate("Completed")}
                  disabled={project.status === "Completed"}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-2 border-dashed border-gray-300 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-green-600" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSendMessage} className="flex-1">
                          Send
                        </Button>
                        <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {project.status === "Completed" && (
                  <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Star className="w-4 h-4 mr-2" />
                        Rate Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rate Service</DialogTitle>
                      </DialogHeader>
                      <RatingForm
                        serviceId={project.id.toString()}
                        onRatingSubmitted={() => {
                          setShowRatingDialog(false);
                          toast.success("Rating submitted successfully!");
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card className="border-2 border-dashed border-gray-300 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Project Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Project ID:</span>
                  <span className="font-mono">#{project.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                {project.due_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span>{new Date(project.due_date).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 