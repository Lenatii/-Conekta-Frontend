import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Shield, Phone, Briefcase, Award, GraduationCap } from "lucide-react";
// import { trpc } from "@/lib/trpc";

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

  // Fetch fundis from backend API directly
  const [fundisData, setFundisData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFundis = async () => {
      try {
        const params = new URLSearchParams();
        if (serviceType !== "all") params.append("category", serviceType);
        if (location !== "all") params.append("location", location);
        
        const response = await fetch(
          `https://conekta-complete-system.onrender.com/api/services/search?${params}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setFundisData(data.services || []);
        } else {
          setFundisData([]);
        }
      } catch (error) {
        console.error("Failed to fetch fundis:", error);
        setFundisData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFundis();
  }, [serviceType, location]);

  // Transform backend data to match frontend format
  const fundis = (fundisData || []).map((service: any) => ({
    id: service.id,
    name: service.provider?.name || "Unknown Provider",
    serviceType: service.category,
    description: service.description || service.title,
    location: service.location,
    city: service.town || service.county || "Nakuru",
    hourlyRate: service.rate,
    rating: service.rating_avg || 0,
    totalJobs: service.jobs_completed || 0,
    isVerified: service.verified || false,
    phone: service.provider?.phone || "",
    avatar: service.provider?.avatar || "/fundi-placeholder.jpg",
    certifications: service.verified ? ["UBARU Certified", "Customer Service Training"] : []
  }));

  // Filter fundis based on search query
  const filteredFundis = fundis.filter((fundi: any) => {
    const matchesSearch = searchQuery === "" || 
      fundi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fundi.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fundi.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
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

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading service providers...</p>
            </div>
          )}

          {/* Fundis Grid */}
          {!isLoading && (
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
          )}

          {/* Empty State */}
          {!isLoading && filteredFundis.length === 0 && (
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
