import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Home, Wrench, Bed } from "lucide-react";
import { trpc } from "@/lib/trpc";

type UserType = "landlord" | "tenant" | "service_provider";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"type" | "details" | "otp">("type");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userTypes = [
    {
      type: "landlord" as UserType,
      title: "Landlord",
      description: "List and manage your properties",
      icon: Home,
    },
    {
      type: "tenant" as UserType,
      title: "Tenant",
      description: "Find and rent properties",
      icon: Bed,
    },
    {
      type: "service_provider" as UserType,
      title: "Service Provider",
      description: "Offer your services (Fundi)",
      icon: Wrench,
    },
  ];

  const handleSelectType = (type: UserType) => {
    setUserType(type);
    setStep("details");
  };

  const sendOTPMutation = trpc.auth.sendOTP.useMutation();
  
  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await sendOTPMutation.mutateAsync({ phone: formData.phone });
      
      if (result.success) {
        toast.success("OTP sent to your phone!");
        setStep("otp");
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTPMutation = trpc.auth.verifyOTP.useMutation();
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await verifyOTPMutation.mutateAsync({ phone: formData.phone, otp });
      
      if (result.success) {
        toast.success("Account created successfully!");
        // Refresh auth state
        window.location.href = "/dashboard";
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl bg-slate-900 border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-slate-400">
              {step === "type" && "Choose your account type"}
              {step === "details" && "Enter your details"}
              {step === "otp" && "Verify your phone number"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === "type" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userTypes.map(({ type, title, description, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => handleSelectType(type)}
                    className="p-6 rounded-lg border-2 border-slate-700 hover:border-teal-500 bg-slate-800 hover:bg-slate-750 transition-all group"
                  >
                    <Icon className="w-12 h-12 mx-auto mb-4 text-teal-400 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                    <p className="text-sm text-slate-400">{description}</p>
                  </button>
                ))}
              </div>
            )}

            {step === "details" && (
              <form onSubmit={handleSubmitDetails} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 712 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-slate-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{" "}
                    <a href="/terms" target="_blank" className="text-teal-400 hover:text-teal-300">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" className="text-teal-400 hover:text-teal-300">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("type")}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Continue"}
                  </Button>
                </div>

                <div className="text-center text-sm text-slate-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/login")}
                    className="text-teal-400 hover:text-teal-300 font-medium"
                  >
                    Login
                  </button>
                </div>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="bg-slate-800 border-slate-700 text-white text-center text-2xl tracking-widest"
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-400 text-center">
                    Sent to {formData.phone}
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
                </Button>
                
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="text-sm text-slate-400 hover:text-slate-300"
                  >
                    ← Back to details
                  </button>
                  
                  <div className="text-sm text-slate-400">
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      onClick={handleSubmitDetails}
                      className="text-teal-400 hover:text-teal-300 font-medium"
                      disabled={isLoading}
                    >
                      Resend
                    </button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
