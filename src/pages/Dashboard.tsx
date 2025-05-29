import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Clock, Wallet, Calendar, ArrowUp } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

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

  // My Projects state
  const [projects, setProjects] = useState([
    { title: "Sample Project 1", description: "Booked React Bootcamp", status: "In Escrow" },
    { title: "Sample Project 2", description: "Booked Design Session", status: "Completed" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", status: "In Escrow" });

  // Transaction modal state
  const [showTransactions, setShowTransactions] = useState(false);
  // Manage service modal state
  const [manageService, setManageService] = useState<{ open: boolean; service?: any }>({ open: false });
  // Join session modal state
  const [joinSession, setJoinSession] = useState<{ open: boolean; session?: any }>({ open: false });
  // Edit project modal state
  const [editProject, setEditProject] = useState<{ open: boolean; idx?: number }>({ open: false });

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) return;
    setProjects([...projects, newProject]);
    setNewProject({ title: "", description: "", status: "In Escrow" });
    setShowModal(false);
  };

  const handleDeleteProject = (idx: number) => {
    setProjects(projects.filter((_, i) => i !== idx));
  };
  const handleEditProject = (idx: number, updated: any) => {
    setProjects(projects.map((p, i) => (i === idx ? updated : p)));
    setEditProject({ open: false });
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
            <Card key={idx} className="sketch-border bg-white p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{project.description}</p>
                <Badge className={project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>{project.status}</Badge>
                <div className="mt-4 flex gap-2">
                  <Link to={`/service/demo-${idx + 1}`} className="block w-full">
                    <Button className="w-full rounded-xl border-2 border-dashed border-blue-400 bg-white text-blue-700">View Details</Button>
                  </Link>
                  <Button onClick={() => setEditProject({ open: true, idx })} className="rounded-xl border-2 border-dashed border-gray-400 bg-white text-gray-900">Edit</Button>
                  <Button onClick={() => handleDeleteProject(idx)} className="rounded-xl border-2 border-dashed border-red-400 bg-white text-red-700">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <h3 className="text-xl font-bold mb-4">Add New Project</h3>
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
            <h3 className="text-xl font-bold mb-4">Edit Project</h3>
            {editProject.idx !== undefined && (
              <>
                <input
                  className="w-full mb-2 p-2 border border-dashed border-gray-300 rounded"
                  placeholder="Project Title"
                  value={projects[editProject.idx].title}
                  onChange={e => handleEditProject(editProject.idx!, { ...projects[editProject.idx!], title: e.target.value })}
                />
                <textarea
                  className="w-full mb-2 p-2 border border-dashed border-gray-300 rounded"
                  placeholder="Project Description"
                  value={projects[editProject.idx].description}
                  onChange={e => handleEditProject(editProject.idx!, { ...projects[editProject.idx!], description: e.target.value })}
                />
                <select
                  className="w-full mb-4 p-2 border border-dashed border-gray-300 rounded"
                  value={projects[editProject.idx].status}
                  onChange={e => handleEditProject(editProject.idx!, { ...projects[editProject.idx!], status: e.target.value })}
                >
                  <option value="In Escrow">In Escrow</option>
                  <option value="Completed">Completed</option>
                </select>
              </>
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
            <Button className="w-full rounded-xl border-2 border-dashed border-gray-400 bg-white text-gray-900 mt-4" onClick={() => setShowTransactions(true)}>
              View All Transactions
            </Button>
            <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
              <DialogContent>
                <h3 className="text-xl font-bold mb-4">All Transactions</h3>
                <ul className="space-y-2">
                  {dashboardData.recentEarnings.map((earning, idx) => (
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
            {dashboardData.upcomingSessions.map((session, index) => (
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
    </div>
  );
};

export default Dashboard;
