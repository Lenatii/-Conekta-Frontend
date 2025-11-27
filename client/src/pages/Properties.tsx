import { useState } from "react";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Bed, Bath, Car, Wifi, Shield, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PropertiesPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");

  // Mock data with real property images
  const mockProperties = [
    {
      id: 1,
      title: "2BR Apartment - Flamingo Estate",
      description: "Modern 2-bedroom apartment with stunning views and premium finishes",
      propertyType: "apartment",
      bedrooms: 2,
      bathrooms: 1,
      price: 18000,
      location: "Flamingo Estate, Nakuru CBD",
      city: "Nakuru",
      hasParking: true,
      hasWifi: true,
      hasSecurity: true,
      isVerified: true,
      images: ["/images/properties/LjZDPMQgOhUk.jpg"],
    },
    {
      id: 2,
      title: "1BR Bedsitter - Milimani",
      description: "Cozy bedsitter in quiet neighborhood with modern amenities",
      propertyType: "bedsitter",
      bedrooms: 1,
      bathrooms: 1,
      price: 8000,
      location: "Milimani, Nakuru",
      city: "Nakuru",
      hasParking: false,
      hasWifi: false,
      hasSecurity: true,
      isVerified: false,
      images: ["/images/properties/58psghyGCltF.jpg"],
    },
    {
      id: 3,
      title: "Luxury 2BR Apartment - Kilimani",
      description: "Elegant apartment with modern design and city views",
      propertyType: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      price: 35000,
      location: "Kilimani, Nairobi",
      city: "Nairobi",
      hasParking: true,
      hasWifi: true,
      hasSecurity: true,
      isVerified: true,
      images: ["/images/properties/e3Ht5W6Adxej.jpg"],
    },
    {
      id: 4,
      title: "Modern Studio - Riverside",
      description: "Stylish studio apartment perfect for young professionals",
      propertyType: "studio",
      bedrooms: 1,
      bathrooms: 1,
      price: 22000,
      location: "Riverside, Nairobi",
      city: "Nairobi",
      hasParking: true,
      hasWifi: true,
      hasSecurity: true,
      isVerified: true,
      images: ["/images/properties/mp9aWrhejf2p.jpeg"],
    },
    {
      id: 5,
      title: "Affordable Bedsitter - CBD",
      description: "Budget-friendly bedsitter close to town center",
      propertyType: "bedsitter",
      bedrooms: 1,
      bathrooms: 1,
      price: 6500,
      location: "Nakuru CBD",
      city: "Nakuru",
      hasParking: false,
      hasWifi: false,
      hasSecurity: true,
      isVerified: false,
      images: ["/images/properties/gkAi05ojqEla.jpg"],
    },
    {
      id: 6,
      title: "2BR Bungalow - White House Area",
      description: "Spacious bungalow with garden in serene neighborhood",
      propertyType: "house",
      bedrooms: 2,
      bathrooms: 1,
      price: 25000,
      location: "White House, Nakuru",
      city: "Nakuru",
      hasParking: true,
      hasWifi: false,
      hasSecurity: true,
      isVerified: true,
      images: ["/images/properties/TmAuTkzWA18K.jpg"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Search Header */}
      <div className="bg-card/50 border-b border-border/50 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Home</h1>
          
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

            {/* Property Type */}
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="bedsitter">Bedsitter</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>

            {/* Bedrooms */}
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="0-10000">Under 10k</SelectItem>
                <SelectItem value="10000-20000">10k - 20k</SelectItem>
                <SelectItem value="20000-50000">20k - 50k</SelectItem>
                <SelectItem value="50000+">50k+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 py-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              {mockProperties.length} properties found
            </p>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property) => {
              // Filter out empty/placeholder images
              const actualImages = property.images.filter(
                (img) => img && img !== "" && !img.includes("/api/placeholder")
              );
              const displayImage = actualImages.length > 0 ? actualImages[0] : "/api/placeholder/800/600";
              
              return (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <Card className="overflow-hidden hover:border-primary/50 transition-all group cursor-pointer">
                  {/* Image */}
                  <div className="relative h-48 bg-muted">
                    <img
                      src={displayImage}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {property.isVerified && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        <Shield className="h-3 w-3 mr-1" />
                        UBARU
                      </Badge>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-background/90">
                        {property.propertyType}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Title and Price */}
                    <div className="mb-3">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      <p className="text-2xl font-bold text-primary">
                        KES {property.price.toLocaleString()}
                        <span className="text-sm text-muted-foreground font-normal">/month</span>
                      </p>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1 text-primary" />
                        {property.bedrooms} Bed
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1 text-primary" />
                        {property.bathrooms} Bath
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {property.hasParking && (
                        <Badge variant="outline" className="text-xs">
                          <Car className="h-3 w-3 mr-1" />
                          Parking
                        </Badge>
                      )}
                      {property.hasWifi && (
                        <Badge variant="outline" className="text-xs">
                          <Wifi className="h-3 w-3 mr-1" />
                          WiFi
                        </Badge>
                      )}
                      {property.hasSecurity && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Security
                        </Badge>
                      )}
                    </div>

                    {/* View Button */}
                    <Button className="w-full" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
            })}
          </div>

          {/* Empty State */}
          {mockProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No properties found matching your criteria</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setPropertyType("all");
                setPriceRange("all");
                setBedrooms("all");
              }}>
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
