import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";

// Backend API URL
const API_BASE_URL = "https://conekta-complete-system.onrender.com";

export default function VerifyForm() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    idType: "",
    idNumber: "",
    location: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    userType: "tenant", // tenant, landlord, or fundi
    tcAccepted: false,
    privacyAccepted: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!formData.idType) {
      setError("Please select an ID type");
      return false;
    }
    if (!formData.idNumber.trim()) {
      setError("Please enter your ID number");
      return false;
    }
    if (!formData.location.trim()) {
      setError("Please enter your location");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.tcAccepted) {
      setError("You must accept the Terms & Conditions");
      return false;
    }
    if (!formData.privacyAccepted) {
      setError("You must accept the Privacy Policy");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Call the Python backend REST API directly
      const response = await fetch(`${API_BASE_URL}/api/verification/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          id_type: formData.idType,
          id_number: formData.idNumber,
          location: formData.location,
          emergency_contact_name: formData.emergencyContactName || null,
          emergency_contact_phone: formData.emergencyContactPhone || null,
          user_type: formData.userType,
          tc_accepted: formData.tcAccepted,
          privacy_accepted: formData.privacyAccepted,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStep(3); // Success step
      } else {
        setError(result.message || result.detail || "Verification submission failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              CONEKTA Trust Verification
            </h1>
            <p className="text-slate-400">
              Get verified to build trust and credibility on the platform
            </p>
          </div>

          {/* Progress indicator */}
          {step < 3 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className={`h-2 w-24 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-slate-700'}`} />
              <div className={`h-2 w-24 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-700'}`} />
            </div>
          )}

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Basic details for CONEKTA Trust verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Mwangi"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idType" className="text-white">ID Type *</Label>
                  <Select value={formData.idType} onValueChange={(value) => handleInputChange("idType", value)}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_id">National ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber" className="text-white">ID Number *</Label>
                  <Input
                    id="idNumber"
                    placeholder="12345678"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Location/City *</Label>
                  <Input
                    id="location"
                    placeholder="Nakuru, Nairobi, etc."
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-sm text-slate-400 mb-4">
                    <strong className="text-white">Emergency Contact</strong> (Optional - for your safety)
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName" className="text-white">Emergency Contact Name</Label>
                      <Input
                        id="emergencyName"
                        placeholder="Jane Doe (optional)"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone" className="text-white">Emergency Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        placeholder="254712345678 (optional)"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                        className="bg-slate-900/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setLocation("/trust")}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleNext}
                    style={{ background: '#00D9A5' }}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Terms & Conditions */}
          {step === 2 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Terms & Conditions</CardTitle>
                <CardDescription className="text-slate-400">
                  Please review and accept our terms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                  <h3 className="font-semibold text-white">Key Points:</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• CONEKTA is a PLATFORM ONLY (we connect users, don't provide services)</li>
                    <li>• We verify IDs but DON'T GUARANTEE service quality</li>
                    <li>• KES 150 fee is for contact reveal ONLY (not a service guarantee)</li>
                    <li>• NO REFUNDS once contact is revealed</li>
                    <li>• You use services at YOUR OWN RISK</li>
                    <li>• Disputes between users are NOT our responsibility</li>
                  </ul>
                  <a 
                    href="https://www.conekta.co.ke/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Read full Terms & Conditions →
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="tc"
                    checked={formData.tcAccepted}
                    onCheckedChange={(checked) => handleInputChange("tcAccepted", checked as boolean)}
                  />
                  <Label htmlFor="tc" className="text-white cursor-pointer">
                    I have read and accept the Terms & Conditions *
                  </Label>
                </div>

                <div className="space-y-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                  <h3 className="font-semibold text-white">Privacy Policy:</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• We comply with Kenya Data Protection Act 2019</li>
                    <li>• We collect: Name, phone, ID for verification</li>
                    <li>• We DON'T sell your data or share without consent</li>
                    <li>• We DON'T store payment details</li>
                  </ul>
                  <a 
                    href="https://www.conekta.co.ke/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Read full Privacy Policy →
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="privacy"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) => handleInputChange("privacyAccepted", checked as boolean)}
                  />
                  <Label htmlFor="privacy" className="text-white cursor-pointer">
                    I have read and accept the Privacy Policy *
                  </Label>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{ background: '#00D9A5' }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Verification"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Verification Submitted!
                </h2>
                <p className="text-slate-400 mb-6">
                  Thank you for submitting your CONEKTA Trust verification. We'll review your application within 24-48 hours.
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  You'll receive a notification once your verification is approved.
                </p>
                <Button
                  onClick={() => setLocation("/")}
                  style={{ background: '#00D9A5' }}
                >
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
