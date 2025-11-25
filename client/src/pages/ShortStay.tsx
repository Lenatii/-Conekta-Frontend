import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Wifi, Coffee, Car } from "lucide-react";

export default function ShortStay() {
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
      image: "/api/placeholder/400/300",
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
      image: "/api/placeholder/400/300",
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
      image: "/api/placeholder/400/300",
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
                      <Link href={`/stays/${stay.id}`}>
                        <Button>Book Now</Button>
                      </Link>
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
    </div>
  );
}
