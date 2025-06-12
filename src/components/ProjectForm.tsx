
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProjectFormProps {
  onProjectCreated: () => void;
  onCancel: () => void;
}

export const ProjectForm = ({ onProjectCreated, onCancel }: ProjectFormProps) => {
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    due_date: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    if (!formData.title.trim() || !formData.description.trim() || !formData.status) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("projects")
        .insert({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          due_date: formData.due_date || null,
          user_id: address
        });

      if (error) {
        toast.error("Failed to create project");
        return;
      }

      toast.success("Project created successfully!");
      onProjectCreated();
      setFormData({ title: "", description: "", status: "", due_date: "" });
    } catch (error) {
      toast.error("An error occurred while creating the project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-yellow-50">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Project title"
              className="border-2 border-dashed border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Project description"
              rows={3}
              className="border-2 border-dashed border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="border-2 border-dashed border-gray-300">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <Input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="border-2 border-dashed border-gray-300"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-2 border-dashed border-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
