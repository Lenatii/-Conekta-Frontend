import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Calendar, Star, Shield, Wifi, Car } from "lucide-react";

export default function StaysPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stayType, setStayType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [guests, setGuests] = useState("all");

  // Mock stays data
  const mockStays = [
    {
      id: 1,
      title: "Luxury Villa - Lake Nakuru View",
      description: "Stunning 3-bedroom villa with panoramic lake views, perfect for families",
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
      images: ["/images/properties/e3Ht5W6Adxej.jpg"],
    },
    {
      id: 2,
      title: "Cozy Cottage - Milimani",
      description: "Charming 2-bedroom cottage in quiet neighborhood, ideal for couples",
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
      images: ["/images/properties/TmAuTkzWA18K.jpg"],
    },
    {
      id: 3,
      title: "Modern Apartment - Westlands",
      description: "Stylish 1-bedroom apartment in the heart of Westlands, Nairobi",
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
      images: ["/images/properties/mp9aWrhejf2p.jpeg"],
    },
    {
      id: 4,
      title: "Beachfront Bungalow - Mombasa",
      description: "Beautiful 2-bedroom bungalow steps from the beach",
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
      images: ["/images/properties/LjZDPMQgOhUk.jpg"],
    },
    {
      id: 5,
      title: "Budget Studio - Nakuru CBD",
      description: "Affordable studio apartment close to town center",
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
      images: ["/images/properties/gkAi05ojqEla.jpg"],
    },
    {
      id: 6,
      title: "Garden House - Karen",
      description: "Spacious 4-bedroom house with lush garden, perfect for groups",
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
      images: ["/images/properties/58psghyGCltF.jpg"],
    },
  ];

  // Filter stays
  const filteredStays = mockStays.filter((stay) => {
    const matchesSearch = searchQuery === "" || 
      stay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stay.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = stayType === "all" || stay.stayType === stayType;
    
    const matchesGuests = guests === "all" || stay.guests >= parseInt(guests);
    
    const matchesPrice = 
      priceRange === "all" ||
      (priceRange === "budget" && stay.pricePerNight < 5000) ||
      (priceRange === "mid" && stay.pricePerNight >= 5000 && stay.pricePerNight < 10000) ||
      (priceRange === "luxury" && stay.pricePerNight >= 10000);
    
    return matchesSearch && matchesType && matchesGuests && matchesPrice;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Search Header */}
      <div className="bg-card/50 border-b border-border/50 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Short-Stay</h1>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Stay Type */}
            <Select value={stayType} onValueChange={setStayType}>
              <SelectTrigger>
                <SelectValue placeholder="Stay Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="cottage">Cottage</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="bungalow">Bungalow</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="house">House</SelectItem>
              </SelectContent>
            </Select>

            {/* Guests */}
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger>
                <SelectValue placeholder="Guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="2">2+ Guests</SelectItem>
                <SelectItem value="4">4+ Guests</SelectItem>
                <SelectItem value="6">6+ Guests</SelectItem>
                <SelectItem value="8">8+ Guests</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="budget">Budget (&lt; KES 5,000)</SelectItem>
                <SelectItem value="mid">Mid-range (KES 5,000 - 10,000)</SelectItem>
                <SelectItem value="luxury">Luxury (KES 10,000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 bg-background py-8">
        <div className="container mx-auto">
          <p className="text-muted-foreground mb-6">{filteredStays.length} short-stay properties found</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStays.map((stay) => (
              <Card key={stay.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={stay.images[0]}
                    alt={stay.title}
                    className="w-full h-full object-cover"
                  />
                  {stay.isVerified && (
                    <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary">
                      <Shield className="h-3 w-3 mr-1" />
                      CONEKTA Trust
                    </Badge>
                  )}
                  <Badge variant="secondary" className="absolute top-2 right-2 bg-card/90">
                    {stay.stayType}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{stay.title}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{stay.rating}</span>
                    <span>({stay.reviews} reviews)</span>
                  </div>

                  <p className="text-sm text-primary font-bold mb-3">
                    KES {stay.pricePerNight.toLocaleString()}<span className="text-muted-foreground font-normal">/night</span>
                  </p>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{stay.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{stay.guests} Guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{stay.bedrooms} Bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{stay.bathrooms} Bath</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {stay.hasWifi && <Badge variant="outline" className="text-xs">WiFi</Badge>}
                    {stay.hasParking && <Badge variant="outline" className="text-xs">Parking</Badge>}
                    {stay.hasSecurity && <Badge variant="outline" className="text-xs">Security</Badge>}
                  </div>

                  <Link href={`/stays/${stay.id}`}>
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStays.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No short-stay properties found matching your criteria</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setStayType("all");
                  setPriceRange("all");
                  setGuests("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
