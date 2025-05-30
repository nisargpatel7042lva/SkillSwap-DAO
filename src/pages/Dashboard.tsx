import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Clock, Wallet, Calendar, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type StatsType = {
  totalEarnings: number;
  activeServices: number;
  totalStudents: number;
  avgRating: number;
};

type Earning = { date: string; amount: number; service: string };
type Service = { title: string; students: number; nextSession: string; status: string; earnings: string };
type Session = { title: string; time: string; duration: string; students: number; type: string };
type Project = { id: number; title: string; description: string; status: string; due_date?: string; user_id?: string };

const USER_ID = "demo-user-id";

const Dashboard = () => {
  const [stats, setStats] = useState<StatsType>({
    totalEarnings: 0,
    activeServices: 0,
    totalStudents: 0,
    avgRating: 0
  });
  const [recentEarnings, setRecentEarnings] = useState<Earning[]>([]);
  const [activeServices, setActiveServices] = useState<Service[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      // Example: fetch total earnings, active services, total students, avg rating
      // You may need to adjust queries based on your schema
      const { data: earningsData } = await supabase.rpc('get_total_earnings');
      const { data: activeServicesData } = await supabase.from('skills').select('*').eq('status', 'active');
      const { data: studentsData } = await supabase.from('users').select('id');
      const { data: ratingsData } = await supabase.from('ratings').select('rating');
      setStats({
        totalEarnings: earningsData || 0,
        activeServices: activeServicesData ? activeServicesData.length : 0,
        totalStudents: studentsData ? studentsData.length : 0,
        avgRating: ratingsData && ratingsData.length > 0 ? parseFloat((ratingsData.reduce((a, b) => a + b.rating, 0) / ratingsData.length).toFixed(1)) : 0
      });
    };
    // Fetch recent earnings
    const fetchRecentEarnings = async () => {
      const { data } = await supabase.from('earnings').select('*').order('date', { ascending: false }).limit(5);
      setRecentEarnings(data || []);
    };
    // Fetch active services
    const fetchActiveServices = async () => {
      const { data } = await supabase.from('skills').select('*').eq('status', 'active');
      setActiveServices(data || []);
    };
    // Fetch upcoming sessions
    const fetchUpcomingSessions = async () => {
      const { data } = await supabase.from('sessions').select('*').order('time', { ascending: true }).limit(5);
      setUpcomingSessions(data || []);
    };
    // Fetch projects
    const fetchProjects = async () => {
      setLoadingProjects(true);
      const { data, error } = await supabase.from('projects').select('*').eq('user_id', USER_ID);
      setProjects(data || []);
      setLoadingProjects(false);
      if (error) toast.error('Failed to fetch projects: ' + error.message);
    };
    fetchStats();
    fetchRecentEarnings();
    fetchActiveServices();
    fetchUpcomingSessions();
    fetchProjects();

    // Real-time listeners
    const statsChannel = supabase.channel('realtime:stats').on('postgres_changes', { event: '*', schema: 'public', table: 'earnings' }, fetchStats).subscribe();
    const earningsChannel = supabase.channel('realtime:earnings').on('postgres_changes', { event: '*', schema: 'public', table: 'earnings' }, fetchRecentEarnings).subscribe();
    const servicesChannel = supabase.channel('realtime:services').on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, fetchActiveServices).subscribe();
    const sessionsChannel = supabase.channel('realtime:sessions').on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, fetchUpcomingSessions).subscribe();
    const projectsChannel = supabase.channel('realtime:projects').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchProjects).subscribe();
    return () => {
      supabase.removeChannel(statsChannel);
      supabase.removeChannel(earningsChannel);
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  // My Projects state
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", status: "In Escrow" });

  // Transaction modal state
  const [showTransactions, setShowTransactions] = useState(false);
  // Manage service modal state
  const [manageService, setManageService] = useState<{ open: boolean; service?: Service }>({ open: false });
  // Join session modal state
  const [joinSession, setJoinSession] = useState<{ open: boolean; session?: Session }>({ open: false });
  // Edit project modal state
  const [editProject, setEditProject] = useState<{ open: boolean; idx?: number }>({ open: false });

  // Delete confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; idx?: number }>({ open: false });

  const handleAddProject = async () => {
    if (!newProject.title.trim()) {
      toast.error('Project title is required.');
      return;
    }
    const toInsert = { ...newProject, user_id: USER_ID };
    const { data, error } = await supabase.from('projects').insert([toInsert]);
    if (!error) {
      setNewProject({ title: "", description: "", status: "In Escrow", due_date: "" });
      setShowModal(false);
      toast.success('Project added!');
    } else {
      toast.error('Failed to add project: ' + (error?.message || error));
    }
  };

  const handleDeleteProject = async (idx: number) => {
    const project = projects[idx];
    const { error } = await supabase.from('projects').delete().eq('id', project.id);
    if (error) {
      toast.error('Failed to delete project: ' + error.message);
    } else {
      toast.success('Project deleted!');
    }
  };

  const handleEditProject = async (idx: number, updated: Project) => {
    const project = projects[idx];
    const { error } = await supabase.from('projects').update(updated).eq('id', project.id);
    if (!error) {
      setEditProject({ open: false });
      toast.success('Project updated!');
    } else {
      alert('Failed to update project: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-xl text-gray-600">Welcome back! Here's your teaching overview.</p>
      </div>

      {/* My Projects Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
          <Button onClick={() => setShowModal(true)} className="rounded-xl border-2 border-dashed border-gray-400 bg-white text-gray-900">+ Add Project</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <Card key={project.id} className="sketch-border bg-white p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{project.description}</p>
                <Badge className={project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>{project.status}</Badge>
                <div className="mt-4 flex gap-2">
                  <Link to={`/project/${project.id}`} className="block w-full">
                    <Button className="w-full rounded-xl border-2 border-dashed border-blue-400 bg-white text-blue-700">View Details</Button>
                  </Link>
                  <Button onClick={() => setEditProject({ open: true, idx })} className="rounded-xl border-2 border-dashed border-gray-400 bg-white text-gray-900">Edit</Button>
                  <Button onClick={() => setDeleteConfirm({ open: true, idx })} className="rounded-xl border-2 border-dashed border-red-400 bg-white text-red-700">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription className="sr-only">Fill out the form to add a new project to your dashboard.</DialogDescription>
            <input
              className="w-full mb-2 p-2 border border-dashed border-gray-300 rounded"
              placeholder="Project Title"
              value={newProject.title}
              onChange={e => setNewProject({ ...newProject, title: e.target.value })}
            />
            <textarea
              className="w-full mb-2 p-2 border border-dashed border-gray-300 rounded"
              placeholder="Project Description"
              value={newProject.description}
              onChange={e => setNewProject({ ...newProject, description: e.target.value })}
            />
            <select
              className="w-full mb-4 p-2 border border-dashed border-gray-300 rounded"
              value={newProject.status}
              onChange={e => setNewProject({ ...newProject, status: e.target.value })}
            >
              <option value="In Escrow">In Escrow</option>
              <option value="Completed">Completed</option>
            </select>
            <Button onClick={handleAddProject} className="w-full rounded-xl border-2 border-dashed border-blue-400">Add Project</Button>
          </DialogContent>
        </Dialog>
        <Dialog open={editProject.open} onOpenChange={open => setEditProject({ open })}>
          <DialogContent>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription className="sr-only">Edit the details of your project.</DialogDescription>
            {editProject.idx !== undefined && (
              <EditProjectForm 
                project={projects[editProject.idx]} 
                onSave={updated => handleEditProject(editProject.idx!, updated)} 
                onCancel={() => setEditProject({ open: false })} 
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="sketch-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-primary">{stats.totalEarnings}</p>
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
                <p className="text-3xl font-bold text-primary">{stats.activeServices}</p>
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
                <p className="text-3xl font-bold text-primary">{stats.totalStudents}</p>
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
                <p className="text-3xl font-bold text-primary">{stats.avgRating}</p>
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
            {recentEarnings.map((earning, index) => (
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
            <Button className="w-full rounded-xl border-2 border-dashed border-gray-400 bg-white text-gray-900 mt-4" onClick={() => setShowTransactions(true)}>
              View All Transactions
            </Button>
            <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
              <DialogContent>
                <h3 className="text-xl font-bold mb-4">All Transactions</h3>
                <ul className="space-y-2">
                  {recentEarnings.map((earning, idx) => (
                    <li key={idx} className="flex justify-between border-b pb-2">
                      <span>{earning.service} ({earning.date})</span>
                      <span className="font-bold text-primary">+{earning.amount} SKILL</span>
                    </li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
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
              {activeServices.map((service, index) => (
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
                    <Button className="rounded-xl border-2 border-dashed border-gray-400 bg-white text-gray-900" onClick={() => setManageService({ open: true, service })}>Manage</Button>
                    <Link to={`/service/demo-active-${index + 1}`} className="block w-full">
                      <Button className="rounded-xl border-2 border-dashed border-blue-400 bg-white text-blue-700 w-full">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Dialog open={manageService.open} onOpenChange={open => setManageService({ open })}>
              <DialogContent>
                <h3 className="text-xl font-bold mb-4">Manage Service</h3>
                {manageService.service && (
                  <>
                    <p><strong>Title:</strong> {manageService.service.title}</p>
                    <p><strong>Students:</strong> {manageService.service.students}</p>
                    <p><strong>Next Session:</strong> {manageService.service.nextSession}</p>
                    <p><strong>Status:</strong> {manageService.service.status}</p>
                    <p><strong>Earnings:</strong> {manageService.service.earnings}</p>
                    <Button className="mt-4 w-full bg-green-500 text-white">Mark as Completed</Button>
                  </>
                )}
              </DialogContent>
            </Dialog>
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
            {upcomingSessions.map((session, index) => (
              <div key={index} className="p-4 bg-sketch-gray rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{session.title}</h3>
                    <p className="text-sm text-gray-600">{session.time}</p>
                  </div>
                  <Badge className={`text-xs ${session.type === 'Group Session' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {session.type}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p>Duration: {session.duration}</p>
                  <p>Students: {session.students}</p>
                </div>
                
                <Button className="w-full rounded-xl bg-blue-500 text-white mt-2" onClick={() => setJoinSession({ open: true, session })}>
                  Join Session
                </Button>
              </div>
            ))}
            <Dialog open={joinSession.open} onOpenChange={open => setJoinSession({ open })}>
              <DialogContent>
                <h3 className="text-xl font-bold mb-4">Join Session</h3>
                {joinSession.session && (
                  <>
                    <p><strong>Title:</strong> {joinSession.session.title}</p>
                    <p><strong>Time:</strong> {joinSession.session.time}</p>
                    <p><strong>Duration:</strong> {joinSession.session.duration}</p>
                    <p><strong>Type:</strong> {joinSession.session.type}</p>
                    <Button className="mt-4 w-full bg-green-500 text-white">Confirm Join</Button>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onOpenChange={open => setDeleteConfirm({ open })}>
        <DialogContent>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>Are you sure you want to delete this project? This action cannot be undone.</DialogDescription>
          <div className="flex gap-2 mt-4">
            <Button className="w-full rounded-xl border-2 border-dashed border-red-400" onClick={() => { handleDeleteProject(deleteConfirm.idx!); setDeleteConfirm({ open: false }); }}>Delete</Button>
            <Button className="w-full rounded-xl border-2 border-dashed border-gray-400" onClick={() => setDeleteConfirm({ open: false })}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add EditProjectForm component
function EditProjectForm({ project, onSave, onCancel }) {
  const [form, setForm] = useState({ ...project });
  return (
    <>
      <input
        className="w-full mb-2 p-2 border border-dashed border-gray-300 rounded"
        placeholder="Project Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="w-full mb-2 p-2 border border-dashed border-gray-300 rounded"
        placeholder="Project Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <select
        className="w-full mb-4 p-2 border border-dashed border-gray-300 rounded"
        value={form.status}
        onChange={e => setForm({ ...form, status: e.target.value })}
      >
        <option value="In Escrow">In Escrow</option>
        <option value="Completed">Completed</option>
      </select>
      <div className="flex gap-2">
        <Button className="w-full rounded-xl border-2 border-dashed border-blue-400" onClick={() => onSave(form)}>Save</Button>
        <Button className="w-full rounded-xl border-2 border-dashed border-gray-400" onClick={onCancel}>Cancel</Button>
      </div>
    </>
  );
}

export default Dashboard;
