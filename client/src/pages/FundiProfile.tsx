import { useParams, Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { 
  Star, 
  Shield, 
  Phone, 
  MapPin, 
  Briefcase, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  Lock,
  Wallet
} from "lucide-react";

export default function FundiProfile() {
  const { id } = useParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [contactRevealed, setContactRevealed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // Direct API call to backend (bypass Manus tRPC)
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Mock data - will connect to backend later
  const mockFundis: Record<string, any> = {
    "1": {
      id: 1,
      name: "John Mwangi",
      serviceType: "plumber",
      description: "Expert plumber with 10+ years experience. Specializing in installations, repairs, and maintenance.",
      longDescription: "I am a professional plumber with over 10 years of experience in residential and commercial plumbing. I specialize in pipe installations, leak repairs, water heater installations, and general plumbing maintenance. I take pride in delivering quality work and ensuring customer satisfaction.",
      location: "Nakuru CBD",
      city: "Nakuru",
      hourlyRate: 800,
      rating: 5,
      totalJobs: 127,
      isVerified: true,
      phone: "+254 712 345 678",
      avatar: "https://ui-avatars.com/api/?name=Fundi&background=14b8a6&color=fff&size=200",
      skills: ["Pipe Installation", "Leak Repairs", "Water Heaters", "Drain Cleaning", "Bathroom Fixtures"],
      availability: "Monday - Saturday, 8AM - 6PM",
      responseTime: "Within 2 hours",
      completionRate: 98,
    },
    "2": {
      id: 2,
      name: "Peter Ochieng",
      serviceType: "electrician",
      description: "Licensed electrician. Wiring, installations, and electrical repairs for homes and offices.",
      longDescription: "Licensed and certified electrician with 8 years of experience. I handle all types of electrical work including wiring, installations, repairs, and safety inspections. Safety and quality are my top priorities.",
      location: "Milimani",
      city: "Nakuru",
      hourlyRate: 1000,
      rating: 5,
      totalJobs: 89,
      isVerified: true,
      phone: "+254 723 456 789",
      avatar: "https://ui-avatars.com/api/?name=Fundi&background=14b8a6&color=fff&size=200",
      skills: ["Electrical Wiring", "Circuit Installation", "Safety Inspections", "Lighting", "Appliance Repairs"],
      availability: "Monday - Friday, 9AM - 5PM",
      responseTime: "Within 1 hour",
      completionRate: 99,
    },
    "3": {
      id: 3,
      name: "David Kimani",
      serviceType: "carpenter",
      description: "Professional carpenter. Custom furniture, repairs, and installations.",
      longDescription: "Skilled carpenter with 6 years of experience in custom furniture making, repairs, and installations. I work with all types of wood and can create custom pieces to match your needs.",
      location: "Pipeline",
      city: "Nakuru",
      hourlyRate: 700,
      rating: 4,
      totalJobs: 56,
      isVerified: false,
      phone: "+254 734 567 890",
      avatar: "https://ui-avatars.com/api/?name=Fundi&background=14b8a6&color=fff&size=200",
      skills: ["Custom Furniture", "Wood Repairs", "Cabinet Installation", "Door Fitting", "Shelving"],
      availability: "Monday - Saturday, 7AM - 7PM",
      responseTime: "Within 3 hours",
      completionRate: 95,
    },
  };

  const fundi = mockFundis[id || "1"];

  if (!fundi) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Fundi not found</h1>
            <Button asChild>
              <Link href="/fundis">Back to Fundis</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const serviceTypeIcons: Record<string, string> = {
    plumber: "🔧",
    electrician: "⚡",
    carpenter: "🪚",
    painter: "🎨",
    mason: "🧱",
  };

  const handlePayment = async () => {
    console.log('handlePayment called!');
    setIsProcessingPayment(true);
    
    try {
      // TODO: Get user's phone number (from login or prompt)
      const userPhone = "+254712345678"; // Placeholder
      
      // Call backend API directly (bypass Manus tRPC)
      const response = await fetch("https://conekta-complete-system.onrender.com/api/v1/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_phone: userPhone,
          entity_id: id || "1",
          entity_type: "fundi",
          amount: 150,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || "Payment failed");
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Close modal immediately and show alert
        setShowPaymentModal(false);
        setIsProcessingPayment(false);
        alert(result.message || "STK Push sent! Please check your phone and enter your M-Pesa PIN.");
        
        // In production, poll for payment status
        // For now, reveal contact after 5 seconds
        setTimeout(() => {
          setContactRevealed(true);
        }, 5000);
      }
    } catch (error: any) {
      const errorMsg = error.message || "Unknown error";
      setPaymentError(errorMsg);
      alert("Payment failed: " + errorMsg);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Back Button */}
      <div className="bg-card/50 border-b border-border/50 py-4">
        <div className="container mx-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/fundis">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fundis
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex-1 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Card */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-32 h-32 rounded-full bg-muted overflow-hidden">
                        <img src={fundi.avatar} alt={fundi.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 text-4xl">
                        {serviceTypeIcons[fundi.serviceType]}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h1 className="text-3xl font-bold mb-1">{fundi.name}</h1>
                          <p className="text-lg text-muted-foreground capitalize mb-3">
                            {fundi.serviceType}
                          </p>
                        </div>
                        {fundi.isVerified && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            <Shield className="h-4 w-4 mr-1" />
                            UBARU Verified
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <span className="font-bold text-lg">{fundi.rating}.0</span>
                          <span className="text-muted-foreground">({fundi.totalJobs} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Briefcase className="h-5 w-5" />
                          <span>{fundi.totalJobs} jobs completed</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-5 w-5" />
                          <span>{fundi.location}, {fundi.city}</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{fundi.description}</p>

                      <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                        <span>KES {fundi.hourlyRate.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground font-normal">/hour</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About {fundi.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{fundi.longDescription}</p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {fundi.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mock Review 1 */}
                    <div className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="font-semibold">Sarah K.</span>
                        <span className="text-sm text-muted-foreground">• 2 weeks ago</span>
                      </div>
                      <p className="text-muted-foreground">
                        Excellent work! Very professional and completed the job on time. Highly recommended.
                      </p>
                    </div>

                    {/* Mock Review 2 */}
                    <div className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="font-semibold">James M.</span>
                        <span className="text-sm text-muted-foreground">• 1 month ago</span>
                      </div>
                      <p className="text-muted-foreground">
                        Great service and fair pricing. Will definitely hire again for future projects.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact {fundi.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!contactRevealed ? (
                    <>
                      <div className="bg-muted/50 rounded-lg p-4 text-center space-y-3">
                        <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Pay <span className="font-bold text-primary">KES 150</span> via M-Pesa to reveal contact details
                        </p>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => setShowPaymentModal(true)}
                        style={{background: '#25D366'}}
                      >
                        <Wallet className="h-5 w-5 mr-2" />
                        Pay & Reveal Contact
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="bg-primary/10 rounded-lg p-3 text-center mb-3">
                        <CheckCircle className="h-6 w-6 mx-auto text-primary mb-1" />
                        <p className="text-sm font-semibold text-primary">Contact Revealed!</p>
                      </div>
                      <Button className="w-full" size="lg" asChild style={{background: '#25D366'}}>
                        <a 
                          href={`https://wa.me/${fundi.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full" size="lg" asChild>
                        <a href={`tel:${fundi.phone}`}>
                          <Phone className="h-5 w-5 mr-2" />
                          Call {fundi.phone}
                        </a>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Availability Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Working Hours</p>
                      <p className="text-sm text-muted-foreground">{fundi.availability}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Response Time</p>
                      <p className="text-sm text-muted-foreground">{fundi.responseTime}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Completion Rate</p>
                      <p className="text-sm text-muted-foreground">{fundi.completionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reveal Contact Details</DialogTitle>
            <DialogDescription>
              Pay KES 150 via M-Pesa to get {fundi.name}'s phone number and WhatsApp contact
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Service Provider</span>
                <span className="font-semibold">{fundi.name}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contact Reveal Fee</span>
                <span className="font-bold text-lg text-primary">KES 150</span>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-3 text-sm text-primary">
              <p className="font-semibold mb-1">✓ One-time payment</p>
              <p className="text-xs">You'll get instant access to WhatsApp and phone number</p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handlePayment}
              disabled={isProcessingPayment}
              style={{background: '#25D366'}}
            >
              {isProcessingPayment ? (
                <>Processing Payment...</>
              ) : (
                <>
                  <Wallet className="h-5 w-5 mr-2" />
                  Pay KES 150 via M-Pesa
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowPaymentModal(false)}
              disabled={isProcessingPayment}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
