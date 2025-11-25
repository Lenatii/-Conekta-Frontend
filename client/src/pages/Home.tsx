import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Home, Wrench, Hotel, Shield, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Digital OS for
            <br />
            <span className="text-primary">Rent • Services • Trust</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find verified properties, hire trusted fundis, and book short-stays—all powered by Mama Dennis AI
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search properties in Nakuru, Nairobi..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href={`/properties${searchQuery ? `?q=${searchQuery}` : ''}`}>
                <Button size="lg" className="h-12">
                  Search
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>UBARU Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">🔒</span>
              <span>Secure M-Pesa</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">💬</span>
              <span>WhatsApp First</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">🤖</span>
              <span>Mama Dennis AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore Our Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* RentConnect */}
            <Card className="border-2 border-border/50 hover:border-primary/50 transition-all group">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">RentConnect</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Find verified rental properties with virtual tours and secure payments
                  </p>
                </div>
                <Link href="/properties">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Explore Properties
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* KaziFlow */}
            <Card className="border-2 border-border/50 hover:border-primary/50 transition-all group">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">KaziFlow</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Hire verified fundis with background checks and ratings
                  </p>
                </div>
                <Link href="/fundis">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Find Fundis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Short-Stay */}
            <Card className="border-2 border-border/50 hover:border-primary/50 transition-all group">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Hotel className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Short-Stay</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Book instant stays with flexible dates and host protection
                  </p>
                </div>
                <Link href="/stays">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Book Stays
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* UBARU */}
            <Card className="border-2 border-border/50 hover:border-primary/50 transition-all group">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">UBARU</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get verified with KYC and background checks for trust
                  </p>
                </div>
                <Link href="/verify">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Get Certified
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-bold mb-2">Discover</h3>
              <p className="text-sm text-muted-foreground">
                Search properties, fundis, or stays with Mama Dennis AI
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-bold mb-2">Verify</h3>
              <p className="text-sm text-muted-foreground">
                Check UBARU badges and reviews for trust
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-bold mb-2">Book & Pay</h3>
              <p className="text-sm text-muted-foreground">
                Secure M-Pesa payments with Conekta-Pay protection
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="font-bold mb-2">Rate & Grow</h3>
              <p className="text-sm text-muted-foreground">
                Leave reviews and build your reputation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Kenyans finding homes, hiring fundis, and booking stays with CONEKTA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">
                Create Account
              </Button>
            </Link>
            <a href="https://wa.me/254797446155" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
