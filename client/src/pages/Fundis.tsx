import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Shield, Phone, Briefcase, Award, GraduationCap } from "lucide-react";

export default function FundisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [location, setLocation] = useState("all");

  // All 15 service categories from backend
  const serviceCategories = [
    "Plumber",
    "Electrician",
    "Carpenter",
    "Mason",
    "Painter",
    "Cleaner",
    "Gardener",
    "Security Guard",
    "Driver",
    "Mechanic",
    "Appliance Repair",
    "General Handyman",
    "Mama Fua (Laundry)",
    "CCTV Installation",
    "WiFi Installation"
  ];

  // Expanded mock data - will connect to backend later
  const mockFundis = [
    {
      id: 1,
      name: "John Mwangi",
      serviceType: "Plumber",
      description: "Expert plumber with 10+ years experience. Specializing in installations, repairs, and maintenance.",
      location: "Nakuru CBD",
      city: "Nakuru",
      hourlyRate: 800,
      rating: 5,
      totalJobs: 127,
      isVerified: true,
      phone: "+254 712 345 678",
      avatar: "/fundi-john.jpg",
      certifications: ["UBARU Certified", "Customer Service Training"]
    },
    {
      id: 2,
      name: "Peter Ochieng",
      serviceType: "Electrician",
      description: "Licensed electrician. Wiring, installations, and electrical repairs for homes and offices.",
      location: "Milimani",
      city: "Nakuru",
      hourlyRate: 1000,
      rating: 5,
      totalJobs: 89,
      isVerified: true,
      phone: "+254 723 456 789",
      avatar: "/fundi-peter.jpg",
      certifications: ["UBARU Certified", "Professional Standards Training"]
    },
    {
      id: 3,
      name: "David Kimani",
      serviceType: "Carpenter",
      description: "Professional carpenter. Custom furniture, repairs, and installations.",
      location: "Pipeline",
      city: "Nakuru",
      hourlyRate: 700,
      rating: 4,
      totalJobs: 56,
      isVerified: true,
      phone: "+254 734 567 890",
      avatar: "/fundi-david.jpg",
      certifications: ["UBARU Certified", "Customer Service Excellence"]
    },
    {
      id: 4,
      name: "James Otieno",
      serviceType: "Mason",
      description: "Experienced mason specializing in brickwork, stonework, and concrete construction.",
      location: "Nakuru CBD",
      city: "Nakuru",
      hourlyRate: 750,
      rating: 5,
      totalJobs: 92,
      isVerified: true,
      phone: "+254 745 678 901",
      avatar: "/fundi-mason.jpg",
      certifications: ["UBARU Certified", "Safety Training"]
    },
    {
      id: 5,
      name: "Samuel Wanjala",
      serviceType: "Painter",
      description: "Professional painter for interior and exterior painting. Quality finish guaranteed.",
      location: "Milimani",
      city: "Nakuru",
      hourlyRate: 600,
      rating: 5,
      totalJobs: 78,
      isVerified: true,
      phone: "+254 756 789 012",
      avatar: "/fundi-painter.jpg",
      certifications: ["UBARU Certified", "Customer Service Training"]
    },
    {
      id: 6,
      name: "Michael Kamau",
      serviceType: "Mechanic",
      description: "Auto mechanic with expertise in all vehicle types. Diagnostics and repairs.",
      location: "Pipeline",
      city: "Nakuru",
      hourlyRate: 800,
      rating: 5,
      totalJobs: 134,
      isVerified: true,
      phone: "+254 767 890 123",
      avatar: "/fundi-mechanic.jpg",
      certifications: ["UBARU Certified", "Technical Excellence"]
    },
    {
      id: 7,
      name: "Joseph Mutua",
      serviceType: "Appliance Repair",
      description: "Expert in repairing fridges, washing machines, microwaves, and other home appliances.",
      location: "Nakuru CBD",
      city: "Nakuru",
      hourlyRate: 800,
      rating: 5,
      totalJobs: 67,
      isVerified: true,
      phone: "+254 778 901 234",
      avatar: "/fundi-appliance.jpg",
      certifications: ["UBARU Certified", "Customer Service Training"]
    },
    {
      id: 8,
      name: "Daniel Njoroge",
      serviceType: "CCTV Installation",
      description: "Professional CCTV and security camera installation. Remote monitoring setup.",
      location: "Milimani",
      city: "Nakuru",
      hourlyRate: 1200,
      rating: 5,
      totalJobs: 45,
      isVerified: true,
      phone: "+254 789 012 345",
      avatar: "/fundi-cctv.jpg",
      certifications: ["UBARU Certified", "Technical Training"]
    },
    {
      id: 9,
      name: "Patrick Omondi",
      serviceType: "WiFi Installation",
      description: "Network setup and WiFi installation expert. Fast and reliable internet solutions.",
      location: "Pipeline",
      city: "Nakuru",
      hourlyRate: 1000,
      rating: 5,
      totalJobs: 53,
      isVerified: true,
      phone: "+254 790 123 456",
      avatar: "/fundi-wifi.jpg",
      certifications: ["UBARU Certified", "Network Specialist"]
    },
    {
      id: 10,
      name: "Francis Kipchoge",
      serviceType: "General Handyman",
      description: "Jack of all trades. Minor repairs, installations, and maintenance work.",
      location: "Nakuru CBD",
      city: "Nakuru",
      hourlyRate: 600,
      rating: 4,
      totalJobs: 112,
      isVerified: true,
      phone: "+254 701 234 567",
      avatar: "/fundi-handyman.jpg",
      certifications: ["UBARU Certified", "Multi-skilled Professional"]
    },
    {
      id: 11,
      name: "Robert Kariuki",
      serviceType: "Cleaner",
      description: "Professional cleaning services for homes and offices. Deep cleaning specialist.",
      location: "Milimani",
      city: "Nakuru",
      hourlyRate: 500,
      rating: 5,
      totalJobs: 156,
      isVerified: true,
      phone: "+254 712 345 789",
      avatar: "/fundi-cleaner.jpg",
      certifications: ["UBARU Certified", "Hygiene Standards"]
    },
    {
      id: 12,
      name: "George Wekesa",
      serviceType: "Gardener",
      description: "Expert gardener for lawn maintenance, landscaping, and plant care.",
      location: "Pipeline",
      city: "Nakuru",
      hourlyRate: 500,
      rating: 5,
      totalJobs: 89,
      isVerified: true,
      phone: "+254 723 456 890",
      avatar: "/fundi-gardener.jpg",
      certifications: ["UBARU Certified", "Landscaping Specialist"]
    }
  ];

  // Filter fundis based on search and filters
  const filteredFundis = mockFundis.filter(fundi => {
    const matchesSearch = searchQuery === "" || 
      fundi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fundi.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fundi.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = serviceType === "all" || 
      fundi.serviceType.toLowerCase() === serviceType.toLowerCase();
    
    const matchesLocation = location === "all" || 
      fundi.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesService && matchesLocation;
  });

  const serviceTypeIcons: Record<string, string> = {
    plumber: "🔧",
    electrician: "⚡",
    carpenter: "🪚",
    mason: "🧱",
    painter: "🎨",
    cleaner: "🧹",
    gardener: "🌱",
    "security guard": "🛡️",
    driver: "🚗",
    mechanic: "🔩",
    "appliance repair": "🔌",
    "general handyman": "🛠️",
    "mama fua (laundry)": "👕",
    "cctv installation": "📹",
    "wifi installation": "📡",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section with Vetting Message */}
      <div className="bg-gradient-to-br from-card/80 to-card/50 border-b border-border/50 py-12">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">
              Find <span className="text-primary">Vetted & Trained</span> Service Providers
            </h1>
          </div>
          
          {/* Vetting Message */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold text-lg mb-2 text-primary">Why CONEKTA Fundis Are Better</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    All our service providers complete <strong>mandatory short courses</strong> covering:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>✓ <strong>Customer Service Excellence</strong> - Professional communication & respect</li>
                    <li>✓ <strong>Quality Standards</strong> - Best practices & workmanship</li>
                    <li>✓ <strong>Safety & Hygiene</strong> - Workplace safety protocols</li>
                    <li>✓ <strong>UBARU Verification</strong> - Background checks & identity verification</li>
                  </ul>
                  <p className="text-sm text-primary font-semibold mt-2">
                    🏆 Higher standards. Better service. Guaranteed professionalism.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                {serviceCategories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
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
              {filteredFundis.length} service provider{filteredFundis.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Fundis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFundis.map((fundi) => (
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
                        {serviceTypeIcons[fundi.serviceType.toLowerCase()]}
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

                  {/* Certifications Badge */}
                  {fundi.certifications && fundi.certifications.length > 0 && (
                    <div className="flex items-center gap-1 mb-3 text-xs">
                      <Award className="h-3 w-3 text-primary" />
                      <span className="text-primary font-semibold">Trained Professional</span>
                    </div>
                  )}

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
          {filteredFundis.length === 0 && (
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
