import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Connect to backend API
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Call backend API to send OTP
      // await trpc.auth.sendOTP.mutate({ phone });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("OTP sent to your phone!");
      setStep("otp");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Call backend API to verify OTP
      // const result = await trpc.auth.verifyOTP.mutate({ phone, otp });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Login successful!");
      setLocation("/dashboard");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-slate-400">
              {step === "phone" 
                ? "Enter your phone number to receive an OTP" 
                : "Enter the 6-digit code sent to your phone"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === "phone" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-400">
                    Enter your phone number in the format: +254XXXXXXXXX
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
                
                <div className="text-center text-sm text-slate-400">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/signup")}
                    className="text-teal-400 hover:text-teal-300 font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            ) : (
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
                    Sent to {phone}
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>
                
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="text-sm text-slate-400 hover:text-slate-300"
                  >
                    ← Back to phone number
                  </button>
                  
                  <div className="text-sm text-slate-400">
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      onClick={handleSendOTP}
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
