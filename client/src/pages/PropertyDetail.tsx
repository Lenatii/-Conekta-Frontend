import { useState } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapPin, Bed, Bath, Car, Wifi, Shield, Phone, Mail, User, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function PropertyDetailPage() {
  const [, params] = useRoute("/properties/:id");
  const { user, isAuthenticated } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [contactRevealed, setContactRevealed] = useState(false);

  // Mock property data - will connect to backend later
  const property = {
    id: params?.id,
    title: "2BR Apartment - Flamingo Estate",
    description: "Beautiful 2-bedroom apartment in the heart of Nakuru CBD. Features modern amenities, stunning views, and excellent security. Perfect for young professionals or small families. The apartment comes with prepaid electricity, hot shower, and ample parking space.",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    price: 18000,
    location: "Flamingo Estate, Nakuru CBD",
    city: "Nakuru",
    county: "Nakuru",
    hasParking: true,
    hasWifi: true,
    hasGenerator: false,
    hasWater: true,
    hasSecurity: true,
    isVerified: true,
    landlordName: "John Kamau",
    landlordPhone: "+254 712 345 678",
    landlordEmail: "john.kamau@example.com",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
    ],
  };

  const [selectedImage, setSelectedImage] = useState(0);

  // Filter out empty/placeholder images - only show actual uploaded photos
  const actualImages = property.images.filter(
    (img) => img && img !== "" && !img.includes("/api/placeholder")
  );
  
  // If no images, use a default placeholder
  const displayImages = actualImages.length > 0 ? actualImages : ["/api/placeholder/800/600"];

  const handleRevealContact = () => {
    // Allow payment without login (guest mode)
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setPaymentStatus("processing");

    try {
      // Call backend API directly (bypass Manus tRPC)
      const response = await fetch("https://conekta-complete-system.onrender.com/api/v1/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_phone: phoneNumber,
          entity_id: params?.id || "1",
          entity_type: "property",
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
        setPaymentStatus("idle");
        alert(result.message || "STK Push sent! Please check your phone and enter your M-Pesa PIN.");
        
        // In production, poll for payment status
        // For now, reveal contact after 5 seconds
        setTimeout(() => {
          setContactRevealed(true);
        }, 5000);
      }
    } catch (error: any) {
      setPaymentStatus("idle");
      alert("Payment failed: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-8">
        <div className="container mx-auto">
          {/* Back Button */}
          <Link href="/properties">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
                <img
                  src={displayImages[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.isVerified && (
                  <Badge className="absolute top-4 right-4 bg-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    UBARU Verified
                  </Badge>
                )}
              </div>

              {/* Thumbnail Gallery - Only show if there are multiple images */}
              {displayImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 bg-muted rounded overflow-hidden border-2 transition-all ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About This Property</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.hasParking && (
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        <span>Parking</span>
                      </div>
                    )}
                    {property.hasWifi && (
                      <div className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-primary" />
                        <span>WiFi</span>
                      </div>
                    )}
                    {property.hasSecurity && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>24/7 Security</span>
                      </div>
                    )}
                    {property.hasWater && (
                      <div className="flex items-center gap-2">
                        <span className="text-primary">💧</span>
                        <span>Water Supply</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  {/* Title and Price */}
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
                    <p className="text-3xl font-bold text-primary">
                      KES {property.price.toLocaleString()}
                      <span className="text-sm text-muted-foreground font-normal">/month</span>
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{property.location}</span>
                  </div>

                  {/* Features */}
                  <div className="flex gap-6 py-4 border-y border-border">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{property.bedrooms}</span>
                      <span className="text-sm text-muted-foreground">Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{property.bathrooms}</span>
                      <span className="text-sm text-muted-foreground">Bathrooms</span>
                    </div>
                  </div>

                  {/* Contact Section */}
                  {contactRevealed ? (
                    <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary">Contact Revealed!</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{property.landlordName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${property.landlordPhone}`} className="text-primary hover:underline">
                            {property.landlordPhone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${property.landlordEmail}`} className="text-primary hover:underline">
                            {property.landlordEmail}
                          </a>
                        </div>
                      </div>
                      <Button className="w-full" asChild>
                        <a href={`https://wa.me/${property.landlordPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                          Chat on WhatsApp
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        <span>Contact details are hidden</span>
                      </div>
                      <Button className="w-full" size="lg" onClick={handleRevealContact}>
                        Reveal Contact - KES 150
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Pay once to get landlord contact details
                      </p>
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>UBARU Verified Property</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">🔒</span>
                      <span>Secure M-Pesa Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">💬</span>
                      <span>WhatsApp Support</span>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reveal Contact Details</DialogTitle>
            <DialogDescription>
              Pay KES 150 via M-Pesa to get landlord contact information
            </DialogDescription>
          </DialogHeader>

          {paymentStatus === "idle" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">M-Pesa Phone Number</label>
                <Input
                  type="tel"
                  placeholder="254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your M-Pesa number to receive STK push
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Contact Reveal Fee</span>
                  <span className="font-semibold">KES 150</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Payment Method</span>
                  <span>M-Pesa STK Push</span>
                </div>
              </div>
            </div>
          )}

          {paymentStatus === "processing" && (
            <div className="py-8 text-center space-y-4">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <div>
                <p className="font-semibold">Processing Payment...</p>
                <p className="text-sm text-muted-foreground">Check your phone for M-Pesa prompt</p>
              </div>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
              <div>
                <p className="font-semibold text-lg">Payment Successful!</p>
                <p className="text-sm text-muted-foreground">Revealing contact details...</p>
              </div>
            </div>
          )}

          {paymentStatus === "idle" && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button onClick={handlePayment}>Pay KES 150</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
