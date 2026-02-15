import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { CheckCircle, Clock, AlertCircle, Star, MessageSquare, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Job {
  id: number;
  title: string;
  fundi_name: string;
  fundi_image?: string;
  service_type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  price: number;
  scheduled_date: string;
  created_at: string;
  completion_status?: {
    user_confirmed?: boolean;
    rating_submitted?: boolean;
    rating?: number;
  };
}

export default function Jobs() {
  const [, setLocation] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

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
        title: "Plumbing Repair",
        fundi_name: "John Kariuki",
        service_type: "Plumbing",
        status: "completed",
        price: 2500,
        scheduled_date: "2024-02-10",
        created_at: "2024-02-08",
        completion_status: {
          user_confirmed: false,
          rating_submitted: false,
        },
      },
      {
        id: 2,
        title: "Electrical Installation",
        fundi_name: "Peter Mwangi",
        service_type: "Electrical",
        status: "in_progress",
        price: 5000,
        scheduled_date: "2024-02-15",
        created_at: "2024-02-12",
        completion_status: {
          user_confirmed: false,
          rating_submitted: false,
        },
      },
      {
        id: 3,
        title: "Carpentry Work",
        fundi_name: "David Kipchoge",
        service_type: "Carpentry",
        status: "completed",
        price: 3500,
        scheduled_date: "2024-02-05",
        created_at: "2024-02-01",
        completion_status: {
          user_confirmed: true,
          rating_submitted: true,
          rating: 5,
        },
      },
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: "bg-slate-700", text: "text-slate-200", label: "Pending" },
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

  const handleConfirmCompletion = async () => {
    if (!selectedJob) return;
    try {
      await api.confirmJobCompletion(selectedJob.id, true);
      setJobs(jobs.map(j => 
        j.id === selectedJob.id 
          ? { ...j, completion_status: { ...j.completion_status, user_confirmed: true } }
          : j
      ));
      setIsConfirmDialogOpen(false);
    } catch (error) {
      console.error("Error confirming completion:", error);
      alert("Failed to confirm completion");
    }
  };

  const handleSubmitRating = async () => {
    if (!selectedJob) return;
    setIsSubmittingRating(true);
    
    try {
      await api.submitJobRating(selectedJob.id, rating, ratingComment);
      setJobs(jobs.map(j => 
        j.id === selectedJob.id 
          ? { ...j, completion_status: { ...j.completion_status, rating_submitted: true, rating } }
          : j
      ));
      setIsRatingDialogOpen(false);
      setRating(5);
      setRatingComment("");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const activeJobs = jobs.filter(j => j.status === "in_progress" || (j.status === "completed" && !j.completion_status?.rating_submitted));
  const completedJobs = jobs.filter(j => j.status === "completed" && j.completion_status?.rating_submitted);
  const cancelledJobs = jobs.filter(j => j.status === "cancelled");

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Jobs</h1>
          <p className="text-slate-400">Track your service requests and rate fundis</p>
        </div>

        {/* Jobs Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="active" className="data-[state=active]:bg-teal-600">
              <Clock className="w-4 h-4 mr-2" />
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-teal-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed ({completedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-teal-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              Cancelled ({cancelledJobs.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Jobs Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeJobs.length === 0 ? (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="w-12 h-12 text-slate-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No active jobs</h3>
                  <p className="text-slate-400">You don't have any active service requests</p>
                </CardContent>
              </Card>
            ) : (
              activeJobs.map(job => (
                <Card key={job.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(job.status)}
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                        </div>
                        <p className="text-slate-400 mb-3">
                          <span className="font-medium">Fundi:</span> {job.fundi_name}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Service Type</span>
                            <p className="text-white font-medium">{job.service_type}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Price</span>
                            <p className="text-white font-medium">KES {job.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Scheduled</span>
                            <p className="text-white font-medium">{new Date(job.scheduled_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Status</span>
                            {getStatusBadge(job.status)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        {job.status === "completed" && !job.completion_status?.user_confirmed && (
                          <>
                            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setSelectedJob(job)}
                                  className="bg-teal-600 hover:bg-teal-700 w-full"
                                >
                                  Confirm Completion
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-slate-900 border-slate-800">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Confirm Job Completion</DialogTitle>
                                  <DialogDescription className="text-slate-400">
                                    Is the work completed to your satisfaction?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="bg-slate-800 p-4 rounded-lg">
                                    <p className="text-white font-medium mb-2">{job.title}</p>
                                    <p className="text-slate-400 text-sm">by {job.fundi_name}</p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Button
                                      onClick={() => setIsConfirmDialogOpen(false)}
                                      variant="outline"
                                      className="flex-1 border-slate-700"
                                    >
                                      Dispute
                                    </Button>
                                    <Button
                                      onClick={handleConfirmCompletion}
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      Confirm
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}

                        {job.status === "completed" && job.completion_status?.user_confirmed && !job.completion_status?.rating_submitted && (
                          <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => setSelectedJob(job)}
                                className="bg-yellow-600 hover:bg-yellow-700 w-full"
                              >
                                <Star className="w-4 h-4 mr-2" />
                                Rate Fundi
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-slate-800">
                              <DialogHeader>
                                <DialogTitle className="text-white">Rate Your Experience</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  How was your experience with {job.fundi_name}?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="bg-slate-800 p-4 rounded-lg">
                                  <p className="text-white font-medium mb-1">{job.title}</p>
                                  <p className="text-slate-400 text-sm">{job.fundi_name}</p>
                                </div>

                                {/* Star Rating */}
                                <div className="space-y-3">
                                  <label className="text-white font-medium">Rating</label>
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110"
                                      >
                                        <Star
                                          className={`w-8 h-8 ${
                                            star <= rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-slate-600"
                                          }`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                  <p className="text-sm text-slate-400">
                                    {rating === 5 && "Excellent!"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 3 && "Good"}
                                    {rating === 2 && "Fair"}
                                    {rating === 1 && "Poor"}
                                  </p>
                                </div>

                                {/* Comment */}
                                <div className="space-y-2">
                                  <label className="text-white font-medium">Comments (Optional)</label>
                                  <textarea
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    placeholder="Share your feedback..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                    rows={4}
                                  />
                                </div>

                                <Button
                                  onClick={handleSubmitRating}
                                  disabled={isSubmittingRating}
                                  className="w-full bg-teal-600 hover:bg-teal-700"
                                >
                                  {isSubmittingRating ? "Submitting..." : "Submit Rating"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {job.status === "in_progress" && (
                          <Button variant="outline" className="border-slate-700 w-full" disabled>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            In Progress
                          </Button>
                        )}
                      </div>
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
                  <p className="text-slate-400">Jobs you've rated will appear here</p>
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
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                        </div>
                        <p className="text-slate-400 mb-3">
                          <span className="font-medium">Fundi:</span> {job.fundi_name}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (job.completion_status?.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white font-medium">{job.completion_status?.rating}/5</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-sm">Completed</p>
                        <p className="text-white font-medium">{new Date(job.scheduled_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Cancelled Jobs Tab */}
          <TabsContent value="cancelled" className="space-y-4">
            {cancelledJobs.length === 0 ? (
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-12 h-12 text-slate-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No cancelled jobs</h3>
                  <p className="text-slate-400">Cancelled jobs will appear here</p>
                </CardContent>
              </Card>
            ) : (
              cancelledJobs.map(job => (
                <Card key={job.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                        <p className="text-slate-400">by {job.fundi_name}</p>
                      </div>
                      {getStatusBadge(job.status)}
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
