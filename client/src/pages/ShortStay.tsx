import { Link } from "wouter";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Star, Users, Wifi, Coffee, Car, Calendar as CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function ShortStay() {
  const [selectedStay, setSelectedStay] = useState<any>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [contactRevealed, setContactRevealed] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCheckAvailability = (stay: any) => {
    setSelectedStay(stay);
    setIsAvailabilityModalOpen(true);
  };

  const handlePayToReveal = () => {
    setIsAvailabilityModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const confirmPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    
    try {
      // Call backend API directly (bypass Manus tRPC)
      const response = await fetch("https://conekta-complete-system.onrender.com/api/v1/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_phone: phoneNumber,
          entity_id: selectedStay?.id?.toString() || "1",
          entity_type: "short_stay",
          amount: 150,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || "Payment failed");
      }

      const result = await response.json();

      if (result.success) {
        alert(result.message || "STK Push sent! Please enter your M-Pesa PIN.");
        // In production, poll for payment status
        setTimeout(() => {
          setContactRevealed(true);
          setIsPaymentModalOpen(false);
        }, 5000);
      }
    } catch (error: any) {
      alert("Payment failed: " + (error.message || "Unknown error"));
    }
  };
  // Mock data - will connect to backend later
  const mockStays = [
    {
      id: 1,
      title: "Cozy Studio in Nakuru CBD",
      location: "Nakuru CBD",
      pricePerNight: 2500,
      rating: 4.8,
      reviews: 24,
      guests: 2,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      amenities: ["WiFi", "Kitchen", "Parking"],
      host: "Mary Wanjiru",
      isVerified: true,
    },
    {
      id: 2,
      title: "Spacious 2BR Apartment - Milimani",
      location: "Milimani, Nakuru",
      pricePerNight: 4000,
      rating: 4.9,
      reviews: 18,
      guests: 4,
      image: "https://images.unsplash.com/photo-1502672260066-6bc35f0a1f8c?w=800&h=600&fit=crop",
      amenities: ["WiFi", "Kitchen", "Parking", "Pool"],
      host: "John Kamau",
      isVerified: true,
    },
    {
      id: 3,
      title: "Modern Bedsitter - Pipeline",
      location: "Pipeline, Nakuru",
      pricePerNight: 1800,
      rating: 4.5,
      reviews: 12,
      guests: 2,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      amenities: ["WiFi", "Kitchen"],
      host: "Grace Akinyi",
      isVerified: false,
    },
  ];

  const amenityIcons: Record<string, any> = {
    WiFi: Wifi,
    Kitchen: Coffee,
    Parking: Car,
    Pool: Users,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20">
          <div className="container">
            <div className="max-w-3xl">
              <Badge className="mb-4">Short-Stay</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Book Verified Short-Term Stays
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find comfortable, secure short-stay accommodations in Nakuru. 
                All hosts verified through UBARU. Book instantly with M-Pesa.
              </p>
            </div>
          </div>
        </section>

        {/* Stays Listing */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStays.map((stay) => (
                <Card key={stay.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-muted">
                    <img
                      src={stay.image}
                      alt={stay.title}
                      className="w-full h-full object-cover"
                    />
                    {stay.isVerified && (
                      <Badge className="absolute top-3 right-3 bg-green-500">
                        UBARU Verified
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{stay.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {stay.location}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{stay.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({stay.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {stay.guests} guests
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {stay.amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity] || Wifi;
                        return (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            <Icon className="h-3 w-3 mr-1" />
                            {amenity}
                          </Badge>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          KES {stay.pricePerNight.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">per night</div>
                      </div>
                      <Button onClick={() => handleCheckAvailability(stay)}>Check Availability</Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Hosted by {stay.host}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Coming Soon Notice */}
            <div className="mt-12 text-center">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="py-8">
                  <h3 className="text-xl font-bold mb-2">More Stays Coming Soon!</h3>
                  <p className="text-muted-foreground mb-4">
                    We're onboarding more verified hosts. Want to list your space?
                  </p>
                  <a href="https://wa.me/254797446155?text=Hi, I want to list my space on CONEKTA Short-Stay">
                    <Button style={{background: '#25D366'}}>
                      Contact Us on WhatsApp
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Availability Check Modal */}
      <Dialog open={isAvailabilityModalOpen} onOpenChange={setIsAvailabilityModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Check Availability - {selectedStay?.title}</DialogTitle>
            <DialogDescription>
              Select your desired dates to check availability
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Check-in Date</label>
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border w-full scale-75 sm:scale-90 md:scale-100 origin-top"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Check-out Date</label>
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => !checkIn || date <= checkIn}
                  className="rounded-md border w-full scale-75 sm:scale-90 md:scale-100 origin-top"
                />
              </div>
            </div>

            {checkIn && checkOut && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-green-600 font-semibold text-lg">✓ Available!</div>
                    <div className="text-sm text-muted-foreground">
                      {differenceInDays(checkOut, checkIn)} nights • KES {(differenceInDays(checkOut, checkIn) * selectedStay?.pricePerNight).toLocaleString()} total
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm mb-3">Pay <strong>KES 150</strong> to reveal host contact and book directly</p>
                      <Button onClick={handlePayToReveal} className="w-full">
                        Pay & Reveal Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reveal Host Contact</DialogTitle>
            <DialogDescription>
              Pay KES 150 via M-Pesa to get host's WhatsApp number
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">M-Pesa Phone Number</label>
              <Input
                type="tel"
                placeholder="0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full"
              />
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="text-2xl font-bold">KES 150</div>
                  <div className="text-sm text-muted-foreground">
                    One-time fee to reveal contact
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button onClick={confirmPayment} className="w-full" style={{background: '#25D366'}}>
              Pay KES 150 via M-Pesa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Revealed Modal */}
      <Dialog open={contactRevealed} onOpenChange={setContactRevealed}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Revealed!</DialogTitle>
            <DialogDescription>
              You can now contact the host directly
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <div className="font-semibold mb-2">Host: {selectedStay?.host}</div>
                <div className="text-sm text-muted-foreground mb-4">WhatsApp: +254 712 345 678</div>
              </div>
              <a href="https://wa.me/254712345678?text=Hi, I'm interested in booking your property" target="_blank" rel="noopener noreferrer">
                <Button className="w-full" style={{background: '#25D366'}}>
                  Chat on WhatsApp
                </Button>
              </a>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
