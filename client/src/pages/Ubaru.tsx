import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, Users, FileCheck, Award } from "lucide-react";

export default function Ubaru() {
  const verificationSteps = [
    {
      icon: FileCheck,
      title: "Submit Documents",
      description: "Provide ID, proof of address, and relevant certificates",
    },
    {
      icon: Shield,
      title: "Background Check",
      description: "We verify your identity and check public records",
    },
    {
      icon: Award,
      title: "Get Certified",
      description: "Receive your UBARU badge and trust score",
    },
  ];

  const benefits = [
    {
      title: "For Landlords",
      items: [
        "Attract quality tenants",
        "Reduce fraud risk",
        "Faster property rentals",
        "Higher trust score",
      ],
    },
    {
      title: "For Tenants",
      items: [
        "Prove your credibility",
        "Access better properties",
        "Build rental history",
        "Secure deposits faster",
      ],
    },
    {
      title: "For Service Providers",
      items: [
        "Get more clients",
        "Command higher rates",
        "Build reputation",
        "Stand out from competition",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <Badge className="text-lg px-4 py-2">
                  <Shield className="h-5 w-5 mr-2" />
                  UBARU Trust Certification
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Build Trust. Reduce Fraud. Grow Faster.
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                UBARU verifies landlords, tenants, and service providers to create 
                a safer marketplace. Get certified and unlock better opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://wa.me/254797446155?text=Hi, I want to get UBARU certified">
                  <Button size="lg" style={{background: '#25D366'}}>
                    Get Verified on WhatsApp
                  </Button>
                </a>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How UBARU Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Simple 3-step verification process. Get certified in 24-48 hours.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {verificationSteps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Get UBARU Certified?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Unlock opportunities and build trust in the CONEKTA ecosystem
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {benefit.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Score */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Understanding Your Trust Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Your UBARU trust score is calculated based on:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Identity Verification</div>
                        <div className="text-sm text-muted-foreground">
                          Valid ID, proof of address, background check
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Transaction History</div>
                        <div className="text-sm text-muted-foreground">
                          Successful rentals, payments, and services completed
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Community Ratings</div>
                        <div className="text-sm text-muted-foreground">
                          Reviews and ratings from other verified users
                        </div>
                      </div>
                    </li>
                  </ul>

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2 text-amber-600">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        <strong>Note:</strong> Your trust score can increase or decrease 
                        based on your behavior in the platform. Maintain good standing 
                        by honoring commitments and treating others with respect.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Certified?</h2>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of verified users on CONEKTA. Build trust, reduce fraud, 
                  and unlock better opportunities.
                </p>
                <a href="https://wa.me/254797446155?text=Hi, I want to get UBARU certified">
                  <Button size="lg" variant="secondary">
                    Start Verification on WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
