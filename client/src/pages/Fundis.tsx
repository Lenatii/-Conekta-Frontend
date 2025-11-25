import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Shield, Phone, Briefcase } from "lucide-react";

export default function FundisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [location, setLocation] = useState("all");

  // Mock data - will connect to backend later
  const mockFundis = [
    {
      id: 1,
      name: "John Mwangi",
      serviceType: "plumber",
      description: "Expert plumber with 10+ years experience. Specializing in installations, repairs, and maintenance.",
      location: "Nakuru CBD",
      city: "Nakuru",
      hourlyRate: 800,
      rating: 5,
      totalJobs: 127,
      isVerified: true,
      phone: "+254 712 345 678",
      avatar: "/api/placeholder/100/100",
    },
    {
      id: 2,
      name: "Peter Ochieng",
      serviceType: "electrician",
      description: "Licensed electrician. Wiring, installations, and electrical repairs for homes and offices.",
      location: "Milimani",
      city: "Nakuru",
      hourlyRate: 1000,
      rating: 5,
      totalJobs: 89,
      isVerified: true,
      phone: "+254 723 456 789",
      avatar: "/api/placeholder/100/100",
    },
    {
      id: 3,
      name: "David Kimani",
      serviceType: "carpenter",
      description: "Professional carpenter. Custom furniture, repairs, and installations.",
      location: "Pipeline",
      city: "Nakuru",
      hourlyRate: 700,
      rating: 4,
      totalJobs: 56,
      isVerified: false,
      phone: "+254 734 567 890",
      avatar: "/api/placeholder/100/100",
    },
  ];

  const serviceTypeIcons: Record<string, string> = {
    plumber: "🔧",
    electrician: "⚡",
    carpenter: "🪚",
    painter: "🎨",
    cleaner: "🧹",
    other: "🛠️",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-card/80 to-card/50 border-b border-border/50 py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Find Trusted <span className="text-primary">Service Providers</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Hire verified fundis for plumbing, electrical, carpentry, and more
          </p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or service..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Service Type */}
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="plumber">Plumber</SelectItem>
                <SelectItem value="electrician">Electrician</SelectItem>
                <SelectItem value="carpenter">Carpenter</SelectItem>
                <SelectItem value="painter">Painter</SelectItem>
                <SelectItem value="cleaner">Cleaner</SelectItem>
              </SelectContent>
            </Select>

            {/* Location */}
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="nakuru-cbd">Nakuru CBD</SelectItem>
                <SelectItem value="milimani">Milimani</SelectItem>
                <SelectItem value="pipeline">Pipeline</SelectItem>
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
              {mockFundis.length} service providers found
            </p>
          </div>

          {/* Fundis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFundis.map((fundi) => (
              <Card key={fundi.id} className="overflow-hidden hover:border-primary/50 transition-all group">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
                        <img src={fundi.avatar} alt={fundi.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 text-2xl">
                        {serviceTypeIcons[fundi.serviceType]}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {fundi.name}
                        </h3>
                        {fundi.isVerified && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            <Shield className="h-3 w-3 mr-1" />
                            UBARU
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize mb-2">
                        {fundi.serviceType}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-semibold">{fundi.rating}.0</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span>{fundi.totalJobs} jobs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {fundi.description}
                  </p>

                  {/* Location and Rate */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {fundi.location}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        KES {fundi.hourlyRate}
                      </p>
                      <p className="text-xs text-muted-foreground">per hour</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/fundis/${fundi.id}`}>View Profile</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <a href={`https://wa.me/${fundi.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <Phone className="h-4 w-4 mr-1" />
                        Contact
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {mockFundis.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No service providers found matching your criteria</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setServiceType("all");
                setLocation("all");
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
