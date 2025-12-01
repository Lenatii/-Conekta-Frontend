import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { Plus, Home, User, Settings, LogOut } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");

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
