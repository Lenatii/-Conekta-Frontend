import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { Plus, Home, User, Settings, LogOut, Wrench, Power } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const [isOnline, setIsOnline] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Toggle fundi online/offline status
  const toggleOnlineStatus = async () => {
    setIsTogglingStatus(true);
    try {
      const response = await fetch("https://conekta-complete-system.onrender.com/api/v1/fundis/toggle-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fundi_id: user?.id, // Assuming user ID is fundi ID
          is_available: !isOnline
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsOnline(data.is_available);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setIsTogglingStatus(false);
    }
  };

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

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="text-slate-400">
              Manage your properties and account
            </p>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="properties" className="data-[state=active]:bg-teal-600">
              <Home className="w-4 h-4 mr-2" />
              My Properties
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-teal-600">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="fundi" className="data-[state=active]:bg-teal-600">
              <Wrench className="w-4 h-4 mr-2" />
              My Services
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-teal-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Properties</h2>
              <Button
                onClick={() => setLocation("/dashboard/add-property")}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>

            {/* Empty State */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Home className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No properties yet
                </h3>
                <p className="text-slate-400 mb-6 text-center max-w-md">
                  Start listing your properties to reach thousands of potential tenants
                </p>
                <Button
                  onClick={() => setLocation("/dashboard/add-property")}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Property
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-slate-400">
                  View and update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Name</label>
                    <p className="text-white font-medium">{user?.name || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Email</label>
                    <p className="text-white font-medium">{user?.email || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Role</label>
                    <p className="text-white font-medium capitalize">{user?.role || "User"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Member Since</label>
                    <p className="text-white font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => setLocation("/dashboard/edit-profile")}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fundi Services Tab */}
          <TabsContent value="fundi" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Service Provider Status</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your availability and service offerings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Online/Offline Toggle */}
                <div className="flex items-center justify-between p-6 bg-slate-800 rounded-lg border-2 border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      isOnline ? "bg-green-500/20" : "bg-slate-700"
                    }`}>
                      <Power className={`w-6 h-6 ${
                        isOnline ? "text-green-500" : "text-slate-500"
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {isOnline ? "You're Online" : "You're Offline"}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {isOnline 
                          ? "Clients can see you in search results and contact you"
                          : "You won't appear in search results"}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={toggleOnlineStatus}
                    disabled={isTogglingStatus}
                    className={`px-8 py-6 text-lg font-semibold ${
                      isOnline 
                        ? "bg-red-600 hover:bg-red-700" 
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isTogglingStatus ? "Updating..." : (isOnline ? "Go Offline" : "Go Online")}
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-400">Jobs Completed</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-400">Rating</p>
                    <p className="text-2xl font-bold text-white">0.0</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-400">Response Time</p>
                    <p className="text-2xl font-bold text-white">N/A</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setLocation("/verify-form")}
                    variant="outline"
                    className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Get CONEKTA Trust Verified
                  </Button>
                  <Button
                    onClick={() => setLocation("/fundis/" + user?.id)}
                    variant="outline"
                    className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    View My Public Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-sm text-slate-400">Receive updates about your properties</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">SMS Notifications</h4>
                      <p className="text-sm text-slate-400">Get instant alerts on your phone</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Privacy Settings</h4>
                      <p className="text-sm text-slate-400">Control your data and visibility</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
