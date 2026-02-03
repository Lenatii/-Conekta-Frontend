import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Shield, Phone, Briefcase, Award, GraduationCap, Circle, Navigation } from "lucide-react";
import { calculateDistance, formatDistance, getUserLocation } from "@/lib/geoUtils";

// Direct API call to backend instead of tRPC (for static hosting compatibility)
const BACKEND_API_URL = "https://conekta-complete-system.onrender.com";

// Mock fundis data as fallback
const MOCK_FUNDIS = [
  {
    id: 1,
    name: "John Mwangi",
    serviceType: "Plumber",
    description: "Expert plumber with 8+ years experience. Specializing in residential and commercial plumbing installations and repairs.",
    location: "Nakuru CBD",
    city: "Nakuru",
    hourlyRate: 800,
    rating: 5,
    totalJobs: 127,
    isVerified: true,
    isAvailable: true,
    phone: "+254712345678",
    avatar: "/fundi-placeholder.jpg",
    certifications: ["CONEKTA Trust Certified", "Customer Service Training"],
    latitude: -0.3031,
    longitude: 36.0800
  },
  {
    id: 2,
    name: "Peter Ochieng",
    serviceType: "Electrician",
    description: "Licensed electrician offering quality electrical installations, repairs, and maintenance services.",
    location: "Milimani",
    city: "Nakuru",
    hourlyRate: 900,
    rating: 5,
    totalJobs: 98,
    isVerified: true,
    isAvailable: true,
    phone: "+254723456789",
    avatar: "/fundi-placeholder.jpg",
    certifications: ["CONEKTA Trust Certified", "Customer Service Training"],
    latitude: -0.2827,
    longitude: 36.0667
  },
  {
    id: 3,
    name: "David Kimani",
    serviceType: "Carpenter",
    description: "Professional carpenter specializing in custom furniture, kitchen cabinets, and home renovations.",
    location: "Pipeline",
    city: "Nakuru",
    hourlyRate: 750,
    rating: 5,
    totalJobs: 84,
    isVerified: true,
    isAvailable: false,
    phone: "+254734567890",
    avatar: "/fundi-placeholder.jpg",
    certifications: ["CONEKTA Trust Certified", "Customer Service Training"],
    latitude: -0.3176,
    longitude: 36.0965
  }
];

export default function FundisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [location, setLocation] = useState("all");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [fundis, setFundis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user location on mount
  useEffect(() => {
    getUserLocation().then((loc) => {
      if (loc) {
        console.log('[Fundis] Got user location:', loc);
        setUserLocation(loc);
      }
    });
  }, []);

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

  // Fetch fundis from backend API
  useEffect(() => {
    const fetchFundis = async () => {
      setIsLoading(true);
      try {
        console.log('[Fundis] Fetching from:', `${BACKEND_API_URL}/api/fundis/search`);
        const response = await fetch(`${BACKEND_API_URL}/api/fundis/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: serviceType === "all" ? undefined : serviceType,
            online_only: showOnlineOnly,
            location: location === "all" ? undefined : location,
          }),
        });
        
        console.log('[Fundis] Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[Fundis] API error response:', errorText);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[Fundis] Got response:', data);
        
        // Transform backend data to match frontend format
        const transformedFundis = (data.fundis || []).map((service: any) => ({
          id: service.id,
          name: service.provider?.name || "Unknown Provider",
          serviceType: service.category,
          description: service.description || service.title,
          location: service.location,
          city: service.town || service.county || "Nakuru",
          hourlyRate: service.rate,
          rating: service.rating_avg || 5,
          totalJobs: service.jobs_completed || 0,
          isVerified: service.verified || false,
          phone: service.provider?.phone || "",
          avatar: service.provider?.avatar || "/fundi-placeholder.jpg",
          certifications: service.verified ? ["CONEKTA Trust Certified", "Customer Service Training"] : [],
          latitude: service.latitude || service.lat,
          longitude: service.longitude || service.lng
        }));
        
        // Use backend data if available, otherwise use mock data
        if (transformedFundis.length > 0) {
          console.log('[Fundis] Using backend data:', transformedFundis.length, 'fundis');
          setFundis(transformedFundis);
        } else {
          console.log('[Fundis] Backend returned no data, using mock fallback');
          setFundis(MOCK_FUNDIS);
        }
      } catch (error) {
        console.error('[Fundis] API error, using mock data fallback:', error);
        setFundis(MOCK_FUNDIS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFundis();
  }, [serviceType, location, showOnlineOnly]);

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
                    <li>✓ <strong>CONEKTA Trust Verification</strong> - Background checks & identity verification</li>
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

          {/* Online Now Filter */}
          <div className="max-w-4xl mx-auto mt-4 flex items-center justify-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium flex items-center gap-1">
                <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                Show Online Now Only
              </span>
            </label>
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
                        <div className="flex gap-1">
                          {fundi.isAvailable && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                              <Circle className="h-2 w-2 fill-green-500 text-green-500 mr-1" />
                              Online
                            </Badge>
                          )}
                          {fundi.isVerified && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              <Shield className="h-3 w-3 mr-1" />
                              CONEKTA Trust
                            </Badge>
                          )}
                        </div>
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
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {fundi.location}
                      </div>
                      {userLocation && fundi.latitude && fundi.longitude && (
                        <div className="flex items-center text-xs text-primary font-semibold">
                          <Navigation className="h-3 w-3 mr-1" />
                          {formatDistance(calculateDistance(userLocation.lat, userLocation.lng, fundi.latitude, fundi.longitude))}
                        </div>
                      )}
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
                      <Link href={`/fundis/${fundi.id}#contact`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Contact
                      </Link>
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
