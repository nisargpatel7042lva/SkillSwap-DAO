import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  owner_id: string;
  owner: {
    username: string;
    avatar_url: string;
  };
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(`
            *,
            owner:users(username, avatar_url)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        setProject(data);
        setFormData({
          title: data.title,
          description: data.description,
          status: data.status,
        });
        setIsOwner(data.owner_id === address);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id, address]);

  const handleUpdate = async () => {
    if (!isConnected || !isOwner) return;

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          title: formData.title,
          description: formData.description,
          status: formData.status,
        })
        .eq("id", id);

      if (error) throw error;

      setProject(prev => prev ? { ...prev, ...formData } : null);
      setEditing(false);
      toast.success("Project updated successfully!");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (!project) {
    return <div className="container mx-auto p-8">Project not found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">
            {editing ? (
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-2xl font-bold"
              />
            ) : (
              project.title
            )}
          </CardTitle>
          {isOwner && (
            <Button
              variant="outline"
              onClick={() => {
                if (editing) {
                  handleUpdate();
                } else {
                  setEditing(true);
                }
              }}
            >
              {editing ? "Save Changes" : "Edit Project"}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Owner: {project.owner.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Status: {project.status}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              {editing ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-gray-600">{project.description}</p>
              )}
            </div>

            {editing && (
              <div className="space-y-2">
                <h3 className="font-semibold">Status</h3>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {!editing && project.status === "completed" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Project Completed</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetail; 