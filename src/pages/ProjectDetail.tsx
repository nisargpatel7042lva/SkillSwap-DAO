import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from('projects').select('*').eq('id', id).single().then(({ data }) => {
      setProject(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!project) return <div className="p-8 text-center">Project not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/dashboard">
        <Button className="mb-4">&larr; Back to Dashboard</Button>
      </Link>
      <Card className="sketch-border bg-white p-6 max-w-xl mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <Badge className={project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>{project.status}</Badge>
        </CardContent>
      </Card>
    </div>
  );
} 