import { useState } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapPin, Bed, Bath, Car, Wifi, Shield, Phone, Mail, User, Lock, CheckCircle2, ArrowLeft, Users, Star, Calendar } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

// Direct API call to backend instead of tRPC (for static hosting compatibility)
const BACKEND_API_URL = "https://conekta-complete-system.onrender.com";

export default function StayDetailPage() {
  const [, params] = useRoute("/stays/:id");
  const { user, isAuthenticated } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [contactRevealed, setContactRevealed] = useState(false);

  // Mock stays data - matches Stays.tsx
  const mockStays = [
    {
      id: 1,
      title: "Luxury Villa - Lake Nakuru View",
      description: "Stunning 3-bedroom villa with panoramic lake views. Perfect for families seeking a peaceful getaway. The villa features modern amenities, spacious living areas, and a beautiful garden. Enjoy breathtaking sunsets over Lake Nakuru from the comfort of your private terrace.",
      stayType: "villa",
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      pricePerNight: 8500,
      location: "Lake Nakuru, Nakuru",
      city: "Nakuru",
      hasWifi: true,
      hasParking: true,
      hasSecurity: true,
      isVerified: true,
      rating: 4.9,
      reviews: 45,
      hostName: "Mary Wanjiru",
      hostPhone: "+254 720 123 456",
      hostEmail: "mary.wanjiru@example.com",
      images: ["/images/properties/e3Ht5W6Adxej.jpg"],
    },
    {
      id: 2,
      title: "Cozy Cottage - Milimani",
      description: "Charming 2-bedroom cottage in quiet neighborhood. Ideal for couples or small families. Features a cozy fireplace, fully equipped kitchen, and private garden. Located in the peaceful Milimani area, close to local amenities.",
      stayType: "cottage",
      guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      pricePerNight: 4500,
      location: "Milimani, Nakuru",
      city: "Nakuru",
      hasWifi: true,
      hasParking: true,
      hasSecurity: true,
      isVerified: true,
      rating: 4.7,
      reviews: 32,
      hostName: "Peter Kimani",
      hostPhone: "+254 722 234 567",
      hostEmail: "peter.kimani@example.com",
      images: ["/images/properties/TmAuTkzWA18K.jpg"],
    },
    {
      id: 3,
      title: "Modern Apartment - Westlands",
      description: "Stylish 1-bedroom apartment in the heart of Westlands, Nairobi. Perfect for business travelers or couples. Features contemporary design, high-speed WiFi, and easy access to shopping malls and restaurants.",
      stayType: "apartment",
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      pricePerNight: 6000,
      location: "Westlands, Nairobi",
      city: "Nairobi",
      hasWifi: true,
      hasParking: true,
      hasSecurity: true,
      isVerified: true,
      rating: 4.8,
      reviews: 67,
      hostName: "James Omondi",
      hostPhone: "+254 733 345 678",
      hostEmail: "james.omondi@example.com",
      images: ["/images/properties/mp9aWrhejf2p.jpeg"],
    },
    {
      id: 4,
      title: "Beachfront Bungalow - Mombasa",
      description: "Beautiful 2-bedroom bungalow steps from the beach. Wake up to the sound of waves and enjoy stunning ocean views. Perfect for beach lovers and water sports enthusiasts. Features outdoor shower and BBQ area.",
      stayType: "bungalow",
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      pricePerNight: 12000,
      location: "Diani Beach, Mombasa",
      city: "Mombasa",
      hasWifi: true,
      hasParking: true,
      hasSecurity: true,
      isVerified: true,
      rating: 5.0,
      reviews: 89,
      hostName: "Hassan Ali",
      hostPhone: "+254 744 456 789",
      hostEmail: "hassan.ali@example.com",
      images: ["/images/properties/LjZDPMQgOhUk.jpg"],
    },
    {
      id: 5,
      title: "Budget Studio - Nakuru CBD",
      description: "Affordable studio apartment close to town center. Perfect for solo travelers or budget-conscious guests. Features basic amenities and easy access to public transport and local markets.",
      stayType: "studio",
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      pricePerNight: 2500,
      location: "Nakuru CBD",
      city: "Nakuru",
      hasWifi: false,
      hasParking: false,
      hasSecurity: true,
      isVerified: false,
      rating: 4.2,
      reviews: 18,
      hostName: "Grace Muthoni",
      hostPhone: "+254 755 567 890",
      hostEmail: "grace.muthoni@example.com",
      images: ["/images/properties/8QKwvPQs9Ggf.jpg"],
    },
    {
      id: 6,
      title: "Garden House - Karen",
      description: "Spacious 4-bedroom house in the prestigious Karen area. Features beautiful gardens, swimming pool, and outdoor entertainment area. Perfect for large families or group getaways. Close to Giraffe Centre and Karen Blixen Museum.",
      stayType: "house",
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      pricePerNight: 15000,
      location: "Karen, Nairobi",
      city: "Nairobi",
      hasWifi: true,
      hasParking: true,
      hasSecurity: true,
      isVerified: true,
      rating: 4.9,
      reviews: 54,
      hostName: "David Njoroge",
      hostPhone: "+254 766 678 901",
      hostEmail: "david.njoroge@example.com",
      images: ["/images/properties/mp9aWrhejf2p.jpeg"],
    },
  ];

  const stay = mockStays.find(s => s.id === parseInt(params?.id || "1"));

  if (!stay) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Stay Not Found</h1>
            <Link href="/stays">
              <Button>Back to Stays</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(0);

  // Show all images including placeholders
  const displayImages = stay.images.filter((img) => img && img !== "");
  
  // If no images, use a default placeholder
  const finalImages = displayImages.length > 0 ? displayImages : ["/api/placeholder/800/600"];

  const handleRevealContact = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setPaymentStatus("processing");

    try {
      console.log('[Payment] Initiating payment to:', `${BACKEND_API_URL}/api/v1/payments/initiate`);
      const response = await fetch(`${BACKEND_API_URL}/api/v1/payments/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_phone: phoneNumber,
          entity_id: stay.id.toString(),
          entity_type: 'stay',
          amount: 150,
        }),
      });

      const data = await response.json();
      console.log('[Payment] Response:', data);

      if (data.success) {
        // STK Push sent successfully
        setPaymentStatus("success");
        setTimeout(() => {
          setContactRevealed(true);
          setShowPaymentModal(false);
          setPaymentStatus("idle");
        }, 2000);
      } else {
        setPaymentStatus("failed");
        alert(data.message || "Payment failed. Please try again.");
        setTimeout(() => setPaymentStatus("idle"), 2000);
      }
    } catch (error) {
      console.error('[Payment] Error:', error);
      setPaymentStatus("failed");
      alert("Payment failed. Please check your connection and try again.");
      setTimeout(() => setPaymentStatus("idle"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 py-8">
        <div className="container mx-auto">
          {/* Back Button */}
          <Link href="/stays">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stays
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
                <img
                  src={finalImages[selectedImage]}
                  alt={stay.title}
                  className="w-full h-full object-cover"
                />
                {stay.isVerified && (
                  <Badge className="absolute top-4 right-4 bg-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    CONEKTA Trust Verified
                  </Badge>
                )}
              </div>

              {/* Thumbnail Gallery - Only show if there are multiple images */}
              {finalImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {finalImages.map((image, index) => (
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
                  <h2 className="text-2xl font-bold mb-4">About This Stay</h2>
                  <p className="text-muted-foreground leading-relaxed">{stay.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {stay.hasParking && (
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        <span>Parking</span>
                      </div>
                    )}
                    {stay.hasWifi && (
                      <div className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-primary" />
                        <span>WiFi</span>
                      </div>
                    )}
                    {stay.hasSecurity && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>24/7 Security</span>
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
                    <h1 className="text-2xl font-bold mb-2">{stay.title}</h1>
                    <p className="text-3xl font-bold text-primary">
                      KES {stay.pricePerNight.toLocaleString()}
                      <span className="text-sm text-muted-foreground font-normal">/night</span>
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-semibold">{stay.rating}</span>
                    <span className="text-sm text-muted-foreground">({stay.reviews} reviews)</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{stay.location}</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-4 py-4 border-y border-border">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{stay.guests}</span>
                      <span className="text-sm text-muted-foreground">Guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{stay.bedrooms}</span>
                      <span className="text-sm text-muted-foreground">Bed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{stay.bathrooms}</span>
                      <span className="text-sm text-muted-foreground">Bath</span>
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
                          <span className="font-semibold">{stay.hostName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${stay.hostPhone}`} className="text-primary hover:underline">
                            {stay.hostPhone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${stay.hostEmail}`} className="text-primary hover:underline">
                            {stay.hostEmail}
                          </a>
                        </div>
                      </div>
                      <Button className="w-full" asChild>
                        <a href={`https://wa.me/${stay.hostPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
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
                        Pay once to get host contact details
                      </p>
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    {stay.isVerified && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>CONEKTA Trust Verified Property</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Secure M-Pesa Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>WhatsApp Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reveal Host Contact</DialogTitle>
            <DialogDescription>
              Pay KES 150 via M-Pesa to get the host's contact details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                M-Pesa Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={paymentStatus !== "idle"}
              />
              <p className="text-xs text-muted-foreground">
                Enter your M-Pesa number to receive the payment prompt
              </p>
            </div>

            {paymentStatus === "processing" && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Processing payment...</p>
                <p className="text-xs text-muted-foreground mt-1">Check your phone for M-Pesa prompt</p>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold">Payment Successful!</p>
                <p className="text-xs text-muted-foreground mt-1">Revealing contact details...</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              disabled={paymentStatus !== "idle"}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={paymentStatus !== "idle" || !phoneNumber}
            >
              {paymentStatus === "idle" ? "Pay KES 150" : "Processing..."}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
