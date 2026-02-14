import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { CheckCircle, Clock, AlertCircle, MapPin, Phone } from "lucide-react";

interface FundiJob {
  id: number;
  client_name: string;
  client_phone: string;
  service_type: string;
  location: string;
  description: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  price: number;
  scheduled_date: string;
  created_at: string;
  user_confirmed?: boolean;
  rating?: number;
}

export default function FundiJobs() {
  const [, setLocation] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<FundiJob[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedJob, setSelectedJob] = useState<FundiJob | null>(null);
  const [isMarkCompleteDialogOpen, setIsMarkCompleteDialogOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Mock data - in production, fetch from backend
  useEffect(() => {
    setJobs([
      {
        id: 1,
        client_name: "Alice Johnson",
        client_phone: "+254712345678",
        service_type: "Plumbing",
        location: "Nakuru CBD",
        description: "Fix leaking kitchen tap and install new bathroom faucet",
        status: "in_progress",
        price: 2500,
        scheduled_date: "2024-02-14",
        created_at: "2024-02-12",
      },
      {
        id: 2,
        client_name: "Bob Smith",
        client_phone: "+254723456789",
        service_type: "Electrical",
        location: "Menengai",
        description: "Install new ceiling lights and fix electrical outlet",
        status: "pending",
        price: 3500,
        scheduled_date: "2024-02-16",
        created_at: "2024-02-13",
      },
      {
        id: 3,
        client_name: "Carol White",
        client_phone: "+254734567890",
        service_type: "Carpentry",
        location: "Milimani",
        description: "Build custom shelving unit for bedroom",
        status: "completed",
        price: 4000,
        scheduled_date: "2024-02-10",
        created_at: "2024-02-08",
        user_confirmed: true,
        rating: 5,
      },
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-yellow-900", text: "text-yellow-200", label: "Pending" },
      accepted: { bg: "bg-blue-900", text: "text-blue-200", label: "Accepted" },
      in_progress: { bg: "bg-blue-900", text: "text-blue-200", label: "In Progress" },
      completed: { bg: "bg-green-900", text: "text-green-200", label: "Completed" },
      cancelled: { bg: "bg-red-900", text: "text-red-200", label: "Cancelled" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const handleMarkComplete = async () => {
    if (!selectedJob) return;
    setIsSubmitting(true);

    // In production, call backend API
    console.log("Marking job complete:", {
      jobId: selectedJob.id,
      notes: completionNotes,
    });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsMarkCompleteDialogOpen(false);
      setCompletionNotes("");
      // Update job in list
      setJobs(jobs.map(j =>
        j.id === selectedJob.id
          ? { ...j, status: "completed" }
          : j
      ));
    }, 1000);
  };

  const pendingJobs = jobs.filter(j => j.status === "pending");
  const activeJobs = jobs.filter(j => j.status === "in_progress");
  const completedJobs = jobs.filter(j => j.status === "completed");

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Jobs</h1>
          <p className="text-slate-400">Manage your service requests and track earnings</p>
        </div>

        {/* Jobs Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="pending" className="data-[state=active]:bg-teal-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              Pending ({pendingJobs.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-teal-600">
              <Clock className="w-4 h-4 mr-2" />
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-teal-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed ({completedJobs.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Jobs Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingJobs.length === 0 ? (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-12 h-12 text-slate-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No pending jobs</h3>
                  <p className="text-slate-400">New job requests will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pendingJobs.map(job => (
                <Card key={job.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(job.status)}
                            <h3 className="text-lg font-semibold text-white">{job.service_type}</h3>
                          </div>
                          <p className="text-slate-400 mb-3">{job.description}</p>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone className="w-4 h-4" />
                          {job.client_phone}
                        </div>
                        <div>
                          <span className="text-slate-500">Client</span>
                          <p className="text-white font-medium">{job.client_name}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Price</span>
                          <p className="text-white font-medium">KES {job.price.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1 border-slate-700">
                          Decline
                        </Button>
                        <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                          Accept Job
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Active Jobs Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeJobs.length === 0 ? (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="w-12 h-12 text-slate-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No active jobs</h3>
                  <p className="text-slate-400">Accept a pending job to get started</p>
                </CardContent>
              </Card>
            ) : (
              activeJobs.map(job => (
                <Card key={job.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(job.status)}
                            <h3 className="text-lg font-semibold text-white">{job.service_type}</h3>
                          </div>
                          <p className="text-slate-400 mb-3">{job.description}</p>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${job.client_phone}`} className="hover:text-teal-400">
                            {job.client_phone}
                          </a>
                        </div>
                        <div>
                          <span className="text-slate-500">Client</span>
                          <p className="text-white font-medium">{job.client_name}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Price</span>
                          <p className="text-white font-medium">KES {job.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Scheduled</span>
                          <p className="text-white font-medium">{new Date(job.scheduled_date).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <Dialog open={isMarkCompleteDialogOpen} onOpenChange={setIsMarkCompleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedJob(job)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Complete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800">
                          <DialogHeader>
                            <DialogTitle className="text-white">Mark Job as Complete</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Confirm that you've completed the work
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-slate-800 p-4 rounded-lg">
                              <p className="text-white font-medium mb-2">{job.service_type}</p>
                              <p className="text-slate-400 text-sm mb-2">{job.description}</p>
                              <p className="text-slate-400 text-sm">
                                <span className="font-medium">Client:</span> {job.client_name}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <label className="text-white font-medium">Work Notes (Optional)</label>
                              <textarea
                                value={completionNotes}
                                onChange={(e) => setCompletionNotes(e.target.value)}
                                placeholder="Describe what was completed..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                rows={4}
                              />
                            </div>

                            <div className="flex gap-3">
                              <Button
                                onClick={() => setIsMarkCompleteDialogOpen(false)}
                                variant="outline"
                                className="flex-1 border-slate-700"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleMarkComplete}
                                disabled={isSubmitting}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                {isSubmitting ? "Submitting..." : "Confirm Complete"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Completed Jobs Tab */}
          <TabsContent value="completed" className="space-y-4">
            {completedJobs.length === 0 ? (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="w-12 h-12 text-slate-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No completed jobs</h3>
                  <p className="text-slate-400">Completed jobs will appear here</p>
                </CardContent>
              </Card>
            ) : (
              completedJobs.map(job => (
                <Card key={job.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <h3 className="text-lg font-semibold text-white">{job.service_type}</h3>
                        </div>
                        <p className="text-slate-400 mb-3">{job.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Client</span>
                            <p className="text-white font-medium">{job.client_name}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Earned</span>
                            <p className="text-green-400 font-medium">KES {job.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {job.user_confirmed && (
                          <div className="mb-3">
                            <p className="text-slate-400 text-sm mb-1">Client Rating</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < (job.rating || 0) ? "text-yellow-400" : "text-slate-600"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-slate-400 text-sm">Completed</p>
                        <p className="text-white font-medium">{new Date(job.scheduled_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
