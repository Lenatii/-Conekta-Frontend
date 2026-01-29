import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, Award, FileCheck, Users, TrendingUp, Phone } from "lucide-react";

export default function TrustPage() {
  // Function to open chat widget and trigger verification flow
  const handleGetVerified = () => {
    // Find and click the chat widget button
    const chatButton = document.querySelector('[data-chat-toggle="true"]') as HTMLButtonElement;
    if (chatButton) {
      // Open chat if closed
      if (!chatButton.getAttribute('aria-expanded')) {
        chatButton.click();
      }
      
      // Wait for chat to open, then send "3" to select CONEKTA Trust option
      setTimeout(() => {
        // Find the input field and send button in the chat widget
        const chatInput = document.querySelector('input[placeholder*="Type"]') as HTMLInputElement;
        const sendButton = document.querySelector('[aria-label="Send message"]') as HTMLButtonElement;
        
        if (chatInput && sendButton) {
          // Set the value to "3" for CONEKTA Trust option
          chatInput.value = "3";
          // Trigger input event so React detects the change
          const event = new Event('input', { bubbles: true });
          chatInput.dispatchEvent(event);
          // Click send after a short delay
          setTimeout(() => sendButton.click(), 200);
        }
      }, 600);
    }
  };

  // Function to just open chat widget
  const handleOpenChat = () => {
    const chatButton = document.querySelector('[data-chat-toggle="true"]') as HTMLButtonElement;
    if (chatButton && !chatButton.getAttribute('aria-expanded')) {
      chatButton.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              CONEKTA <span className="text-primary">Trust</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get verified, build trust, and unlock premium opportunities across the CONEKTA ecosystem
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="gap-2" onClick={handleGetVerified}>
              <Shield className="h-5 w-5" />
              Get Verified Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              const section = document.getElementById('how-it-works');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}>
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* What is CONEKTA Trust */}
      <div className="py-16 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What is CONEKTA Trust?</h2>
            <p className="text-lg text-muted-foreground">
              CONEKTA Trust (powered by UBARU engine) is our comprehensive verification and certification system that validates your identity, skills, and professionalism. Get the blue checkmark that builds instant credibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <FileCheck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Identity Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Background checks, ID verification, and document validation to confirm your identity and legitimacy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Skills Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Professional training courses covering customer service, quality standards, and workplace safety.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Trust Badge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Display the CONEKTA Trust badge on your profile to stand out and attract more clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Get CONEKTA Trust Certified?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Higher Visibility</h3>
                <p className="text-muted-foreground">
                  Verified profiles appear first in search results and get featured placement across the platform.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">More Clients</h3>
                <p className="text-muted-foreground">
                  Clients trust verified providers 3x more. Get more inquiries and bookings with the trust badge.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Instant Credibility</h3>
                <p className="text-muted-foreground">
                  The blue checkmark tells clients you're legitimate, professional, and trustworthy at first glance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Professional Development</h3>
                <p className="text-muted-foreground">
                  Complete training courses and earn certifications that improve your skills and service quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Process */}
      <div id="how-it-works" className="py-16 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Submit Your Application</h3>
                  <p className="text-muted-foreground">
                    Chat with Mama Dennis AI or click "Get Verified" to start. Provide your ID, phone number, and basic information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Background Check & Verification</h3>
                  <p className="text-muted-foreground">
                    We verify your identity, check your documents, and conduct background screening (1-2 business days).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Complete Training Courses</h3>
                  <p className="text-muted-foreground">
                    Take mandatory short courses on customer service, quality standards, safety, and professionalism (2-3 hours total).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Get Your Trust Badge</h3>
                  <p className="text-muted-foreground">
                    Once approved, the CONEKTA Trust badge appears on your profile immediately. Start attracting more clients!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto text-center">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Get Verified?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of verified landlords, fundis, and hosts who have built trust and grown their business with CONEKTA Trust.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="gap-2" onClick={handleOpenChat}>
              <Phone className="h-5 w-5" />
              Chat with Mama Dennis
            </Button>
            <Link href="/fundis">
              <Button size="lg" variant="outline">
                Browse Verified Fundis
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
