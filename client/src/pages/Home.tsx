import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, Home as HomeIcon, Wrench, Hotel, Shield, ArrowRight, 
  MessageCircle, Sparkles, Bot, ShieldCheck, Bed
} from "lucide-react";
import MamaDennisChatWidget from "@/components/MamaDennisChatWidget";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const whatsappNumber = "+254797446155";
  const whatsappMessage = "Hi, I'm interested in CONEKTA";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="fade-in-up">
              {/* Mama Dennis AI Badge - Clickable for future standalone UI */}
              <button
                onClick={() => {
                  // TODO: Link to Mama Dennis standalone UI when available
                  // For now, just show a message
                  alert('Mama Dennis standalone UI coming soon! For now, use the chat widget.');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/16 text-sm text-slate-200 mb-6 hover:border-teal-400/50 hover:bg-teal-500/10 transition-all cursor-pointer"
                style={{background: 'linear-gradient(90deg, rgba(124,92,255,.25), rgba(0,224,184,.25))'}}
              >
                <Sparkles className="w-4 h-4" />
                <span>Powered by Mama Dennis AI</span>
              </button>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                Your Digital OS for <span className="gradient-text">Rent • Services • Trust</span>
              </h1>
              
              <p className="text-slate-300 text-lg lg:text-xl leading-relaxed max-w-2xl mb-8">
                Find verified homes, hire trusted fundis, get CONEKTA Trust certified, and book short-stays — all in one platform. Built for Kenya & Africa with automation, accountability, and heart.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <a href="#modules">
                  <Button size="lg" className="rounded-xl px-6 py-4 text-lg font-bold text-black" style={{background: 'linear-gradient(90deg,#c9c5ff,#9ef7e8)'}}>
                    Explore Modules
                  </Button>
                </a>
                <a href="/signup">
                  <Button size="lg" variant="outline" className="rounded-xl px-6 py-4 glass text-white font-semibold text-lg border-white/12">
                    Get Started
                  </Button>
                </a>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-3 text-sm text-slate-400 flex-wrap">
                <div className="border border-white/12 rounded-full px-4 py-2 hover:bg-white/10 transition cursor-pointer">
                  🛡️ Conekta-Pay • CONEKTA Trust Certified
                </div>
                <div 
                  className="border border-white/12 rounded-full px-4 py-2 hover:bg-white/10 transition cursor-pointer relative group"
                  onClick={() => {
                    // Open chat widget instead
                    const chatButton = document.querySelector('[data-chat-toggle]') as HTMLButtonElement;
                    if (chatButton) chatButton.click();
                  }}
                >
                  💬 WhatsApp First
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    Coming soon! Use web chat
                  </span>
                </div>
                <div className="border border-white/12 rounded-full px-4 py-2 hover:bg-white/10 transition cursor-pointer">
                  📱 M-Pesa Ready
                </div>
              </div>
            </div>
            
            {/* Right: Module Preview Cards */}
            <div className="glass rounded-3xl p-8 float-animation" style={{position: 'relative', overflow: 'hidden'}}>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/properties">
                  <div className="rounded-2xl bg-white/5 p-6 border border-white/10 hover:bg-white/10 transition cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg">CONEKTA Rentals</h4>
                      <HomeIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-sm text-slate-300">Verified rentals with 360° tours</p>
                  </div>
                </Link>
                
                <Link href="/fundis">
                  <div className="rounded-2xl bg-white/5 p-6 border border-white/10 hover:bg-white/10 transition cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg">CONEKTA Fundis</h4>
                      <Wrench className="w-6 h-6 text-teal-400" />
                    </div>
                    <p className="text-sm text-slate-300">Hire vetted fundis safely</p>
                  </div>
                </Link>
                
                <Link href="/verify">
                  <div className="rounded-2xl bg-white/5 p-6 border border-white/10 hover:bg-white/10 transition cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg">CONEKTA Trust</h4>
                      <ShieldCheck className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-sm text-slate-300">Trust certification system</p>
                  </div>
                </Link>
                
                <Link href="/stays">
                  <div className="rounded-2xl bg-white/5 p-6 border border-white/10 hover:bg-white/10 transition cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg">CONEKTA Stays</h4>
                      <Bed className="w-6 h-6 text-teal-400" />
                    </div>
                    <p className="text-sm text-slate-300">Host & book stays easily</p>
                  </div>
                </Link>
              </div>
              
              <div className="mt-6 p-4 rounded-xl border border-white/10" style={{background: 'linear-gradient(90deg, rgba(124,92,255,.2), rgba(0,224,184,.2))'}}>
                <div className="flex items-center gap-3">
                  <Bot className="w-8 h-8 text-teal-400" />
                  <div>
                    <p className="font-bold text-white">Mama Dennis AI</p>
                    <p className="text-sm text-slate-300">Your Digital Guardian & CTO</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 border-t border-white/10">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-slate-300 text-lg">Simple steps from discovery to done — in chat or on web.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "1", title: "Discover", desc: "Browse rentals & services or say 'Hi' on WhatsApp" },
              { num: "2", title: "Verify", desc: "CONEKTA Trust checks owners & providers. See the badge." },
              { num: "3", title: "Book & Pay", desc: "Secure Conekta-Pay with M-Pesa. Funds on completion." },
              { num: "4", title: "Rate & Grow", desc: "Reviews build reputation. AI learns & optimizes." }
            ].map((step) => (
              <div key={step.num} className="glass rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'linear-gradient(135deg,#7c5cff,#00e0b8)'}}>
                  <span className="font-bold text-2xl">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-slate-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES SECTION */}
      <section id="modules" className="py-20 border-t border-white/10">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">All Modules Under One Roof</h2>
            <p className="text-slate-300 text-lg">Your complete Digital OS for rent, services, trust, and stays.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CONEKTA Rentals */}
            <Card className="glass rounded-2xl border-white/10 module-card">
              <CardContent className="p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">CONEKTA Rentals</h3>
                  <HomeIcon className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-sm text-slate-300 mb-4 flex-grow">
                  Browse verified property listings with 360° virtual tours, secure applications, and digital lease agreements.
                </p>
                <div className="text-xs text-slate-400 mb-4 p-3 rounded-lg bg-white/5">
                  ✓ 5% commission<br/>
                  ✓ Virtual tours<br/>
                  ✓ Conekta-Pay protection
                </div>
                <Link href="/properties">
                  <Button variant="ghost" className="mt-auto w-full justify-center gap-2 text-teal-400 hover:text-white font-semibold p-0 h-auto">
                    <span>Explore Properties</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* CONEKTA Fundis */}
            <Card className="glass rounded-2xl border-white/10 module-card">
              <CardContent className="p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">CONEKTA Fundis</h3>
                  <Wrench className="w-6 h-6 text-teal-400" />
                </div>
                <p className="text-sm text-slate-300 mb-4 flex-grow">
                  Hire vetted service providers (fundis) with confidence. Pay safely through Conekta-Pay and rate their work.
                </p>
                <div className="text-xs text-slate-400 mb-4 p-3 rounded-lg bg-white/5">
                  ✓ Background checks<br/>
                  ✓ Conekta-Pay payments<br/>
                  ✓ Rating system
                </div>
                <Link href="/fundis">
                  <Button variant="ghost" className="mt-auto w-full justify-center gap-2 text-teal-400 hover:text-white font-semibold p-0 h-auto">
                    <span>Find Fundis</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* CONEKTA Trust */}
            <Card className="glass rounded-2xl border-white/10 module-card">
              <CardContent className="p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">CONEKTA Trust</h3>
                  <ShieldCheck className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-sm text-slate-300 mb-4 flex-grow">
                  Trust certification system that verifies landlords, tenants, and service providers to reduce fraud.
                </p>
                <div className="text-xs text-slate-400 mb-4 p-3 rounded-lg bg-white/5">
                  ✓ KYC verification<br/>
                  ✓ Background checks<br/>
                  ✓ Trust scores
                </div>
                <Link href="/verify">
                  <Button variant="ghost" className="mt-auto w-full justify-center gap-2 text-teal-400 hover:text-white font-semibold p-0 h-auto">
                    <span>Get Certified</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* CONEKTA Stays */}
            <Card className="glass rounded-2xl border-white/10 module-card">
              <CardContent className="p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">CONEKTA Stays</h3>
                  <Bed className="w-6 h-6 text-teal-400" />
                </div>
                <p className="text-sm text-slate-300 mb-4 flex-grow">
                  Host your space or book verified short-term stays with secure payments and instant confirmations.
                </p>
                <div className="text-xs text-slate-400 mb-4 p-3 rounded-lg bg-white/5">
                  ✓ Instant booking<br/>
                  ✓ Host protection<br/>
                  ✓ Flexible stays
                </div>
                <Link href="/stays">
                  <Button variant="ghost" className="mt-auto w-full justify-center gap-2 text-teal-400 hover:text-white font-semibold p-0 h-auto">
                    <span>Book Stays</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="glass rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">Ready to get started?</h3>
              <p className="text-slate-300 text-lg">Let Mama Dennis guide you. Quick, human, effective.</p>
            </div>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="rounded-xl px-6 py-4 text-lg font-bold text-white inline-flex items-center gap-2 relative group" 
                style={{background: '#25D366'}}
                onClick={() => {
                  // Open chat widget instead
                  const chatButton = document.querySelector('[data-chat-toggle]') as HTMLButtonElement;
                  if (chatButton) chatButton.click();
                }}
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  Coming soon! Use web chat
                </span>
              </Button>
              <a href="mailto:hello@conekta.africa">
                <Button size="lg" variant="outline" className="rounded-xl px-6 py-4 glass text-white font-semibold text-lg border-white/12">
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MamaDennisChatWidget />
    </div>
  );
}
